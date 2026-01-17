import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET - Listar currículos públicos (candidatos)
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de busca e paginação
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const cidade = searchParams.get('cidade') || ''
    const estado = searchParams.get('estado') || ''
    
    const offset = (page - 1) * limit

    // Construir query base
    let query = supabase
      .from('candidatos')
      .select(`
        user_id,
        nome_completo,
        cidade,
        estado,
        genero,
        eh_pcd,
        foto_url
      `, { count: 'exact' })
      .not('nome_completo', 'is', null)
      .order('nome_completo', { ascending: true })

    // Aplicar filtros
    if (search) {
      query = query.or(`nome_completo.ilike.%${search}%,cidade.ilike.%${search}%`)
    }
    
    if (cidade) {
      query = query.ilike('cidade', `%${cidade}%`)
    }
    
    if (estado) {
      query = query.eq('estado', estado)
    }

    // Aplicar paginação
    query = query.range(offset, offset + limit - 1)

    const { data: candidatos, error, count } = await query

    if (error) {
      console.error('Erro ao buscar currículos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar currículos' },
        { status: 500 }
      )
    }

    // Calcular total de páginas
    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      curriculos: candidatos || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      }
    })

  } catch (error) {
    console.error('Erro ao buscar currículos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
