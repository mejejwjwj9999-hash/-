
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Bell, 
  GraduationCap,
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboardFixed: React.FC = () => {
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [studentsRes, paymentsRes, notificationsRes, gradesRes] = await Promise.all([
        supabase.from('student_profiles').select('id, status').eq('status', 'active'),
        supabase.from('payments').select('id, amount, payment_status, currency'),
        supabase.from('notifications').select('id, is_read, priority'),
        supabase.from('grades').select('id, letter_grade')
      ]);

      const totalStudents = studentsRes.data?.length || 0;
      const totalPayments = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const paidPayments = paymentsRes.data?.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const pendingPayments = paymentsRes.data?.filter(p => p.payment_status === 'pending').length || 0;
      const unreadNotifications = notificationsRes.data?.filter(n => !n.is_read).length || 0;
      const urgentNotifications = notificationsRes.data?.filter(n => n.priority === 'high' || n.priority === 'urgent').length || 0;

      return {
        totalStudents,
        totalPayments,
        paidPayments,
        pendingPayments,
        unreadNotifications,
        urgentNotifications,
        totalGrades: gradesRes.data?.length || 0
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER'
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend,
    color = "default"
  }: {
    title: string;
    value: string | number;
    icon: any;
    description: string;
    trend?: string;
    color?: "default" | "success" | "warning" | "danger";
  }) => {
    const colorClasses = {
      default: "border-l-4 border-l-blue-500 bg-blue-50/50",
      success: "border-l-4 border-l-green-500 bg-green-50/50", 
      warning: "border-l-4 border-l-yellow-500 bg-yellow-50/50",
      danger: "border-l-4 border-l-red-500 bg-red-50/50"
    };

    const iconColors = {
      default: "text-blue-600",
      success: "text-green-600",
      warning: "text-yellow-600", 
      danger: "text-red-600"
    };

    return (
      <Card className={`${colorClasses[color]} hover:shadow-md transition-all duration-200`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${iconColors[color]}`} />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">{description}</p>
            {trend && (
              <Badge variant="outline" className="text-xs">
                {trend}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* العنوان الرئيسي */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-gray-600 mt-1">
            نظرة شاملة على أداء النظام والإحصائيات
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {new Date().toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Badge>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الطلاب"
          value={dashboardStats?.totalStudents || 0}
          icon={Users}
          description="الطلاب النشطون"
          color="default"
        />
        <StatCard
          title="إجمالي المدفوعات"
          value={formatCurrency(dashboardStats?.totalPayments || 0)}
          icon={DollarSign}
          description="جميع المدفوعات"
          color="success"
        />
        <StatCard
          title="الإشعارات غير المقروءة"
          value={dashboardStats?.unreadNotifications || 0}
          icon={Bell}
          description="تحتاج متابعة"
          color={dashboardStats?.unreadNotifications > 0 ? "warning" : "default"}
        />
        <StatCard
          title="الإشعارات العاجلة"
          value={dashboardStats?.urgentNotifications || 0}
          icon={AlertTriangle}
          description="أولوية عالية"
          color={dashboardStats?.urgentNotifications > 0 ? "danger" : "default"}
        />
      </div>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              حالة المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">المدفوعات المكتملة</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(dashboardStats?.paidPayments || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">المدفوعات المعلقة</span>
              <Badge variant="secondary">
                {dashboardStats?.pendingPayments || 0}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${dashboardStats?.totalPayments > 0 
                    ? ((dashboardStats?.paidPayments || 0) / (dashboardStats?.totalPayments || 1)) * 100 
                    : 0}%`
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              نظام الدرجات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">إجمالي الدرجات</span>
              <span className="font-semibold">{dashboardStats?.totalGrades || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">الطلاب النشطون</span>
              <Badge variant="default">
                {dashboardStats?.totalStudents || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              الأداء العام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">النظام يعمل بشكل طبيعي</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">آخر تحديث اليوم</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardFixed;
