'use client'

import { useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: Error | null
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: Error | null; user: User | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
  refreshSession: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  const supabase = getSupabaseClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error,
          loading: false,
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }))

        // Handle specific events
        if (event === 'SIGNED_OUT') {
          // Clear any cached data
        } else if (event === 'TOKEN_REFRESHED') {
          // Session was refreshed
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      return { error: null }
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }))
      return { error: error as Error }
    }
  }, [supabase.auth])

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata?: Record<string, unknown>
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) throw error
      
      return { error: null, user: data.user }
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }))
      return { error: error as Error, user: null }
    }
  }, [supabase.auth])

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await supabase.auth.signOut()
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, loading: false }))
    }
  }, [supabase.auth])

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recuperar-senha/nova-senha`,
      })

      if (error) throw error
      
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }, [supabase.auth])

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }, [supabase.auth])

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }))
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }))
    }
  }, [supabase.auth])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  }
}
