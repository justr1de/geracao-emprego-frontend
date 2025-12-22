'use client';

import { Download, Calendar, Building2, Tag, FileText, GraduationCap, CheckCircle2, Share2, Send } from 'lucide-react';
import styles from './index.module.css';

interface NoticeDocument {
  name: string
  size: string
}

interface Notice {
  id: number
  title: string
  organization: string
  publishDate: string
  deadline: string
  type: string
  category: string
  description: string
  requirements: string[]
  benefits: string[]
  courses?: string[]
  documents: NoticeDocument[]
}

interface NoticeDetailProps {
  notice: Notice
}

export default function NoticeDetail({ notice }: NoticeDetailProps) {
  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <div className={styles.badge}>{notice.type}</div>
        <h1 className={styles.title}>{notice.title}</h1>
        <p className={styles.organization}>
          <Building2 size={20} className={styles.orgIcon} />
          {notice.organization}
        </p>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <Calendar size={20} className={styles.metaIcon} />
          <div>
            <span className={styles.metaLabel}>Publicação</span>
            <span className={styles.metaValue}>{notice.publishDate}</span>
          </div>
        </div>

        <div className={styles.metaItem}>
          <Calendar size={20} className={styles.metaIcon} />
          <div>
            <span className={styles.metaLabel}>Prazo final</span>
            <span className={styles.metaValue}>{notice.deadline}</span>
          </div>
        </div>

        <div className={styles.metaItem}>
          <Tag size={20} className={styles.metaIcon} />
          <div>
            <span className={styles.metaLabel}>Categoria</span>
            <span className={styles.metaValue}>{notice.category}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Descrição</h2>
        <p className={styles.description}>{notice.description}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Requisitos</h2>
        <ul className={styles.list}>
          {notice.requirements.map((req, index) => (
            <li key={index} className={styles.listItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Benefícios</h2>
        <div className={styles.benefits}>
          {notice.benefits.map((benefit, index) => (
            <span key={index} className={styles.benefitTag}>
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {notice.courses && notice.courses.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Cursos Relacionados
          </h2>
          <div className={styles.coursesList}>
            {notice.courses.map((course, index) => (
              <div key={index} className={styles.courseItem}>
                <GraduationCap size={20} />
                {course}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Documentos</h2>
        <div className={styles.documents}>
          {notice.documents.map((doc, index) => (
            <div key={index} className={styles.document}>
              <div className={styles.docInfo}>
                <FileText size={32} className={styles.docIcon} />
                <div>
                  <p className={styles.docName}>{doc.name}</p>
                  <p className={styles.docSize}>{doc.size}</p>
                </div>
              </div>
              <button className={styles.downloadBtn}>
                <Download size={18} />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.applyBtn}>
          <Send size={20} /> Candidatar-se Agora
        </button>
        <button className={styles.shareBtn}>
          <Share2 size={20} /> Compartilhar
        </button>
      </div>
    </div>
  );
}
