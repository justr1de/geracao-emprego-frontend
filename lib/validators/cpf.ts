/**
 * Validador de CPF
 * Implementa a validação matemática dos dígitos verificadores do CPF brasileiro
 */

/**
 * Remove caracteres não numéricos do CPF
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Formata CPF para exibição (000.000.000-00)
 */
export function formatCPF(cpf: string): string {
  const cleaned = cleanCPF(cpf);
  if (cleaned.length !== 11) return cpf;
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Valida se o CPF possui formato correto e dígitos verificadores válidos
 * 
 * Algoritmo de validação:
 * 1. O CPF deve ter exatamente 11 dígitos
 * 2. Não pode ser uma sequência de dígitos iguais (ex: 111.111.111-11)
 * 3. O primeiro dígito verificador é calculado a partir dos 9 primeiros dígitos
 * 4. O segundo dígito verificador é calculado a partir dos 10 primeiros dígitos
 */
export function validateCPF(cpf: string): { valid: boolean; message: string } {
  const cleaned = cleanCPF(cpf);
  
  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) {
    return {
      valid: false,
      message: 'CPF deve conter 11 dígitos'
    };
  }
  
  // Verifica se não é uma sequência de dígitos iguais
  const invalidSequences = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999'
  ];
  
  if (invalidSequences.includes(cleaned)) {
    return {
      valid: false,
      message: 'CPF inválido: sequência de dígitos repetidos'
    };
  }
  
  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cleaned.charAt(9))) {
    return {
      valid: false,
      message: 'CPF inválido: primeiro dígito verificador incorreto'
    };
  }
  
  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cleaned.charAt(10))) {
    return {
      valid: false,
      message: 'CPF inválido: segundo dígito verificador incorreto'
    };
  }
  
  return {
    valid: true,
    message: 'CPF válido'
  };
}

/**
 * Verifica se o CPF já está cadastrado no sistema
 */
export async function checkCPFExists(cpf: string): Promise<{ exists: boolean; message: string }> {
  try {
    const cleaned = cleanCPF(cpf);
    const response = await fetch(`/api/candidatos/check-cpf?cpf=${cleaned}`);
    const data = await response.json();
    
    if (data.exists) {
      return {
        exists: true,
        message: 'Este CPF já está cadastrado no sistema'
      };
    }
    
    return {
      exists: false,
      message: 'CPF disponível para cadastro'
    };
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return {
      exists: false,
      message: 'Não foi possível verificar o CPF no momento'
    };
  }
}

/**
 * Máscara de CPF para input
 */
export function maskCPF(value: string): string {
  const cleaned = cleanCPF(value);
  
  if (cleaned.length <= 3) {
    return cleaned;
  }
  if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  }
  if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  }
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
}
