import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/update-ramos
 * Atualiza os nomes dos ramos de atuação para valores mais adequados
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Atualizar os nomes dos ramos de atuação
    const atualizacoes = [
      { id: 1, nome: 'Comércio Varejista' },
      { id: 2, nome: 'Construção Civil' },
      { id: 3, nome: 'Saúde' },
      { id: 4, nome: 'Alimentação' },
      { id: 5, nome: 'Tecnologia da Informação' },
      { id: 6, nome: 'Serviços' }
    ]

    const resultados = []

    for (const ramo of atualizacoes) {
      const { data, error } = await supabase
        .from('ramos_atuacao')
        .update({ nome: ramo.nome })
        .eq('id', ramo.id)
        .select()

      if (error) {
        resultados.push({ id: ramo.id, nome: ramo.nome, status: 'erro', error: error.message })
      } else if (data && data.length > 0) {
        resultados.push({ id: ramo.id, nome: ramo.nome, status: 'atualizado' })
      } else {
        resultados.push({ id: ramo.id, nome: ramo.nome, status: 'não encontrado' })
      }
    }

    // Buscar os ramos atualizados
    const { data: ramosAtualizados } = await supabase
      .from('ramos_atuacao')
      .select('*')
      .order('id')

    return NextResponse.json({
      success: true,
      message: 'Ramos de atuação atualizados com sucesso',
      ramos: ramosAtualizados,
      resultados
    })

  } catch (error) {
    console.error('Erro ao atualizar ramos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
