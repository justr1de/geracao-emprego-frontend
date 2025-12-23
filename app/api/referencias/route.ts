import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Obter todas as tabelas de referência
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tabela = searchParams.get('tabela')

    const supabase = await createClient()

    // Tabelas permitidas para consulta
    const tabelasPermitidas = [
      'tipos_usuario',
      'areas_vaga',
      'niveis_escolaridade',
      'modelos_trabalho',
      'tipos_contrato',
      'portes_empresa',
      'ramos_atuacao',
      'status_candidatura',
      'habilidades',
      'estados_civis',
      'tipos_deficiencia',
      'categorias_cnh',
      'idiomas',
      'niveis_idioma',
      'disponibilidades_horario',
      'niveis_experiencia',
      'zonas'
    ]

    // Se uma tabela específica foi solicitada
    if (tabela) {
      if (!tabelasPermitidas.includes(tabela)) {
        return NextResponse.json(
          { error: 'Tabela não encontrada' },
          { status: 404 }
        )
      }

      const { data, error } = await supabase
        .from(tabela)
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error(`Erro ao buscar ${tabela}:`, error)
        return NextResponse.json(
          { error: `Erro ao buscar ${tabela}` },
          { status: 500 }
        )
      }

      return NextResponse.json({ [tabela]: data })
    }

    // Buscar todas as tabelas de referência
    const [
      tiposUsuario,
      areasVaga,
      niveisEscolaridade,
      modelosTrabalho,
      tiposContrato,
      portesEmpresa,
      ramosAtuacao,
      statusCandidatura,
      habilidades,
      estadosCivis,
      tiposDeficiencia,
      categoriasCnh,
      idiomas,
      niveisIdioma,
      disponibilidadesHorario,
      niveisExperiencia,
      zonas
    ] = await Promise.all([
      supabase.from('tipos_usuario').select('*').order('id'),
      supabase.from('areas_vaga').select('*').order('nome'),
      supabase.from('niveis_escolaridade').select('*').order('ordem'),
      supabase.from('modelos_trabalho').select('*').order('id'),
      supabase.from('tipos_contrato').select('*').order('id'),
      supabase.from('portes_empresa').select('*').order('id'),
      supabase.from('ramos_atuacao').select('*').order('nome'),
      supabase.from('status_candidatura').select('*').order('id'),
      supabase.from('habilidades').select('*').order('nome'),
      supabase.from('estados_civis').select('*').order('id'),
      supabase.from('tipos_deficiencia').select('*').order('id'),
      supabase.from('categorias_cnh').select('*').order('id'),
      supabase.from('idiomas').select('*').order('nome'),
      supabase.from('niveis_idioma').select('*').order('ordem'),
      supabase.from('disponibilidades_horario').select('*').order('id'),
      supabase.from('niveis_experiencia').select('*').order('id'),
      supabase.from('zonas').select('*').order('nome')
    ])

    return NextResponse.json({
      tipos_usuario: tiposUsuario.data || [],
      areas_vaga: areasVaga.data || [],
      niveis_escolaridade: niveisEscolaridade.data || [],
      modelos_trabalho: modelosTrabalho.data || [],
      tipos_contrato: tiposContrato.data || [],
      portes_empresa: portesEmpresa.data || [],
      ramos_atuacao: ramosAtuacao.data || [],
      status_candidatura: statusCandidatura.data || [],
      habilidades: habilidades.data || [],
      estados_civis: estadosCivis.data || [],
      tipos_deficiencia: tiposDeficiencia.data || [],
      categorias_cnh: categoriasCnh.data || [],
      idiomas: idiomas.data || [],
      niveis_idioma: niveisIdioma.data || [],
      disponibilidades_horario: disponibilidadesHorario.data || [],
      niveis_experiencia: niveisExperiencia.data || [],
      zonas: zonas.data || []
    })

  } catch (error) {
    console.error('Erro ao buscar referências:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
