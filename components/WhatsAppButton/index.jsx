"use client"

import { MessageCircle } from "lucide-react"
import styles from "./index.module.css"

export default function WhatsAppButton() {
  return (
    <button
      className={styles.button}
      onClick={() => alert("Conectando ao chatbot humanizado...")}
      title="Fale com nosso assistente"
    >
      <MessageCircle className={styles.icon} />
      <span className={styles.text}>Ajuda</span>
    </button>
  )
}
