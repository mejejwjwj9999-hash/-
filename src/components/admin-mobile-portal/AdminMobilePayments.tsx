import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Search, 
  Plus, 
  Eye, 
  Calendar,
  User,
  CreditCard
} from "lucide-react";

const AdminMobilePayments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          student_profiles!payments_student_id_fkey (
            first_name,
            last_name,
            student_id
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredPayments = payments.filter(payment =>
    payment.student_profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.student_profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.student_profiles?.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payment_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">مكتمل</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">معلق</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">فاشل</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">جاري تحميل المدفوعات...</p>
        </div>
      </div>
    );
  }

  const totalAmount = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <div className="space-y-4 p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <DollarSign className="h-6 w-6 text-university-blue" />
          <h1 className="text-xl font-bold text-university-blue">إدارة المدفوعات</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          إجمالي المدفوعات: {payments.length} | المبلغ المحصل: {totalAmount.toLocaleString()} ر.ي
        </p>
      </div>

      {/* Search and Add */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث في المدفوعات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        
        <Button className="w-full bg-university-blue hover:bg-university-blue-dark text-white">
          <Plus className="h-4 w-4 ml-2" />
          إضافة دفعة جديدة
        </Button>
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? "لم يتم العثور على مدفوعات" : "لا توجد مدفوعات"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => (
            <Card key={payment.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <h3 className="font-semibold text-university-blue text-sm">
                          {payment.student_profiles?.first_name && payment.student_profiles?.last_name 
                            ? `${payment.student_profiles.first_name} ${payment.student_profiles.last_name}` 
                            : 'غير محدد'}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600">
                        رقم الطالب: {payment.student_profiles?.student_id || 'غير محدد'}
                      </p>
                    </div>
                    {getStatusBadge(payment.payment_status)}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">المبلغ:</span>
                      <span className="text-sm font-bold text-university-blue">
                        {Number(payment.amount).toLocaleString()} ر.ي
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">نوع الدفع:</span>
                      <span className="text-xs text-gray-800">{payment.payment_type || 'غير محدد'}</span>
                    </div>
                    {payment.payment_method && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">طريقة الدفع:</span>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-800">{payment.payment_method}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(payment.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    <Eye className="h-3 w-3 ml-1" />
                    عرض التفاصيل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMobilePayments;