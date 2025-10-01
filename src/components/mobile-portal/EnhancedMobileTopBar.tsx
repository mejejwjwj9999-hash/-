
import React, { useState } from 'react';
import { Bell, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';

interface EnhancedMobileTopBarProps {
  user: any;
  profile: any;
}

const EnhancedMobileTopBar = ({ user, profile }: EnhancedMobileTopBarProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/692c0f32-2048-4fa2-a225-ab06ea746199.png" 
              alt="شعار كلية أيلول الجامعة" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-lg font-bold text-primary">البوابة الطلابية</h1>
              <p className="text-xs text-gray-600">كلية أيلول الجامعة</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2"
            >
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ط'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  {profile?.full_name || 'الطالب'}
                </p>
                <p className="text-xs text-gray-600">
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
      </div>

      {/* Slide Menu Overlay */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/692c0f32-2048-4fa2-a225-ab06ea746199.png" 
                    alt="شعار كلية أيلول الجامعة" 
                    className="w-8 h-8 rounded-full"
                  />
                  <h2 className="font-bold text-primary">القائمة</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'ط'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {profile?.full_name || 'الطالب'}
                      </p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <p className="text-xs text-gray-500">
                        {profile?.student_id || 'رقم الطالب غير متوفر'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2 pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-right hover:bg-university-blue/10 text-university-blue"
                  onClick={() => {
                    setShowMenu(false);
                    // Navigate to settings
                    if (typeof window !== 'undefined') {
                      window.location.hash = 'settings';
                    }
                  }}
                >
                  <Settings className="h-5 w-5" />
                  الإعدادات
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowMenu(false);
                    handleSignOut();
                  }}
                  className="w-full justify-start gap-3 text-right text-university-red hover:text-university-red hover:bg-red-50"
                >
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EnhancedMobileTopBar;
