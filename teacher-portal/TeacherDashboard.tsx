import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  GraduationCap,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';

interface TeacherDashboardProps {
  onTabChange: (tab: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onTabChange }) => {
  const { data: profile } = useTeacherProfile();
  const { data: courses = [] } = useTeacherCourses();

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const time = now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date, time };
  };

  const { date, time } = getCurrentDateTime();

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolled_students_count || 0), 0);
  const activeCourses = courses.filter(course => course.is_active).length;

  const quickStats = [
    {
      title: 'المقررات النشطة',
      value: activeCourses,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => onTabChange('courses')
    },
    {
      title: 'إجمالي الطلاب',
      value: totalStudents,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => onTabChange('courses')
    },
    {
      title: 'محاضرات اليوم',
      value: 0, // سيتم حسابها لاحقاً من الجدول
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => onTabChange('schedule')
    },
    {
      title: 'واجبات معلقة',
      value: 0, // سيتم حسابها لاحقاً
      icon: ClipboardCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => onTabChange('grades')
    }
  ];

  const todaySchedule = [
    {
      time: '08:00 - 09:30',
      course: 'رياضيات عامة',
      room: 'قاعة 101',
      students: 25
    },
    {
      time: '10:00 - 11:30',
      course: 'فيزياء عامة',
      room: 'مختبر الفيزياء',
      students: 20
    }
  ];

  const recentActivities = [
    {
      title: 'تم تحديث درجات امتحان الفصل الأول',
      course: 'رياضيات عامة',
      time: 'منذ ساعتين',
      type: 'grades'
    },
    {
      title: 'تم تسجيل حضور محاضرة اليوم',
      course: 'فيزياء عامة',
      time: 'منذ 4 ساعات',
      type: 'attendance'
    },
    {
      title: 'تم رفع مادة تعليمية جديدة',
      course: 'كيمياء عامة',
      time: 'أمس',
      type: 'material'
    }
  ];

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* بطاقة الترحيب */}
      <div className="teacher-card animate-fade-in bg-gradient-to-l from-university-blue to-university-blue-light text-white border-0 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                مرحباً، {profile ? `الدكتور ${profile.first_name} ${profile.last_name}` : 'الدكتور'}
              </h1>
              <p className="text-blue-100 text-sm">
                {profile?.position || 'عضو هيئة التدريس'} - {profile?.specialization || 'التخصص'}
              </p>
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold">{time}</div>
              <div className="text-blue-100 text-sm">{date}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>متصل</span>
            </div>
            <span>كلية أيلول الجامعة</span>
            {profile?.office_location && (
              <span>المكتب: {profile.office_location}</span>
            )}
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="teacher-stat-card hover-scale animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={stat.action}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl shadow-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold mb-1 text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* جدول اليوم */}
      <div className="teacher-card animate-slide-in-right">
        <div className="pb-3 px-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Calendar className="h-5 w-5 text-university-blue" />
              محاضرات اليوم
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onTabChange('schedule')}
              className="text-university-blue hover:bg-university-blue/10"
            >
              عرض الكل
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </div>
        <div className="px-6 pb-6">
          {todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-university-blue/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-university-blue" />
                    </div>
                    <div>
                      <div className="font-medium">{session.course}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.room} • {session.students} طالب
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <Badge variant="outline" className="text-xs">
                      {session.time}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>لا توجد محاضرات مجدولة لليوم</p>
            </div>
          )}
        </div>
      </div>

      {/* النشاطات الأخيرة */}
      <div className="teacher-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="pb-3 px-6 pt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <Bell className="h-5 w-5 text-university-blue" />
            النشاطات الأخيرة
          </h3>
        </div>
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const getActivityIcon = (type: string) => {
                switch (type) {
                  case 'grades': return GraduationCap;
                  case 'attendance': return ClipboardCheck;
                  case 'material': return FileText;
                  default: return Bell;
                }
              };
              
              const Icon = getActivityIcon(activity.type);
              
              return (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {activity.course} • {activity.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      <div className="teacher-card animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
        <div className="pb-3 px-6 pt-6">
          <h3 className="text-lg font-semibold text-gray-900">الإجراءات السريعة</h3>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 rounded-xl border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
              onClick={() => onTabChange('attendance')}
            >
              <ClipboardCheck className="h-6 w-6" />
              <span className="text-sm">تسجيل الحضور</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 rounded-xl border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
              onClick={() => onTabChange('grades')}
            >
              <GraduationCap className="h-6 w-6" />
              <span className="text-sm">إدخال الدرجات</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 rounded-xl border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
              onClick={() => onTabChange('courses')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">رفع مواد</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 rounded-xl border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
              onClick={() => onTabChange('schedule')}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">عرض الجدول</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;