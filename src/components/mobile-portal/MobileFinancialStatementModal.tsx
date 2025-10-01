
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, DollarSign } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';

interface MobileFinancialStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFinancialStatementModal = ({ isOpen, onClose }: MobileFinancialStatementModalProps) => {
  const { data: payments } = usePayments();

  const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const totalDue = 450000;
  const remainingAmount = Math.max(0, totalDue - totalPaid);

  const financialSummary = [
    { label: 'إجمالي الرسوم المطلوبة', amount: totalDue, type: 'total' },
    { label: 'المبلغ المدفوع', amount: totalPaid, type: 'paid' },
    { label: 'المبلغ المتبقي', amount: remainingAmount, type: 'remaining' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">البيان المالي</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* ملخص مالي */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <h3 className="font-semibold text-center mb-3">الملخص المالي</h3>
              <div className="space-y-2">
                {financialSummary.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${
                        item.type === 'paid' ? 'text-green-600' : 
                        item.type === 'remaining' ? 'text-orange-600' : 
                        'text-blue-600'
                      }`}>
                        {item.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">ريال</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* تفاصيل المدفوعات */}
          <div>
            <h4 className="font-medium mb-2">سجل المدفوعات</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {payments && payments.length > 0 ? (
                payments.map((payment) => (
                  <Card key={payment.id} className="border-gray-200">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-sm">
                            {payment.amount.toLocaleString()} ريال
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.invoice_number && `رقم الفاتورة: ${payment.invoice_number}`}
                          </div>
                        </div>
                        <Badge variant={payment.payment_date ? 'default' : 'secondary'} className="text-xs">
                          {payment.payment_date ? 'مدفوع' : 'معلق'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(payment.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center text-gray-500">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <div className="text-sm">لا توجد مدفوعات</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              إغلاق
            </Button>
            <Button className="flex-1">
              <Download className="w-4 h-4 ml-1" />
              تحميل البيان
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileFinancialStatementModal;
