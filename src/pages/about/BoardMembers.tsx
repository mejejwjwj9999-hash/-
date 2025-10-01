import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BoardMembersContent } from '@/components/public/about/BoardMembersContent';
import { Loader2 } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';

const BoardMembers: React.FC = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-board-members');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل مجلس الإدارة...</p>
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
        <title>مجلس الإدارة - كلية إيلول الجامعية</title>
        <meta name="description" content="تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية والقيادات الأكاديمية والإدارية" />
        <meta name="keywords" content="مجلس الإدارة، القيادة، أعضاء المجلس، كلية إيلول، الإدارة الأكاديمية" />
        <link rel="canonical" href={`${window.location.origin}/about/board-members`} />
        <meta property="og:title" content="مجلس الإدارة - كلية إيلول الجامعية" />
        <meta property="og:description" content="تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية والقيادات الأكاديمية والإدارية" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/about/board-members`} />
      </Helmet>
      
      <BoardMembersContent section={section} />
    </>
  );
};

export default BoardMembers;