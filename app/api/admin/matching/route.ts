import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/matching
 * Calcula o matching entre candidatos e uma vaga específica
 * Query params:
 * - vaga_id: ID da vaga para calcular matching
 * - limit: Número máximo de candidatos a retornar (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const vagaId = searchParams.get('vaga_id')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!vagaId) {
      return NextResponse.json(
        { error: 'ID da vaga é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar dados da vaga
    const { data: vaga, error: vagaError } = await supabase
      .from('vagas')
      .select('*')
      .eq('id', vagaId)
      .single()

    if (vagaError || !vaga) {
      return NextResponse.json(
        { error: 'Vaga não encontrada' },
        { status: 404 }
      )
    }

    // Buscar todos os candidatos ativos
    const { data: candidatos, error: candidatosError } = await supabase
      .from('candidatos')
      .select('*')
      .limit(100)

    if (candidatosError) {
      console.error('Erro ao buscar candidatos:', candidatosError)
      return NextResponse.json(
        { error: 'Erro ao buscar candidatos' },
        { status: 500 }
      )
    }

    // Buscar candidaturas existentes para esta vaga
    const { data: candidaturas } = await supabase
      .from('candidaturas')
      .select('candidato_id')
      .eq('vaga_id', vagaId)

    const candidatosJaCandidatados = new Set(
      (candidaturas || []).map(c => c.candidato_id)
    )

    // Calcular score de matching para cada candidato
    const candidatosComScore = (candidatos || []).map(candidato => {
      const score = calcularMatchingScore(candidato, vaga)
      const jaCandidatou = candidatosJaCandidatados.has(candidato.user_id) || 
                          candidatosJaCandidatados.has(candidato.id)
      
      return {
        id: candidato.user_id || candidato.id,
        nome_completo: candidato.nome_completo,
        email: candidato.email,
        telefone: candidato.telefone,
        cidade: candidato.cidade,
        estado: candidato.estado,
        bairro: candidato.bairro,
        eh_pcd: candidato.eh_pcd,
        possui_cnh: candidato.possui_cnh,
        veiculo_proprio: candidato.veiculo_proprio,
        score,
        scoreLabel: getScoreLabel(score),
        jaCandidatou,
        criterios: getCriteriosMatch(candidato, vaga)
      }
    })

    // Ordenar por score (maior primeiro) e limitar
    const candidatosOrdenados = candidatosComScore
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return NextResponse.json({
      vaga: {
        id: vaga.id,
        cargo: vaga.cargo,
        empresa_id: vaga.empresa_id,
        salario_min: vaga.salario_min,
        salario_max: vaga.salario_max,
        quantidade_vagas: vaga.quantidade_vagas
      },
      candidatos: candidatosOrdenados,
      total: candidatosComScore.length
    })

  } catch (error) {
    console.error('Erro na API de matching:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * Calcula o score de matching entre um candidato e uma vaga
 * Score de 0 a 100
 */
function calcularMatchingScore(candidato: any, vaga: any): number {
  let score = 0
  let maxScore = 0

  // 1. Localização (30 pontos)
  maxScore += 30
  if (candidato.cidade && vaga.cidade) {
    if (candidato.cidade.toLowerCase() === vaga.cidade?.toLowerCase()) {
      score += 30
    } else if (candidato.estado === vaga.estado) {
      score += 15
    }
  } else if (candidato.estado === 'RO') {
    // Candidato de Rondônia ganha pontos parciais
    score += 20
  }

  // 2. Disponibilidade/Ativo (10 pontos)
  maxScore += 10
  if (candidato.is_active !== false) {
    score += 10
  }

  // 3. Perfil completo (20 pontos)
  maxScore += 20
  let camposPreenchidos = 0
  const camposImportantes = [
    'nome_completo', 'email', 'telefone', 'cidade', 'estado', 
    'data_nascimento', 'bairro'
  ]
  camposImportantes.forEach(campo => {
    if (candidato[campo]) camposPreenchidos++
  })
  score += Math.round((camposPreenchidos / camposImportantes.length) * 20)

  // 4. CNH se necessário (15 pontos)
  maxScore += 15
  // Se a descrição da vaga menciona CNH ou veículo
  const descricaoLower = (vaga.descricao || '').toLowerCase()
  const precisaCNH = descricaoLower.includes('cnh') || 
                     descricaoLower.includes('carteira de motorista') ||
                     descricaoLower.includes('veículo')
  
  if (precisaCNH) {
    if (candidato.possui_cnh) {
      score += 15
    }
  } else {
    // Se não precisa CNH, dá os pontos
    score += 15
  }

  // 5. Veículo próprio se mencionado (10 pontos)
  maxScore += 10
  const precisaVeiculo = descricaoLower.includes('veículo próprio') ||
                         descricaoLower.includes('carro próprio')
  
  if (precisaVeiculo) {
    if (candidato.veiculo_proprio) {
      score += 10
    }
  } else {
    score += 10
  }

  // 6. PCD se vaga é para PCD (15 pontos)
  maxScore += 15
  if (vaga.vaga_pcd) {
    if (candidato.eh_pcd) {
      score += 15
    }
  } else {
    score += 15
  }

  // Normalizar para 0-100
  return Math.round((score / maxScore) * 100)
}

/**
 * Retorna label descritivo do score
 */
function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excelente'
  if (score >= 75) return 'Muito Bom'
  if (score >= 60) return 'Bom'
  if (score >= 40) return 'Regular'
  return 'Baixo'
}

/**
 * Retorna os critérios de match detalhados
 */
function getCriteriosMatch(candidato: any, vaga: any): any {
  const criterios: any = {}

  // Localização
  if (candidato.cidade && vaga.cidade) {
    criterios.localizacao = {
      match: candidato.cidade.toLowerCase() === vaga.cidade?.toLowerCase(),
      candidato: `${candidato.cidade}/${candidato.estado}`,
      vaga: vaga.cidade ? `${vaga.cidade}/${vaga.estado}` : 'Não especificado'
    }
  } else {
    criterios.localizacao = {
      match: candidato.estado === 'RO',
      candidato: candidato.cidade ? `${candidato.cidade}/${candidato.estado}` : candidato.estado || 'Não informado',
      vaga: 'Rondônia'
    }
  }

  // CNH
  const descricaoLower = (vaga.descricao || '').toLowerCase()
  const precisaCNH = descricaoLower.includes('cnh') || 
                     descricaoLower.includes('carteira de motorista')
  
  criterios.cnh = {
    requerido: precisaCNH,
    match: !precisaCNH || candidato.possui_cnh,
    candidato: candidato.possui_cnh ? 'Possui CNH' : 'Não possui CNH'
  }

  // Veículo
  const precisaVeiculo = descricaoLower.includes('veículo próprio')
  criterios.veiculo = {
    requerido: precisaVeiculo,
    match: !precisaVeiculo || candidato.veiculo_proprio,
    candidato: candidato.veiculo_proprio ? 'Possui veículo' : 'Não possui veículo'
  }

  // PCD
  criterios.pcd = {
    vagaPCD: vaga.vaga_pcd || false,
    candidatoPCD: candidato.eh_pcd || false,
    match: !vaga.vaga_pcd || candidato.eh_pcd
  }

  // Perfil completo
  const camposPreenchidos = [
    candidato.nome_completo,
    candidato.email,
    candidato.telefone,
    candidato.cidade,
    candidato.estado,
    candidato.data_nascimento
  ].filter(Boolean).length

  criterios.perfilCompleto = {
    percentual: Math.round((camposPreenchidos / 6) * 100),
    completo: camposPreenchidos >= 5
  }

  return criterios
}
