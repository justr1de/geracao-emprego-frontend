/**
 * Módulo de Validadores
 * Exporta todas as funções de validação para uso no sistema
 */

// Validador de CPF
export {
  cleanCPF,
  formatCPF,
  validateCPF,
  checkCPFExists,
  maskCPF
} from './cpf';

// Validador de E-mail
export {
  validateEmailFormat,
  checkEmailExists,
  sendConfirmationEmail,
  verifyEmailToken
} from './email';

// Validador de CNPJ
export {
  cleanCNPJ,
  formatCNPJ,
  validateCNPJ,
  checkCNPJExists,
  fetchCNPJData,
  maskCNPJ
} from './cnpj';

// Validador de Telefone
export {
  cleanPhone,
  formatPhone,
  validatePhoneFormat,
  checkPhoneExists,
  sendVerificationCode,
  verifyPhoneCode,
  maskPhone
} from './phone';
