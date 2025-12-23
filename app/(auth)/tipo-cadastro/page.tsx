'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Briefcase, User, Building2, Search } from 'lucide-react';
import styles from './page.module.css';

export default function TipoCadastroPage() {
  return (
    <div className={styles.container}>
      {/* Header com botão voltar */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink} aria-label="Voltar para página inicial">
          <ArrowLeft size={20} />
          Voltar
        </Link>
      </header>

      {/* Main */}
      <main className={styles.main}>
        {/* Logo Governo - Lado Esquerdo */}
        <aside className={styles.sideColumn}>
          <Link 
            href="https://rondonia.ro.gov.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.logoLink}
            aria-label="Acessar site do Governo de Rondônia"
          >
            <Image
              src="/logos/governo-ro.jpg"
              alt="Governo de Rondônia"
              width={180}
              height={100}
              className={styles.govLogo}
            />
          </Link>
        </aside>

        {/* Conteúdo Central */}
        <div className={styles.centerColumn}>
          {/* Logo do Programa */}
          <Link href="/" className={styles.programLogo}>
            <Image
              src="/logos/geracao-emprego-logo.png"
              alt="Geração Emprego"
              width={200}
              height={60}
              priority
            />
          </Link>

          {/* Card de Seleção */}
          <div className={styles.card}>
            <h1 className={styles.title}>Como deseja se cadastrar?</h1>
            <p className={styles.subtitle}>
              Escolha a opção que melhor se aplica a você
            </p>

            <div className={styles.options}>
              {/* Opção Candidato */}
              <Link href="/cadastro" className={styles.optionCard}>
                <div className={styles.optionIcon}>
                  <Search size={40} />
                </div>
                <h2 className={styles.optionTitle}>Quero ser contratado</h2>
                <p className={styles.optionDescription}>
                  Estou buscando uma oportunidade de emprego ou estágio
                </p>
                <div className={styles.optionFeatures}>
                  <span>✓ Cadastre seu currículo</span>
                  <span>✓ Encontre vagas compatíveis</span>
                  <span>✓ Acesse cursos gratuitos</span>
                </div>
                <span className={styles.optionButton}>
                  Cadastrar como Candidato
                </span>
              </Link>

              {/* Opção Empresa */}
              <Link href="/cadastro-empresa" className={styles.optionCard}>
                <div className={styles.optionIconEmpresa}>
                  <Building2 size={40} />
                </div>
                <h2 className={styles.optionTitle}>Quero contratar</h2>
                <p className={styles.optionDescription}>
                  Represento uma empresa e quero publicar vagas
                </p>
                <div className={styles.optionFeatures}>
                  <span>✓ Publique vagas gratuitamente</span>
                  <span>✓ Acesse currículos qualificados</span>
                  <span>✓ Gerencie candidaturas</span>
                </div>
                <span className={styles.optionButtonEmpresa}>
                  Cadastrar como Empresa
                </span>
              </Link>
            </div>

            <p className={styles.loginLink}>
              Já tem uma conta?{' '}
              <Link href="/login">Fazer login</Link>
            </p>
          </div>
        </div>

        {/* Logos SEDEC/SINE - Lado Direito */}
        <aside className={styles.sideColumn}>
          <div className={styles.rightLogos}>
            <Link 
              href="https://rondonia.ro.gov.br/sedec/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.logoLink}
              aria-label="Acessar site da SEDEC"
            >
              <Image
                src="/logos/sedec.png"
                alt="SEDEC"
                width={140}
                height={50}
                className={styles.partnerLogo}
              />
            </Link>
            <Link 
              href="https://rondonia.ro.gov.br/sedec/institucional/sine/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.logoLink}
              aria-label="Acessar site do SINE"
            >
              <Image
                src="/logos/sine.jpg"
                alt="SINE"
                width={140}
                height={50}
                className={styles.partnerLogo}
              />
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
