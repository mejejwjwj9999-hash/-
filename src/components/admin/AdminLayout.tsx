import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  FileText, 
  Bell, 
  Settings, 
  Shield,
  GraduationCap,
  ClipboardList,
  BarChart3,
  UserCog,
  Menu,
  Database,
  LogOut,
  Home,
  TrendingUp,
  PieChart,
  Library,
  MessageSquare,
  Layout
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
    { to: "/admin/programs", label: "إدارة البرامج الأكاديمية", icon: GraduationCap },
    { to: "/admin/quick-services", label: "إدارة الخدمات السريعة", icon: ClipboardList },
    { to: "/admin/analytics", label: "التحليلات المتقدمة", icon: PieChart },
    { to: "/admin/students", label: "إدارة الطلاب", icon: Users },
    { to: "/admin/courses", label: "إدارة المقررات", icon: BookOpen },
    { to: "/admin/assignments", label: "إدارة الواجبات", icon: ClipboardList },
    { to: "/admin/schedules", label: "الجداول الدراسية", icon: Calendar },
    { to: "/admin/grades", label: "إدارة الدرجات", icon: GraduationCap },
    { to: "/admin/payments", label: "إدارة المدفوعات", icon: CreditCard },
    { to: "/admin/registration-requests", label: "إدارة الطلبات والاستفسارات", icon: MessageSquare },
    { to: "/admin/services", label: "طلبات الخدمات", icon: ClipboardList },
    { to: "/admin/documents", label: "إدارة الوثائق", icon: FileText },
    { to: "/admin/news-events", label: "إدارة الأخبار والفعاليات", icon: TrendingUp },
    { to: "/admin/hero-section", label: "إدارة القسم الرئيسي", icon: Layout },
    { to: "/admin/digital-library", label: "إدارة المكتبة الرقمية", icon: Library },
    { to: "/admin/media-library", label: "إدارة المكتبة الإعلامية", icon: FileText },
    { to: "/admin/media-center", label: "إدارة مركز الإعلام", icon: FileText },
    { to: "/admin/content-editor", label: "محرر المحتوى WYSIWYG", icon: FileText },
    { to: "/admin/notifications", label: "الإشعارات", icon: Bell },
    { to: "/admin/reports", label: "التقارير التفصيلية", icon: BarChart3 },
    { to: "/admin/roles", label: "الأدوار والصلاحيات", icon: Shield },
    { to: "/admin/database", label: "إدارة قاعدة البيانات", icon: Database },
    { to: "/admin/settings", label: "إعدادات النظام", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-university-blue to-university-blue-light">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6 text-university-blue" />
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold">لوحة التحكم</h1>
            <p className="text-xs opacity-90">كلية ايلول الجامعية</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-university-blue/10 hover:text-university-blue",
                isActive 
                  ? "bg-university-blue text-white shadow-md" 
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button asChild variant="outline" className="w-full justify-start">
          <NavLink to="/student-portal">
            <Home className="h-4 w-4 ml-2" />
            بوابة الطالب
          </NavLink>
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start text-destructive">
          <NavLink to="/auth">
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </NavLink>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-80">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-university-blue rounded-md flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-university-blue">لوحة التحكم</h1>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 bg-white border-l shadow-lg">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:mr-80">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
