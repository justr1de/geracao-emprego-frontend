'use client';

import { useState } from 'react';
import { GraduationCap, Clock, MapPin, Monitor, Search, Filter, ChevronDown, Building2, Award, Users, ExternalLink } from 'lucide-react';
import CourseDetailModal from '@/components/CourseDetailModal';
import styles from './page.module.css';

interface Course {
  id: number;
  title: string;
  institution: string;
  duration: string;
  modality: string;
  category: string;
  description: string;
  requirements: string[];
  syllabus: string[];
  location: string;
  vacancies: number;
  startDate: string;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Assistente Administrativo',
    institution: 'SENAI',
    duration: '3 meses',
    modality: 'Presencial',
    category: 'Administrativo',
    description: 'Curso completo de formação para assistente administrativo, abordando rotinas de escritório, gestão de documentos e atendimento ao público.',
    requirements: ['Ensino médio completo', 'Idade mínima de 16 anos'],
    syllabus: ['Rotinas administrativas', 'Gestão de documentos', 'Atendimento ao cliente', 'Informática básica'],
    location: 'Porto Velho, RO',
    vacancies: 30,
    startDate: 'Janeiro/2025',
  },
  {
    id: 2,
    title: 'Eletricista Predial',
    institution: 'SENAI',
    duration: '4 meses',
    modality: 'Presencial',
    category: 'Construção',
    description: 'Formação profissional em instalações elétricas residenciais e prediais, com foco em segurança e normas técnicas.',
    requirements: ['Ensino fundamental completo', 'Idade mínima de 18 anos'],
    syllabus: ['Eletricidade básica', 'Instalações elétricas', 'NR-10', 'Leitura de projetos'],
    location: 'Ji-Paraná, RO',
    vacancies: 25,
    startDate: 'Fevereiro/2025',
  },
  {
    id: 3,
    title: 'Operador de Computador',
    institution: 'SENAC',
    duration: '2 meses',
    modality: 'Presencial',
    category: 'Tecnologia',
    description: 'Aprenda a utilizar o computador para atividades profissionais, incluindo pacote Office e internet.',
    requirements: ['Ensino fundamental completo', 'Sem experiência prévia necessária'],
    syllabus: ['Windows', 'Word', 'Excel', 'Internet e e-mail'],
    location: 'Ariquemes, RO',
    vacancies: 40,
    startDate: 'Janeiro/2025',
  },
  {
    id: 4,
    title: 'Cuidador de Idosos',
    institution: 'SENAC',
    duration: '3 meses',
    modality: 'Presencial',
    category: 'Saúde',
    description: 'Formação para cuidadores de pessoas idosas, com foco em qualidade de vida e bem-estar.',
    requirements: ['Ensino fundamental completo', 'Idade mínima de 18 anos'],
    syllabus: ['Cuidados básicos', 'Primeiros socorros', 'Nutrição', 'Atividades recreativas'],
    location: 'Cacoal, RO',
    vacancies: 20,
    startDate: 'Março/2025',
  },
  {
    id: 5,
    title: 'Gestão de Pequenos Negócios',
    institution: 'SEBRAE',
    duration: '40 horas',
    modality: 'Online',
    category: 'Empreendedorismo',
    description: 'Capacitação para empreendedores que desejam melhorar a gestão de seus negócios.',
    requirements: ['Acesso à internet', 'Interesse em empreender'],
    syllabus: ['Planejamento estratégico', 'Finanças', 'Marketing', 'Vendas'],
    location: 'Online',
    vacancies: 100,
    startDate: 'Turmas contínuas',
  },
  {
    id: 6,
    title: 'Mecânico de Motocicletas',
    institution: 'SENAI',
    duration: '4 meses',
    modality: 'Presencial',
    category: 'Automotivo',
    description: 'Curso prático de manutenção e reparo de motocicletas, com equipamentos modernos.',
    requirements: ['Ensino fundamental completo', 'Idade mínima de 16 anos'],
    syllabus: ['Motor', 'Sistema elétrico', 'Suspensão', 'Freios'],
    location: 'Vilhena, RO',
    vacancies: 20,
    startDate: 'Fevereiro/2025',
  },
  {
    id: 7,
    title: 'Atendente de Farmácia',
    institution: 'SENAC',
    duration: '3 meses',
    modality: 'Presencial',
    category: 'Saúde',
    description: 'Formação para atendimento em farmácias e drogarias, com noções de medicamentos.',
    requirements: ['Ensino médio completo', 'Boa comunicação'],
    syllabus: ['Atendimento ao cliente', 'Noções de farmacologia', 'Organização de estoque', 'Legislação'],
    location: 'Porto Velho, RO',
    vacancies: 25,
    startDate: 'Janeiro/2025',
  },
  {
    id: 8,
    title: 'Marketing Digital',
    institution: 'SEBRAE',
    duration: '20 horas',
    modality: 'Online',
    category: 'Marketing',
    description: 'Aprenda a divulgar seu negócio nas redes sociais e plataformas digitais.',
    requirements: ['Acesso à internet', 'Conhecimento básico de informática'],
    syllabus: ['Redes sociais', 'Criação de conteúdo', 'Anúncios pagos', 'Métricas'],
    location: 'Online',
    vacancies: 150,
    startDate: 'Turmas contínuas',
  },
];

