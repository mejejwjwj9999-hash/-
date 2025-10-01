import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import ResponsiveStudentPortalLayout from '@/components/student-portal/ResponsiveStudentPortalLayout';
import EnhancedDashboard from '@/components/student-portal/EnhancedDashboard';
import ModernStudentServicesSection from '@/components/student-portal/ModernStudentServicesSection';
import FinancialServices from '@/components/student-portal/FinancialServices';
import DocumentsSection from '@/components/student-portal/DocumentsSection';
import AppointmentsSection from '@/components/student-portal/AppointmentsSection';
import NotificationsSection from '@/components/student-portal/NotificationsSection';
import EnhancedGradesSection from '@/components/student-portal/EnhancedGradesSection';
import ImprovedScheduleSection from '@/components/student-portal/ImprovedScheduleSection';
import EnhancedCoursesSection from '@/components/student-portal/EnhancedCoursesSection';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

const StudentPortalImproved = () => {
  const { user, loading, profile } = useAuth();
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
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full mx-auto"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-primary">البوابة الطلابية</h3>
              <p className="text-muted-foreground">يرجى الانتظار بينما نحضر حسابك...</p>
            </div>
            <div className="text-xs text-muted-foreground">
              كلية أيلول الجامعة
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'grades':
        return <EnhancedGradesSection />;
      case 'schedule':
        return <ImprovedScheduleSection />;
      case 'courses':
        return <EnhancedCoursesSection />;
      case 'payments':
        return <FinancialServices onTabChange={setActiveTab} />;
      case 'documents':
        return <DocumentsSection />;
      case 'services':
        return <ModernStudentServicesSection onTabChange={setActiveTab} />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        return (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800">القسم غير متوفر</h3>
              <p className="text-yellow-700 mt-2">القسم المطلوب غير متوفر حالياً. يرجى اختيار قسم آخر.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <ResponsiveStudentPortalLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </ResponsiveStudentPortalLayout>
    </div>
  );
};

export default StudentPortalImproved;
