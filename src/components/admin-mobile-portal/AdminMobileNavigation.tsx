import React from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  DollarSign, 
  Bell, 
  Settings,
  Calendar,
  GraduationCap,
  FileBarChart,
  Library
} from 'lucide-react';

interface AdminMobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminMobileNavigation = ({ activeTab, onTabChange }: AdminMobileNavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: BarChart3 },
    { id: 'students', label: 'الطلاب', icon: Users },
    { id: 'teachers', label: 'المعلمين', icon: Users },
    { id: 'courses', label: 'المقررات', icon: BookOpen },
    { id: 'digital-library', label: 'المكتبة الرقمية', icon: Library },
    { id: 'enrollment', label: 'التسجيل', icon: GraduationCap },
    { id: 'payments', label: 'المدفوعات', icon: DollarSign },
    { id: 'schedules', label: 'الجداول', icon: Calendar },
    { id: 'grades', label: 'الدرجات', icon: GraduationCap },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'reports', label: 'التقارير', icon: FileBarChart },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ];

  // Show most important items in bottom navigation for mobile
  const bottomNavItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: BarChart3 },
    { id: 'students', label: 'الطلاب', icon: Users },
    { id: 'courses', label: 'المقررات', icon: BookOpen },
    { id: 'payments', label: 'المدفوعات', icon: DollarSign },
    { id: 'notifications', label: 'الإشعارات', icon: Bell }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-university-blue/20 px-1 py-1 z-50 shadow-large">
      <div className="flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center px-2 py-2 min-w-0 flex-1 text-xs transition-all duration-200 rounded-xl ${
                isActive
                  ? 'text-university-blue bg-university-blue/10'
                  : 'text-academic-gray hover:text-university-blue hover:bg-university-blue/5'
              }`}
            >
              <div className="relative mb-1">
                <Icon className={`h-5 w-5 ${isActive ? 'text-university-blue' : ''}`} />
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

export default AdminMobileNavigation;