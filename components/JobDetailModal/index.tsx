'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalOverlay from '@/components/ModalOverlay';
import { useAuthContext as useAuth } from '@/contexts/AuthContext';
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle2, Gift, Building2, Loader2, Send, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './index.module.css';

interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
}

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onApplicationSuccess?: () => void;
}

export default function JobDetailModal({ job, onClose, onApplicationSuccess }: JobDetailModalProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Gera IDs únicos para associar elementos via ARIA
  const titleId = useId();
  const descriptionId = useId();

  // Função para candidatar-se com 1 clique
  const handleApply = async () => {
    // Se não estiver logado, redirecionar para login
    if (!user) {
      router.push(`/login?redirect=/vagas&vaga=${job.id}`);
      return;
    }

    // Verificar se é candidato (tipo_usuario = 1)
    if (user.user_metadata?.tipo_usuario !== 1) {
      setError('Apenas candidatos podem se candidatar a vagas. Faça login com uma conta de candidato.');
      return;
    }

    setApplying(true);
    setError(null);

    try {
      const response = await fetch('/api/candidaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaga_id: job.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('Você já se candidatou a esta vaga.');
          setApplied(true);
        } else if (response.status === 404) {
          setError('Complete seu perfil antes de se candidatar.');
        } else {
          setError(data.error || 'Erro ao enviar candidatura. Tente novamente.');
        }
        return;
      }

      setApplied(true);
      
      // Callback de sucesso
      if (onApplicationSuccess) {
        onApplicationSuccess();
      }

    } catch (err) {
      console.error('Erro ao candidatar:', err);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setApplying(false);
    }
  };

  // Ir para minhas candidaturas
  const goToApplications = () => {
    router.push('/minhas-candidaturas');
    onClose();
  };

  return (
    <ModalOverlay 
      onClose={onClose} 
      titleId={titleId}
      descriptionId={descriptionId}
    >
      <article className={styles.content}>
        {/* Header com informações principais */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <Building2 size={14} aria-hidden="true" /> 
            <span>{job.company}</span>
          </div>
          
          {/* Título principal - referenciado pelo aria-labelledby do modal */}
          <h2 id={titleId} className={styles.title}>
            {job.title}
          </h2>
          
          <span className={styles.type} role="status">
            {job.type}
          </span>
        </header>

        {/* Descrição breve - referenciada pelo aria-describedby do modal */}
        <p id={descriptionId} className="sr-only">
          Vaga de {job.title} na empresa {job.company}, localizada em {job.location}. 
          Faixa salarial: {job.salary}.
        </p>

        {/* Cards de informação */}
        <div className={styles.infoRow} role="group" aria-label="Informações da vaga">
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <MapPin size={14} aria-hidden="true" /> 
              <span>Localização</span>
            </span>
            <span className={styles.infoValue}>{job.location}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <DollarSign size={14} aria-hidden="true" /> 
              <span>Salário</span>
            </span>
            <span className={styles.infoValue}>{job.salary}</span>
          </div>
        </div>

        {/* Seção: Sobre a vaga */}
        <section className={styles.section} aria-labelledby="section-about">
          <h3 id="section-about" className={styles.sectionTitle}>
            <Briefcase size={16} aria-hidden="true" /> 
            <span>Sobre a vaga</span>
          </h3>
          <p className={styles.description}>{job.description}</p>
        </section>

        {/* Seção: Requisitos */}
        {job.requirements && job.requirements.length > 0 && (
          <section className={styles.section} aria-labelledby="section-requirements">
            <h3 id="section-requirements" className={styles.sectionTitle}>
              <CheckCircle2 size={16} aria-hidden="true" /> 
              <span>Requisitos</span>
            </h3>
            <ul className={styles.list} aria-label="Lista de requisitos">
              {job.requirements.map((req, i) => (
                <li key={i}>
                  <CheckCircle2 size={14} className={styles.listIcon} aria-hidden="true" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Seção: Benefícios */}
        {job.benefits && job.benefits.length > 0 && (
          <section className={styles.section} aria-labelledby="section-benefits">
            <h3 id="section-benefits" className={styles.sectionTitle}>
              <Gift size={16} aria-hidden="true" /> 
              <span>Benefícios</span>
            </h3>
            <ul className={styles.list} aria-label="Lista de benefícios">
              {job.benefits.map((benefit, i) => (
                <li key={i}>
                  <Gift size={14} className={styles.listIcon} aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Rodapé com data de publicação */}
        <footer className={styles.footer}>
          <span className={styles.postedAt}>
            <Clock size={14} aria-hidden="true" /> 
            <span>Publicada {job.postedAt}</span>
          </span>
        </footer>

        {/* Mensagem de erro */}
        {error && (
          <div className={styles.errorMessage} role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Mensagem de sucesso */}
        {applied && !error && (
          <div className={styles.successMessage} role="status">
            <CheckCircle size={16} />
            <span>Candidatura enviada com sucesso!</span>
          </div>
        )}

        {/* Botões de ação */}
        <div className={styles.actions}>
          {applied ? (
            <button 
              className={styles.viewApplicationsBtn}
              type="button"
              onClick={goToApplications}
            >
              <CheckCircle size={18} />
              Ver Minhas Candidaturas
            </button>
          ) : (
            <button 
              className={styles.applyBtn}
              type="button"
              onClick={handleApply}
              disabled={applying || authLoading}
              aria-label={`Candidatar-se para a vaga de ${job.title} na empresa ${job.company}`}
            >
              {applying ? (
                <>
                  <Loader2 size={18} className={styles.spinner} />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Candidatar-se com 1 Clique
                </>
              )}
            </button>
          )}
        </div>

        {/* Dica para não logados */}
        {!user && !authLoading && (
          <p className={styles.loginHint}>
            Faça login ou cadastre-se para se candidatar instantaneamente
          </p>
        )}
      </article>
    </ModalOverlay>
  );
}
