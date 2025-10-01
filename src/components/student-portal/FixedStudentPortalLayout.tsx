
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  GraduationCap, 
  CreditCard, 
  FileText, 
  Bell,
  Menu,
  X,
  BookOpen,
  Clock,
  MapPin,
  Phone,
  Mail,
  Home,
  School
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RealTimeNotificationsOptimized from '@/components/notifications/RealTimeNotificationsOptimized';

const FixedStudentPortalLayout = () => {
  const { user, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample student data
  const studentData = {
    name: 'أحمد محمد علي',
    studentId: 'STU001234',
    department: 'علوم الحاسوب',
    college: 'كلية الهندسة والتكنولوجيا',
    semester: 'الفصل الأول',
    academicYear: '2024-2025',
    gpa: 3.75,
    totalCredits: 96,
    email: 'ahmed.mohammed@university.edu.ye',
    phone: '+967-77-123-4567',
    address: 'صنعاء، اليمن'
  };

  // Sample schedule data
  const scheduleData = [
    {
      id: '1',
      course: 'خوارزميات البيانات',
      courseCode: 'CS301',
      instructor: 'د. فاطمة أحمد',
      time: '08:00 - 09:30',
      room: 'قاعة 101',
      day: 'الأحد',
      credits: 3
    },
    {
      id: '2',
      course: 'قواعد البيانات',
      courseCode: 'CS302',
      instructor: 'د. محمد حسن',
      time: '10:00 - 11:30',
      room: 'مختبر 203',
      day: 'الأحد',
      credits: 3
    },
    {
      id: '3',
      course: 'الشبكات الحاسوبية',
      courseCode: 'CS303',
      instructor: 'د. سارة علي',
      time: '09:00 - 10:30',
      room: 'قاعة 105',
      day: 'الاثنين',
      credits: 4
    },
    {
      id: '4',
      course: 'هندسة البرمجيات',
      courseCode: 'CS304',
      instructor: 'د. عبدالله محمد',
      time: '11:00 - 12:30',
      room: 'قاعة 102',
      day: 'الثلاثاء',
      credits: 3
    },
    {
      id: '5',
      course: 'الذكاء الاصطناعي',
      courseCode: 'CS305',
      instructor: 'د. نورا حسين',
      time: '08:00 - 09:30',
      room: 'مختبر 301',
      day: 'الأربعاء',
      credits: 4
    }
  ];

  // Sample grades data
  const gradesData = [
    { course: 'البرمجة المتقدمة', courseCode: 'CS201', grade: 'A', points: 4.0, credits: 3 },
    { course: 'الرياضيات المتقدمة', courseCode: 'MATH201', grade: 'B+', points: 3.5, credits: 4 },
    { course: 'الفيزياء التطبيقية', courseCode: 'PHY201', grade: 'A-', points: 3.7, credits: 3 },
    { course: 'اللغة الإنجليزية', courseCode: 'ENG102', grade: 'B', points: 3.0, credits: 2 },
  ];

  // Sample payments data
  const paymentsData = [
    { id: '1', type: 'رسوم دراسية', amount: 150000, status: 'مدفوع', date: '2024-09-15' },
    { id: '2', type: 'رسوم مختبر', amount: 25000, status: 'مدفوع', date: '2024-09-10' },
    { id: '3', type: 'رسوم امتحانات', amount: 30000, status: 'مستحق', date: '2024-10-01' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'schedule', label: 'الجدول الدراسي', icon: Calendar },
    { id: 'grades', label: 'الدرجات', icon: GraduationCap },
    { id: 'payments', label: 'المدفوعات', icon: CreditCard },
    { id: 'documents', label: 'الوثائق', icon: FileText },
  ];

  const MobileSidebar = () => (
    <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">بوابة الطالب</h2>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="ml-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            معلومات الطالب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><span className="font-semibold">الاسم:</span> {studentData.name}</p>
              <p><span className="font-semibold">رقم الطالب:</span> {studentData.studentId}</p>
              <p><span className="font-semibold">القسم:</span> {studentData.department}</p>
              <p><span className="font-semibold">الكلية:</span> {studentData.college}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">المعدل التراكمي:</span> {studentData.gpa}</p>
              <p><span className="font-semibold">الساعات المكتسبة:</span> {studentData.totalCredits}</p>
              <p><span className="font-semibold">الفصل الحالي:</span> {studentData.semester}</p>
              <p><span className="font-semibold">السنة الأكاديمية:</span> {studentData.academicYear}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{studentData.gpa}</div>
            <div className="text-sm text-muted-foreground">المعدل التراكمي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{scheduleData.length}</div>
            <div className="text-sm text-muted-foreground">المواد المسجلة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{scheduleData.reduce((sum, item) => sum + item.credits, 0)}</div>
            <div className="text-sm text-muted-foreground">الساعات المعتمدة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{paymentsData.filter(p => p.status === 'مدفوع').length}</div>
            <div className="text-sm text-muted-foreground">المدفوعات</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>جدول اليوم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduleData.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{item.course}</h4>
                  <p className="text-sm text-muted-foreground">{item.instructor}</p>
                </div>
                <div className="text-left">
                  <p className="font-medium">{item.time}</p>
                  <p className="text-sm text-muted-foreground">{item.room}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ScheduleContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            الجدول الدراسي - {studentData.semester} {studentData.academicYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleData.map((item) => (
              <Card key={item.id} className="border-r-4 border-r-blue-500">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.course}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {item.courseCode}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {item.instructor}
                        </span>
                        <Badge variant="secondary">{item.credits} ساعة</Badge>
                      </div>
                    </div>
                    <div className="text-left sm:text-right space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{item.room}</span>
                      </div>
                      <div className="text-sm font-medium text-blue-600">{item.day}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const GradesContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            الدرجات والتقييمات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gradesData.map((item, index) => (
              <Card key={index} className="border-r-4 border-r-green-500">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{item.course}</h3>
                      <p className="text-sm text-muted-foreground">{item.courseCode}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{item.credits} ساعة</Badge>
                      <Badge 
                        className={`${
                          item.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                          item.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.grade}
                      </Badge>
                      <span className="font-bold text-lg">{item.points}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">المعدل التراكمي:</span>
              <span className="text-2xl font-bold text-blue-600">{studentData.gpa}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PaymentsContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            المدفوعات والرسوم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentsData.map((payment) => (
              <Card key={payment.id} className={`border-r-4 ${
                payment.status === 'مدفوع' ? 'border-r-green-500' : 'border-r-red-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{payment.type}</h3>
                      <p className="text-sm text-muted-foreground">تاريخ الاستحقاق: {payment.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">{payment.amount.toLocaleString()} ريال</span>
                      <Badge 
                        className={`${
                          payment.status === 'مدفوع' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DocumentsContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            الوثائق والشهادات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'كشف الدرجات', status: 'متاح', date: '2024-08-30' },
              { name: 'شهادة تسجيل', status: 'متاح', date: '2024-09-01' },
              { name: 'إفادة طالب', status: 'قيد الإنجاز', date: '2024-09-15' },
              { name: 'شهادة تخرج مؤقتة', status: 'غير متاح', date: '---' },
            ].map((doc, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">{doc.date}</p>
                    </div>
                    <Badge 
                      className={`${
                        doc.status === 'متاح' ? 'bg-green-100 text-green-800' :
                        doc.status === 'قيد الإنجاز' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  {doc.status === 'متاح' && (
                    <Button size="sm" className="mt-3 w-full">
                      تحميل
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardContent />;
      case 'schedule': return <ScheduleContent />;
      case 'grades': return <GradesContent />;
      case 'payments': return <PaymentsContent />;
      case 'documents': return <DocumentsContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <MobileSidebar />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <School className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold">بوابة الطالب</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <RealTimeNotificationsOptimized />
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">{studentData.name}</p>
                  <p className="text-xs text-muted-foreground">{studentData.studentId}</p>
                </div>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {studentData.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16">
          <div className="flex-1 flex flex-col bg-white border-l shadow-sm">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="ml-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:mr-64">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FixedStudentPortalLayout;
