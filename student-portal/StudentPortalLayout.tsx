
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  X, 
  Home, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  FileText, 
  UserCheck, 
  Bell,
  ClipboardList,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface StudentPortalLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StudentPortalLayout: React.FC<StudentPortalLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'grades', label: 'الدرجات', icon: GraduationCap },
    { id: 'schedule', label: 'الجدول الدراسي', icon: Calendar },
    { id: 'payments', label: 'المالية', icon: CreditCard },
    { id: 'documents', label: 'الوثائق', icon: FileText },
    { id: 'services', label: 'الخدمات الطلابية', icon: ClipboardList },
    { id: 'appointments', label: 'المواعيد', icon: UserCheck },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-primary">بوابة الطالب</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-sm text-muted-foreground">
              {navigationItems.find(item => item.id === activeTab)?.label}
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline mr-2">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-sm shadow-sm border-r min-h-[calc(100vh-64px)]">
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3 h-11 transition-all duration-200"
                    onClick={() => handleTabChange(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl border-l">
              <div className="flex items-center justify-between p-4 border-b bg-primary/5">
                <h2 className="text-lg font-bold text-primary">بوابة الطالب</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <nav className="space-y-3">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? 'default' : 'ghost'}
                        className="w-full justify-start gap-3 h-12 text-base"
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="ghost" 
                    onClick={signOut} 
                    className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    تسجيل الخروج
                  </Button>
                </div>
              </ScrollArea>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t shadow-lg z-30">
        <div className="flex">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex-1 flex-col gap-1 h-16 rounded-none ${
                  activeTab === item.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentPortalLayout;
