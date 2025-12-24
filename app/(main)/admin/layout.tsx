'use client'

import Link from 'next/link'
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
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
