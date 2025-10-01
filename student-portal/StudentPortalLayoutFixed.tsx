
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings, 
  Bell, 
  LogOut, 
  Menu,
  BookOpen,
  X
} from 'lucide-react';

interface StudentPortalLayoutFixedProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StudentPortalLayoutFixed: React.FC<StudentPortalLayoutFixedProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'الرئيسية',
      icon: Home,
      description: 'نظرة عامة على حسابك'
    },
    {
      id: 'grades',
      label: 'الدرجات',
      icon: GraduationCap,
      description: 'درجاتك وتقييماتك'
    },
    {
      id: 'schedule',
      label: 'الجدول الدراسي',
      icon: Calendar,
      description: 'جداول المحاضرات'
    },
    {
      id: 'courses',
      label: 'المقررات',
      icon: BookOpen,
      description: 'المقررات المتاحة',
      badge: 'جديد'
    },
    {
      id: 'payments',
      label: 'المدفوعات',
      icon: DollarSign,
      description: 'الرسوم والمدفوعات'
    },
    {
      id: 'documents',
      label: 'الوثائق',
      icon: FileText,
      description: 'الشهادات والوثائق'
    },
    {
      id: 'services',
      label: 'الخدمات الطلابية',
      icon: Settings,
      description: 'الخدمات والطلبات'
    },
    {
      id: 'appointments',
      label: 'المواعيد',
      icon: Calendar,
      description: 'مواعيدك وحجوزاتك'
    },
    {
      id: 'notifications',
      label: 'الإشعارات',
      icon: Bell,
      description: 'رسائل النظام'
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-primary">البوابة الطلابية</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden hover:bg-primary/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">كلية أيلول الجامعة</p>
      </div>

      {/* Student Info */}
      {profile && (
        <div className="p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-medium">
              {profile.first_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                رقم الطالب: {profile.student_id}
              </p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  السنة {profile.academic_year}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  الفصل {profile.semester}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-4 text-right transition-all duration-200 hover:scale-105 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-primary/10 hover:text-primary'
              }`}
              onClick={() => {
                onTabChange(item.id);
                setSidebarOpen(false);
              }}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-right flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs px-2 py-0 bg-green-100 text-green-800">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs opacity-80 mt-1 truncate text-right">
                    {item.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t mt-auto bg-gray-50">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col bg-white border-r shadow-lg">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="md:hidden fixed top-4 right-4 z-50 shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b p-4 pr-16 shadow-sm">
            <h1 className="font-bold text-lg text-gray-900">البوابة الطلابية</h1>
            <p className="text-sm text-muted-foreground">
              {navigationItems.find(item => item.id === activeTab)?.label || 'الرئيسية'}
            </p>
          </div>
          
          {/* Content */}
          <div className="min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPortalLayoutFixed;
