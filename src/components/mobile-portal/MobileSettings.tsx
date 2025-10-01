import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Bell, Shield, Palette, Globe, Lock, Mail, Phone, Edit3, Save, Settings, Sun, Moon, Smartphone, Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
const MobileSettings = () => {
  const {
    profile,
    signOut
  } = useAuth();
  const {
    toast
  } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || ''
  });
  const [notifications, setNotifications] = useState({
    grades: true,
    schedule: true,
    payments: false,
    general: true
  });
  const [preferences, setPreferences] = useState({
    theme: 'auto',
    language: 'ar',
    emailNotifications: true,
    pushNotifications: true
  });

  // تحميل الإعدادات المحفوظة عند بدء تشغيل المكون
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications-settings');
    const savedPreferences = localStorage.getItem('app-preferences');
    
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('خطأ في تحميل إعدادات الإشعارات:', error);
      }
    }
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('خطأ في تحميل التفضيلات:', error);
      }
    }
  }, []);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // حفظ المعلومات الشخصية
      if (profile?.id) {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone
          })
          .eq('user_id', profile.user_id);

        if (profileError) throw profileError;
      }

      // حفظ إعدادات الإشعارات (يمكن إضافة جدول للإعدادات لاحقاً)
      localStorage.setItem('notifications-settings', JSON.stringify(notifications));
      localStorage.setItem('app-preferences', JSON.stringify(preferences));

      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم حفظ جميع إعداداتك بنجاح.'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ الإعدادات. حاول مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'كلمات المرور غير متطابقة',
        description: 'تأكد من تطابق كلمة المرور الجديدة وتأكيدها.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: 'تم تغيير كلمة المرور',
        description: 'تم تغيير كلمة المرور بنجاح.'
      });
      setShowChangePasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: 'خطأ في تغيير كلمة المرور',
        description: 'حدث خطأ أثناء تغيير كلمة المرور.',
        variant: 'destructive'
      });
    }
  };
  const handleSignOut = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      signOut();
    }
  };
  const settingsSections = [{
    id: 'profile',
    title: 'المعلومات الشخصية',
    icon: User,
    items: [{
      label: 'الاسم الأول',
      key: 'first_name',
      type: 'text',
      icon: User
    }, {
      label: 'الاسم الأخير',
      key: 'last_name',
      type: 'text',
      icon: User
    }, {
      label: 'البريد الإلكتروني',
      key: 'email',
      type: 'email',
      icon: Mail
    }, {
      label: 'رقم الهاتف',
      key: 'phone',
      type: 'tel',
      icon: Phone
    }]
  }, {
    id: 'notifications',
    title: 'الإشعارات',
    icon: Bell,
    items: [{
      label: 'إشعارات الدرجات',
      key: 'grades',
      type: 'switch'
    }, {
      label: 'إشعارات الجدول',
      key: 'schedule',
      type: 'switch'
    }, {
      label: 'إشعارات المدفوعات',
      key: 'payments',
      type: 'switch'
    }, {
      label: 'الإشعارات العامة',
      key: 'general',
      type: 'switch'
    }]
  }, {
    id: 'preferences',
    title: 'التفضيلات',
    icon: Palette,
    items: [{
      label: 'المظهر',
      key: 'theme',
      type: 'select',
      options: [{
        value: 'light',
        label: 'فاتح'
      }, {
        value: 'dark',
        label: 'داكن'
      }, {
        value: 'auto',
        label: 'تلقائي'
      }]
    }, {
      label: 'إشعارات البريد',
      key: 'emailNotifications',
      type: 'switch'
    }, {
      label: 'الإشعارات المدفوعة',
      key: 'pushNotifications',
      type: 'switch'
    }]
  }];
  return <div className="px-4 py-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-gray-800">الإعدادات</h1>
        </div>
        <Button variant={isEditing ? 'default' : 'outline'} size="sm" onClick={isEditing ? handleSave : () => setIsEditing(true)} disabled={isSaving} className="flex items-center gap-2">
          {isEditing ? <>
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'جاري الحفظ...' : 'حفظ'}
            </> : <>
              <Edit3 className="h-4 w-4" />
              تعديل
            </>}
        </Button>
      </div>

      {/* معلومات الحساب */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {profile?.first_name?.[0] || 'ط'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">
                {profile?.first_name} {profile?.last_name}
              </h3>
              <p className="text-gray-600 text-sm">{profile?.student_id}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  السنة {profile?.academic_year}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  الفصل {profile?.semester}
                </Badge>
                {profile?.major && (
                  <Badge variant="default" className="text-xs">
                    {profile.major}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أقسام الإعدادات */}
      {settingsSections.map(section => {
      const SectionIcon = section.icon;
      return <Card key={section.id} className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <SectionIcon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map(item => <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4 text-gray-500" />}
                    <Label className="text-sm font-medium">{item.label}</Label>
                  </div>
                  
                  <div className="flex-1 max-w-[200px]">
                    {item.type === 'switch' ? <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={checked => setNotifications(prev => ({
                ...prev,
                [item.key]: checked
              }))} disabled={!isEditing} /> : item.type === 'select' ? <select className="w-full p-2 border rounded text-sm" disabled={!isEditing} value={String(preferences[item.key as keyof typeof preferences])} onChange={e => setPreferences(prev => ({
                ...prev,
                [item.key]: e.target.value
              }))}>
                        {item.options?.map(option => <option key={option.value} value={option.value}>
                            {option.label}
                          </option>)}
                      </select> : <Input type={item.type} value={formData[item.key as keyof typeof formData] || ''} onChange={e => setFormData(prev => ({
                ...prev,
                [item.key]: e.target.value
              }))} disabled={!isEditing} className="text-sm text-left" />}
                  </div>
                </div>)}
            </CardContent>
          </Card>;
    })}

      {/* الأمان */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-primary" />
            الأمان والخصوصية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={showChangePasswordModal} onOpenChange={setShowChangePasswordModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                تغيير كلمة المرور
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>تغيير كلمة المرور</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowChangePasswordModal(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleChangePassword}>
                    تغيير كلمة المرور
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Lock className="h-4 w-4 mr-2" />
                إعدادات الخصوصية
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>إعدادات الخصوصية</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>إظهار الملف الشخصي للطلاب</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>السماح برسائل من الطلاب</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إظهار حالة متصل/غير متصل</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>السماح بدعوات الأحداث</Label>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full">
                  حفظ الإعدادات
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showDevicesModal} onOpenChange={setShowDevicesModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="h-4 w-4 mr-2" />
                الأجهزة المرتبطة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>الأجهزة المرتبطة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">هاتف ذكي</p>
                        <p className="text-sm text-gray-500">آخر استخدام: الآن</p>
                      </div>
                    </div>
                    <Badge variant="secondary">الجهاز الحالي</Badge>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">متصفح Chrome</p>
                        <p className="text-sm text-gray-500">آخر استخدام: منذ ساعتين</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      إلغاء الربط
                    </Button>
                  </div>
                </div>
                <Button variant="destructive" className="w-full">
                  تسجيل الخروج من جميع الأجهزة
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* معلومات التطبيق */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-gray-800">بوابة كلية أيلول الجامعية</h4>
            <p className="text-xs text-gray-500">الإصدار 1.0.0</p>
            <p className="text-xs text-gray-500">© 2025 جميع الحقوق محفوظة لشركة اريان سوفت</p>
          </div>
        </CardContent>
      </Card>

      {/* تسجيل الخروج */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>
    </div>;
};
export default MobileSettings;