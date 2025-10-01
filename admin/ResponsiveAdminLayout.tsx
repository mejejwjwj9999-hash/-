
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  Users, 
  BookOpen, 
  DollarSign, 
  Bell, 
  Settings, 
  LogOut,
  GraduationCap,
  Calendar,
  FileText,
  BarChart3,
  Database,
  X,
  ClipboardList
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ResponsiveAdminLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const ResponsiveAdminLayout: React.FC<ResponsiveAdminLayoutProps> = ({
  children,
  currentSection,
  onSectionChange,
}) => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { 
      id: 'overview', 
      label: 'نظرة عامة', 
      icon: Home,
      description: 'الإحصائيات والتقارير'
    },
    { 
      id: 'students', 
      label: 'إدارة الطلاب', 
      icon: Users,
      description: 'إضافة وتعديل الطلاب'
    },
    { 
      id: 'courses', 
      label: 'إدارة المقررات', 
      icon: BookOpen,
      description: 'المقررات والمناهج'
    },
    { 
      id: 'grades', 
      label: 'إدارة الدرجات', 
      icon: GraduationCap,
      description: 'درجات الطلاب والتقييم'
    },
    { 
      id: 'schedules', 
      label: 'الجداول الدراسية', 
      icon: Calendar,
      description: 'جداول المحاضرات'
    },
    { 
      id: 'payments', 
      label: 'إدارة المدفوعات', 
      icon: DollarSign,
      description: 'المدفوعات والرسوم',
      badge: 'جديد'
    },
    { 
      id: 'news-events', 
      label: 'إدارة الأخبار والفعاليات', 
      icon: Bell,
      description: 'إدارة الأخبار والفعاليات'
    },
    { 
      id: 'media-library', 
      label: 'إدارة المكتبة الإعلامية', 
      icon: FileText,
      description: 'إدارة المكتبة الإعلامية'
    },
    { 
      id: 'media-center', 
      label: 'إدارة مركز الإعلام', 
      icon: FileText,
      description: 'إدارة مركز الإعلام'
    },
    { 
      id: 'content-editor', 
      label: 'محرر المحتوى WYSIWYG', 
      icon: ClipboardList,
      description: 'إدارة وتحرير المحتوى'
    },
    { 
      id: 'notifications', 
      label: 'إدارة الإشعارات', 
      icon: Bell,
      description: 'إرسال وإدارة الإشعارات'
    },
    { 
      id: 'documents', 
      label: 'إدارة الوثائق', 
      icon: FileText,
      description: 'الوثائق والشهادات'
    },
    { 
      id: 'reports', 
      label: 'التقارير', 
      icon: BarChart3,
      description: 'التقارير والإحصائيات'
    },
    { 
      id: 'database', 
      label: 'إدارة قاعدة البيانات', 
      icon: Database,
      description: 'إعدادات قاعدة البيانات'
    },
    { 
      id: 'settings', 
      label: 'الإعدادات', 
      icon: Settings,
      description: 'إعدادات النظام'
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-primary">لوحة الإدارة</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">كلية أيلول الجامعة</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 ${
                isActive ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => {
                onSectionChange(item.id);
                setSidebarOpen(false);
              }}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs opacity-80 mt-1 truncate">
                    {item.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-muted/50">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">مدير النظام</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col bg-white border-r shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
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
          <div className="md:hidden bg-white border-b p-4 pl-16">
            <h1 className="font-bold text-lg">لوحة الإدارة</h1>
            <p className="text-sm text-muted-foreground">
              {menuItems.find(item => item.id === currentSection)?.label || 'لوحة التحكم'}
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

export default ResponsiveAdminLayout;
