
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    student_id: "",
    amount: "",
    payment_type: "",
    payment_status: "pending",
    currency: "YER",
    due_date: "",
    academic_year: new Date().getFullYear().toString(),
    semester: "1",
    notes: "",
  });

  // جلب قائمة الطلاب
  const { data: students } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("id, student_id, first_name, last_name, college")
        .eq("status", "active")
        .order("student_id");
      if (error) throw error;
      return data || [];
    },
    enabled: isOpen,
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const { error } = await supabase
        .from("payments")
        .insert([{
          ...paymentData,
          amount: parseFloat(paymentData.amount),
          reference_number: `PAY-${Date.now()}`,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء المدفوعة",
        description: "تم إنشاء المدفوعة بنجاح",
      });
      onSuccess();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء المدفوعة",
        description: error.message || "فشل في إنشاء المدفوعة",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.amount || !formData.payment_type) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    createPaymentMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      student_id: "",
      amount: "",
      payment_type: "",
      payment_status: "pending",
      currency: "YER",
      due_date: "",
      academic_year: new Date().getFullYear().toString(),
      semester: "1",
      notes: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const paymentTypes = [
    "الرسوم الدراسية",
    "رسوم التسجيل",
    "رسوم الامتحانات",
    "رسوم المختبرات",
    "رسوم الكتب",
    "رسوم السكن",
    "رسوم النقل",
    "رسوم إضافية",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة مدفوعة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_id">الطالب *</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => handleInputChange("student_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطالب" />
                </SelectTrigger>
                <SelectContent>
                  {students?.filter(student => student.id && student.student_id).map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.student_id} - {student.first_name} {student.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment_type">نوع الدفعة *</Label>
              <Select
                value={formData.payment_type}
                onValueChange={(value) => handleInputChange("payment_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الدفعة" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.filter(type => type && type.trim() !== "").map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">المبلغ *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">العملة</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YER">ريال يمني</SelectItem>
                  <SelectItem value="USD">دولار أمريكي</SelectItem>
                  <SelectItem value="SAR">ريال سعودي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="academic_year">السنة الدراسية</Label>
              <Select
                value={formData.academic_year}
                onValueChange={(value) => handleInputChange("academic_year", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="semester">الفصل الدراسي</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleInputChange("semester", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">الفصل الأول</SelectItem>
                  <SelectItem value="2">الفصل الثاني</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange("due_date", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="payment_status">حالة الدفعة</Label>
            <Select
              value={formData.payment_status}
              onValueChange={(value) => handleInputChange("payment_status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="overdue">متأخر</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="ملاحظات إضافية..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={createPaymentMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createPaymentMutation.isPending ? "جاري الإنشاء..." : "إنشاء المدفوعة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
