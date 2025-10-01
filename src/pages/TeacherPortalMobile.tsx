import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsTeacher } from '@/hooks/useIsTeacher';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import TeacherMobileTopBar from '@/components/teacher-portal/TeacherMobileTopBar';
import TeacherMobileNavigation from '@/components/teacher-portal/TeacherMobileNavigation';
import TeacherDashboard from '@/components/teacher-portal/TeacherDashboard';
import TeacherCourses from '@/components/teacher-portal/TeacherCourses';
import TeacherAttendance from '@/components/teacher-portal/TeacherAttendance';
import TeacherGrades from '@/components/teacher-portal/TeacherGrades';
import TeacherSchedule from '@/components/teacher-portal/TeacherSchedule';

const TeacherPortalMobile = () => {
  const { user, loading } = useAuth();
  const { data: isTeacher, isLoading: checkingTeacher } = useIsTeacher();
  const { data: profile, isLoading: profileLoading } = useTeacherProfile();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['dashboard', 'courses', 'attendance', 'grades', 'schedule'].includes(tab)) {
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
    setActiveTab('notifications');
  };

  if (loading || checkingTeacher || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">جاري تحميل بوابة المعلمين...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isTeacher) {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard onTabChange={handleTabChange} />;
      case 'courses':
        return <TeacherCourses />;
      case 'attendance':
        return <TeacherAttendance />;
      case 'grades':
        return <TeacherGrades />;
      case 'schedule':
        return <TeacherSchedule />;
      default:
        return <TeacherDashboard onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="mobile-layout min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mobile-top-bar-fixed">
        <TeacherMobileTopBar 
          user={user} 
          profile={profile}
          onNotificationsClick={handleNotificationsClick} 
        />
      </div>
      <main className="mobile-content-wrapper">
        {renderContent()}
      </main>
      <TeacherMobileNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default TeacherPortalMobile;