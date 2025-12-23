import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Obter perfil do candidato logado
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

    // Buscar candidato
    const { data: candidato, error } = await supabase
      .from('candidatos')
      .select(`
        *,
        niveis_escolaridade:nivel_escolaridade_id (
          id,
          nome
        )
      `)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Perfil de candidato não encontrado' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar candidato:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({ candidato })

  } catch (error) {
    console.error('Erro ao buscar candidato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar perfil do candidato
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const {
      nome_completo,
      telefone,
      data_nascimento,
      genero,
      nivel_escolaridade_id,
      area_interesse,
      pretensao_salarial,
      disponibilidade,
      sobre,
      linkedin_url,
      portfolio_url,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      pcd,
      tipo_deficiencia
    } = body

    // Atualizar candidato
    const { data: candidato, error } = await supabase
      .from('candidatos')
      .update({
        nome_completo,
        telefone: telefone?.replace(/\D/g, ''),
        data_nascimento,
        genero,
        nivel_escolaridade_id,
        area_interesse,
        pretensao_salarial,
        disponibilidade,
        sobre,
        linkedin_url,
        portfolio_url,
        cep: cep?.replace(/\D/g, ''),
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        pcd,
        tipo_deficiencia,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar candidato:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      candidato
    })

  } catch (error) {
    console.error('Erro ao atualizar candidato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
