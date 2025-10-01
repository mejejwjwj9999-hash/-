import React from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Bell,
  UserCheck,
  GraduationCap,
  DollarSign,
  Calendar,
  BarChart,
  Settings,
  FileBarChart
} from 'lucide-react';
import AdminMobileAppShell from '@/components/admin-mobile-portal/AdminMobileAppShell';
import AdminMobileDashboard from '@/components/admin-mobile-portal/AdminMobileDashboard';
import AdminMobileStudents from '@/components/admin-mobile-portal/AdminMobileStudents';
import AdminMobileCourses from '@/components/admin-mobile-portal/AdminMobileCourses';
import AdminMobilePayments from '@/components/admin-mobile-portal/AdminMobilePayments';
import AdminMobileSchedules from '@/components/admin-mobile-portal/AdminMobileSchedules';
import AdminMobileGrades from '@/components/admin-mobile-portal/AdminMobileGrades';
import AdminMobileNotifications from '@/components/admin-mobile-portal/AdminMobileNotifications';
import AdminMobileReports from '@/components/admin-mobile-portal/AdminMobileReports';
import AdminMobileSettings from '@/components/admin-mobile-portal/AdminMobileSettings';
import AdminMobileTeachers from '@/components/admin-mobile-portal/AdminMobileTeachers';
import AdminMobileEnrollment from '@/components/admin-mobile-portal/AdminMobileEnrollment';

const AdminPortalMobile = () => {
  // Main tabs for bottom navigation
  const mainTabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: BarChart3, component: AdminMobileDashboard },
    { id: 'students', label: 'الطلاب', icon: Users, component: AdminMobileStudents },
    { id: 'teachers', label: 'المعلمين', icon: UserCheck, component: AdminMobileTeachers },
    { id: 'courses', label: 'المقررات', icon: BookOpen, component: AdminMobileCourses },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, component: AdminMobileNotifications }
  ];

  // More items for additional functionality
  const moreItems = [
    { id: 'enrollment', label: 'إدارة التسجيل', icon: GraduationCap, component: AdminMobileEnrollment },
    { id: 'payments', label: 'إدارة المدفوعات', icon: DollarSign, component: AdminMobilePayments },
    { id: 'schedules', label: 'إدارة الجداول', icon: Calendar, component: AdminMobileSchedules },
    { id: 'grades', label: 'إدارة الدرجات', icon: BarChart, component: AdminMobileGrades },
    { id: 'reports', label: 'التقارير والإحصائيات', icon: FileBarChart, component: AdminMobileReports },
    { id: 'settings', label: 'إعدادات النظام', icon: Settings, component: AdminMobileSettings }
  ];

  return (
    <AdminMobileAppShell
      tabs={mainTabs}
      moreItems={moreItems}
      defaultTab="dashboard"
    />
  );
};

export default AdminPortalMobile;