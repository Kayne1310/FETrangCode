import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import CheckSection from '../components/CheckSection';
import StatsSection from '../components/StatsSection';
import EducationSection from '../components/EducationSection';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <FeatureSection />
      <CheckSection />
      <StatsSection />
      <EducationSection />
    </div>
  );
};

export default HomePage; 