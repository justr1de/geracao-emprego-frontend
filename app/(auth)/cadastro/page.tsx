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
  const [phoneConfirm, setPhoneConfirm] = useState("")
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
    selfDeclaration: [] as string[],
  })

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePhoneConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone !== phoneConfirm) {
      alert("Os números de telefone não coincidem. Tente novamente.")
      return
    }
    setStep(3)
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
            <h2 className={styles.title}>Identificação</h2>
            <p className={styles.subtitle}>Informe seu telefone para começar</p>

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
                Continuar
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

  // Step 2: Phone Confirmation
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
            <h2 className={styles.title}>Confirmação</h2>
            <p className={styles.subtitle}>Confirme seu telefone digitando novamente</p>

            <form onSubmit={handlePhoneConfirmSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Telefone cadastrado: {phone}</label>
                <input
                  type="tel"
                  value={phoneConfirm}
                  onChange={(e) => setPhoneConfirm(formatPhone(e.target.value))}
                  placeholder="Digite novamente"
                  maxLength={15}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Confirmar
              </button>

              <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>
                Voltar
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
          <h2 className={styles.title}>Dados Cadastrais</h2>
          <p className={styles.subtitle}>Complete suas informações para finalizar</p>

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
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Sobrenome *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Seu sobrenome"
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
                placeholder="seu@email.com"
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
                  <option value="prefiro-nao-dizer">Prefiro não dizer</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Autodeclaração (opcional)</label>
              <div className={styles.checkboxGroup}>
                {[
                  "Indígena",
                  "Imigrante",
                  "Ex-sistema prisional",
                  "Mulher vítima de violência",
                  "LGBTQIA+",
                  "Pessoa com Deficiência (PcD)",
                ].map((option) => (
                  <label key={option} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.selfDeclaration.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            selfDeclaration: [...formData.selfDeclaration, option],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            selfDeclaration: formData.selfDeclaration.filter((item) => item !== option),
                          })
                        }
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Senha *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
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
                  placeholder="Digite a senha novamente"
                  minLength={6}
                  required
                />
              </div>
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
