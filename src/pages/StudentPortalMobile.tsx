
import React, { Suspense } from 'react';
import { Home, BookOpen, FileText, Calendar, Bell, GraduationCap, FileCheck, DollarSign, HeadphonesIcon, ClipboardList, Settings } from 'lucide-react';
import MobileAppShell from '@/components/mobile-portal/MobileAppShell';
import MobileDashboard from '@/components/mobile-portal/MobileDashboard';
import MobileCourses from '@/components/mobile-portal/MobileCourses';
import MobileSchedule from '@/components/mobile-portal/MobileSchedule';
import MobileAssignments from '@/components/mobile-portal/MobileAssignments';
import MobileNotifications from '@/components/mobile-portal/MobileNotifications';
import MobileGrades from '@/components/mobile-portal/MobileGrades';
import MobileDocuments from '@/components/mobile-portal/MobileDocuments';
import MobileFinancial from '@/components/mobile-portal/MobileFinancial';
import MobileStudentServices from '@/components/mobile-portal/MobileStudentServices';
import MobileMyRequests from '@/components/mobile-portal/MobileMyRequests';
import MobileSettings from '@/components/mobile-portal/MobileSettings';

const StudentPortalMobile = () => {
  // Core navigation tabs (shown in bottom nav)
  const mainTabs = [
    {
      id: 'dashboard',
      label: 'الرئيسية',
      icon: Home,
      component: MobileDashboard
    },
    {
      id: 'courses',
      label: 'المقررات',
      icon: BookOpen,
      component: MobileCourses
    },
    {
      id: 'assignments',
      label: 'الواجبات',
      icon: FileText,
      component: MobileAssignments
    },
    {
      id: 'schedule',
      label: 'الجدول',
      icon: Calendar,
      component: MobileSchedule
    },
    {
      id: 'notifications',
      label: 'الإشعارات',
      icon: Bell,
      component: MobileNotifications
    }
  ];

  // Secondary items (accessed through "More" sheet)
  const moreItems = [
    {
      id: 'grades',
      label: 'الدرجات',
      icon: GraduationCap,
      component: MobileGrades
    },
    {
      id: 'documents',
      label: 'الوثائق',
      icon: FileCheck,
      component: MobileDocuments
    },
    {
      id: 'financial',
      label: 'الشؤون المالية',
      icon: DollarSign,
      component: MobileFinancial
    },
    {
      id: 'student-services',
      label: 'خدمات الطلاب',
      icon: HeadphonesIcon,
      component: MobileStudentServices
    },
    {
      id: 'my-requests',
      label: 'طلباتي',
      icon: ClipboardList,
      component: MobileMyRequests
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: Settings,
      component: MobileSettings
    }
  ];

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">جاري تحميل بوابة الطالب...</p>
        </div>
      </div>
    }>
      <MobileAppShell
        tabs={mainTabs}
        moreItems={moreItems}
        defaultTab="dashboard"
      />
    </Suspense>
  );
};

export default StudentPortalMobile;