const externalPlatforms = [
  {
    id: 1,
    name: 'SEBRAE',
    description: 'Cursos de empreendedorismo e gestão',
    url: 'https://sebrae.com.br/sites/PortalSebrae/cursosonline',
    color: '#0066B3',
  },
  {
    id: 2,
    name: 'ENAP',
    description: 'Escola Nacional de Administração Pública',
    url: 'https://www.escolavirtual.gov.br/',
    color: '#1351B4',
  },
  {
    id: 3,
    name: 'Fundação Bradesco',
    description: 'Cursos de tecnologia e negócios',
    url: 'https://www.ev.org.br/',
    color: '#CC092F',
  },
  {
    id: 4,
    name: 'FGV Online',
    description: 'Cursos de gestão e liderança',
    url: 'https://educacao-executiva.fgv.br/cursos/gratuitos',
    color: '#003366',
  },
  {
    id: 5,
    name: 'Cisco Networking Academy',
    description: 'Cursos de TI e redes',
    url: 'https://www.netacad.com/',
    color: '#049FD9',
  },
  {
    id: 6,
    name: 'Senai',
    description: 'Cursos técnicos e profissionalizantes',
    url: 'https://www.mundosenai.com.br/',
    color: '#E30613',
  },
];

const categories = ['Todas', 'Administrativo', 'Tecnologia', 'Saúde', 'Construção', 'Empreendedorismo', 'Automotivo', 'Marketing'];
const modalities = ['Todas', 'Presencial', 'Online', 'Híbrido'];
const institutions = ['Todas', 'SENAI', 'SENAC', 'SEBRAE'];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedModality, setSelectedModality] = useState('Todas');
  const [selectedInstitution, setSelectedInstitution] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || course.category === selectedCategory;
    const matchesModality = selectedModality === 'Todas' || course.modality === selectedModality;
    const matchesInstitution = selectedInstitution === 'Todas' || course.institution === selectedInstitution;
    return matchesSearch && matchesCategory && matchesModality && matchesInstitution;
  });

  const hasActiveFilters = selectedCategory !== 'Todas' || selectedModality !== 'Todas' || selectedInstitution !== 'Todas' || searchTerm;

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            <GraduationCap className={styles.heroIcon} aria-hidden="true" />
            Cursos Profissionalizantes
          </h1>
          <p className={styles.heroSubtitle}>
            Qualifique-se gratuitamente com nossos parceiros em Rondônia
          </p>

          {/* Aviso LGPD */}
          <p className={styles.lgpdNotice}>
            As buscas realizadas respeitam a Lei Geral de Proteção de Dados (LGPD).
          </p>

          {/* Barra de Busca */}
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar por curso ou instituição..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar cursos"
              />
            </div>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Mostrar filtros"
            >
              <Filter size={20} aria-hidden="true" />
              Filtros
              <ChevronDown size={16} className={showFilters ? styles.rotated : ''} aria-hidden="true" />
            </button>
          </div>

          {/* Filtros Expandidos */}
          {showFilters && (
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <Award size={16} aria-hidden="true" />
                  Categoria
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filtrar por categoria"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <Monitor size={16} aria-hidden="true" />
                  Modalidade
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedModality}
                  onChange={(e) => setSelectedModality(e.target.value)}
                  aria-label="Filtrar por modalidade"
                >
                  {modalities.map((mod) => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <Building2 size={16} aria-hidden="true" />
                  Instituição
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  aria-label="Filtrar por instituição"
                >
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Parceiros */}
      <section className={styles.partners}>
        <div className={styles.partnersContainer}>
          <span className={styles.partnersLabel}>Parceiros:</span>
          <div className={styles.partnersList}>
            <span className={styles.partnerBadge}>SENAI</span>
            <span className={styles.partnerBadge}>SENAC</span>
            <span className={styles.partnerBadge}>SEBRAE</span>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <GraduationCap className={styles.statIcon} aria-hidden="true" />
            <div>
              <span className={styles.statNumber}>{mockCourses.length}</span>
              <span className={styles.statLabel}>Cursos Disponíveis</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Users className={styles.statIcon} aria-hidden="true" />
            <div>
              <span className={styles.statNumber}>{mockCourses.reduce((acc, c) => acc + c.vacancies, 0)}</span>
              <span className={styles.statLabel}>Vagas Abertas</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Building2 className={styles.statIcon} aria-hidden="true" />
            <div>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Instituições Parceiras</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal com Sidebar */}
      <section className={styles.mainContent}>
        <div className={styles.mainContainer}>
          {/* Lista de Cursos */}
          <div className={styles.coursesSection}>
            <div className={styles.coursesHeader}>
              <h2 className={styles.coursesTitle}>
                {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
              </h2>
              {hasActiveFilters && (
                <button
                  className={styles.clearFilters}
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todas');
                    setSelectedModality('Todas');
                    setSelectedInstitution('Todas');
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {filteredCourses.length > 0 ? (
              <div className={styles.coursesGrid}>
                {filteredCourses.map((course) => (
                  <article key={course.id} className={styles.courseCard} onClick={() => setSelectedCourse(course)}>
                    <div className={styles.courseHeader}>
                      <span className={styles.courseCategory}>{course.category}</span>
                      <span className={styles.courseInstitution}>{course.institution}</span>
                    </div>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseDescription}>{course.description}</p>
                    <div className={styles.courseMeta}>
                      <span className={styles.courseMetaItem}>
                        <Clock size={14} aria-hidden="true" />
                        {course.duration}
                      </span>
                      <span className={styles.courseMetaItem}>
                        <Monitor size={14} aria-hidden="true" />
                        {course.modality}
                      </span>
                      <span className={styles.courseMetaItem}>
                        <MapPin size={14} aria-hidden="true" />
                        {course.location}
                      </span>
                    </div>
                    <div className={styles.courseFooter}>
                      <span className={styles.courseVacancies}>
                        <Users size={14} aria-hidden="true" />
                        {course.vacancies} vagas
                      </span>
                      <button className={styles.courseButton}>Ver detalhes</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <Search size={48} aria-hidden="true" />
                <h3>Nenhum curso encontrado</h3>
                <p>Tente ajustar os filtros ou buscar por outros termos</p>
              </div>
            )}
          </div>

          {/* Sidebar - Plataformas Externas */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <GraduationCap size={20} aria-hidden="true" />
                Mais cursos gratuitos
              </h3>
              <p className={styles.sidebarSubtitle}>
                Acesse cursos de instituições reconhecidas nacionalmente
              </p>
              
              <div className={styles.externalList}>
                {externalPlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalCard}
                    style={{ '--platform-color': platform.color } as React.CSSProperties}
                    aria-label={`Acessar cursos do ${platform.name} (abre em nova janela)`}
                  >
                    <div className={styles.externalLogo}>
                      <span 
                        className={styles.logoPlaceholder} 
                        style={{ backgroundColor: platform.color }}
                        aria-hidden="true"
                      >
                        {platform.name.charAt(0)}
                      </span>
                    </div>
                    <div className={styles.externalInfo}>
                      <h4 className={styles.externalName}>{platform.name}</h4>
                      <p className={styles.externalDesc}>{platform.description}</p>
                    </div>
                    <ExternalLink size={16} className={styles.externalIcon} aria-hidden="true" />
                  </a>
                ))}
              </div>

              <p className={styles.disclaimer}>
                * Os cursos das plataformas listadas são oferecidos diretamente por cada instituição.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
