"use client"

import styles from "./index.module.css"

export default function JobCard({ job, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.location}>📍 {job.location}</span>
        <span className={styles.date}>{job.date}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.icon}>💼</div>
        <h3 className={styles.title}>{job.title}</h3>
        <div className={styles.salary}>{job.salary}</div>
        <div className={styles.type}>{job.type}</div>
      </div>

      <div className={styles.footer}>
        <div className={styles.benefits}>
          {job.benefits.slice(0, 2).map((benefit, index) => (
            <span key={index} className={styles.benefit}>
              {benefit}
            </span>
          ))}
        </div>
        <p className={styles.description}>{job.description}</p>
      </div>
    </div>
  )
}
