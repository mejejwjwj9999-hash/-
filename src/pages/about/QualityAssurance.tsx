import React from 'react';
import { Helmet } from 'react-helmet-async';
import { QualityAssuranceContent } from '@/components/public/about/QualityAssuranceContent';
import { Loader2 } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';

const QualityAssurance: React.FC = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-quality-assurance');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل وحدة ضمان الجودة...</p>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">حدث خطأ في تحميل المحتوى</p>
          <p className="text-muted-foreground">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>وحدة التطوير وضمان الجودة - كلية إيلول الجامعية</title>
        <meta name="description" content="تعرف على وحدة التطوير وضمان الجودة في كلية إيلول ودورها في تحسين جودة التعليم" />
        <meta name="keywords" content="ضمان الجودة، التطوير الأكاديمي، معايير الجودة، الاعتماد الأكاديمي، كلية إيلول" />
        <link rel="canonical" href={`${window.location.origin}/about/quality-assurance`} />
        <meta property="og:title" content="وحدة التطوير وضمان الجودة - كلية إيلول الجامعية" />
        <meta property="og:description" content="تعرف على وحدة التطوير وضمان الجودة في كلية إيلول ودورها في تحسين جودة التعليم" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about/quality-assurance`} />
      </Helmet>
      
      <QualityAssuranceContent section={section} />
    </>
  );
};

export default QualityAssurance;