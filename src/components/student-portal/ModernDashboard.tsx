
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  Bell,
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalCredits: number;
  gpa: number;
  completedCourses: number;
  pendingRequests: number;
  unreadNotifications: number;
}

const ModernDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCredits: 0,
    gpa: 0,
    completedCourses: 0,
    pendingRequests: 0,
    unreadNotifications: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // تحديث التاريخ الحالي
    setCurrentDate(new Date().toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!profile?.id) return;
      
      setIsLoading(true);
      try {
        // جلب الإحصائيات من قاعدة البيانات
        const [gradesResult, requestsResult, notificationsResult] = await Promise.all([
          supabase
            .from('grades')
            .select('total_grade, gpa_points')
            .eq('student_id', profile.id),
          supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', profile.id)
            .eq('status', 'pending'),
          supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', profile.id)
            .eq('is_read', false)
        ]);

        // حساب الإحصائيات
        const grades = gradesResult.data || [];
        const completedGrades = grades.filter(g => g.total_grade && g.total_grade >= 50);
        const totalGpa = grades.reduce((sum, g) => sum + (g.gpa_points || 0), 0);
        const averageGpa = grades.length > 0 ? totalGpa / grades.length : 0;

        setStats({
          totalCredits: completedGrades.length * 3, // افتراض 3 ساعات لكل مقرر
          gpa: Math.round(averageGpa * 100) / 100,
          completedCourses: completedGrades.length,
          pendingRequests: requestsResult.count || 0,
          unreadNotifications: notificationsResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [profile?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">جاري تحميل لوحة التحكم...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <Card className="border-0 shadow-2xl rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3">
                  مرحباً بك، {profile?.first_name || 'الطالب'}
                </h1>
                <p className="text-xl text-blue-100 mb-2">
                  {currentDate}
                </p>
                <div className="flex items-center gap-4 text-blue-100">
                  <span>الرقم الجامعي: {profile?.student_id}</span>
                  <span>•</span>
                  <span>{profile?.college}</span>
                </div>
              </div>
              <div className="hidden md:block">
                <GraduationCap className="h-24 w-24 text-white/20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">الساعات المكتسبة</p>
                  <p className="text-3xl font-bold">{stats.totalCredits}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <BookOpen className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">المعدل التراكمي</p>
                  <p className="text-3xl font-bold">{stats.gpa.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">المقررات المكتملة</p>
                  <p className="text-3xl font-bold">{stats.completedCourses}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Award className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">الإشعارات الجديدة</p>
                  <p className="text-3xl font-bold">{stats.unreadNotifications}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Bell className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-2xl">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white rounded-xl">
                <FileText className="ml-2 h-5 w-5" />
                عرض كشف الدرجات
              </Button>
              <Button className="w-full justify-start bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white rounded-xl">
                <Calendar className="ml-2 h-5 w-5" />
                الجدول الدراسي
              </Button>
              <Button className="w-full justify-start bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white rounded-xl">
                <Bell className="ml-2 h-5 w-5" />
                الإشعارات
                {stats.unreadNotifications > 0 && (
                  <Badge variant="secondary" className="mr-2">
                    {stats.unreadNotifications}
                  </Badge>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-2xl">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                الطلبات المعلقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.pendingRequests === 0 ? (
                <div className="text-center py-8">
                  <div className="p-4 bg-green-50 rounded-2xl w-fit mx-auto mb-4">
                    <Award className="h-12 w-12 text-green-500" />
                  </div>
                  <p className="text-gray-600 font-medium">لا توجد طلبات معلقة</p>
                  <p className="text-sm text-gray-400">جميع طلباتك تم معالجتها</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-orange-50 rounded-2xl w-fit mx-auto mb-4">
                    <Clock className="h-12 w-12 text-orange-500" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    لديك {stats.pendingRequests} طلب معلق
                  </p>
                  <Button className="mt-4 bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white rounded-xl">
                    عرض الطلبات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
