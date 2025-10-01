
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  ListTodo, 
  Bell,
  TrendingUp,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  Star,
  Award,
  CreditCard,
  FileText,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react';
import { useGrades } from '@/hooks/useGrades';
import { useStudentEnrollments } from '@/hooks/useStudentEnrollments';
import { useSchedule } from '@/hooks/useSchedule';
import { usePayments } from '@/hooks/usePayments';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';
import { useAuth } from '@/components/auth/AuthProvider';

interface MobileDashboardProps {
  onTabChange: (tab: string) => void;
}

const MobileDashboard = ({ onTabChange }: MobileDashboardProps) => {
  const { profile } = useAuth();
  const { data: grades } = useGrades();
  const { data: enrollments } = useStudentEnrollments();
  const { data: schedule } = useSchedule();
  const { data: payments } = usePayments();
  const { data: unreadCount = 0 } = useUnreadNotifications();
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // تحديث الوقت كل دقيقة
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // حساب الإحصائيات
  const completedGrades = grades?.filter(g => g.status === 'completed') || [];
  const completedHours = completedGrades.reduce((sum, grade) => sum + (grade.courses?.credit_hours || 0), 0);
  const currentCourses = enrollments?.length || 0;
  const gpa = completedGrades.length > 0 ? 
    completedGrades.reduce((sum, grade) => sum + (grade.gpa_points || 0), 0) / completedGrades.length : 0;

  // جدول اليوم - with additional validation
  const today = new Date().getDay(); // 0=الأحد, 6=السبت حسب JavaScript
  const todaySchedule = schedule?.filter(item => {
    // Check if it's today's schedule
    if (item.day_of_week !== today) return false;
    
    // Additional validation to ensure the course belongs to the student
    if (item.courses) {
      const departmentMatch = !profile?.department_id || item.courses.department_id === profile?.department_id;
      const programMatch = !profile?.program_id || item.courses.program_id === profile?.program_id;
      const yearMatch = !profile?.academic_year || item.courses.academic_year === profile?.academic_year;
      const semesterMatch = !profile?.semester || item.courses.semester === profile?.semester;
      
      return departmentMatch && programMatch && yearMatch && semesterMatch;
    }
    
    return true;
  }) || [];

  // الإحصائيات المالية
  const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const totalDue = 450000; // المبلغ الإجمالي المطلوب
  const paymentProgress = (totalPaid / totalDue) * 100;

  // رسالة الترحيب والأيقونة حسب الوقت
  const getGreetingData = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: 'صباح الخير',
        period: 'الصباح',
        icon: Sunrise,
        bgGradient: 'from-orange-400 via-yellow-500 to-orange-600',
        textColor: 'text-orange-100'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: 'نهارك سعيد',
        period: 'الظهيرة',
        icon: Sun,
        bgGradient: 'from-blue-400 via-sky-500 to-blue-600',
        textColor: 'text-blue-100'
      };
    } else if (hour >= 17 && hour < 20) {
      return {
        greeting: 'مساء الخير',
        period: 'المساء',
        icon: Sunset,
        bgGradient: 'from-purple-400 via-pink-500 to-red-500',
        textColor: 'text-purple-100'
      };
    } else {
      return {
        greeting: 'مساء الخير',
        period: 'الليل',
        icon: Moon,
        bgGradient: 'from-indigo-600 via-purple-700 to-indigo-800',
        textColor: 'text-indigo-100'
      };
    }
  };

  // تنسيق التاريخ والوقت
  const formatTime = () => {
    return currentTime.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const greetingData = getGreetingData();
  const GreetingIcon = greetingData.icon;

  const quickActions = [
    { 
      id: 'assignments',  
      title: 'الواجبات', 
      icon: BookOpen, 
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      id: 'schedule',
      title: 'الجدول', 
      icon: Calendar, 
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'courses',
      title: 'المقررات', 
      icon: BookOpen, 
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      id: 'grades',
      title: 'الدرجات', 
      icon: GraduationCap, 
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'financial',
      title: 'المالية', 
      icon: DollarSign, 
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'documents',
      title: 'الوثائق', 
      icon: FileText, 
      color: 'from-teal-500 to-teal-600',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    { 
      id: 'student-services',
      title: 'الخدمات', 
      icon: User, 
      color: 'from-cyan-500 to-cyan-600',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    { 
      id: 'notifications',
      title: 'الإشعارات', 
      icon: Bell, 
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      badge: unreadCount
    },
    { 
      id: 'settings',
      title: 'الإعدادات', 
      icon: CreditCard, 
      color: 'from-gray-500 to-gray-600',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="px-3 pt-2 pb-2 space-y-3 bg-gray-50 min-h-screen" dir="rtl">
      {/* بطاقة الترحيب المحسنة */}
      <Card className="border-0 shadow-lg overflow-hidden relative mx-auto max-w-md">
        <div className={`bg-gradient-to-br ${greetingData.bgGradient} text-white relative`}>
          {/* خلفية منقطة */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,white_2px,transparent_2px)] bg-[length:24px_24px]"></div>
          </div>
          
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <GreetingIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1 text-white">
                    {greetingData.greeting}
                  </h2>
                  <p className="text-sm font-medium opacity-90 text-white">
                    {profile?.first_name || 'الطالب'}
                  </p>
                </div>
              </div>
              
              <div className="text-left">
                <div className="text-2xl font-bold text-white">
                  {formatTime()}
                </div>
                <div className="text-sm text-white opacity-80">
                  {greetingData.period}
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-white leading-relaxed opacity-90">
                {formatDate()}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">محاضرات اليوم</span>
                </div>
                <div className="text-2xl font-bold">{todaySchedule.length}</div>
                <div className={`text-xs ${greetingData.textColor} opacity-75`}>
                  {todaySchedule.length > 0 ? 'محاضرة' : 'لا توجد'}
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-medium">المعدل</span>
                </div>
                <div className="text-2xl font-bold">{gpa.toFixed(2)}</div>
                <div className={`text-xs ${greetingData.textColor} opacity-75`}>
                  من 4.00
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">الساعات</p>
                <p className="text-xl font-bold text-green-600">{completedHours}</p>
                <p className="text-xs text-gray-400">معتمدة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">المقررات</p>
                <p className="text-xl font-bold text-purple-600">{currentCourses}</p>
                <p className="text-xs text-gray-400">حالية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التقدم الأكاديمي */}
      <Card className="border-0 shadow-md max-w-md mx-auto">
        <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-university-blue" />
              التقدم الأكاديمي
            </h3>
            <Badge variant="outline" className="text-xs font-medium">السنة {profile?.academic_year || '1'}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">الساعات المكتملة</span>
              <span className="font-semibold">{completedHours} / 132</span>
            </div>
            <Progress value={(completedHours / 132) * 100} className="h-2 rounded-full" />
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
              متبقي <span className="font-semibold text-university-blue">{132 - completedHours}</span> ساعة للتخرج
            </p>
          </div>
        </CardContent>
      </Card>

      {/* الإجراءات السريعة */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">الإجراءات السريعة</h3>
          <Badge variant="secondary" className="text-xs">{quickActions.length} خدمات</Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id}
                className="border-0 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => onTabChange(action.id)}
              >
                <CardContent className="p-2">
                  <div className="text-center space-y-1">
                    <div className={`w-10 h-10 mx-auto ${action.bgColor} rounded-lg flex items-center justify-center relative shadow-sm`}>
                      <Icon className={`h-5 w-5 ${action.textColor}`} />
                      {action.badge && action.badge > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center rounded-full shadow-md"
                        >
                          {action.badge > 9 ? '9+' : action.badge}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-xs text-gray-800">{action.title}</h4>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* جدول اليوم */}
      {todaySchedule.length > 0 && (
        <Card className="border-0 shadow-md max-w-md mx-auto">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-university-blue" />
                جدول اليوم
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onTabChange('schedule')}
                className="text-xs text-university-blue hover:bg-university-blue/10"
              >
                عرض الكل
                <ChevronLeft className="w-3 h-3 mr-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {todaySchedule.slice(0, 2).map((classItem, index) => (
                <div key={classItem.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                  <div className="w-10 h-10 bg-university-blue rounded-lg flex items-center justify-center text-white font-bold shadow-sm text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 mb-1 truncate">
                      {classItem.courses?.course_name_ar}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {classItem.start_time} - {classItem.end_time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {classItem.classroom}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileDashboard;
