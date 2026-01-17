import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/auth/login-documento
 * Realiza login usando CPF (candidato) ou CNPJ (empresa) + senha
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documento, password, tipo } = body

    if (!documento || !password || !tipo) {
      return NextResponse.json(
        { error: 'Documento, senha e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    // Remove formatação do documento
    const documentoLimpo = documento.replace(/\D/g, '')

    // Usar adminClient para buscar candidato/empresa (bypassa RLS)
    const adminClient = createAdminClient()
    // Usar client normal para autenticação
    const supabase = await createClient()
    let email: string | null = null
    let tipoUsuario: number = 1

    if (tipo === 'candidato') {
      // Validação básica do CPF (11 dígitos)
      if (documentoLimpo.length !== 11) {
        return NextResponse.json(
          { error: 'CPF inválido' },
          { status: 400 }
        )
      }

      // Buscar email do candidato pelo CPF
      const { data: candidato, error: candidatoError } = await adminClient
        .from('candidatos')
        .select('email, user_id')
        .eq('cpf', documentoLimpo)
        .maybeSingle()

      if (candidatoError) {
        console.error('Erro ao buscar candidato:', candidatoError)
        return NextResponse.json(
          { error: 'Erro ao buscar candidato' },
          { status: 500 }
        )
      }

      if (!candidato || !candidato.email) {
        return NextResponse.json(
          { error: 'CPF não encontrado. Verifique os dados ou cadastre-se.' },
          { status: 404 }
        )
      }

      email = candidato.email
      tipoUsuario = 1

    } else if (tipo === 'empresa') {
      // Validação básica do CNPJ (14 dígitos)
      if (documentoLimpo.length !== 14) {
        return NextResponse.json(
          { error: 'CNPJ inválido' },
          { status: 400 }
        )
      }

      // Buscar email da empresa pelo CNPJ
      const { data: empresa, error: empresaError } = await adminClient
        .from('empresas')
        .select('email_contato, user_id')
        .eq('cnpj', documentoLimpo)
        .maybeSingle()

      if (empresaError) {
        console.error('Erro ao buscar empresa:', empresaError)
        return NextResponse.json(
          { error: 'Erro ao buscar empresa' },
          { status: 500 }
        )
      }

      if (!empresa || !empresa.email_contato) {
        return NextResponse.json(
          { error: 'CNPJ não encontrado. Verifique os dados ou cadastre sua empresa.' },
          { status: 404 }
        )
      }

      email = empresa.email_contato
      tipoUsuario = 2

    } else {
      return NextResponse.json(
        { error: 'Tipo de login inválido' },
        { status: 400 }
      )
    }

    // Realizar login com o email encontrado
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Erro no login:', error)
      
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Senha incorreta' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Erro ao fazer login' },
        { status: 500 }
      )
    }

    // Atualizar last_login na tabela users
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', data.user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        tipo_usuario: tipoUsuario,
        nome_completo: data.user.user_metadata?.nome_completo,
      },
      redirect: tipoUsuario === 1 ? '/perfil' : '/empresa/dashboard',
      session: {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
