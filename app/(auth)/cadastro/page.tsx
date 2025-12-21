// @ts-nocheck
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Check, User, Building2 } from "lucide-react"
import styles from "./page.module.css"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState("")
  const [phoneConfirm, setPhoneConfirm] = useState("")
  const [userType, setUserType] = useState("candidate")
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
    selfDeclaration: [],
  })

  // Máscaras
  const formatCPF = (v) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1")
  const formatPhone = (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{4})\d+?$/, "$1")

  const handlePhoneSubmit = (e) => { e.preventDefault(); setStep(2); }
  
  const handlePhoneConfirmSubmit = (e) => {
    e.preventDefault()
    if (phone !== phoneConfirm) {
      alert("Os números não coincidem!")
      return
    }
    setStep(3)
  }

  const handleFinalSubmit = (e) => {
    e.preventDefault()
    // Aqui você enviaria o formData limpo para a API
    console.log("Dados para o Banco:", { ...formData, phone, userType })
    router.push("/")
  }

  // Renderização do Lado Esquerdo (Fixo para os 3 passos)
  const Sidebar = () => (
    <div className={styles.leftPanel}>
      <div className={styles.logoSection}>
        <h1 className={styles.logo}>Geração Emprego</h1>
        <p className={styles.tagline}>Sua carreira começa aqui.</p>
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.stepIndicator}>Passo {step} de 3</div>
          
          {step === 1 && (
            <>
              <h2 className={styles.title}>Identificação</h2>
              <p className={styles.subtitle}>Para começar, qual seu WhatsApp?</p>
              <form onSubmit={handlePhoneSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>WhatsApp</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(00) 00000-0000" maxLength={15} required />
                </div>
                <button type="submit" className={styles.submitBtn}>Continuar <ArrowRight size={18} /></button>
                <p style={{textAlign: 'center', fontWeight: 'bold', marginTop: '1rem'}}>
                  Já tem conta? <Link href="/login" style={{textDecoration: 'underline'}}>Entrar</Link>
                </p>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className={styles.title}>Confirmação</h2>
              <p className={styles.subtitle}>Repita o número para evitar erros</p>
              <form onSubmit={handlePhoneConfirmSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Confirmar Telefone</label>
                  <input type="tel" value={phoneConfirm} onChange={(e) => setPhoneConfirm(formatPhone(e.target.value))} placeholder="Repita o número" maxLength={15} required />
                </div>
                <button type="submit" className={styles.submitBtn}>Validar Número <Check size={18} /></button>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>Voltar e corrigir</button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className={styles.title}>Dados Finais</h2>
              <p className={styles.subtitle}>Quase lá! Complete seu perfil</p>
              
              <div className={styles.userTypeSelection}>
                <button className={`${styles.userTypeBtn} ${userType === "candidate" ? styles.active : ""}`} onClick={() => setUserType("candidate")}>
                  <User size={18} /> Candidato
                </button>
                <button className={`${styles.userTypeBtn} ${userType === "company" ? styles.active : ""}`} onClick={() => setUserType("company")}>
                  <Building2 size={18} /> Empresa
                </button>
              </div>

              <form onSubmit={handleFinalSubmit} className={styles.form}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}><label>Nome</label><input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required /></div>
                  <div className={styles.inputGroup}><label>Sobrenome</label><input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required /></div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}><label>CPF</label><input type="text" value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})} maxLength={14} required /></div>
                  <div className={styles.inputGroup}><label>Nascimento</label><input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} required /></div>
                </div>

                <div className={styles.inputGroup}><label>E-mail</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}><label>Senha</label><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} minLength={6} required /></div>
                  <div className={styles.inputGroup}><label>Confirmar</label><input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required /></div>
                </div>

                <button type="button" className={styles.assistantToggle} onClick={() => setShowAssistantCode(!showAssistantCode)}>
                  {showAssistantCode ? "- Fechar" : "+ Fui auxiliado por um atendente"}
                </button>
                {showAssistantCode && (
                  <div className={styles.inputGroup}><label>Código Atendente</label><input type="text" value={formData.assistantCode} onChange={(e) => setFormData({...formData, assistantCode: e.target.value})} /></div>
                )}

                <button type="submit" className={styles.submitBtn}>Concluir Cadastro</button>
                <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>Voltar</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}