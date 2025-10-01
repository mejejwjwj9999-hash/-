import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ScientificResearchContent } from '@/components/public/about/ScientificResearchContent';
import { Loader2 } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';

const ScientificResearch: React.FC = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-scientific-research');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل مركز البحث العلمي...</p>
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
        <title>البحث العلمي والدراسات - كلية إيلول الجامعية</title>
        <meta name="description" content="مركز البحث العلمي والدراسات في كلية إيلول، المشاريع البحثية والمنشورات العلمية" />
        <meta name="keywords" content="البحث العلمي، المشاريع البحثية، المنشورات العلمية، الدراسات الأكاديمية، كلية إيلول" />
        <link rel="canonical" href={`${window.location.origin}/about/scientific-research`} />
        <meta property="og:title" content="البحث العلمي والدراسات - كلية إيلول الجامعية" />
        <meta property="og:description" content="مركز البحث العلمي والدراسات في كلية إيلول، المشاريع البحثية والمنشورات العلمية" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about/scientific-research`} />
      </Helmet>
      
      <ScientificResearchContent section={section} />
    </>
  );
};

export default ScientificResearch;