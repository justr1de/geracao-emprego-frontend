'use client';

import { ReactNode, useEffect, useRef, useCallback } from 'react';
import styles from './index.module.css';

interface ModalOverlayProps {
  children: ReactNode;
  onClose: () => void;
  titleId?: string; // ID do título para aria-labelledby
  descriptionId?: string; // ID da descrição para aria-describedby (opcional)
}

export default function ModalOverlay({ 
  children, 
  onClose, 
  titleId,
  descriptionId 
}: ModalOverlayProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Função para obter todos os elementos focáveis dentro do modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    );
  }, []);

  // Gerenciamento de foco e eventos de teclado
  useEffect(() => {
    // Salva o elemento que tinha foco antes do modal abrir
    triggerRef.current = document.activeElement as HTMLElement;

    // Move o foco para o modal
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      // Fecha o modal com a tecla Escape
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      // Implementa a armadilha de foco (focus trap)
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab: navega para trás
        if (event.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            event.preventDefault();
            lastElement.focus();
          }
        } 
        // Tab: navega para frente
        else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Previne scroll do body enquanto o modal está aberto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: remove o listener, restaura scroll e retorna o foco
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      
      // Retorna o foco ao elemento que abriu o modal
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [onClose, getFocusableElements]);

  // Handler para clique no overlay (fora do modal)
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Fecha apenas se o clique foi diretamente no overlay
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.overlay} 
      onClick={handleOverlayClick}
      role="presentation" // Indica que o overlay é apenas visual
    >
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1} // Permite que a div receba foco programaticamente
      >
        <button 
          className={styles.closeBtn} 
          onClick={onClose} 
          aria-label="Fechar janela"
          type="button"
        >
          <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </div>
  );
}
