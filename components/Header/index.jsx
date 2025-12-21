"use client"

import { Menu, X, CheckCircle, Bell } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useApp } from "@/contexts/AppContext"
import styles from "./index.module.css"

export default function Header() {
  const { isAdmin, setIsAdmin, isLogged } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notifications = [
    { id: 1, text: "Seu currículo é compatível com a vaga de Desenvolvedor Frontend", new: true },
    { id: 2, text: "Nova vaga disponível: Analista de Sistemas", new: true },
    { id: 3, text: "Empresa XYZ visualizou seu perfil", new: false },
  ]

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
          {isLogged && (
            <div className={styles.notificationWrapper}>
              <button
                className={styles.notificationBtn}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="Notificações"
              >
                <Bell size={20} />
                {notifications.some((n) => n.new) && <span className={styles.notificationDot}></span>}
              </button>

              {notificationsOpen && (
                <div className={styles.notificationDropdown}>
                  <h3 className={styles.notificationTitle}>Matches e Notificações</h3>
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`${styles.notificationItem} ${notif.new ? styles.new : ""}`}>
                      {notif.new && <span className={styles.newBadge}>Novo</span>}
                      <p>{notif.text}</p>
                    </div>
                  ))}
                  <Link href="/perfil?tab=notifications" className={styles.viewAll}>
                    Ver todas
                  </Link>
                </div>
              )}
            </div>
          )}

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
