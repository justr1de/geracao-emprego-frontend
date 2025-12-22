"use client"

import { useState } from "react"
import BackButton from "@/components/BackButton"
import NoticeSidebar from "@/components/NoticeSidebar"
import NoticeDetail from "@/components/NoticeDetail"
import styles from "./page.module.css"

interface Document {
  name: string;
  size: string;
}

interface Notice {
  id: number;
  title: string;
  organization: string;
  publishDate: string;
  deadline: string;
  type: string;
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  courses: string[];
  documents: Document[];
}

const mockNotices: Notice[] = [
  {
    id: 1,
    title: "Processo Seletivo - Analista de TI",
    organization: "Prefeitura Municipal de São Paulo",
    publishDate: "15/01/2024",
    deadline: "28/02/2024",
    type: "Processo Seletivo",
    category: "Tecnologia",
    description: "A Prefeitura Municipal de São Paulo abre inscrições para o processo seletivo de Analista de TI. O profissional será responsável pelo desenvolvimento e manutenção de sistemas internos.",
    requirements: ["Ensino superior completo", "Experiência mínima de 2 anos"],
    benefits: ["Vale transporte", "Vale alimentação", "Plano de saúde"],
    courses: ["Desenvolvimento Web Full Stack - SENAC"],
    documents: [{ name: "Edital Completo.pdf", size: "2.4 MB" }],
  },
  {
    id: 2,
    title: "Concurso Público - Professor de Matemática",
    organization: "Secretaria de Educação do Estado",
    publishDate: "10/01/2024",
    deadline: "15/03/2024",
    type: "Concurso Público",
    category: "Educação",
    description: "Concurso público para contratação de professores de matemática para atuar nas escolas estaduais.",
    requirements: ["Licenciatura em Matemática"],
    benefits: ["Salário competitivo"],
    courses: ["Metodologias de Ensino - SENAC"],
    documents: [{ name: "Edital_Professor.pdf", size: "3.1 MB" }],
  }
]

export default function NoticesPage() {
  const [selectedNotice, setSelectedNotice] = useState<Notice>(mockNotices[0])

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topActions}>
        <BackButton label="Voltar para Editais" />
      </div>

      <div className={styles.content}>
        {/* Lado Esquerdo: Detalhe (Aparece em baixo no mobile) */}
        <div className={styles.mainContent}>
          <NoticeDetail notice={selectedNotice} />
        </div>

        {/* Lado Direito: Escolha/Filtro (Aparece em cima no mobile) */}
        <aside className={styles.sidebarWrapper}>
          <NoticeSidebar 
            notices={mockNotices} 
            selectedId={selectedNotice.id} 
            onSelect={(notice: any) => setSelectedNotice(notice)} 
          />
        </aside>
      </div>
    </div>
  )
}