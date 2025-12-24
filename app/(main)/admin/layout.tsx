'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './layout.module.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

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
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Painel Admin</h2>
          <span className={styles.badge}>Superadmin</span>
        </div>
        
        <nav className={styles.sidebarNav}>
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

        <div className={styles.sidebarFooter}>
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
              width={40} 
              height={40}
              className={styles.dataroLogoImg}
            />
            <span className={styles.dataroText}>DATA-RO</span>
          </a>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
