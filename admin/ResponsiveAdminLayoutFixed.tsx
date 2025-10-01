import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Bell, 
  FileText, 
  BarChart3, 
  Database, 
  Settings,
  UserCheck,
  ClipboardList,
  MessageSquare,
  Wrench,
  CheckCircle
} from 'lucide-react';

interface ResponsiveAdminLayoutFixedProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const ResponsiveAdminLayoutFixed: React.FC<ResponsiveAdminLayoutFixedProps> = ({
  children,
  currentSection,
  onSectionChange,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: Home },
    { id: 'students', label: 'إدارة الطلاب', icon: Users },
    { id: 'appointments', label: 'المواعيد', icon: UserCheck },
    { id: 'courses', label: 'المواد الدراسية', icon: BookOpen },
    { id: 'grades', label: 'الدرجات', icon: GraduationCap },
    { id: 'schedules', label: 'الجداول الدراسية', icon: Calendar },
    { id: 'payments', label: 'المدفوعات', icon: CreditCard },
    { id: 'services', label: 'إدارة الخدمات', icon: Wrench },
    { id: 'student-requests', label: 'الطلبات الطلابية', icon: MessageSquare },
    { id: 'content-editor', label: 'محرر المحتوى WYSIWYG', icon: ClipboardList },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'documents', label: 'الوثائق', icon: FileText },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
    { id: 'database', label: 'قاعدة البيانات', icon: Database },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const getCurrentItemLabel = () => {
    const currentItem = menuItems.find(item => item.id === currentSection);
    return currentItem ? currentItem.label : 'لوحة التحكم';
  };

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-bg to-admin-sidebar/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-admin-header to-admin-accent shadow-lg border-b sticky top-0 z-40 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white/80 hover:text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                <span className="text-lg font-bold text-white">إ</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white drop-shadow-sm">كلية ايلول الجامعية</h1>
                <p className="text-xs text-white/80 font-medium">لوحة التحكم الإدارية</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/90 flex items-center gap-2 font-medium">
            <span>{getCurrentItemLabel()}</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-admin-sidebar to-admin-bg shadow-lg border-l min-h-[calc(100vh-64px)] fixed right-0 top-16 z-30">
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentSection === item.id ? 'secondary' : 'ghost'}
                    className={`w-full justify-start gap-3 h-11 transition-all duration-300 ${
                      currentSection === item.id 
                        ? 'bg-gradient-to-r from-admin-header/15 to-admin-accent/10 text-admin-header border border-admin-header/20 shadow-md font-medium' 
                        : 'hover:bg-gradient-to-r hover:from-admin-header/5 hover:to-admin-accent/5 hover:text-admin-header text-aylol-muted'
                    }`}
                    onClick={() => handleSectionChange(item.id)}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-300 ${
                      currentSection === item.id ? 'text-admin-header scale-110' : 'text-aylol-muted'
                    }`} />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-admin-header/10 bg-gradient-to-r from-admin-header/5 to-admin-accent/5">
            <div className="text-center space-y-1">
              <div className="text-xs font-medium text-admin-header">نظام إدارة متطور</div>
              <div className="text-xs text-admin-accent">إصدار 3.0 - 2024</div>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-admin-sidebar to-admin-bg shadow-xl border-l border-admin-header/20">
              <div className="flex items-center justify-between p-4 border-b border-admin-header/10 bg-gradient-to-r from-admin-header/10 to-admin-accent/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-admin-header to-admin-accent flex items-center justify-center">
                    <span className="text-sm font-bold text-white">إ</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-admin-header">كلية ايلول</h2>
                    <p className="text-xs text-admin-accent">لوحة التحكم</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-admin-header hover:bg-admin-header/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentSection === item.id ? 'secondary' : 'ghost'}
                        className={`w-full justify-start gap-3 h-11 transition-all duration-300 ${
                          currentSection === item.id 
                            ? 'bg-gradient-to-r from-admin-header/15 to-admin-accent/10 text-admin-header border border-admin-header/20 shadow-md font-medium' 
                            : 'hover:bg-gradient-to-r hover:from-admin-header/5 hover:to-admin-accent/5 hover:text-admin-header text-aylol-muted'
                        }`}
                        onClick={() => handleSectionChange(item.id)}
                      >
                        <Icon className={`h-4 w-4 transition-all duration-300 ${
                          currentSection === item.id ? 'text-admin-header scale-110' : 'text-aylol-muted'
                        }`} />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </ScrollArea>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 lg:mr-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveAdminLayoutFixed;
