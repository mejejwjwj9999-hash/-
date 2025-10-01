import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  CreditCard,
  TrendingUp,
  Calendar,
  FileText,
  Bell
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const StudentPortalDashboard = () => {
  const { user, profile } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      const [gradesRes, paymentsRes, scheduleRes, notificationsRes] = await Promise.all([
        supabase
          .from('grades')
          .select(`
            *,
            courses:course_id (course_name_ar, credit_hours)
          `)
          .eq('student_id', profile.id)
          .eq('status', 'مكتملة'),
        
        supabase
          .from('payments')
          .select('*')
          .eq('student_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('class_schedule')
          .select(`
            *,
            courses:course_id (course_name_ar, course_code)
          `)
          .eq('academic_year', '2024-2025')
          .eq('semester', 'الفصل الأول'),
        
        supabase
          .from('notifications')
          .select('*')
          .eq('student_id', profile.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // Calculate GPA
      const gpa = gradesRes.data?.length 
        ? Math.round((gradesRes.data.reduce((sum: number, grade: any) => 
            sum + (grade.gpa_points || 0) * (grade.courses?.credit_hours || 0), 0) / 
            gradesRes.data.reduce((sum: number, grade: any) => 
              sum + (grade.courses?.credit_hours || 0), 0)) * 100) / 100
        : 0;

      return {
        grades: gradesRes.data || [],
        payments: paymentsRes.data || [],
        schedule: scheduleRes.data || [],
        notifications: notificationsRes.data || [],
        gpa,
        totalCredits: gradesRes.data?.reduce((sum: number, grade: any) => 
          sum + (grade.courses?.credit_hours || 0), 0) || 0
      };
    },
    enabled: !!profile?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-academic-gray-light rounded-lg"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-academic-gray-light rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = dashboardData ? [
    {
      title: 'المعدل التراكمي',
      value: dashboardData.gpa.toFixed(2),
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'المواد المسجلة',
      value: dashboardData.schedule.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'الساعات المعتمدة',
      value: dashboardData.totalCredits.toString(),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'المدفوعات المعلقة',
      value: dashboardData.payments.filter((p: any) => p.payment_status === 'pending').length.toString(),
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-university-blue to-university-blue-dark text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                مرحباً، {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-lg opacity-90">
                {profile?.department} - {profile?.college}
              </p>
              <p className="text-sm opacity-75">
                رقم الطالب: {profile?.student_id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                السنة الدراسية {profile?.academic_year}
              </p>
              <p className="text-sm opacity-75">
                الفصل الدراسي {profile?.semester}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-medium transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">{stat.title}</p>
                  <p className="text-2xl font-bold text-university-blue">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-university-blue" />
              جدول اليوم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData?.schedule.slice(0, 3).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-academic-gray-light rounded-lg">
                <div>
                  <h4 className="font-semibold text-university-blue">
                    {item.courses?.course_name_ar}
                  </h4>
                  <p className="text-sm text-academic-gray">
                    {item.courses?.course_code} - {item.instructor_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-university-blue">
                    {item.start_time} - {item.end_time}
                  </p>
                  <p className="text-sm text-academic-gray">{item.classroom}</p>
                </div>
              </div>
            ))}
            {(!dashboardData?.schedule || dashboardData.schedule.length === 0) && (
              <p className="text-center text-academic-gray py-4">
                لا توجد محاضرات اليوم
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-university-blue" />
              الإشعارات الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData?.notifications.map((notification: any) => (
              <div key={notification.id} className="p-3 bg-academic-gray-light rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-university-blue">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-academic-gray mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <Badge 
                    variant={notification.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {notification.priority === 'high' ? 'عاجل' : 'عادي'}
                  </Badge>
                </div>
              </div>
            ))}
            {(!dashboardData?.notifications || dashboardData.notifications.length === 0) && (
              <p className="text-center text-academic-gray py-4">
                لا توجد إشعارات جديدة
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-university-blue" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'عرض الدرجات', icon: GraduationCap, color: 'bg-green-500' },
              { name: 'الجدول الدراسي', icon: Calendar, color: 'bg-blue-500' },
              { name: 'الوثائق', icon: FileText, color: 'bg-purple-500' },
              { name: 'المدفوعات', icon: CreditCard, color: 'bg-orange-500' }
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 rounded-lg bg-academic-gray-light hover:bg-university-blue hover:text-white transition-colors duration-300 text-center"
              >
                <action.icon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">{action.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPortalDashboard;