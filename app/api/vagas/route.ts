import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = createAdminClient()

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
        )
      `, { count: 'exact' })
      .eq('status', 'ativa')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descricao.ilike.%${search}%`)
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

    // Paginação
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao listar vagas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar vagas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      vagas: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao listar vagas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
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
