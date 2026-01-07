import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// =====================================================
// DADOS REALISTAS PARA RONDÔNIA
// =====================================================

const CIDADES_RO = [
  { nome: 'Porto Velho', cep_base: '76800', bairros: ['Centro', 'Caiari', 'Embratel', 'Pedrinhas', 'São Cristóvão', 'Tiradentes', 'Arigolândia', 'Olaria', 'Panair', 'Liberdade', 'Costa e Silva', 'Lagoa', 'Tancredo Neves', 'Castanheira', 'Industrial', 'Nova Porto Velho', 'Flodoaldo Pontes Pinto', 'Três Marias', 'Aponiã', 'Rio Madeira'] },
  { nome: 'Ji-Paraná', cep_base: '76900', bairros: ['Centro', 'Nova Brasília', 'Dois de Abril', 'Casa Preta', 'Jardim dos Migrantes', 'São Pedro', 'Urupá', 'Park Cafezal', 'Santiago', 'Riachuelo'] },
  { nome: 'Ariquemes', cep_base: '76870', bairros: ['Centro', 'Setor Institucional', 'Setor 01', 'Setor 02', 'Setor 03', 'Setor 04', 'Setor 05', 'Jardim Jorge Teixeira', 'BNH', 'Marechal Rondon'] },
  { nome: 'Vilhena', cep_base: '76980', bairros: ['Centro', 'Cristo Rei', 'Jardim América', 'Jardim Social', 'São José', 'Bela Vista', 'Parque das Acácias', 'Jardim Eldorado', 'Industrial', 'Rodoviária'] },
  { nome: 'Cacoal', cep_base: '76960', bairros: ['Centro', 'Jardim Clodoaldo', 'Josino Brito', 'Incra', 'Liberdade', 'Novo Cacoal', 'Princesa Isabel', 'Teixeirão', 'Vista Alegre', 'Industrial'] },
  { nome: 'Rolim de Moura', cep_base: '76940', bairros: ['Centro', 'Cidade Alta', 'Boa Esperança', 'Beira Rio', 'Industrial', 'Jardim Tropical', 'Planalto', 'São Cristóvão', 'Centenário', 'Olímpico'] },
  { nome: 'Guajará-Mirim', cep_base: '76850', bairros: ['Centro', 'Triângulo', 'Liberdade', 'Cristo Rei', 'São José', 'Jardim das Esmeraldas', 'Serraria', 'Planalto', 'Tamandaré', 'Firme e Forte'] },
  { nome: 'Jaru', cep_base: '76890', bairros: ['Centro', 'Setor 01', 'Setor 02', 'Setor 03', 'Jardim Primavera', 'Jardim dos Estados', 'Industrial', 'Nova Jaru', 'João Francisco Clímaco', 'Urupá'] },
  { nome: 'Ouro Preto do Oeste', cep_base: '76920', bairros: ['Centro', 'Jardim Novo Horizonte', 'União', 'Incra', 'Jardim Tropical', 'Boa Esperança', 'Industrial', 'Nova Ouro Preto', 'Alvorada', 'Liberdade'] },
  { nome: 'Pimenta Bueno', cep_base: '76970', bairros: ['Centro', 'Setor 06', 'Setor 07', 'Pioneiros', 'Jardim das Oliveiras', 'BNH', 'Industrial', 'Alvorada', 'Nova Pimenta', 'Bela Vista'] }
]

const NOMES_MASCULINOS = ['João', 'Pedro', 'Lucas', 'Gabriel', 'Matheus', 'Rafael', 'Bruno', 'Felipe', 'Gustavo', 'Leonardo', 'Carlos', 'André', 'Marcos', 'Paulo', 'Ricardo', 'Fernando', 'Eduardo', 'Rodrigo', 'Thiago', 'Diego', 'Vinícius', 'Henrique', 'Daniel', 'Alexandre', 'Leandro', 'Fábio', 'Marcelo', 'Roberto', 'Antônio', 'José', 'Francisco', 'Luiz', 'Sérgio', 'Márcio', 'Cláudio', 'Renato', 'Rogério', 'Adriano', 'Júlio', 'César', 'Nilson', 'Edson', 'Valdir', 'Sebastião', 'Manoel', 'Raimundo', 'Geraldo', 'Osvaldo', 'Benedito', 'Joaquim']
const NOMES_FEMININOS = ['Maria', 'Ana', 'Juliana', 'Fernanda', 'Patrícia', 'Camila', 'Amanda', 'Larissa', 'Beatriz', 'Carolina', 'Letícia', 'Gabriela', 'Mariana', 'Bruna', 'Natália', 'Vanessa', 'Aline', 'Priscila', 'Tatiana', 'Renata', 'Luciana', 'Adriana', 'Cristina', 'Simone', 'Sandra', 'Cláudia', 'Mônica', 'Rosana', 'Eliane', 'Márcia', 'Sônia', 'Regina', 'Vera', 'Lúcia', 'Helena', 'Teresa', 'Rosa', 'Francisca', 'Antônia', 'Joana', 'Isabel', 'Célia', 'Neide', 'Marlene', 'Sueli', 'Ivone', 'Aparecida', 'Conceição', 'Fátima', 'Josefa']
const SOBRENOMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira', 'Moura', 'Araújo', 'Melo', 'Barros', 'Correia', 'Campos', 'Castro', 'Miranda', 'Azevedo', 'Pinto', 'Monteiro', 'Batista', 'Reis', 'Cavalcante', 'Bezerra']

const RUAS = ['Rua das Flores', 'Rua São Paulo', 'Rua Amazonas', 'Rua Rondônia', 'Rua Brasil', 'Rua Paraná', 'Rua Goiás', 'Rua Minas Gerais', 'Rua Rio de Janeiro', 'Rua Bahia', 'Avenida Principal', 'Avenida Brasil', 'Avenida Getúlio Vargas', 'Avenida JK', 'Avenida Marechal Rondon', 'Travessa das Palmeiras', 'Travessa dos Ipês', 'Travessa Central', 'Alameda dos Jardins', 'Alameda das Acácias', 'Rua dos Pioneiros', 'Rua dos Seringueiros', 'Rua dos Garimpeiros', 'Rua Tiradentes', 'Rua 7 de Setembro', 'Rua 15 de Novembro', 'Rua Dom Pedro II', 'Rua Presidente Vargas', 'Rua Marechal Deodoro', 'Rua Benjamin Constant']

