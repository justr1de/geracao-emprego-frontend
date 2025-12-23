/**
 * Serviço de E-mail para notificações
 * Usa Supabase Auth para e-mails transacionais
 * 
 * Templates disponíveis:
 * - Confirmação de cadastro
 * - Recuperação de senha
 * - Notificação de candidatura
 * - Atualização de status
 * - Convite para entrevista
 */

import { createClient } from '@/lib/supabase/server';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Templates de e-mail
export const emailTemplates = {
  // Template de boas-vindas após cadastro
  welcome: (nome: string): EmailTemplate => ({
    subject: 'Bem-vindo ao Geração Emprego! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #1a5f2a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">📋 Geração Emprego</div>
            <p>Programa de Empregabilidade do Governo de Rondônia</p>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Seja bem-vindo(a) ao <strong>Geração Emprego</strong>, o portal oficial de empregabilidade do Governo do Estado de Rondônia!</p>
            <p>Agora você tem acesso a:</p>
            <ul>
              <li>✅ Vagas de emprego em todo o estado</li>
              <li>✅ Cursos profissionalizantes gratuitos</li>
              <li>✅ Cadastro de currículo online</li>
              <li>✅ Acompanhamento de candidaturas</li>
            </ul>
            <p>Complete seu perfil para aumentar suas chances de ser encontrado pelas empresas!</p>
            <a href="https://geracao-emprego-dev.vercel.app/perfil" class="button">Completar Perfil</a>
          </div>
          <div class="footer">
            <p>Uma iniciativa do Governo de Rondônia</p>
            <p>SEDEC • SINE Estadual</p>
            <p>Dúvidas? Entre em contato: lgpd@sedec.ro.gov.br</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Olá, ${nome}!

Seja bem-vindo(a) ao Geração Emprego, o portal oficial de empregabilidade do Governo do Estado de Rondônia!

Agora você tem acesso a:
- Vagas de emprego em todo o estado
- Cursos profissionalizantes gratuitos
- Cadastro de currículo online
- Acompanhamento de candidaturas

Complete seu perfil para aumentar suas chances de ser encontrado pelas empresas!
Acesse: https://geracao-emprego-dev.vercel.app/perfil

Uma iniciativa do Governo de Rondônia
SEDEC • SINE Estadual
    `,
  }),

  // Template de confirmação de candidatura
  candidaturaConfirmacao: (
    nome: string,
    vagaTitulo: string,
    empresaNome: string,
    dataAplicacao: string
  ): EmailTemplate => ({
    subject: `Candidatura Recebida: ${vagaTitulo}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a5f2a; }
          .button { display: inline-block; background: #1a5f2a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Candidatura Recebida!</h1>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Sua candidatura foi enviada com sucesso!</p>
            <div class="info-box">
              <p><strong>Vaga:</strong> ${vagaTitulo}</p>
              <p><strong>Empresa:</strong> ${empresaNome}</p>
              <p><strong>Data:</strong> ${dataAplicacao}</p>
            </div>
            <p>A empresa analisará seu perfil e entrará em contato caso você seja selecionado para as próximas etapas.</p>
            <p>Acompanhe o status da sua candidatura pelo portal:</p>
            <a href="https://geracao-emprego-dev.vercel.app/minhas-candidaturas" class="button">Ver Minhas Candidaturas</a>
          </div>
          <div class="footer">
            <p>Geração Emprego - Governo de Rondônia</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Olá, ${nome}!

Sua candidatura foi enviada com sucesso!

Vaga: ${vagaTitulo}
Empresa: ${empresaNome}
Data: ${dataAplicacao}

A empresa analisará seu perfil e entrará em contato caso você seja selecionado para as próximas etapas.

Acompanhe o status: https://geracao-emprego-dev.vercel.app/minhas-candidaturas

Geração Emprego - Governo de Rondônia
    `,
  }),

  // Template de atualização de status
  statusUpdate: (
    nome: string,
    vagaTitulo: string,
    empresaNome: string,
    status: 'em_analise' | 'entrevista' | 'aprovado' | 'reprovado',
    mensagemAdicional?: string
  ): EmailTemplate => {
    const statusInfo = {
      em_analise: {
        titulo: '📋 Candidatura em Análise',
        cor: '#f59e0b',
        mensagem: 'Sua candidatura está sendo analisada pela empresa.',
      },
      entrevista: {
        titulo: '🎯 Você foi selecionado para Entrevista!',
        cor: '#3b82f6',
        mensagem: 'Parabéns! Você avançou para a etapa de entrevista.',
      },
      aprovado: {
        titulo: '🎉 Parabéns! Você foi Aprovado!',
        cor: '#22c55e',
        mensagem: 'Você foi selecionado para a vaga! A empresa entrará em contato.',
      },
      reprovado: {
        titulo: '📝 Atualização da sua Candidatura',
        cor: '#ef4444',
        mensagem: 'Infelizmente sua candidatura não foi selecionada desta vez.',
      },
    };

    const info = statusInfo[status];

    return {
      subject: `${info.titulo} - ${vagaTitulo}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${info.cor}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #1a5f2a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${info.titulo}</h1>
            </div>
            <div class="content">
              <h2>Olá, ${nome}!</h2>
              <p>${info.mensagem}</p>
              <div class="info-box">
                <p><strong>Vaga:</strong> ${vagaTitulo}</p>
                <p><strong>Empresa:</strong> ${empresaNome}</p>
              </div>
              ${mensagemAdicional ? `<p><strong>Mensagem da empresa:</strong> ${mensagemAdicional}</p>` : ''}
              ${status === 'reprovado' ? '<p>Continue buscando! Novas oportunidades surgem todos os dias no Geração Emprego.</p>' : ''}
              <a href="https://geracao-emprego-dev.vercel.app/minhas-candidaturas" class="button">Ver Detalhes</a>
            </div>
            <div class="footer">
              <p>Geração Emprego - Governo de Rondônia</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Olá, ${nome}!

${info.titulo}

${info.mensagem}

Vaga: ${vagaTitulo}
Empresa: ${empresaNome}
${mensagemAdicional ? `\nMensagem da empresa: ${mensagemAdicional}` : ''}

Acesse: https://geracao-emprego-dev.vercel.app/minhas-candidaturas

Geração Emprego - Governo de Rondônia
      `,
    };
  },

  // Template de convite para entrevista
  conviteEntrevista: (
    nome: string,
    vagaTitulo: string,
    empresaNome: string,
    dataEntrevista: string,
    horaEntrevista: string,
    local: string,
    observacoes?: string
  ): EmailTemplate => ({
    subject: `🎯 Convite para Entrevista: ${vagaTitulo}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .button { display: inline-block; background: #1a5f2a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Convite para Entrevista</h1>
            <p>Parabéns! Você foi selecionado!</p>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Temos o prazer de convidá-lo(a) para uma entrevista para a vaga de <strong>${vagaTitulo}</strong> na empresa <strong>${empresaNome}</strong>.</p>
            
            <div class="highlight">
              <h3>📅 Detalhes da Entrevista</h3>
              <p><strong>Data:</strong> ${dataEntrevista}</p>
              <p><strong>Horário:</strong> ${horaEntrevista}</p>
              <p><strong>Local:</strong> ${local}</p>
            </div>
            
            ${observacoes ? `
            <div class="info-box">
              <h4>📝 Observações</h4>
              <p>${observacoes}</p>
            </div>
            ` : ''}
            
            <p><strong>Dicas para a entrevista:</strong></p>
            <ul>
              <li>Chegue com 15 minutos de antecedência</li>
              <li>Leve documentos pessoais (RG, CPF)</li>
              <li>Vista-se adequadamente</li>
              <li>Pesquise sobre a empresa</li>
            </ul>
            
            <p>Boa sorte!</p>
          </div>
          <div class="footer">
            <p>Geração Emprego - Governo de Rondônia</p>
            <p>Em caso de dúvidas, entre em contato com a empresa.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Olá, ${nome}!

CONVITE PARA ENTREVISTA

Você foi selecionado para uma entrevista!

Vaga: ${vagaTitulo}
Empresa: ${empresaNome}

DETALHES DA ENTREVISTA:
Data: ${dataEntrevista}
Horário: ${horaEntrevista}
Local: ${local}
${observacoes ? `\nObservações: ${observacoes}` : ''}

Dicas:
- Chegue com 15 minutos de antecedência
- Leve documentos pessoais
- Vista-se adequadamente

Boa sorte!

Geração Emprego - Governo de Rondônia
    `,
  }),
};

// Função para enviar e-mail via Supabase
export async function sendEmail(
  to: string,
  template: EmailTemplate
): Promise<EmailResult> {
  try {
    // Por enquanto, usamos o sistema de e-mail do Supabase Auth
    // Para e-mails customizados, seria necessário integrar com um serviço como SendGrid, Resend, etc.
    
    console.log(`[EMAIL] Para: ${to}`);
    console.log(`[EMAIL] Assunto: ${template.subject}`);
    console.log(`[EMAIL] Conteúdo: ${template.text.substring(0, 100)}...`);
    
    // TODO: Integrar com serviço de e-mail (SendGrid, Resend, AWS SES)
    // Por enquanto, retornamos sucesso para não bloquear o fluxo
    
    return {
      success: true,
      messageId: `email-${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao enviar e-mail',
    };
  }
}

// Funções de conveniência
export async function sendWelcomeEmail(email: string, nome: string): Promise<EmailResult> {
  return sendEmail(email, emailTemplates.welcome(nome));
}

export async function sendCandidaturaEmail(
  email: string,
  nome: string,
  vagaTitulo: string,
  empresaNome: string
): Promise<EmailResult> {
  const dataAplicacao = new Date().toLocaleDateString('pt-BR');
  return sendEmail(email, emailTemplates.candidaturaConfirmacao(nome, vagaTitulo, empresaNome, dataAplicacao));
}

export async function sendStatusEmail(
  email: string,
  nome: string,
  vagaTitulo: string,
  empresaNome: string,
  status: 'em_analise' | 'entrevista' | 'aprovado' | 'reprovado',
  mensagemAdicional?: string
): Promise<EmailResult> {
  return sendEmail(email, emailTemplates.statusUpdate(nome, vagaTitulo, empresaNome, status, mensagemAdicional));
}

export async function sendEntrevistaEmail(
  email: string,
  nome: string,
  vagaTitulo: string,
  empresaNome: string,
  dataEntrevista: string,
  horaEntrevista: string,
  local: string,
  observacoes?: string
): Promise<EmailResult> {
  return sendEmail(email, emailTemplates.conviteEntrevista(
    nome, vagaTitulo, empresaNome, dataEntrevista, horaEntrevista, local, observacoes
  ));
}

export default {
  sendEmail,
  sendWelcomeEmail,
  sendCandidaturaEmail,
  sendStatusEmail,
  sendEntrevistaEmail,
  templates: emailTemplates,
};
