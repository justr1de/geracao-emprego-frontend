'use client';

import { useState } from 'react';
import { Search, MapPin, Briefcase, Users, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';
import styles from './index.module.css';

export default function SearchSection() {
  const [activeTab, setActiveTab] = useState('vagas');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const baseUrl = activeTab === 'vagas' ? '/vagas' : '/curriculos';
    const params = new URLSearchParams();
    if (searchTerm) {params.set('q', searchTerm);}
    if (location) {params.set('cidade', location);}
    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  const popularSearches = {
    vagas: [
      { label: 'Vendedor', query: 'vendedor' },
      { label: 'Motorista', query: 'motorista' },
      { label: 'Auxiliar Administrativo', query: 'auxiliar administrativo' },
      { label: 'Atendente', query: 'atendente' },
      { label: 'Operador de Caixa', query: 'operador caixa' },
    ],
    curriculos: [
      { label: 'Ensino Médio', query: 'ensino medio' },
      { label: 'Experiência em Vendas', query: 'vendas' },
      { label: 'CNH Categoria B', query: 'cnh b' },
      { label: 'Informática', query: 'informatica' },
      { label: 'Atendimento', query: 'atendimento' },
    ],
  };

  // Lista completa dos 52 municípios de Rondônia em ordem alfabética
  const cities = [
    'Alta Floresta D\'Oeste',
    'Alto Alegre dos Parecis',
    'Alto Paraíso',
    'Alvorada D\'Oeste',
    'Ariquemes',
    'Buritis',
    'Cabixi',
    'Cacaulândia',
    'Cacoal',
    'Campo Novo de Rondônia',
    'Candeias do Jamari',
    'Castanheiras',
    'Cerejeiras',
    'Chupinguaia',
    'Colorado do Oeste',
    'Corumbiara',
    'Costa Marques',
    'Cujubim',
    'Espigão D\'Oeste',
    'Governador Jorge Teixeira',
    'Guajará-Mirim',
    'Itapuã do Oeste',
    'Jaru',
    'Ji-Paraná',
    'Machadinho D\'Oeste',
    'Ministro Andreazza',
    'Mirante da Serra',
    'Monte Negro',
    'Nova Brasilândia D\'Oeste',
    'Nova Mamoré',
    'Nova União',
    'Novo Horizonte do Oeste',
    'Ouro Preto do Oeste',
    'Parecis',
    'Pimenta Bueno',
    'Pimenteiras do Oeste',
    'Porto Velho',
    'Presidente Médici',
    'Primavera de Rondônia',
    'Rio Crespo',
    'Rolim de Moura',
    'Santa Luzia D\'Oeste',
    'São Felipe D\'Oeste',
    'São Francisco do Guaporé',
    'São Miguel do Guaporé',
    'Seringueiras',
    'Teixeirópolis',
    'Theobroma',
    'Urupá',
    'Vale do Anari',
    'Vale do Paraíso',
    'Vilhena',
  ];

  return (
    <section className={styles.section} aria-labelledby="search-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="search-title" className={styles.title}>
            O que você está procurando?
          </h2>
          <p className={styles.subtitle}>
            Busque vagas de emprego ou encontre profissionais qualificados
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Tipo de busca">
          <button
            role="tab"
            aria-selected={activeTab === 'vagas'}
            aria-controls="search-panel"
            className={`${styles.tab} ${activeTab === 'vagas' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('vagas')}
          >
            <Briefcase size={20} aria-hidden="true" />
            <span>Buscar Vagas</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'curriculos'}
            aria-controls="search-panel"
            className={`${styles.tab} ${activeTab === 'curriculos' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('curriculos')}
          >
            <Users size={20} aria-hidden="true" />
            <span>Buscar Currículos</span>
          </button>
        </div>

        {/* Search Form */}
        <div id="search-panel" role="tabpanel" className={styles.searchPanel}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="search-term" className={styles.inputLabel}>
                {activeTab === 'vagas' ? 'Cargo ou palavra-chave' : 'Habilidade ou área'}
              </label>
              <div className={styles.inputWrapper}>
                <Search size={20} className={styles.inputIcon} aria-hidden="true" />
                <input
                  id="search-term"
                  type="text"
                  placeholder={activeTab === 'vagas' ? 'Ex: Vendedor, Motorista...' : 'Ex: Vendas, Informática...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.input}
                  aria-describedby="search-help"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="location" className={styles.inputLabel}>
                Cidade
              </label>
              <div className={styles.inputWrapper}>
                <MapPin size={20} className={styles.inputIcon} aria-hidden="true" />
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Todas as cidades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className={styles.searchBtn}>
              <Search size={20} aria-hidden="true" />
              <span>Buscar</span>
            </button>
          </form>

          <p id="search-help" className={styles.searchHelp}>
            {activeTab === 'vagas'
              ? 'Digite o cargo desejado ou palavras-chave relacionadas à vaga'
              : 'Digite habilidades ou área de atuação para encontrar profissionais'
            }
          </p>
        </div>

        {/* Popular Searches */}
        <div className={styles.popularSection}>
          <h3 className={styles.popularTitle}>
            <Filter size={16} aria-hidden="true" />
            Buscas populares:
          </h3>
          <div className={styles.popularTags}>
            {popularSearches[activeTab].map((item) => (
              <Link
                key={item.query}
                href={`/${activeTab}?q=${encodeURIComponent(item.query)}`}
                className={styles.popularTag}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.quickLinks}>
          <Link href="/vagas" className={styles.quickLink}>
            Ver todas as vagas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/curriculos" className={styles.quickLink}>
            Ver todos os currículos
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
