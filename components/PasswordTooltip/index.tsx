'use client';

import { useState } from 'react';
import { Info, Check, X, Shield, AlertTriangle } from 'lucide-react';
import styles from './index.module.css';

interface PasswordTooltipProps {
  password?: string;
  showValidation?: boolean;
}

interface ValidationRule {
  label: string;
  test: (password: string) => boolean;
}

const validationRules: ValidationRule[] = [
  { label: 'Mínimo 6 caracteres', test: (p) => p.length >= 6 },
  { label: 'Pelo menos 1 letra maiúscula', test: (p) => /[A-Z]/.test(p) },
  { label: 'Pelo menos 1 letra minúscula', test: (p) => /[a-z]/.test(p) },
  { label: 'Pelo menos 1 número', test: (p) => /[0-9]/.test(p) },
  { label: 'Pelo menos 1 caractere especial (!@#$%&*)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export default function PasswordTooltip({ password = '', showValidation = false }: PasswordTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPasswordStrength = (pwd: string): { level: number; label: string; color: string } => {
    const passedRules = validationRules.filter(rule => rule.test(pwd)).length;
    
    if (passedRules === 0) return { level: 0, label: 'Muito fraca', color: '#ef4444' };
    if (passedRules <= 2) return { level: 1, label: 'Fraca', color: '#f97316' };
    if (passedRules <= 3) return { level: 2, label: 'Média', color: '#eab308' };
    if (passedRules <= 4) return { level: 3, label: 'Forte', color: '#22c55e' };
    return { level: 4, label: 'Muito forte', color: '#16a34a' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.trigger}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        aria-label="Ver critérios de senha"
        aria-expanded={isOpen}
      >
        <Info size={16} />
      </button>

      {isOpen && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.header}>
            <Shield size={18} className={styles.headerIcon} />
            <span>Critérios de Segurança</span>
          </div>

          <div className={styles.content}>
            <p className={styles.description}>
              Para sua segurança, a senha deve conter:
            </p>

            <ul className={styles.rulesList}>
              {validationRules.map((rule, index) => {
                const passed = showValidation && password ? rule.test(password) : null;
                return (
                  <li key={index} className={`${styles.rule} ${passed === true ? styles.passed : passed === false ? styles.failed : ''}`}>
                    {passed === true ? (
                      <Check size={14} className={styles.checkIcon} />
                    ) : passed === false ? (
                      <X size={14} className={styles.xIcon} />
                    ) : (
                      <span className={styles.bullet}>•</span>
                    )}
                    <span>{rule.label}</span>
                  </li>
                );
              })}
            </ul>

            {showValidation && password && (
              <div className={styles.strengthContainer}>
                <div className={styles.strengthLabel}>
                  <span>Força da senha:</span>
                  <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
                <div className={styles.strengthBar}>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={styles.strengthSegment}
                      style={{
                        backgroundColor: level <= strength.level ? strength.color : '#e2e8f0'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.warning}>
              <AlertTriangle size={14} className={styles.warningIcon} />
              <div>
                <strong>Evite usar:</strong>
                <ul className={styles.avoidList}>
                  <li>Datas comemorativas (aniversário, casamento)</li>
                  <li>Sequências simples (123456, abcdef)</li>
                  <li>Informações pessoais (nome, CPF)</li>
                  <li>Senhas muito comuns (senha123, admin)</li>
                </ul>
              </div>
            </div>

            <p className={styles.footer}>
              🔒 Senhas fortes protegem seus dados pessoais
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Função utilitária para validar senha (pode ser exportada e usada em outros lugares)
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 6) errors.push('Mínimo 6 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Falta letra maiúscula');
  if (!/[a-z]/.test(password)) errors.push('Falta letra minúscula');
  if (!/[0-9]/.test(password)) errors.push('Falta número');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Falta caractere especial');
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
