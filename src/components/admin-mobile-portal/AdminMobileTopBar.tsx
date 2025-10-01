import React, { useState } from 'react';
import { Bell, Shield, Settings, LogOut, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/components/auth/AuthProvider';

interface AdminMobileTopBarProps {
  user: any;
  onNotificationsClick: () => void;
  currentTab?: string;
  selectedMoreItem?: string | null;
  onMoreClick?: () => void;
  hasMoreItems?: boolean;
}

const AdminMobileTopBar = ({
  user,
  onNotificationsClick,
  currentTab = '',
  selectedMoreItem = null,
  onMoreClick,
  hasMoreItems = false
}: AdminMobileTopBarProps) => {
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const { data: notifications = [] } = useNotifications();
  const { signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    onNotificationsClick();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const recentNotifications = notifications.slice(0, 3);

  // Get current page title
  const getPageTitle = () => {
    if (selectedMoreItem) {
      const titles: Record<string, string> = {
        'enrollment': 'إدارة التسجيل',
        'payments': 'إدارة المدفوعات',
        'schedules': 'إدارة الجداول',
        'grades': 'إدارة الدرجات',
        'reports': 'التقارير والإحصائيات',
        'settings': 'إعدادات النظام'
      };
      return titles[selectedMoreItem] || 'الأدوات الإدارية';
    }
    
    const titles: Record<string, string> = {
      'dashboard': 'لوحة التحكم الإدارية',
      'students': 'إدارة الطلاب',
      'teachers': 'إدارة المعلمين',
      'courses': 'إدارة المقررات',
      'notifications': 'إدارة الإشعارات'
    };
    return titles[currentTab] || 'لوحة التحكم الإدارية';
  };

  return (
    <div className="mobile-top-bar-fixed w-full bg-white/95 backdrop-blur-sm border-b border-university-blue/20 shadow-elegant z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/692c0f32-2048-4fa2-a225-ab06ea746199.png" 
              alt="شعار كلية أيلول الجامعة" 
              className="w-12 h-12 rounded-full ring-2 ring-university-blue/30 shadow-soft" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-university-blue rounded-full flex items-center justify-center">
              <Shield className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-university-blue leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-academic-gray">نظام إدارة كلية أيلول</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* More Options Button */}
          {hasMoreItems && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMoreClick}
              className="p-2 hover:bg-university-blue/10 rounded-xl"
            >
              <MoreHorizontal className="h-5 w-5 text-university-blue" />
            </Button>
          )}

          {/* Notifications Button */}
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleNotificationsClick} className="relative p-2 hover:bg-university-blue/10 rounded-xl">
                <Bell className="h-5 w-5 text-university-blue" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full bg-university-red">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-university-blue/20 bg-university-blue/5">
                <h3 className="font-semibold text-university-blue text-right">الإشعارات الإدارية</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <div className="p-4 text-center text-academic-gray">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-university-blue/30" />
                    <p className="text-sm">لا توجد إشعارات</p>
                  </div>
                ) : recentNotifications.map(notification => (
                  <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-university-blue/5 transition-colors">
                    <p className="text-sm font-medium text-right text-university-blue">{notification.title}</p>
                    <p className="text-xs text-academic-gray text-right mt-1">
                      {new Date(notification.created_at).toLocaleDateString('ar-SA')}
                    </p>
                    {!notification.is_read && <div className="w-2 h-2 bg-university-red rounded-full mt-1 mr-auto"></div>}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-university-blue/20 bg-university-blue/5">
                <Button variant="outline" size="sm" className="w-full border-university-blue text-university-blue hover:bg-university-blue hover:text-white" onClick={handleViewAllNotifications}>
                  عرض جميع الإشعارات
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Button */}
          <Popover open={showProfile} onOpenChange={setShowProfile}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 rounded-xl hover:bg-university-blue/10">
                <div className="w-10 h-10 bg-gradient-to-br from-university-blue/10 to-university-blue/20 rounded-xl flex items-center justify-center ring-2 ring-university-blue/30 shadow-soft">
                  <span className="text-university-blue font-bold text-sm">
                    {user?.email?.charAt(0)?.toUpperCase() || 'إ'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="p-4 bg-university-blue/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-university-blue/10 rounded-full flex items-center justify-center ring-2 ring-university-blue/20">
                    <Shield className="text-university-blue h-6 w-6" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-university-blue">مسؤول النظام</p>
                    <p className="text-sm text-academic-gray">{user?.email}</p>
                    <p className="text-xs text-academic-gray">صلاحيات إدارية كاملة</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-right hover:bg-university-blue/10 text-university-blue">
                    <Settings className="h-4 w-4" />
                    إعدادات النظام
                  </Button>
                  
                  <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-3 text-right text-university-red hover:text-university-red hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Admin Info Bar */}
      <div className="px-4 pb-3 pt-2">
        <div className="bg-gradient-to-r from-university-blue/5 via-university-blue/8 to-university-blue/10 rounded-2xl p-3 border border-university-blue/20 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-university-blue/10 to-university-blue/20 rounded-2xl flex items-center justify-center ring-2 ring-university-blue/30 shadow-soft">
              <Shield className="text-university-blue h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-university-blue text-sm">مسؤول النظام</p>
              <p className="text-xs text-academic-gray">{user?.email}</p>
              <p className="text-xs text-academic-gray/70">صلاحيات إدارية كاملة</p>
            </div>
            <div className="text-left space-y-1">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 shadow-soft">
                متصل
              </Badge>
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMobileTopBar;