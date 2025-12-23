'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const type = searchParams.get('type')
      const error = searchParams.get('error')
      const error_description = searchParams.get('error_description')

      // Se houver erro na URL
      if (error) {
        setStatus('error')
        setMessage(error_description || 'Ocorreu um erro na verificação')
        return
      }

      // Se for confirmação de e-mail
      if (type === 'email_confirmation' || type === 'signup') {
        try {
          // Importa dinamicamente para evitar erro de prerender
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()

          // O Supabase geralmente já processa o token automaticamente
          // Mas podemos verificar a sessão
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()

          if (sessionError) {
            throw sessionError
          }

          if (session) {
            setStatus('success')
            setMessage('E-mail confirmado com sucesso! Redirecionando...')
            
            // Redireciona após 2 segundos
            setTimeout(() => {
              router.push('/login?verified=true')
            }, 2000)
          } else {
            // Se não há sessão, o token pode ter expirado
            setStatus('error')
            setMessage('Link de confirmação expirado. Por favor, solicite um novo.')
          }
        } catch (err) {
          console.error('Erro no callback:', err)
          setStatus('error')
          setMessage('Erro ao processar confirmação de e-mail')
        }
      }

      // Se for recuperação de senha
      else if (type === 'recovery') {
        setStatus('success')
        setMessage('Redirecionando para redefinição de senha...')
        
        setTimeout(() => {
          router.push('/recuperar-senha/nova-senha')
        }, 1000)
      }

      // Tipo desconhecido
      else {
        setStatus('error')
        setMessage('Tipo de callback não reconhecido')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className={styles.card}>
      {status === 'loading' && (
        <>
          <div className={styles.spinner} />
          <h1 className={styles.title}>Processando...</h1>
          <p className={styles.message}>Aguarde enquanto verificamos suas informações.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className={styles.iconSuccess}>✓</div>
          <h1 className={styles.title}>Sucesso!</h1>
          <p className={styles.message}>{message}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className={styles.iconError}>✕</div>
          <h1 className={styles.title}>Erro</h1>
          <p className={styles.message}>{message}</p>
          <button 
            className={styles.button}
            onClick={() => router.push('/login')}
          >
            Voltar para Login
          </button>
        </>
      )}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className={styles.card}>
      <div className={styles.spinner} />
      <h1 className={styles.title}>Carregando...</h1>
      <p className={styles.message}>Aguarde um momento.</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<LoadingFallback />}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  )
}
