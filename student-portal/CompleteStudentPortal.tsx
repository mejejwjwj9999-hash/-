import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Home, Calendar, GraduationCap, CreditCard, FileText, 
  Users, Bell, Menu, School, User, LogOut
} from 'lucide-react';
import StudentPortalDashboard from './StudentPortalDashboard';
import ScheduleSection from './ScheduleSection';
import GradesSection from './GradesSection';
import FinancialServicesComplete from './FinancialServicesComplete';
import DocumentsSection from './DocumentsSection';
import StudentServicesComplete from './StudentServicesComplete';
import RealTimeNotificationsOptimized from '@/components/notifications/RealTimeNotificationsOptimized';

const CompleteStudentPortal = () => {
  const { user, profile, signOut, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-academic-gray-light">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-university-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const menuItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: Home },
    { id: 'schedule', name: 'الجدول الدراسي', icon: Calendar },
    { id: 'grades', name: 'الدرجات', icon: GraduationCap },
    { id: 'financial', name: 'الشؤون المالية', icon: CreditCard },
    { id: 'documents', name: 'الوثائق', icon: FileText },
    { id: 'services', name: 'الخدمات الطلابية', icon: Users },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <StudentPortalDashboard />;
      case 'schedule': return <ScheduleSection />;
      case 'grades': return <GradesSection />;
      case 'financial': return <FinancialServicesComplete />;
      case 'documents': return <DocumentsSection />;
      case 'services': return <StudentServicesComplete />;
      default: return <StudentPortalDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-academic-gray-light flex w-full" dir="rtl">
        <Sidebar className="w-64 border-l border-gray-200">
          <SidebarContent className="p-4">
            <div className="flex items-center gap-3 mb-8 p-3 bg-university-blue rounded-lg text-white">
              <School className="h-8 w-8" />
              <div>
                <h2 className="font-bold">بوابة الطالب</h2>
                <p className="text-xs opacity-75">كلية أيلول الجامعة</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="w-full justify-start h-12 text-right"
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="ml-3 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <div className="p-3 bg-white rounded-lg border mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-university-blue rounded-full flex items-center justify-center text-white font-bold">
                    {profile?.first_name?.charAt(0) || 'ط'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-academic-gray truncate">
                      {profile?.student_id}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={signOut}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b shadow-soft p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <h1 className="text-xl font-bold text-university-blue">
                  {menuItems.find(item => item.id === activeSection)?.name || 'بوابة الطالب'}
                </h1>
              </div>
              <RealTimeNotificationsOptimized />
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CompleteStudentPortal;