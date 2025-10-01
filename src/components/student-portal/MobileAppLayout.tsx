
import React, { useState } from 'react';
import { Bell, Home, Book, FileText, User, Calendar, ClipboardList, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedDashboard from './EnhancedDashboard';
import EnhancedGradesSection from './EnhancedGradesSection';
import EnhancedScheduleSection from './EnhancedScheduleSection';
import EnhancedCoursesSection from './EnhancedCoursesSection';
import NotificationsSection from './NotificationsSection';
import MyServiceRequests from './MyServiceRequests';
import MobileDocuments from '../mobile-portal/MobileDocuments';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';

type OnTabChange = React.Dispatch<React.SetStateAction<string>> | ((tabId: string) => void);

interface MobileAppLayoutProps {
  activeTab?: string;
  onTabChange?: OnTabChange;
  children?: React.ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ activeTab: controlledActive, onTabChange, children }) => {
  const [internalActive, setInternalActive] = useState('home');
  const activeTab = controlledActive ?? internalActive;

  const { data: unreadCount = 0 } = useUnreadNotifications();

  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home, color: 'text-blue-500' },
    { id: 'requests', label: 'طلباتي', icon: ClipboardList, color: 'text-purple-500' },
    { id: 'documents', label: 'الوثائق', icon: FileCheck, color: 'text-indigo-500' },
    { id: 'grades', label: 'الدرجات', icon: FileText, color: 'text-green-500' },
    { id: 'schedule', label: 'الجدول', icon: Calendar, color: 'text-orange-500' },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, color: 'text-red-500', badge: unreadCount },
  ];

  const setActiveTab = (tabId: string) => {
    console.log('تغيير التبويب إلى:', tabId);
    if (onTabChange) {
      onTabChange(tabId as any);
    }
    if (controlledActive === undefined) {
      setInternalActive(tabId);
    }
  };

  const renderTabContent = () => {
    console.log('عرض محتوى التبويب:', activeTab);
    switch (activeTab) {
      case 'home':
        return <EnhancedDashboard />;
      case 'requests':
        return <MyServiceRequests />;
      case 'documents':
        return <MobileDocuments />;
      case 'grades':
        return <EnhancedGradesSection />;
      case 'schedule':
        return <EnhancedScheduleSection />;
      case 'notifications':
        return <NotificationsSection />;
      default:
        console.log('تبويب غير معروف، عرض الرئيسية');
        return <EnhancedDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Content Area */}
      <div className="p-4">
        {children ? children : renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around py-1.5 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  console.log('تم النقر على التبويب:', tab.id, tab.label);
                  setActiveTab(tab.id);
                }}
                className={`flex flex-col items-center p-1.5 rounded-lg transition-all duration-200 flex-1 max-w-[60px] ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.badge && tab.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center rounded-full"
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </Badge>
                  )}
                </div>
                <span className={`text-xs mt-0.5 leading-tight text-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileAppLayout;
