import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DeanMessageContent } from '@/components/public/about/DeanMessageContent';
import { Loader2 } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';

const DeanMessage: React.FC = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-dean-word');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل كلمة العميد...</p>
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
        <title>كلمة عميد الكلية - كلية إيلول الجامعية</title>
        <meta name="description" content="كلمة عميد كلية إيلول الجامعية ورسالته للطلاب والمجتمع الأكاديمي" />
        <meta name="keywords" content="عميد الكلية، كلمة العميد، القيادة الأكاديمية، إيلول" />
        <link rel="canonical" href={`${window.location.origin}/about/dean-message`} />
        <meta property="og:title" content="كلمة عميد الكلية - كلية إيلول الجامعية" />
        <meta property="og:description" content="كلمة عميد كلية إيلول الجامعية ورسالته للطلاب والمجتمع الأكاديمي" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about/dean-message`} />
      </Helmet>
      
      <DeanMessageContent section={section} />
    </>
  );
};

export default DeanMessage;