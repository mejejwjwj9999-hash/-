import React, { useState } from 'react';
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
  FileText,
  Award,
  AlertCircle,
  CheckCircle,
  Eye,
  Upload,
  MessageSquare
} from 'lucide-react';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { useTeacherAnnouncements } from '@/hooks/useTeacherAnnouncements';
import CreateAnnouncementModal from './CreateAnnouncementModal';

interface TeacherDashboardNewProps {
  onTabChange?: (tab: string) => void;
}

const TeacherDashboardNew: React.FC<TeacherDashboardNewProps> = ({ onTabChange }) => {
  const { data: teacherProfile } = useTeacherProfile();
  const { data: courses = [] } = useTeacherCourses();
  const { data: announcements = [] } = useTeacherAnnouncements(teacherProfile?.id);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);

  // حساب الإحصائيات
  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolled_students_count || 0), 0);
  const activeCourses = courses.filter(c => c.is_active).length;
  const recentAnnouncements = announcements.filter(a => 
    new Date(a.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // بيانات وهمية للجدول اليومي
  const todaySchedule = [
    { time: '08:00', course: 'برمجة الحاسوب', room: 'A101', students: 25 },
    { time: '10:00', course: 'قواعد البيانات', room: 'B205', students: 30 },
    { time: '12:00', course: 'هندسة البرمجيات', room: 'C301', students: 22 },
    { time: '02:00', course: 'أمن المعلومات', room: 'A102', students: 18 },
  ];

  const quickStats = [
    {
      title: 'المقررات النشطة',
      value: activeCourses.toString(),
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+2 هذا الفصل'
    },
    {
      title: 'إجمالي الطلاب',
      value: totalStudents.toString(),
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+12 طالب جديد'
    },
    {
      title: 'الإعلانات الأخيرة',
      value: recentAnnouncements.toString(),
      icon: Bell,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: 'آخر 7 أيام'
    },
    {
      title: 'نسبة الحضور',
      value: '87%',
      icon: ClipboardCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+5% من الأسبوع الماضي'
    }
  ];

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* ترحيب شخصي */}
      <div className="bg-gradient-to-br from-university-blue to-university-blue-light rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              مرحباً {teacherProfile?.first_name} {teacherProfile?.last_name}
            </h1>
            <p className="text-blue-100 mb-4">
              {teacherProfile?.position || 'معلم'} • {teacherProfile?.department_id || 'قسم تقنية المعلومات'}
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {activeCourses} مقرر نشط
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {totalStudents} طالب
              </Badge>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`inline-flex p-2 rounded-xl ${stat.bgColor} mb-3`}>
                      <Icon className={`h-5 w-5 ${stat.textColor}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {stat.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.change}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* الجدول اليومي */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-university-blue" />
              جدول اليوم
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTabChange?.('schedule')}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              عرض الكامل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-university-blue/30 hover:bg-university-blue/5 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-bold text-university-blue">{item.time}</div>
                    <div className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.course}</div>
                    <div className="text-sm text-gray-600">قاعة {item.room}</div>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  {item.students}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الإجراءات السريعة */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-university-blue" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
              onClick={() => onTabChange?.('attendance')}
            >
              <ClipboardCheck className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-medium">تسجيل الحضور</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
              onClick={() => onTabChange?.('grades')}
            >
              <Award className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium">إدخال الدرجات</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
              onClick={() => onTabChange?.('courses')}
            >
              <Upload className="h-6 w-6 text-purple-500" />
              <span className="text-sm font-medium">رفع مادة</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
              onClick={() => setIsCreateAnnouncementOpen(true)}
            >
              <MessageSquare className="h-6 w-6 text-orange-500" />
              <span className="text-sm font-medium">إنشاء إعلان</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* الإشعارات والتنبيهات */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-university-blue" />
            التنبيهات والمهام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-green-800">تم تسجيل حضور محاضرة برمجة الحاسوب</div>
                <div className="text-xs text-green-600">منذ ساعتين</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-orange-800">يوجد 5 واجبات في انتظار التصحيح</div>
                <div className="text-xs text-orange-600">مقرر قواعد البيانات</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-800">تذكير: امتحان هندسة البرمجيات غداً</div>
                <div className="text-xs text-blue-600">الساعة 10:00 صباحاً</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مودال إنشاء الإعلان */}
      <CreateAnnouncementModal
        open={isCreateAnnouncementOpen}
        onOpenChange={setIsCreateAnnouncementOpen}
      />
    </div>
  );
};

export default TeacherDashboardNew;