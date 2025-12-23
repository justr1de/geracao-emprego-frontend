/**
 * Validador de CNPJ
 * Implementa a validação matemática dos dígitos verificadores do CNPJ brasileiro
 */

/**
 * Remove caracteres não numéricos do CNPJ
 */
export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Formata CNPJ para exibição (00.000.000/0000-00)
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cleanCNPJ(cnpj);
  if (cleaned.length !== 14) return cnpj;
  
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Valida se o CNPJ possui formato correto e dígitos verificadores válidos
 * 
 * Algoritmo de validação:
 * 1. O CNPJ deve ter exatamente 14 dígitos
 * 2. Não pode ser uma sequência de dígitos iguais
 * 3. O primeiro dígito verificador é calculado a partir dos 12 primeiros dígitos
 * 4. O segundo dígito verificador é calculado a partir dos 13 primeiros dígitos
 */
export function validateCNPJ(cnpj: string): { valid: boolean; message: string } {
  const cleaned = cleanCNPJ(cnpj);
  
  // Verifica se tem 14 dígitos
  if (cleaned.length !== 14) {
    return {
      valid: false,
      message: 'CNPJ deve conter 14 dígitos'
    };
  }
  
  // Verifica se não é uma sequência de dígitos iguais
  const invalidSequences = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999'
  ];
  
  if (invalidSequences.includes(cleaned)) {
    return {
      valid: false,
      message: 'CNPJ inválido: sequência de dígitos repetidos'
    };
  }
  
  // Calcula o primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i];
  }
  
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(cleaned.charAt(12))) {
    return {
      valid: false,
      message: 'CNPJ inválido: primeiro dígito verificador incorreto'
    };
  }
  
  // Calcula o segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i];
  }
  
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit2 !== parseInt(cleaned.charAt(13))) {
    return {
      valid: false,
      message: 'CNPJ inválido: segundo dígito verificador incorreto'
    };
  }
  
  return {
    valid: true,
    message: 'CNPJ válido'
  };
}

/**
 * Verifica se o CNPJ já está cadastrado no sistema
 */
export async function checkCNPJExists(cnpj: string): Promise<{ exists: boolean; message: string }> {
  try {
    const cleaned = cleanCNPJ(cnpj);
    const response = await fetch(`/api/empresas/check-cnpj?cnpj=${cleaned}`);
    const data = await response.json();
    
    if (data.exists) {
      return {
        exists: true,
        message: 'Este CNPJ já está cadastrado no sistema'
      };
    }
    
    return {
      exists: false,
      message: 'CNPJ disponível para cadastro'
    };
  } catch (error) {
    console.error('Erro ao verificar CNPJ:', error);
    return {
      exists: false,
      message: 'Não foi possível verificar o CNPJ no momento'
    };
  }
}

/**
 * Consulta dados da empresa na Receita Federal (via API pública)
 * Útil para preencher automaticamente dados da empresa
 */
export async function fetchCNPJData(cnpj: string): Promise<{
  success: boolean;
  data?: {
    razao_social: string;
    nome_fantasia: string;
    cnpj: string;
    situacao: string;
    tipo: string;
    porte: string;
    natureza_juridica: string;
    atividade_principal: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      municipio: string;
      uf: string;
      cep: string;
    };
    telefone: string;
    email: string;
  };
  message: string;
}> {
  try {
    const cleaned = cleanCNPJ(cnpj);
    
    // Valida o CNPJ antes de consultar
    const validation = validateCNPJ(cleaned);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message
      };
    }
    
    // Consulta API pública (BrasilAPI)
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: 'CNPJ não encontrado na base da Receita Federal'
        };
      }
      throw new Error('Erro na consulta');
    }
    
    const apiData = await response.json();
    
    return {
      success: true,
      data: {
        razao_social: apiData.razao_social || '',
        nome_fantasia: apiData.nome_fantasia || '',
        cnpj: cleaned,
        situacao: apiData.descricao_situacao_cadastral || '',
        tipo: apiData.descricao_tipo_de_sociedade || '',
        porte: apiData.porte || '',
        natureza_juridica: apiData.natureza_juridica || '',
        atividade_principal: apiData.cnae_fiscal_descricao || '',
        endereco: {
          logradouro: apiData.logradouro || '',
          numero: apiData.numero || '',
          complemento: apiData.complemento || '',
          bairro: apiData.bairro || '',
          municipio: apiData.municipio || '',
          uf: apiData.uf || '',
          cep: apiData.cep || ''
        },
        telefone: apiData.ddd_telefone_1 || '',
        email: apiData.email || ''
      },
      message: 'Dados obtidos com sucesso'
    };
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    return {
      success: false,
      message: 'Não foi possível consultar os dados do CNPJ no momento'
    };
  }
}

/**
 * Máscara de CNPJ para input
 */
export function maskCNPJ(value: string): string {
  const cleaned = cleanCNPJ(value);
  
  if (cleaned.length <= 2) {
    return cleaned;
  }
  if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
  }
  if (cleaned.length <= 8) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
  }
  if (cleaned.length <= 12) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
  }
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
}
