import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Obter vaga específica (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: vaga, error } = await supabase
      .from('vagas')
      .select(`
        *,
        empresas:empresa_id (
          id,
          nome_fantasia,
          razao_social,
          logo_url,
          descricao,
          cidade,
          estado,
          site_url
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
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vaga não encontrada' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar vaga:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar vaga' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vaga })

  } catch (error) {
    console.error('Erro ao buscar vaga:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar vaga (autenticado - empresa dona)
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

    // Verificar se a vaga pertence à empresa do usuário
    const { data: vaga, error: vagaError } = await supabase
      .from('vagas')
      .select('empresa_id')
      .eq('id', id)
      .single()

    if (vagaError || !vaga) {
      return NextResponse.json(
        { error: 'Vaga não encontrada' },
        { status: 404 }
      )
    }

    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!empresa || empresa.id !== vaga.empresa_id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar esta vaga' },
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
      data_expiracao,
      status
    } = body

    const { data: updatedVaga, error: updateError } = await supabase
      .from('vagas')
      .update({
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
        data_expiracao,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar vaga:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar vaga' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Vaga atualizada com sucesso',
      vaga: updatedVaga
    })

  } catch (error) {
    console.error('Erro ao atualizar vaga:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir vaga (autenticado - empresa dona)
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

    // Verificar se a vaga pertence à empresa do usuário
    const { data: vaga, error: vagaError } = await supabase
      .from('vagas')
      .select('empresa_id')
      .eq('id', id)
      .single()

    if (vagaError || !vaga) {
      return NextResponse.json(
        { error: 'Vaga não encontrada' },
        { status: 404 }
      )
    }

    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!empresa || empresa.id !== vaga.empresa_id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para excluir esta vaga' },
        { status: 403 }
      )
    }

    // Soft delete - apenas mudar status
    const { error: deleteError } = await supabase
      .from('vagas')
      .update({ status: 'excluida', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (deleteError) {
      console.error('Erro ao excluir vaga:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir vaga' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Vaga excluída com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir vaga:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
