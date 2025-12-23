/**
 * Validador de Telefone
 * Implementa validação de formato e verificação via SMS/WhatsApp (MFA)
 */

/**
 * Remove caracteres não numéricos do telefone
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Formata telefone para exibição (00) 00000-0000
 */
export function formatPhone(phone: string): string {
  const cleaned = cleanPhone(phone);
  
  if (cleaned.length === 10) {
    // Telefone fixo: (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 11) {
    // Celular: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Valida o formato do telefone brasileiro
 */
export function validatePhoneFormat(phone: string): { valid: boolean; message: string } {
  const cleaned = cleanPhone(phone);
  
  // Verifica se tem 10 ou 11 dígitos
  if (cleaned.length < 10 || cleaned.length > 11) {
    return {
      valid: false,
      message: 'Telefone deve conter 10 ou 11 dígitos'
    };
  }
  
  // Verifica se o DDD é válido (11 a 99)
  const ddd = parseInt(cleaned.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return {
      valid: false,
      message: 'DDD inválido'
    };
  }
  
  // Lista de DDDs válidos no Brasil
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // São Paulo
    21, 22, 24, // Rio de Janeiro
    27, 28, // Espírito Santo
    31, 32, 33, 34, 35, 37, 38, // Minas Gerais
    41, 42, 43, 44, 45, 46, // Paraná
    47, 48, 49, // Santa Catarina
    51, 53, 54, 55, // Rio Grande do Sul
    61, // Distrito Federal
    62, 64, // Goiás
    63, // Tocantins
    65, 66, // Mato Grosso
    67, // Mato Grosso do Sul
    68, // Acre
    69, // Rondônia
    71, 73, 74, 75, 77, // Bahia
    79, // Sergipe
    81, 87, // Pernambuco
    82, // Alagoas
    83, // Paraíba
    84, // Rio Grande do Norte
    85, 88, // Ceará
    86, 89, // Piauí
    91, 93, 94, // Pará
    92, 97, // Amazonas
    95, // Roraima
    96, // Amapá
    98, 99 // Maranhão
  ];
  
  if (!validDDDs.includes(ddd)) {
    return {
      valid: false,
      message: 'DDD não reconhecido'
    };
  }
  
  // Se for celular (11 dígitos), o primeiro dígito após o DDD deve ser 9
  if (cleaned.length === 11 && cleaned.charAt(2) !== '9') {
    return {
      valid: false,
      message: 'Número de celular deve começar com 9'
    };
  }
  
  return {
    valid: true,
    message: 'Telefone válido'
  };
}

/**
 * Verifica se o telefone já está cadastrado no sistema
 */
export async function checkPhoneExists(phone: string): Promise<{ exists: boolean; message: string }> {
  try {
    const cleaned = cleanPhone(phone);
    const response = await fetch(`/api/candidatos/check-phone?phone=${cleaned}`);
    const data = await response.json();
    
    if (data.exists) {
      return {
        exists: true,
        message: 'Este telefone já está cadastrado no sistema'
      };
    }
    
    return {
      exists: false,
      message: 'Telefone disponível para cadastro'
    };
  } catch (error) {
    console.error('Erro ao verificar telefone:', error);
    return {
      exists: false,
      message: 'Não foi possível verificar o telefone no momento'
    };
  }
}

/**
 * Solicita envio de código de verificação via SMS ou WhatsApp
 */
export async function sendVerificationCode(
  phone: string, 
  method: 'sms' | 'whatsapp' = 'whatsapp'
): Promise<{ success: boolean; message: string; expiresIn?: number }> {
  try {
    const cleaned = cleanPhone(phone);
    
    const response = await fetch('/api/auth/send-phone-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        phone: cleaned,
        method 
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Erro ao enviar código de verificação'
      };
    }
    
    return {
      success: true,
      message: method === 'whatsapp' 
        ? 'Código enviado via WhatsApp' 
        : 'Código enviado via SMS',
      expiresIn: data.expiresIn || 300 // 5 minutos por padrão
    };
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    return {
      success: false,
      message: 'Erro ao enviar código de verificação'
    };
  }
}

/**
 * Verifica o código de verificação do telefone
 */
export async function verifyPhoneCode(
  phone: string, 
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const cleaned = cleanPhone(phone);
    
    const response = await fetch('/api/auth/verify-phone-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        phone: cleaned,
        code 
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Código inválido ou expirado'
      };
    }
    
    return {
      success: true,
      message: 'Telefone verificado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return {
      success: false,
      message: 'Erro ao verificar código'
    };
  }
}

/**
 * Máscara de telefone para input
 */
export function maskPhone(value: string): string {
  const cleaned = cleanPhone(value);
  
  if (cleaned.length <= 2) {
    return `(${cleaned}`;
  }
  if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  }
  if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  // Celular com 9 dígitos
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}
