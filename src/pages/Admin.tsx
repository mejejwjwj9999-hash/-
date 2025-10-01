
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import Overview from "@/components/admin/Overview";
import Settings from "@/components/admin/Settings";
import Roles from "@/components/admin/Roles";
import StudentsManagement from "@/components/admin/StudentsManagement";
import CoursesManagement from "@/components/admin/CoursesManagement";
import PaymentsManagement from "@/components/admin/PaymentsManagement";
import NotificationsManagement from "@/components/admin/NotificationsManagement";
import SchedulesManagement from "@/components/admin/SchedulesManagement";
import GradesManagement from "@/components/admin/grades/GradesManagement";
import ServicesManagement from "@/components/admin/ServicesManagement";
import { ProgramsManagement } from "@/components/admin/ProgramsManagement";
import QuickServicesManagement from "@/components/admin/QuickServicesManagement";
import DocumentsManagement from "@/components/admin/DocumentsManagement";
import ReportsManagement from "@/components/admin/ReportsManagement";
import DatabaseManagement from "@/components/admin/DatabaseManagement";
import { NewsEventsManagement } from "@/components/admin/NewsEventsManagement";
import { MediaLibraryManagement } from "@/components/admin/MediaLibraryManagement";
import { MediaCenterManagement } from "@/components/admin/MediaCenterManagement";
import { AdvancedContentManagement } from "@/components/admin/AdvancedContentManagement";
import HeroSectionAdmin from "@/components/admin/HeroSectionAdmin";

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: checking } = useIsAdmin(user?.id);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Overview />} />
        <Route path="students" element={<StudentsManagement />} />
        <Route path="courses" element={<CoursesManagement />} />
        <Route path="schedules" element={<SchedulesManagement />} />
        <Route path="grades" element={<GradesManagement />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="programs" element={<ProgramsManagement />} />
        <Route path="quick-services" element={<QuickServicesManagement />} />
        <Route path="documents" element={<DocumentsManagement />} />
        <Route path="news-events" element={<NewsEventsManagement />} />
        <Route path="hero-section" element={<HeroSectionAdmin />} />
        <Route path="media-library" element={<MediaLibraryManagement />} />
        <Route path="media-center" element={<MediaCenterManagement />} />
        <Route path="content-editor" element={<AdvancedContentManagement />} />
        <Route path="notifications" element={<NotificationsManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="roles" element={<Roles />} />
        <Route path="database" element={<DatabaseManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default Admin;
