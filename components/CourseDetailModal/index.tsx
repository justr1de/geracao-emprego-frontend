'use client';

import ModalOverlay from '@/components/ModalOverlay';
import { BookOpen, Clock, Monitor, Award, CheckCircle2, ListChecks } from 'lucide-react';
import styles from './index.module.css';

interface Course {
  id: number
  title: string
  institution: string
  duration: string
  modality: string
  category: string
  description: string
  requirements?: string[]
  syllabus?: string[]
}

interface CourseDetailModalProps {
  course: Course
  onClose: () => void
}

export default function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Award size={14} /> {course.institution}
          </div>
          <h2 className={styles.title}>{course.title}</h2>
          <span className={styles.category}>
            <BookOpen size={14} /> {course.category}
          </span>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <Clock size={14} /> Duração
            </span>
            <span className={styles.infoValue}>{course.duration}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <Monitor size={14} /> Modalidade
            </span>
            <span className={styles.infoValue}>{course.modality}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Sobre o curso</h3>
          <p className={styles.description}>{course.description}</p>
        </div>

        {course.requirements && course.requirements.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Requisitos</h3>
            <ul className={styles.list}>
              {course.requirements.map((req, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} className={styles.listIcon} />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {course.syllabus && course.syllabus.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>O que você vai aprender</h3>
            <ul className={styles.list}>
              {course.syllabus.map((item, i) => (
                <li key={i}>
                  <ListChecks size={16} className={styles.listIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className={styles.enrollBtn}>Realizar Inscrição</button>
      </div>
    </ModalOverlay>
  );
}
