
import React, { useEffect } from 'react';
import HeroSectionEditable from '@/components/HeroSectionEditable';
import { DepartmentsSection } from '@/components/DepartmentsSection';
import NewsEvents from '@/components/NewsEvents';
import QuickLinks from '@/components/QuickLinks';

const Index = () => {
  useEffect(() => {
    document.title = 'الصفحة الرئيسية - كلية أيلول الجامعية';
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSectionEditable />
      <DepartmentsSection />
      <NewsEvents />
      <QuickLinks />
    </div>
  );
};

export default Index;

