import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Download,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';

type Payment = {
  id: string;
  student_id: string;
  amount: number;
  payment_type: string;
  payment_status: string;
  payment_method?: string;
  payment_date?: string;
  due_date?: string;
  description?: string;
  reference_number?: string;
  academic_year?: string;
  semester?: string;
  created_at: string;
  student_profiles?: {
    student_id: string;
    first_name: string;
    last_name: string;
  };
};

type StudentProfile = {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
};

const PaymentsManagementComplete: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    payment_type: '',
    payment_status: 'pending',
    payment_method: '',
    due_date: '',
    description: '',
    academic_year: '2024',
    semester: '1'
  });

  const { data: payments, isLoading: paymentsLoading, refetch } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      console.log('Fetching payments data...');
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student_profiles!payments_student_id_fkey (
            student_id,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }
      
      console.log('Payments data fetched successfully:', data?.length || 0, 'payments');
      return data as Payment[] || [];
    },
  });

  const { data: students } = useQuery({
    queryKey: ['admin-students-for-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, student_id, first_name, last_name')
        .eq('status', 'active')
        .order('student_id');
      
      if (error) throw error;
      return data as StudentProfile[] || [];
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (newPayment: typeof formData) => {
      console.log('Adding payment with data:', newPayment);
      
      // التأكد من وجود الطالب
      if (!newPayment.student_id) {
        throw new Error('يجب اختيار الطالب');
      }

      // التأكد من صحة المبلغ
      const amount = parseFloat(newPayment.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('يجب إدخال مبلغ صحيح أكبر من صفر');
      }

      // إعداد البيانات للإرسال
      const paymentData: any = {
        student_id: newPayment.student_id,
        amount: amount,
        payment_type: newPayment.payment_type,
        payment_status: newPayment.payment_status,
        description: newPayment.description?.trim() || null,
        academic_year: newPayment.academic_year,
        semester: newPayment.semester,
        reference_number: `PAY-${Date.now()}`
      };

      // إضافة تاريخ الاستحقاق إذا تم تحديده
      if (newPayment.due_date) {
        paymentData.due_date = new Date(newPayment.due_date).toISOString();
      }

      // إضافة طريقة الدفع إذا تم تحديدها
      if (newPayment.payment_method) {
        paymentData.payment_method = newPayment.payment_method;
      }

      // إضافة تاريخ الدفع إذا كانت الحالة مدفوعة
      if (newPayment.payment_status === 'paid') {
        paymentData.payment_date = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('payments')
        .insert([paymentData]);
      
      if (error) {
        console.error('Error adding payment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الدفعة بنجاح.',
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Add payment error:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: error.message || 'فشل في إضافة الدفعة.',
        variant: 'destructive',
      });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (updatedPayment: typeof formData & { id: string }) => {
      const amount = parseFloat(updatedPayment.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('يجب إدخال مبلغ صحيح أكبر من صفر');
      }

      const paymentData: any = {
        amount: amount,
        payment_type: updatedPayment.payment_type,
        payment_status: updatedPayment.payment_status,
        description: updatedPayment.description?.trim() || null,
        academic_year: updatedPayment.academic_year,
        semester: updatedPayment.semester,
      };

      if (updatedPayment.due_date) {
        paymentData.due_date = new Date(updatedPayment.due_date).toISOString();
      }

      if (updatedPayment.payment_method) {
        paymentData.payment_method = updatedPayment.payment_method;
      }

      // تحديث تاريخ الدفع عند تغيير الحالة إلى مدفوعة
      if (updatedPayment.payment_status === 'paid' && selectedPayment?.payment_status !== 'paid') {
        paymentData.payment_date = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('payments')
        .update(paymentData)
        .eq('id', updatedPayment.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الدفعة بنجاح.',
      });
      setIsEditModalOpen(false);
      setSelectedPayment(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في التحديث',
        description: error.message || 'فشل في تحديث الدفعة.',
        variant: 'destructive',
      });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الدفعة بنجاح.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في الحذف',
        description: error.message || 'فشل في حذف الدفعة.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      student_id: '',
      amount: '',
      payment_type: '',
      payment_status: 'pending',
      payment_method: '',
      due_date: '',
      description: '',
      academic_year: '2024',
      semester: '1'
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.amount || !formData.payment_type) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }

    addPaymentMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment || !formData.amount || !formData.payment_type) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }

    updatePaymentMutation.mutate({ ...formData, id: selectedPayment.id });
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      student_id: payment.student_id,
      amount: payment.amount.toString(),
      payment_type: payment.payment_type,
      payment_status: payment.payment_status,
      payment_method: payment.payment_method || '',
      due_date: payment.due_date ? new Date(payment.due_date).toISOString().split('T')[0] : '',
      description: payment.description || '',
      academic_year: payment.academic_year || '2024',
      semester: payment.semester || '1'
    });
    setIsEditModalOpen(true);
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (id: string, studentName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف دفعة ${studentName}؟`)) {
      deletePaymentMutation.mutate(id);
    }
  };

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.student_profiles?.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student_profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student_profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'معلقة', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'مدفوعة', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغية', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      overdue: { label: 'متأخرة', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const paymentTypes = Array.from(new Set(payments?.map(p => p.payment_type) || []));

  const stats = {
    total: filteredPayments.length,
    pending: filteredPayments.filter(p => p.payment_status === 'pending').length,
    paid: filteredPayments.filter(p => p.payment_status === 'paid').length,
    totalAmount: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
  };

  if (paymentsLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">جاري تحميل بيانات المدفوعات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* العنوان والأزرار */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            disabled={paymentsLoading}
          >
            <RefreshCw className={`h-4 w-4 ${paymentsLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4" />
                إضافة دفعة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة دفعة جديدة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الطالب *</label>
                  <Select 
                    value={formData.student_id} 
                    onValueChange={(value) => setFormData({...formData, student_id: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.student_id} - {student.first_name} {student.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">المبلغ *</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">نوع الدفعة *</label>
                    <Select 
                      value={formData.payment_type} 
                      onValueChange={(value) => setFormData({...formData, payment_type: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuition">رسوم دراسية</SelectItem>
                        <SelectItem value="registration">رسوم تسجيل</SelectItem>
                        <SelectItem value="books">كتب ومراجع</SelectItem>
                        <SelectItem value="lab">رسوم مختبر</SelectItem>
                        <SelectItem value="exam">رسوم امتحان</SelectItem>
                        <SelectItem value="certificate">رسوم شهادة</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">حالة الدفعة *</label>
                  <Select 
                    value={formData.payment_status} 
                    onValueChange={(value) => setFormData({...formData, payment_status: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">معلقة</SelectItem>
                      <SelectItem value="paid">مدفوعة</SelectItem>
                      <SelectItem value="cancelled">ملغية</SelectItem>
                      <SelectItem value="overdue">متأخرة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">طريقة الدفع</label>
                  <Select 
                    value={formData.payment_method} 
                    onValueChange={(value) => setFormData({...formData, payment_method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">نقداً</SelectItem>
                      <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                      <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                      <SelectItem value="mobile_money">محفظة إلكترونية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">تاريخ الاستحقاق</label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="وصف الدفعة..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">السنة الدراسية</label>
                    <Input
                      value={formData.academic_year}
                      onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الفصل الدراسي</label>
                    <Select 
                      value={formData.semester} 
                      onValueChange={(value) => setFormData({...formData, semester: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">الفصل الأول</SelectItem>
                        <SelectItem value="2">الفصل الثاني</SelectItem>
                        <SelectItem value="3">الفصل الصيفي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={addPaymentMutation.isPending}
                    className="flex-1"
                  >
                    {addPaymentMutation.isPending ? 'جاري الإضافة...' : 'إضافة الدفعة'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي الدفعات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">معلقة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <div className="text-sm text-gray-600">مدفوعة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalAmount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">إجمالي المبلغ</div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث برقم الطالب، الاسم، أو رقم المرجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلقة</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
                <SelectItem value="overdue">متأخرة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="فلترة بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="tuition">رسوم دراسية</SelectItem>
                <SelectItem value="registration">رسوم تسجيل</SelectItem>
                <SelectItem value="books">كتب ومراجع</SelectItem>
                <SelectItem value="lab">رسوم مختبر</SelectItem>
                <SelectItem value="exam">رسوم امتحان</SelectItem>
                <SelectItem value="certificate">رسوم شهادة</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول المدفوعات */}
      <Card>
        <CardHeader>
          <CardTitle>المدفوعات ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {payments?.length === 0 ? 'لا توجد مدفوعات' : 'لا توجد نتائج'}
              </h3>
              <p className="text-gray-600">
                {payments?.length === 0 
                  ? 'لم يتم إنشاء أي مدفوعات في النظام بعد.' 
                  : 'لا توجد نتائج تطابق معايير البحث المحددة.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الطالب</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="hidden md:table-cell">تاريخ الاستحقاق</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {payment.student_profiles?.student_id}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.student_profiles?.first_name} {payment.student_profiles?.last_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">{payment.amount.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.payment_type === 'tuition' && 'رسوم دراسية'}
                          {payment.payment_type === 'registration' && 'رسوم تسجيل'}
                          {payment.payment_type === 'books' && 'كتب ومراجع'}
                          {payment.payment_type === 'lab' && 'رسوم مختبر'}
                          {payment.payment_type === 'exam' && 'رسوم امتحان'}
                          {payment.payment_type === 'certificate' && 'رسوم شهادة'}
                          {payment.payment_type === 'other' && 'أخرى'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {payment.due_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(payment.due_date).toLocaleDateString('ar-EG')}</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleView(payment)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(payment)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(
                              payment.id, 
                              `${payment.student_profiles?.first_name} ${payment.student_profiles?.last_name}`
                            )}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* مودال التعديل */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الدفعة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">المبلغ *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نوع الدفعة *</label>
                <Select 
                  value={formData.payment_type} 
                  onValueChange={(value) => setFormData({...formData, payment_type: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tuition">رسوم دراسية</SelectItem>
                    <SelectItem value="registration">رسوم تسجيل</SelectItem>
                    <SelectItem value="books">كتب ومراجع</SelectItem>
                    <SelectItem value="lab">رسوم مختبر</SelectItem>
                    <SelectItem value="exam">رسوم امتحان</SelectItem>
                    <SelectItem value="certificate">رسوم شهادة</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">حالة الدفعة *</label>
              <Select 
                value={formData.payment_status} 
                onValueChange={(value) => setFormData({...formData, payment_status: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">معلقة</SelectItem>
                  <SelectItem value="paid">مدفوعة</SelectItem>
                  <SelectItem value="cancelled">ملغية</SelectItem>
                  <SelectItem value="overdue">متأخرة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">طريقة الدفع</label>
              <Select 
                value={formData.payment_method} 
                onValueChange={(value) => setFormData({...formData, payment_method: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">نقداً</SelectItem>
                  <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                  <SelectItem value="mobile_money">محفظة إلكترونية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">تاريخ الاستحقاق</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={updatePaymentMutation.isPending}
                className="flex-1"
              >
                {updatePaymentMutation.isPending ? 'جاري التحديث...' : 'تحديث الدفعة'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedPayment(null);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* مودال عرض التفاصيل */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الدفعة</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">رقم المرجع</label>
                  <div className="font-medium">{selectedPayment.reference_number}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">الحالة</label>
                  <div>{getStatusBadge(selectedPayment.payment_status)}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">الطالب</label>
                <div className="font-medium">
                  {selectedPayment.student_profiles?.student_id} - {selectedPayment.student_profiles?.first_name} {selectedPayment.student_profiles?.last_name}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">المبلغ</label>
                  <div className="font-medium text-lg">{selectedPayment.amount.toFixed(2)} ر.ي</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">النوع</label>
                  <div className="font-medium">{selectedPayment.payment_type}</div>
                </div>
              </div>
              
              {selectedPayment.payment_method && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">طريقة الدفع</label>
                  <div className="font-medium">{selectedPayment.payment_method}</div>
                </div>
              )}
              
              {selectedPayment.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">الوصف</label>
                  <div className="font-medium">{selectedPayment.description}</div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {selectedPayment.due_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">تاريخ الاستحقاق</label>
                    <div className="font-medium">{new Date(selectedPayment.due_date).toLocaleDateString('ar-EG')}</div>
                  </div>
                )}
                {selectedPayment.payment_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">تاريخ الدفع</label>
                    <div className="font-medium">{new Date(selectedPayment.payment_date).toLocaleDateString('ar-EG')}</div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
                <div className="font-medium">{new Date(selectedPayment.created_at).toLocaleDateString('ar-EG')}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsManagementComplete;
