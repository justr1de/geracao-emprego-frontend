/**
 * Serviço de SMS para verificação de telefone
 * Suporta Twilio e AWS SNS
 * 
 * Configuração via variáveis de ambiente:
 * - SMS_PROVIDER: 'twilio' | 'aws' | 'mock'
 * - TWILIO_ACCOUNT_SID: SID da conta Twilio
 * - TWILIO_AUTH_TOKEN: Token de autenticação Twilio
 * - TWILIO_PHONE_NUMBER: Número de telefone Twilio
 * - AWS_ACCESS_KEY_ID: Chave de acesso AWS
 * - AWS_SECRET_ACCESS_KEY: Chave secreta AWS
 * - AWS_REGION: Região AWS (padrão: sa-east-1)
 */

export type SMSProvider = 'twilio' | 'aws' | 'mock';

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SMSConfig {
  provider: SMSProvider;
  twilio?: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  aws?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
}

// Obter configuração do ambiente
function getConfig(): SMSConfig {
  const provider = (process.env.SMS_PROVIDER || 'mock') as SMSProvider;
  
  return {
    provider,
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'sa-east-1',
    },
  };
}

// Formatar número de telefone para E.164
function formatPhoneNumber(phone: string): string {
  // Remove tudo exceto números
  const digits = phone.replace(/\D/g, '');
  
  // Se já começa com 55, retorna com +
  if (digits.startsWith('55') && digits.length === 13) {
    return `+${digits}`;
  }
  
  // Adiciona código do Brasil
  if (digits.length === 11) {
    return `+55${digits}`;
  }
  
  // Se tem 10 dígitos (sem o 9), adiciona o 9
  if (digits.length === 10) {
    const ddd = digits.substring(0, 2);
    const number = digits.substring(2);
    return `+55${ddd}9${number}`;
  }
  
  return `+55${digits}`;
}

// Enviar SMS via Twilio
async function sendViaTwilio(
  phone: string,
  message: string,
  config: SMSConfig
): Promise<SMSResult> {
  const { accountSid, authToken, phoneNumber } = config.twilio!;
  
  if (!accountSid || !authToken || !phoneNumber) {
    return {
      success: false,
      error: 'Configuração do Twilio incompleta',
    };
  }
  
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formatPhoneNumber(phone),
        From: phoneNumber,
        Body: message,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        messageId: data.sid,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Erro ao enviar SMS via Twilio',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Enviar SMS via AWS SNS
async function sendViaAWS(
  phone: string,
  message: string,
  config: SMSConfig
): Promise<SMSResult> {
  const { accessKeyId, secretAccessKey, region } = config.aws!;
  
  if (!accessKeyId || !secretAccessKey) {
    return {
      success: false,
      error: 'Configuração da AWS incompleta',
    };
  }
  
  try {
    // Importar AWS SDK dinamicamente para evitar erros se não estiver instalado
    const { SNSClient, PublishCommand } = await import('@aws-sdk/client-sns');
    
    const client = new SNSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    
    const command = new PublishCommand({
      PhoneNumber: formatPhoneNumber(phone),
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: 'GeracaoEmp',
        },
      },
    });
    
    const response = await client.send(command);
    
    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Modo mock para desenvolvimento
async function sendViaMock(
  phone: string,
  message: string
): Promise<SMSResult> {
  console.log(`[SMS MOCK] Para: ${formatPhoneNumber(phone)}`);
  console.log(`[SMS MOCK] Mensagem: ${message}`);
  
  // Simula delay de envio
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    messageId: `mock-${Date.now()}`,
  };
}

// Função principal de envio de SMS
export async function sendSMS(
  phone: string,
  message: string
): Promise<SMSResult> {
  const config = getConfig();
  
  switch (config.provider) {
    case 'twilio':
      return sendViaTwilio(phone, message, config);
    case 'aws':
      return sendViaAWS(phone, message, config);
    case 'mock':
    default:
      return sendViaMock(phone, message);
  }
}

// Enviar código de verificação
export async function sendVerificationCode(
  phone: string,
  code: string
): Promise<SMSResult> {
  const message = `[Geração Emprego] Seu código de verificação é: ${code}. Válido por 10 minutos. Não compartilhe este código.`;
  return sendSMS(phone, message);
}

// Enviar notificação de candidatura
export async function sendCandidaturaNotification(
  phone: string,
  vagaTitulo: string,
  empresaNome: string
): Promise<SMSResult> {
  const message = `[Geração Emprego] Sua candidatura para "${vagaTitulo}" na empresa ${empresaNome} foi recebida! Acompanhe pelo portal.`;
  return sendSMS(phone, message);
}

// Enviar notificação de status de candidatura
export async function sendStatusNotification(
  phone: string,
  vagaTitulo: string,
  status: 'aprovado' | 'reprovado' | 'entrevista'
): Promise<SMSResult> {
  const statusMessages = {
    aprovado: `Parabéns! Você foi APROVADO para a vaga "${vagaTitulo}"! Entre em contato com a empresa.`,
    reprovado: `Sua candidatura para "${vagaTitulo}" não foi selecionada desta vez. Continue buscando!`,
    entrevista: `Você foi selecionado para ENTREVISTA na vaga "${vagaTitulo}"! Verifique seu e-mail para detalhes.`,
  };
  
  const message = `[Geração Emprego] ${statusMessages[status]}`;
  return sendSMS(phone, message);
}

export default {
  sendSMS,
  sendVerificationCode,
  sendCandidaturaNotification,
  sendStatusNotification,
};
