'use client'

import { useState } from 'react'
import { Send, Check, Loader2, X, AlertCircle } from 'lucide-react'
import { useCandidatura } from '@/hooks/useApi'
import { useAuthContext } from '@/contexts/AuthContext'
import styles from './index.module.css'

interface CandidaturaButtonProps {
  vagaId: string
  vagaTitulo: string
  onSuccess?: () => void
  className?: string
  jaCandidatou?: boolean
}

export function CandidaturaButton({ 
  vagaId, 
  vagaTitulo, 
  onSuccess,
  className = '',
  jaCandidatou = false
}: CandidaturaButtonProps) {
  const { isAuthenticated, isCandidate, user } = useAuthContext()
  const { candidatar, loading, error } = useCandidatura()
  const [showModal, setShowModal] = useState(false)
  const [cartaApresentacao, setCartaApresentacao] = useState('')
  const [candidaturaEnviada, setCandidaturaEnviada] = useState(jaCandidatou)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirecionar para login
      window.location.href = `/login?redirect=/vagas&vaga=${vagaId}`
      return
    }

    if (!isCandidate) {
      setSubmitError('Apenas candidatos podem se candidatar a vagas.')
      return
    }

    if (candidaturaEnviada) {
      return
    }

    setShowModal(true)
  }

  const handleSubmit = async () => {
    setSubmitError(null)
    
    const result = await candidatar(vagaId, cartaApresentacao || undefined)
    
    if (result.success) {
      setCandidaturaEnviada(true)
      setShowModal(false)
      onSuccess?.()
    } else {
      setSubmitError(result.error || 'Erro ao enviar candidatura')
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setCartaApresentacao('')
    setSubmitError(null)
  }

  if (candidaturaEnviada) {
    return (
      <button 
        className={`${styles.button} ${styles.candidatado} ${className}`}
        disabled
      >
        <Check size={18} />
        <span>Candidatura Enviada</span>
      </button>
    )
  }

  return (
    <>
      <button 
        className={`${styles.button} ${className}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Candidatar-se</span>
          </>
        )}
      </button>

      {/* Modal de Candidatura */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleClose}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <Send size={32} className={styles.modalIcon} />
              <h2>Candidatar-se à vaga</h2>
              <p className={styles.vagaTitulo}>{vagaTitulo}</p>
            </div>

            {submitError && (
              <div className={styles.errorMessage}>
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            <div className={styles.modalContent}>
              <div className={styles.infoBox}>
                <p>
                  <strong>Candidato:</strong> {user?.user_metadata?.nome_completo || 'Não identificado'}
                </p>
                <p>
                  <strong>E-mail:</strong> {user?.email}
                </p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="carta">
                  Carta de Apresentação <span className={styles.optional}>(opcional)</span>
                </label>
                <textarea
                  id="carta"
                  value={cartaApresentacao}
                  onChange={(e) => setCartaApresentacao(e.target.value)}
                  placeholder="Escreva uma breve apresentação sobre você e por que deseja esta vaga..."
                  rows={5}
                  maxLength={1000}
                />
                <span className={styles.charCount}>
                  {cartaApresentacao.length}/1000 caracteres
                </span>
              </div>

              <div className={styles.lgpdNotice}>
                <AlertCircle size={16} />
                <p>
                  Ao se candidatar, você autoriza o compartilhamento do seu currículo 
                  com a empresa responsável pela vaga, conforme nossa{' '}
                  <a href="/politica-privacidade" target="_blank">Política de Privacidade</a>.
                </p>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button 
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Confirmar Candidatura
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
