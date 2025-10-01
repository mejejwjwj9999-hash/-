import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Receipt,
  Eye,
  Info
} from 'lucide-react';
import { formatDateForInput, sanitizeDateForDatabase, formatDateForDisplay } from '@/utils/dateUtils';
import { useDepartments } from '@/hooks/useDepartments';
import { usePrograms } from '@/hooks/usePrograms';
import { useProgramFee } from '@/hooks/useProgramFees';
import { DepartmentId, ProgramId, getProgramFee, Programs } from '@/domain/academics';
import { paymentFormSchema, PaymentFormData } from '@/lib/validations/payment';

type Payment = {
  id: string;
  student_id: string;
  program_id?: string;
  amount: number;
  payment_type: string;
  payment_status: string;
  payment_method?: string;
  payment_date?: string;
  due_date?: string;
  description?: string;
  invoice_number?: string;
  reference_number?: string;
  academic_year?: string;
  semester?: string;
  currency: string;
  created_at: string;
  updated_at: string;
};

type StudentProfile = {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  program_id?: string;
  academic_year?: number;
  semester?: number;
};

const PaymentsManagementRadical: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      student_id: '',
      program_id: '',
      amount: '',
      payment_type: 'tuition',
      payment_status: 'pending',
      payment_method: 'cash',
      payment_date: '',
      due_date: '',
      description: '',
      invoice_number: '',
      reference_number: '',
      academic_year: '2024',
      semester: '1',
      currency: 'YER'
    }
  });

  const watchedStudentId = form.watch('student_id');
  const watchedProgramId = form.watch('program_id');
  const watchedAcademicYear = form.watch('academic_year');
  const watchedSemester = form.watch('semester');

  // Fetch program fee when program, year, or semester changes
  const { data: programFeeData } = useProgramFee(
    watchedProgramId as ProgramId, 
    parseInt(watchedAcademicYear), 
    parseInt(watchedSemester)
  );

  const { data: programs } = usePrograms();

  const { data: payments, isLoading: paymentsLoading, refetch } = useQuery({
    queryKey: ['admin-payments-radical'],
    queryFn: async () => {
      console.log('Fetching payments data...');
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student_profiles!payments_student_id_fkey (
            student_id,
            first_name,
            last_name,
            program_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }
      
      console.log('Payments data fetched successfully:', data?.length || 0, 'payments');
      return data || [];
    },
  });

  const { data: students } = useQuery({
    queryKey: ['admin-students-for-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, student_id, first_name, last_name, program_id, academic_year, semester')
        .eq('status', 'active')
        .order('student_id');
      
      if (error) throw error;
      return data as StudentProfile[] || [];
    },
  });

  // Auto-fill program and fee when student is selected
  useEffect(() => {
    if (watchedStudentId && students) {
      const student = students.find(s => s.id === watchedStudentId);
      if (student) {
        setSelectedStudent(student);
        if (student.program_id) {
          form.setValue('program_id', student.program_id);
          form.setValue('academic_year', student.academic_year?.toString() || '2024');
          form.setValue('semester', student.semester?.toString() || '1');
        }
      }
    }
  }, [watchedStudentId, students, form]);

  // Auto-fill amount when program fee is available
  useEffect(() => {
    if (programFeeData) {
      const totalFee = (
        programFeeData.base_fee +
        programFeeData.registration_fee +
        programFeeData.library_fee +
        programFeeData.lab_fee +
        programFeeData.exam_fee
      );
      form.setValue('amount', totalFee.toString());
    }
  }, [programFeeData, form]);

  const addPaymentMutation = useMutation({
    mutationFn: async (newPayment: PaymentFormData) => {
      console.log('Adding payment with data:', newPayment);
      
      const sanitizedData = {
        student_id: newPayment.student_id,
        program_id: newPayment.program_id,
        amount: parseFloat(newPayment.amount),
        payment_type: newPayment.payment_type,
        payment_status: newPayment.payment_status,
        payment_method: newPayment.payment_method || null,
        payment_date: sanitizeDateForDatabase(newPayment.payment_date),
        due_date: sanitizeDateForDatabase(newPayment.due_date),
        description: newPayment.description?.trim() || null,
        invoice_number: newPayment.invoice_number?.trim() || null,
        reference_number: newPayment.reference_number?.trim() || null,
        academic_year: newPayment.academic_year || null,
        semester: newPayment.semester || null,
        currency: newPayment.currency
      };

      const { error } = await supabase
        .from('payments')
        .insert([sanitizedData]);
      
      if (error) {
        console.error('Error adding payment:', error);
        throw new Error(error.message || 'فشل في إضافة المدفوعة');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments-radical'] });
      toast({
        title: 'تمت الإضافة بنجاح ✅',
        description: 'تم إضافة المدفوعة بنجاح.',
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'خطأ في الإضافة ❌',
        description: error.message || 'فشل في إضافة المدفوعة.',
        variant: 'destructive',
      });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (updatedPayment: PaymentFormData & { id: string }) => {
      console.log('Updating payment with data:', updatedPayment);
      
      const sanitizedData = {
        student_id: updatedPayment.student_id,
        program_id: updatedPayment.program_id,
        amount: parseFloat(updatedPayment.amount),
        payment_type: updatedPayment.payment_type,
        payment_status: updatedPayment.payment_status,
        payment_method: updatedPayment.payment_method || null,
        payment_date: sanitizeDateForDatabase(updatedPayment.payment_date),
        due_date: sanitizeDateForDatabase(updatedPayment.due_date),
        description: updatedPayment.description?.trim() || null,
        invoice_number: updatedPayment.invoice_number?.trim() || null,
        reference_number: updatedPayment.reference_number?.trim() || null,
        academic_year: updatedPayment.academic_year || null,
        semester: updatedPayment.semester || null,
        currency: updatedPayment.currency,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('payments')
        .update(sanitizedData)
        .eq('id', updatedPayment.id);
      
      if (error) {
        console.error('Error updating payment:', error);
        throw new Error(error.message || 'فشل في تحديث المدفوعة');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments-radical'] });
      toast({
        title: 'تم التحديث بنجاح ✅',
        description: 'تم تحديث المدفوعة بنجاح.',
      });
      setEditingPayment(null);
      resetForm();
    },
    onError: (error: Error) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'خطأ في التحديث ❌',
        description: error.message || 'فشل في تحديث المدفوعة.',
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
      
      if (error) throw new Error(error.message || 'فشل في حذف المدفوعة');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments-radical'] });
      toast({
        title: 'تم الحذف بنجاح ✅',
        description: 'تم حذف المدفوعة بنجاح.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ في الحذف ❌',
        description: error.message || 'فشل في حذف المدفوعة.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    form.reset({
      student_id: '',
      program_id: '',
      amount: '',
      payment_type: 'tuition',
      payment_status: 'pending',
      payment_method: 'cash',
      payment_date: '',
      due_date: '',
      description: '',
      invoice_number: '',
      reference_number: '',
      academic_year: '2024',
      semester: '1',
      currency: 'YER'
    });
    setSelectedStudent(null);
    setStudentSearchTerm('');
  };

  const handleSubmit = (data: PaymentFormData) => {
    if (editingPayment) {
      updatePaymentMutation.mutate({ ...data, id: editingPayment.id });
    } else {
      addPaymentMutation.mutate(data);
    }
  };

  const handleEdit = (payment: any) => {
    form.reset({
      student_id: payment.student_id,
      program_id: payment.program_id || '',
      amount: payment.amount.toString(),
      payment_type: payment.payment_type,
      payment_status: payment.payment_status,
      payment_method: payment.payment_method || 'cash',
      payment_date: formatDateForInput(payment.payment_date),
      due_date: formatDateForInput(payment.due_date),
      description: payment.description || '',
      invoice_number: payment.invoice_number || '',
      reference_number: payment.reference_number || '',
      academic_year: payment.academic_year || '2024',
      semester: payment.semester || '1',
      currency: payment.currency || 'YER'
    });
    setEditingPayment(payment);
  };

  const handleDelete = (id: string, studentName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف مدفوعة ${studentName}؟\nلا يمكن التراجع عن هذا الإجراء.`)) {
      deletePaymentMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'مدفوع', className: 'bg-green-100 text-green-800' },
      overdue: { label: 'متأخر', className: 'bg-red-100 text-red-800' },
      cancelled: { label: 'ملغي', className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      tuition: { label: 'رسوم دراسية', className: 'bg-blue-100 text-blue-800' },
      registration: { label: 'رسوم تسجيل', className: 'bg-purple-100 text-purple-800' },
      exam: { label: 'رسوم امتحان', className: 'bg-orange-100 text-orange-800' },
      library: { label: 'رسوم مكتبة', className: 'bg-green-100 text-green-800' },
      fine: { label: 'غرامة', className: 'bg-red-100 text-red-800' },
      other: { label: 'أخرى', className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  // الفلترة
  const filteredPayments = payments?.filter((payment: any) => {
    const student = payment.student_profiles;
    const matchesSearch = !searchTerm || 
      student?.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || payment.payment_status === selectedStatus;
    const matchesType = selectedType === 'all' || payment.payment_type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  // الإحصائيات
  const stats = {
    total: payments?.length || 0,
    totalAmount: payments?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) || 0,
    pending: payments?.filter((p: any) => p.payment_status === 'pending').length || 0,
    paid: payments?.filter((p: any) => p.payment_status === 'paid').length || 0,
    overdue: payments?.filter((p: any) => p.payment_status === 'overdue').length || 0,
  };

  if (paymentsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">جاري تحميل المدفوعات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            محسنة
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            disabled={paymentsLoading}
          >
            <RefreshCw className={`h-4 w-4 ${paymentsLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة مدفوعة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingPayment ? 'تعديل مدفوعة' : 'إضافة مدفوعة جديدة'}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="student_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            الطالب *
                          </FormLabel>
                          <div className="space-y-2">
                            <div className="relative">
                              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                placeholder="ابحث عن الطالب بالاسم أو الرقم الجامعي..."
                                value={studentSearchTerm}
                                onChange={(e) => setStudentSearchTerm(e.target.value)}
                                className="pr-9 text-right"
                              />
                            </div>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-right">
                                  <SelectValue placeholder="اختر الطالب" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60 overflow-y-auto">
                                {students
                                  ?.filter(student => 
                                    !studentSearchTerm || 
                                    student.student_id.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                    `${student.first_name} ${student.last_name}`.toLowerCase().includes(studentSearchTerm.toLowerCase())
                                  )
                                  .map((student) => (
                                    <SelectItem key={student.id} value={student.id}>
                                      <div className="flex flex-col text-right">
                                        <span className="font-medium">{student.first_name} {student.last_name}</span>
                                        <span className="text-xs text-muted-foreground">رقم الطالب: {student.student_id}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="program_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">البرنامج *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-right">
                                <SelectValue placeholder="اختر البرنامج" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {programs?.map((program) => (
                                <SelectItem key={program.id} value={program.id}>
                                  {program.name.ar}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="academic_year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">السنة الدراسية *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-right">
                                <SelectValue placeholder="اختر السنة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2024">2024</SelectItem>
                              <SelectItem value="2025">2025</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">الفصل *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-right">
                                <SelectValue placeholder="اختر الفصل" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">الفصل الأول</SelectItem>
                              <SelectItem value="2">الفصل الثاني</SelectItem>
                              <SelectItem value="3">الفصل الصيفي</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">المبلغ *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0.00" type="number" step="0.01" className="text-right" />
                          </FormControl>
                          {programFeeData && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              رسوم البرنامج: {programFeeData.base_fee + programFeeData.registration_fee + programFeeData.library_fee + programFeeData.lab_fee + programFeeData.exam_fee} ريال
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="payment_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الدفعة *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر النوع" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tuition">رسوم دراسية</SelectItem>
                              <SelectItem value="registration">رسوم تسجيل</SelectItem>
                              <SelectItem value="exam">رسوم امتحان</SelectItem>
                              <SelectItem value="library">رسوم مكتبة</SelectItem>
                              <SelectItem value="fine">غرامة</SelectItem>
                              <SelectItem value="other">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payment_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>حالة الدفعة *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الحالة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">معلق</SelectItem>
                              <SelectItem value="paid">مدفوع</SelectItem>
                              <SelectItem value="overdue">متأخر</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payment_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>طريقة الدفع *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الطريقة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">نقدي</SelectItem>
                              <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                              <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                              <SelectItem value="check">شيك</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="payment_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاريخ الدفع *</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاريخ الاستحقاق *</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="invoice_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الفاتورة</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="INV-2024-001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reference_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم المرجع</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="REF-001" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الوصف</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="وصف إضافي للدفعة..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setEditingPayment(null);
                        resetForm();
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={addPaymentMutation.isPending || updatePaymentMutation.isPending}
                    >
                      {addPaymentMutation.isPending || updatePaymentMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                      ) : null}
                      {editingPayment ? 'تحديث' : 'إضافة'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">المجموع</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">القيمة الإجمالية</p>
                <p className="text-lg font-semibold">{stats.totalAmount.toLocaleString()} ريال</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">معلق</p>
                <p className="text-xl font-semibold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">مدفوع</p>
                <p className="text-xl font-semibold text-green-600">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">متأخر</p>
                <p className="text-xl font-semibold text-red-600">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* البحث والفلترة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالرقم أو الاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="overdue">متأخر</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="tuition">رسوم دراسية</SelectItem>
                <SelectItem value="registration">رسوم تسجيل</SelectItem>
                <SelectItem value="exam">رسوم امتحان</SelectItem>
                <SelectItem value="library">رسوم مكتبة</SelectItem>
                <SelectItem value="fine">غرامة</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedType('all');
              }}
            >
              مسح الفلاتر
            </Button>
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
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد مدفوعات مطابقة للفلاتر المحددة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطالب</TableHead>
                    <TableHead>اسم الطالب</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الدفع</TableHead>
                    <TableHead>رقم الفاتورة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment: any) => {
                    const student = payment.student_profiles;
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {student?.student_id || 'غير محدد'}
                        </TableCell>
                        <TableCell>
                          {student ? `${student.first_name} ${student.last_name}` : 'غير محدد'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {payment.amount?.toLocaleString() || '0'} {payment.currency}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(payment.payment_type)}</TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell>
                          {payment.payment_date ? formatDateForDisplay(payment.payment_date) : 'غير محدد'}
                        </TableCell>
                        <TableCell>{payment.invoice_number || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleEdit(payment);
                                setIsAddModalOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(payment.id, student ? `${student.first_name} ${student.last_name}` : 'غير محدد')}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagementRadical;