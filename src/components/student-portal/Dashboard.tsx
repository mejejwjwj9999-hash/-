
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Calendar,
  CreditCard,
  FileText,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen,
  Users,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { profile } = useAuth();

  // Fetch recent grades
  const { data: recentGrades } = useQuery({
    queryKey: ['recent-grades', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          courses (course_name_ar, course_code)
        `)
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching grades:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Fetch upcoming classes
  const { data: upcomingClasses } = useQuery({
    queryKey: ['upcoming-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_schedule')
        .select(`
          *,
          courses (course_name_ar, course_code)
        `)
        .order('day_of_week')
        .limit(3);
      
      if (error) {
        console.error('Error fetching schedule:', error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch recent payments
  const { data: recentPayments } = useQuery({
    queryKey: ['recent-payments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching payments:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('student_id', profile.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const quickStats = [
    {
      title: 'المعدل التراكمي',
      value: '3.75',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+0.12',
      changeType: 'positive'
    },
    {
      title: 'الساعات المكتملة',
      value: '85',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+6',
      changeType: 'positive'
    },
    {
      title: 'المقررات الحالية',
      value: '6',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: '0',
      changeType: 'neutral'
    },
    {
      title: 'الإشعارات الجديدة',
      value: notifications?.length || 0,
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: '+2',
      changeType: 'positive'
    },
  ];

  const quickActions = [
    { title: 'الجدول الدراسي', icon: Calendar, href: '#', color: 'bg-blue-500' },
    { title: 'الدرجات', icon: GraduationCap, href: '#', color: 'bg-green-500' },
    { title: 'المدفوعات', icon: CreditCard, href: '#', color: 'bg-purple-500' },
    { title: 'الوثائق', icon: FileText, href: '#', color: 'bg-orange-500' },
  ];

  const getDayName = (dayNumber: number) => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[dayNumber - 1] || '';
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'pending':
        return 'معلقة';
      case 'failed':
        return 'فاشلة';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-university-blue to-university-blue/90 rounded-2xl p-6 md:p-8 shadow-university">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  مرحباً، {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-blue-100 text-sm md:text-base">
                  نتمنى لك يوماً دراسياً موفقاً في كلية {profile?.college}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs md:text-sm">
                  السنة {profile?.academic_year}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs md:text-sm">
                  الفصل {profile?.semester}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs md:text-sm">
                  {profile?.student_id}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`relative overflow-hidden border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 md:p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.color}`} />
                    </div>
                    {stat.change !== '0' && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Star className="w-5 h-5 text-university-gold" />
              الإجراءات السريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 md:h-20 flex-col gap-2 hover:shadow-md transition-all duration-300 hover:scale-105 border-2"
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-xs md:text-sm font-medium">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recent Grades */}
          <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-university-blue" />
                آخر الدرجات
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-university-blue hover:bg-university-blue/10">
                عرض الكل
                <ArrowRight className="w-4 h-4 mr-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentGrades && recentGrades.length > 0 ? (
                recentGrades.map((grade: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border hover:shadow-sm transition-all duration-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm md:text-base">
                        {grade.courses?.course_name_ar || 'مقرر غير محدد'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {grade.courses?.course_code}
                      </p>
                    </div>
                    <div className="text-left">
                      <Badge 
                        variant={grade.letter_grade === 'A+' ? 'default' : 'secondary'}
                        className="mb-1"
                      >
                        {grade.letter_grade || 'غير محدد'}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {grade.total_grade || 0}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">لا توجد درجات متاحة حالياً</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-university-blue" />
                الجدول الدراسي
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-university-blue hover:bg-university-blue/10">
                عرض الكل
                <ArrowRight className="w-4 h-4 mr-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingClasses && upcomingClasses.length > 0 ? (
                upcomingClasses.map((class_item: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border hover:shadow-sm transition-all duration-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm md:text-base">
                        {class_item.courses?.course_name_ar || 'مقرر غير محدد'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {class_item.instructor_name} - {class_item.classroom}
                      </p>
                    </div>
                    <div className="text-left">
                      <Badge variant="outline" className="mb-1 text-xs">
                        {getDayName(class_item.day_of_week)}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {class_item.start_time} - {class_item.end_time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">لا توجد جلسات دراسية متاحة</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300 lg:col-span-2 xl:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-university-blue" />
                الإشعارات الجديدة
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-university-blue hover:bg-university-blue/10">
                عرض الكل
                <ArrowRight className="w-4 h-4 mr-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification: any, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-xl border hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm md:text-base flex-1">
                        {notification.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className="text-xs mr-2 bg-orange-100 text-orange-700"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString('ar-SA')}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">لا توجد إشعارات جديدة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        {recentPayments && recentPayments.length > 0 && (
          <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-university-blue" />
                آخر المدفوعات
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-university-blue hover:bg-university-blue/10">
                عرض الكل
                <ArrowRight className="w-4 h-4 mr-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPayments.map((payment: any, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl border hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm md:text-base">
                        {payment.payment_type}
                      </h4>
                      <Badge 
                        className={`text-xs border ${getPaymentStatusColor(payment.payment_status)}`}
                        variant="secondary"
                      >
                        {getPaymentStatusText(payment.payment_status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg text-gray-900">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Section */}
        <Card className="shadow-soft hover:shadow-medium transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-university-blue" />
              تقدم الدراسة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between text-sm mb-3 gap-2">
                  <span className="font-medium">إجمالي الساعات المطلوبة: 150</span>
                  <span className="font-medium">الساعات المكتملة: 85</span>
                </div>
                <Progress value={56.7} className="h-3 mb-2" />
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-medium text-gray-700">
                    57% مكتمل - استمر بالعمل الرائع!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
