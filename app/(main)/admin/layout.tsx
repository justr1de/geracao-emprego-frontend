'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Lock } from 'lucide-react'
import styles from './layout.module.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    // Confirmação antes de fazer logout
    const confirmLogout = window.confirm('Confirmar logout?')
    
    if (!confirmLogout) {
      return // Usuário cancelou
    }

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      router.push('/admin')
    }
  }

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/candidatos', label: 'Candidatos', icon: '👥' },
    { href: '/admin/empresas', label: 'Empresas', icon: '🏢' },
    { href: '/admin/vagas', label: 'Vagas', icon: '💼' },
    { href: '/admin/cursos', label: 'Cursos', icon: '📚' },
    { href: '/admin/editais', label: 'Editais', icon: '📋' },
    { href: '/admin/relatorios', label: 'Relatórios', icon: '📈' },
    { href: '/admin/notificacoes', label: 'Notificações', icon: '🔔' },
    { href: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
  ]

  return (
    <div className={styles.adminContainer}>
      {/* Header com título e botão de Logout */}
      <header className={styles.adminHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.welcomeText}>Painel Administrativo</span>
          <span className={styles.badge}>Superadmin</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <Lock size={16} />
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </header>

      {/* Navegação horizontal no corpo da página */}
      <nav className={styles.horizontalNav}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Conteúdo principal */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Rodapé com links */}
      <footer className={styles.adminFooter}>
        <Link href="/" className={styles.backLink}>
          ← Voltar ao Site
        </Link>
        
        {/* Logo DATA-RO */}
        <a 
          href="https://dataro-it.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.dataroLogo}
          title="Desenvolvido por DATA-RO Inteligência Territorial"
        >
          <Image 
            src="/dataro-logo-small.png" 
            alt="DATA-RO" 
            width={32} 
            height={32}
            className={styles.dataroLogoImg}
          />
          <span className={styles.dataroText}>DATA-RO</span>
        </a>
      </footer>
    </div>
  )
}
