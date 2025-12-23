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

    // Aplicar busca se fornecida (usando campo 'cargo' que existe na tabela)
    if (search) {
      query = query.or(`cargo.ilike.%${search}%,descricao.ilike.%${search}%`)
    }

    // Filtrar por status se fornecido
    if (status) {
      // Mapear status string para status_id
      const statusMap: Record<string, number> = {
        'aberta': 1,
        'pausada': 2,
        'encerrada': 3,
        'inativa': 4
      }
      if (statusMap[status]) {
        query = query.eq('status_id', statusMap[status])
      }
    }

    // Aplicar paginação
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erro ao buscar vagas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar vagas: ' + error.message },
        { status: 500 }
      )
    }

    // Mapear status_id para string
    const statusNames: Record<number, string> = {
      1: 'aberta',
      2: 'pausada',
      3: 'encerrada',
      4: 'inativa'
    }

    // Mapear os dados para o formato esperado pelo frontend
    const vagas = (data || []).map(v => ({
      ...v,
      titulo: v.cargo,
      status: statusNames[v.status_id] || 'pendente'
    }))

    return NextResponse.json({
      vagas,
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
    const { id, titulo, status, empresas, ...rest } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID da vaga é obrigatório' },
        { status: 400 }
      )
    }

    // Mapear status string para status_id
    const statusMap: Record<string, number> = {
      'aberta': 1,
      'pausada': 2,
      'encerrada': 3,
      'inativa': 4
    }

    const updateData: Record<string, any> = {
      cargo: titulo || rest.cargo,
      descricao: rest.descricao,
      beneficios: rest.beneficios,
      salario_min: rest.salario_min,
      salario_max: rest.salario_max,
      quantidade_vagas: rest.quantidade_vagas,
      updated_at: new Date().toISOString()
    }

    if (status && statusMap[status]) {
      updateData.status_id = statusMap[status]
    }

    // Remover campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data, error } = await supabase
      .from('vagas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar vaga:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar vaga: ' + error.message },
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

    // Soft delete - muda o status_id para inativa (4)
    const { error } = await supabase
      .from('vagas')
      .update({ 
        status_id: 4,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar vaga:', error)
      return NextResponse.json(
        { error: 'Erro ao desativar vaga: ' + error.message },
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