// Empresas por setor com nomes realistas
const EMPRESAS_POR_SETOR = {
  comercio: {
    ramo_id: 1,
    prefixos: ['Supermercado', 'Mercado', 'Loja', 'Casa', 'Empório', 'Atacado', 'Varejo', 'Magazine', 'Center', 'Mega'],
    sufixos: ['Bom Preço', 'Econômico', 'Popular', 'da Família', 'do Povo', 'Norte', 'Rondônia', 'Amazônia', 'Central', 'Express', 'Plus', 'Max', 'Top', 'Prime', 'Gold'],
    cargos: [
      { cargo: 'Operador de Caixa', salario_min: 1412, salario_max: 1800 },
      { cargo: 'Repositor de Mercadorias', salario_min: 1412, salario_max: 1600 },
      { cargo: 'Açougueiro', salario_min: 1800, salario_max: 2500 },
      { cargo: 'Padeiro', salario_min: 1600, salario_max: 2200 },
      { cargo: 'Confeiteiro', salario_min: 1600, salario_max: 2400 },
      { cargo: 'Gerente de Loja', salario_min: 3000, salario_max: 5000 },
      { cargo: 'Fiscal de Loja', salario_min: 1500, salario_max: 2000 },
      { cargo: 'Estoquista', salario_min: 1412, salario_max: 1700 },
      { cargo: 'Vendedor', salario_min: 1412, salario_max: 2500 },
      { cargo: 'Auxiliar de Limpeza', salario_min: 1412, salario_max: 1500 }
    ]
  },
  construcao: {
    ramo_id: 2,
    prefixos: ['Construtora', 'Engenharia', 'Construções', 'Edificações', 'Empreiteira'],
    sufixos: ['Norte Sul', 'Rondônia', 'Amazônia', 'Brasil', 'Nacional', 'Regional', 'Pioneira', 'Moderna', 'Técnica', 'Premium'],
    cargos: [
      { cargo: 'Pedreiro', salario_min: 1800, salario_max: 2800 },
      { cargo: 'Servente de Obras', salario_min: 1412, salario_max: 1600 },
      { cargo: 'Mestre de Obras', salario_min: 3000, salario_max: 5000 },
      { cargo: 'Eletricista', salario_min: 2000, salario_max: 3500 },
      { cargo: 'Encanador', salario_min: 1800, salario_max: 2800 },
      { cargo: 'Pintor', salario_min: 1600, salario_max: 2500 },
      { cargo: 'Carpinteiro', salario_min: 1800, salario_max: 2800 },
      { cargo: 'Engenheiro Civil', salario_min: 6000, salario_max: 12000 },
      { cargo: 'Técnico em Edificações', salario_min: 2500, salario_max: 4000 },
      { cargo: 'Operador de Máquinas', salario_min: 2200, salario_max: 3500 }
    ]
  },
  saude: {
    ramo_id: 3,
    prefixos: ['Hospital', 'Clínica', 'Centro Médico', 'Laboratório', 'UBS', 'Consultório'],
    sufixos: ['São Lucas', 'Santa Casa', 'Vida', 'Saúde', 'Popular', 'Regional', 'Especializado', 'Diagnóstico', 'Bem Estar', 'Cuidar'],
    cargos: [
      { cargo: 'Técnico de Enfermagem', salario_min: 1800, salario_max: 2800 },
      { cargo: 'Enfermeiro', salario_min: 3500, salario_max: 6000 },
      { cargo: 'Recepcionista', salario_min: 1412, salario_max: 1800 },
      { cargo: 'Auxiliar de Limpeza Hospitalar', salario_min: 1412, salario_max: 1600 },
      { cargo: 'Fisioterapeuta', salario_min: 3000, salario_max: 5500 },
      { cargo: 'Farmacêutico', salario_min: 3500, salario_max: 6000 },
      { cargo: 'Técnico em Radiologia', salario_min: 2500, salario_max: 4000 },
      { cargo: 'Nutricionista', salario_min: 2800, salario_max: 4500 },
      { cargo: 'Psicólogo', salario_min: 3000, salario_max: 5000 },
      { cargo: 'Auxiliar Administrativo', salario_min: 1412, salario_max: 2000 }
    ]
  },
  alimentacao: {
    ramo_id: 4,
    prefixos: ['Restaurante', 'Lanchonete', 'Pizzaria', 'Churrascaria', 'Padaria', 'Cafeteria', 'Bar', 'Bistrô'],
    sufixos: ['Sabor da Terra', 'Bom Gosto', 'Delícias', 'Regional', 'da Mamãe', 'do Chef', 'Tropical', 'Amazônico', 'Caseiro', 'Gourmet'],
    cargos: [
      { cargo: 'Cozinheiro', salario_min: 1600, salario_max: 2800 },
      { cargo: 'Auxiliar de Cozinha', salario_min: 1412, salario_max: 1700 },
      { cargo: 'Garçom', salario_min: 1412, salario_max: 2000 },
      { cargo: 'Atendente', salario_min: 1412, salario_max: 1600 },
      { cargo: 'Chef de Cozinha', salario_min: 3000, salario_max: 6000 },
      { cargo: 'Pizzaiolo', salario_min: 1800, salario_max: 2800 },
      { cargo: 'Churrasqueiro', salario_min: 1800, salario_max: 3000 },
      { cargo: 'Confeiteiro', salario_min: 1600, salario_max: 2500 },
      { cargo: 'Barista', salario_min: 1500, salario_max: 2200 },
      { cargo: 'Gerente de Restaurante', salario_min: 2500, salario_max: 4500 }
    ]
  },
  tecnologia: {
    ramo_id: 5,
    prefixos: ['Tech', 'Digital', 'Info', 'Soft', 'Data', 'Net', 'Web', 'Cloud', 'Smart', 'Cyber'],
    sufixos: ['Solutions', 'Systems', 'RO', 'Norte', 'Amazônia', 'Brasil', 'Lab', 'Hub', 'Connect', 'Innovation'],
    cargos: [
      { cargo: 'Desenvolvedor Full Stack', salario_min: 4000, salario_max: 10000 },
      { cargo: 'Desenvolvedor Front-end', salario_min: 3500, salario_max: 8000 },
      { cargo: 'Desenvolvedor Back-end', salario_min: 4000, salario_max: 9000 },
      { cargo: 'Analista de Suporte', salario_min: 2000, salario_max: 3500 },
      { cargo: 'Técnico de Informática', salario_min: 1800, salario_max: 3000 },
      { cargo: 'Designer UI/UX', salario_min: 3000, salario_max: 7000 },
      { cargo: 'Analista de Dados', salario_min: 4000, salario_max: 8000 },
      { cargo: 'DevOps', salario_min: 5000, salario_max: 12000 },
      { cargo: 'QA Tester', salario_min: 2500, salario_max: 5000 },
      { cargo: 'Estagiário de TI', salario_min: 800, salario_max: 1500 }
    ]
  },
  educacao: {
    ramo_id: 6,
    prefixos: ['Escola', 'Colégio', 'Instituto', 'Centro Educacional', 'Faculdade', 'Curso'],
    sufixos: ['Futuro', 'Saber', 'Conhecimento', 'Evolução', 'Progresso', 'Rondônia', 'Norte', 'Integrado', 'Técnico', 'Profissionalizante'],
    cargos: [
      { cargo: 'Professor', salario_min: 2500, salario_max: 5000 },
      { cargo: 'Coordenador Pedagógico', salario_min: 3500, salario_max: 6000 },
      { cargo: 'Auxiliar de Sala', salario_min: 1412, salario_max: 1800 },
      { cargo: 'Secretário Escolar', salario_min: 1600, salario_max: 2500 },
      { cargo: 'Inspetor de Alunos', salario_min: 1412, salario_max: 1700 },
      { cargo: 'Bibliotecário', salario_min: 2000, salario_max: 3500 },
      { cargo: 'Psicopedagogo', salario_min: 2800, salario_max: 4500 },
      { cargo: 'Instrutor de Cursos', salario_min: 2000, salario_max: 4000 },
      { cargo: 'Auxiliar Administrativo', salario_min: 1412, salario_max: 2000 },
      { cargo: 'Zelador', salario_min: 1412, salario_max: 1600 }
    ]
  },
  industria: {
    ramo_id: 7,
    prefixos: ['Indústria', 'Fábrica', 'Metalúrgica', 'Madeireira', 'Frigorífico', 'Laticínios'],
    sufixos: ['Rondônia', 'Norte', 'Amazônia', 'Brasil', 'Nacional', 'Regional', 'Industrial', 'Produção', 'Alimentos', 'Produtos'],
    cargos: [
      { cargo: 'Operador de Produção', salario_min: 1500, salario_max: 2200 },
      { cargo: 'Auxiliar de Produção', salario_min: 1412, salario_max: 1700 },
      { cargo: 'Supervisor de Produção', salario_min: 3000, salario_max: 5000 },
      { cargo: 'Mecânico Industrial', salario_min: 2500, salario_max: 4500 },
      { cargo: 'Eletricista Industrial', salario_min: 2500, salario_max: 4000 },
      { cargo: 'Soldador', salario_min: 2000, salario_max: 3500 },
      { cargo: 'Torneiro Mecânico', salario_min: 2200, salario_max: 3800 },
      { cargo: 'Técnico de Qualidade', salario_min: 2500, salario_max: 4000 },
      { cargo: 'Engenheiro de Produção', salario_min: 6000, salario_max: 12000 },
      { cargo: 'Almoxarife', salario_min: 1600, salario_max: 2500 }
    ]
  },
  servicos: {
    ramo_id: 8,
    prefixos: ['Serviços', 'Assistência', 'Manutenção', 'Consultoria', 'Assessoria', 'Agência'],
    sufixos: ['Técnica', 'Especializada', 'Profissional', 'Express', 'Rápida', 'Completa', 'Total', 'Premium', 'Norte', 'Rondônia'],
    cargos: [
      { cargo: 'Recepcionista', salario_min: 1412, salario_max: 1800 },
      { cargo: 'Auxiliar Administrativo', salario_min: 1412, salario_max: 2000 },
      { cargo: 'Secretária Executiva', salario_min: 2000, salario_max: 3500 },
      { cargo: 'Contador', salario_min: 3000, salario_max: 6000 },
      { cargo: 'Advogado', salario_min: 4000, salario_max: 10000 },
      { cargo: 'Consultor', salario_min: 3500, salario_max: 8000 },
      { cargo: 'Analista Financeiro', salario_min: 3000, salario_max: 5500 },
      { cargo: 'Recursos Humanos', salario_min: 2500, salario_max: 5000 },
      { cargo: 'Marketing Digital', salario_min: 2500, salario_max: 5000 },
      { cargo: 'Telefonista', salario_min: 1412, salario_max: 1700 }
    ]
  },
  agronegocio: {
    ramo_id: 9,
    prefixos: ['Fazenda', 'Agropecuária', 'Agrícola', 'Rural', 'Agro', 'Pecuária'],
    sufixos: ['Rondônia', 'Norte', 'Amazônia', 'Brasil', 'Pioneira', 'Progresso', 'Esperança', 'Boa Vista', 'Santa Fé', 'São José'],
    cargos: [
      { cargo: 'Tratorista', salario_min: 1800, salario_max: 2800 },
      { cargo: 'Vaqueiro', salario_min: 1600, salario_max: 2500 },
      { cargo: 'Trabalhador Rural', salario_min: 1412, salario_max: 1800 },
      { cargo: 'Técnico Agrícola', salario_min: 2500, salario_max: 4000 },
      { cargo: 'Veterinário', salario_min: 4000, salario_max: 8000 },
      { cargo: 'Agrônomo', salario_min: 5000, salario_max: 10000 },
      { cargo: 'Operador de Colheitadeira', salario_min: 2200, salario_max: 3500 },
      { cargo: 'Gerente de Fazenda', salario_min: 4000, salario_max: 8000 },
      { cargo: 'Inseminador', salario_min: 2000, salario_max: 3500 },
      { cargo: 'Ordenhador', salario_min: 1500, salario_max: 2200 }
    ]
  },
  transporte: {
    ramo_id: 10,
    prefixos: ['Transportadora', 'Logística', 'Expresso', 'Viação', 'Frete', 'Cargas'],
    sufixos: ['Rondônia', 'Norte', 'Amazônia', 'Brasil', 'Nacional', 'Regional', 'Express', 'Rápido', 'Seguro', 'Confiável'],
    cargos: [
      { cargo: 'Motorista de Caminhão', salario_min: 2500, salario_max: 4500 },
      { cargo: 'Motorista de Ônibus', salario_min: 2200, salario_max: 3500 },
      { cargo: 'Motorista Entregador', salario_min: 1600, salario_max: 2500 },
      { cargo: 'Ajudante de Carga', salario_min: 1412, salario_max: 1800 },
      { cargo: 'Conferente', salario_min: 1500, salario_max: 2200 },
      { cargo: 'Coordenador de Logística', salario_min: 3500, salario_max: 6000 },
      { cargo: 'Mecânico de Veículos', salario_min: 2200, salario_max: 4000 },
      { cargo: 'Despachante', salario_min: 1800, salario_max: 3000 },
      { cargo: 'Auxiliar de Expedição', salario_min: 1412, salario_max: 1800 },
      { cargo: 'Motoboy', salario_min: 1412, salario_max: 2000 }
    ]
  }
}

