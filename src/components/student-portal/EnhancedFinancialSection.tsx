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
  DollarSign,
  Plus,
  Download,
  Eye
} from 'lucide-react';

interface EnhancedFinancialSectionProps {
  onTabChange?: (tab: string) => void;
}

const EnhancedFinancialSection: React.FC<EnhancedFinancialSectionProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const mockData = {
    balance: -2500000,
    totalPaid: 7500000,
    totalDue: 10000000,
    nextDueDate: '2024-09-15',
    semester: 'الفصل الأول 2024-2025',
    recentPayments: [
      {
        id: '1',
        date: '2024-08-15',
        amount: 1500000,
        type: 'رسوم دراسية',
        status: 'مكتمل',
        method: 'تحويل مصرفي',
        receipt: 'REC-2024-001'
      },
      {
        id: '2',
        date: '2024-08-01',
        amount: 500000,
        type: 'رسوم مختبر',
        status: 'مكتمل',
        method: 'نقداً',
        receipt: 'REC-2024-002'
      },
      {
        id: '3',
        date: '2024-07-20',
        amount: 300000,
        type: 'رسوم كتب',
        status: 'معلق',
        method: 'بانتظار التأكيد',
        receipt: 'PENDING-001'
      }
    ],
    upcomingPayments: [
      {
        id: '4',
        dueDate: '2024-09-15',
        amount: 2500000,
        type: 'رسوم الفصل الثاني',
        description: 'رسوم الفصل الدراسي الثاني 2024-2025',
        canPayNow: true
      },
      {
        id: '5',
        dueDate: '2024-10-01',
        amount: 200000,
        type: 'رسوم أنشطة',
        description: 'رسوم الأنشطة الطلابية للفصل الثاني',
        canPayNow: false
      }
    ],
    paymentPlans: [
      {
        id: '1',
        name: 'خطة الدفع الشهري',
        totalAmount: 2500000,
        monthlyAmount: 625000,
        installments: 4,
        startDate: '2024-09-01',
        available: true
      },
      {
        id: '2',
        name: 'خطة الدفع الفصلي',
        totalAmount: 2500000,
        monthlyAmount: 1250000,
        installments: 2,
        startDate: '2024-09-01',
        available: true
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Financial Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <CardHeader className="pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                الحساب المالي
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                إدارة مالية متقدمة وخطط دفع مرنة
              </p>
              <Badge variant="secondary" className="w-fit">
                {mockData.semester}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 ml-2" />
                تحميل كشف الحساب
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 ml-2" />
                دفع جديد
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-700">الرصيد الحالي</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockData.balance.toLocaleString()} ر.ي
                </p>
                <p className="text-xs text-red-600">مستحق الدفع</p>
              </div>
              <div className="p-3 rounded-full bg-red-200">
                <TrendingDown className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700">إجمالي المدفوع</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockData.totalPaid.toLocaleString()} ر.ي
                </p>
                <p className="text-xs text-green-600">تم التسديد</p>
              </div>
              <div className="p-3 rounded-full bg-green-200">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-700">إجمالي الرسوم</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockData.totalDue.toLocaleString()} ر.ي
                </p>
                <p className="text-xs text-blue-600">هذا الفصل</p>
              </div>
              <div className="p-3 rounded-full bg-blue-200">
                <DollarSign className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-700">الدفعة القادمة</p>
                <p className="text-lg font-bold text-orange-600">
                  {mockData.nextDueDate}
                </p>
                <p className="text-xs text-orange-600">موعد الاستحقاق</p>
              </div>
              <div className="p-3 rounded-full bg-orange-200">
                <Calendar className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          <TabsTrigger value="plans">خطط الدفع</TabsTrigger>
          <TabsTrigger value="receipts">الإيصالات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Critical Payments Alert */}
          {mockData.upcomingPayments.length > 0 && (
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-800 text-lg mb-2">دفعات مستحقة عاجلاً</h4>
                    <p className="text-red-700 mb-4">يجب تسديد الدفعات التالية قبل المواعيد المحددة لتجنب التأخير</p>
                    <div className="space-y-3">
                      {mockData.upcomingPayments.map((payment) => (
                        <Card key={payment.id} className="bg-white border-0 shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-900">{payment.type}</p>
                                <p className="text-sm text-gray-600">{payment.description}</p>
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>مستحق في: {payment.dueDate}</span>
                                </div>
                              </div>
                              <div className="text-left space-y-2">
                                <p className="text-xl font-bold text-red-600">{payment.amount.toLocaleString()} ر.ي</p>
                                {payment.canPayNow && (
                                  <Button size="sm" className="w-full">
                                    ادفع الآن
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                النشاط المالي الحديث
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.recentPayments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      payment.status === 'مكتمل' ? 'bg-green-100' : 
                      payment.status === 'معلق' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      {payment.status === 'مكتمل' ? 
                        <CheckCircle className="h-5 w-5 text-green-600" /> :
                        <Clock className="h-5 w-5 text-orange-600" />
                      }
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{payment.type}</p>
                      <p className="text-sm text-muted-foreground">{payment.method}</p>
                      <Badge variant={payment.status === 'مكتمل' ? 'default' : 'secondary'} className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-left space-y-1">
                    <p className={`text-lg font-bold ${
                      payment.status === 'مكتمل' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {payment.amount.toLocaleString()} ر.ي
                    </p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                    <Button variant="ghost" size="sm" className="p-1 h-6">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">سجل المدفوعات التفصيلي</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid gap-4">
            {mockData.paymentPlans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {plan.installments} أقساط × {plan.monthlyAmount.toLocaleString()} ر.ي
                      </p>
                    </div>
                    <Button variant="outline" disabled={!plan.available}>
                      اختيار الخطة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="receipts">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">الإيصالات والوثائق المالية</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">التقارير المالية والإحصائيات</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedFinancialSection;
