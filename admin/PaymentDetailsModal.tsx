
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  FileText,
  Building,
  Hash
} from "lucide-react";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    id: string;
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
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تفاصيل المدفوعة
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* معلومات أساسية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">رقم المرجع</p>
                <p className="font-medium">
                  {payment.reference_number || `PAY-${payment.id.slice(0, 8)}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الحالة</p>
                <div className="mt-1">
                  {getStatusBadge(payment.payment_status)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المبلغ</p>
                <p className="font-bold text-lg text-primary">
                  {formatAmount(payment.amount, payment.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع الدفعة</p>
                <p className="font-medium">{payment.payment_type}</p>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الطالب */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                معلومات الطالب
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">رقم الطالب</p>
                <p className="font-medium">{payment.student_profiles.student_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">اسم الطالب</p>
                <p className="font-medium">
                  {payment.student_profiles.first_name} {payment.student_profiles.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-medium">{payment.student_profiles.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الكلية</p>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <p className="font-medium">{payment.student_profiles.college}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* التواريخ والأوقات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                التواريخ والأوقات
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                <p className="font-medium">{formatDate(payment.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الاستحقاق</p>
                <p className="font-medium">{formatDate(payment.due_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الدفع</p>
                <p className="font-medium">{formatDate(payment.payment_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">طريقة الدفع</p>
                <p className="font-medium">
                  {payment.payment_method || "غير محدد"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* معلومات أكاديمية */}
          {(payment.academic_year || payment.semester) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  معلومات أكاديمية
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">السنة الدراسية</p>
                  <p className="font-medium">{payment.academic_year || "غير محدد"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الفصل الدراسي</p>
                  <p className="font-medium">
                    {payment.semester ? `الفصل ${payment.semester}` : "غير محدد"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* الملاحظات */}
          {payment.notes && (
            <Card>
              <CardHeader>
                <CardTitle>الملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {payment.notes}
                </p>
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="flex justify-end">
            <Button onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsModal;
