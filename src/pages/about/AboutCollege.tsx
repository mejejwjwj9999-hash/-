import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CollegeContent } from '@/components/public/about/CollegeContent';
import { Loader2 } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';

const AboutCollege: React.FC = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-college');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل محتوى الصفحة...</p>
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
        <title>عن الكلية - كلية إيلول الجامعية</title>
        <meta name="description" content="تعرف على كلية إيلول الجامعية، تاريخها، رسالتها وأهدافها في تقديم تعليم عالي الجودة" />
        <meta name="keywords" content="كلية إيلول، التعليم العالي، الجامعة، عن الكلية، التاريخ" />
        <link rel="canonical" href={`${window.location.origin}/about/college`} />
        <meta property="og:title" content="عن الكلية - كلية إيلول الجامعية" />
        <meta property="og:description" content="تعرف على كلية إيلول الجامعية، تاريخها، رسالتها وأهدافها في تقديم تعليم عالي الجودة" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about/college`} />
      </Helmet>
      
      <CollegeContent section={section} />
    </>
  );
};

export default AboutCollege;