import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/admin/seed-vagas
 * Popula o banco de dados com vagas de exemplo para cada empresa
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // IDs das empresas
    const empresas = {
      supermercado: 'f6cc1990-e27b-43f9-b04d-fc31d6f84a76',
      construtora: 'beb8224c-a954-49bb-aa06-5ae8a73b8834',
      hospital: '2a6ebfb8-1204-480f-8499-31908b5dd903',
      restaurante: '8fd91049-9417-4a54-b723-0fd8477a2d0d',
      techro: 'df8e83df-1697-4494-8827-6453f3134279'
    }

    // Vagas para cada empresa - usando apenas campos que existem na tabela
    const vagas = [
      // SUPERMERCADO BOM PREÇO - Varejo
      {
        empresa_id: empresas.supermercado,
        cargo: 'Operador de Caixa',
        descricao: 'Atendimento ao cliente, registro de vendas no sistema, fechamento de caixa, emissão de notas fiscais. Trabalho em escala 6x1. REQUISITOS: Ensino médio completo, experiência mínima de 6 meses em atendimento ao público, conhecimento básico em informática, boa comunicação.',
        salario_min: 1500,
        salario_max: 1800,
        quantidade_vagas: 5,
        beneficios: 'Vale transporte, vale alimentação (R$ 300/mês), plano de saúde após 3 meses, desconto em compras na loja',
        status_id: 1
      },
      {
        empresa_id: empresas.supermercado,
        cargo: 'Repositor de Mercadorias',
        descricao: 'Reposição de produtos nas prateleiras, organização do estoque, verificação de validade dos produtos, precificação. REQUISITOS: Ensino fundamental completo, disponibilidade de horário (inclusive finais de semana), boa condição física para carregar peso.',
        salario_min: 1400,
        salario_max: 1600,
        quantidade_vagas: 4,
        beneficios: 'Vale transporte, vale alimentação (R$ 250/mês), cesta básica',
        status_id: 1
      },
      {
        empresa_id: empresas.supermercado,
        cargo: 'Açougueiro',
        descricao: 'Corte e preparo de carnes bovinas, suínas e aves. Atendimento ao cliente, manutenção da limpeza e organização do setor. REQUISITOS: Ensino fundamental completo, experiência mínima de 1 ano como açougueiro, curso de manipulação de alimentos, conhecimento em cortes especiais.',
        salario_min: 2200,
        salario_max: 2800,
        quantidade_vagas: 2,
        beneficios: 'Vale transporte, vale alimentação (R$ 350/mês), plano de saúde, plano odontológico',
        status_id: 1
      },
      {
        empresa_id: empresas.supermercado,
        cargo: 'Gerente de Loja',
        descricao: 'Gestão completa da loja, liderança de equipe de 30+ colaboradores, controle de estoque, análise de vendas e metas, relacionamento com fornecedores. REQUISITOS: Ensino superior completo em Administração ou áreas afins, experiência mínima de 3 anos em gestão de varejo, liderança de equipes.',
        salario_min: 4500,
        salario_max: 6000,
        quantidade_vagas: 1,
        beneficios: 'Vale transporte, vale alimentação (R$ 500/mês), plano de saúde, plano odontológico, PLR, carro da empresa',
        status_id: 1
      },
      {
        empresa_id: empresas.supermercado,
        cargo: 'Padeiro',
        descricao: 'Produção de pães, bolos e salgados. Controle de qualidade dos produtos, organização da área de trabalho. REQUISITOS: Ensino fundamental completo, experiência mínima de 1 ano como padeiro, curso de panificação será um diferencial.',
        salario_min: 2000,
        salario_max: 2500,
        quantidade_vagas: 2,
        beneficios: 'Vale transporte, vale alimentação (R$ 300/mês), plano de saúde',
        status_id: 1
      },

      // CONSTRUTORA NORTE SUL - Construção Civil
      {
        empresa_id: empresas.construtora,
        cargo: 'Pedreiro',
        descricao: 'Execução de alvenaria, revestimentos, acabamentos. Leitura de projetos básicos, trabalho em obras residenciais e comerciais. REQUISITOS: Experiência mínima de 2 anos como pedreiro, conhecimento em leitura de projetos, disponibilidade para viagens, NR-18 atualizada.',
        salario_min: 2500,
        salario_max: 3200,
        quantidade_vagas: 8,
        beneficios: 'Vale transporte, vale alimentação (R$ 400/mês), alojamento em obras fora da cidade, seguro de vida',
        status_id: 1
      },
      {
        empresa_id: empresas.construtora,
        cargo: 'Eletricista Predial',
        descricao: 'Instalação e manutenção elétrica em obras residenciais e comerciais. Leitura de projetos elétricos, passagem de fiação, instalação de quadros. REQUISITOS: Curso técnico em Eletrotécnica ou similar, experiência mínima de 2 anos, NR-10 atualizada.',
        salario_min: 2800,
        salario_max: 3500,
        quantidade_vagas: 4,
        beneficios: 'Vale transporte, vale alimentação (R$ 400/mês), plano de saúde, seguro de vida',
        status_id: 1
      },
      {
        empresa_id: empresas.construtora,
        cargo: 'Mestre de Obras',
        descricao: 'Supervisão de equipes de obra, controle de cronograma e qualidade, gestão de materiais, interface com engenheiros e clientes. REQUISITOS: Ensino médio completo, curso técnico em edificações será diferencial, experiência mínima de 5 anos como mestre de obras.',
        salario_min: 5000,
        salario_max: 7000,
        quantidade_vagas: 2,
        beneficios: 'Vale transporte, vale alimentação (R$ 500/mês), plano de saúde, plano odontológico, PLR, veículo da empresa',
        status_id: 1
      },
      {
        empresa_id: empresas.construtora,
        cargo: 'Ajudante de Obras',
        descricao: 'Auxílio nas atividades de construção, transporte de materiais, limpeza do canteiro de obras, apoio aos profissionais especializados. REQUISITOS: Ensino fundamental (cursando ou completo), boa condição física, disponibilidade de horário, vontade de aprender.',
        salario_min: 1500,
        salario_max: 1800,
        quantidade_vagas: 10,
        beneficios: 'Vale transporte, vale alimentação (R$ 300/mês), cesta básica',
        status_id: 1
      },
      {
        empresa_id: empresas.construtora,
        cargo: 'Engenheiro Civil',
        descricao: 'Elaboração e acompanhamento de projetos, fiscalização de obras, emissão de laudos técnicos, gestão de equipes técnicas. REQUISITOS: Graduação em Engenharia Civil, CREA ativo, experiência mínima de 3 anos em obras de médio/grande porte, conhecimento em AutoCAD e MS Project.',
        salario_min: 8000,
        salario_max: 12000,
        quantidade_vagas: 1,
        beneficios: 'Vale transporte, vale alimentação (R$ 600/mês), plano de saúde, plano odontológico, PLR, veículo da empresa, celular corporativo',
        status_id: 1
      },

      // HOSPITAL SÃO LUCAS - Saúde
      {
        empresa_id: empresas.hospital,
        cargo: 'Técnico de Enfermagem',
        descricao: 'Assistência aos pacientes, administração de medicamentos, curativos, aferição de sinais vitais, apoio à equipe de enfermagem. REQUISITOS: Curso técnico em Enfermagem completo, COREN ativo, experiência mínima de 1 ano em ambiente hospitalar, disponibilidade para plantões.',
        salario_min: 2500,
        salario_max: 3200,
        quantidade_vagas: 10,
        beneficios: 'Vale transporte, vale alimentação (R$ 400/mês), plano de saúde, plano odontológico, adicional noturno, insalubridade',
        status_id: 1
      },
      {
        empresa_id: empresas.hospital,
        cargo: 'Enfermeiro(a)',
        descricao: 'Coordenação da equipe de enfermagem, elaboração de planos de cuidados, supervisão de procedimentos, gestão de leitos. REQUISITOS: Graduação em Enfermagem, COREN ativo, especialização em área hospitalar será diferencial, experiência mínima de 2 anos.',
        salario_min: 4500,
        salario_max: 6000,
        quantidade_vagas: 4,
        beneficios: 'Vale transporte, vale alimentação (R$ 500/mês), plano de saúde, plano odontológico, adicional noturno, insalubridade, PLR',
        status_id: 1
      },
      {
        empresa_id: empresas.hospital,
        cargo: 'Recepcionista Hospitalar',
        descricao: 'Atendimento ao público, agendamento de consultas, organização de prontuários, orientação aos pacientes e familiares. REQUISITOS: Ensino médio completo, experiência em atendimento ao público, conhecimento em informática, boa comunicação, empatia.',
        salario_min: 1600,
        salario_max: 2000,
        quantidade_vagas: 3,
        beneficios: 'Vale transporte, vale alimentação (R$ 300/mês), plano de saúde após 3 meses',
        status_id: 1
      },
      {
        empresa_id: empresas.hospital,
        cargo: 'Auxiliar de Limpeza Hospitalar',
        descricao: 'Limpeza e desinfecção de áreas hospitalares, seguindo protocolos de biossegurança. Coleta e descarte de resíduos. REQUISITOS: Ensino fundamental completo, experiência em limpeza hospitalar será diferencial, disponibilidade para plantões, curso de biossegurança.',
        salario_min: 1500,
        salario_max: 1800,
        quantidade_vagas: 5,
        beneficios: 'Vale transporte, vale alimentação (R$ 280/mês), plano de saúde, insalubridade',
        status_id: 1
      },
      {
        empresa_id: empresas.hospital,
        cargo: 'Fisioterapeuta',
        descricao: 'Atendimento fisioterapêutico em UTI e enfermarias, reabilitação respiratória e motora, elaboração de planos de tratamento. REQUISITOS: Graduação em Fisioterapia, CREFITO ativo, especialização em Fisioterapia Hospitalar ou Respiratória, experiência mínima de 1 ano em UTI.',
        salario_min: 4000,
        salario_max: 5500,
        quantidade_vagas: 2,
        beneficios: 'Vale transporte, vale alimentação (R$ 450/mês), plano de saúde, plano odontológico',
        status_id: 1
      },

      // RESTAURANTE SABOR DA TERRA - Alimentação
      {
        empresa_id: empresas.restaurante,
        cargo: 'Cozinheiro(a)',
        descricao: 'Preparo de refeições, elaboração de cardápios, controle de estoque de alimentos, manutenção da limpeza da cozinha. REQUISITOS: Ensino fundamental completo, experiência mínima de 2 anos como cozinheiro, curso de manipulação de alimentos, conhecimento em culinária regional.',
        salario_min: 2200,
        salario_max: 2800,
        quantidade_vagas: 3,
        beneficios: 'Vale transporte, alimentação no local, plano de saúde após 6 meses',
        status_id: 1
      },
      {
        empresa_id: empresas.restaurante,
        cargo: 'Garçom/Garçonete',
        descricao: 'Atendimento às mesas, anotação de pedidos, serviço de bebidas e alimentos, organização do salão. REQUISITOS: Ensino médio completo, experiência em atendimento ao público, boa apresentação pessoal, disponibilidade para trabalhar finais de semana.',
        salario_min: 1500,
        salario_max: 1800,
        quantidade_vagas: 5,
        beneficios: 'Vale transporte, alimentação no local, gorjetas (média R$ 500/mês)',
        status_id: 1
      },
      {
        empresa_id: empresas.restaurante,
        cargo: 'Auxiliar de Cozinha',
        descricao: 'Auxílio no preparo de alimentos, organização da cozinha, higienização de utensílios, apoio ao cozinheiro. REQUISITOS: Ensino fundamental completo, curso de manipulação de alimentos, disponibilidade de horário, vontade de aprender.',
        salario_min: 1400,
        salario_max: 1600,
        quantidade_vagas: 4,
        beneficios: 'Vale transporte, alimentação no local',
        status_id: 1
      },
      {
        empresa_id: empresas.restaurante,
        cargo: 'Chef de Cozinha',
        descricao: 'Gestão completa da cozinha, criação de cardápios, treinamento de equipe, controle de custos, garantia da qualidade dos pratos. REQUISITOS: Curso técnico ou superior em Gastronomia, experiência mínima de 3 anos como chef, liderança de equipes, criatividade culinária.',
        salario_min: 4000,
        salario_max: 5500,
        quantidade_vagas: 1,
        beneficios: 'Vale transporte, alimentação no local, plano de saúde, PLR',
        status_id: 1
      },

      // TECHRO - Tecnologia
      {
        empresa_id: empresas.techro,
        cargo: 'Desenvolvedor Full Stack',
        descricao: 'Desenvolvimento de aplicações web e mobile, APIs REST, integração de sistemas. Stack: React, Node.js, TypeScript, PostgreSQL. REQUISITOS: Graduação em Sistemas de Informação, Ciência da Computação ou áreas afins, experiência mínima de 2 anos com React e Node.js.',
        salario_min: 6000,
        salario_max: 10000,
        quantidade_vagas: 3,
        beneficios: 'Vale alimentação (R$ 800/mês), plano de saúde, plano odontológico, home office híbrido, auxílio home office, Gympass, day off aniversário',
        status_id: 1
      },
      {
        empresa_id: empresas.techro,
        cargo: 'Analista de Suporte N2',
        descricao: 'Atendimento técnico a usuários, resolução de problemas de infraestrutura, documentação de procedimentos, suporte a sistemas. REQUISITOS: Curso técnico ou superior em TI, experiência mínima de 1 ano em suporte técnico, conhecimento em Windows Server, redes e Active Directory.',
        salario_min: 2500,
        salario_max: 3500,
        quantidade_vagas: 2,
        beneficios: 'Vale alimentação (R$ 500/mês), plano de saúde, home office parcial',
        status_id: 1
      },
      {
        empresa_id: empresas.techro,
        cargo: 'Designer UI/UX',
        descricao: 'Criação de interfaces de usuário, prototipação, pesquisa com usuários, design system, colaboração com desenvolvedores. REQUISITOS: Graduação em Design ou áreas afins, experiência mínima de 2 anos com UI/UX, domínio de Figma, portfólio com projetos web/mobile.',
        salario_min: 4000,
        salario_max: 6000,
        quantidade_vagas: 1,
        beneficios: 'Vale alimentação (R$ 600/mês), plano de saúde, home office híbrido, auxílio home office',
        status_id: 1
      },
      {
        empresa_id: empresas.techro,
        cargo: 'Estagiário de Desenvolvimento',
        descricao: 'Auxílio no desenvolvimento de sistemas, aprendizado de boas práticas, participação em projetos reais sob supervisão. REQUISITOS: Cursando Sistemas de Informação, Ciência da Computação ou áreas afins (a partir do 3º período), conhecimento básico em programação.',
        salario_min: 1200,
        salario_max: 1800,
        quantidade_vagas: 2,
        beneficios: 'Bolsa auxílio, vale transporte, possibilidade de efetivação',
        status_id: 1
      },
      {
        empresa_id: empresas.techro,
        cargo: 'Analista de Dados',
        descricao: 'Análise de dados, criação de dashboards e relatórios, modelagem de dados, suporte à tomada de decisão. REQUISITOS: Graduação em Estatística, Ciência da Computação ou áreas afins, experiência com SQL, Python e ferramentas de BI (Power BI, Tableau).',
        salario_min: 5000,
        salario_max: 7500,
        quantidade_vagas: 1,
        beneficios: 'Vale alimentação (R$ 700/mês), plano de saúde, plano odontológico, home office híbrido, auxílio home office',
        status_id: 1
      }
    ]

    // Inserir vagas
    const { data, error } = await supabase
      .from('vagas')
      .insert(vagas)
      .select()

    if (error) {
      console.error('Erro ao inserir vagas:', error)
      return NextResponse.json(
        { error: 'Erro ao inserir vagas', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${data?.length || 0} vagas inseridas com sucesso`,
      vagas: data
    })

  } catch (error) {
    console.error('Erro na API seed-vagas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
