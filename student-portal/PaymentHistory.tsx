
import React, { useMemo, useState } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Receipt,
  CreditCard
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

type DbPayment = {
  id: string;
  created_at: string;
  updated_at: string;
  student_id: string | null;
  payment_type: string;
  amount: number;
  currency: string | null;
  payment_status: 'completed' | 'pending' | string | null;
  payment_method: string | null;
  payment_date: string | null;
  due_date: string | null;
  academic_year: string | null;
  semester: string | null;
  reference_number: string | null;
  receipt_url: string | null;
  notes: string | null;
};

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'مكتمل' | 'مستحق' | 'متأخر'>('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments', profile?.id],
    enabled: !!profile?.id,
    queryFn: async (): Promise<DbPayment[]> => {
      console.log('Fetching payments for profile id:', profile?.id);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', profile!.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }
      return data || [];
    },
    meta: {
      onError: (err: any) => {
        console.error('Payments query error meta:', err);
      }
    }
  });

  const nowIso = useMemo(() => new Date().toISOString(), []);
  const isOverdue = (p: DbPayment) => p.payment_status !== 'completed' && p.due_date !== null && p.due_date < nowIso;

  const filteredPayments = useMemo(() => {
    const list = payments || [];
    return list.filter((payment) => {
      const matchesSearch =
        (payment.payment_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.reference_number || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear =
        selectedYear === 'all' ||
        (payment.academic_year || '').toLowerCase() === selectedYear.toLowerCase();

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'مكتمل' && payment.payment_status === 'completed') ||
        (selectedStatus === 'مستحق' && payment.payment_status === 'pending' && !isOverdue(payment)) ||
        (selectedStatus === 'متأخر' && isOverdue(payment));

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [payments, searchTerm, selectedStatus, selectedYear]);

  const totalPaid = useMemo(
    () => (payments || [])
      .filter(p => p.payment_status === 'completed')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments]
  );

  const pendingAmount = useMemo(
    () => (payments || [])
      .filter(p => p.payment_status !== 'completed')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments]
  );

  const handleViewReceipt = (payment: DbPayment) => {
    if (payment.receipt_url) {
      window.open(payment.receipt_url, '_blank');
      return;
    }
    toast({
      title: "عرض الإيصال",
      description: `لا يوجد إيصال متاح لهذه الدفعة (${payment.reference_number || payment.payment_type})`,
    });
  };

  const handleDownloadStatement = () => {
    // In a real scenario, export/filter currently visible rows to CSV/PDF
    console.log('Preparing statement for download of', filteredPayments.length, 'rows');
    toast({
      title: "تحميل كشف الحساب",
      description: "تم تحضير كشف الحساب الحالي بناءً على عوامل التصفية",
    });
  };

  if (error) {
    console.error('Payments error state:', error);
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            {totalPaid.toLocaleString()}
          </h3>
          <p className="text-academic-gray">إجمالي المدفوع</p>
          <p className="text-sm text-green-600 mt-1">ريال يمني</p>
        </div>

        <div className="card-elevated text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">
            {pendingAmount.toLocaleString()}
          </h3>
          <p className="text-academic-gray">مبلغ مستحق</p>
          <p className="text-sm text-red-600 mt-1">ريال يمني</p>
        </div>

        <div className="card-elevated text-center">
          <div className="w-12 h-12 bg-university-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-university-blue mb-2">
            {(payments || []).filter(p => p.payment_status === 'completed').length}
          </h3>
          <p className="text-academic-gray">عدد المدفوعات</p>
          <p className="text-sm text-university-blue mt-1">دفعة مكتملة</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card-elevated">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في المدفوعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
            >
              <option value="all">جميع الحالات</option>
              <option value="مكتمل">مكتمل</option>
              <option value="مستحق">مستحق</option>
              <option value="متأخر">متأخر</option>
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
            >
              <option value="all">كل الأعوام</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadStatement}
              className="btn-ghost flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              كشف الحساب
            </button>
          </div>
        </div>

        {/* Loading / Error / Empty states */}
        {isLoading && (
          <div className="text-center py-8 text-academic-gray">جاري تحميل بيانات المدفوعات...</div>
        )}

        {!isLoading && error && (
          <div className="text-center py-8 text-red-600">حدث خطأ أثناء تحميل البيانات.</div>
        )}

        {!isLoading && !error && (
          <>
            {/* Payment History Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">نوع الرسوم</TableHead>
                    <TableHead className="text-center">المبلغ</TableHead>
                    <TableHead className="text-center">طريقة الدفع</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center">رقم المرجع</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const overdue = isOverdue(payment);
                    const statusLabel =
                      payment.payment_status === 'completed'
                        ? 'مكتمل'
                        : overdue
                        ? 'متأخر'
                        : 'مستحق';
                    const statusClasses =
                      statusLabel === 'مكتمل'
                        ? 'bg-green-100 text-green-700'
                        : statusLabel === 'مستحق'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700';

                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{payment.payment_date ? payment.payment_date.slice(0, 10) : 'غير محدد'}</div>
                            <div className="text-xs text-academic-gray">
                              استحقاق: {payment.due_date ? payment.due_date.slice(0, 10) : 'غير محدد'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.payment_type}</div>
                            <div className="text-sm text-academic-gray">
                              {payment.academic_year || '-'} / {payment.semester || '-'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {Number(payment.amount).toLocaleString()} ريال
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4 text-university-blue" />
                            {payment.payment_method || 'غير محدد'}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses}`}>
                            {statusLabel}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">
                          {payment.reference_number || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            {payment.payment_status === 'completed' && (
                              <button
                                onClick={() => handleViewReceipt(payment)}
                                className="p-2 text-university-blue hover:bg-university-blue hover:text-white rounded-lg transition-colors"
                                title="عرض الإيصال"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => toast({ title: "تفاصيل الدفعة", description: `عرض تفاصيل ${payment.payment_type}` })}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="التفاصيل"
                            >
                              <Receipt className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-academic-gray">لا توجد مدفوعات تطابق معايير البحث</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
