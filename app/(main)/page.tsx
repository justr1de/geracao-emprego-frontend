'use client';

import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import SearchSection from '@/components/SearchSection';
import RecommendedJobs from '@/components/RecommendedJobs';
import HowItWorks from '@/components/HowItWorks';
import StartNow from '@/components/StartNow';
import Courses from '@/components/Courses';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <SearchSection />
      <RecommendedJobs />
      <HowItWorks />
      <StartNow />
      <Courses />
    </>
  );
}
