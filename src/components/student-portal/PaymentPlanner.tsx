
import React, { useState } from 'react';
import { Calendar, DollarSign, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react';
import { useToast } from '../ui/use-toast';

const PaymentPlanner = () => {
  const [selectedPlan, setSelectedPlan] = useState('semester');
  const [customAmount, setCustomAmount] = useState('');
  const [customDate, setCustomDate] = useState('');
  const { toast } = useToast();

  const totalAmount = 3750000; // المبلغ الإجمالي للعام الدراسي - كلية الصيدلة

  const paymentPlans = {
    annual: {
      name: 'دفعة واحدة سنوية',
      discount: 5,
      payments: [
        { date: '2024-09-01', amount: totalAmount * 0.95, description: 'دفعة العام الكامل مع خصم 5%' }
      ]
    },
    semester: {
      name: 'قسطين (فصلين)',
      discount: 0,
      payments: [
        { date: '2024-09-01', amount: totalAmount / 2, description: 'رسوم الفصل الأول' },
        { date: '2025-01-15', amount: totalAmount / 2, description: 'رسوم الفصل الثاني' }
      ]
    },
    quarterly: {
      name: '4 أقساط ربع سنوية',
      discount: 0,
      payments: [
        { date: '2024-09-01', amount: totalAmount / 4, description: 'القسط الأول' },
        { date: '2024-11-01', amount: totalAmount / 4, description: 'القسط الثاني' },
        { date: '2025-01-01', amount: totalAmount / 4, description: 'القسط الثالث' },
        { date: '2025-03-01', amount: totalAmount / 4, description: 'القسط الرابع' }
      ]
    },
    monthly: {
      name: '10 أقساط شهرية',
      discount: 0,
      payments: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2024, 8 + i, 1).toISOString().split('T')[0],
        amount: totalAmount / 10,
        description: `القسط الشهري ${i + 1}`
      }))
    }
  };

  const currentPlan = paymentPlans[selectedPlan];
  const finalAmount = totalAmount * (1 - currentPlan.discount / 100);

  const handleSetReminder = (payment) => {
    toast({
      title: "تم تعيين التذكير",
      description: `سيتم تذكيرك بموعد دفع ${payment.description} في ${payment.date}`,
    });
  };

  const handlePayNow = (payment) => {
    toast({
      title: "توجيه للدفع",
      description: `جاري توجيهك لدفع ${payment.description}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-university-blue" />
        <h2 className="text-section-title">مخطط الدفعات</h2>
      </div>

      {/* Plan Selection */}
      <div className="card-elevated">
        <h3 className="text-card-title mb-6">اختر خطة الدفع المناسبة</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(paymentPlans).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedPlan === key
                  ? 'border-university-blue bg-university-blue-light text-white'
                  : 'border-gray-200 hover:border-university-blue'
              }`}
            >
              <h4 className="font-semibold mb-2">{plan.name}</h4>
              <p className="text-sm mb-2">
                {plan.payments.length} دفعة{plan.payments.length > 1 ? 's' : ''}
              </p>
              {plan.discount > 0 && (
                <div className={`text-sm ${
                  selectedPlan === key ? 'text-yellow-200' : 'text-green-600'
                }`}>
                  خصم {plan.discount}%
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Plan Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-university-blue">
                {currentPlan.payments.length}
              </div>
              <div className="text-sm text-academic-gray">عدد الدفعات</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-university-blue">
                {(finalAmount / currentPlan.payments.length).toLocaleString()}
              </div>
              <div className="text-sm text-academic-gray">متوسط القسط (ريال)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {finalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-academic-gray">المجموع النهائي (ريال)</div>
            </div>
          </div>
          {currentPlan.discount > 0 && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
              <span className="text-green-800 font-medium">
                توفير: {(totalAmount * currentPlan.discount / 100).toLocaleString()} ريال
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="card-elevated">
        <h3 className="text-card-title mb-6">جدول الدفعات</h3>
        
        <div className="space-y-4">
          {currentPlan.payments.map((payment, index) => {
            const paymentDate = new Date(payment.date);
            const today = new Date();
            const isPast = paymentDate < today;
            const isUpcoming = paymentDate > today && paymentDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isPast ? 'border-green-200 bg-green-50' :
                  isUpcoming ? 'border-amber-200 bg-amber-50' :
                  'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isPast ? 'bg-green-100' :
                    isUpcoming ? 'bg-amber-100' :
                    'bg-gray-100'
                  }`}>
                    {isPast ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : isUpcoming ? (
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">{payment.description}</h4>
                    <p className="text-sm text-academic-gray">
                      تاريخ الاستحقاق: {new Date(payment.date).toLocaleDateString('ar-SA')}
                    </p>
                    <p className="text-lg font-bold text-university-blue">
                      {payment.amount.toLocaleString()} ريال يمني
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isPast ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm">
                      مدفوع
                    </span>
                  ) : isUpcoming ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePayNow(payment)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        ادفع الآن
                      </button>
                      <button
                        onClick={() => handleSetReminder(payment)}
                        className="btn-ghost text-sm px-4 py-2"
                      >
                        تذكير
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSetReminder(payment)}
                      className="btn-ghost text-sm px-4 py-2"
                    >
                      تذكير
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Payment */}
      <div className="card-elevated">
        <h3 className="text-card-title mb-6">دفعة مخصصة</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">المبلغ (ريال يمني)</label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="أدخل المبلغ"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">تاريخ الدفع</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => {
              if (customAmount && customDate) {
                toast({
                  title: "تم إضافة الدفعة المخصصة",
                  description: `دفعة بقيمة ${customAmount} ريال في تاريخ ${customDate}`,
                });
                setCustomAmount('');
                setCustomDate('');
              } else {
                toast({
                  title: "بيانات ناقصة",
                  description: "يرجى إدخال المبلغ والتاريخ",
                  variant: "destructive"
                });
              }
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة دفعة مخصصة
          </button>
        </div>
      </div>

      {/* Payment Tips */}
      <div className="card-elevated">
        <h3 className="text-card-title mb-4">نصائح للدفع</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-university-blue rounded-full mt-2"></div>
            <p className="text-sm">
              <strong>الدفع المبكر:</strong> احصل على خصم 5% عند الدفع قبل بداية العام الدراسي
            </p>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <p className="text-sm">
              <strong>الطلاب المتفوقين:</strong> قد تحصل على منحة دراسية تصل إلى 50%
            </p>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
            <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
            <p className="text-sm">
              <strong>الدفع المتأخر:</strong> قد تطبق رسوم إضافية 2% شهرياً على المبلغ المتأخر
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlanner;
