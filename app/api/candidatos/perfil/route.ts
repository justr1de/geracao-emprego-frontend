import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Buscar perfil completo do candidato
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar dados do candidato com todas as relações
    const { data: candidato, error: candidatoError } = await supabase
      .from('candidatos')
      .select(`
        *,
        estado_civil:estados_civis(id, nome),
        tipo_deficiencia:tipos_deficiencia(id, nome),
        categoria_cnh:categorias_cnh(id, nome)
      `)
      .eq('user_id', user.id)
      .single();

    if (candidatoError && candidatoError.code !== 'PGRST116') {
      console.error('Erro ao buscar candidato:', candidatoError);
      return NextResponse.json(
        { error: 'Erro ao buscar dados do candidato' },
        { status: 500 }
      );
    }

    // Buscar currículo
    const { data: curriculo } = await supabase
      .from('curriculos')
      .select(`
        *,
        nivel_escolaridade:niveis_escolaridade(id, nome),
        modelo_trabalho:modelos_trabalho(id, nome),
        tipo_contrato:tipos_contrato(id, nome)
      `)
      .eq('candidato_id', user.id)
      .single();

    // Buscar experiências profissionais
    const { data: experiencias } = await supabase
      .from('experiencias_profissionais')
      .select(`
        *,
        tipo_contrato:tipos_contrato(id, nome)
      `)
      .eq('curriculo_id', curriculo?.id)
      .order('data_inicio', { ascending: false });

    // Buscar formações acadêmicas
    const { data: formacoes } = await supabase
      .from('formacoes_academicas')
      .select(`
        *,
        nivel_escolaridade:niveis_escolaridade(id, nome)
      `)
      .eq('curriculo_id', curriculo?.id)
      .order('data_inicio', { ascending: false });

    // Buscar habilidades do candidato
    const { data: habilidades } = await supabase
      .from('candidato_habilidades')
      .select(`
        habilidade:habilidades(id, nome, grupo)
      `)
      .eq('candidato_id', user.id);

    // Buscar idiomas do candidato
    const { data: idiomas } = await supabase
      .from('candidato_idiomas')
      .select(`
        idioma:idiomas(id, nome, codigo),
        nivel:niveis_idioma(id, nome, ordem)
      `)
      .eq('candidato_id', user.id);

    // Buscar cursos complementares
    const { data: cursosComplementares } = await supabase
      .from('cursos_complementares')
      .select('*')
      .eq('candidato_id', user.id)
      .order('data_conclusao', { ascending: false });

    // Buscar preferências de emprego
    const { data: preferencias } = await supabase
      .from('preferencias_emprego')
      .select(`
        *,
        modelo_trabalho:modelos_trabalho(id, nome),
        tipo_contrato:tipos_contrato(id, nome),
        disponibilidade_horario:disponibilidades_horario(id, nome)
      `)
      .eq('candidato_id', user.id)
      .single();

    // Buscar áreas de interesse
    const { data: areasInteresse } = await supabase
      .from('candidato_areas_interesse')
      .select(`
        area:areas_vaga(id, nome)
      `)
      .eq('candidato_id', user.id);

    // Buscar zonas de interesse
    const { data: zonasInteresse } = await supabase
      .from('candidato_zonas_interesse')
      .select(`
        zona:zonas(id, nome)
      `)
      .eq('candidato_id', user.id);

    return NextResponse.json({
      candidato,
      curriculo,
      experiencias: experiencias || [],
      formacoes: formacoes || [],
      habilidades: habilidades?.map(h => h.habilidade) || [],
      idiomas: idiomas?.map(i => ({ ...i.idioma, nivel: i.nivel })) || [],
      cursos_complementares: cursosComplementares || [],
      preferencias,
      areas_interesse: areasInteresse?.map(a => a.area) || [],
      zonas_interesse: zonasInteresse?.map(z => z.zona) || []
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar/Atualizar perfil completo do candidato
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      dados_pessoais,
      endereco,
      curriculo,
      experiencias,
      formacoes,
      habilidades,
      idiomas,
      cursos_complementares,
      preferencias,
      areas_interesse,
      zonas_interesse
    } = body;

    // 1. Atualizar dados pessoais do candidato
    if (dados_pessoais) {
      const { error: candidatoError } = await supabase
        .from('candidatos')
        .upsert({
          user_id: user.id,
          ...dados_pessoais,
          ...endereco
        }, { onConflict: 'user_id' });

      if (candidatoError) {
        console.error('Erro ao atualizar candidato:', candidatoError);
        return NextResponse.json(
          { error: 'Erro ao atualizar dados pessoais' },
          { status: 500 }
        );
      }
    }

    // 2. Criar/Atualizar currículo
    if (curriculo) {
      const { data: curriculoData, error: curriculoError } = await supabase
        .from('curriculos')
        .upsert({
          candidato_id: user.id,
          ...curriculo,
          updated_at: new Date().toISOString()
        }, { onConflict: 'candidato_id' })
        .select()
        .single();

      if (curriculoError) {
        console.error('Erro ao atualizar currículo:', curriculoError);
        return NextResponse.json(
          { error: 'Erro ao atualizar currículo' },
          { status: 500 }
        );
      }

      // 3. Atualizar experiências profissionais
      if (experiencias && curriculoData) {
        // Remover experiências antigas
        await supabase
          .from('experiencias_profissionais')
          .delete()
          .eq('curriculo_id', curriculoData.id);

        // Inserir novas experiências
        if (experiencias.length > 0) {
          const experienciasData = experiencias.map((exp: any) => ({
            ...exp,
            curriculo_id: curriculoData.id
          }));

          const { error: expError } = await supabase
            .from('experiencias_profissionais')
            .insert(experienciasData);

          if (expError) {
            console.error('Erro ao inserir experiências:', expError);
          }
        }
      }

      // 4. Atualizar formações acadêmicas
      if (formacoes && curriculoData) {
        // Remover formações antigas
        await supabase
          .from('formacoes_academicas')
          .delete()
          .eq('curriculo_id', curriculoData.id);

        // Inserir novas formações
        if (formacoes.length > 0) {
          const formacoesData = formacoes.map((form: any) => ({
            ...form,
            curriculo_id: curriculoData.id
          }));

          const { error: formError } = await supabase
            .from('formacoes_academicas')
            .insert(formacoesData);

          if (formError) {
            console.error('Erro ao inserir formações:', formError);
          }
        }
      }
    }

    // 5. Atualizar habilidades
    if (habilidades) {
      // Remover habilidades antigas
      await supabase
        .from('candidato_habilidades')
        .delete()
        .eq('candidato_id', user.id);

      // Inserir novas habilidades
      if (habilidades.length > 0) {
        const habilidadesData = habilidades.map((habilidade_id: number) => ({
          candidato_id: user.id,
          habilidade_id
        }));

        const { error: habError } = await supabase
          .from('candidato_habilidades')
          .insert(habilidadesData);

        if (habError) {
          console.error('Erro ao inserir habilidades:', habError);
        }
      }
    }

    // 6. Atualizar idiomas
    if (idiomas) {
      // Remover idiomas antigos
      await supabase
        .from('candidato_idiomas')
        .delete()
        .eq('candidato_id', user.id);

      // Inserir novos idiomas
      if (idiomas.length > 0) {
        const idiomasData = idiomas.map((idioma: any) => ({
          candidato_id: user.id,
          idioma_id: idioma.idioma_id,
          nivel_id: idioma.nivel_id
        }));

        const { error: idiomaError } = await supabase
          .from('candidato_idiomas')
          .insert(idiomasData);

        if (idiomaError) {
          console.error('Erro ao inserir idiomas:', idiomaError);
        }
      }
    }

    // 7. Atualizar cursos complementares
    if (cursos_complementares) {
      // Remover cursos antigos
      await supabase
        .from('cursos_complementares')
        .delete()
        .eq('candidato_id', user.id);

      // Inserir novos cursos
      if (cursos_complementares.length > 0) {
        const cursosData = cursos_complementares.map((curso: any) => ({
          ...curso,
          candidato_id: user.id
        }));

        const { error: cursoError } = await supabase
          .from('cursos_complementares')
          .insert(cursosData);

        if (cursoError) {
          console.error('Erro ao inserir cursos:', cursoError);
        }
      }
    }

    // 8. Atualizar preferências de emprego
    if (preferencias) {
      const { error: prefError } = await supabase
        .from('preferencias_emprego')
        .upsert({
          candidato_id: user.id,
          ...preferencias,
          updated_at: new Date().toISOString()
        }, { onConflict: 'candidato_id' });

      if (prefError) {
        console.error('Erro ao atualizar preferências:', prefError);
      }
    }

    // 9. Atualizar áreas de interesse
    if (areas_interesse) {
      // Remover áreas antigas
      await supabase
        .from('candidato_areas_interesse')
        .delete()
        .eq('candidato_id', user.id);

      // Inserir novas áreas
      if (areas_interesse.length > 0) {
        const areasData = areas_interesse.map((area_id: number) => ({
          candidato_id: user.id,
          area_id
        }));

        const { error: areaError } = await supabase
          .from('candidato_areas_interesse')
          .insert(areasData);

        if (areaError) {
          console.error('Erro ao inserir áreas:', areaError);
        }
      }
    }

    // 10. Atualizar zonas de interesse
    if (zonas_interesse) {
      // Remover zonas antigas
      await supabase
        .from('candidato_zonas_interesse')
        .delete()
        .eq('candidato_id', user.id);

      // Inserir novas zonas
      if (zonas_interesse.length > 0) {
        const zonasData = zonas_interesse.map((zona_id: number) => ({
          candidato_id: user.id,
          zona_id
        }));

        const { error: zonaError } = await supabase
          .from('candidato_zonas_interesse')
          .insert(zonasData);

        if (zonaError) {
          console.error('Erro ao inserir zonas:', zonaError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