const BENEFICIOS = [
  'Vale Transporte',
  'Vale Alimentação',
  'Vale Refeição',
  'Plano de Saúde',
  'Plano Odontológico',
  'Seguro de Vida',
  'Participação nos Lucros',
  'Auxílio Creche',
  'Gympass',
  'Day Off no Aniversário',
  'Home Office',
  'Horário Flexível',
  'Cesta Básica',
  'Convênio Farmácia',
  'Auxílio Combustível'
]

const HORARIOS = [
  'Segunda a Sexta, 08:00 às 18:00',
  'Segunda a Sexta, 09:00 às 18:00',
  'Segunda a Sábado, 08:00 às 17:00',
  'Segunda a Sábado, 07:00 às 16:00',
  'Escala 6x1, turnos rotativos',
  'Escala 12x36',
  'Segunda a Sexta, 07:00 às 17:00',
  'Segunda a Sexta, 08:00 às 17:00 com 1h de almoço',
  'Horário Comercial',
  'Turno Noturno: 22:00 às 06:00'
]

// Funções auxiliares
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateCPF(): string {
  const n = () => Math.floor(Math.random() * 10)
  const cpf = `${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}`
  // Simplificado - apenas gera 11 dígitos
  return cpf + `${n()}${n()}`
}

function generateCNPJ(): string {
  const n = () => Math.floor(Math.random() * 10)
  return `${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}0001${n()}${n()}`
}

