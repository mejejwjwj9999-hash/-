import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { TeacherProfile } from '@/hooks/useTeacherProfile';

interface TeacherMobileTopBarProps {
  user: any;
  profile: TeacherProfile | null;
  onNotificationsClick: () => void;
  onMenuClick?: () => void;
  unreadNotifications?: number;
}

const TeacherMobileTopBar: React.FC<TeacherMobileTopBarProps> = ({
  user,
  profile,
  onNotificationsClick,
  onMenuClick,
  unreadNotifications = 0
}) => {
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-l from-university-blue to-university-blue-light text-white shadow-large" dir="rtl">
      {/* الشريط العلوي */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="text-white hover:bg-white/10 p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold">بوابة المعلمين</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              className="relative text-white hover:bg-white/10 p-2"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* معلومات المعلم والوقت */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {profile?.first_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'م'}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                {profile ? `${profile.first_name} ${profile.last_name}` : 'مرحباً'}
              </h2>
              <p className="text-sm opacity-90">
                {profile?.position || 'عضو هيئة التدريس'}
              </p>
              {profile?.department_id && (
                <p className="text-xs opacity-75">
                  {profile.specialization || 'التخصص غير محدد'}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-left">
            <div className="text-sm font-medium">{formatTime()}</div>
            <div className="text-xs opacity-90">{formatDate()}</div>
          </div>
        </div>
      </div>

      {/* شريط الحالة */}
      <div className="px-4 py-2 bg-white/10 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span>كلية أيلول الجامعة</span>
          {profile?.teacher_id && (
            <span className="text-xs opacity-75">
              رقم المعلم: {profile.teacher_id}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs">متصل</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherMobileTopBar;