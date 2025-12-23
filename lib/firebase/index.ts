// Exportações do módulo Firebase
export { app, auth, analytics } from './config';
export {
  formatPhoneNumber,
  initRecaptcha,
  sendVerificationCode,
  verifyCode,
  linkPhoneToAccount,
  updateUserPhone,
  cleanupRecaptcha,
  hasActiveVerification
} from './phoneAuth';
