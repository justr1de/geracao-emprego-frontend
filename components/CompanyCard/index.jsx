import styles from "./index.module.css"

export default function CompanyCard({ company }) {
  return (
    <div className={styles.card}>
      <div className={styles.topSection}></div>

      <div className={styles.logoWrapper}>
        <img src={company.logo || "/placeholder.svg"} alt={company.name} className={styles.logo} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{company.name}</h3>
        <p className={styles.description}>{company.description}</p>

        <div className={styles.tags}>
          <span className={styles.categoryTag}>{company.category}</span>
          <span className={styles.vacancyTag}>{company.vacancies} vagas</span>
        </div>
      </div>

      <button className={styles.actionButton}>→</button>
    </div>
  )
}
