"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.css"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login:", formData)
    router.push("/")
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
          <h2 className={styles.title}>Seja bem-vindo(a)</h2>
          <p className={styles.subtitle}>Entre com sua conta para continuar</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Login</label>
              <input
                type="text"
                placeholder="Seu CPF ou E-mail"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <Link href="/recuperar-senha" className={styles.forgotLink}>
              Esqueci minha senha
            </Link>

            <button type="submit" className={styles.submitBtn}>
              Entrar
            </button>
          </form>

          <p className={styles.registerLink}>
            Não tem conta? <Link href="/cadastro">Cadastre-se aqui</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
