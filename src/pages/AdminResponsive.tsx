import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import ResponsiveAdminLayout from '@/components/admin/ResponsiveAdminLayout';
import AdminDashboardFixed from '@/components/admin/AdminDashboardFixed';
import StudentsManagementResponsive from '@/components/admin/StudentsManagementResponsive';
import NotificationsManagementFixed from '@/components/admin/NotificationsManagementFixed';
import PaymentsManagementFixed from '@/components/admin/PaymentsManagementFixed';
import CoursesManagement from '@/components/admin/CoursesManagement';
import GradesManagement from '@/components/admin/grades/GradesManagement';
import SchedulesManagement from '@/components/admin/SchedulesManagement';
import DocumentsManagement from '@/components/admin/DocumentsManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import DatabaseManagement from '@/components/admin/DatabaseManagement';
import Settings from '@/components/admin/Settings';
import { AdvancedContentManagement } from '@/components/admin/AdvancedContentManagement';
import { useIsAdminFixed } from '@/hooks/useIsAdminFixed';

const AdminResponsive: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState('overview');

  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdminFixed(user?.id);

  if (loading || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مخول بالدخول</h1>
          <p className="text-gray-600">ليس لديك صلاحية للوصول إلى لوحة الإدارة.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return <AdminDashboardFixed />;
      case 'students':
        return <StudentsManagementResponsive />;
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
      case 'reports':
        return <ReportsManagement />;
      case 'database':
        return <DatabaseManagement />;
      case 'content-editor':
        return <AdvancedContentManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboardFixed />;
    }
  };

  return (
    <ResponsiveAdminLayout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {renderContent()}
    </ResponsiveAdminLayout>
  );
};

export default AdminResponsive;
