// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Loader2, User, Briefcase, GraduationCap, FileText } from 'lucide-react';
import styles from './page.module.css';

// Dados simulados do SouGov
const mockSouGovData = {
  nome: 'Maria Silva Santos',
  cpf: '***.***.***-00',
  dataNascimento: '15/03/1990',
  email: 'maria.santos@email.com',
  telefone: '(69) 99999-0000',
  endereco: {
    cidade: 'Porto Velho',
    estado: 'RO',
  },
  escolaridade: 'Ensino Superior Completo',
  formacao: 'Administração de Empresas',
  experiencias: [
    { cargo: 'Assistente Administrativo', empresa: 'Empresa ABC', periodo: '2018 - 2021' },
    { cargo: 'Auxiliar de Escritório', empresa: 'Comércio XYZ', periodo: '2015 - 2018' },
  ],
};

export default function SouGovLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({
    dadosPessoais: true,
    escolaridade: true,
    experiencias: true,
  });

  // Simular autenticação SouGov
  useEffect(() => {
    if (step === 1) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleConfirmImport = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(3);
      setLoading(false);
    }, 1500);
  };

  const handleFinish = () => {
    router.push('/perfil');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <Image
            src="/logos/sougov.png"
            alt="SouGov.br"
            width={48}
            height={48}
            className={styles.logo}
          />
          <h1 className={styles.title}>Integração SouGov.br</h1>
          <p className={styles.subtitle}>
            {step === 1 && 'Conectando com o SouGov.br...'}
            {step === 2 && 'Selecione os dados que deseja importar'}
            {step === 3 && 'Dados importados com sucesso!'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className={styles.progress}>
          <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Autenticar</span>
          </div>
          <div className={styles.progressLine} />
          <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Selecionar</span>
          </div>
          <div className={styles.progressLine} />
          <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Concluir</span>
          </div>
        </div>

        {/* Step 1: Loading */}
        {step === 1 && (
          <div className={styles.loadingSection}>
            <Loader2 className={styles.spinner} size={48} />
            <p>Autenticando com SouGov.br...</p>
            <p className={styles.loadingHint}>
              (Demonstração - Em produção, você será redirecionado para o login gov.br)
            </p>
          </div>
        )}

        {/* Step 2: Data Selection */}
        {step === 2 && (
          <div className={styles.dataSection}>
            <div className={styles.userPreview}>
              <div className={styles.avatar}>
                <User size={32} />
              </div>
              <div>
                <h3>{mockSouGovData.nome}</h3>
                <p>CPF: {mockSouGovData.cpf}</p>
              </div>
            </div>

            <div className={styles.dataOptions}>
              <label className={styles.dataOption}>
                <input
                  type="checkbox"
                  checked={selectedData.dadosPessoais}
                  onChange={(e) => setSelectedData({ ...selectedData, dadosPessoais: e.target.checked })}
                />
                <div className={styles.optionContent}>
                  <FileText size={20} />
                  <div>
                    <strong>Dados Pessoais</strong>
                    <p>Nome, CPF, data de nascimento, contato</p>
                  </div>
                </div>
              </label>

              <label className={styles.dataOption}>
                <input
                  type="checkbox"
                  checked={selectedData.escolaridade}
                  onChange={(e) => setSelectedData({ ...selectedData, escolaridade: e.target.checked })}
                />
                <div className={styles.optionContent}>
                  <GraduationCap size={20} />
                  <div>
                    <strong>Escolaridade</strong>
                    <p>{mockSouGovData.escolaridade} - {mockSouGovData.formacao}</p>
                  </div>
                </div>
              </label>

              <label className={styles.dataOption}>
                <input
                  type="checkbox"
                  checked={selectedData.experiencias}
                  onChange={(e) => setSelectedData({ ...selectedData, experiencias: e.target.checked })}
                />
                <div className={styles.optionContent}>
                  <Briefcase size={20} />
                  <div>
                    <strong>Experiências Profissionais</strong>
                    <p>{mockSouGovData.experiencias.length} experiências encontradas</p>
                  </div>
                </div>
              </label>
            </div>

            <div className={styles.disclaimer}>
              <p>
                <strong>Nota:</strong> Esta é uma demonstração. Em produção, os dados serão 
                importados diretamente da sua conta gov.br através do SouGov.
              </p>
            </div>

            <button
              className={styles.confirmBtn}
              onClick={handleConfirmImport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className={styles.spinnerSmall} size={20} />
                  Importando...
                </>
              ) : (
                'Importar Dados Selecionados'
              )}
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className={styles.successSection}>
            <CheckCircle className={styles.successIcon} size={64} />
            <h2>Dados Importados!</h2>
            <p>Seu currículo foi preenchido automaticamente com os dados do SouGov.br</p>

            <div className={styles.importedSummary}>
              <h4>Dados importados:</h4>
              <ul>
                {selectedData.dadosPessoais && <li>✓ Dados pessoais</li>}
                {selectedData.escolaridade && <li>✓ Escolaridade</li>}
                {selectedData.experiencias && <li>✓ {mockSouGovData.experiencias.length} experiências profissionais</li>}
              </ul>
            </div>

            <button className={styles.finishBtn} onClick={handleFinish}>
              Ver Meu Perfil
            </button>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <p>
            Integração oficial com <strong>SouGov.br</strong> - Governo Federal
          </p>
        </div>
      </div>
    </div>
  );
}
