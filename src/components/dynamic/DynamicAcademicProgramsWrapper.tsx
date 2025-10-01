import React from 'react';
import { DynamicAcademicPrograms } from './DynamicAcademicPrograms';
import { EditableContent } from '@/components/inline-editor/EditableContent';

interface DynamicAcademicProgramsWrapperProps {
  limit?: number;
  showViewAll?: boolean;
  language?: 'ar' | 'en';
}

export const DynamicAcademicProgramsWrapper: React.FC<DynamicAcademicProgramsWrapperProps> = ({
  limit = 6,
  showViewAll = true,
  language = 'ar'
}) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <EditableContent 
              pageKey="homepage" 
              elementKey="programs_title" 
              elementType="text"
              fallback="البرامج الأكاديمية"
              language={language}
            />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <EditableContent 
              pageKey="homepage" 
              elementKey="programs_description" 
              elementType="text"
              fallback="اكتشف مجموعة متنوعة من البرامج الأكاديمية المعتمدة والمصممة لإعدادك لسوق العمل"
              language={language}
            />
          </p>
        </div>

        {/* Programs Grid */}
        <DynamicAcademicPrograms 
          limit={limit}
          showViewAll={showViewAll}
          language={language}
        />
      </div>
    </section>
  );
};