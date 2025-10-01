import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar, 
  GraduationCap, 
  Grid3X3,
  Settings,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText
} from 'lucide-react';

interface TeacherMobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications?: number;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'الرئيسية',
    icon: Home,
    description: 'لوحة التحكم'
  },
  {
    id: 'courses',
    label: 'المقررات',
    icon: BookOpen,
    description: 'إدارة المقررات'
  },
  {
    id: 'attendance',
    label: 'الحضور',
    icon: ClipboardCheck,
    description: 'تسجيل الحضور'
  },
  {
    id: 'grades',
    label: 'الدرجات',
    icon: GraduationCap,
    description: 'إدارة الدرجات'
  },
  {
    id: 'schedule',
    label: 'الجدول',
    icon: Calendar,
    description: 'الجدول الدراسي'
  }
];

const TeacherMobileNavigation: React.FC<TeacherMobileNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadNotifications = 0
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-large z-40" dir="rtl">
      <div className="flex">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex-1 flex-col gap-1 h-16 rounded-none border-0 relative transition-all duration-200 ${
                isActive 
                  ? 'text-university-blue bg-university-blue/10 border-t-2 border-university-blue' 
                  : 'text-muted-foreground hover:text-university-blue hover:bg-university-blue/5'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Badge للإشعارات على أيقونة معينة إذا لزم الأمر */}
              {item.id === 'dashboard' && unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherMobileNavigation;