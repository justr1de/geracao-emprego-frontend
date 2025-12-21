"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import styles from "./page.module.css"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Alan, aqui depois você conecta com a rota da API
    console.log("Recuperação para:", email)
    setSubmitted(true)
  }

  return (
    <div className={styles.container}>
      <aside className={styles.leftPanel}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>Geração Emprego</h1>
          <p className={styles.tagline}>Recupere seu acesso com facilidade.</p>
        </div>
      </aside>

      <main className={styles.rightPanel}>
        <div className={styles.formContainer}>
          {!submitted ? (
            <>
              <h2 className={styles.title}>Recuperar Senha</h2>
              <p className={styles.subtitle}>
                Informe seu e-mail cadastrado para receber as instruções de redefinição.
              </p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">E-mail Cadastrado</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Enviar Link de Recuperação
                </button>
              </form>

              <Link href="/login" className={styles.backLink}>
                <ArrowLeft size={14} style={{display: 'inline', marginRight: '4px'}} />
                Voltar para o login
              </Link>
            </>
          ) : (
            <div className={styles.successMessage}>
              <CheckCircle2 size={48} color="#16a34a" style={{marginBottom: '1rem'}} />
              <h2 className={styles.title}>E-mail Enviado!</h2>
              <p className={styles.subtitle}>
                Se o e-mail <strong>{email}</strong> estiver em nosso sistema, você receberá um link em breve.
              </p>
              <Link href="/login" className={styles.submitBtn}>
                Voltar para o Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}