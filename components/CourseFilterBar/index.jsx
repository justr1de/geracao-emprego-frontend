import styles from "./index.module.css"

export default function CourseFilterBar({ totalCourses, showing }) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.results}>
        <span className={styles.showing}>Mostrando {showing} publicações</span>
        <span className={styles.total}>de um total de {totalCourses} cursos</span>
      </div>

      <div className={styles.filters}>
        <select className={styles.select}>
          <option>Todas as categorias</option>
          <option>Agricultura</option>
          <option>Vendas</option>
          <option>Design</option>
          <option>Tecnologia</option>
        </select>

        <select className={styles.selectSmall}>
          <option>Rondônia</option>
          <option>Porto Velho</option>
          <option>Ji-Paraná</option>
        </select>
      </div>
    </div>
  )
}
