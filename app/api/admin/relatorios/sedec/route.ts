import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET - Relatórios SEDEC/SINE
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get('periodo') || '30' // dias
    const dataInicio = searchParams.get('data_inicio')
    const dataFim = searchParams.get('data_fim')

    const supabase = createAdminClient()

    // Calcular data de início baseada no período
    const dataFiltro = dataInicio 
      ? new Date(dataInicio) 
      : new Date(Date.now() - parseInt(periodo) * 24 * 60 * 60 * 1000)
    
    const dataFimFiltro = dataFim ? new Date(dataFim) : new Date()

    // 1. Vagas por município
    const { data: vagasPorMunicipio, error: errorVagasMunicipio } = await supabase
      .from('vagas')
      .select('cidade, estado, status')
      .gte('created_at', dataFiltro.toISOString())
      .lte('created_at', dataFimFiltro.toISOString())

    const vagasPorCidade = vagasPorMunicipio?.reduce((acc: any, vaga: any) => {
      const key = `${vaga.cidade}, ${vaga.estado}`
      if (!acc[key]) {
        acc[key] = { total: 0, ativas: 0, encerradas: 0 }
      }
      acc[key].total++
      if (vaga.status === 'ativa') acc[key].ativas++
      else acc[key].encerradas++
      return acc
    }, {}) || {}

    // 2. Candidatos por perfil demográfico
    const { data: candidatos, error: errorCandidatos } = await supabase
      .from('candidatos')
      .select('genero, etnia, cidade, estado, eh_pcd, data_nascimento')
      .gte('created_at', dataFiltro.toISOString())
      .lte('created_at', dataFimFiltro.toISOString())

    const perfilDemografico = {
      porGenero: candidatos?.reduce((acc: any, c: any) => {
        const genero = c.genero || 'Não informado'
        acc[genero] = (acc[genero] || 0) + 1
        return acc
      }, {}) || {},
      porEtnia: candidatos?.reduce((acc: any, c: any) => {
        const etnia = c.etnia || 'Não informado'
        acc[etnia] = (acc[etnia] || 0) + 1
        return acc
      }, {}) || {},
      porCidade: candidatos?.reduce((acc: any, c: any) => {
        const cidade = `${c.cidade || 'Não informado'}, ${c.estado || ''}`
        acc[cidade] = (acc[cidade] || 0) + 1
        return acc
      }, {}) || {},
      pcd: candidatos?.filter((c: any) => c.eh_pcd).length || 0,
      totalCandidatos: candidatos?.length || 0,
      porFaixaEtaria: candidatos?.reduce((acc: any, c: any) => {
        if (!c.data_nascimento) {
          acc['Não informado'] = (acc['Não informado'] || 0) + 1
          return acc
        }
        const idade = Math.floor((Date.now() - new Date(c.data_nascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        let faixa = 'Não informado'
        if (idade < 18) faixa = 'Menor de 18'
        else if (idade < 25) faixa = '18-24'
        else if (idade < 35) faixa = '25-34'
        else if (idade < 45) faixa = '35-44'
        else if (idade < 55) faixa = '45-54'
        else faixa = '55+'
        acc[faixa] = (acc[faixa] || 0) + 1
        return acc
      }, {}) || {}
    }

    // 3. Taxa de empregabilidade (candidaturas aceitas / total candidaturas)
    const { data: candidaturas, error: errorCandidaturas } = await supabase
      .from('candidaturas')
      .select('status_candidatura_id, data_candidatura')
      .gte('data_candidatura', dataFiltro.toISOString())
      .lte('data_candidatura', dataFimFiltro.toISOString())

    const totalCandidaturas = candidaturas?.length || 0
    const candidaturasAceitas = candidaturas?.filter((c: any) => c.status_candidatura_id === 3).length || 0 // Assumindo que 3 = aceita
    const taxaEmpregabilidade = totalCandidaturas > 0 
      ? ((candidaturasAceitas / totalCandidaturas) * 100).toFixed(2) 
      : '0.00'

    // 4. Empresas parceiras por setor
    const { data: empresas, error: errorEmpresas } = await supabase
      .from('empresas')
      .select(`
        id,
        nome_fantasia,
        ramo_atuacao_id,
        cidade,
        estado,
        ramos_atuacao:ramo_atuacao_id (
          id,
          nome
        )
      `)
      .gte('created_at', dataFiltro.toISOString())
      .lte('created_at', dataFimFiltro.toISOString())

    const empresasPorSetor = empresas?.reduce((acc: any, empresa: any) => {
      const setor = empresa.ramos_atuacao?.nome || 'Não informado'
      if (!acc[setor]) {
        acc[setor] = { total: 0, empresas: [] }
      }
      acc[setor].total++
      acc[setor].empresas.push({
        nome: empresa.nome_fantasia,
        cidade: empresa.cidade,
        estado: empresa.estado
      })
      return acc
    }, {}) || {}

    // 5. Estatísticas gerais
    const { data: statsVagas } = await supabase
      .from('vagas')
      .select('id, status, quantidade_vagas')
      .gte('created_at', dataFiltro.toISOString())
      .lte('created_at', dataFimFiltro.toISOString())

    const totalVagas = statsVagas?.length || 0
    const vagasAbertas = statsVagas?.filter((v: any) => v.status === 'ativa').length || 0
    const totalPosicoes = statsVagas?.reduce((sum: number, v: any) => sum + (v.quantidade_vagas || 1), 0) || 0

    // 6. Evolução temporal (últimos 12 meses)
    const evolucaoMensal = await getEvolucaoMensal(supabase)

    return NextResponse.json({
      periodo: {
        inicio: dataFiltro.toISOString(),
        fim: dataFimFiltro.toISOString(),
        dias: periodo
      },
      vagasPorMunicipio: vagasPorCidade,
      perfilDemografico,
      empregabilidade: {
        totalCandidaturas,
        candidaturasAceitas,
        taxaEmpregabilidade: parseFloat(taxaEmpregabilidade),
        candidaturasEmAnalise: candidaturas?.filter((c: any) => c.status_candidatura_id === 1).length || 0,
        candidaturasRejeitadas: candidaturas?.filter((c: any) => c.status_candidatura_id === 2).length || 0
      },
      empresasParceiras: {
        total: empresas?.length || 0,
        porSetor: empresasPorSetor
      },
      estatisticasGerais: {
        totalVagas,
        vagasAbertas,
        vagasEncerradas: totalVagas - vagasAbertas,
        totalPosicoes,
        totalCandidatos: candidatos?.length || 0,
        totalEmpresas: empresas?.length || 0
      },
      evolucaoMensal
    })

  } catch (error) {
    console.error('Erro ao gerar relatórios SEDEC/SINE:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function getEvolucaoMensal(supabase: any) {
  const meses = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const mesData = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const mesProximo = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    
    const { data: vagasMes } = await supabase
      .from('vagas')
      .select('id')
      .gte('created_at', mesData.toISOString())
      .lt('created_at', mesProximo.toISOString())

    const { data: candidatosMes } = await supabase
      .from('candidatos')
      .select('user_id')
      .gte('created_at', mesData.toISOString())
      .lt('created_at', mesProximo.toISOString())

    const { data: candidaturasMes } = await supabase
      .from('candidaturas')
      .select('id')
      .gte('data_candidatura', mesData.toISOString())
      .lt('data_candidatura', mesProximo.toISOString())

    meses.push({
      mes: mesData.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      vagas: vagasMes?.length || 0,
      candidatos: candidatosMes?.length || 0,
      candidaturas: candidaturasMes?.length || 0
    })
  }

  return meses
}
