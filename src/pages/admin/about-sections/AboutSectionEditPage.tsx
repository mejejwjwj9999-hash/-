import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { EnhancedAboutCollegeEditor } from '@/components/admin/about-sections/EnhancedAboutCollegeEditor';
import { EnhancedDeanWordEditor } from '@/components/admin/about-sections/EnhancedDeanWordEditor';
import { EnhancedVisionMissionEditor } from '@/components/admin/about-sections/EnhancedVisionMissionEditor';
import { EnhancedBoardMembersEditor } from '@/components/admin/about-sections/EnhancedBoardMembersEditor';
import { EnhancedQualityAssuranceEditor } from '@/components/admin/about-sections/EnhancedQualityAssuranceEditor';
import { EnhancedScientificResearchEditor } from '@/components/admin/about-sections/EnhancedScientificResearchEditor';
import { useAboutSection } from '@/hooks/useAboutSections';

const AboutSectionEditPage: React.FC = () => {
  const { sectionKey } = useParams<{ sectionKey: string }>();
  const navigate = useNavigate();
  const { data: section, isLoading, error } = useAboutSection(sectionKey || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل محرر القسم...</p>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="text-center text-red-600 p-8" dir="rtl">
        <p className="mb-4">حدث خطأ في تحميل القسم أو القسم غير موجود</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/about-sections')}
        >
          العودة إلى إدارة الأقسام
        </Button>
      </div>
    );
  }

  const renderEditor = () => {
    if (!sectionKey) return null;

    switch (sectionKey) {
      case 'about-college':
        return <EnhancedAboutCollegeEditor pageKey={sectionKey} />;
      case 'about-dean-word':
        return <EnhancedDeanWordEditor pageKey={sectionKey} />;
      case 'about-vision-mission':
        return <EnhancedVisionMissionEditor pageKey={sectionKey} />;
      case 'about-board-members':
        return <EnhancedBoardMembersEditor pageKey={sectionKey} />;
      case 'about-quality-assurance':
        return <EnhancedQualityAssuranceEditor pageKey={sectionKey} />;
      case 'about-scientific-research':
        return <EnhancedScientificResearchEditor pageKey={sectionKey} />;
      default:
        return (
          <div className="text-center p-8" dir="rtl">
            <p className="text-muted-foreground mb-4">نوع القسم غير مدعوم</p>
            <Button variant="outline" onClick={() => navigate('/admin/about-sections')}>
              العودة إلى إدارة الأقسام
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/about-sections')}
          className="mb-4"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة إلى إدارة الأقسام
        </Button>
        
        <div className="bg-card p-4 rounded-lg border">
          <h1 className="text-2xl font-bold mb-2">
            تحرير قسم: {section.page_name_ar}
          </h1>
          <p className="text-muted-foreground">
            {section.description_ar}
          </p>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-background min-h-screen">
        {renderEditor()}
      </div>
    </div>
  );
};

export default AboutSectionEditPage;