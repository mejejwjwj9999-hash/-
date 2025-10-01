
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download, 
  Eye, 
  Check, 
  X, 
  Plus, 
  RefreshCw,
  DollarSign,
  CreditCard,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddPaymentModal from "./AddPaymentModal";
import PaymentDetailsModal from "./PaymentDetailsModal";

type Payment = {
  id: string;
  student_id: string;
  amount: number;
  payment_type: string;
  payment_status: string;
  payment_method?: string;
  payment_date?: string;
  due_date?: string;
  reference_number?: string;
  currency: string;
  academic_year?: string;
  semester?: string;
  notes?: string;
  created_at: string;
  student_profiles: {
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    college: string;
  };
};

const PaymentsManagementFixed: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: payments, isLoading, refetch } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          student_profiles!payments_student_id_fkey (
            id,
            student_id,
            first_name,
            last_name,
            email,
            college
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Payment[] || [];
    },
    staleTime: 1000 * 30,
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: any = { payment_status: status };
      if (status === "paid") {
        updateData.payment_date = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
      toast({ 
        title: "تم التحديث", 
        description: "تم تحديث حالة الدفعة بنجاح."
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ في التحديث", 
        description: error.message || "فشل في تحديث حالة الدفعة.",
        variant: "destructive" 
      });
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payments")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المدفوعة بنجاح."
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في الحذف",
        description: error.message || "فشل في حذف المدفوعة.",
        variant: "destructive"
      });
    },
  });

  const exportPayments = () => {
    if (!payments) return;
    
    const csvContent = [
      "رقم المرجع,الطالب,نوع الدفعة,المبلغ,الحالة,تاريخ الاستحقاق,تاريخ الدفع",
      ...payments.map(payment => 
        `${payment.reference_number || payment.id.slice(0, 8)},${payment.student_profiles.first_name} ${payment.student_profiles.last_name},${payment.payment_type},${payment.amount} ${payment.currency},${payment.payment_status},${payment.due_date || '-'},${payment.payment_date || '-'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "payments_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "تم التصدير", description: "تم تصدير تقرير المدفوعات بنجاح." });
  };

  const filteredPayments = payments?.filter(payment => {
    const student = payment.student_profiles;
    const matchesSearch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
    const matchesType = typeFilter === "all" || payment.payment_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "معلق", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      paid: { label: "مدفوع", variant: "default" as const, color: "bg-green-100 text-green-800" },
      overdue: { label: "متأخر", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      cancelled: { label: "ملغى", variant: "outline" as const, color: "bg-gray-100 text-gray-800" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string = "YER") => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const totalStats = {
    total: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    paid: filteredPayments.filter(p => p.payment_status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pending: filteredPayments.filter(p => p.payment_status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdue: filteredPayments.filter(p => p.payment_status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
  };

  const paymentTypes = Array.from(new Set(payments?.map(p => p.payment_type) || []));

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المدفوعة؟")) {
      deletePayment.mutate(id);
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={exportPayments} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة مدفوعة
          </Button>
        </div>
      </div>

      {/* إحصائيات المدفوعات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              إجمالي المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatAmount(totalStats.total)}</div>
            <p className="text-xs text-muted-foreground">{filteredPayments.length} مدفوعة</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="h-4 w-4" />
              المدفوعات المكتملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatAmount(totalStats.paid)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.payment_status === 'paid').length} مدفوعة
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              المدفوعات المعلقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatAmount(totalStats.pending)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.payment_status === 'pending').length} مدفوعة
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              المدفوعات المتأخرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatAmount(totalStats.overdue)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.payment_status === 'overdue').length} مدفوعة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، رقم الطالب، رقم المرجع، أو نوع الدفعة..."
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
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="overdue">متأخر</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="فلترة بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {paymentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول المدفوعات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المدفوعات ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم المرجع</TableHead>
                    <TableHead>اسم الطالب</TableHead>
                    <TableHead>نوع الدفعة</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>تاريخ الاستحقاق</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const student = payment.student_profiles;
                    return (
                      <TableRow key={payment.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {payment.reference_number || `PAY-${payment.id.slice(0, 8)}`}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.first_name} {student.last_name}</div>
                            <div className="text-sm text-muted-foreground">{student.student_id}</div>
                            <div className="text-xs text-muted-foreground">{student.college}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.payment_type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAmount(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell>
                          {payment.due_date ? (
                            <div className="text-sm">
                              {new Date(payment.due_date).toLocaleDateString('ar-EG')}
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(payment)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {payment.payment_status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updatePaymentStatus.mutate({ id: payment.id, status: 'paid' })}
                                  className="text-green-600 hover:text-green-700"
                                  disabled={updatePaymentStatus.isPending}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updatePaymentStatus.mutate({ id: payment.id, status: 'cancelled' })}
                                  className="text-red-600 hover:text-red-700"
                                  disabled={updatePaymentStatus.isPending}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(payment.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
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

      {/* Modals */}
      <AddPaymentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          qc.invalidateQueries({ queryKey: ["admin-payments"] });
        }}
      />
      
      {selectedPayment && (
        <PaymentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}
    </div>
  );
};

export default PaymentsManagementFixed;
