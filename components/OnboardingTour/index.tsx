'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Search, User, Send, Bell, CheckCircle, Sparkles } from 'lucide-react';
import styles from './index.module.css';

interface TourStep {
  id: string;
  target: string; // CSS selector do elemento alvo
  title: string;
  content: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  spotlightPadding?: number;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'Bem-vindo ao Geração Emprego! 🎉',
    content: 'Vamos fazer um tour rápido para você conhecer as principais funcionalidades da plataforma e encontrar a vaga ideal.',
    icon: <Sparkles size={24} />,
    position: 'bottom',
  },
  {
    id: 'search',
    target: '[data-tour="search"]',
    title: 'Busque Vagas',
    content: 'Use a barra de busca para encontrar vagas por cargo, empresa ou cidade. Você pode filtrar por salário, benefícios e muito mais!',
    icon: <Search size={24} />,
    position: 'bottom',
    spotlightPadding: 8,
  },
  {
    id: 'profile',
    target: '[data-tour="profile"]',
    title: 'Complete seu Perfil',
    content: 'Quanto mais completo seu perfil, maiores suas chances! Adicione experiências, formação e habilidades para se destacar.',
    icon: <User size={24} />,
    position: 'bottom',
    spotlightPadding: 8,
  },
  {
    id: 'apply',
    target: '[data-tour="apply"]',
    title: 'Candidate-se com 1 Clique',
    content: 'Encontrou uma vaga interessante? Candidate-se instantaneamente! Seu currículo será enviado automaticamente para a empresa.',
    icon: <Send size={24} />,
    position: 'top',
    spotlightPadding: 8,
  },
  {
    id: 'notifications',
    target: '[data-tour="notifications"]',
    title: 'Fique por Dentro',
    content: 'Ative as notificações para receber alertas de novas vagas compatíveis com seu perfil e atualizações das suas candidaturas.',
    icon: <Bell size={24} />,
    position: 'bottom',
    spotlightPadding: 8,
  },
  {
    id: 'finish',
    target: 'body',
    title: 'Tudo Pronto! ✨',
    content: 'Agora você está pronto para começar sua jornada. Boa sorte na busca pelo emprego ideal!',
    icon: <CheckCircle size={24} />,
    position: 'bottom',
  },
];

interface OnboardingTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
  forceShow?: boolean;
}

export default function OnboardingTour({ onComplete, onSkip, forceShow = false }: OnboardingTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  // Verificar se deve mostrar o tour
  useEffect(() => {
    setMounted(true);
    
    if (forceShow) {
      setIsActive(true);
      return;
    }

    // Verificar localStorage
    const hasSeenTour = localStorage.getItem('geracaoEmprego_tourCompleted');
    const isNewUser = !hasSeenTour;

    if (isNewUser) {
      // Pequeno delay para garantir que a página carregou
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  // Atualizar posição do elemento alvo
  const updateTargetPosition = useCallback(() => {
    const step = tourSteps[currentStep];
    if (!step) return;

    if (step.target === 'body') {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll para o elemento se necessário
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      updateTargetPosition();
      window.addEventListener('resize', updateTargetPosition);
      window.addEventListener('scroll', updateTargetPosition);
      
      return () => {
        window.removeEventListener('resize', updateTargetPosition);
        window.removeEventListener('scroll', updateTargetPosition);
      };
    }
  }, [isActive, currentStep, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('geracaoEmprego_tourCompleted', 'true');
    localStorage.setItem('geracaoEmprego_tourCompletedAt', new Date().toISOString());
    setIsActive(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem('geracaoEmprego_tourSkipped', 'true');
    setIsActive(false);
    onSkip?.();
  };

  if (!mounted || !isActive) return null;

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isWelcomeOrFinish = step.target === 'body';

  // Calcular posição do tooltip
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect || isWelcomeOrFinish) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = step.spotlightPadding || 0;
    const tooltipOffset = 16;

    switch (step.position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: `${window.innerHeight - targetRect.top + tooltipOffset + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: `${targetRect.bottom + tooltipOffset + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          position: 'fixed',
          top: `${targetRect.top + targetRect.height / 2}px`,
          right: `${window.innerWidth - targetRect.left + tooltipOffset + padding}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          position: 'fixed',
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.right + tooltipOffset + padding}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return {};
    }
  };

  // Calcular posição do spotlight
  const getSpotlightStyle = (): React.CSSProperties => {
    if (!targetRect || isWelcomeOrFinish) {
      return { display: 'none' };
    }

    const padding = step.spotlightPadding || 0;

    return {
      position: 'fixed',
      top: `${targetRect.top - padding}px`,
      left: `${targetRect.left - padding}px`,
      width: `${targetRect.width + padding * 2}px`,
      height: `${targetRect.height + padding * 2}px`,
    };
  };

  const tourContent = (
    <div className={styles.overlay}>
      {/* Spotlight no elemento alvo */}
      {targetRect && !isWelcomeOrFinish && (
        <div className={styles.spotlight} style={getSpotlightStyle()} />
      )}

      {/* Tooltip */}
      <div 
        className={`${styles.tooltip} ${isWelcomeOrFinish ? styles.centered : ''}`}
        style={getTooltipStyle()}
      >
        {/* Botão de fechar */}
        <button 
          className={styles.closeBtn}
          onClick={handleSkip}
          aria-label="Fechar tour"
        >
          <X size={18} />
        </button>

        {/* Ícone */}
        <div className={styles.iconWrapper}>
          {step.icon}
        </div>

        {/* Conteúdo */}
        <h3 className={styles.title}>{step.title}</h3>
        <p className={styles.content}>{step.content}</p>

        {/* Indicador de progresso */}
        <div className={styles.progress}>
          {tourSteps.map((_, index) => (
            <div 
              key={index}
              className={`${styles.dot} ${index === currentStep ? styles.active : ''} ${index < currentStep ? styles.completed : ''}`}
            />
          ))}
        </div>

        {/* Botões de navegação */}
        <div className={styles.actions}>
          {!isFirstStep && (
            <button 
              className={styles.prevBtn}
              onClick={handlePrev}
            >
              <ChevronLeft size={18} />
              Anterior
            </button>
          )}
          
          <button 
            className={styles.skipBtn}
            onClick={handleSkip}
          >
            Pular tour
          </button>

          <button 
            className={styles.nextBtn}
            onClick={handleNext}
          >
            {isLastStep ? 'Começar!' : 'Próximo'}
            {!isLastStep && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(tourContent, document.body);
}

// Hook para controlar o tour externamente
export function useOnboardingTour() {
  const [showTour, setShowTour] = useState(false);

  const startTour = () => setShowTour(true);
  const endTour = () => setShowTour(false);

  const resetTour = () => {
    localStorage.removeItem('geracaoEmprego_tourCompleted');
    localStorage.removeItem('geracaoEmprego_tourSkipped');
    localStorage.removeItem('geracaoEmprego_tourCompletedAt');
  };

  const hasCompletedTour = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('geracaoEmprego_tourCompleted') === 'true';
  };

  return {
    showTour,
    startTour,
    endTour,
    resetTour,
    hasCompletedTour,
  };
}
