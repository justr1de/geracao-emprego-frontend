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
      .from('cursos')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`nome_curso.ilike.%${search}%,descricao_curso.ilike.%${search}%`)
    }

    const { data: cursos, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Buscar áreas para exibir nome
    const { data: areas } = await supabase
      .from('areas_vaga')
      .select('id, nome')

    const areasMap = new Map(areas?.map(a => [a.id, a.nome]) || [])

    const cursosComArea = cursos?.map(curso => ({
      ...curso,
      area_nome: areasMap.get(curso.area_id) || 'Não definida'
    }))

    return NextResponse.json({
      cursos: cursosComArea,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Erro ao buscar cursos:', error)
    return NextResponse.json({ error: 'Erro ao buscar cursos' }, { status: 500 })
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
      .from('cursos')
      .insert([{
        nome_curso: body.nome_curso,
        descricao_curso: body.descricao_curso,
        o_que_aprendera: body.o_que_aprendera,
        requisitos: body.requisitos,
        publico_alvo: body.publico_alvo,
        carga_horaria_horas: body.carga_horaria_horas,
        area_id: body.area_id
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, curso: data?.[0] })
  } catch (error) {
    console.error('Erro ao criar curso:', error)
    return NextResponse.json({ error: 'Erro ao criar curso' }, { status: 500 })
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
      .from('cursos')
      .update({
        nome_curso: body.nome_curso,
        descricao_curso: body.descricao_curso,
        o_que_aprendera: body.o_que_aprendera,
        requisitos: body.requisitos,
        publico_alvo: body.publico_alvo,
        carga_horaria_horas: body.carga_horaria_horas,
        area_id: body.area_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, curso: data?.[0] })
  } catch (error) {
    console.error('Erro ao atualizar curso:', error)
    return NextResponse.json({ error: 'Erro ao atualizar curso' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID do curso não fornecido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir curso:', error)
    return NextResponse.json({ error: 'Erro ao excluir curso' }, { status: 500 })
  }
}
