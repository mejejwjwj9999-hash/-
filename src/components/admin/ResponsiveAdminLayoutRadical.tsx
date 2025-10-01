import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Menu, X, Home, Users, Calendar, BookOpen, GraduationCap, CreditCard, Bell, FileText, BarChart3, Database, Settings, UserCheck, ClipboardList, MessageSquare, Wrench, CheckCircle, FolderOpen, Library, ChevronDown, ChevronRight } from 'lucide-react';
interface ResponsiveAdminLayoutRadicalProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}
const ResponsiveAdminLayoutRadical: React.FC<ResponsiveAdminLayoutRadicalProps> = ({
  children,
  currentSection,
  onSectionChange
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    overview: true,
    users: true,
    academic: true,
    requests: true,
    content: true,
    system: true
  });

  const menuGroups = [
    {
      id: 'overview',
      title: 'النظرة العامة',
      items: [
        { id: 'overview', label: 'لوحة التحكم الرئيسية', icon: Home }
      ]
    },
    {
      id: 'users',
      title: 'إدارة المستخدمين',
      items: [
        { id: 'students', label: 'إدارة الطلاب', icon: Users, status: 'enhanced' },
        { id: 'teachers', label: 'إدارة المعلمين', icon: GraduationCap, status: 'new' },
        { id: 'roles', label: 'إدارة الصلاحيات', icon: UserCheck, status: 'new' }
      ]
    },
    {
      id: 'academic',
      title: 'الأنشطة الأكاديمية',
      items: [
        { id: 'courses', label: 'المواد الدراسية', icon: BookOpen, status: 'enhanced' },
        { id: 'assignments', label: 'إدارة الواجبات', icon: ClipboardList, status: 'new' },
        { id: 'grades', label: 'الدرجات', icon: GraduationCap },
        { id: 'schedules', label: 'الجداول الدراسية', icon: Calendar, status: 'enhanced' },
        { id: 'course-files', label: 'ملفات المقررات', icon: FolderOpen, status: 'new' }
      ]
    },
    {
      id: 'requests',
      title: 'الطلبات والخدمات',
      items: [
        { id: 'registration-requests', label: 'طلبات التسجيل والاستفسارات', icon: MessageSquare, status: 'new' },
        { id: 'student-requests', label: 'الطلبات الطلابية', icon: MessageSquare },
        { id: 'appointments', label: 'المواعيد', icon: UserCheck },
        { id: 'services', label: 'إدارة الخدمات', icon: Wrench, status: 'enhanced' },
        { id: 'payments', label: 'المدفوعات', icon: CreditCard, status: 'enhanced' },
        { id: 'documents', label: 'الوثائق', icon: FileText }
      ]
    },
    {
      id: 'content',
      title: 'إدارة المحتوى',
      items: [
        { id: 'digital-library', label: 'المكتبة الرقمية', icon: Library, status: 'new' },
        { id: 'news-events', label: 'الأخبار والفعاليات', icon: Bell, status: 'new' },
        { id: 'media-library', label: 'المكتبة الإعلامية', icon: FileText, status: 'new' },
        { id: 'media-center', label: 'مركز الإعلام', icon: FileText, status: 'new' },
        { id: 'content-editor', label: 'محرر المحتوى', icon: ClipboardList, status: 'new' },
        { id: 'notifications', label: 'الإشعارات', icon: Bell }
      ]
    },
    {
      id: 'system',
      title: 'النظام والإعدادات',
      items: [
        { id: 'reports', label: 'التقارير', icon: BarChart3 },
        { id: 'database', label: 'قاعدة البيانات', icon: Database },
        { id: 'settings', label: 'الإعدادات', icon: Settings }
      ]
    }
  ];

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getCurrentItemLabel = () => {
    for (const group of menuGroups) {
      const item = group.items.find(item => item.id === currentSection);
      if (item) return item.label;
    }
    return 'لوحة التحكم';
  };
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setSidebarOpen(false);
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-primary">لوحة التحكم ببوابة الطالب</h1>
            
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{getCurrentItemLabel()}</span>
            {menuGroups.flatMap(g => g.items).find(item => item.id === currentSection)?.status === 'fixed' && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white shadow-sm border-r min-h-[calc(100vh-64px)]">
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-3">
              {menuGroups.map(group => (
                <Collapsible 
                  key={group.id} 
                  open={openGroups[group.id as keyof typeof openGroups]} 
                  onOpenChange={() => toggleGroup(group.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between text-sm font-medium text-muted-foreground hover:text-foreground h-8"
                    >
                      <span>{group.title}</span>
                      {openGroups[group.id as keyof typeof openGroups] ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {group.items.map(item => {
                      const Icon = item.icon;
                      return (
                        <Button 
                          key={item.id} 
                          variant={currentSection === item.id ? 'secondary' : 'ghost'} 
                          className="w-full justify-start gap-3 h-9 text-sm relative mr-4" 
                          onClick={() => handleSectionChange(item.id)}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                          {item.status === 'enhanced' && <CheckCircle className="h-3 w-3 text-blue-600 absolute left-2" />}
                          {item.status === 'new' && <div className="h-2 w-2 bg-green-500 rounded-full absolute left-2 animate-pulse" />}
                        </Button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">لوحة التحكم المنظمة</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <nav className="space-y-3">
                  {menuGroups.map(group => (
                    <Collapsible 
                      key={group.id} 
                      open={openGroups[group.id as keyof typeof openGroups]} 
                      onOpenChange={() => toggleGroup(group.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between text-sm font-medium text-muted-foreground hover:text-foreground h-8"
                        >
                          <span>{group.title}</span>
                          {openGroups[group.id as keyof typeof openGroups] ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 mt-1">
                        {group.items.map(item => {
                          const Icon = item.icon;
                          return (
                            <Button 
                              key={item.id} 
                              variant={currentSection === item.id ? 'secondary' : 'ghost'} 
                              className="w-full justify-start gap-3 h-9 text-sm relative mr-4" 
                              onClick={() => handleSectionChange(item.id)}
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                              {item.status === 'enhanced' && <CheckCircle className="h-3 w-3 text-blue-600 absolute left-2" />}
                              {item.status === 'new' && <div className="h-2 w-2 bg-green-500 rounded-full absolute left-2 animate-pulse" />}
                            </Button>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </nav>
              </ScrollArea>
            </aside>
          </div>}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>;
};
export default ResponsiveAdminLayoutRadical;