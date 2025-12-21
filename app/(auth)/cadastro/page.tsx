"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.css"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [userType, setUserType] = useState("")
  const [showAssistantCode, setShowAssistantCode] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cpf: "",
    email: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
    assistantCode: "",
  })

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Phone submitted:", phone)
    setStep(2)
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Code verified:", code)
    setStep(3)
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Registration complete:", { userType, phone, ...formData })
    router.push("/")
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  // Step 1: Phone Number
  if (step === 1) {
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
            <div className={styles.stepIndicator}>Passo 1 de 3</div>
            <h2 className={styles.title}>Informe seu telefone</h2>
            <p className={styles.subtitle}>Vamos enviar um código de verificação</p>

            <form onSubmit={handlePhoneSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Telefone (WhatsApp)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Enviar Código
              </button>
            </form>

            <p className={styles.loginLink}>
              Já tem uma conta? <Link href="/login">Entre aqui</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Verification Code
  if (step === 2) {
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
            <div className={styles.stepIndicator}>Passo 2 de 3</div>
            <h2 className={styles.title}>Digite o código</h2>
            <p className={styles.subtitle}>Enviamos um código para {phone}</p>

            <form onSubmit={handleCodeSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Código de Verificação</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Verificar Código
              </button>

              <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>
                Alterar Telefone
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Complete Registration Form
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
          <div className={styles.stepIndicator}>Passo 3 de 3</div>
          <h2 className={styles.title}>Complete seu cadastro</h2>
          <p className={styles.subtitle}>Preencha todos os dados abaixo</p>

          <div className={styles.userTypeSelection}>
            <button
              className={`${styles.userTypeBtn} ${userType === "candidate" ? styles.active : ""}`}
              onClick={() => setUserType("candidate")}
              type="button"
            >
              Candidato
            </button>
            <button
              className={`${styles.userTypeBtn} ${userType === "company" ? styles.active : ""}`}
              onClick={() => setUserType("company")}
              type="button"
            >
              Empresa
            </button>
          </div>

          <form onSubmit={handleFinalSubmit} className={styles.form}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Sobrenome *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Telefone</label>
              <input type="tel" value={phone} readOnly className={styles.readOnly} />
            </div>

            <div className={styles.inputGroup}>
              <label>CPF *</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>E-mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Data de Nascimento *</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Gênero *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Senha *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={6}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirme sua Senha *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                minLength={6}
                required
              />
            </div>

            <div className={styles.assistantSection}>
              <button
                type="button"
                className={styles.assistantToggle}
                onClick={() => setShowAssistantCode(!showAssistantCode)}
              >
                {showAssistantCode ? "Esconder código" : "Foi auxiliado por um atendente?"}
              </button>

              {showAssistantCode && (
                <div className={styles.inputGroup}>
                  <label>Código do Atendente (opcional)</label>
                  <input
                    type="text"
                    value={formData.assistantCode}
                    onChange={(e) => setFormData({ ...formData, assistantCode: e.target.value })}
                    placeholder="Digite o código fornecido"
                  />
                </div>
              )}
            </div>

            <button type="submit" className={styles.submitBtn}>
              Finalizar Cadastro
            </button>

            <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>
              Voltar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
