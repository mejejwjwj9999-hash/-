
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Banknote, Smartphone, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MobilePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobilePaymentModal = ({ isOpen, onClose }: MobilePaymentModalProps) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'bank_transfer', label: 'تحويل بنكي', icon: Banknote },
    { id: 'mobile_wallet', label: 'محفظة إلكترونية', icon: Smartphone },
    { id: 'credit_card', label: 'بطاقة ائتمان', icon: CreditCard }
  ];

  const handlePayment = async () => {
    if (!amount || !paymentMethod) {
      toast({
        title: 'بيانات ناقصة',
        description: 'يرجى إدخال المبلغ واختيار طريقة الدفع',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    
    // محاكاة عملية الدفع
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: 'تم إرسال طلب الدفع',
        description: 'سيتم مراجعة طلبك والرد عليك قريباً'
      });
      onClose();
      setAmount('');
      setPaymentMethod('');
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">دفع جديد</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">المبلغ (ريال يمني)</label>
            <Input
              type="number"
              placeholder="أدخل المبلغ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-right"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">طريقة الدفع</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {method.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {paymentMethod && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">
                  {paymentMethod === 'bank_transfer' && 'سيتم إرسال تفاصيل التحويل البنكي إليك'}
                  {paymentMethod === 'mobile_wallet' && 'سيتم توجيهك لمحفظتك الإلكترونية'}
                  {paymentMethod === 'credit_card' && 'سيتم توجيهك لصفحة الدفع الآمنة'}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              إلغاء
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? 'جاري المعالجة...' : 'تأكيد الدفع'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobilePaymentModal;
