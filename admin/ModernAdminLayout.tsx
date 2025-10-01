import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ModernAdminSidebar } from './ModernAdminSidebar';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';

interface ModernAdminLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const menuGroups = [
  {
    id: 'overview',
    title: 'النظرة العامة',
    items: [
      { id: 'overview', label: 'لوحة التحكم الرئيسية' }
    ]
  },
  {
    id: 'users',
    title: 'إدارة المستخدمين',
    items: [
      { id: 'students', label: 'إدارة الطلاب' },
      { id: 'teachers', label: 'إدارة المعلمين' },
      { id: 'roles', label: 'إدارة الصلاحيات' }
    ]
  },
  {
    id: 'academic',
    title: 'الأنشطة الأكاديمية',
    items: [
      { id: 'courses', label: 'المواد الدراسية' },
      { id: 'programs', label: 'البرامج الأكاديمية' },
      { id: 'assignments', label: 'إدارة الواجبات' },
      { id: 'grades', label: 'الدرجات' },
      { id: 'schedules', label: 'الجداول الدراسية' },
      { id: 'course-files', label: 'ملفات المقررات' }
    ]
  },
  {
    id: 'requests',
    title: 'الطلبات والخدمات',
    items: [
      { id: 'registration-requests', label: 'طلبات التسجيل والاستفسارات' },
      { id: 'student-requests', label: 'الطلبات الطلابية' },
      { id: 'appointments', label: 'المواعيد' },
      { id: 'services', label: 'إدارة الخدمات' },
      { id: 'payments', label: 'المدفوعات' },
      { id: 'documents', label: 'الوثائق' }
    ]
  },
  {
    id: 'content',
    title: 'إدارة المحتوى',
    items: [
      { id: 'digital-library', label: 'المكتبة الرقمية' },
      { id: 'news-events', label: 'الأخبار والفعاليات' },
      { id: 'media-library', label: 'المكتبة الإعلامية' },
      { id: 'media-center', label: 'مركز الإعلام' },
      { id: 'content-editor', label: 'محرر المحتوى' },
      { id: 'notifications', label: 'الإشعارات' }
    ]
  },
  {
    id: 'system',
    title: 'النظام والإعدادات',
    items: [
      { id: 'reports', label: 'التقارير' },
      { id: 'database', label: 'قاعدة البيانات' },
      { id: 'settings', label: 'الإعدادات' }
    ]
  }
];

export function ModernAdminLayout({ children, currentSection, onSectionChange }: ModernAdminLayoutProps) {
  const { user } = useAuth();

  const getCurrentSectionLabel = () => {
    for (const group of menuGroups) {
      const item = group.items.find(item => item.id === currentSection);
      if (item) return item.label;
    }
    return 'لوحة التحكم';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-admin-bg via-admin-bg to-admin-sidebar/30" dir="rtl">
        <ModernAdminSidebar 
          currentSection={currentSection} 
          onSectionChange={onSectionChange} 
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-gradient-to-r from-admin-header to-admin-accent backdrop-blur-lg supports-[backdrop-filter]:bg-admin-header/90 shrink-0">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-lg font-bold text-white">إ</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white drop-shadow-sm">{getCurrentSectionLabel()}</h1>
                    <p className="text-xs text-white/80 font-medium">
                      {new Date().toLocaleDateString('ar-EG', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white/80 hover:text-white hover:bg-white/10 border border-white/20">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative text-white/80 hover:text-white hover:bg-white/10 border border-white/20">
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-admin-accent rounded-full animate-pulse"></div>
                </Button>
                <SidebarTrigger className="text-white/80 hover:text-white hover:bg-white/10 border border-white/20" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-sm bg-gradient-to-br from-admin-accent to-admin-accent/80 text-white font-bold">
                      {user?.email?.[0]?.toUpperCase() || 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-white">المشرف الإداري</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6 px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}