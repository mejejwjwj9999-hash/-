import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CreditCard, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Receipt,
  Banknote
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

const PaymentDetailsModal = ({ isOpen, onClose, payment }: PaymentDetailsModalProps) => {
  if (!payment) return null;

  const getPaymentStatusInfo = (payment: any) => {
    const status = payment.payment_date ? 'completed' : 'pending';
    
    const statusConfig = {
      completed: { 
        label: 'مدفوع', 
        icon: CheckCircle, 
        className: 'bg-green-100 text-green-800 border-green-200',
        color: 'text-green-600'
      },
      pending: { 
        label: 'قيد المراجعة', 
        icon: Clock, 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        color: 'text-yellow-600'
      },
      failed: { 
        label: 'فشل في الدفع', 
        icon: AlertCircle, 
        className: 'bg-red-100 text-red-800 border-red-200',
        color: 'text-red-600'
      }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  const statusInfo = getPaymentStatusInfo(payment);
  const StatusIcon = statusInfo.icon;

  const paymentMethods = {
    'cash': 'نقداً',
    'bank_transfer': 'تحويل بنكي',
    'credit_card': 'بطاقة ائتمان',
    'mobile_payment': 'دفع إلكتروني'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-screen overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-primary" />
            تفاصيل الدفعة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* حالة الدفع */}
          <div className="flex items-center justify-center">
            <Badge 
              variant="outline" 
              className={`${statusInfo.className} border px-4 py-2 gap-2 text-sm font-semibold`}
            >
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </Badge>
          </div>

          {/* مبلغ الدفع */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Banknote className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-gray-700">المبلغ المدفوع</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {payment.amount?.toLocaleString()} ريال يمني
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {payment.currency || 'YER'}
            </p>
          </div>

          {/* تفاصيل الدفع */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">نوع الدفع</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {payment.payment_type || 'رسوم دراسية'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">تاريخ الإنشاء</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {format(new Date(payment.created_at), 'dd MMM yyyy - HH:mm', { locale: ar })}
                  </span>
                </div>

                {payment.payment_date && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">تاريخ الدفع</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {format(new Date(payment.payment_date), 'dd MMM yyyy - HH:mm', { locale: ar })}
                    </span>
                  </div>
                )}

                {payment.payment_method && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">طريقة الدفع</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {paymentMethods[payment.payment_method] || payment.payment_method}
                    </span>
                  </div>
                )}

                {payment.invoice_number && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">رقم الفاتورة</span>
                    </div>
                    <span className="text-sm text-gray-600 font-mono">
                      {payment.invoice_number}
                    </span>
                  </div>
                )}

                {payment.reference_number && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">رقم المرجع</span>
                    </div>
                    <span className="text-sm text-gray-600 font-mono">
                      {payment.reference_number}
                    </span>
                  </div>
                )}

                {payment.semester && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">الفصل الدراسي</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {payment.semester} - {payment.academic_year}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ملاحظات إضافية */}
            {payment.notes && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">ملاحظات إضافية</h4>
                <p className="text-sm text-blue-700">{payment.notes}</p>
              </div>
            )}
          </div>

          {/* أزرار العمل */}
          <div className="flex gap-2 pt-4">
            {payment.payment_date && (
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => {
                  // معالجة تحميل الإيصال
                  console.log('Download receipt for payment:', payment.id);
                }}
              >
                <Download className="h-4 w-4" />
                تحميل الإيصال
              </Button>
            )}
            <Button 
              onClick={onClose}
              className="flex-1"
            >
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsModal;