'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { 
  Briefcase, 
  FileText, 
  Search, 
  CheckCircle, 
  Building2, 
  Users, 
  MessageSquare,
  ArrowRight,
  UserPlus,
  Send,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

// Dados estáticos movidos para fora do componente para evitar recriação
const CANDIDATO_STEPS = [
  {
    icon: UserPlus,
    title: 'Cadastre-se Gratuitamente',
    description: 'Crie sua conta em menos de 2 minutos. Preencha seus dados básicos e comece a buscar oportunidades.',
    features: [
      'Cadastro 100% gratuito',
      'Sem necessidade de currículo pronto',
      'Acesso imediato às vagas'
    ],
    color: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.1)'
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
    color: '#0284c7',
    bgColor: 'rgba(2, 132, 199, 0.1)'
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
    color: '#7c3aed',
    bgColor: 'rgba(124, 58, 237, 0.1)'
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
    color: '#dc2626',
    bgColor: 'rgba(220, 38, 38, 0.1)'
  }
];

const EMPREGADOR_STEPS = [
  {
    icon: Building2,
    title: 'Cadastre sua Empresa',
    description: 'Registre sua empresa gratuitamente e tenha acesso a milhares de currículos qualificados.',
    features: [
      'Cadastro gratuito e rápido',
      'Perfil completo da empresa',
      'Visibilidade para candidatos'
    ],
    color: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.1)'
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
    color: '#0284c7',
    bgColor: 'rgba(2, 132, 199, 0.1)'
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
    color: '#7c3aed',
    bgColor: 'rgba(124, 58, 237, 0.1)'
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
    color: '#dc2626',
    bgColor: 'rgba(220, 38, 38, 0.1)'
  }
];

// Componente memoizado para cada card de passo
const StepCard = memo(function StepCard({ step, index, isLast, animationDelay, dataTour }) {
  const IconComponent = step.icon;
  
  return (
    <div 
      className={styles.stepCard}
      style={{ '--animation-delay': animationDelay }}
      data-tour={dataTour}
    >
      <div 
        className={styles.stepNumber} 
        style={{ backgroundColor: step.color }}
      >
        {index + 1}
      </div>
      <div 
        className={styles.stepIconWrapper} 
        style={{ 
          backgroundColor: step.bgColor,
          color: step.color
        }}
      >
        <IconComponent size={32} />
      </div>
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepDescription}>{step.description}</p>
      <ul className={styles.stepFeatures}>
        {step.features.map((feature, idx) => (
          <li key={idx} className={styles.stepFeature}>
            <CheckCircle 
              size={16} 
              className={styles.checkIcon} 
              style={{ color: step.color }} 
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {!isLast && (
        <div className={styles.stepConnector}>
          <ArrowRight size={24} />
        </div>
      )}
    </div>
  );
});

// Componente memoizado para a seção de feedback
const FeedbackSection = memo(function FeedbackSection() {
  return (
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
  );
});

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('candidato');
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedTab, setDisplayedTab] = useState('candidato');

  // useCallback para evitar recriação da função a cada render
  const handleTabChange = useCallback((newTab) => {
    if (newTab === activeTab || isAnimating) return;
    
    setIsAnimating(true);
    setActiveTab(newTab);
    
    // Usar requestAnimationFrame para sincronizar com o ciclo de renderização
    requestAnimationFrame(() => {
      setTimeout(() => {
        setDisplayedTab(newTab);
        requestAnimationFrame(() => {
          setIsAnimating(false);
        });
      }, 250);
    });
  }, [activeTab, isAnimating]);

  // useMemo para evitar recálculo desnecessário
  const currentSteps = useMemo(() => 
    displayedTab === 'candidato' ? CANDIDATO_STEPS : EMPREGADOR_STEPS,
    [displayedTab]
  );

  // Memoizar os textos dinâmicos
  const headerContent = useMemo(() => ({
    title: displayedTab === 'candidato' 
      ? 'encontrar seu emprego' 
      : 'encontrar o colaborador ideal',
    subtitle: displayedTab === 'candidato' 
      ? 'Siga estes passos simples e comece sua jornada rumo ao emprego dos seus sonhos'
      : 'Encontre os melhores profissionais para sua empresa de forma rápida e eficiente'
  }), [displayedTab]);

  const ctaContent = useMemo(() => ({
    title: displayedTab === 'candidato' 
      ? 'Pronto para começar sua busca?' 
      : 'Pronto para encontrar talentos?',
    description: displayedTab === 'candidato'
      ? 'Junte-se a mais de 163.000 profissionais cadastrados e encontre sua próxima oportunidade.'
      : 'Junte-se a mais de 6.700 empresas que já encontraram os melhores profissionais conosco.',
    primaryLink: displayedTab === 'candidato' ? '/cadastro' : '/cadastro-empresa',
    primaryText: displayedTab === 'candidato' ? 'Criar minha conta grátis' : 'Cadastrar minha empresa',
    secondaryLink: displayedTab === 'candidato' ? '/vagas' : '/curriculos',
    secondaryText: displayedTab === 'candidato' ? 'Ver vagas disponíveis' : 'Buscar currículos'
  }), [displayedTab]);

  // Classe CSS para o indicador da tab usando CSS custom property
  const tabIndicatorStyle = useMemo(() => ({
    '--tab-position': activeTab === 'candidato' ? '0' : '100%'
  }), [activeTab]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isAnimating ? styles.headerAnimating : ''}`}>
          <span className={styles.badge}>Como Funciona</span>
          <h2 className={styles.title}>
            Passo a passo para {headerContent.title}
          </h2>
          <p className={styles.subtitle}>{headerContent.subtitle}</p>
        </div>

        <div className={styles.tabs} style={tabIndicatorStyle}>
          <div className={styles.tabIndicator} />
          <button 
            className={`${styles.tab} ${activeTab === 'candidato' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('candidato')}
            type="button"
          >
            <Search size={20} />
            <span>Busco Emprego</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'empregador' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('empregador')}
            type="button"
          >
            <Building2 size={20} />
            <span>Busco Funcionário</span>
          </button>
        </div>

        <div className={`${styles.stepsContainer} ${isAnimating ? styles.stepsAnimatingOut : styles.stepsAnimatingIn}`}>
          {currentSteps.map((step, index) => (
            <StepCard
              key={`${displayedTab}-${index}`}
              step={step}
              index={index}
              isLast={index === currentSteps.length - 1}
              animationDelay={isAnimating ? '0ms' : `${index * 80}ms`}
              dataTour={displayedTab === 'candidato' && index === 1 ? 'profile' : displayedTab === 'candidato' && index === 3 ? 'apply' : undefined}
            />
          ))}
        </div>

        <div className={`${styles.ctaSection} ${isAnimating ? styles.ctaAnimatingOut : styles.ctaAnimatingIn}`}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>{ctaContent.title}</h3>
            <p className={styles.ctaDescription}>{ctaContent.description}</p>
          </div>
          <div className={styles.ctaButtons}>
            <Link href={ctaContent.primaryLink} className={styles.ctaPrimary}>
              {ctaContent.primaryText}
              <ArrowRight size={20} />
            </Link>
            <Link href={ctaContent.secondaryLink} className={styles.ctaSecondary}>
              {ctaContent.secondaryText}
            </Link>
          </div>
        </div>

        <FeedbackSection />
      </div>
    </section>
  );
}
