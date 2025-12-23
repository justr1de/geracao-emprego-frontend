import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({
        authenticated: false,
        user: null
      })
    }

    // Buscar dados adicionais do candidato ou empresa
    let profile = null
    const tipoUsuario = user.user_metadata?.tipo_usuario

    if (tipoUsuario === 1) {
      // Candidato
      const { data } = await supabase
        .from('candidatos')
        .select('*')
        .eq('user_id', user.id)
        .single()
      profile = data
    } else if (tipoUsuario === 2) {
      // Empresa
      const { data } = await supabase
        .from('empresas')
        .select('*')
        .eq('user_id', user.id)
        .single()
      profile = data
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        tipo_usuario: tipoUsuario,
        nome_completo: user.user_metadata?.nome_completo,
        profile
      }
    })

  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
