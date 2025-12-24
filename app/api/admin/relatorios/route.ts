import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Total de candidatos
    const { count: totalCandidatos } = await supabase
      .from('candidatos')
      .select('*', { count: 'exact', head: true })

    // Candidatos por cidade
    const { data: candidatosPorCidade } = await supabase
      .from('candidatos')
      .select('cidade')
    
    const cidadesCount: { [key: string]: number } = {}
    candidatosPorCidade?.forEach(c => {
      const cidade = c.cidade || 'Não informado'
      cidadesCount[cidade] = (cidadesCount[cidade] || 0) + 1
    })
    const porCidade = Object.entries(cidadesCount)
      .map(([cidade, total]) => ({ cidade, total }))
      .sort((a, b) => b.total - a.total)

    // Candidatos por gênero
    const { data: candidatosPorGenero } = await supabase
      .from('candidatos')
      .select('genero')
    
    const generoCount: { [key: string]: number } = {}
    candidatosPorGenero?.forEach(c => {
      const genero = c.genero || 'N'
      generoCount[genero] = (generoCount[genero] || 0) + 1
    })
    const porGenero = Object.entries(generoCount)
      .map(([genero, total]) => ({ genero, total }))
      .sort((a, b) => b.total - a.total)

    // Total de empresas (todas são consideradas ativas se existem)
    const { count: totalEmpresas } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true })

    // Total de vagas
    const { count: totalVagas } = await supabase
      .from('vagas')
      .select('*', { count: 'exact', head: true })

    // Vagas abertas (status_id = 1 significa "Aberta")
    const { count: vagasAbertas } = await supabase
      .from('vagas')
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 1)

    // Vagas por empresa
    const { data: vagasData } = await supabase
      .from('vagas')
      .select('empresa_id, empresas(nome_fantasia)')
    
    const empresaVagasCount: { [key: string]: number } = {}
    vagasData?.forEach((v: any) => {
      const empresa = v.empresas?.nome_fantasia || 'Empresa não identificada'
      empresaVagasCount[empresa] = (empresaVagasCount[empresa] || 0) + 1
    })
    const porEmpresa = Object.entries(empresaVagasCount)
      .map(([empresa, total]) => ({ empresa, total }))
      .sort((a, b) => b.total - a.total)

    return NextResponse.json({
      candidatos: {
        total: totalCandidatos || 0,
        porCidade,
        porGenero
      },
      empresas: {
        total: totalEmpresas || 0,
        ativas: totalEmpresas || 0  // Todas as empresas cadastradas são consideradas ativas
      },
      vagas: {
        total: totalVagas || 0,
        abertas: vagasAbertas || 0,
        porEmpresa
      }
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
