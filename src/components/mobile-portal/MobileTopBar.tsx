import React, { useState } from 'react';
import { Bell, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/components/auth/AuthProvider';
interface MobileTopBarProps {
  user: any;
  profile: any;
  onNotificationsClick: () => void;
  currentTab?: string;
  selectedMoreItem?: string | null;
  onMoreClick?: () => void;
  hasMoreItems?: boolean;
}
const MobileTopBar = ({
  user,
  profile,
  onNotificationsClick,
  currentTab = '',
  selectedMoreItem = null,
  onMoreClick,
  hasMoreItems = false
}: MobileTopBarProps) => {
  const {
    data: unreadCount = 0
  } = useUnreadNotifications();
  const {
    data: notifications = []
  } = useNotifications();
  const {
    signOut
  } = useAuth();
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
        'grades': 'الدرجات',
        'documents': 'الوثائق', 
        'financial': 'الشؤون المالية',
        'student-services': 'خدمات الطلاب',
        'my-requests': 'طلباتي',
        'settings': 'الإعدادات'
      };
      return titles[selectedMoreItem] || 'الخدمات';
    }
    
    const titles: Record<string, string> = {
      'dashboard': 'الرئيسية',
      'courses': 'المقررات',
      'assignments': 'الواجبات',
      'schedule': 'الجدول الدراسي',
      'notifications': 'الإشعارات'
    };
    return titles[currentTab] || 'بوابة الطالب';
  };

  return <div className="mobile-top-bar-fixed w-full bg-card border-b border-border shadow-soft z-50">
      <div className="flex items-center justify-between px-3 py-2">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/692c0f32-2048-4fa2-a225-ab06ea746199.png" 
            alt="شعار كلية أيلول الجامعة" 
            className="w-10 h-10 rounded-full ring-2 ring-university-blue/20" 
          />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-university-blue">{getPageTitle()}</h1>
            <p className="text-xs text-muted-foreground">كلية أيلول الجامعية</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Notifications Button */}
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleNotificationsClick} className="relative p-2 hover:bg-university-blue/10">
                <Bell className="h-5 w-5 text-university-blue" />
                {unreadCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full bg-university-red">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-university-blue/20 bg-university-blue/5">
                <h3 className="font-semibold text-university-blue text-right">الإشعارات</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {recentNotifications.length === 0 ? <div className="p-4 text-center text-academic-gray">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-university-blue/30" />
                    <p className="text-sm">لا توجد إشعارات</p>
                  </div> : recentNotifications.map(notification => <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-university-blue/5 transition-colors">
                      <p className="text-sm font-medium text-right text-university-blue">{notification.title}</p>
                      <p className="text-xs text-academic-gray text-right mt-1">
                        {new Date(notification.created_at).toLocaleDateString('ar-SA')}
                      </p>
                      {!notification.is_read && <div className="w-2 h-2 bg-university-red rounded-full mt-1 mr-auto"></div>}
                    </div>)}
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
              <Button variant="ghost" size="sm" className="p-1 rounded-full hover:bg-university-blue/10">
                <div className="w-8 h-8 bg-university-blue/10 rounded-full flex items-center justify-center ring-2 ring-university-blue/20">
                  <span className="text-university-blue font-bold text-sm">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ط'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="p-4 bg-university-blue/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-university-blue/10 rounded-full flex items-center justify-center ring-2 ring-university-blue/20">
                    <span className="text-university-blue font-bold text-lg">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ط'}
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-university-blue">
                      {profile?.full_name || 'الطالب'}
                    </p>
                    <p className="text-sm text-academic-gray">{user?.email}</p>
                    <p className="text-xs text-academic-gray">
                      {profile?.student_id || 'رقم الطالب غير متوفر'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-right hover:bg-university-blue/10 text-university-blue"
                    onClick={() => {
                      setShowProfile(false);
                      // Navigate to settings - you can customize this based on your routing
                      if (typeof window !== 'undefined') {
                        // For hash routing
                        window.location.hash = 'settings';
                        // Or for react-router
                        // navigate('/settings');
                      }
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    الإعدادات
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setShowProfile(false);
                      handleSignOut();
                    }} 
                    className="w-full justify-start gap-3 text-right text-university-red hover:text-university-red hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* User Info Bar */}
      <div className="px-3 pb-2 pt-1">
        <div className="bg-gradient-to-r from-university-blue/5 to-university-blue/10 rounded-xl p-2 border border-university-blue/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-university-blue/10 rounded-full flex items-center justify-center ring-2 ring-university-blue/20">
              <span className="text-university-blue font-bold text-lg">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ط'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-university-blue text-sm">
                {profile?.full_name || 'الطالب'}
              </p>
              <p className="text-xs text-academic-gray">
                {profile?.student_id || 'رقم الطالب غير متوفر'}
              </p>
            </div>
            <div className="text-left">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                نشط
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default MobileTopBar;