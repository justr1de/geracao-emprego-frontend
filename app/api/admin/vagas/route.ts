import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/vagas
 * Lista todas as vagas com busca e paginação
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const offset = (page - 1) * limit

    let query = supabase
      .from('vagas')
      .select(`
        *,
        empresas:empresa_id (
          id,
          razao_social,
          nome_fantasia
        )
      `, { count: 'exact' })

    // Aplicar busca se fornecida
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descricao.ilike.%${search}%,cidade.ilike.%${search}%`)
    }

    // Filtrar por status se fornecido
    if (status) {
      query = query.eq('status', status)
    }

    // Aplicar paginação
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erro ao buscar vagas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar vagas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      vagas: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })

  } catch (error) {
    console.error('Erro na API de vagas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/vagas
 * Atualiza uma vaga
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID da vaga é obrigatório' },
        { status: 400 }
      )
    }

    // Remover campos que não devem ser atualizados
    delete updateData.created_at
    delete updateData.empresas

    const { data, error } = await supabase
      .from('vagas')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar vaga:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar vaga' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      vaga: data
    })

  } catch (error) {
    console.error('Erro na API de vagas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/vagas
 * Desativa uma vaga (soft delete)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da vaga é obrigatório' },
        { status: 400 }
      )
    }

    // Soft delete - muda o status para inativa
    const { error } = await supabase
      .from('vagas')
      .update({ 
        status: 'inativa',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar vaga:', error)
      return NextResponse.json(
        { error: 'Erro ao desativar vaga' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Vaga desativada com sucesso'
    })

  } catch (error) {
    console.error('Erro na API de vagas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
