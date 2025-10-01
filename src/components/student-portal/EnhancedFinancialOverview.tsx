import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  CreditCard,
  Receipt,
  Calculator,
  PieChart
} from 'lucide-react';

interface FinancialOverviewProps {
  onTabChange?: (tab: string) => void;
}

const EnhancedFinancialOverview = ({ onTabChange }: FinancialOverviewProps) => {
  const { profile } = useAuth();

  const { data: payments } = useQuery({
    queryKey: ['student-payments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Calculate financial statistics
  const totalPaid = payments?.filter(p => p.payment_status === 'completed')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  
  const totalPending = payments?.filter(p => p.payment_status === 'pending')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  
  const totalOverdue = payments?.filter(p => {
    const dueDate = new Date(p.due_date || '');
    return p.payment_status === 'pending' && dueDate < new Date();
  }).reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

  const paymentStats = {
    completed: payments?.filter(p => p.payment_status === 'completed').length || 0,
    pending: payments?.filter(p => p.payment_status === 'pending').length || 0,
    overdue: payments?.filter(p => {
      const dueDate = new Date(p.due_date || '');
      return p.payment_status === 'pending' && dueDate < new Date();
    }).length || 0,
  };

  const totalDue = totalPaid + totalPending;
  const paymentProgress = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">مكتمل</Badge>;
      case 'pending':
        return <Badge variant="secondary">معلق</Badge>;
      case 'overdue':
        return <Badge variant="destructive">متأخر</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">إجمالي المدفوع</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {paymentStats.completed} دفعة مكتملة
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">المبلغ المعلق</CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {paymentStats.pending} دفعة معلقة
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">المبلغ المتأخر</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOverdue)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {paymentStats.overdue} دفعة متأخرة
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">نسبة الإنجاز</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {paymentProgress.toFixed(1)}%
            </div>
            <Progress value={paymentProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              آخر المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{payment.payment_type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {payment.academic_year} - الفصل {payment.semester}
                      </p>
                      {payment.due_date && (
                        <p className="text-xs text-muted-foreground">
                          تاريخ الاستحقاق: {new Date(payment.due_date).toLocaleDateString('ar-SA')}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold">
                        {formatCurrency(payment.amount || 0)}
                      </div>
                      {getPaymentStatusBadge(payment.payment_status || 'pending')}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onTabChange?.('payments')}
                >
                  عرض سجل المدفوعات الكامل
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد مدفوعات مسجلة</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              الإجراءات المالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start h-16"
                onClick={() => onTabChange?.('calculator')}
              >
                <Calculator className="h-6 w-6 ml-3" />
                <div className="text-right flex-1">
                  <div className="font-medium">حاسبة الرسوم</div>
                  <div className="text-sm text-muted-foreground">احسب رسوم الفصل الدراسي</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start h-16"
                onClick={() => onTabChange?.('planner')}
              >
                <PieChart className="h-6 w-6 ml-3" />
                <div className="text-right flex-1">
                  <div className="font-medium">مخطط الدفعات</div>
                  <div className="text-sm text-muted-foreground">جدولة المدفوعات القادمة</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start h-16"
                onClick={() => onTabChange?.('reports')}
              >
                <Receipt className="h-6 w-6 ml-3" />
                <div className="text-right flex-1">
                  <div className="font-medium">التقارير المالية</div>
                  <div className="text-sm text-muted-foreground">عرض وتحميل التقارير</div>
                </div>
              </Button>

              {totalPending > 0 && (
                <Button className="w-full justify-start h-16 bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white">
                  <CreditCard className="h-6 w-6 ml-3" />
                  <div className="text-right flex-1">
                    <div className="font-medium">سداد المدفوعات</div>
                    <div className="text-sm opacity-90">
                      {formatCurrency(totalPending)} معلق
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Schedule */}
      {totalPending > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              جدول المدفوعات المعلقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments?.filter(p => p.payment_status === 'pending').map((payment) => {
                const dueDate = new Date(payment.due_date || '');
                const isOverdue = dueDate < new Date();
                const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={payment.id} className={`p-4 rounded-lg border-l-4 ${
                    isOverdue ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{payment.payment_type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {payment.academic_year} - الفصل {payment.semester}
                        </p>
                        <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                          {isOverdue 
                            ? `متأخر بـ ${Math.abs(daysUntilDue)} يوم`
                            : `متبقي ${daysUntilDue} يوم`
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {formatCurrency(payment.amount || 0)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {dueDate.toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedFinancialOverview;