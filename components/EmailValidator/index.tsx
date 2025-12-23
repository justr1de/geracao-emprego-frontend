'use client';

import { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Mail, Info } from 'lucide-react';
import styles from './index.module.css';

interface EmailValidatorProps {
  email: string;
  onValidationChange?: (isValid: boolean) => void;
  showTooltip?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// Lista de domínios de e-mail comuns para sugestões
const commonDomains = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.com.br',
  'live.com',
  'icloud.com',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'globo.com',
  'ig.com.br',
];

// Lista de domínios temporários/descartáveis que devem ser bloqueados
const disposableDomains = [
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'throwaway.email',
  'fakeinbox.com',
  'temp-mail.org',
  'disposablemail.com',
];

export default function EmailValidator({ email, onValidationChange, showTooltip = true }: EmailValidatorProps) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    if (!email) {
      setValidation(null);
      setSuggestion(null);
      onValidationChange?.(false);
      return;
    }

    const result = validateEmail(email);
    setValidation(result);
    onValidationChange?.(result.isValid);

    // Verificar se há sugestão de correção de domínio
    const domainSuggestion = getSuggestion(email);
    setSuggestion(domainSuggestion);
  }, [email, onValidationChange]);

  return (
    <div className={styles.container}>
      {/* Ícone de status */}
      {email && validation && (
        <span className={`${styles.statusIcon} ${styles[validation.type]}`}>
          {validation.type === 'success' && <Check size={14} />}
          {validation.type === 'error' && <X size={14} />}
          {validation.type === 'warning' && <AlertCircle size={14} />}
        </span>
      )}

      {/* Botão de tooltip */}
      {showTooltip && (
        <button
          type="button"
          className={styles.tooltipTrigger}
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
          onFocus={() => setIsTooltipOpen(true)}
          onBlur={() => setIsTooltipOpen(false)}
          aria-label="Informações sobre e-mail"
        >
          <Info size={16} />
        </button>
      )}

      {/* Tooltip */}
      {isTooltipOpen && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipHeader}>
            <Mail size={16} />
            <span>Formato de E-mail</span>
          </div>
          <div className={styles.tooltipContent}>
            <p className={styles.tooltipDescription}>
              Digite um e-mail válido para receber:
            </p>
            <ul className={styles.tooltipList}>
              <li>✉️ Confirmação de cadastro</li>
              <li>🔔 Notificações de vagas</li>
              <li>🔑 Recuperação de senha</li>
            </ul>
            <div className={styles.tooltipExample}>
              <strong>Exemplo:</strong> seunome@email.com
            </div>
            <p className={styles.tooltipWarning}>
              ⚠️ E-mails temporários não são aceitos
            </p>
          </div>
        </div>
      )}

      {/* Mensagem de validação */}
      {email && validation && (
        <div className={`${styles.validationMessage} ${styles[validation.type]}`}>
          {validation.message}
        </div>
      )}

      {/* Sugestão de correção */}
      {suggestion && (
        <div className={styles.suggestion}>
          Você quis dizer <strong>{suggestion}</strong>?
        </div>
      )}
    </div>
  );
}

// Função de validação de e-mail
function validateEmail(email: string): ValidationResult {
  // Verificar se está vazio
  if (!email.trim()) {
    return { isValid: false, message: 'E-mail é obrigatório', type: 'error' };
  }

  // Regex para validação básica de e-mail
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    // Verificações específicas para mensagens mais úteis
    if (!email.includes('@')) {
      return { isValid: false, message: 'Falta o símbolo @', type: 'error' };
    }
    
    const [localPart, domain] = email.split('@');
    
    if (!localPart) {
      return { isValid: false, message: 'Digite algo antes do @', type: 'error' };
    }
    
    if (!domain) {
      return { isValid: false, message: 'Digite o domínio após o @', type: 'error' };
    }
    
    if (!domain.includes('.')) {
      return { isValid: false, message: 'Domínio incompleto (ex: gmail.com)', type: 'error' };
    }
    
    return { isValid: false, message: 'Formato de e-mail inválido', type: 'error' };
  }

  // Verificar domínios descartáveis
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.some(d => domain.includes(d))) {
    return { isValid: false, message: 'E-mails temporários não são aceitos', type: 'error' };
  }

  // E-mail válido
  return { isValid: true, message: 'E-mail válido', type: 'success' };
}

// Função para sugerir correção de domínio
function getSuggestion(email: string): string | null {
  if (!email.includes('@')) return null;
  
  const [localPart, domain] = email.split('@');
  if (!domain || domain.length < 3) return null;
  
  // Verificar se o domínio é similar a algum domínio comum
  const domainLower = domain.toLowerCase();
  
  for (const commonDomain of commonDomains) {
    // Se já é um domínio comum, não sugerir
    if (domainLower === commonDomain) return null;
    
    // Verificar similaridade (distância de Levenshtein simplificada)
    if (isSimilar(domainLower, commonDomain)) {
      return `${localPart}@${commonDomain}`;
    }
  }
  
  return null;
}

// Função simplificada para verificar similaridade
function isSimilar(str1: string, str2: string): boolean {
  // Se a diferença de tamanho for muito grande, não são similares
  if (Math.abs(str1.length - str2.length) > 2) return false;
  
  // Contar caracteres diferentes
  let differences = 0;
  const maxLen = Math.max(str1.length, str2.length);
  
  for (let i = 0; i < maxLen; i++) {
    if (str1[i] !== str2[i]) differences++;
    if (differences > 2) return false;
  }
  
  return differences > 0 && differences <= 2;
}

// Exportar função de validação para uso externo
export { validateEmail };
