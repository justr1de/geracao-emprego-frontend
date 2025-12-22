import Image from 'next/image';
import styles from './index.module.css';

export default function CourseCard({ course }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={course.image || '/placeholder.svg'}
          alt={`Imagem do curso ${course.title}`}
          width={300}
          height={180}
          className={styles.image}
          unoptimized={course.image?.startsWith('http')}
        />
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
  );
}
