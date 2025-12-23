/**
 * Índice de Serviços
 * Exporta todos os serviços disponíveis
 */

export * from './sms';
export * from './email';
export * from './notifications';

// Re-exportar defaults
export { default as smsService } from './sms';
export { default as emailService } from './email';
export { default as notificationService } from './notifications';
