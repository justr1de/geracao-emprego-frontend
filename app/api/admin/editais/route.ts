import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Configuração do Supabase não encontrada' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('editais')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`titulo.ilike.%${search}%,numero_edital.ilike.%${search}%`)
    }

    const { data: editais, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      editais: editais || [],
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Erro ao buscar editais:', error)
    return NextResponse.json({ error: 'Erro ao buscar editais' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Configuração do Supabase não encontrada' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()

    const { data, error } = await supabase
      .from('editais')
      .insert([{
        numero_edital: body.numero_edital,
        titulo: body.titulo,
        descricao_completa: body.descricao_completa,
        data_inicio_inscricoes: body.data_inicio_inscricoes,
        data_fim_inscricoes: body.data_fim_inscricoes,
        status_id: body.status_id || 1
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, edital: data?.[0] })
  } catch (error) {
    console.error('Erro ao criar edital:', error)
    return NextResponse.json({ error: 'Erro ao criar edital' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Configuração do Supabase não encontrada' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()

    const { data, error } = await supabase
      .from('editais')
      .update({
        numero_edital: body.numero_edital,
        titulo: body.titulo,
        descricao_completa: body.descricao_completa,
        data_inicio_inscricoes: body.data_inicio_inscricoes,
        data_fim_inscricoes: body.data_fim_inscricoes,
        status_id: body.status_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, edital: data?.[0] })
  } catch (error) {
    console.error('Erro ao atualizar edital:', error)
    return NextResponse.json({ error: 'Erro ao atualizar edital' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Configuração do Supabase não encontrada' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do edital não fornecido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('editais')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir edital:', error)
    return NextResponse.json({ error: 'Erro ao excluir edital' }, { status: 500 })
  }
}
