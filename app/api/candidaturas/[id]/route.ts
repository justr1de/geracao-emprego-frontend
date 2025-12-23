import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Obter candidatura específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { data: candidatura, error } = await supabase
      .from('candidaturas')
      .select(`
        *,
        candidatos:candidato_id (
          id,
          nome_completo,
          email,
          telefone,
          cidade,
          estado,
          user_id
        ),
        vagas:vaga_id (
          id,
          titulo,
          empresa_id,
          empresas:empresa_id (
            id,
            nome_fantasia,
            user_id
          )
        ),
        status_candidatura:status_id (
          id,
          nome
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Candidatura não encontrada' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar candidatura:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar candidatura' },
        { status: 500 }
      )
    }

    // Verificar permissão (candidato dono ou empresa da vaga)
    const tipoUsuario = user.user_metadata?.tipo_usuario
    const isOwner = candidatura.candidatos?.user_id === user.id
    const isEmpresa = candidatura.vagas?.empresas?.user_id === user.id

    if (!isOwner && !isEmpresa) {
      return NextResponse.json(
        { error: 'Você não tem permissão para ver esta candidatura' },
        { status: 403 }
      )
    }

    return NextResponse.json({ candidatura })

  } catch (error) {
    console.error('Erro ao buscar candidatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar status da candidatura (empresa)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
        { error: 'Apenas empresas podem atualizar o status de candidaturas' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status_id, observacao } = body

    if (!status_id) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a candidatura pertence a uma vaga da empresa
    const { data: candidatura, error: candidaturaError } = await supabase
      .from('candidaturas')
      .select(`
        id,
        vagas:vaga_id (
          empresa_id,
          empresas:empresa_id (
            user_id
          )
        )
      `)
      .eq('id', id)
      .single()

    if (candidaturaError || !candidatura) {
      return NextResponse.json(
        { error: 'Candidatura não encontrada' },
        { status: 404 }
      )
    }

    if (candidatura.vagas?.empresas?.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para atualizar esta candidatura' },
        { status: 403 }
      )
    }

    // Atualizar candidatura
    const { data: updatedCandidatura, error: updateError } = await supabase
      .from('candidaturas')
      .update({
        status_id,
        observacao_empresa: observacao,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar candidatura:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar candidatura' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Status atualizado com sucesso',
      candidatura: updatedCandidatura
    })

  } catch (error) {
    console.error('Erro ao atualizar candidatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Cancelar candidatura (candidato)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
        { error: 'Apenas candidatos podem cancelar suas candidaturas' },
        { status: 403 }
      )
    }

    // Buscar candidato
    const { data: candidato } = await supabase
      .from('candidatos')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!candidato) {
      return NextResponse.json(
        { error: 'Candidato não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a candidatura pertence ao candidato
    const { data: candidatura, error: candidaturaError } = await supabase
      .from('candidaturas')
      .select('id, candidato_id')
      .eq('id', id)
      .single()

    if (candidaturaError || !candidatura) {
      return NextResponse.json(
        { error: 'Candidatura não encontrada' },
        { status: 404 }
      )
    }

    if (candidatura.candidato_id !== candidato.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para cancelar esta candidatura' },
        { status: 403 }
      )
    }

    // Soft delete - mudar status para cancelada (status_id = 5)
    const { error: deleteError } = await supabase
      .from('candidaturas')
      .update({
        status_id: 5, // Cancelada
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (deleteError) {
      console.error('Erro ao cancelar candidatura:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao cancelar candidatura' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Candidatura cancelada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cancelar candidatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
