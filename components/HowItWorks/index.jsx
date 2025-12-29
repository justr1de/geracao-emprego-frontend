'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Search, 
  Bell, 
  CheckCircle, 
  Building2, 
  Users, 
  ClipboardCheck, 
  MessageSquare,
  Star,
  ArrowRight,
  UserPlus,
  Send,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('candidato');
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedTab, setDisplayedTab] = useState('candidato');

  const candidatoSteps = [
    {
      icon: UserPlus,
      title: 'Cadastre-se Gratuitamente',
      description: 'Crie sua conta em menos de 2 minutos. Preencha seus dados básicos e comece a buscar oportunidades.',
      features: [
        'Cadastro 100% gratuito',
        'Sem necessidade de currículo pronto',
        'Acesso imediato às vagas'
      ],
      color: '#059669'
    },
    {
      icon: FileText,
      title: 'Complete seu Currículo',
      description: 'Preencha suas experiências, formação e habilidades. Quanto mais completo, maiores suas chances.',
      features: [
        'Modelo de currículo guiado',
        'Dicas para destacar seu perfil',
        'Visibilidade para empresas'
      ],
      color: '#0284c7'
    },
    {
      icon: Search,
      title: 'Encontre Vagas Ideais',
      description: 'Busque por cargo, cidade ou área de atuação. Use filtros avançados para encontrar a vaga perfeita.',
      features: [
        'Mais de 68.000 vagas disponíveis',
        'Filtros por salário e benefícios',
        'Vagas em todo o estado de Rondônia'
      ],
      color: '#7c3aed'
    },
    {
      icon: Send,
      title: 'Candidate-se com 1 Clique',
      description: 'Envie seu currículo diretamente para as empresas. Acompanhe o status das suas candidaturas.',
      features: [
        'Candidatura instantânea',
        'Histórico de candidaturas',
        'Notificações de visualização'
      ],
      color: '#dc2626'
    }
  ];

  const empregadorSteps = [
    {
      icon: Building2,
      title: 'Cadastre sua Empresa',
      description: 'Registre sua empresa gratuitamente e tenha acesso a milhares de currículos qualificados.',
      features: [
        'Cadastro gratuito e rápido',
        'Perfil completo da empresa',
        'Visibilidade para candidatos'
      ],
      color: '#059669'
    },
    {
      icon: Briefcase,
      title: 'Divulgue suas Vagas',
      description: 'Publique vagas com descrição detalhada, requisitos e benefícios. Alcance candidatos em todo o estado.',
      features: [
        'Publicação ilimitada de vagas',
        'Destaque para vagas urgentes',
        'Alcance em todas as cidades de RO'
      ],
      color: '#0284c7'
    },
    {
      icon: Users,
      title: 'Busque e Analise Currículos',
      description: 'Acesse nossa base com mais de 163.000 currículos. Use filtros avançados para encontrar o perfil ideal.',
      features: [
        'Busca por mais de 7.000 ocupações',
        'Mais de 15 filtros de qualificação',
        'Visualização completa do currículo'
      ],
      color: '#7c3aed'
    },
    {
      icon: Calendar,
      title: 'Agende Entrevistas',
      description: 'Entre em contato direto com os candidatos. Gerencie todo o processo seletivo pela plataforma.',
      features: [
        'Contato direto com candidatos',
        'Agendamento de entrevistas',
        'Gestão de processo seletivo'
      ],
      color: '#dc2626'
    }
  ];

  const handleTabChange = (newTab) => {
    if (newTab === activeTab || isAnimating) return;
    
    setIsAnimating(true);
    setActiveTab(newTab);
    
    // Aguardar a animação de saída antes de trocar o conteúdo
    setTimeout(() => {
      setDisplayedTab(newTab);
      // Pequeno delay para garantir que o novo conteúdo seja renderizado antes da animação de entrada
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const currentSteps = displayedTab === 'candidato' ? candidatoSteps : empregadorSteps;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isAnimating ? styles.headerAnimating : ''}`}>
          <span className={styles.badge}>Como Funciona</span>
          <h2 className={styles.title}>
            Passo a passo para {displayedTab === 'candidato' ? 'encontrar seu emprego' : 'encontrar o colaborador ideal'}
          </h2>
          <p className={styles.subtitle}>
            {displayedTab === 'candidato' 
              ? 'Siga estes passos simples e comece sua jornada rumo ao emprego dos seus sonhos'
              : 'Encontre os melhores profissionais para sua empresa de forma rápida e eficiente'
            }
          </p>
        </div>

        <div className={styles.tabs}>
          <div 
            className={styles.tabIndicator} 
            style={{ 
              transform: activeTab === 'candidato' ? 'translateX(0)' : 'translateX(100%)'
            }} 
          />
          <button 
            className={`${styles.tab} ${activeTab === 'candidato' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('candidato')}
          >
            <Search size={20} />
            <span>Busco Emprego</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'empregador' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('empregador')}
          >
            <Building2 size={20} />
            <span>Busco Funcionário</span>
          </button>
        </div>

        <div className={`${styles.stepsContainer} ${isAnimating ? styles.stepsAnimatingOut : styles.stepsAnimatingIn}`}>
          {currentSteps.map((step, index) => (
            <div 
              key={`${displayedTab}-${index}`} 
              className={styles.stepCard}
              style={{ 
                animationDelay: isAnimating ? '0ms' : `${index * 100}ms`
              }}
            >
              <div className={styles.stepNumber} style={{ backgroundColor: step.color }}>
                {index + 1}
              </div>
              <div className={styles.stepIconWrapper} style={{ backgroundColor: `${step.color}15` }}>
                <step.icon size={32} style={{ color: step.color }} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              <ul className={styles.stepFeatures}>
                {step.features.map((feature, idx) => (
                  <li key={idx} className={styles.stepFeature}>
                    <CheckCircle size={16} className={styles.checkIcon} style={{ color: step.color }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {index < currentSteps.length - 1 && (
                <div className={styles.stepConnector}>
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`${styles.ctaSection} ${isAnimating ? styles.ctaAnimatingOut : styles.ctaAnimatingIn}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>
              {displayedTab === 'candidato' 
                ? 'Pronto para começar sua busca?' 
                : 'Pronto para encontrar talentos?'
              }
            </h3>
            <p className={styles.ctaDescription}>
              {displayedTab === 'candidato'
                ? 'Junte-se a mais de 163.000 profissionais cadastrados e encontre sua próxima oportunidade.'
                : 'Junte-se a mais de 6.700 empresas que já encontraram os melhores profissionais conosco.'
              }
            </p>
          </div>
          <div className={styles.ctaButtons}>
            <Link 
              href={displayedTab === 'candidato' ? '/cadastro' : '/cadastro-empresa'} 
              className={styles.ctaPrimary}
            >
              {displayedTab === 'candidato' ? 'Criar minha conta grátis' : 'Cadastrar minha empresa'}
              <ArrowRight size={20} />
            </Link>
            <Link 
              href={displayedTab === 'candidato' ? '/vagas' : '/curriculos'} 
              className={styles.ctaSecondary}
            >
              {displayedTab === 'candidato' ? 'Ver vagas disponíveis' : 'Buscar currículos'}
            </Link>
          </div>
        </div>

        <div className={styles.feedbackSection}>
          <div className={styles.feedbackCard}>
            <MessageSquare size={24} className={styles.feedbackIcon} />
            <div className={styles.feedbackContent}>
              <h4>Nos dê seu feedback!</h4>
              <p>Sua opinião é muito importante para melhorarmos a plataforma. Conte-nos sua experiência.</p>
            </div>
            <Link href="/contato" className={styles.feedbackLink}>
              Enviar feedback
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
