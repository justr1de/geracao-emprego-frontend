"use client"

import styles from "./index.module.css"

interface Notice {
  id: number
  title: string
  organization: string
  publishDate: string
  deadline: string
  type: string
  category: string
}

interface NoticeSidebarProps {
  notices: Notice[]
  selectedId: number
  onSelect: (notice: Notice) => void
}

export default function NoticeSidebar({ notices, selectedId, onSelect }: NoticeSidebarProps) {
  const today = new Date()
  const ongoingNotices = notices.filter((n) => {
    const deadline = new Date(n.deadline.split("/").reverse().join("-"))
    return deadline >= today
  })
  const closedNotices = notices.filter((n) => {
    const deadline = new Date(n.deadline.split("/").reverse().join("-"))
    return deadline < today
  })

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>Em Andamento</h2>
          <span className={styles.count}>{ongoingNotices.length}</span>
        </div>

        <div className={styles.list}>
          {ongoingNotices.map((notice) => (
            <div
              key={notice.id}
              className={`${styles.card} ${notice.id === selectedId ? styles.cardActive : ""}`}
              onClick={() => onSelect(notice)}
            >
              <div className={styles.cardType}>{notice.type}</div>
              <h3 className={styles.cardTitle}>{notice.title}</h3>
              <p className={styles.cardOrg}>{notice.organization}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardDeadline}>📅 {notice.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {closedNotices.length > 0 && (
        <div className={styles.section}>
          <div className={styles.header}>
            <h2 className={styles.title}>Encerrados</h2>
            <span className={styles.count}>{closedNotices.length}</span>
          </div>

          <div className={styles.list}>
            {closedNotices.map((notice) => (
              <div
                key={notice.id}
                className={`${styles.card} ${styles.cardClosed} ${notice.id === selectedId ? styles.cardActive : ""}`}
                onClick={() => onSelect(notice)}
              >
                <div className={styles.cardType}>{notice.type}</div>
                <h3 className={styles.cardTitle}>{notice.title}</h3>
                <p className={styles.cardOrg}>{notice.organization}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardDeadline}>⏰ Encerrado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
