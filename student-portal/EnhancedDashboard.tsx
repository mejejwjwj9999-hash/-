
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard,
  Bell,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import EnhancedGradesSection from './EnhancedGradesSection';
import EnhancedScheduleSection from './EnhancedScheduleSection';
import DocumentsSection from './DocumentsSection';
import EnhancedFinancialOverview from './EnhancedFinancialOverview';
import NotificationsSection from './NotificationsSection';
import QuickActionsCard from './QuickActionsCard';
import MobileDocumentRequestModal from '../mobile-portal/MobileDocumentRequestModal';

const EnhancedDashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDocumentRequestModal, setShowDocumentRequestModal] = useState(false);

  const handleQuickAction = (action: string) => {
    console.log('إجراء سريع تم تنفيذه:', action);
    
    // التحقق من وجودنا في التطبيق المحمول
    const isMobileApp = window.location.pathname.includes('student-portal');
    
    switch (action) {
      case 'requests':
        console.log('التنقل إلى طلباتي');
        if (isMobileApp) {
          // تحديث URL مع تبويب الطلبات
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('tab', 'requests');
          window.history.pushState({}, '', currentUrl.toString());
          
          // إرسال حدث مخصص للتنقل
          const tabChangeEvent = new CustomEvent('tabChange', { 
            detail: 'requests',
            bubbles: true 
          });
          window.dispatchEvent(tabChangeEvent);
          
          // إعادة تحميل الصفحة لضمان التحديث
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
        break;
      case 'documents':
        console.log('التنقل إلى الوثائق');
        if (isMobileApp) {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('tab', 'documents');
          window.history.pushState({}, '', currentUrl.toString());
          
          const tabChangeEvent = new CustomEvent('tabChange', { 
            detail: 'documents',
            bubbles: true 
          });
          window.dispatchEvent(tabChangeEvent);
          
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          setActiveTab('documents');
        }
        break;
      case 'new-document':
        setShowDocumentRequestModal(true);
        break;
      case 'grades':
        console.log('التنقل إلى الدرجات');
        if (isMobileApp) {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('tab', 'grades');
          window.history.pushState({}, '', currentUrl.toString());
          
          const tabChangeEvent = new CustomEvent('tabChange', { 
            detail: 'grades',
            bubbles: true 
          });
          window.dispatchEvent(tabChangeEvent);
          
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          setActiveTab('grades');
        }
        break;
      case 'schedule':
        console.log('التنقل إلى الجدول');
        if (isMobileApp) {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('tab', 'schedule');
          window.history.pushState({}, '', currentUrl.toString());
          
          const tabChangeEvent = new CustomEvent('tabChange', { 
            detail: 'schedule',
            bubbles: true 
          });
          window.dispatchEvent(tabChangeEvent);
          
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          setActiveTab('schedule');
        }
        break;
      case 'financial':
        setActiveTab('financial');
        break;
      default:
        console.log('إجراء غير معروف:', action);
    }
  };

  // إضافة مستمع للأحداث من المكونات الأخرى
  React.useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      console.log('تم استقبال حدث تغيير التبويب:', event.detail);
    };

    window.addEventListener('changeTab' as any, handleTabChange);
    
    return () => {
      window.removeEventListener('changeTab' as any, handleTabChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 rtl" data-mobile-app="true">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-mobile-auth-button rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">مرحباً بك في بوابة الطالب</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
              الإعدادات
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              الرئيسية
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              الدرجات
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              الجدول
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              المالية
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              الوثائق
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              الإشعارات
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <QuickActionsCard onAction={handleQuickAction} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>آخر الدرجات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-muted-foreground">
                    انتقل إلى قسم الدرجات لعرض التفاصيل
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('grades')}
                  >
                    عرض كشف الدرجات
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الجدول القادم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-muted-foreground">
                    انتقل إلى قسم الجدول لعرض التفاصيل
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('schedule')}
                  >
                    عرض الجدول الدراسي
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Grades Section */}
          <TabsContent value="grades">
            <EnhancedGradesSection />
          </TabsContent>

          {/* Schedule Section */}
          <TabsContent value="schedule">
            <EnhancedScheduleSection />
          </TabsContent>

          {/* Financial Section */}
          <TabsContent value="financial">
            <EnhancedFinancialOverview />
          </TabsContent>

          {/* Documents Section */}
          <TabsContent value="documents">
            <DocumentsSection />
          </TabsContent>

          {/* Notifications Section */}
          <TabsContent value="notifications">
            <NotificationsSection />
          </TabsContent>
        </Tabs>
        
        {/* Document Request Modal */}
        <MobileDocumentRequestModal 
          open={showDocumentRequestModal} 
          onClose={() => setShowDocumentRequestModal(false)} 
        />
      </div>
    </div>
  );
};

export default EnhancedDashboard;
