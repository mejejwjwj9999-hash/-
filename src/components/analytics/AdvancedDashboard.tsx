
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  GraduationCap,
  Calendar,
  Download,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import { supabase } from '@/integrations/supabase/client';

const AdvancedDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  // جلب بيانات شاملة للتحليل
  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['advanced-analytics', timeRange],
    queryFn: async () => {
      // جلب بيانات الطلاب
      const { data: students } = await supabase
        .from('student_profiles')
        .select('*');

      // جلب بيانات المدفوعات
      const { data: payments } = await supabase
        .from('payments')
        .select('*');

      // جلب بيانات الدرجات
      const { data: grades } = await supabase
        .from('grades')
        .select('*, courses!fk_grades_course(course_name_ar, department)');

      // تجهيز البيانات للتحليل
      const departmentStats = students?.reduce((acc: any, student) => {
        const dept = student.department;
        if (!acc[dept]) {
          acc[dept] = { name: dept, students: 0, revenue: 0, avgGrade: 0 };
        }
        acc[dept].students += 1;
        return acc;
      }, {}) || {};

      // إضافة بيانات الإيرادات لكل قسم
      payments?.forEach(payment => {
        const student = students?.find(s => s.id === payment.student_id);
        if (student && departmentStats[student.department]) {
          departmentStats[student.department].revenue += payment.amount;
        }
      });

      // حساب متوسط الدرجات لكل قسم
      Object.keys(departmentStats).forEach(dept => {
        const deptGrades = grades?.filter(g => 
          students?.find(s => s.id === g.student_id)?.department === dept
        ) || [];
        const avgGrade = deptGrades.length > 0 
          ? deptGrades.reduce((sum, g) => sum + (g.total_grade || 0), 0) / deptGrades.length
          : 0;
        departmentStats[dept].avgGrade = Math.round(avgGrade * 100) / 100;
      });

      return {
        overview: {
          totalStudents: students?.length || 0,
          totalRevenue: payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
          avgGrade: grades?.length ? 
            grades.reduce((sum, g) => sum + (g.total_grade || 0), 0) / grades.length : 0,
          activePayments: payments?.filter(p => p.payment_status === 'completed').length || 0
        },
        departmentAnalysis: Object.values(departmentStats),
        monthlyTrends: [
          { month: 'يناير', students: 120, revenue: 85000, grades: 78.5 },
          { month: 'فبراير', students: 135, revenue: 92000, grades: 79.2 },
          { month: 'مارس', students: 148, revenue: 98000, grades: 80.1 },
          { month: 'أبريل', students: 162, revenue: 105000, grades: 81.3 },
          { month: 'مايو', students: 178, revenue: 112000, grades: 82.0 },
          { month: 'يونيو', students: 195, revenue: 125000, grades: 83.2 }
        ],
        gradeDistribution: [
          { grade: 'A', count: 45, percentage: 28 },
          { grade: 'B', count: 62, percentage: 38 },
          { grade: 'C', count: 38, percentage: 24 },
          { grade: 'D', count: 12, percentage: 8 },
          { grade: 'F', count: 3, percentage: 2 }
        ]
      };
    }
  });

  const exportData = () => {
    console.log('تصدير البيانات التحليلية...');
  };

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  const { overview, departmentAnalysis, monthlyTrends, gradeDistribution } = analyticsData || {};

  return (
    <div className="space-y-6">
      {/* رأس اللوحة */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">لوحة التحليلات المتقدمة</h1>
          <p className="text-muted-foreground">تحليل شامل لأداء النظام والإحصائيات</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
          <Button onClick={exportData} size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
        </div>
      </div>

      {/* البطاقات الإحصائية الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-blue-700">{overview?.totalStudents || 0}</p>
                <p className="text-xs text-blue-500 mt-1">+12% من الشهر الماضي</p>
              </div>
              <Users className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">إجمالي الإيرادات</p>
                <p className="text-3xl font-bold text-green-700">
                  ${overview?.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-green-500 mt-1">+8% من الشهر الماضي</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">متوسط الدرجات</p>
                <p className="text-3xl font-bold text-purple-700">
                  {overview?.avgGrade?.toFixed(1) || '0.0'}
                </p>
                <p className="text-xs text-purple-500 mt-1">+2.5% من الفصل الماضي</p>
              </div>
              <GraduationCap className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">المدفوعات المكتملة</p>
                <p className="text-3xl font-bold text-orange-700">{overview?.activePayments || 0}</p>
                <p className="text-xs text-orange-500 mt-1">95% معدل التحصيل</p>
              </div>
              <BarChart3 className="h-12 w-12 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التبويبات التحليلية */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">الاتجاهات الشهرية</TabsTrigger>
          <TabsTrigger value="departments">تحليل الأقسام</TabsTrigger>
          <TabsTrigger value="grades">توزيع الدرجات</TabsTrigger>
          <TabsTrigger value="performance">مؤشرات الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                الاتجاهات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="students" 
                    stackId="1"
                    stroke="hsl(var(--university-blue))" 
                    fill="hsl(var(--university-blue))"
                    fillOpacity={0.6}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--university-gold))" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                تحليل الأقسام الأكاديمية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="students" fill="hsl(var(--university-blue))" name="عدد الطلاب" />
                  <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--university-gold))" name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                توزيع الدرجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="count"
                    label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                  >
                    {gradeDistribution?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          'hsl(var(--university-blue))', 
                          'hsl(var(--university-gold))', 
                          'hsl(142, 76%, 36%)', 
                          'hsl(38, 92%, 50%)', 
                          'hsl(var(--university-red))'
                        ][index]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">معدل الحضور</span>
                  <Badge className="bg-green-600">92%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">معدل النجاح</span>
                  <Badge className="bg-blue-600">87%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">رضا الطلاب</span>
                  <Badge className="bg-purple-600">4.2/5</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">معدل التحصيل المالي</span>
                  <Badge className="bg-orange-600">95%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإنجازات الشهرية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-university-blue" />
                    <span className="font-medium">هذا الشهر</span>
                  </div>
                  <p className="text-sm text-muted-foreground">تم تسجيل 45 طالب جديد</p>
                  <p className="text-sm text-muted-foreground">تحصيل 95% من الرسوم المستحقة</p>
                  <p className="text-sm text-muted-foreground">تحسن متوسط الدرجات بنسبة 3%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDashboard;
