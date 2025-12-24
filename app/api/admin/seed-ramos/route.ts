import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/seed-ramos
 * Atualiza os ramos de atuação das empresas existentes
 * A tabela empresas usa ramo_atuacao_id que referencia uma tabela de ramos
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Primeiro, verificar se existe tabela de ramos_atuacao
    const { data: ramosExistentes, error: ramosError } = await supabase
      .from('ramos_atuacao')
      .select('*')
      .limit(10)

    let ramos: any[] = []

    if (ramosError) {
      // Se a tabela não existe ou está vazia, vamos criar os ramos
      console.log('Tabela ramos_atuacao não encontrada ou vazia')
      
      // Tentar inserir ramos básicos
      const ramosParaInserir = [
        { id: 1, nome: 'Comércio Varejista' },
        { id: 2, nome: 'Construção Civil' },
        { id: 3, nome: 'Saúde' },
        { id: 4, nome: 'Alimentação' },
        { id: 5, nome: 'Tecnologia da Informação' },
        { id: 6, nome: 'Educação' },
        { id: 7, nome: 'Indústria' },
        { id: 8, nome: 'Serviços' },
        { id: 9, nome: 'Agronegócio' },
        { id: 10, nome: 'Transporte e Logística' }
      ]

      const { data: insertedRamos, error: insertError } = await supabase
        .from('ramos_atuacao')
        .upsert(ramosParaInserir, { onConflict: 'id' })
        .select()

      if (insertError) {
        console.log('Erro ao inserir ramos:', insertError)
      } else {
        ramos = insertedRamos || []
      }
    } else {
      ramos = ramosExistentes || []
    }

    // Mapear empresas para seus ramos
    const empresasRamos = [
      { nome_fantasia: 'Supermercado Bom Preço', ramo_atuacao_id: 1 }, // Comércio Varejista
      { nome_fantasia: 'Construtora Norte Sul', ramo_atuacao_id: 2 }, // Construção Civil
      { nome_fantasia: 'Hospital São Lucas', ramo_atuacao_id: 3 }, // Saúde
      { nome_fantasia: 'Restaurante Sabor da Terra', ramo_atuacao_id: 4 }, // Alimentação
      { nome_fantasia: 'TechRO', ramo_atuacao_id: 5 }, // Tecnologia da Informação
      { nome_fantasia: 'Empresa Teste', ramo_atuacao_id: 5 } // Tecnologia da Informação
    ]

    const resultados = []

    for (const empresa of empresasRamos) {
      const { data, error } = await supabase
        .from('empresas')
        .update({ ramo_atuacao_id: empresa.ramo_atuacao_id })
        .eq('nome_fantasia', empresa.nome_fantasia)
        .select()

      if (error) {
        resultados.push({ empresa: empresa.nome_fantasia, status: 'erro', error: error.message })
      } else if (data && data.length > 0) {
        resultados.push({ empresa: empresa.nome_fantasia, status: 'atualizado', ramo_atuacao_id: empresa.ramo_atuacao_id })
      } else {
        resultados.push({ empresa: empresa.nome_fantasia, status: 'não encontrada' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Ramos de atuação atualizados',
      ramos,
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
