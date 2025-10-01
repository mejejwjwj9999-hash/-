
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  GraduationCap, 
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import LoadingSkeleton from '@/components/ui/loading-skeleton';

const EnhancedOverview: React.FC = () => {
  // جلب إحصائيات الطلاب
  const { data: studentsStats, isLoading: studentsLoading } = useQuery({
    queryKey: ['students-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*');
      
      if (error) throw error;
      
      // حساب الإحصائيات
      const totalStudents = data?.length || 0;
      const activeStudents = data?.filter(s => s.status === 'active').length || 0;
      const departments = data?.reduce((acc: any, student) => {
        acc[student.department] = (acc[student.department] || 0) + 1;
        return acc;
      }, {}) || {};
      
      return {
        totalStudents,
        activeStudents,
        departments: Object.entries(departments).map(([name, count]) => ({
          name,
          count
        }))
      };
    }
  });

  // جلب إحصائيات المدفوعات
  const { data: paymentsStats, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('amount, payment_status, created_at');
      
      if (error) throw error;
      
      const totalRevenue = data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const paidPayments = data?.filter(p => p.payment_status === 'completed') || [];
      const pendingPayments = data?.filter(p => p.payment_status === 'pending') || [];
      
      return {
        totalRevenue,
        collectedAmount: paidPayments.reduce((sum, payment) => sum + payment.amount, 0),
        pendingAmount: pendingPayments.reduce((sum, payment) => sum + payment.amount, 0),
        paymentsCount: data?.length || 0
      };
    }
  });

  // جلب إحصائيات الدرجات
  const { data: gradesStats, isLoading: gradesLoading } = useQuery({
    queryKey: ['grades-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select('total_grade, letter_grade, status');
      
      if (error) throw error;
      
      const completedGrades = data?.filter(g => g.status === 'completed') || [];
      const averageGrade = completedGrades.reduce((sum, grade) => sum + (grade.total_grade || 0), 0) / (completedGrades.length || 1);
      
      return {
        totalGrades: data?.length || 0,
        averageGrade: averageGrade.toFixed(2),
        completedCourses: completedGrades.length
      };
    }
  });

  if (studentsLoading || paymentsLoading || gradesLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              إجمالي الطلاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {studentsStats?.totalStudents || 0}
            </div>
            <Badge variant="secondary" className="mt-2">
              نشط: {studentsStats?.activeStudents || 0}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              الإيرادات المحصلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${paymentsStats?.collectedAmount?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              معلق: ${paymentsStats?.pendingAmount?.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              متوسط الدرجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {gradesStats?.averageGrade || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              مقررات مكتملة: {gradesStats?.completedCourses || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {paymentsStats?.paymentsCount || 0}
            </div>
            <Badge variant="outline" className="mt-2">
              إجمالي المعاملات
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              توزيع الطلاب حسب القسم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsStats?.departments || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--university-blue))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              حالة المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">مدفوعات مكتملة</span>
                <span className="text-green-600 font-bold">
                  ${paymentsStats?.collectedAmount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="font-medium">مدفوعات معلقة</span>
                <span className="text-orange-600 font-bold">
                  ${paymentsStats?.pendingAmount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="font-medium">إجمالي الإيرادات</span>
                <span className="text-blue-600 font-bold">
                  ${paymentsStats?.totalRevenue?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedOverview;
