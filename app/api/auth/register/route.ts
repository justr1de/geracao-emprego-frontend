import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      nome_completo, 
      cpf, 
      telefone, 
      data_nascimento, 
      genero,
      tipo_usuario = 1, // 1 = candidato por padrão
      lgpd_aceito
    } = body

    // Validações básicas
    if (!email || !password || !nome_completo || !cpf) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    if (!lgpd_aceito) {
      return NextResponse.json(
        { error: 'É necessário aceitar os termos de tratamento de dados (LGPD)' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // 1. Criar usuário no Supabase Auth (sem auto-confirmar e-mail)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Requer confirmação por e-mail
      user_metadata: {
        nome_completo,
        tipo_usuario,
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError)
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este e-mail já está cadastrado' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    // 2. Criar registro na tabela candidatos (se for candidato)
    if (tipo_usuario === 1) {
      const { error: candidatoError } = await supabase
        .from('candidatos')
        .insert({
          user_id: userId,
          nome_completo,
          cpf: cpf.replace(/\D/g, ''), // Remove formatação
          telefone: telefone?.replace(/\D/g, ''),
          email,
          genero,
        })

      if (candidatoError) {
        console.error('Erro ao criar candidato:', candidatoError)
        
        // Rollback: deletar usuário do Auth se falhar
        await supabase.auth.admin.deleteUser(userId)
        
        if (candidatoError.message.includes('duplicate key') && candidatoError.message.includes('cpf')) {
          return NextResponse.json(
            { error: 'Este CPF já está cadastrado' },
            { status: 409 }
          )
        }
        
        return NextResponse.json(
          { error: 'Erro ao criar perfil do candidato' },
          { status: 500 }
        )
      }
    }

    // 3. Registrar aceite LGPD (se houver tabela para isso)
    // TODO: Criar tabela lgpd_consents para auditoria

    // 4. Gerar link de confirmação de e-mail
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://geracao-emprego-dev.vercel.app'}/auth/callback?type=email_confirmation`
      }
    })

    if (linkError) {
      console.error('Erro ao gerar link de confirmação:', linkError)
      // Não falha o cadastro, apenas loga o erro
    }

    return NextResponse.json({
      success: true,
      message: 'Cadastro realizado com sucesso! Verifique seu e-mail para ativar sua conta.',
      requiresEmailConfirmation: true,
      user: {
        id: userId,
        email: authData.user.email,
        tipo_usuario,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
