import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Bell,
  BarChart3,
  UserCheck,
  ClipboardList,
  Database,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';

interface EnhancedAdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const EnhancedAdminLayout: React.FC<EnhancedAdminLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      icon: LayoutDashboard,
      description: 'إحصائيات وملخص النظام',
      category: 'main'
    },
    {
      id: 'students',
      label: 'إدارة الطلاب',
      icon: Users,
      description: 'إضافة وتعديل بيانات الطلاب',
      category: 'students'
    },
    {
      id: 'courses',
      label: 'إدارة المقررات',
      icon: GraduationCap,
      description: 'إدارة المقررات والمناهج',
      category: 'academic'
    },
    {
      id: 'schedules',
      label: 'الجداول الدراسية',
      icon: Calendar,
      description: 'إدارة جداول المحاضرات',
      category: 'academic'
    },
    {
      id: 'grades',
      label: 'إدارة الدرجات',
      icon: BarChart3,
      description: 'إدخال وتعديل الدرجات',
      category: 'academic'
    },
    {
      id: 'payments',
      label: 'إدارة المدفوعات',
      icon: CreditCard,
      description: 'متابعة الرسوم والمدفوعات',
      category: 'financial'
    },
    {
      id: 'documents',
      label: 'إدارة الوثائق',
      icon: FileText,
      description: 'إصدار الشهادات والوثائق',
      category: 'services'
    },
    {
      id: 'appointments',
      label: 'إدارة المواعيد',
      icon: UserCheck,
      description: 'إدارة مواعيد الطلاب',
      category: 'services'
    },
    {
      id: 'requests',
      label: 'طلبات الخدمات',
      icon: ClipboardList,
      description: 'متابعة طلبات الطلاب',
      category: 'services'
    },
    {
      id: 'notifications',
      label: 'إدارة الإشعارات',
      icon: Bell,
      description: 'إرسال الإشعارات للطلاب',
      category: 'communication'
    },
    {
      id: 'reports',
      label: 'التقارير',
      icon: BarChart3,
      description: 'تقارير وإحصائيات مفصلة',
      category: 'reports'
    },
    {
      id: 'database',
      label: 'إدارة قاعدة البيانات',
      icon: Database,
      description: 'عمليات قاعدة البيانات',
      category: 'system'
    },
    {
      id: 'settings',
      label: 'إعدادات النظام',
      icon: Settings,
      description: 'إعدادات عامة للنظام',
      category: 'system'
    }
  ];

  const categories = {
    main: { label: 'الرئيسية', color: 'text-university-blue' },
    students: { label: 'شؤون الطلاب', color: 'text-green-600' },
    academic: { label: 'الشؤون الأكاديمية', color: 'text-purple-600' },
    financial: { label: 'الشؤون المالية', color: 'text-orange-600' },
    services: { label: 'الخدمات', color: 'text-blue-600' },
    communication: { label: 'التواصل', color: 'text-pink-600' },
    reports: { label: 'التقارير', color: 'text-indigo-600' },
    system: { label: 'النظام', color: 'text-gray-600' }
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-l from-university-blue/10 to-university-blue/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-university-blue rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-university-blue">لوحة الإدارة</h2>
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
        <p className="text-xs text-muted-foreground">نظام إدارة كلية أيلول</p>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b bg-white/80">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-university-blue to-university-blue-light rounded-full flex items-center justify-center text-white font-bold text-lg shadow-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate text-foreground">
              المدير العام
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
            <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200 mt-1">
              مدير النظام
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-4">
          {Object.entries(groupedItems).map(([categoryKey, items]) => {
            const category = categories[categoryKey as keyof typeof categories];
            return (
              <div key={categoryKey}>
                <div className="px-3 py-2">
                  <h3 className={`text-xs font-semibold uppercase tracking-wider ${category.color}`}>
                    {category.label}
                  </h3>
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
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
                </div>
              </div>
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
                <h1 className="font-bold text-lg text-university-blue">لوحة الإدارة</h1>
                <p className="text-sm text-muted-foreground">
                  {navigationItems.find(item => item.id === activeTab)?.label || 'نظرة عامة'}
                </p>
              </div>
              <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                مدير
              </Badge>
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
    </div>
  );
};

export default EnhancedAdminLayout;