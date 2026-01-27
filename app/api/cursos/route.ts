import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Listar cursos (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de filtro
    const search = searchParams.get('search')
    const instituicao = searchParams.get('instituicao')
    const modalidade = searchParams.get('modalidade')
    const area = searchParams.get('area')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = await createClient()

    // Construir query
    let query = supabase
      .from('cursos')
      .select('*', { count: 'exact' })
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descricao.ilike.%${search}%`)
    }
    if (instituicao) {
      query = query.ilike('instituicao', `%${instituicao}%`)
    }
    if (modalidade) {
      query = query.eq('modalidade', modalidade)
    }
    if (area) {
      query = query.ilike('area', `%${area}%`)
    }

    // Paginação
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Erro ao listar cursos:', error)
      // Retornar array vazio em vez de erro
      return NextResponse.json({
        cursos: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        error: 'Erro ao buscar cursos'
      })
    }

    return NextResponse.json({
      cursos: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao listar cursos:', error)
    return NextResponse.json({
      cursos: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      },
      error: 'Erro interno do servidor'
    })
  }
}
