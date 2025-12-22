'use client';

import { Clock, Users, ArrowRight, ExternalLink, Award, Bell } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function Courses() {
  const courses = [
    {
      id: 1,
      title: 'Inteligência Emocional',
      category: 'Desenvolvimento Pessoal',
      duration: '2 horas',
      enrolled: 1250,
    },
    {
      id: 2,
      title: 'Marketing Digital na Prática',
      category: 'Marketing',
      duration: '3 horas',
      enrolled: 890,
    },
    {
      id: 3,
      title: 'Técnico de Cozinha',
      category: 'Gastronomia',
      duration: '10 horas',
      enrolled: 625,
    },
  ];

  const externalPlatforms = [
    {
      id: 1,
      name: 'SEBRAE',
      description: 'Cursos de empreendedorismo e gestão',
      url: 'https://sebrae.com.br/sites/PortalSebrae/cursosonline',
      logo: '/logos/sebrae.png',
      color: '#0066B3',
    },
    {
      id: 2,
      name: 'ENAP',
      description: 'Escola Nacional de Administração Pública',
      url: 'https://www.escolavirtual.gov.br/',
      logo: '/logos/enap.png',
      color: '#1351B4',
    },
    {
      id: 3,
      name: 'Fundação Bradesco',
      description: 'Cursos de tecnologia e negócios',
      url: 'https://www.ev.org.br/',
      logo: '/logos/bradesco.png',
      color: '#CC092F',
    },
    {
      id: 4,
      name: 'FGV Online',
      description: 'Cursos de gestão e liderança',
      url: 'https://educacao-executiva.fgv.br/cursos/gratuitos',
      logo: '/logos/fgv.png',
      color: '#003366',
    },
    {
      id: 5,
      name: 'Cisco Networking Academy',
      description: 'Cursos de TI e redes',
      url: 'https://www.netacad.com/',
      logo: '/logos/cisco.png',
      color: '#049FD9',
    },
    {
      id: 6,
      name: 'Senai',
      description: 'Cursos técnicos e profissionalizantes',
      url: 'https://www.mundosenai.com.br/',
      logo: '/logos/senai.png',
      color: '#E30613',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Cursos da Plataforma */}
        <div className={styles.header}>
          <h2 className={styles.title}>Cursos gratuitos</h2>
          <p className={styles.subtitle}>
            Qualifique-se gratuitamente e aumente suas chances de conseguir um emprego
          </p>
        </div>

        <div className={styles.grid}>
          {courses.map((course) => (
            <article key={course.id} className={styles.card}>
              <span className={styles.category}>{course.category}</span>
              <h3 className={styles.cardTitle}>{course.title}</h3>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <Clock size={16} aria-hidden="true" />
                  {course.duration}
                </span>
                <span className={styles.metaItem}>
                  <Users size={16} aria-hidden="true" />
                  {course.enrolled.toLocaleString('pt-BR')} inscritos
                </span>
              </div>
              <Link href={`/cursos/${course.id}`} className={styles.cardLink}>
                Ver curso
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/cursos" className={styles.viewAllBtn}>
            Ver todos os cursos
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {/* Aviso de Parcerias */}
        <div className={styles.partnershipNotice} role="alert">
          <div className={styles.noticeIcon}>
            <Bell size={24} aria-hidden="true" />
          </div>
          <div className={styles.noticeContent}>
            <h3 className={styles.noticeTitle}>
              <Award size={20} aria-hidden="true" />
              Em breve: Cursos com Certificado!
            </h3>
            <p className={styles.noticeText}>
              O SINE Estadual está firmando parcerias com instituições de ensino.
              Em breve, você poderá fazer cursos com <strong>certificado oficial</strong> diretamente
              pela plataforma Geração Emprego. Cadastre-se para ser notificado!
            </p>
            <Link href="/cadastro" className={styles.noticeBtn}>
              Cadastrar para receber novidades
            </Link>
          </div>
        </div>

        {/* Cursos Externos */}
        <div className={styles.externalSection}>
          <div className={styles.externalHeader}>
            <h2 className={styles.externalTitle}>Plataformas de cursos gratuitos</h2>
            <p className={styles.externalSubtitle}>
              Acesse cursos gratuitos de instituições reconhecidas nacionalmente
            </p>
          </div>

          <div className={styles.externalGrid}>
            {externalPlatforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalCard}
                style={{ '--platform-color': platform.color }}
                aria-label={`Acessar cursos do ${platform.name} (abre em nova janela)`}
              >
                <div className={styles.externalLogo}>
                  <span className={styles.logoPlaceholder} style={{ backgroundColor: platform.color }}>
                    {platform.name.charAt(0)}
                  </span>
                </div>
                <div className={styles.externalInfo}>
                  <h3 className={styles.externalName}>{platform.name}</h3>
                  <p className={styles.externalDesc}>{platform.description}</p>
                </div>
                <ExternalLink size={18} className={styles.externalIcon} aria-hidden="true" />
              </a>
            ))}
          </div>

          <p className={styles.disclaimer}>
            * Os cursos das plataformas listadas são oferecidos diretamente por cada instituição.
            O Geração Emprego não se responsabiliza pelo conteúdo ou certificação destes cursos.
          </p>
        </div>
      </div>
    </section>
  );
}
