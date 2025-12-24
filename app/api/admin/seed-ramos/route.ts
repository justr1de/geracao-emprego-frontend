import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/seed-ramos
 * Atualiza os ramos de atividade das empresas existentes
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Definir ramos de atividade para cada empresa
    const ramosEmpresas = [
      { nome_fantasia: 'Supermercado Bom Preço', ramo_atividade: 'Comércio Varejista' },
      { nome_fantasia: 'Construtora Norte Sul', ramo_atividade: 'Construção Civil' },
      { nome_fantasia: 'Hospital São Lucas', ramo_atividade: 'Saúde' },
      { nome_fantasia: 'Restaurante Sabor da Terra', ramo_atividade: 'Alimentação' },
      { nome_fantasia: 'TechRO', ramo_atividade: 'Tecnologia da Informação' },
      { nome_fantasia: 'Empresa Teste', ramo_atividade: 'Tecnologia da Informação' }
    ]

    const resultados = []

    for (const empresa of ramosEmpresas) {
      const { data, error } = await supabase
        .from('empresas')
        .update({ ramo_atividade: empresa.ramo_atividade })
        .eq('nome_fantasia', empresa.nome_fantasia)
        .select()

      if (error) {
        resultados.push({ empresa: empresa.nome_fantasia, status: 'erro', error: error.message })
      } else if (data && data.length > 0) {
        resultados.push({ empresa: empresa.nome_fantasia, status: 'atualizado', ramo: empresa.ramo_atividade })
      } else {
        resultados.push({ empresa: empresa.nome_fantasia, status: 'não encontrada' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Ramos de atividade atualizados',
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
