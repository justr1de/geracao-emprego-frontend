'use client'

import { useState } from 'react'
import styles from './index.module.css'

interface LGPDConsentProps {
  onAccept: (accepted: boolean) => void
  accepted: boolean
  type: 'candidato' | 'empresa'
  showDetails?: boolean
}

export function LGPDConsent({ onAccept, accepted, type, showDetails = false }: LGPDConsentProps) {
  const [expanded, setExpanded] = useState(showDetails)

  const consentText = type === 'candidato' 
    ? {
        title: 'Consentimento para Tratamento de Dados Pessoais',
        summary: 'Ao me cadastrar no programa Geração Emprego, autorizo o Governo do Estado de Rondônia, por meio da SEDEC/SINE, a coletar e tratar meus dados pessoais para fins de intermediação de mão de obra e acesso a cursos de qualificação profissional.',
        details: [
          {
            title: 'Finalidade do Tratamento',
            content: 'Seus dados serão utilizados exclusivamente para: (1) Cadastro no Sistema Nacional de Emprego (SINE); (2) Intermediação de vagas de emprego; (3) Direcionamento para cursos de qualificação profissional; (4) Geração de estatísticas para políticas públicas de emprego.'
          },
          {
            title: 'Compartilhamento de Dados',
            content: 'Seus dados poderão ser compartilhados com: (1) Empresas parceiras do programa, quando você se candidatar a vagas; (2) Instituições de ensino parceiras, para inscrição em cursos; (3) Ministério do Trabalho e Emprego, conforme legislação vigente.'
          },
          {
            title: 'Seus Direitos',
            content: 'Você tem direito a: (1) Acessar seus dados a qualquer momento; (2) Corrigir dados incompletos ou desatualizados; (3) Solicitar a exclusão de seus dados; (4) Revogar este consentimento. Para exercer seus direitos, entre em contato pelo e-mail: lgpd@sedec.ro.gov.br'
          },
          {
            title: 'Base Legal',
            content: 'O tratamento de dados é realizado com base no Art. 7º, inciso III da Lei 13.709/2018 (LGPD) - execução de políticas públicas previstas em leis e regulamentos, e no Art. 7º, inciso I - mediante consentimento do titular.'
          }
        ]
      }
    : {
        title: 'Consentimento para Tratamento de Dados Empresariais',
        summary: 'Ao cadastrar minha empresa no programa Geração Emprego, autorizo o Governo do Estado de Rondônia, por meio da SEDEC/SINE, a coletar e tratar os dados da empresa e do responsável para fins de publicação de vagas e acesso a candidatos.',
        details: [
          {
            title: 'Finalidade do Tratamento',
            content: 'Os dados serão utilizados para: (1) Validação da empresa junto aos órgãos competentes; (2) Publicação de vagas de emprego; (3) Acesso a currículos de candidatos; (4) Comunicação sobre o programa e políticas de emprego.'
          },
          {
            title: 'Compartilhamento de Dados',
            content: 'Os dados da empresa serão exibidos publicamente na plataforma para candidatos interessados. Dados do responsável serão utilizados apenas para comunicação e validação.'
          },
          {
            title: 'Seus Direitos',
            content: 'A empresa tem direito a: (1) Acessar seus dados a qualquer momento; (2) Corrigir dados incompletos ou desatualizados; (3) Solicitar a exclusão do cadastro; (4) Revogar este consentimento.'
          },
          {
            title: 'Base Legal',
            content: 'O tratamento de dados é realizado com base no Art. 7º, inciso II da Lei 13.709/2018 (LGPD) - cumprimento de obrigação legal ou regulatória, e no Art. 7º, inciso I - mediante consentimento do titular.'
          }
        ]
      }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>🔐</span>
        <h3 className={styles.title}>{consentText.title}</h3>
      </div>

      <p className={styles.summary}>{consentText.summary}</p>

      <button 
        type="button"
        className={styles.expandButton}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? 'Ocultar detalhes' : 'Ver detalhes completos'}
        <svg 
          className={`${styles.expandIcon} ${expanded ? styles.expanded : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className={styles.details}>
          {consentText.details.map((detail, index) => (
            <div key={index} className={styles.detailSection}>
              <h4 className={styles.detailTitle}>{detail.title}</h4>
              <p className={styles.detailContent}>{detail.content}</p>
            </div>
          ))}
        </div>
      )}

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAccept(e.target.checked)}
          className={styles.checkbox}
        />
        <span className={styles.checkboxText}>
          Li e concordo com os termos de tratamento de dados pessoais conforme a LGPD
          <span className={styles.required}>*</span>
        </span>
      </label>

      <div className={styles.footer}>
        <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer" className={styles.link}>
          Política de Privacidade
        </a>
        <span className={styles.separator}>•</span>
        <a href="/termos-uso" target="_blank" rel="noopener noreferrer" className={styles.link}>
          Termos de Uso
        </a>
        <span className={styles.separator}>•</span>
        <span className={styles.contact}>
          Dúvidas: lgpd@sedec.ro.gov.br
        </span>
      </div>
    </div>
  )
}
