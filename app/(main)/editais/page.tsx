"use client"

import { useState } from "react"
import BackButton from "@/components/BackButton"
import NoticeSidebar from "@/components/NoticeSidebar"
import NoticeDetail from "@/components/NoticeDetail"
import styles from "./page.module.css"

const mockNotices = [
  {
    id: 1,
    title: "Processo Seletivo - Analista de TI",
    organization: "Prefeitura Municipal de São Paulo",
    publishDate: "15/01/2024",
    deadline: "28/02/2024",
    type: "Processo Seletivo",
    category: "Tecnologia",
    description:
      "A Prefeitura Municipal de São Paulo abre inscrições para o processo seletivo de Analista de TI. O profissional será responsável pelo desenvolvimento e manutenção de sistemas internos, suporte técnico e gestão de infraestrutura tecnológica.",
    requirements: [
      "Ensino superior completo em Tecnologia da Informação ou áreas correlatas",
      "Experiência mínima de 2 anos na área",
      "Conhecimento em desenvolvimento web (JavaScript, React, Node.js)",
      "Conhecimento em bancos de dados SQL e NoSQL",
      "Disponibilidade para trabalho presencial",
    ],
    benefits: ["Vale transporte", "Vale alimentação", "Plano de saúde", "Plano odontológico"],
    courses: [
      "Desenvolvimento Web Full Stack - SENAC",
      "Administração de Sistemas Linux - SENAI",
      "Segurança da Informação - SEBRAE",
    ],
    documents: [
      { name: "Edital Completo.pdf", size: "2.4 MB" },
      { name: "Anexo I - Requisitos.pdf", size: "856 KB" },
      { name: "Cronograma de Provas.pdf", size: "512 KB" },
    ],
  },
  {
    id: 2,
    title: "Concurso Público - Professor de Matemática",
    organization: "Secretaria de Educação do Estado",
    publishDate: "10/01/2024",
    deadline: "15/03/2024",
    type: "Concurso Público",
    category: "Educação",
    description:
      "Concurso público para contratação de professores de matemática para atuar nas escolas estaduais. O profissional será responsável por lecionar aulas do ensino fundamental II e médio.",
    requirements: [
      "Licenciatura em Matemática",
      "Registro ativo no conselho regional",
      "Experiência comprovada em docência",
      "Disponibilidade para diferentes turnos",
    ],
    benefits: ["Salário competitivo", "Vale transporte", "Vale refeição", "Plano de carreira"],
    courses: [
      "Metodologias de Ensino - SENAC",
      "Matemática Aplicada - Universidade Federal",
      "Gestão de Sala de Aula - SEBRAE",
    ],
    documents: [
      { name: "Edital_Professor_Matematica.pdf", size: "3.1 MB" },
      { name: "Conteúdo Programático.pdf", size: "1.2 MB" },
    ],
  },
  {
    id: 3,
    title: "Seleção - Auxiliar Administrativo",
    organization: "Hospital Central",
    publishDate: "05/01/2024",
    deadline: "20/02/2024",
    type: "Seleção Simplificada",
    category: "Administrativo",
    description:
      "O Hospital Central está selecionando auxiliares administrativos para atuar no setor de atendimento e gestão de documentos. Profissional responsável por recepção, agendamento de consultas e organização de prontuários.",
    requirements: [
      "Ensino médio completo",
      "Conhecimento básico em informática",
      "Experiência em atendimento ao público",
      "Boa comunicação verbal e escrita",
    ],
    benefits: ["Vale transporte", "Vale alimentação", "Assistência médica"],
    courses: ["Assistente Administrativo - SENAI", "Atendimento ao Cliente - SENAC", "Informática Básica - SEBRAE"],
    documents: [
      { name: "Edital_Auxiliar_Admin.pdf", size: "1.8 MB" },
      { name: "Formulário de Inscrição.pdf", size: "420 KB" },
    ],
  },
]

export default function NoticesPage() {
  const [selectedNotice, setSelectedNotice] = useState(mockNotices[0])

  return (
    <div className={styles.pageContainer}>
      <BackButton />

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <NoticeDetail notice={selectedNotice} />
        </div>

        <NoticeSidebar notices={mockNotices} selectedId={selectedNotice.id} onSelect={setSelectedNotice} />
      </div>
    </div>
  )
}
