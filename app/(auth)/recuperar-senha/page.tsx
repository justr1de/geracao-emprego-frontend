"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import styles from "./page.module.css"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Password recovery for:", email)
    setSubmitted(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>Geração Emprego</h1>
          <p className={styles.tagline}>Conectando talentos e oportunidades</p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          {!submitted ? (
            <>
              <h2 className={styles.title}>Recuperar Senha</h2>
              <p className={styles.subtitle}>Digite seu e-mail e enviaremos um link para redefinir sua senha</p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Enviar Link
                </button>
              </form>

              <Link href="/login" className={styles.backLink}>
                ← Voltar para o login
              </Link>
            </>
          ) : (
            <div className={styles.successMessage}>
              <h2 className={styles.title}>E-mail Enviado!</h2>
              <p className={styles.subtitle}>
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <Link href="/login" className={styles.submitBtn}>
                Voltar para o Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
