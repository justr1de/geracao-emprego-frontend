'use client'

import { useState, useCallback } from 'react'

interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

interface UseApiReturn<T> extends ApiResponse<T> {
  execute: (options?: RequestInit) => Promise<T | null>
  reset: () => void
}

export function useApi<T = unknown>(endpoint: string): UseApiReturn<T> {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  })

  const execute = useCallback(async (options?: RequestInit): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na requisição')
      }

      setState({ data: result, error: null, loading: false })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setState({ data: null, error: errorMessage, loading: false })
      return null
    }
  }, [endpoint])

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Hook específico para registro
export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (data: {
    email: string
    password: string
    nome_completo: string
    cpf: string
    telefone?: string
    data_nascimento?: string
    genero?: string
    tipo_usuario?: number
    lgpd_aceito: boolean
  }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar conta')
      }

      return { success: true, user: result.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  return { register, loading, error }
}

// Hook específico para login
export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao fazer login')
      }

      return { success: true, user: result.user }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  return { login, loading, error }
}

// Hook para candidaturas
export function useCandidatura() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const candidatar = useCallback(async (vaga_id: string, carta_apresentacao?: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/candidaturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaga_id, carta_apresentacao }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao se candidatar')
      }

      return { success: true, candidatura: result.candidatura }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelar = useCallback(async (candidatura_id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/candidaturas/${candidatura_id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao cancelar candidatura')
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  return { candidatar, cancelar, loading, error }
}

// Hook para buscar dados de referência
export function useReferencias() {
  const [data, setData] = useState<Record<string, unknown[]> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReferencias = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/referencias')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao buscar referências')
      }

      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchReferencias }
}
