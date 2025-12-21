"use client"

import { useApp } from "@/contexts/AppContext"
import Hero from "@/components/Hero"
import StatsBar from "@/components/StatsBar"
import StartNow from "@/components/StartNow"
import Courses from "@/components/Courses"
import AdminDashboard from "@/components/AdminDashboard"

export default function Home() {
  const { isAdmin } = useApp()

  return (
    <main>
      <Hero />
      <StatsBar />
      <StartNow />
      <Courses />
      {isAdmin && <AdminDashboard />}
    </main>
  )
}
