import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download, 
  Eye,
  CheckCircle, 
  AlertCircle, 
  Clock,
  Receipt,
  Calculator,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FinancialServicesComplete = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Fetch financial data
  const { data: financialData, isLoading, refetch } = useQuery({
    queryKey: ['financial', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }

      // Calculate statistics
      const totalPaid = data?.filter(p => p.payment_status === 'مدفوع')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const totalPending = data?.filter(p => p.payment_status === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const totalOverdue = data?.filter(p => 
        p.payment_status === 'pending' && new Date(p.due_date) < new Date()
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      return {
        payments: data || [],
        totalPaid,
        totalPending,
        totalOverdue,
        paidCount: data?.filter(p => p.payment_status === 'مدفوع').length || 0,
        pendingCount: data?.filter(p => p.payment_status === 'pending').length || 0
      };
    },
    enabled: !!profile?.id,
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث البيانات المالية بنجاح",
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentIcon = (status: string) => {
    switch (status) {
      case 'مدفوع': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return CreditCard;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-academic-gray-light rounded w-48"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-academic-gray-light rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-section-title">الشؤون المالية</h2>
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {(financialData?.totalPaid || 0).toLocaleString()}
            </div>
            <div className="text-sm opacity-90">المبلغ المدفوع (ريال)</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {(financialData?.totalPending || 0).toLocaleString()}
            </div>
            <div className="text-sm opacity-90">المبلغ المستحق (ريال)</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {(financialData?.totalOverdue || 0).toLocaleString()}
            </div>
            <div className="text-sm opacity-90">المبلغ المتأخر (ريال)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Receipt className="h-8 w-8 mx-auto mb-2 text-university-blue" />
            <div className="text-2xl font-bold text-university-blue">
              {financialData?.payments?.length || 0}
            </div>
            <div className="text-sm text-academic-gray">إجمالي المعاملات</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-university-blue" />
            سجل المدفوعات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialData?.payments.map((payment: any) => {
            const StatusIcon = getPaymentIcon(payment.payment_status);
            const isOverdue = payment.payment_status === 'pending' && 
              new Date(payment.due_date) < new Date();
            
            return (
              <Card key={payment.id} className={`border-r-4 ${
                payment.payment_status === 'مدفوع' ? 'border-r-green-500' : 
                isOverdue ? 'border-r-red-500' : 'border-r-yellow-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <StatusIcon className={`h-6 w-6 mt-1 ${
                          payment.payment_status === 'مدفوع' ? 'text-green-600' :
                          isOverdue ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div>
                          <h3 className="text-lg font-semibold text-university-blue">
                            {payment.payment_type}
                          </h3>
                          <p className="text-sm text-academic-gray">
                            {payment.semester} - {payment.academic_year}
                          </p>
                          {payment.notes && (
                            <p className="text-xs text-academic-gray mt-1">
                              {payment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      {/* Payment Details */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-university-blue">
                          {payment.amount.toLocaleString()} ريال
                        </div>
                        {payment.payment_method && (
                          <p className="text-xs text-academic-gray">
                            طريقة الدفع: {payment.payment_method}
                          </p>
                        )}
                      </div>
                      
                      {/* Dates */}
                      <div className="text-right text-sm">
                        {payment.payment_date && (
                          <div className="text-green-600 font-medium">
                            تاريخ الدفع: {new Date(payment.payment_date).toLocaleDateString('ar-YE')}
                          </div>
                        )}
                        <div className="text-academic-gray">
                          تاريخ الاستحقاق: {new Date(payment.due_date).toLocaleDateString('ar-YE')}
                        </div>
                        {payment.reference_number && (
                          <div className="text-xs text-academic-gray">
                            رقم المرجع: {payment.reference_number}
                          </div>
                        )}
                      </div>
                      
                      {/* Status & Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          className={`${getPaymentStatusColor(
                            isOverdue ? 'overdue' : payment.payment_status
                          )} border text-xs`}
                        >
                          {isOverdue ? 'متأخر' : 
                           payment.payment_status === 'مدفوع' ? 'مدفوع' : 'مستحق'}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            عرض
                          </Button>
                          {payment.payment_status === 'مدفوع' && payment.receipt_url && (
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              تحميل
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {(!financialData?.payments || financialData.payments.length === 0) && (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-academic-gray mx-auto mb-4" />
              <p className="text-lg text-academic-gray">لا توجد معاملات مالية</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-university-blue" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                name: 'حاسبة الرسوم', 
                icon: Calculator, 
                color: 'bg-blue-500',
                description: 'حساب الرسوم الدراسية'
              },
              { 
                name: 'طلب إيصال', 
                icon: Receipt, 
                color: 'bg-green-500',
                description: 'طلب إيصال دفع'
              },
              { 
                name: 'تقرير مالي', 
                icon: BarChart3, 
                color: 'bg-purple-500',
                description: 'تحميل التقرير المالي'
              },
              { 
                name: 'دفع أونلاين', 
                icon: CreditCard, 
                color: 'bg-orange-500',
                description: 'الدفع الإلكتروني'
              }
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 rounded-lg bg-academic-gray-light hover:bg-university-blue hover:text-white transition-all duration-300 text-center group"
              >
                <action.icon className="h-8 w-8 mx-auto mb-2 group-hover:text-white text-university-blue" />
                <p className="font-medium mb-1">{action.name}</p>
                <p className="text-xs text-academic-gray group-hover:text-white/80">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialServicesComplete;