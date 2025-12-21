import styles from "./index.module.css"

export default function CourseCard({ course }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={course.image || "/placeholder.svg"} alt={course.title} className={styles.image} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.category}>{course.category}</p>

        <div className={styles.metadata}>
          <span className={styles.cost}>{course.cost}</span>
          <span className={styles.location}>📍 {course.location}</span>
          <span className={styles.duration}>⏱️ {course.duration}</span>
        </div>

        <div className={styles.dates}>
          <div className={styles.dateItem}>
            <span className={styles.dateLabel}>Inscrições até</span>
            <span className={styles.dateValue}>📅 {course.registrationEnd}</span>
          </div>
          <div className={styles.dateItem}>
            <span className={styles.dateLabel}>Previsão de início</span>
            <span className={styles.dateValue}>📅 {course.startDate}</span>
          </div>
        </div>

        <p className={styles.description}>{course.description}</p>
      </div>
    </div>
  )
}