function generatePhone(): string {
  return `69${randomInt(9, 9)}${randomInt(1000, 9999)}${randomInt(1000, 9999)}`
}

function generateEmail(nome: string, sobrenome: string, index: number): string {
  const providers = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'email.com']
  const cleanNome = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const cleanSobrenome = sobrenome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return `${cleanNome}.${cleanSobrenome}${index}@${randomItem(providers)}`
}

function generateBirthDate(): string {
  const year = randomInt(1960, 2005)
  const month = String(randomInt(1, 12)).padStart(2, '0')
  const day = String(randomInt(1, 28)).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function generateCandidato(index: number) {
  const isFemale = Math.random() > 0.5
  const nome = isFemale ? randomItem(NOMES_FEMININOS) : randomItem(NOMES_MASCULINOS)
  const sobrenome1 = randomItem(SOBRENOMES)
  const sobrenome2 = randomItem(SOBRENOMES)
  const cidade = randomItem(CIDADES_RO)
  const bairro = randomItem(cidade.bairros)
  
  const ehPcd = Math.random() < 0.05 // 5% PCD
  const possuiCnh = Math.random() < 0.6 // 60% com CNH
  const veiculoProprio = possuiCnh && Math.random() < 0.4 // 40% dos que têm CNH têm veículo
  
  return {
    user_id: crypto.randomUUID(),
    nome_completo: `${nome} ${sobrenome1} ${sobrenome2}`,
    cpf: generateCPF(),
    genero: isFemale ? 'F' : 'M',
    telefone: generatePhone(),
    cep: cidade.cep_base + String(randomInt(100, 999)),
    rua: randomItem(RUAS),
    numero: String(randomInt(1, 2000)),
    bairro: bairro,
    cidade: cidade.nome,
    estado: 'RO',
    email: generateEmail(nome, sobrenome1, index),
    data_nascimento: generateBirthDate(),
    estado_civil_id: randomInt(1, 5),
    nacionalidade: 'Brasileira',
    naturalidade: randomItem(CIDADES_RO).nome,
    nome_mae: `${randomItem(NOMES_FEMININOS)} ${randomItem(SOBRENOMES)}`,
    possui_filhos: Math.random() < 0.4,
    qtd_filhos: Math.random() < 0.4 ? randomInt(1, 4) : 0,
    eh_pcd: ehPcd,
    tipo_deficiencia_id: ehPcd ? randomInt(1, 7) : null,
    possui_cnh: possuiCnh,
    categoria_cnh_id: possuiCnh ? randomInt(1, 6) : null,
    veiculo_proprio: veiculoProprio
  }
}

function generateEmpresa(index: number, setor: keyof typeof EMPRESAS_POR_SETOR) {
  const config = EMPRESAS_POR_SETOR[setor]
  const prefixo = randomItem(config.prefixos)
  const sufixo = randomItem(config.sufixos)
  const cidade = randomItem(CIDADES_RO)
  const bairro = randomItem(cidade.bairros)
  
  const nomeFantasia = `${prefixo} ${sufixo}`
  const razaoSocial = `${nomeFantasia} LTDA`
  
  return {
    id: crypto.randomUUID(),
    razao_social: razaoSocial,
    nome_fantasia: nomeFantasia,
    cnpj: generateCNPJ(),
    ramo_atuacao_id: config.ramo_id,
    porte_id: randomInt(1, 5),
    descricao: `Empresa do ramo de ${setor} atuando em ${cidade.nome} e região.`,
    telefone_contato: generatePhone(),
    email_contato: `contato@${nomeFantasia.toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.com.br`,
    cep: cidade.cep_base + String(randomInt(100, 999)),
    rua: randomItem(RUAS),
    numero: String(randomInt(1, 2000)),
    bairro: bairro,
    cidade: cidade.nome,
    estado: 'RO',
    cargos: config.cargos
  }
}

function generateVaga(empresaId: string, cargo: any, areaId: number) {
  const numBeneficios = randomInt(3, 8)
  const beneficiosSelecionados = []
  const beneficiosDisponiveis = [...BENEFICIOS]
  for (let i = 0; i < numBeneficios; i++) {
    const idx = randomInt(0, beneficiosDisponiveis.length - 1)
    beneficiosSelecionados.push(beneficiosDisponiveis.splice(idx, 1)[0])
  }
  
  return {
    id: crypto.randomUUID(),
    empresa_id: empresaId,
    cargo: cargo.cargo,
    descricao: `Estamos contratando ${cargo.cargo} para fazer parte da nossa equipe. Buscamos profissionais comprometidos, com vontade de crescer e se desenvolver. Oferecemos ambiente de trabalho agradável e oportunidades de crescimento.`,
    salario_min: cargo.salario_min,
    salario_max: cargo.salario_max,
    quantidade_vagas: randomInt(1, 5),
    beneficios: beneficiosSelecionados.join(', '),
    status_id: 1, // Aberta
    area_id: areaId,
    horario_trabalho: randomItem(HORARIOS),
    vaga_pcd: Math.random() < 0.1 // 10% das vagas para PCD
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const numCandidatos = parseInt(searchParams.get('candidatos') || '10000')
    const numEmpresas = parseInt(searchParams.get('empresas') || '300')
    const batchSize = parseInt(searchParams.get('batch') || '500')
    
    const results = {
      candidatos: { total: 0, success: 0, errors: 0 },
      empresas: { total: 0, success: 0, errors: 0 },
      vagas: { total: 0, success: 0, errors: 0 }
    }
    
    // =====================================================
    // CRIAR CANDIDATOS
    // =====================================================
    console.log(`Iniciando criação de ${numCandidatos} candidatos...`)
    
    for (let i = 0; i < numCandidatos; i += batchSize) {
      const batch = []
      const end = Math.min(i + batchSize, numCandidatos)
      
      for (let j = i; j < end; j++) {
        batch.push(generateCandidato(j))
      }
      
      const { error } = await supabase
        .from('candidatos')
        .insert(batch)
      
      if (error) {
        console.error(`Erro no batch ${i}-${end}:`, error.message)
        results.candidatos.errors += batch.length
      } else {
        results.candidatos.success += batch.length
      }
      results.candidatos.total += batch.length
      
      // Log de progresso
      console.log(`Candidatos: ${results.candidatos.total}/${numCandidatos}`)
    }
    
    // =====================================================
    // CRIAR EMPRESAS E VAGAS
    // =====================================================
    console.log(`Iniciando criação de ${numEmpresas} empresas...`)
    
    const setores = Object.keys(EMPRESAS_POR_SETOR) as (keyof typeof EMPRESAS_POR_SETOR)[]
    const empresasPorSetor = Math.ceil(numEmpresas / setores.length)
    
    for (let s = 0; s < setores.length; s++) {
      const setor = setores[s]
      const numEmpresasSetor = s === setores.length - 1 
        ? numEmpresas - (empresasPorSetor * s)
        : empresasPorSetor
      
      for (let i = 0; i < numEmpresasSetor; i++) {
        const empresaData = generateEmpresa(s * empresasPorSetor + i, setor)
        const { cargos, ...empresa } = empresaData
        
        // Inserir empresa
        const { error: empresaError } = await supabase
          .from('empresas')
          .insert(empresa)
        
        if (empresaError) {
          console.error(`Erro ao criar empresa:`, empresaError.message)
          results.empresas.errors++
        } else {
          results.empresas.success++
          
          // Criar vagas para a empresa (3-8 vagas por empresa)
          const numVagas = randomInt(3, 8)
          const cargosDisponiveis = [...cargos]
          const vagas = []
          
          for (let v = 0; v < numVagas && cargosDisponiveis.length > 0; v++) {
            const cargoIdx = randomInt(0, cargosDisponiveis.length - 1)
            const cargo = cargosDisponiveis.splice(cargoIdx, 1)[0]
            vagas.push(generateVaga(empresa.id, cargo, randomInt(1, 20)))
          }
          
          const { error: vagasError } = await supabase
            .from('vagas')
            .insert(vagas)
          
          if (vagasError) {
            console.error(`Erro ao criar vagas:`, vagasError.message)
            results.vagas.errors += vagas.length
          } else {
            results.vagas.success += vagas.length
          }
          results.vagas.total += vagas.length
        }
        results.empresas.total++
      }
      
      console.log(`Setor ${setor}: ${results.empresas.total}/${numEmpresas} empresas`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Teste de estresse concluído',
      results,
      summary: {
        candidatos_criados: results.candidatos.success,
        empresas_criadas: results.empresas.success,
        vagas_criadas: results.vagas.success,
        total_erros: results.candidatos.errors + results.empresas.errors + results.vagas.errors
      }
    })
    
  } catch (error) {
    console.error('Erro no seed de stress test:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API de Teste de Estresse - Geração Emprego',
    usage: 'POST /api/admin/seed-stress-test?candidatos=10000&empresas=300&batch=500',
    parameters: {
      candidatos: 'Número de candidatos a criar (default: 10000)',
      empresas: 'Número de empresas a criar (default: 300)',
      batch: 'Tamanho do lote para inserção (default: 500)'
    },
    warning: 'Esta operação pode levar vários minutos para ser concluída.'
  })
}
