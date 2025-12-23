import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/candidatos
 * Lista todos os candidatos com busca e paginação
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('candidatos')
      .select('*', { count: 'exact' })

    // Aplicar busca se fornecida
    if (search) {
      query = query.or(`nome_completo.ilike.%${search}%,cpf.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`)
    }

    // Aplicar paginação
    const { data, error, count } = await query
      .order('nome_completo', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erro ao buscar candidatos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar candidatos: ' + error.message },
        { status: 500 }
      )
    }

    // Mapear os dados para incluir id como user_id
    const candidatos = (data || []).map(c => ({
      ...c,
      id: c.user_id, // Usar user_id como id
      is_active: true // Assumir ativo por padrão
    }))

    return NextResponse.json({
      candidatos,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })

  } catch (error) {
    console.error('Erro na API de candidatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/candidatos
 * Atualiza um candidato
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, user_id, ...updateData } = body

    const candidatoId = user_id || id

    if (!candidatoId) {
      return NextResponse.json(
        { error: 'ID do candidato é obrigatório' },
        { status: 400 }
      )
    }

    // Remover campos que não existem na tabela
    delete updateData.created_at
    delete updateData.updated_at
    delete updateData.is_active

    const { data, error } = await supabase
      .from('candidatos')
      .update(updateData)
      .eq('user_id', candidatoId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar candidato:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar candidato: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      candidato: { ...data, id: data.user_id }
    })

  } catch (error) {
    console.error('Erro na API de candidatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/candidatos
 * Remove um candidato
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do candidato é obrigatório' },
        { status: 400 }
      )
    }

    // Deletar o candidato
    const { error } = await supabase
      .from('candidatos')
      .delete()
      .eq('user_id', id)

    if (error) {
      console.error('Erro ao remover candidato:', error)
      return NextResponse.json(
        { error: 'Erro ao remover candidato: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Candidato removido com sucesso'
    })

  } catch (error) {
    console.error('Erro na API de candidatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
