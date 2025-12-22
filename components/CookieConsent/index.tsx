// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, MapPin, Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './index.module.css';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  location: boolean;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Sempre ativo
    analytics: false,
    marketing: false,
    location: false,
  });

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Aguardar um pouco antes de mostrar o banner
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      location: true,
    };
    saveConsent(allAccepted);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
  };

  const handleRejectAll = () => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      location: false,
    };
    saveConsent(onlyNecessary);
  };

  const saveConsent = (prefs: ConsentPreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-labelledby="cookie-title" aria-modal="true">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Shield className={styles.icon} size={24} aria-hidden="true" />
            <h2 id="cookie-title" className={styles.title}>
              Sua Privacidade é Importante
            </h2>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleRejectAll}
            aria-label="Fechar e rejeitar cookies opcionais"
          >
            <X size={20} />
          </button>
        </div>

        {/* Texto Principal */}
        <div className={styles.content}>
          <p className={styles.description}>
            O portal <strong>Geração Emprego</strong>, uma iniciativa do <strong>Governo de Rondônia</strong> 
            por meio da SEDEC e do SINE Estadual, utiliza cookies e tecnologias semelhantes para melhorar 
            sua experiência de navegação, personalizar conteúdo e anúncios, e analisar o tráfego do site.
          </p>
          
          <p className={styles.description}>
            Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>, 
            solicitamos seu consentimento para coletar e processar seus dados pessoais. Você pode gerenciar 
            suas preferências a qualquer momento.
          </p>

          {/* Botão para expandir detalhes */}
          <button
            className={styles.detailsToggle}
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
          >
            {showDetails ? (
              <>
                <ChevronUp size={16} />
                Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Ver detalhes e personalizar
              </>
            )}
          </button>

          {/* Detalhes Expandidos */}
          {showDetails && (
            <div className={styles.details}>
              {/* Cookies Necessários */}
              <div className={styles.cookieCategory}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <Cookie size={18} className={styles.categoryIcon} aria-hidden="true" />
                    <div>
                      <h3 className={styles.categoryTitle}>Cookies Necessários</h3>
                      <p className={styles.categoryDescription}>
                        Essenciais para o funcionamento do site. Incluem cookies de sessão, 
                        autenticação e segurança. Não podem ser desativados.
                      </p>
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      aria-label="Cookies necessários - sempre ativo"
                    />
                    <span className={styles.toggleSlider}></span>
                    <span className={styles.toggleLabel}>Sempre ativo</span>
                  </label>
                </div>
              </div>

              {/* Cookies de Análise */}
              <div className={styles.cookieCategory}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <Cookie size={18} className={styles.categoryIcon} aria-hidden="true" />
                    <div>
                      <h3 className={styles.categoryTitle}>Cookies de Análise e Desempenho</h3>
                      <p className={styles.categoryDescription}>
                        Permitem analisar como você usa o site para melhorar nossos serviços. 
                        Coletam informações anônimas sobre páginas visitadas e tempo de navegação.
                      </p>
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      aria-label="Cookies de análise"
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              {/* Cookies de Marketing */}
              <div className={styles.cookieCategory}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <Cookie size={18} className={styles.categoryIcon} aria-hidden="true" />
                    <div>
                      <h3 className={styles.categoryTitle}>Cookies de Marketing</h3>
                      <p className={styles.categoryDescription}>
                        Utilizados para exibir anúncios relevantes e campanhas de marketing. 
                        Podem ser compartilhados com parceiros de publicidade.
                      </p>
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      aria-label="Cookies de marketing"
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              {/* Localização */}
              <div className={styles.cookieCategory}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <MapPin size={18} className={styles.categoryIcon} aria-hidden="true" />
                    <div>
                      <h3 className={styles.categoryTitle}>Dados de Localização</h3>
                      <p className={styles.categoryDescription}>
                        Permitem identificar sua localização aproximada para mostrar vagas e 
                        cursos próximos a você. Os dados são processados de forma segura e 
                        não são compartilhados com terceiros.
                      </p>
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.location}
                      onChange={(e) => setPreferences({ ...preferences, location: e.target.checked })}
                      aria-label="Dados de localização"
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className={styles.additionalInfo}>
                <h4 className={styles.infoTitle}>Seus Direitos conforme a LGPD:</h4>
                <ul className={styles.rightsList}>
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou desatualizados</li>
                  <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
                  <li>Revogar o consentimento a qualquer momento</li>
                  <li>Solicitar portabilidade dos dados</li>
                </ul>
              </div>
            </div>
          )}

          {/* Links */}
          <div className={styles.links}>
            <Link href="/politicas-privacidade" className={styles.link}>
              Política de Privacidade
            </Link>
            <span className={styles.linkSeparator}>•</span>
            <Link href="/termos-uso" className={styles.link}>
              Termos de Uso
            </Link>
            <span className={styles.linkSeparator}>•</span>
            <Link href="/politica-cookies" className={styles.link}>
              Política de Cookies
            </Link>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className={styles.actions}>
          <button
            className={styles.rejectBtn}
            onClick={handleRejectAll}
          >
            Rejeitar Opcionais
          </button>
          {showDetails && (
            <button
              className={styles.saveBtn}
              onClick={handleAcceptSelected}
            >
              Salvar Preferências
            </button>
          )}
          <button
            className={styles.acceptBtn}
            onClick={handleAcceptAll}
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
}
