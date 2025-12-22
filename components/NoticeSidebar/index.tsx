"use client"

import { Calendar, Clock, Archive, ChevronRight } from "lucide-react"
import styles from "./index.module.css"

// Exportamos a interface para ser usada na page.tsx e evitar conflitos de tipos
export interface Notice {
  id: number
  title: string
  organization: string
  publishDate: string
  deadline: string
  type: string
  category: string
  // Adicionado campos opcionais para bater com o objeto completo
  description?: string
  requirements?: string[]
  benefits?: string[]
  courses?: string[]
  documents?: { name: string; size: string }[]
}

interface NoticeSidebarProps {
  notices: Notice[]
  selectedId: number
  onSelect: (notice: Notice) => void
}

export default function NoticeSidebar({ notices, selectedId, onSelect }: NoticeSidebarProps) {
  const today = new Date()
  
  // Lógica de filtro corrigida para tratar a string de data PT-BR
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/")
    return new Date(`${year}-${month}-${day}`)
  }

  const ongoingNotices = notices.filter((n) => parseDate(n.deadline) >= today)
  const closedNotices = notices.filter((n) => parseDate(n.deadline) < today)

  return (
    <aside className={styles.sidebar}>
      {/* Seção Em Andamento */}
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>Em Andamento</h2>
          <span className={styles.count}>{ongoingNotices.length}</span>
        </div>

        <div className={styles.list}>
          {ongoingNotices.map((notice) => (
            <button
              key={notice.id}
              className={`${styles.card} ${notice.id === selectedId ? styles.cardActive : ""}`}
              onClick={() => onSelect(notice)}
            >
              <div className={styles.cardType}>{notice.type}</div>
              <h3 className={styles.cardTitle}>{notice.title}</h3>
              <p className={styles.cardOrg}>{notice.organization}</p>
              <div className={styles.cardFooter}>
                <Calendar size={14} />
                <span className={styles.cardDeadline}>Prazo: {notice.deadline}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Seção Encerrados */}
      {closedNotices.length > 0 && (
        <div className={styles.section}>
          <div className={`${styles.header} ${styles.headerClosed}`}>
            <h2 className={styles.title}>Encerrados</h2>
            <span className={styles.count}>{closedNotices.length}</span>
          </div>

          <div className={styles.list}>
            {closedNotices.map((notice) => (
              <button
                key={notice.id}
                className={`${styles.card} ${styles.cardClosed} ${notice.id === selectedId ? styles.cardActive : ""}`}
                onClick={() => onSelect(notice)}
              >
                <div className={styles.cardType}>{notice.type}</div>
                <h3 className={styles.cardTitle}>{notice.title}</h3>
                <div className={styles.cardFooter}>
                  <Archive size={14} />
                  <span className={styles.cardDeadline}>Inscrições Encerradas</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}