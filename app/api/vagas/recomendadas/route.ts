import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CandidatoProfile {
  id: string;
  area_interesse_id?: number;
  cidade?: string;
  estado?: string;
  salario_pretendido?: number;
  experiencia_anos?: number;
  escolaridade_id?: number;
  habilidades?: string[];
}

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  cidade: string;
  estado: string;
  area_id?: number;
  salario_min?: number;
  salario_max?: number;
  experiencia_minima?: number;
  escolaridade_minima_id?: number;
  habilidades_requeridas?: string[];
  empresas?: {
    id: string;
    nome_fantasia: string;
    logo_url?: string;
  };
  areas_vaga?: {
    id: number;
    nome: string;
  };
  tipos_contrato?: {
    id: number;
    nome: string;
  };
  modelos_trabalho?: {
    id: number;
    nome: string;
  };
  created_at: string;
}

interface VagaComScore extends Vaga {
  matchScore: number;
  matchDetails: {
    area: number;
    localizacao: number;
    salario: number;
    experiencia: number;
    habilidades: number;
  };
}

// Pesos do algoritmo de match
const MATCH_WEIGHTS = {
  area: 0.30,        // 30% - Área de atuação
  localizacao: 0.25, // 25% - Localização/cidade
  salario: 0.20,     // 20% - Faixa salarial
  experiencia: 0.15, // 15% - Experiência requerida
  habilidades: 0.10, // 10% - Habilidades
};

// Função para calcular score de match
function calculateMatchScore(candidato: CandidatoProfile, vaga: Vaga): { score: number; details: VagaComScore['matchDetails'] } {
  const details = {
    area: 0,
    localizacao: 0,
    salario: 0,
    experiencia: 0,
    habilidades: 0,
  };

  // 1. Match de área de atuação (30%)
  if (candidato.area_interesse_id && vaga.area_id) {
    if (candidato.area_interesse_id === vaga.area_id) {
      details.area = 100;
    }
  } else {
    // Se não tem área definida, dar pontuação neutra
    details.area = 50;
  }

  // 2. Match de localização (25%)
  if (candidato.cidade && vaga.cidade) {
    const candidatoCidade = candidato.cidade.toLowerCase().trim();
    const vagaCidade = vaga.cidade.toLowerCase().trim();
    
    if (candidatoCidade === vagaCidade) {
      details.localizacao = 100;
    } else if (candidato.estado === vaga.estado) {
      // Mesmo estado, cidade diferente
      details.localizacao = 60;
    } else {
      details.localizacao = 20;
    }
  } else {
    details.localizacao = 50;
  }

  // 3. Match de salário (20%)
  if (candidato.salario_pretendido && (vaga.salario_min || vaga.salario_max)) {
    const salarioPretendido = candidato.salario_pretendido;
    const salarioMin = vaga.salario_min || 0;
    const salarioMax = vaga.salario_max || salarioMin * 1.5;
    
    if (salarioPretendido >= salarioMin && salarioPretendido <= salarioMax) {
      details.salario = 100;
    } else if (salarioPretendido < salarioMin) {
      // Candidato pede menos que o mínimo - bom para empresa
      details.salario = 90;
    } else if (salarioPretendido <= salarioMax * 1.2) {
      // Até 20% acima do máximo
      details.salario = 60;
    } else {
      details.salario = 30;
    }
  } else {
    details.salario = 50;
  }

  // 4. Match de experiência (15%)
  if (candidato.experiencia_anos !== undefined && vaga.experiencia_minima !== undefined) {
    if (candidato.experiencia_anos >= vaga.experiencia_minima) {
      details.experiencia = 100;
    } else if (candidato.experiencia_anos >= vaga.experiencia_minima * 0.7) {
      // Até 30% abaixo do requerido
      details.experiencia = 70;
    } else {
      details.experiencia = 40;
    }
  } else {
    details.experiencia = 50;
  }

  // 5. Match de habilidades (10%)
  if (candidato.habilidades && candidato.habilidades.length > 0 && 
      vaga.habilidades_requeridas && vaga.habilidades_requeridas.length > 0) {
    const candidatoHabilidades = candidato.habilidades.map(h => h.toLowerCase());
    const vagaHabilidades = vaga.habilidades_requeridas.map(h => h.toLowerCase());
    
    const matches = vagaHabilidades.filter(h => 
      candidatoHabilidades.some(ch => ch.includes(h) || h.includes(ch))
    ).length;
    
    details.habilidades = Math.min(100, (matches / vagaHabilidades.length) * 100);
  } else {
    details.habilidades = 50;
  }

  // Calcular score final ponderado
  const score = 
    details.area * MATCH_WEIGHTS.area +
    details.localizacao * MATCH_WEIGHTS.localizacao +
    details.salario * MATCH_WEIGHTS.salario +
    details.experiencia * MATCH_WEIGHTS.experiencia +
    details.habilidades * MATCH_WEIGHTS.habilidades;

  return { score: Math.round(score), details };
}

// GET - Obter vagas recomendadas para o candidato
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const minScore = parseInt(searchParams.get('min_score') || '30');

    const supabase = await createClient();
    
    // Verificar autenticação (não obrigatório)
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch {
      // Usuário não autenticado - continuar sem perfil
    }
    
    let candidatoProfile: CandidatoProfile | null = null;

    // Se usuário está logado e é candidato, buscar perfil
    if (user && user.user_metadata?.tipo_usuario === 1) {
      try {
        const { data: candidato } = await supabase
          .from('candidatos')
          .select(`
            id,
            area_interesse_id,
            cidade,
            estado,
            salario_pretendido,
            experiencia_anos,
            escolaridade_id
          `)
          .eq('user_id', user.id)
          .single();

        if (candidato) {
          // Buscar habilidades do candidato
          const { data: habilidades } = await supabase
            .from('candidato_habilidades')
            .select('habilidade')
            .eq('candidato_id', candidato.id);

          candidatoProfile = {
            ...candidato,
            habilidades: habilidades?.map(h => h.habilidade) || [],
          };
        }
      } catch {
        // Erro ao buscar perfil - continuar sem perfil
      }
    }

    // Buscar vagas ativas (usando cliente normal - as vagas são públicas)
    const { data: vagas, error: vagasError } = await supabase
      .from('vagas')
      .select(`
        *,
        empresas:empresa_id (
          id,
          nome_fantasia,
          logo_url,
          cidade,
          estado
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
      .eq('status_id', 1)
      .order('created_at', { ascending: false })
      .limit(100);

    if (vagasError) {
      console.error('Erro ao buscar vagas:', vagasError);
      // Retornar array vazio em vez de erro para não quebrar a UI
      return NextResponse.json({
        vagas: [],
        hasProfile: false,
        totalAnalyzed: 0,
        error: 'Erro ao buscar vagas'
      });
    }

    // Se não há vagas, retornar array vazio
    if (!vagas || vagas.length === 0) {
      return NextResponse.json({
        vagas: [],
        hasProfile: !!candidatoProfile,
        totalAnalyzed: 0,
      });
    }

    let vagasRecomendadas: VagaComScore[];

    if (candidatoProfile) {
      // Calcular score para cada vaga
      vagasRecomendadas = (vagas as Vaga[])
        .map(vaga => {
          const { score, details } = calculateMatchScore(candidatoProfile!, vaga);
          return {
            ...vaga,
            matchScore: score,
            matchDetails: details,
          };
        })
        .filter(v => v.matchScore >= minScore)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } else {
      // Usuário não logado ou sem perfil - retornar vagas mais recentes
      vagasRecomendadas = (vagas as Vaga[])
        .slice(0, limit)
        .map(vaga => ({
          ...vaga,
          matchScore: 0,
          matchDetails: {
            area: 0,
            localizacao: 0,
            salario: 0,
            experiencia: 0,
            habilidades: 0,
          },
        }));
    }

    return NextResponse.json({
      vagas: vagasRecomendadas,
      hasProfile: !!candidatoProfile,
      totalAnalyzed: vagas?.length || 0,
    });

  } catch (error) {
    console.error('Erro ao buscar vagas recomendadas:', error);
    // Retornar array vazio em vez de erro 500 para não quebrar a UI
    return NextResponse.json({
      vagas: [],
      hasProfile: false,
      totalAnalyzed: 0,
      error: 'Erro interno do servidor'
    });
  }
}
