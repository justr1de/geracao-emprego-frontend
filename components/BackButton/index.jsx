"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import styles from "./index.module.css"

export default function BackButton({ label = "Voltar" }) {
  const router = useRouter()

  return (
    <button className={styles.backButton} onClick={() => router.back()}>
      <ArrowLeft className={styles.icon} />
      {label}
    </button>
  )
}
