
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import ModernAdminDashboard from '@/components/admin/ModernAdminDashboard';
import StudentsManagementRadical from '@/components/admin/StudentsManagementRadical';
import AssignmentsManagement from '@/components/admin/AssignmentsManagement';
import AppointmentsManagement from '@/components/admin/AppointmentsManagement';
import NotificationsManagementFixed from '@/components/admin/NotificationsManagementFixed';
import PaymentsManagementRadical from '@/components/admin/PaymentsManagementRadical';
import CoursesManagement from '@/components/admin/CoursesManagement';
import GradesManagement from '@/components/admin/grades/GradesManagement';
import SchedulesManagementRadical from '@/components/admin/SchedulesManagementRadical';
import DocumentsManagement from '@/components/admin/DocumentsManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import DatabaseManagement from '@/components/admin/DatabaseManagement';
import { AdvancedContentManagement } from '@/components/admin/AdvancedContentManagement';
import Settings from '@/components/admin/Settings';
import ServicesManagement from '@/components/admin/ServicesManagement';
import StudentRequestsManagement from '@/components/admin/StudentRequestsManagement';
import CourseFilesManagement from '@/components/admin/CourseFilesManagement';
import EnhancedCourseFilesManagement from '@/components/admin/EnhancedCourseFilesManagement';
import TeachersManagement from '@/components/admin/TeachersManagement';
import Roles from '@/components/admin/Roles';
import RequestsManagement from '@/components/admin/RequestsManagement';
import { ProgramsManagement } from '@/components/admin/ProgramsManagement';
import ProgramsPage from '@/pages/admin/programs';

import { NewsEventsManagement } from '@/components/admin/NewsEventsManagement';
import { MediaLibraryManagement } from '@/components/admin/MediaLibraryManagement';
import { MediaCenterManagement } from '@/components/admin/MediaCenterManagement';
import DigitalLibraryManagement from '@/components/admin/DigitalLibraryManagement';
import StudentAffairsManagement from '@/components/admin/StudentAffairsManagement';
import { useIsAdminFixed } from '@/hooks/useIsAdminFixed';
import AdminStudentAffairs from '@/components/admin/AdminStudentAffairs';
import HeroSectionAdmin from '@/components/admin/HeroSectionAdmin';
import ThemeCustomization from '@/components/admin/ThemeCustomization';
import LayoutManagement from '@/components/admin/LayoutManagement';
import { AboutSectionsManagement } from '@/components/admin/AboutSectionsManagement';

const AdminRadical: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState('overview');

  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdminFixed(user?.id);

  // Sync URL with current section
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const section = pathSegments[2] || 'overview'; // /admin/[section]
    setCurrentSection(section);
  }, [location.pathname]);

  // Handle section change with URL navigation
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    navigate(`/admin/${section}`, { replace: true });
  };

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
        return <ModernAdminDashboard />;
      case 'students':
        return <StudentsManagementRadical />;
      case 'teachers':
        return <TeachersManagement />;
      case 'assignments':
        return <AssignmentsManagement />;
      case 'roles':
        return <Roles />;
      
      // Hero Section Management
      case 'hero-section':
        return <HeroSectionAdmin />;
      
      // Student Affairs Management
      case 'student-affairs':
        return <AdminStudentAffairs />;
      case 'student-enrollment':
      case 'student-records':
      case 'student-attendance':
      case 'student-behavior':
      case 'student-transfers':
      case 'student-scholarships':
      case 'student-counseling':
      case 'student-activities':
        return <StudentAffairsManagement />;
        
      case 'appointments':
        return <AppointmentsManagement />;
      case 'courses':
        return <CoursesManagement />;
      case 'grades':
        return <GradesManagement />;
      case 'schedules':
        return <SchedulesManagementRadical />;
      case 'payments':
        return <PaymentsManagementRadical />;
      case 'notifications':
        return <NotificationsManagementFixed />;
      case 'documents':
        return <DocumentsManagement />;
      case 'course-files':
        return <EnhancedCourseFilesManagement />;
      case 'news-events':
        return <NewsEventsManagement />;
      case 'digital-library':
        return <DigitalLibraryManagement />;
      case 'media-library':
        return <MediaLibraryManagement />;
      case 'media-center':
        return <MediaCenterManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'programs':
        return <ProgramsPage />;
      case 'about-sections':
        return <AboutSectionsManagement />;
      case 'registration-requests':
        return <RequestsManagement />;
      case 'content-editor':
        return <AdvancedContentManagement />;
      case 'student-requests':
        return <StudentRequestsManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'database':
        return <DatabaseManagement />;
      case 'settings':
        return <Settings />;
      
      // Design and Layout Management
      case 'theme-customization':
        return <ThemeCustomization />;
      case 'layout-management':
        return <LayoutManagement />;
      
      default:
        return <ModernAdminDashboard />;
    }
  };

  return (
    <ModernAdminLayout
      currentSection={currentSection}
      onSectionChange={handleSectionChange}
    >
      {renderContent()}
    </ModernAdminLayout>
  );
};

export default AdminRadical;
