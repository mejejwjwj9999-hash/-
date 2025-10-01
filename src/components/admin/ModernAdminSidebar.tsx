import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Home, Users, Calendar, BookOpen, GraduationCap, CreditCard, Bell, FileText, BarChart3, Database, Settings, UserCheck, ClipboardList, MessageSquare, Wrench, FolderOpen, Library, Layout, Palette, Zap } from 'lucide-react';
interface ModernAdminSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}
const menuGroups = [{
  id: 'overview',
  title: 'النظرة العامة',
  items: [{
    id: 'overview',
    label: 'لوحة التحكم الرئيسية',
    icon: Home
  }]
}, {
  id: 'users',
  title: 'إدارة المستخدمين',
  items: [{
    id: 'students',
    label: 'إدارة الطلاب',
    icon: Users,
    status: 'enhanced'
  }, {
    id: 'teachers',
    label: 'إدارة المعلمين',
    icon: GraduationCap,
    status: 'new'
  }, {
    id: 'roles',
    label: 'إدارة الصلاحيات',
    icon: UserCheck,
    status: 'new'
  }]
}, {
  id: 'student-affairs',
  title: 'شؤون الطلاب',
  items: [{
    id: 'student-affairs',
    label: 'لوحة شؤون الطلاب الرئيسية',
    icon: Users,
    status: 'enhanced'
  }]
}, {
  id: 'academic',
  title: 'الأنشطة الأكاديمية',
  items: [{
    id: 'courses',
    label: 'المواد الدراسية',
    icon: BookOpen,
    status: 'enhanced'
  }, {
    id: 'programs',
    label: 'البرامج الأكاديمية',
    icon: GraduationCap,
    status: 'enhanced'
  }, {
    id: 'assignments',
    label: 'إدارة الواجبات',
    icon: ClipboardList,
    status: 'new'
  }, {
    id: 'grades',
    label: 'الدرجات',
    icon: GraduationCap
  }, {
    id: 'schedules',
    label: 'الجداول الدراسية',
    icon: Calendar,
    status: 'enhanced'
  }, {
    id: 'course-files',
    label: 'ملفات المقررات',
    icon: FolderOpen,
    status: 'new'
  }]
}, {
  id: 'requests',
  title: 'الطلبات والخدمات',
  items: [{
    id: 'registration-requests',
    label: 'طلبات التسجيل والاستفسارات',
    icon: MessageSquare,
    status: 'new'
  }, {
    id: 'student-requests',
    label: 'الطلبات الطلابية',
    icon: MessageSquare
  }, {
    id: 'appointments',
    label: 'المواعيد',
    icon: UserCheck
  }, {
    id: 'services',
    label: 'إدارة الخدمات',
    icon: Wrench,
    status: 'enhanced'
  }, {
    id: 'quick-services',
    label: 'إدارة الخدمات السريعة',
    icon: Zap,
    status: 'enhanced'
  }, {
    id: 'payments',
    label: 'المدفوعات',
    icon: CreditCard,
    status: 'enhanced'
  }, {
    id: 'documents',
    label: 'الوثائق',
    icon: FileText
  }]
}, {
  id: 'system',
  title: 'النظام والإعدادات',
  items: [{
    id: 'reports',
    label: 'التقارير',
    icon: BarChart3
  }, {
    id: 'database',
    label: 'قاعدة البيانات',
    icon: Database
  }, {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings
  }]
}, {
  id: 'content',
  title: 'إدارة المحتوى والموقع',
  items: [{
    id: 'hero-section',
    label: 'إدارة القسم الرئيسي',
    icon: Layout,
    status: 'new'
  }, {
    id: 'digital-library',
    label: 'المكتبة الرقمية',
    icon: Library,
    status: 'new'
  }, {
    id: 'news-events',
    label: 'الأخبار والفعاليات',
    icon: Bell,
    status: 'new'
  }, {
    id: 'media-library',
    label: 'المكتبة الإعلامية',
    icon: FileText,
    status: 'new'
  }, {
    id: 'media-center',
    label: 'مركز الإعلام',
    icon: FileText,
    status: 'new'
  }, {
    id: 'content-editor',
    label: 'محرر المحتوى',
    icon: ClipboardList,
    status: 'new'
  }, {
    id: 'notifications',
    label: 'الإشعارات',
    icon: Bell
  }]
}, {
  id: 'design',
  title: 'التصميم والعرض',
  items: [{
    id: 'theme-customization',
    label: 'تخصيص المظهر',
    icon: Palette,
    status: 'new'
  }, {
    id: 'layout-management',
    label: 'إدارة التخطيط',
    icon: Layout,
    status: 'new'
  }]
}];
export function ModernAdminSidebar({
  currentSection,
  onSectionChange
}: ModernAdminSidebarProps) {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const isActive = (sectionId: string) => currentSection === sectionId;
  const StatusBadge = ({
    status
  }: {
    status?: string;
  }) => {
    if (!status) return null;
    if (status === 'new') {
      return <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />;
    }
    if (status === 'enhanced') {
      return <div className="h-2 w-2 bg-blue-500 rounded-full" />;
    }
    return null;
  };
  return <Sidebar className="sticky top-0 h-screen z-40 border-r border-border/40 bg-gradient-to-b from-admin-sidebar to-admin-bg/50 backdrop-blur-sm" collapsible="icon" side="left">
      {/* Header */}
      <div className="p-4 border-b border-border/40 bg-gradient-to-r from-admin-header/5 to-admin-accent/5">
        {!isCollapsed && <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-admin-header to-admin-accent flex items-center justify-center">
                <span className="text-sm font-bold text-white">إ</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-admin-header">
                  كلية ايلول الجامعية
                </h2>
                <p className="text-xs text-admin-accent font-medium">لوحة التحكم الإدارية</p>
              </div>
            </div>
          </div>}
      </div>

      <SidebarContent className="px-2">
        {menuGroups.map(group => <SidebarGroup key={group.id} className="py-2">
            {!isCollapsed && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-3 mb-2">
                {group.title}
              </SidebarGroupLabel>}
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map(item => {
              const Icon = item.icon;
              const active = isActive(item.id);
              return <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild className={`
                          h-10 px-3 rounded-lg transition-all duration-300 group relative overflow-hidden
                          ${active ? 'bg-gradient-to-r from-admin-header/15 to-admin-accent/10 text-admin-header border border-admin-header/20 shadow-md font-medium' : 'hover:bg-gradient-to-r hover:from-admin-header/5 hover:to-admin-accent/5 hover:text-admin-header text-aylol-muted'}
                        `}>
                        <div onClick={() => onSectionChange(item.id)} className="flex items-center gap-3 w-full cursor-pointer">
                          <Icon className={`h-4 w-4 transition-all duration-300 ${active ? 'text-admin-header scale-110' : 'text-aylol-muted group-hover:text-admin-header group-hover:scale-105'}`} />
                          {!isCollapsed && <>
                              <span className="flex-1 text-right text-sm font-medium">{item.label}</span>
                              <StatusBadge status={item.status} />
                            </>}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>;
            })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>)}
      </SidebarContent>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 bg-gradient-to-r from-admin-header/5 to-admin-accent/5">
        {!isCollapsed && <div className="text-center space-y-1">
            <div className="text-xs font-medium text-admin-header">نظام إدارة الموقع</div>
            <div className="text-xs text-admin-accent">برمجة م/محمد الارياني</div>
          </div>}
      </div>
    </Sidebar>;
}