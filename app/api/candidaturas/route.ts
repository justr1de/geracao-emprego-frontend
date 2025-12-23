import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Listar candidaturas do usuário
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const tipoUsuario = user.user_metadata?.tipo_usuario

    if (tipoUsuario === 1) {
      // Candidato - listar suas candidaturas
      const { data: candidato } = await supabase
        .from('candidatos')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!candidato) {
        return NextResponse.json({ candidaturas: [] })
      }

      const { data: candidaturas, error } = await supabase
        .from('candidaturas')
        .select(`
          *,
          vagas:vaga_id (
            id,
            titulo,
            cidade,
            estado,
            empresas:empresa_id (
              id,
              nome_fantasia,
              logo_url
            )
          ),
          status_candidatura:status_id (
            id,
            nome
          )
        `)
        .eq('candidato_id', candidato.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao listar candidaturas:', error)
        return NextResponse.json(
          { error: 'Erro ao buscar candidaturas' },
          { status: 500 }
        )
      }

      return NextResponse.json({ candidaturas })

    } else if (tipoUsuario === 2) {
      // Empresa - listar candidaturas às suas vagas
      const vaga_id = searchParams.get('vaga_id')
      
      const { data: empresa } = await supabase
        .from('empresas')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!empresa) {
        return NextResponse.json({ candidaturas: [] })
      }

      let query = supabase
        .from('candidaturas')
        .select(`
          *,
          candidatos:candidato_id (
            id,
            nome_completo,
            email,
            telefone,
            cidade,
            estado
          ),
          vagas:vaga_id (
            id,
            titulo
          ),
          status_candidatura:status_id (
            id,
            nome
          )
        `)
        .order('created_at', { ascending: false })

      // Filtrar por vagas da empresa
      const { data: vagasEmpresa } = await supabase
        .from('vagas')
        .select('id')
        .eq('empresa_id', empresa.id)

      if (!vagasEmpresa || vagasEmpresa.length === 0) {
        return NextResponse.json({ candidaturas: [] })
      }

      const vagaIds = vagasEmpresa.map(v => v.id)
      query = query.in('vaga_id', vagaIds)

      if (vaga_id) {
        query = query.eq('vaga_id', vaga_id)
      }

      const { data: candidaturas, error } = await query

      if (error) {
        console.error('Erro ao listar candidaturas:', error)
        return NextResponse.json(
          { error: 'Erro ao buscar candidaturas' },
          { status: 500 }
        )
      }

      return NextResponse.json({ candidaturas })
    }

    return NextResponse.json({ candidaturas: [] })

  } catch (error) {
    console.error('Erro ao listar candidaturas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar candidatura (candidato)
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

    // Verificar se é candidato
    if (user.user_metadata?.tipo_usuario !== 1) {
      return NextResponse.json(
        { error: 'Apenas candidatos podem se candidatar a vagas' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { vaga_id, carta_apresentacao } = body

    if (!vaga_id) {
      return NextResponse.json(
        { error: 'ID da vaga é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar candidato
    const { data: candidato, error: candidatoError } = await supabase
      .from('candidatos')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (candidatoError || !candidato) {
      return NextResponse.json(
        { error: 'Perfil de candidato não encontrado. Complete seu cadastro.' },
        { status: 404 }
      )
    }

    // Verificar se a vaga existe e está ativa
    const { data: vaga, error: vagaError } = await supabase
      .from('vagas')
      .select('id, status')
      .eq('id', vaga_id)
      .single()

    if (vagaError || !vaga) {
      return NextResponse.json(
        { error: 'Vaga não encontrada' },
        { status: 404 }
      )
    }

    if (vaga.status !== 'ativa') {
      return NextResponse.json(
        { error: 'Esta vaga não está mais disponível' },
        { status: 400 }
      )
    }

    // Verificar se já se candidatou
    const { data: candidaturaExistente } = await supabase
      .from('candidaturas')
      .select('id')
      .eq('candidato_id', candidato.id)
      .eq('vaga_id', vaga_id)
      .single()

    if (candidaturaExistente) {
      return NextResponse.json(
        { error: 'Você já se candidatou a esta vaga' },
        { status: 409 }
      )
    }

    // Criar candidatura (status_id = 1 = pendente)
    const { data: candidatura, error: createError } = await supabase
      .from('candidaturas')
      .insert({
        candidato_id: candidato.id,
        vaga_id,
        carta_apresentacao,
        status_id: 1 // Pendente
      })
      .select()
      .single()

    if (createError) {
      console.error('Erro ao criar candidatura:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar candidatura' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Candidatura enviada com sucesso',
      candidatura
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar candidatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
