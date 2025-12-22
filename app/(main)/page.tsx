'use client';

import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import StartNow from '@/components/StartNow';
import Courses from '@/components/Courses';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <StartNow />
      <Courses />
    </>
  );
}
