/**
 * Validador de E-mail
 * Implementa validação de formato e verificação de domínio
 */

/**
 * Valida o formato do e-mail usando regex
 */
export function validateEmailFormat(email: string): { valid: boolean; message: string } {
  if (!email || email.trim() === '') {
    return {
      valid: false,
      message: 'E-mail é obrigatório'
    };
  }

  // Regex para validação de e-mail
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: 'Formato de e-mail inválido'
    };
  }

  // Verifica se o domínio tem pelo menos um ponto
  const domain = email.split('@')[1];
  if (!domain || !domain.includes('.')) {
    return {
      valid: false,
      message: 'Domínio de e-mail inválido'
    };
  }

  // Lista de domínios temporários/descartáveis conhecidos
  const disposableDomains = [
    'tempmail.com',
    'throwaway.email',
    'guerrillamail.com',
    'mailinator.com',
    '10minutemail.com',
    'temp-mail.org',
    'fakeinbox.com',
    'trashmail.com'
  ];

  if (disposableDomains.includes(domain.toLowerCase())) {
    return {
      valid: false,
      message: 'E-mails temporários não são permitidos'
    };
  }

  return {
    valid: true,
    message: 'E-mail válido'
  };
}

/**
 * Verifica se o e-mail já está cadastrado no sistema
 */
export async function checkEmailExists(email: string): Promise<{ exists: boolean; message: string }> {
  try {
    const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();

    if (data.exists) {
      return {
        exists: true,
        message: 'Este e-mail já está cadastrado no sistema'
      };
    }

    return {
      exists: false,
      message: 'E-mail disponível para cadastro'
    };
  } catch (error) {
    console.error('Erro ao verificar e-mail:', error);
    return {
      exists: false,
      message: 'Não foi possível verificar o e-mail no momento'
    };
  }
}

/**
 * Solicita envio de e-mail de confirmação
 */
export async function sendConfirmationEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Erro ao enviar e-mail de confirmação'
      };
    }

    return {
      success: true,
      message: 'E-mail de confirmação enviado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar e-mail de confirmação:', error);
    return {
      success: false,
      message: 'Erro ao enviar e-mail de confirmação'
    };
  }
}

/**
 * Verifica o token de confirmação de e-mail
 */
export async function verifyEmailToken(token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Token de verificação inválido ou expirado'
      };
    }

    return {
      success: true,
      message: 'E-mail verificado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return {
      success: false,
      message: 'Erro ao verificar e-mail'
    };
  }
}
