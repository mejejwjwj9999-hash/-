import React from 'react';
import { Helmet } from 'react-helmet-async';
import { VisionMissionContent } from '@/components/public/about/VisionMissionContent';
import { Loader2 } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';

const VisionMission: React.FC = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-vision-mission');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل الرؤية والرسالة...</p>
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
        <title>الرؤية والرسالة والأهداف - كلية إيلول الجامعية</title>
        <meta name="description" content="رؤية ورسالة وأهداف كلية إيلول الجامعية في التعليم العالي والبحث العلمي" />
        <meta name="keywords" content="الرؤية، الرسالة، الأهداف، كلية إيلول، التطلعات المستقبلية" />
        <link rel="canonical" href={`${window.location.origin}/about/vision-mission`} />
        <meta property="og:title" content="الرؤية والرسالة والأهداف - كلية إيلول الجامعية" />
        <meta property="og:description" content="رؤية ورسالة وأهداف كلية إيلول الجامعية في التعليم العالي والبحث العلمي" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about/vision-mission`} />
      </Helmet>
      
      <VisionMissionContent section={section} />
    </>
  );
};

export default VisionMission;