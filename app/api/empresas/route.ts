import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET - Listar empresas (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de filtro
    const search = searchParams.get('search')
    const ramo_id = searchParams.get('ramo_id')
    const porte_id = searchParams.get('porte_id')
    const cidade = searchParams.get('cidade')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = createAdminClient()

    // Construir query
    let query = supabase
      .from('empresas')
      .select(`
        *,
        ramos_atuacao:ramo_atuacao_id (
          id,
          nome
        ),
        portes_empresa:porte_id (
          id,
          nome
        )
      `, { count: 'exact' })
      .eq('status', 'ativa')
      .order('nome_fantasia', { ascending: true })

    // Aplicar filtros
    if (search) {
      query = query.or(`nome_fantasia.ilike.%${search}%,razao_social.ilike.%${search}%`)
    }
    if (ramo_id) {
      query = query.eq('ramo_atuacao_id', ramo_id)
    }
    if (porte_id) {
      query = query.eq('porte_id', porte_id)
    }
    if (cidade) {
      query = query.ilike('cidade', `%${cidade}%`)
    }

    // Paginação
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao listar empresas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar empresas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      empresas: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao listar empresas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Cadastrar empresa
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
        { error: 'Apenas usuários do tipo empresa podem cadastrar empresas' },
        { status: 403 }
      )
    }

    // Verificar se já tem empresa cadastrada
    const { data: empresaExistente } = await supabase
      .from('empresas')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (empresaExistente) {
      return NextResponse.json(
        { error: 'Você já possui uma empresa cadastrada' },
        { status: 409 }
      )
    }

    const body = await request.json()
    const {
      razao_social,
      nome_fantasia,
      cnpj,
      email,
      telefone,
      site_url,
      descricao,
      logo_url,
      banner_url,
      ramo_atuacao_id,
      porte_id,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    } = body

    // Validações
    if (!razao_social || !nome_fantasia || !cnpj) {
      return NextResponse.json(
        { error: 'Razão social, nome fantasia e CNPJ são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar empresa
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .insert({
        user_id: user.id,
        razao_social,
        nome_fantasia,
        cnpj: cnpj.replace(/\D/g, ''),
        email,
        telefone: telefone?.replace(/\D/g, ''),
        site_url,
        descricao,
        logo_url,
        banner_url,
        ramo_atuacao_id,
        porte_id,
        cep: cep?.replace(/\D/g, ''),
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        status: 'ativa'
      })
      .select()
      .single()

    if (empresaError) {
      console.error('Erro ao criar empresa:', empresaError)
      
      if (empresaError.message.includes('duplicate key') && empresaError.message.includes('cnpj')) {
        return NextResponse.json(
          { error: 'Este CNPJ já está cadastrado' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Erro ao criar empresa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Empresa cadastrada com sucesso',
      empresa
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar empresa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
