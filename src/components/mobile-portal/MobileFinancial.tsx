import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Download
} from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import MobilePaymentModal from './MobilePaymentModal';
import MobileFinancialStatementModal from './MobileFinancialStatementModal';
import PaymentDetailsModal from './PaymentDetailsModal';

const MobileFinancial = () => {
  const { data: payments, isLoading } = usePayments();
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // حساب الإحصائيات المالية
  const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const totalDue = 450000; // المبلغ الإجمالي المطلوب للفصل
  const remainingAmount = Math.max(0, totalDue - totalPaid);
  const paymentProgress = (totalPaid / totalDue) * 100;

  const getPaymentStatusBadge = (payment: any) => {
    // تحديد حالة الدفع بناءً على وجود payment_date
    const status = payment.payment_date ? 'completed' : 'pending';
    
    const statusConfig = {
      completed: { label: 'مدفوع', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      pending: { label: 'غير مدفوع', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'فشل', icon: AlertCircle, className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.className} border-0 gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="px-3 py-3 space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-3 py-3 space-y-3">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-1">الشؤون المالية</h1>
        <p className="text-sm text-gray-600">إدارة المدفوعات والرسوم الدراسية</p>
      </div>

      {/* Financial Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm opacity-90">إجمالي المدفوع</h3>
              <p className="text-2xl font-bold">{totalPaid.toLocaleString()} ريال</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>تقدم الدفع</span>
              <span>{paymentProgress.toFixed(1)}%</span>
            </div>
            <Progress value={paymentProgress} className="h-2 bg-white/20" />
            <div className="flex justify-between text-xs opacity-75">
              <span>المتبقي: {remainingAmount.toLocaleString()} ريال</span>
              <span>الإجمالي: {totalDue.toLocaleString()} ريال</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800">دفع جديد</h3>
            <p className="text-xs text-gray-600 mb-3">ادفع الرسوم المستحقة</p>
            <Button 
              size="sm" 
              className="w-full rounded-xl text-xs"
              onClick={() => setShowPaymentModal(true)}
            >
              ادفع الآن
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800">البيان المالي</h3>
            <p className="text-xs text-gray-600 mb-3">عرض تفاصيل الرسوم</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full rounded-xl text-xs"
              onClick={() => setShowStatementModal(true)}
            >
              عرض البيان
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">سجل المدفوعات</h2>
          <Button variant="ghost" size="sm" className="text-xs">
            عرض الكل
          </Button>
        </div>

        {payments && payments.length > 0 ? (
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <Card key={payment.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">
                            دفعة مالية
                          </h3>
                          <p className="text-lg font-bold text-blue-600">
                            {payment.amount.toLocaleString()} ريال
                          </p>
                        </div>
                        {getPaymentStatusBadge(payment)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(payment.created_at), 'dd MMM yyyy', { locale: ar })}</span>
                        </div>
                        {payment.invoice_number && (
                          <span>رقم الفاتورة: {payment.invoice_number}</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 rounded-xl text-xs"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentDetails(true);
                          }}
                        >
                          <Eye className="w-3 h-3 ml-1" />
                          تفاصيل
                        </Button>
                        {payment.payment_date && (
                          <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs">
                            <Download className="w-3 h-3 ml-1" />
                            إيصال
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium text-gray-600 mb-1">لا توجد مدفوعات</h3>
              <p className="text-sm text-gray-500">لم تقم بأي عمليات دفع بعد</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <MobilePaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
      
      <MobileFinancialStatementModal 
        isOpen={showStatementModal} 
        onClose={() => setShowStatementModal(false)} 
      />

      <PaymentDetailsModal
        isOpen={showPaymentDetails}
        onClose={() => {
          setShowPaymentDetails(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
    </div>
  );
};

export default MobileFinancial;