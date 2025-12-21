"use client"

import { Menu, X, CheckCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useApp } from "@/contexts/AppContext"
import styles from "./index.module.css"

export default function Header() {
  const { isAdmin, setIsAdmin } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <CheckCircle className={styles.logoIcon} />
          <span className={styles.logoText}>Geração Emprego</span>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/curriculos" className={styles.navLink}>
            Buscar currículos
          </Link>
          <Link href="/vagas" className={styles.navLink}>
            Vagas
          </Link>
          <Link href="/cursos" className={styles.navLink}>
            Cursos
          </Link>
          <Link href="/editais" className={styles.navLink}>
            Editais
          </Link>
          <Link href="/empresas" className={styles.navLink}>
            Empresas
          </Link>
          {isAdmin && (
            <Link href="/#admin" className={styles.navLink}>
              Gestor Area
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.adminToggle}
            onClick={() => setIsAdmin(!isAdmin)}
            title={isAdmin ? "Modo Admin Ativo" : "Ativar Modo Admin"}
          >
            {isAdmin ? "👤 Admin" : "👤"}
          </button>
          <Link href="/login" className={styles.btnLogin}>
            Entrar
          </Link>
          <Link href="/cadastro" className={styles.btnSignup}>
            Cadastre-se
          </Link>
        </div>

        <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
