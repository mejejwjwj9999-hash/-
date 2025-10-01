
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import MobileTopBar from '@/components/mobile-portal/MobileTopBar';
import MobileNavigation from '@/components/mobile-portal/MobileNavigation';
import MobileDashboard from '@/components/mobile-portal/MobileDashboard';
import MobileCourses from '@/components/mobile-portal/MobileCourses';
import MobileSchedule from '@/components/mobile-portal/MobileSchedule';
import MobileFinancial from '@/components/mobile-portal/MobileFinancial';
import MobileGrades from '@/components/mobile-portal/MobileGrades';
import MobileDocuments from '@/components/mobile-portal/MobileDocuments';
import MobileNotifications from '@/components/mobile-portal/MobileNotifications';
import MobileSettings from '@/components/mobile-portal/MobileSettings';
import MobileServiceRequests from '@/components/mobile-portal/MobileServiceRequests';
import MobileMyRequests from '@/components/mobile-portal/MobileMyRequests';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';

const StudentPortal = () => {
  const { user, loading, profile } = useAuth();
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['dashboard', 'courses', 'schedule', 'financial', 'grades', 'documents', 'notifications', 'settings', 'service-requests', 'my-requests'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const handleNotificationsClick = () => {
    setActiveTab('notifications');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">جاري تحميل بوابة الطالب...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MobileDashboard onTabChange={handleTabChange} />;
      case 'courses':
        return <MobileCourses />;
      case 'schedule':
        return <MobileSchedule />;
      case 'financial':
        return <MobileFinancial />;
      case 'grades':
        return <MobileGrades />;
      case 'documents':
        return <MobileDocuments />;
      case 'notifications':
        return <MobileNotifications />;
      case 'settings':
        return <MobileSettings />;
      case 'service-requests':
        return <MobileServiceRequests />;
      case 'my-requests':
        return <MobileMyRequests />;
      default:
        return <MobileDashboard onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileTopBar 
        user={user} 
        profile={profile} 
        onNotificationsClick={handleNotificationsClick} 
      />
      <main className="pt-16 pb-20">
        {renderContent()}
      </main>
      <MobileNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        unreadNotifications={unreadCount}
      />
    </div>
  );
};

export default StudentPortal;
