import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/auth/admin-login
 * Realiza login de administradores usando e-mail e senha
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Primeiro, verificar se o usuário é um administrador (user_role = 4)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_id, user_role, email')
      .eq('email', email)
      .maybeSingle()

    if (userError) {
      console.error('Erro ao verificar usuário:', userError)
      return NextResponse.json(
        { error: 'Erro ao verificar credenciais' },
        { status: 500 }
      )
    }

    if (!userData) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar se é administrador (user_role = 4 = superadmin)
    if (userData.user_role !== 4) {
      return NextResponse.json(
        { error: 'Acesso negado. Esta área é restrita a administradores.' },
        { status: 403 }
      )
    }

    // Realizar login com Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Erro no login:', error)
      
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'E-mail ou senha incorretos' },
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
        tipo_usuario: 4,
        nome_completo: data.user.user_metadata?.nome_completo || 'Administrador',
        is_admin: true,
      },
      redirect: '/admin/dashboard',
      session: {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
      }
    })

  } catch (error) {
    console.error('Erro no login admin:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
