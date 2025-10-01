import React from 'react';
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
  CheckCircle,
  Activity,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ModernAdminDashboard: React.FC = () => {
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
    color = "default",
    progress
  }: {
    title: string;
    value: string | number;
    icon: any;
    description: string;
    trend?: string;
    color?: "default" | "success" | "warning" | "danger";
    progress?: number;
  }) => {
    const gradients = {
      default: "from-blue-500/10 to-blue-600/5",
      success: "from-emerald-500/10 to-emerald-600/5", 
      warning: "from-amber-500/10 to-amber-600/5",
      danger: "from-red-500/10 to-red-600/5"
    };

    const iconColors = {
      default: "text-blue-600",
      success: "text-emerald-600",
      warning: "text-amber-600", 
      danger: "text-red-600"
    };

    return (
      <Card className={`relative overflow-hidden border-0 shadow-sm bg-gradient-to-br ${gradients[color]} hover:shadow-lg transition-all duration-300 group`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <div className="text-2xl font-bold text-foreground">{value}</div>
            </div>
            <div className={`p-3 rounded-xl bg-background/50 ${iconColors[color]} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-muted-foreground">{description}</p>
          {progress !== undefined && (
            <Progress value={progress} className="h-1" />
          )}
          {trend && (
            <Badge variant="secondary" className="text-xs w-fit">
              {trend}
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  const ActivityCard = ({ title, items }: { title: string; items: Array<{ label: string; value: string; time: string; status?: string }> }) => (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="space-y-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.time}
              </p>
            </div>
            <div className="text-left space-y-1">
              <p className="text-sm font-bold">{item.value}</p>
              {item.status && (
                <Badge variant={item.status === 'success' ? 'default' : 'secondary'} className="text-xs">
                  {item.status}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const paymentProgress = dashboardStats?.totalPayments > 0 
    ? ((dashboardStats?.paidPayments || 0) / (dashboardStats?.totalPayments || 1)) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-muted-foreground">
            نظرة شاملة على أداء النظام والإحصائيات الحديثة
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            النظام يعمل بشكل طبيعي
          </Badge>
          <Badge variant="secondary">
            {new Date().toLocaleDateString('ar-EG', {
              month: 'short',
              day: 'numeric'
            })}
          </Badge>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الطلاب"
          value={dashboardStats?.totalStudents || 0}
          icon={Users}
          description="الطلاب النشطون في النظام"
          color="default"
          trend="↗ +12% هذا الشهر"
        />
        <StatCard
          title="إجمالي المدفوعات"
          value={formatCurrency(dashboardStats?.totalPayments || 0)}
          icon={DollarSign}
          description="جميع المدفوعات المسجلة"
          color="success"
          progress={paymentProgress}
          trend="↗ +8% من الشهر الماضي"
        />
        <StatCard
          title="الإشعارات غير المقروءة"
          value={dashboardStats?.unreadNotifications || 0}
          icon={Bell}
          description="تحتاج إلى متابعة"
          color={dashboardStats?.unreadNotifications > 0 ? "warning" : "default"}
          trend={dashboardStats?.unreadNotifications > 0 ? "يتطلب انتباه" : "تحت السيطرة"}
        />
        <StatCard
          title="الإشعارات العاجلة"
          value={dashboardStats?.urgentNotifications || 0}
          icon={AlertTriangle}
          description="أولوية عالية وعاجلة"
          color={dashboardStats?.urgentNotifications > 0 ? "danger" : "default"}
          trend={dashboardStats?.urgentNotifications > 0 ? "⚠ يتطلب إجراء فوري" : "✓ لا توجد عاجلة"}
        />
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details */}
        <Card className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/50 border-emerald-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              تفاصيل المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">المدفوعات المكتملة</span>
                <span className="font-bold text-emerald-600">
                  {formatCurrency(dashboardStats?.paidPayments || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">المدفوعات المعلقة</span>
                <Badge variant="secondary">
                  {dashboardStats?.pendingPayments || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>نسبة الإنجاز</span>
                  <span>{Math.round(paymentProgress)}%</span>
                </div>
                <Progress value={paymentProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Overview */}
        <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/50 border-blue-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              النظام الأكاديمي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-blue-600">{dashboardStats?.totalGrades || 0}</div>
                <div className="text-xs text-muted-foreground">إجمالي الدرجات</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-blue-600">{dashboardStats?.totalStudents || 0}</div>
                <div className="text-xs text-muted-foreground">الطلاب النشطون</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">معدل الأداء ممتاز</span>
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card className="bg-gradient-to-br from-purple-50/50 to-purple-100/50 border-purple-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              أداء النظام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">الخوادم تعمل بكفاءة عالية</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">آخر تحديث: اليوم</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="text-sm">معدل الاستجابة: 99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityCard
          title="النشاطات الأخيرة"
          items={[
            { label: "طالب جديد مسجل", value: "+1", time: "منذ 5 دقائق", status: "success" },
            { label: "مدفوعة جديدة", value: formatCurrency(15000), time: "منذ 15 دقيقة", status: "success" },
            { label: "إشعار جديد", value: "مهم", time: "منذ 30 دقيقة" },
            { label: "تقرير شهري", value: "جاهز", time: "منذ ساعة", status: "success" }
          ]}
        />
        
        <ActivityCard
          title="مهام معلقة"
          items={[
            { label: "مراجعة طلبات التسجيل", value: "5", time: "يتطلب مراجعة" },
            { label: "الموافقة على الوثائق", value: "3", time: "عاجل" },
            { label: "تحديث البيانات", value: "2", time: "هذا الأسبوع" },
            { label: "إرسال تقارير", value: "1", time: "نهاية الشهر" }
          ]}
        />
      </div>
    </div>
  );
};

export default ModernAdminDashboard;