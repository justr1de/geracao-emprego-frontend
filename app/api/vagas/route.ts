import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Listar vagas (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de filtro
    const search = searchParams.get('search')
    const area_id = searchParams.get('area_id')
    const cidade = searchParams.get('cidade')
    const tipo_contrato_id = searchParams.get('tipo_contrato_id')
    const modelo_trabalho_id = searchParams.get('modelo_trabalho_id')
    const empresa_id = searchParams.get('empresa_id')
    const salario_min = searchParams.get('salario_min')
    const salario_max = searchParams.get('salario_max')
    const escolaridade_id = searchParams.get('escolaridade_id')
    const sort_by = searchParams.get('sort_by') || 'created_at'
    const sort_order = searchParams.get('sort_order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Usar cliente normal (vagas são públicas)
    const supabase = await createClient()

    // Construir query
    let query = supabase
      .from('vagas')
      .select(`
        *,
        empresas:empresa_id (
          id,
          nome_fantasia,
          razao_social,
          logo_url,
          cidade,
          estado
        ),
        areas_vaga:area_id (
          id,
          nome
        ),
        tipos_contrato:tipo_contrato_id (
          id,
          nome
        ),
        modelos_trabalho:modelo_trabalho_id (
          id,
          nome
        ),
        niveis_escolaridade:escolaridade_minima_id (
          id,
          nome
        )
      `, { count: 'exact' })
      .eq('status_id', 1)

    // Aplicar filtros
    if (search) {
      query = query.or(`cargo.ilike.%${search}%,descricao.ilike.%${search}%`)
    }
    if (area_id) {
      query = query.eq('area_id', area_id)
    }
    if (cidade) {
      query = query.ilike('cidade', `%${cidade}%`)
    }
    if (tipo_contrato_id) {
      query = query.eq('tipo_contrato_id', tipo_contrato_id)
    }
    if (modelo_trabalho_id) {
      query = query.eq('modelo_trabalho_id', modelo_trabalho_id)
    }
    if (empresa_id) {
      query = query.eq('empresa_id', empresa_id)
    }
    if (salario_min) {
      query = query.gte('salario_min', parseFloat(salario_min))
    }
    if (salario_max) {
      query = query.lte('salario_max', parseFloat(salario_max))
    }
    if (escolaridade_id) {
      query = query.eq('escolaridade_minima_id', escolaridade_id)
    }

    // Ordenação
    const validSortFields = ['created_at', 'salario_min', 'salario_max', 'cargo']
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at'
    const ascending = sort_order === 'asc'
    query = query.order(sortField, { ascending })

    // Paginação
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao listar vagas:', error)
      // Retornar array vazio em vez de erro para não quebrar a UI
      return NextResponse.json({
        vagas: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        error: 'Erro ao buscar vagas'
      })
    }

    return NextResponse.json({
      vagas: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao listar vagas:', error)
    // Retornar array vazio em vez de erro 500
    return NextResponse.json({
      vagas: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      },
      error: 'Erro interno do servidor'
    })
  }
}

// POST - Criar nova vaga (autenticado - empresa)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se é empresa
    if (user.user_metadata?.tipo_usuario !== 2) {
      return NextResponse.json(
        { error: 'Apenas empresas podem publicar vagas' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      titulo,
      descricao,
      requisitos,
      beneficios,
      salario_min,
      salario_max,
      tipo_contrato_id,
      modelo_trabalho_id,
      area_id,
      cidade,
      estado,
      quantidade_vagas,
      data_expiracao
    } = body

    // Validações
    if (!titulo || !descricao) {
      return NextResponse.json(
        { error: 'Título e descrição são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar empresa do usuário
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (empresaError || !empresa) {
      return NextResponse.json(
        { error: 'Empresa não encontrada para este usuário' },
        { status: 404 }
      )
    }

    // Criar vaga
    const { data: vaga, error: vagaError } = await supabase
      .from('vagas')
      .insert({
        empresa_id: empresa.id,
        titulo,
        descricao,
        requisitos,
        beneficios,
        salario_min,
        salario_max,
        tipo_contrato_id,
        modelo_trabalho_id,
        area_id,
        cidade,
        estado,
        quantidade_vagas: quantidade_vagas || 1,
        data_expiracao,
        status: 'ativa',
        user_id_criador: user.id
      })
      .select()
      .single()

    if (vagaError) {
      console.error('Erro ao criar vaga:', vagaError)
      return NextResponse.json(
        { error: 'Erro ao criar vaga' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Vaga criada com sucesso',
      vaga
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar vaga:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
