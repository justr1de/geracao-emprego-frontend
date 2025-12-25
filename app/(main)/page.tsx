'use client';

import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import SearchSection from '@/components/SearchSection';
import HowItWorks from '@/components/HowItWorks';
import StartNow from '@/components/StartNow';
import Courses from '@/components/Courses';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <SearchSection />
      <HowItWorks />
      <StartNow />
      <Courses />
    </>
  );
}
