'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './index.module.css'

// Tipos de dados sensíveis e suas justificativas conforme LGPD
export const LGPD_INFO = {
  cpf: {
    title: 'CPF',
    reason: 'Identificação única do cidadão para evitar duplicidade de cadastros e garantir a integridade do programa.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '🔒'
  },
  telefone: {
    title: 'Telefone/WhatsApp',
    reason: 'Comunicação sobre vagas de emprego, cursos e oportunidades compatíveis com seu perfil.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '📱'
  },
  email: {
    title: 'E-mail',
    reason: 'Envio de notificações sobre vagas, cursos e atualizações do programa.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '✉️'
  },
  dataNascimento: {
    title: 'Data de Nascimento',
    reason: 'Verificação de idade mínima para vagas e direcionamento para programas específicos (Jovem Aprendiz, etc).',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '📅'
  },
  genero: {
    title: 'Gênero',
    reason: 'Estatísticas para políticas de equidade de gênero no mercado de trabalho. Informação opcional.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Dados anonimizados para estatísticas',
    icon: '👤',
    optional: true
  },
  etnia: {
    title: 'Raça/Cor',
    reason: 'Estatísticas para políticas de inclusão e ações afirmativas no mercado de trabalho. Informação opcional.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Dados anonimizados para estatísticas',
    icon: '🌍',
    optional: true,
    sensitive: true
  },
  endereco: {
    title: 'Endereço',
    reason: 'Direcionamento de vagas e cursos próximos à sua localização, facilitando o acesso às oportunidades.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '📍'
  },
  cnpj: {
    title: 'CNPJ',
    reason: 'Identificação e validação da empresa para garantir a legitimidade das vagas publicadas.',
    legalBasis: 'Art. 7º, II da LGPD - Cumprimento de obrigação legal',
    retention: 'Enquanto a empresa estiver cadastrada',
    icon: '🏢'
  },
  curriculo: {
    title: 'Dados do Currículo',
    reason: 'Compartilhamento com empresas parceiras para matching de vagas compatíveis com seu perfil.',
    legalBasis: 'Art. 7º, I da LGPD - Consentimento do titular',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '📄'
  },
  experiencia: {
    title: 'Experiência Profissional',
    reason: 'Análise de compatibilidade com vagas disponíveis e geração de estatísticas do mercado de trabalho.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '💼'
  },
  formacao: {
    title: 'Formação Acadêmica',
    reason: 'Direcionamento para vagas e cursos adequados ao seu nível de escolaridade.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '🎓'
  },
  pcd: {
    title: 'Pessoa com Deficiência',
    reason: 'Direcionamento para vagas exclusivas PCD e cumprimento de cotas legais. Informação opcional.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '♿',
    optional: true,
    sensitive: true
  },
  salario: {
    title: 'Pretensão Salarial',
    reason: 'Matching com vagas compatíveis com sua expectativa salarial.',
    legalBasis: 'Art. 7º, III da LGPD - Execução de políticas públicas',
    retention: 'Enquanto durar o vínculo com o programa',
    icon: '💰'
  }
} as const

export type LGPDFieldType = keyof typeof LGPD_INFO

interface LGPDTooltipProps {
  field: LGPDFieldType
  className?: string
}

export function LGPDTooltip({ field, className = '' }: LGPDTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const info = LGPD_INFO[field]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <span className={`${styles.container} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.trigger} ${info.sensitive ? styles.sensitive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={`Informações sobre ${info.title}`}
        aria-expanded={isOpen}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={tooltipRef}
          className={styles.tooltip}
          role="tooltip"
        >
          <div className={styles.header}>
            <span className={styles.icon}>{info.icon}</span>
            <span className={styles.title}>{info.title}</span>
            {info.optional && (
              <span className={styles.optionalBadge}>Opcional</span>
            )}
            {info.sensitive && (
              <span className={styles.sensitiveBadge}>Dado Sensível</span>
            )}
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <strong>Por que coletamos:</strong>
              <p>{info.reason}</p>
            </div>

            <div className={styles.section}>
              <strong>Base Legal (LGPD):</strong>
              <p>{info.legalBasis}</p>
            </div>

            <div className={styles.section}>
              <strong>Tempo de retenção:</strong>
              <p>{info.retention}</p>
            </div>
          </div>

          <div className={styles.footer}>
            <span className={styles.governmentNote}>
              🏛️ Programa do Governo de Rondônia - SEDEC/SINE
            </span>
          </div>
        </div>
      )}
    </span>
  )
}

// Componente de label com tooltip integrado
interface LGPDLabelProps {
  field: LGPDFieldType
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

export function LGPDLabel({ field, children, htmlFor, required, className = '' }: LGPDLabelProps) {
  const info = LGPD_INFO[field]
  
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      <span className={styles.labelText}>
        {children}
        {required && !info.optional && <span className={styles.required}>*</span>}
        {info.optional && <span className={styles.optionalText}>(opcional)</span>}
      </span>
      <LGPDTooltip field={field} />
    </label>
  )
}
