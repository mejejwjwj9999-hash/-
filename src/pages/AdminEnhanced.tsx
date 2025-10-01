import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Shield } from 'lucide-react';
import EnhancedAdminLayout from '@/components/admin/EnhancedAdminLayout';
import EnhancedOverview from '@/components/admin/EnhancedOverview';
import StudentsManagementRadical from '@/components/admin/StudentsManagementRadical';
import CoursesManagement from '@/components/admin/CoursesManagement';
import SchedulesManagementRadical from '@/components/admin/SchedulesManagementRadical';
import GradesManagement from '@/components/admin/grades/GradesManagement';
import PaymentsManagementRadical from '@/components/admin/PaymentsManagementRadical';
import DocumentsManagement from '@/components/admin/DocumentsManagement';
import AppointmentsManagement from '@/components/admin/AppointmentsManagement';
import StudentRequestsManagement from '@/components/admin/StudentRequestsManagement';
import NotificationsManagementFixed from '@/components/admin/NotificationsManagementFixed';
import ReportsManagement from '@/components/admin/ReportsManagement';
import EnhancedDatabaseOperations from '@/components/admin/EnhancedDatabaseOperations';
import Settings from '@/components/admin/Settings';

const AdminEnhanced = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();

  // Sync active tab with URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Redirect to auth if user is not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-university-blue/10 to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-university-blue" />
                <h3 className="text-lg font-semibold">جاري التحميل</h3>
              </div>
              <p className="text-muted-foreground">يرجى الانتظار بينما نحضر لوحة الإدارة...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <EnhancedOverview />;
      case 'students':
        return <StudentsManagementRadical />;
      case 'courses':
        return <CoursesManagement />;
      case 'schedules':
        return <SchedulesManagementRadical />;
      case 'grades':
        return <GradesManagement />;
      case 'payments':
        return <PaymentsManagementRadical />;
      case 'documents':
        return <DocumentsManagement />;
      case 'appointments':
        return <AppointmentsManagement />;
      case 'requests':
        return <StudentRequestsManagement />;
      case 'notifications':
        return <NotificationsManagementFixed />;
      case 'reports':
        return <ReportsManagement />;
      case 'database':
        return <EnhancedDatabaseOperations />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">القسم غير متوفر</h3>
              <p className="text-yellow-700">القسم المطلوب غير متوفر حالياً. يرجى اختيار قسم آخر من القائمة الجانبية.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <EnhancedAdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnhancedAdminLayout>
  );
};

export default AdminEnhanced;