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
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erro ao buscar candidatos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar candidatos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      candidatos: data || [],
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do candidato é obrigatório' },
        { status: 400 }
      )
    }

    // Remover campos que não devem ser atualizados
    delete updateData.created_at
    delete updateData.user_id

    const { data, error } = await supabase
      .from('candidatos')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar candidato:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar candidato' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      candidato: data
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
 * Desativa um candidato (soft delete)
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

    // Soft delete - apenas desativa o candidato
    const { error } = await supabase
      .from('candidatos')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar candidato:', error)
      return NextResponse.json(
        { error: 'Erro ao desativar candidato' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Candidato desativado com sucesso'
    })

  } catch (error) {
    console.error('Erro na API de candidatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
