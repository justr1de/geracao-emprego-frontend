import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/empresas
 * Lista todas as empresas com busca, paginação, filtros e vagas relacionadas
 * Query params:
 * - search: busca por razão social, nome fantasia, CNPJ ou email
 * - cidade: filtrar por cidade
 * - ramo_atividade: filtrar por área de atuação/ramo de atividade
 * - page: página atual (default: 1)
 * - limit: itens por página (default: 10)
 * - includeVagas: incluir vagas da empresa (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const cidade = searchParams.get('cidade') || ''
    const ramoAtividade = searchParams.get('ramo_atividade') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const includeVagas = searchParams.get('includeVagas') === 'true'
    const getCidades = searchParams.get('getCidades') === 'true'
    const getRamos = searchParams.get('getRamos') === 'true'
    const offset = (page - 1) * limit

    // Se solicitado, retornar lista de cidades únicas
    if (getCidades) {
      const { data: cidadesData, error: cidadesError } = await supabase
        .from('empresas')
        .select('cidade')
        .not('cidade', 'is', null)
        .order('cidade')

      if (cidadesError) {
        console.error('Erro ao buscar cidades:', cidadesError)
        return NextResponse.json({ cidades: [] })
      }

      // Extrair cidades únicas
      const cidadesUnicas = [...new Set(cidadesData?.map(e => e.cidade).filter(Boolean))]
      return NextResponse.json({ cidades: cidadesUnicas })
    }

    // Se solicitado, retornar lista de ramos de atividade únicos
    if (getRamos) {
      const { data: ramosData, error: ramosError } = await supabase
        .from('empresas')
        .select('ramo_atividade')
        .not('ramo_atividade', 'is', null)
        .order('ramo_atividade')

      if (ramosError) {
        console.error('Erro ao buscar ramos:', ramosError)
        return NextResponse.json({ ramos: [] })
      }

      // Extrair ramos únicos
      const ramosUnicos = [...new Set(ramosData?.map(e => e.ramo_atividade).filter(Boolean))]
      return NextResponse.json({ ramos: ramosUnicos })
    }

    let query = supabase
      .from('empresas')
      .select('*', { count: 'exact' })

    // Aplicar busca se fornecida
    if (search) {
      query = query.or(`razao_social.ilike.%${search}%,nome_fantasia.ilike.%${search}%,cnpj.ilike.%${search}%,email_contato.ilike.%${search}%`)
    }

    // Aplicar filtro por cidade
    if (cidade) {
      query = query.eq('cidade', cidade)
    }

    // Aplicar filtro por ramo de atividade
    if (ramoAtividade) {
      query = query.eq('ramo_atividade', ramoAtividade)
    }

    // Aplicar paginação
    const { data: empresas, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erro ao buscar empresas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar empresas' },
        { status: 500 }
      )
    }

    // Se includeVagas for true, buscar vagas de cada empresa
    let empresasComVagas = empresas || []
    
    if (includeVagas && empresas && empresas.length > 0) {
      const empresaIds = empresas.map(e => e.id)
      
      // Buscar vagas das empresas - usando apenas campos que existem na tabela
      const { data: vagas, error: vagasError } = await supabase
        .from('vagas')
        .select(`
          id,
          cargo,
          descricao,
          salario_min,
          salario_max,
          quantidade_vagas,
          beneficios,
          status_id,
          empresa_id,
          created_at,
          area_id,
          horario_trabalho,
          vaga_pcd
        `)
        .in('empresa_id', empresaIds)
        .order('created_at', { ascending: false })

      if (vagasError) {
        console.error('Erro ao buscar vagas:', vagasError)
      }

      if (!vagasError && vagas) {
        // Mapear status_id para string
        const statusNames: Record<number, string> = {
          1: 'Aberta',
          2: 'Pausada',
          3: 'Encerrada',
          4: 'Inativa'
        }

        // Agrupar vagas por empresa
        const vagasPorEmpresa: Record<string, any[]> = {}
        vagas.forEach(vaga => {
          if (!vagasPorEmpresa[vaga.empresa_id]) {
            vagasPorEmpresa[vaga.empresa_id] = []
          }
          vagasPorEmpresa[vaga.empresa_id].push({
            ...vaga,
            status: statusNames[vaga.status_id] || 'Pendente'
          })
        })

        // Adicionar vagas às empresas
        empresasComVagas = empresas.map(empresa => ({
          ...empresa,
          vagas: vagasPorEmpresa[empresa.id] || [],
          totalVagas: (vagasPorEmpresa[empresa.id] || []).length,
          vagasAbertas: (vagasPorEmpresa[empresa.id] || []).filter(v => v.status_id === 1).length
        }))
      }
    }

    return NextResponse.json({
      empresas: empresasComVagas,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })

  } catch (error) {
    console.error('Erro na API de empresas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/empresas
 * Atualiza uma empresa
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID da empresa é obrigatório' },
        { status: 400 }
      )
    }

    // Remover campos que não devem ser atualizados
    delete updateData.created_at
    delete updateData.vagas
    delete updateData.totalVagas
    delete updateData.vagasAbertas

    const { data, error } = await supabase
      .from('empresas')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar empresa:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar empresa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      empresa: data
    })

  } catch (error) {
    console.error('Erro na API de empresas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/empresas
 * Desativa uma empresa (soft delete)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da empresa é obrigatório' },
        { status: 400 }
      )
    }

    // Soft delete - apenas desativa a empresa
    const { error } = await supabase
      .from('empresas')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar empresa:', error)
      return NextResponse.json(
        { error: 'Erro ao desativar empresa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Empresa desativada com sucesso'
    })

  } catch (error) {
    console.error('Erro na API de empresas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
