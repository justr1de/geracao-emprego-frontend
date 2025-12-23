// Serviço de verificação de telefone via Firebase Authentication
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential,
  linkWithCredential,
  updatePhoneNumber,
  User
} from 'firebase/auth';
import { auth } from './config';

// Armazenar o confirmationResult globalmente para uso posterior
let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Formatar número de telefone para o padrão internacional
 * @param phone Número de telefone (ex: 69999887766)
 * @returns Número formatado (ex: +5569999887766)
 */
export function formatPhoneNumber(phone: string): string {
  // Remover caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Se já começar com 55, apenas adicionar o +
  if (cleaned.startsWith('55')) {
    return `+${cleaned}`;
  }
  
  // Adicionar código do Brasil
  return `+55${cleaned}`;
}

/**
 * Inicializar o reCAPTCHA verifier
 * @param containerId ID do elemento HTML que conterá o reCAPTCHA
 * @param invisible Se true, usa reCAPTCHA invisível
 */
export function initRecaptcha(containerId: string, invisible: boolean = true): RecaptchaVerifier {
  // Limpar verifier anterior se existir
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: invisible ? 'invisible' : 'normal',
    callback: () => {
      // reCAPTCHA resolvido - pode prosseguir com a verificação
      console.log('reCAPTCHA verificado com sucesso');
    },
    'expired-callback': () => {
      // reCAPTCHA expirou - resetar
      console.log('reCAPTCHA expirou, por favor tente novamente');
      if (recaptchaVerifier) {
        recaptchaVerifier.render();
      }
    }
  });

  return recaptchaVerifier;
}

/**
 * Enviar código de verificação por SMS
 * @param phoneNumber Número de telefone (pode ser com ou sem formatação)
 * @param recaptchaContainerId ID do elemento para o reCAPTCHA
 * @returns Promise com resultado da operação
 */
export async function sendVerificationCode(
  phoneNumber: string, 
  recaptchaContainerId: string = 'recaptcha-container'
): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Validar formato do número
    if (!/^\+55\d{10,11}$/.test(formattedPhone)) {
      return { 
        success: false, 
        error: 'Número de telefone inválido. Use o formato: (XX) XXXXX-XXXX' 
      };
    }

    // Inicializar reCAPTCHA se não existir
    if (!recaptchaVerifier) {
      initRecaptcha(recaptchaContainerId);
    }

    // Enviar código SMS
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier!);
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Erro ao enviar código:', error);
    
    // Resetar reCAPTCHA em caso de erro
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    const firebaseError = error as { code?: string; message?: string };
    
    // Tratar erros específicos do Firebase
    switch (firebaseError.code) {
      case 'auth/invalid-phone-number':
        return { success: false, error: 'Número de telefone inválido' };
      case 'auth/too-many-requests':
        return { success: false, error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente' };
      case 'auth/quota-exceeded':
        return { success: false, error: 'Limite de SMS excedido. Tente novamente mais tarde' };
      case 'auth/captcha-check-failed':
        return { success: false, error: 'Verificação de segurança falhou. Recarregue a página' };
      case 'auth/missing-phone-number':
        return { success: false, error: 'Número de telefone não informado' };
      default:
        return { 
          success: false, 
          error: firebaseError.message || 'Erro ao enviar código. Tente novamente' 
        };
    }
  }
}

/**
 * Verificar o código SMS recebido
 * @param code Código de 6 dígitos recebido por SMS
 * @returns Promise com resultado da verificação
 */
export async function verifyCode(code: string): Promise<{ 
  success: boolean; 
  error?: string;
  user?: User;
  isNewUser?: boolean;
}> {
  try {
    if (!confirmationResult) {
      return { 
        success: false, 
        error: 'Sessão expirada. Por favor, solicite um novo código' 
      };
    }

    // Validar formato do código
    if (!/^\d{6}$/.test(code)) {
      return { 
        success: false, 
        error: 'Código inválido. Digite os 6 dígitos recebidos por SMS' 
      };
    }

    // Verificar o código
    const result = await confirmationResult.confirm(code);
    
    // Limpar confirmationResult após uso
    confirmationResult = null;
    
    // Verificar se é um novo usuário
    const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

    return { 
      success: true, 
      user: result.user,
      isNewUser
    };
  } catch (error: unknown) {
    console.error('Erro ao verificar código:', error);
    
    const firebaseError = error as { code?: string; message?: string };
    
    switch (firebaseError.code) {
      case 'auth/invalid-verification-code':
        return { success: false, error: 'Código inválido. Verifique e tente novamente' };
      case 'auth/code-expired':
        return { success: false, error: 'Código expirado. Solicite um novo código' };
      case 'auth/session-expired':
        return { success: false, error: 'Sessão expirada. Solicite um novo código' };
      default:
        return { 
          success: false, 
          error: firebaseError.message || 'Erro ao verificar código. Tente novamente' 
        };
    }
  }
}

/**
 * Vincular número de telefone a uma conta existente
 * @param user Usuário autenticado
 * @param verificationId ID da verificação
 * @param code Código SMS
 */
export async function linkPhoneToAccount(
  user: User,
  verificationId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    await linkWithCredential(user, credential);
    return { success: true };
  } catch (error: unknown) {
    console.error('Erro ao vincular telefone:', error);
    const firebaseError = error as { code?: string; message?: string };
    
    if (firebaseError.code === 'auth/credential-already-in-use') {
      return { success: false, error: 'Este número já está vinculado a outra conta' };
    }
    
    return { 
      success: false, 
      error: firebaseError.message || 'Erro ao vincular telefone' 
    };
  }
}

/**
 * Atualizar número de telefone de um usuário
 * @param user Usuário autenticado
 * @param verificationId ID da verificação
 * @param code Código SMS
 */
export async function updateUserPhone(
  user: User,
  verificationId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    await updatePhoneNumber(user, credential);
    return { success: true };
  } catch (error: unknown) {
    console.error('Erro ao atualizar telefone:', error);
    const firebaseError = error as { code?: string; message?: string };
    return { 
      success: false, 
      error: firebaseError.message || 'Erro ao atualizar telefone' 
    };
  }
}

/**
 * Limpar recursos do reCAPTCHA
 */
export function cleanupRecaptcha(): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  confirmationResult = null;
}

/**
 * Verificar se há uma verificação em andamento
 */
export function hasActiveVerification(): boolean {
  return confirmationResult !== null;
}
