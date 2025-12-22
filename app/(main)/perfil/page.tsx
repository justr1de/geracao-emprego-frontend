'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, Award, ThumbsUp, ThumbsDown } from 'lucide-react';
import styles from './page.module.css';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>JD</div>
          <div className={styles.badges}>
            <div className={styles.badge} title="Selo de Contratado">
              <Award size={16} />
              <span>Contratado</span>
            </div>
            <div className={`${styles.badge} ${styles.vulnerability}`} title="Selo de Vulnerabilidade">
              <Shield size={16} />
              <span>Vulnerabilidade</span>
            </div>
          </div>
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>João da Silva</h1>
          <p className={styles.profileRole}>Desenvolvedor Full Stack</p>
          <p className={styles.profileLocation}>São Paulo, SP</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Perfil
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Histórico de Segurança
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.active : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notificações
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'feedback' ? styles.active : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Avaliações
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'profile' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações do Perfil</h2>
            <p>Conteúdo do perfil do usuário...</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Histórico de Segurança</h2>
            <div className={styles.securityTable}>
              <div className={styles.tableHeader}>
                <span>Data/Hora</span>
                <span>Endereço IP</span>
                <span>Dispositivo</span>
                <span>Localização</span>
              </div>
              {[
                {
                  date: '21/12/2024 14:35',
                  ip: '192.168.1.100',
                  device: 'Chrome - Windows 10',
                  location: 'São Paulo, SP',
                },
                {
                  date: '20/12/2024 09:12',
                  ip: '192.168.1.100',
                  device: 'Chrome - Windows 10',
                  location: 'São Paulo, SP',
                },
                {
                  date: '19/12/2024 16:48',
                  ip: '192.168.1.101',
                  device: 'Safari - iPhone 14',
                  location: 'São Paulo, SP',
                },
                {
                  date: '18/12/2024 11:22',
                  ip: '192.168.1.100',
                  device: 'Chrome - Windows 10',
                  location: 'São Paulo, SP',
                },
              ].map((log, i) => (
                <div key={i} className={styles.tableRow}>
                  <span>{log.date}</span>
                  <span className={styles.mono}>{log.ip}</span>
                  <span>{log.device}</span>
                  <span>{log.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Todas as Notificações</h2>
            <p>Lista completa de notificações e matches...</p>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Avaliação de Contratação</h2>
            <p className={styles.feedbackDescription}>Para empresas: avalie suas contratações encerradas</p>
            <div className={styles.feedbackWidget}>
              <div className={styles.feedbackItem}>
                <h3>Vaga: Desenvolvedor Frontend</h3>
                <p>Candidato: João da Silva</p>
                <p className={styles.feedbackDate}>Contratado em: 15/11/2024</p>
                <div className={styles.feedbackButtons}>
                  <button className={styles.feedbackBtn}>
                    <ThumbsUp size={20} />
                    Positiva
                  </button>
                  <button className={`${styles.feedbackBtn} ${styles.negative}`}>
                    <ThumbsDown size={20} />
                    Negativa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
