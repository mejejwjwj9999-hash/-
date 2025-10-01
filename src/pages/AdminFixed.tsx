import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import ResponsiveAdminLayoutFixed from '@/components/admin/ResponsiveAdminLayoutFixed';
import AdminDashboardFixed from '@/components/admin/AdminDashboardFixed';
import StudentsManagementFixed from '@/components/admin/StudentsManagementFixed';
import AppointmentsManagement from '@/components/admin/AppointmentsManagement';
import NotificationsManagementFixed from '@/components/admin/NotificationsManagementFixed';
import PaymentsManagementFixed from '@/components/admin/PaymentsManagementFixed';
import CoursesManagement from '@/components/admin/CoursesManagement';
import GradesManagement from '@/components/admin/grades/GradesManagement';
import SchedulesManagement from '@/components/admin/SchedulesManagement';
import DocumentsManagement from '@/components/admin/DocumentsManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import DatabaseManagement from '@/components/admin/DatabaseManagement';
import Settings from '@/components/admin/Settings';
import ServicesManagement from '@/components/admin/ServicesManagement';
import StudentRequestsManagement from '@/components/admin/StudentRequestsManagement';
import { useIsAdminFixed } from '@/hooks/useIsAdminFixed';

const AdminFixed: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState('overview');

  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdminFixed(user?.id);

  if (loading || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">جاري التحقق من الصلاحيات</h3>
            <p className="text-muted-foreground">يرجى الانتظار بينما نتأكد من صلاحيات الوصول...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">غير مخول بالدخول</h1>
          <p className="text-gray-600 mb-6">ليس لديك صلاحية للوصول إلى لوحة الإدارة. يرجى التواصل مع المسؤول.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return <AdminDashboardFixed />;
      case 'students':
        return <StudentsManagementFixed />;
      case 'appointments':
        return <AppointmentsManagement />;
      case 'courses':
        return <CoursesManagement />;
      case 'grades':
        return <GradesManagement />;
      case 'schedules':
        return <SchedulesManagement />;
      case 'payments':
        return <PaymentsManagementFixed />;
      case 'notifications':
        return <NotificationsManagementFixed />;
      case 'documents':
        return <DocumentsManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'student-requests':
        return <StudentRequestsManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'database':
        return <DatabaseManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboardFixed />;
    }
  };

  return (
    <ResponsiveAdminLayoutFixed
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {renderContent()}
    </ResponsiveAdminLayoutFixed>
  );
};

export default AdminFixed;
