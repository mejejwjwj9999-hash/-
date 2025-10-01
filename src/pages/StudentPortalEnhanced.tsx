
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import OptimizedStudentPortalLayout from '@/components/student-portal/OptimizedStudentPortalLayout';
import OptimizedDashboard from '@/components/student-portal/OptimizedDashboard';
import StudentServicesFixed from '@/components/student-portal/StudentServicesFixed';
import FinancialServices from '@/components/student-portal/FinancialServices';
import DocumentsSection from '@/components/student-portal/DocumentsSection';
import AppointmentsSection from '@/components/student-portal/AppointmentsSection';
import EnhancedNotificationSystem from '@/components/notifications/EnhancedNotificationSystem';
import EnhancedGradesSection from '@/components/student-portal/EnhancedGradesSection';
import ClassSchedule from '@/components/student-portal/ClassSchedule';
import EnhancedCoursesSection from '@/components/student-portal/EnhancedCoursesSection';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, GraduationCap } from 'lucide-react';

const StudentPortalEnhanced = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  // مزامنة التبويب النشط مع معامل الاستعلام
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // إعادة التوجيه إلى صفحة المصادقة إذا لم يكن المستخدم مسجل دخول
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">جاري التحميل</h3>
              </div>
              <p className="text-muted-foreground">يرجى الانتظار بينما نحضر بوابتك الطلابية...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OptimizedDashboard onTabChange={setActiveTab} />;
      case 'grades':
        return <EnhancedGradesSection />;
      case 'schedule':
        return <ClassSchedule />;
      case 'courses':
        return <EnhancedCoursesSection />;
      case 'payments':
        return <FinancialServices onTabChange={setActiveTab} />;
      case 'documents':
        return <DocumentsSection />;
      case 'services':
        return <StudentServicesFixed onTabChange={setActiveTab} />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'notifications':
        return <EnhancedNotificationSystem />;
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
    <OptimizedStudentPortalLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </OptimizedStudentPortalLayout>
  );
};

export default StudentPortalEnhanced;
