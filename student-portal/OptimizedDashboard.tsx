import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  FileText, 
  Bell,
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedDashboardProps {
  onTabChange?: (tab: string) => void;
}

const OptimizedDashboard: React.FC<OptimizedDashboardProps> = ({ onTabChange }) => {
  const { profile } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard-overview', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const [gradesRes, paymentsRes, notificationsRes, appointmentsRes] = await Promise.all([
        supabase.from('grades').select('*').eq('student_id', profile.id).limit(5),
        supabase.from('payments').select('*').eq('student_id', profile.id).eq('payment_status', 'pending').limit(3),
        supabase.from('notifications').select('*').eq('student_id', profile.id).eq('is_read', false).limit(5),
        supabase.from('appointments').select('*').eq('student_id', profile.id).gte('appointment_date', new Date().toISOString()).limit(3)
      ]);

      return {
        grades: gradesRes.data || [],
        pendingPayments: paymentsRes.data || [],
        unreadNotifications: notificationsRes.data || [],
        upcomingAppointments: appointmentsRes.data || []
      };
    },
    enabled: !!profile?.id,
  });

  const quickStats = [
    {
      title: 'السنة الدراسية',
      value: profile?.academic_year || '1',
      subtitle: `الفصل ${profile?.semester || '1'}`,
      icon: GraduationCap,
      color: 'text-university-blue',
      bgColor: 'bg-university-blue/10'
    },
    {
      title: 'المقررات النشطة',
      value: dashboardData?.grades?.length || '0',
      subtitle: 'مقرر مسجل',
      icon: BookOpen,
      color: 'text-university-gold',
      bgColor: 'bg-university-gold/10'
    },
    {
      title: 'المدفوعات المعلقة',
      value: dashboardData?.pendingPayments?.length || '0',
      subtitle: 'فاتورة معلقة',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'الإشعارات الجديدة',
      value: dashboardData?.unreadNotifications?.length || '0',
      subtitle: 'إشعار غير مقروء',
      icon: Bell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const quickActions = [
    {
      title: 'عرض الدرجات',
      description: 'اطلع على درجاتك وتقييماتك',
      icon: GraduationCap,
      tab: 'grades',
      color: 'bg-university-blue hover:bg-university-blue-light'
    },
    {
      title: 'الجدول الدراسي',
      description: 'عرض جدول المحاضرات',
      icon: Calendar,
      tab: 'schedule',
      color: 'bg-university-gold hover:bg-university-gold-light'
    },
    {
      title: 'طلب وثيقة',
      description: 'اطلب الوثائق الرسمية',
      icon: FileText,
      tab: 'documents',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'دفع الرسوم',
      description: 'دفع الرسوم الدراسية',
      icon: CreditCard,
      tab: 'payments',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-l from-university-blue to-university-blue-light rounded-xl p-6 text-white shadow-university">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              مرحباً، {profile?.first_name} {profile?.last_name}
            </h1>
            <p className="text-university-blue-light">
              كلية أيلول الجامعة - {profile?.department || 'غير محدد'}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                رقم الطالب: {profile?.student_id}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {profile?.specialization || 'عام'}
              </Badge>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-medium transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground truncate">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-university-blue" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:scale-105 transition-all duration-200"
                  onClick={() => onTabChange?.(action.tab)}
                >
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-university-blue" />
                آخر الدرجات
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onTabChange?.('grades')}
              >
                عرض الكل
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.grades?.length ? (
              <div className="space-y-3">
                {dashboardData.grades.slice(0, 3).map((grade: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">المقرر {index + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        الدرجة: {grade.total_grade || 'لم تحدد'}
                      </p>
                    </div>
                    <Badge variant={grade.total_grade >= 60 ? "default" : "destructive"}>
                      {grade.letter_grade || 'غ.م'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>لا توجد درجات متاحة حالياً</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-university-blue" />
                الإشعارات الحديثة
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onTabChange?.('notifications')}
              >
                عرض الكل
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.unreadNotifications?.length ? (
              <div className="space-y-3">
                {dashboardData.unreadNotifications.slice(0, 3).map((notification: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>لا توجد إشعارات جديدة</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      {dashboardData?.upcomingAppointments?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-university-blue" />
              المواعيد القادمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.upcomingAppointments.map((appointment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{appointment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(appointment.appointment_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Badge variant="outline">{appointment.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedDashboard;