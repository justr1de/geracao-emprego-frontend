'use client'

import { useState, useRef, useEffect } from 'react'
import { Lightbulb, X, ChevronRight, Star, TrendingUp, Target, Award } from 'lucide-react'
import styles from './index.module.css'

// Dicas organizadas por seção do perfil
export const PROFILE_TIPS = {
  foto: {
    title: 'Foto Profissional',
    icon: '📸',
    tips: [
      'Use uma foto recente e com boa iluminação',
      'Prefira fundo neutro (branco ou cinza claro)',
      'Vista-se de forma profissional',
      'Sorria de forma natural e confiante',
      'Evite selfies ou fotos de festas'
    ],
    impact: 'Perfis com foto têm 70% mais visualizações'
  },
  sobre: {
    title: 'Resumo Profissional',
    icon: '✍️',
    tips: [
      'Escreva em primeira pessoa de forma objetiva',
      'Destaque suas principais competências',
      'Mencione sua área de atuação e experiência',
      'Inclua seus objetivos profissionais',
      'Mantenha entre 3 a 5 linhas'
    ],
    impact: 'Um bom resumo aumenta em 40% as chances de contato'
  },
  experiencia: {
    title: 'Experiência Profissional',
    icon: '💼',
    tips: [
      'Liste da mais recente para a mais antiga',
      'Use verbos de ação: "desenvolvi", "gerenciei", "implementei"',
      'Quantifique resultados quando possível',
      'Descreva responsabilidades e conquistas',
      'Inclua palavras-chave da sua área'
    ],
    impact: 'Experiências bem descritas dobram as chances de seleção'
  },
  formacao: {
    title: 'Formação Acadêmica',
    icon: '🎓',
    tips: [
      'Inclua cursos em andamento',
      'Mencione certificações relevantes',
      'Destaque cursos técnicos e profissionalizantes',
      'Adicione cursos online de plataformas reconhecidas',
      'Não esqueça de cursos do SENAI, SENAC, SEBRAE'
    ],
    impact: 'Formação completa aumenta a visibilidade em 35%'
  },
  habilidades: {
    title: 'Habilidades',
    icon: '⭐',
    tips: [
      'Liste habilidades técnicas (hard skills)',
      'Inclua habilidades comportamentais (soft skills)',
      'Seja honesto sobre seu nível de conhecimento',
      'Priorize habilidades relevantes para sua área',
      'Adicione idiomas e nível de proficiência'
    ],
    impact: 'Habilidades bem definidas facilitam o matching com vagas'
  },
  preferencias: {
    title: 'Preferências de Trabalho',
    icon: '🎯',
    tips: [
      'Defina uma pretensão salarial realista',
      'Seja flexível quanto ao tipo de contrato',
      'Indique disponibilidade de horário',
      'Mencione se aceita trabalho remoto',
      'Informe disponibilidade para viagens'
    ],
    impact: 'Preferências claras agilizam o processo seletivo'
  },
  certificados: {
    title: 'Certificados e Cursos',
    icon: '📜',
    tips: [
      'Adicione certificados de cursos gratuitos',
      'Inclua certificações profissionais',
      'Anexe comprovantes quando possível',
      'Destaque cursos recentes e relevantes',
      'Mencione a carga horária dos cursos'
    ],
    impact: 'Certificados comprovados aumentam a credibilidade'
  }
} as const

export type ProfileSection = keyof typeof PROFILE_TIPS

interface ProfileTipProps {
  section: ProfileSection
  className?: string
  variant?: 'inline' | 'card' | 'tooltip'
}

// Componente de dica inline (ícone com tooltip)
export function ProfileTip({ section, className = '', variant = 'tooltip' }: ProfileTipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const info = PROFILE_TIPS[section]

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

  if (variant === 'card') {
    return (
      <div className={`${styles.tipCard} ${className}`}>
        <div className={styles.tipCardHeader}>
          <span className={styles.tipIcon}>{info.icon}</span>
          <h4 className={styles.tipCardTitle}>{info.title}</h4>
        </div>
        <ul className={styles.tipList}>
          {info.tips.map((tip, index) => (
            <li key={index} className={styles.tipItem}>
              <ChevronRight size={14} className={styles.tipBullet} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <div className={styles.tipImpact}>
          <TrendingUp size={16} />
          <span>{info.impact}</span>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`${styles.inlineTip} ${className}`}>
        <Lightbulb size={16} className={styles.inlineIcon} />
        <span className={styles.inlineText}>{info.tips[0]}</span>
      </div>
    )
  }

  return (
    <span className={`${styles.container} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={`Dicas para ${info.title}`}
        aria-expanded={isOpen}
      >
        <Lightbulb size={16} />
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
            <button 
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Fechar dicas"
            >
              <X size={14} />
            </button>
          </div>

          <div className={styles.content}>
            <p className={styles.sectionTitle}>
              <Star size={14} /> Dicas para destacar seu perfil:
            </p>
            <ul className={styles.tipList}>
              {info.tips.map((tip, index) => (
                <li key={index} className={styles.tipItem}>
                  <ChevronRight size={12} className={styles.tipBullet} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footer}>
            <TrendingUp size={14} />
            <span>{info.impact}</span>
          </div>
        </div>
      )}
    </span>
  )
}

// Componente de barra de progresso do perfil
interface ProfileProgressProps {
  completedSections: ProfileSection[]
  className?: string
}

export function ProfileProgress({ completedSections, className = '' }: ProfileProgressProps) {
  const totalSections = Object.keys(PROFILE_TIPS).length
  const completedCount = completedSections.length
  const percentage = Math.round((completedCount / totalSections) * 100)

  const getProgressColor = () => {
    if (percentage < 40) return '#ef4444' // vermelho
    if (percentage < 70) return '#f59e0b' // amarelo
    return '#10b981' // verde
  }

  const getProgressLabel = () => {
    if (percentage < 40) return 'Iniciante'
    if (percentage < 70) return 'Intermediário'
    if (percentage < 100) return 'Avançado'
    return 'Completo'
  }

  return (
    <div className={`${styles.progressContainer} ${className}`}>
      <div className={styles.progressHeader}>
        <div className={styles.progressInfo}>
          <Target size={18} />
          <span>Força do Perfil</span>
        </div>
        <div className={styles.progressBadge} style={{ backgroundColor: getProgressColor() }}>
          <Award size={14} />
          <span>{getProgressLabel()}</span>
        </div>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getProgressColor()
          }}
        />
      </div>
      
      <div className={styles.progressStats}>
        <span>{completedCount} de {totalSections} seções completas</span>
        <span className={styles.progressPercent}>{percentage}%</span>
      </div>

      {percentage < 100 && (
        <div className={styles.progressTip}>
          <Lightbulb size={14} />
          <span>
            Complete seu perfil para aumentar suas chances de ser encontrado por empresas!
          </span>
        </div>
      )}
    </div>
  )
}

// Componente de sugestões de melhoria
interface ProfileSuggestionsProps {
  incompleteSections: ProfileSection[]
  className?: string
}

export function ProfileSuggestions({ incompleteSections, className = '' }: ProfileSuggestionsProps) {
  if (incompleteSections.length === 0) {
    return (
      <div className={`${styles.suggestionsComplete} ${className}`}>
        <Award size={24} />
        <h4>Parabéns! Seu perfil está completo!</h4>
        <p>Continue atualizando suas informações para manter seu perfil relevante.</p>
      </div>
    )
  }

  return (
    <div className={`${styles.suggestionsContainer} ${className}`}>
      <div className={styles.suggestionsHeader}>
        <Lightbulb size={20} />
        <h4>Sugestões para melhorar seu perfil</h4>
      </div>
      
      <div className={styles.suggestionsList}>
        {incompleteSections.slice(0, 3).map((section) => {
          const info = PROFILE_TIPS[section]
          return (
            <div key={section} className={styles.suggestionItem}>
              <span className={styles.suggestionIcon}>{info.icon}</span>
              <div className={styles.suggestionContent}>
                <strong>{info.title}</strong>
                <p>{info.tips[0]}</p>
              </div>
              <ChevronRight size={16} className={styles.suggestionArrow} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProfileTip
