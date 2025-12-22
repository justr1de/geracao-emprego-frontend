import { Users, Building2, Briefcase, GraduationCap } from "lucide-react"
import styles from "./index.module.css"

export default function StatsBar() {
  const stats = [
    { icon: Users, label: "Currículos", value: "125.430" },
    { icon: Building2, label: "Empresas", value: "8.542" },
    { icon: Briefcase, label: "Vagas", value: "15.789" },
    { icon: GraduationCap, label: "Cursos", value: "342" },
  ]

  return (
    <section className={styles.statsBar}>
      <div className={styles.container}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.stat}>
            <stat.icon className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}