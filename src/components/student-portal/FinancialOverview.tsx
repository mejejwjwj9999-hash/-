
import React from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Calculator,
  Receipt,
  Calendar,
  FileText
} from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface FinancialOverviewProps {
  onTabChange?: (tab: string) => void;
}

const FinancialOverview = ({ onTabChange }: FinancialOverviewProps) => {
  const { toast } = useToast();

  // استخدام البيانات الحقيقية من قاعدة البيانات بدلاً من البيانات الوهمية
  const [financialData, setFinancialData] = React.useState({
    totalTuition: 0,
    totalPaid: 0,
    remainingBalance: 0,
    nextPaymentDue: 0,
    nextDueDate: '',
    scholarshipAmount: 0,
    lateFees: 0,
    currentSemesterFees: 0,
    paymentStatus: 'good'
  });

  // جلب البيانات المالية الحقيقية (سيتم تفعيلها عند توصيل قاعدة البيانات)
  React.useEffect(() => {
    // هنا سيتم جلب البيانات من قاعدة البيانات
    // مؤقتاً نعرض رسالة تشير إلى أن البيانات قيد التحديث
    setFinancialData({
      totalTuition: 0,
      totalPaid: 0,
      remainingBalance: 0,
      nextPaymentDue: 0,
      nextDueDate: '',
      scholarshipAmount: 0,
      lateFees: 0,
      currentSemesterFees: 0,
      paymentStatus: 'good'
    });
  }, []);

  const quickActions = [
    {
      title: 'دفع الرسوم',
      description: 'دفع المستحقات المالية',
      icon: CreditCard,
      action: () => onTabChange?.('services'),
      color: 'bg-university-blue',
      urgent: true
    },
    {
      title: 'حاسبة الرسوم',
      description: 'احسب رسوم الفصل',
      icon: Calculator,
      action: () => toast({ title: "حاسبة الرسوم", description: "جاري فتح حاسبة الرسوم" }),
      color: 'bg-university-gold'
    },
    {
      title: 'تقرير مالي',
      description: 'تحميل التقرير المالي',
      icon: FileText,
      action: () => toast({ title: "تحميل التقرير", description: "جاري تحضير التقرير المالي" }),
      color: 'bg-university-red'
    },
    {
      title: 'سجل المدفوعات',
      description: 'عرض تاريخ الدفعات',
      icon: Receipt,
      action: () => toast({ title: "سجل المدفوعات", description: "جاري عرض سجل المدفوعات" }),
      color: 'bg-green-600'
    }
  ];

  const [recentTransactions, setRecentTransactions] = React.useState<any[]>([]);

  // جلب المعاملات الحقيقية من قاعدة البيانات
  React.useEffect(() => {
    // هنا سيتم جلب المعاملات الحقيقية من قاعدة البيانات
    // مؤقتاً نترك المصفوفة فارغة
    setRecentTransactions([]);
  }, []);

  return (
    <div className="space-y-6">
      {/* إشعار البيانات */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">البيانات المالية</h4>
            <p className="text-blue-700">
              يتم حالياً ربط النظام بقاعدة البيانات المالية. ستظهر بياناتك المالية الحقيقية قريباً.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-elevated text-center">
          <div className="w-12 h-12 bg-university-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-academic-gray mb-2">
            ---
          </h3>
          <p className="text-academic-gray">إجمالي الرسوم الدراسية</p>
          <p className="text-sm text-university-blue mt-1">ريال يمني</p>
        </div>

        <div className="card-elevated text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-academic-gray mb-2">
            ---
          </h3>
          <p className="text-academic-gray">المبلغ المدفوع</p>
          <p className="text-sm text-green-600 mt-1">قيد التحديث</p>
        </div>

        <div className="card-elevated text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-academic-gray mb-2">
            ---
          </h3>
          <p className="text-academic-gray">الرصيد المتبقي</p>
          <p className="text-sm text-university-blue mt-1">ريال يمني</p>
        </div>

        <div className="card-elevated text-center">
          <div className="w-12 h-12 bg-university-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-academic-gray mb-2">
            ---
          </h3>
          <p className="text-academic-gray">المنحة الدراسية</p>
          <p className="text-sm text-university-gold mt-1">قيد التحديث</p>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 mb-2">الحالة المالية</h4>
            <p className="text-green-700 mb-4">
              لعرض وإدارة مدفوعاتك، يرجى التواصل مع القسم المالي للحصول على معلومات حسابك المحدثة.
            </p>
            <button
              onClick={() => onTabChange?.('services')}
              className="btn-primary flex items-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              إدارة الدفعات
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card-elevated">
          <h3 className="text-card-title mb-6">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`relative p-4 rounded-lg text-white text-left transition-transform hover:scale-105 ${action.color} ${
                  action.urgent ? 'ring-2 ring-amber-400 ring-opacity-50' : ''
                }`}
              >
                {action.urgent && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
                  </div>
                )}
                <action.icon className="w-8 h-8 mb-3" />
                <h4 className="font-semibold mb-1">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card-elevated">
          <h3 className="text-card-title mb-6">آخر المعاملات</h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.type}</h4>
                      <p className="text-sm text-academic-gray">{transaction.date}</p>
                      <p className="text-xs text-university-blue">{transaction.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {transaction.amount.toLocaleString()} ريال
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">لا توجد معاملات متاحة حالياً</p>
              <p className="text-gray-400 text-xs mt-1">ستظهر معاملاتك هنا عند إجرائها</p>
            </div>
          )}
          <div className="mt-4 text-center">
            <button 
              onClick={() => toast({ title: "تحديث المعاملات", description: "جاري تحديث سجل المعاملات من النظام المالي" })}
              className="btn-ghost text-sm"
            >
              تحديث المعاملات
            </button>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="card-elevated">
        <h3 className="text-card-title mb-6">تقدم الدراسة</h3>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">نسبة الإنجاز الدراسي</span>
            <span className="text-sm text-university-blue">قيد التحديث</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gray-400 h-3 rounded-full transition-all duration-300"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-academic-gray">---</div>
            <div className="text-sm text-academic-gray">مدفوع</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-academic-gray">---</div>
            <div className="text-sm text-academic-gray">متبقي</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-academic-gray">---</div>
            <div className="text-sm text-academic-gray">منحة</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-academic-gray">
            سيتم عرض تفاصيل دفعاتك عند ربط النظام بالقسم المالي
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
