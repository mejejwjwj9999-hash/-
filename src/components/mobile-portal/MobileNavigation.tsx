
import React from 'react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Bell, 
  Settings,
  GraduationCap,
  FileText,
  ListTodo
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications?: number;
}

const MobileNavigation = ({ activeTab, onTabChange, unreadNotifications = 0 }: MobileNavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'courses', label: 'المقررات', icon: BookOpen },
    { id: 'assignments', label: 'الواجبات', icon: FileText },
    { id: 'schedule', label: 'الجدول', icon: Calendar },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: unreadNotifications }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-1 z-50 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center px-2 py-1 min-w-0 flex-1 text-xs transition-all duration-200 ${
                isActive
                  ? 'text-university-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative mb-1">
                <Icon className={`h-5 w-5 ${isActive ? 'text-university-blue' : ''}`} />
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center rounded-full"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={`font-medium ${isActive ? 'text-university-blue' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-university-blue rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
