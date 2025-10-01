
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Eye, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  };
};

const PaymentsManagement: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: payments, isLoading } = useQuery({
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
            email
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
      toast({ title: "تم التحديث", description: "تم تحديث حالة الدفعة بنجاح." });
    },
    meta: {
      onError: (_: unknown) => {
        toast({ title: "خطأ", description: "فشل في تحديث حالة الدفعة.", variant: "destructive" });
      },
    },
  });

  const filteredPayments = payments?.filter(payment => {
    const student = payment.student_profiles;
    const matchesSearch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "معلق", variant: "secondary" as const },
      paid: { label: "مدفوع", variant: "default" as const },
      overdue: { label: "متأخر", variant: "destructive" as const },
      cancelled: { label: "ملغى", variant: "outline" as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          تصدير التقرير
        </Button>
      </div>

      {/* إحصائيات المدفوعات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">إجمالي المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatAmount(totalStats.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">المدفوعات المكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{formatAmount(totalStats.paid)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">المدفوعات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-yellow-600">{formatAmount(totalStats.pending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">المدفوعات المتأخرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{formatAmount(totalStats.overdue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، رقم الطالب، أو رقم المرجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
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
            <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
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
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.reference_number || `PAY-${payment.id.slice(0, 8)}`}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.first_name} {student.last_name}</div>
                            <div className="text-sm text-muted-foreground">{student.student_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{payment.payment_type}</TableCell>
                        <TableCell className="font-medium">
                          {formatAmount(payment.amount, payment.currency)}
                        </TableCell>
                        <TableCell>
                          {payment.due_date ? new Date(payment.due_date).toLocaleDateString('ar-EG') : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            {payment.payment_status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updatePaymentStatus.mutate({ id: payment.id, status: 'paid' })}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updatePaymentStatus.mutate({ id: payment.id, status: 'cancelled' })}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
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

export default PaymentsManagement;
