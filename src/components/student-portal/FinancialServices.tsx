import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Receipt, 
  TrendingDown, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import PaymentHistory from './PaymentHistory';
import TuitionCalculator from './TuitionCalculator';
import YemenPaymentSystem from './YemenPaymentSystem';

interface FinancialServicesProps {
  onTabChange?: (tab: string) => void;
}

const FinancialServices: React.FC<FinancialServicesProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const mockData = {
    balance: -2500000,
    totalPaid: 7500000,
    totalDue: 10000000,
    nextDueDate: '2024-09-15',
    recentPayments: [
      {
        id: '1',
        date: '2024-08-15',
        amount: 1500000,
        type: 'رسوم دراسية',
        status: 'مكتمل',
        method: 'تحويل مصرفي'
      },
      {
        id: '2',
        date: '2024-08-01',
        amount: 500000,
        type: 'رسوم مختبر',
        status: 'مكتمل',
        method: 'نقداً'
      }
    ],
    upcomingPayments: [
      {
        id: '3',
        dueDate: '2024-09-15',
        amount: 2500000,
        type: 'رسوم الفصل الثاني',
        description: 'رسوم الفصل الدراسي الثاني 2024-2025'
      }
    ]
  };

  const handleBackFromPayment = () => {
    setActiveTab('overview');
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            الشؤون المالية
          </CardTitle>
          <p className="text-muted-foreground">
            إدارة شاملة لحسابك المالي والرسوم الدراسية
          </p>
        </CardHeader>
      </Card>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">الرصيد الحالي</p>
                <p className={`text-2xl font-bold ${mockData.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {mockData.balance.toLocaleString()} ر.ي
                </p>
              </div>
              <div className={`p-3 rounded-full ${mockData.balance < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                {mockData.balance < 0 ? 
                  <TrendingDown className="h-6 w-6 text-red-600" /> :
                  <TrendingUp className="h-6 w-6 text-green-600" />
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">إجمالي المدفوع</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockData.totalPaid.toLocaleString()} ر.ي
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">إجمالي المطلوب</p>
                <p className="text-2xl font-bold text-primary">
                  {mockData.totalDue.toLocaleString()} ر.ي
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="history">سجل المدفوعات</TabsTrigger>
          <TabsTrigger value="calculator">حاسبة الرسوم</TabsTrigger>
          <TabsTrigger value="payment">الدفع</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          {/* Upcoming Payments Alert */}
          {mockData.upcomingPayments.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 mb-1">دفعات مستحقة</h4>
                    <p className="text-sm text-orange-700 mb-3">لديك دفعات مستحقة قريباً</p>
                    <div className="space-y-2">
                      {mockData.upcomingPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{payment.type}</p>
                            <p className="text-sm text-gray-600">{payment.description}</p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-orange-600">{payment.amount.toLocaleString()} ر.ي</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {payment.dueDate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                آخر المدفوعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.type}</p>
                        <p className="text-sm text-muted-foreground">{payment.method}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-green-600">{payment.amount.toLocaleString()} ر.ي</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="calculator">
          <TuitionCalculator />
        </TabsContent>

        <TabsContent value="payment">
          <YemenPaymentSystem onBack={handleBackFromPayment} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialServices;
