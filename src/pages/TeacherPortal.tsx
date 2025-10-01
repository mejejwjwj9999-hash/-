import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import TeacherMobileTopBar from '@/components/teacher-portal/TeacherMobileTopBar';
import TeacherMobileNavigation from '@/components/teacher-portal/TeacherMobileNavigation';
import TeacherDashboardNew from '@/components/teacher-portal/TeacherDashboardNew';
import TeacherCourses from '@/components/teacher-portal/TeacherCourses';
import TeacherAttendance from '@/components/teacher-portal/TeacherAttendance';
import TeacherGradesNew from '@/components/teacher-portal/TeacherGradesNew';
import TeacherSchedule from '@/components/teacher-portal/TeacherSchedule';
import TeacherAnnouncements from '@/components/teacher-portal/TeacherAnnouncements';
import TeacherMaterials from '@/components/teacher-portal/TeacherMaterials';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useIsAdminFixed } from '@/hooks/useIsAdminFixed';

const TeacherPortal = () => {
  const { user, loading } = useAuth();
  const { data: teacherProfile, isLoading: profileLoading } = useTeacherProfile();
  const { data: isAdmin } = useIsAdminFixed(user?.id);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const validTabs = ['dashboard', 'courses', 'attendance', 'grades', 'schedule', 'announcements', 'materials'];
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const handleNotificationsClick = () => {
    console.log('تم النقر على الإشعارات');
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">جاري تحميل بوابة المعلمين...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // السماح للمسؤولين بالدخول حتى لو لم يكن لديهم ملف معلم
  if (!teacherProfile && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">غير مسموح بالدخول</h2>
          <p className="text-muted-foreground mb-4">
            لا يمكنك الوصول إلى بوابة المعلمين. يرجى التواصل مع الإدارة للحصول على الصلاحيات المناسبة.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboardNew onTabChange={handleTabChange} />;
      case 'courses':
        return <TeacherCourses onTabChange={handleTabChange} />;
      case 'attendance':
        return <TeacherAttendance onTabChange={handleTabChange} />;
      case 'grades':
        return <TeacherGradesNew onTabChange={handleTabChange} />;
      case 'schedule':
        return <TeacherSchedule onTabChange={handleTabChange} />;
      case 'announcements':
        return <TeacherAnnouncements onTabChange={handleTabChange} />;
      case 'materials':
        return <TeacherMaterials onTabChange={handleTabChange} />;
      default:
        return <TeacherDashboardNew onTabChange={handleTabChange} />;
    }
  };

  return (
    <Routes>
      <Route path="/*" element={
        <div className="min-h-screen bg-background" dir="rtl">
          {/* الشريط العلوي الثابت */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <TeacherMobileTopBar 
              user={user} 
              profile={teacherProfile} 
              onNotificationsClick={handleNotificationsClick} 
            />
          </div>
          
          {/* المحتوى الرئيسي */}
          <main className="pt-48 pb-20 px-4">
            {renderContent()}
          </main>
          
          {/* شريط التنقل السفلي */}
          <TeacherMobileNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
        </div>
      } />
    </Routes>
  );
};

export default TeacherPortal;