import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  FileText, 
  Settings, 
  Bell, 
  LogOut, 
  Menu,
  BookOpen,
  X,
  User,
  UserCheck,
  ClipboardList
} from 'lucide-react';

interface OptimizedStudentPortalLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const OptimizedStudentPortalLayout: React.FC<OptimizedStudentPortalLayoutProps> = ({
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
      description: 'لوحة التحكم الرئيسية'
    },
    {
      id: 'grades',
      label: 'الدرجات',
      icon: GraduationCap,
      description: 'عرض درجاتك وتقييماتك'
    },
    {
      id: 'schedule',
      label: 'الجدول الدراسي',
      icon: Calendar,
      description: 'جداول المحاضرات والمواعيد'
    },
    {
      id: 'courses',
      label: 'المقررات',
      icon: BookOpen,
      description: 'المقررات المسجلة'
    },
    {
      id: 'payments',
      label: 'المدفوعات',
      icon: CreditCard,
      description: 'الرسوم والمدفوعات'
    },
    {
      id: 'documents',
      label: 'الوثائق',
      icon: FileText,
      description: 'الشهادات والوثائق الرسمية'
    },
    {
      id: 'services',
      label: 'الخدمات الطلابية',
      icon: ClipboardList,
      description: 'الخدمات والطلبات المتاحة'
    },
    {
      id: 'appointments',
      label: 'المواعيد',
      icon: UserCheck,
      description: 'حجز المواعيد والاستشارات'
    },
    {
      id: 'notifications',
      label: 'الإشعارات',
      icon: Bell,
      description: 'رسائل النظام والتحديثات'
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-l from-university-blue/10 to-university-blue/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-university-blue rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-university-blue">البوابة الطلابية</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden hover:bg-university-blue/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">كلية أيلول الجامعة</p>
      </div>

      {/* Student Info */}
      {profile && (
        <div className="p-4 border-b bg-white/80">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-university-blue to-university-blue-light rounded-full flex items-center justify-center text-white font-bold text-lg shadow-medium">
              {profile.first_name?.charAt(0) || 'ط'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-foreground">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {profile.student_id || 'غير محدد'}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs bg-university-blue/10 text-university-blue border-university-blue/20">
                  السنة {profile.academic_year || '1'}
                </Badge>
                <Badge variant="outline" className="text-xs bg-university-gold/10 text-university-blue border-university-gold/30">
                  الفصل {profile.semester || '1'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-auto p-3 text-right transition-all duration-200 ${
                  isActive 
                    ? 'bg-university-blue text-white shadow-soft hover:bg-university-blue/90' 
                    : 'hover:bg-university-blue/10 hover:text-university-blue text-foreground'
                }`}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="text-right flex-1 min-w-0">
                    <div className="font-medium truncate text-sm">
                      {item.label}
                    </div>
                    <p className="text-xs opacity-75 mt-0.5 truncate text-right hidden lg:block">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50/50">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col bg-white border-l shadow-soft">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="lg:hidden fixed top-4 right-4 z-50 shadow-medium bg-university-blue hover:bg-university-blue-light"
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
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white/95 backdrop-blur-sm border-b p-4 pr-16 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-lg text-university-blue">البوابة الطلابية</h1>
                <p className="text-sm text-muted-foreground">
                  {navigationItems.find(item => item.id === activeTab)?.label || 'الرئيسية'}
                </p>
              </div>
              {profile && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-university-blue/10 text-university-blue">
                    السنة {profile.academic_year}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 min-h-full">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t shadow-large z-30">
        <div className="flex">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex-1 flex-col gap-1 h-16 rounded-none ${
                  isActive 
                    ? 'text-university-blue bg-university-blue/10' 
                    : 'text-muted-foreground hover:text-university-blue hover:bg-university-blue/5'
                }`}
                onClick={() => onTabChange(item.id)}
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

export default OptimizedStudentPortalLayout;