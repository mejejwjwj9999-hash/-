import React from "react";
import { Outlet } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
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
  Database,
  LogOut,
  Home,
  PieChart,
  FolderOpen,
  Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayoutNew: React.FC = () => {
  const menuItems = [
    { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
    { to: "/admin/analytics", label: "التحليلات المتقدمة", icon: PieChart },
    { to: "/admin/students", label: "إدارة الطلاب", icon: Users },
    { to: "/admin/courses", label: "إدارة المقررات", icon: BookOpen },
    { to: "/admin/schedules", label: "الجداول الدراسية", icon: Calendar },
    { to: "/admin/grades", label: "إدارة الدرجات", icon: GraduationCap },
    { to: "/admin/course-files", label: "ملفات المقررات", icon: FolderOpen },
    { to: "/admin/payments", label: "إدارة المدفوعات", icon: CreditCard },
    { to: "/admin/services", label: "طلبات الخدمات", icon: ClipboardList },
    { to: "/admin/documents", label: "إدارة الوثائق", icon: FileText },
    { to: "/admin/digital-library", label: "إدارة المكتبة الرقمية", icon: Library },
    { to: "/admin/news-events", label: "إدارة الأخبار والفعاليات", icon: Database },
    { to: "/admin/media-library", label: "إدارة المكتبة الإعلامية", icon: Database },
    { to: "/admin/media-center", label: "إدارة مركز الإعلام", icon: Database },
    { to: "/admin/notifications", label: "الإشعارات", icon: Bell },
    { to: "/admin/reports", label: "التقارير التفصيلية", icon: BarChart3 },
    { to: "/admin/roles", label: "الأدوار والصلاحيات", icon: Shield },
    { to: "/admin/database", label: "إدارة قاعدة البيانات", icon: Database },
    { to: "/admin/settings", label: "إعدادات النظام", icon: Settings },
  ];

  const AppSidebar = () => {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    return (
      <Sidebar className={cn(collapsed ? "w-16" : "w-80")} collapsible="icon" side="right">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary to-primary/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-background rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            {!collapsed && (
              <div className="text-primary-foreground">
                <h1 className="text-lg font-bold">لوحة التحكم</h1>
                <p className="text-xs opacity-90">كلية ايلول الجامعية</p>
              </div>
            )}
          </div>
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-md" 
                              : "text-muted-foreground"
                          )
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <NavLink to="/student-portal">
              <Home className="h-4 w-4 ml-2" />
              {!collapsed && "بوابة الطالب"}
            </NavLink>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-destructive">
            <NavLink to="/auth">
              <LogOut className="h-4 w-4 ml-2" />
              {!collapsed && "تسجيل الخروج"}
            </NavLink>
          </Button>
        </div>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30" dir="rtl">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6 shrink-0">
            <SidebarTrigger className="ml-auto" />
            <div className="flex items-center gap-3 mr-4">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-primary">لوحة التحكم الإدارية</h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayoutNew;