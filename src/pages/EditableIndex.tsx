import React from 'react';
import { InlineEditorProvider } from '@/contexts/InlineEditorContext';
import Navigation from '@/components/Navigation';
import EditableHeroSection from '@/components/inline-editor/EditableHeroSection';
import { DynamicAcademicProgramsWrapper } from '@/components/dynamic/DynamicAcademicProgramsWrapper';
import EditableNewsEvents from '@/components/inline-editor/EditableNewsEvents';
import { DynamicQuickServices } from '@/components/dynamic/DynamicQuickServices';
import QuickLinks from '@/components/QuickLinks';
import Footer from '@/components/Footer';

const EditableIndex = () => {
  return (
    <InlineEditorProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main>
          <EditableHeroSection />
          <DynamicAcademicProgramsWrapper limit={6} showViewAll={true} />
          <EditableNewsEvents />
          <DynamicQuickServices language="ar" />
          <QuickLinks />
        </main>
        
        <Footer />
      </div>
    </InlineEditorProvider>
  );
};

export default EditableIndex;