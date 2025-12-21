"use client"

import type { ReactNode } from "react"
import styles from "./index.module.css"

interface ModalOverlayProps {
  children: ReactNode
  onClose: () => void
}

export default function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
