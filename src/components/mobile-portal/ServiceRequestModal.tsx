import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';

interface ServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: any;
  } | null;
}

const ServiceRequestModal = ({ open, onClose, service }: ServiceRequestModalProps) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    service_type: '',
    title: '',
    description: '',
    priority: 'normal'
  });

  const serviceTypes = [
    { value: 'transcript', label: 'كشف الدرجات' },
    { value: 'certificate', label: 'شهادة التخرج' },
    { value: 'enrollment', label: 'إفادة قيد' },
    { value: 'payment_receipt', label: 'إيصال دفع' },
    { value: 'schedule_change', label: 'تعديل الجدول' },
    { value: 'technical_support', label: 'الدعم التقني' },
    { value: 'contact_admin', label: 'التواصل مع الإدارة' },
  ];

  const priorities = [
    { value: 'low', label: 'منخفض' },
    { value: 'normal', label: 'عادي' },
    { value: 'high', label: 'مرتفع' },
    { value: 'urgent', label: 'عاجل' }
  ];

  const createRequestMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!profile?.id) throw new Error('المستخدم غير مسجل الدخول');

      const { error } = await supabase
        .from('service_requests')
        .insert({
          student_id: profile.id,
          service_type: data.service_type,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('تم إرسال الطلب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      console.error('Error creating service request:', error);
      toast.error('فشل في إرسال الطلب: ' + (error.message || 'خطأ غير معروف'));
    }
  });

  const resetForm = () => {
    setFormData({
      service_type: '',
      title: '',
      description: '',
      priority: 'normal'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service_type || !formData.title) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    createRequestMutation.mutate(formData);
  };

  const handleClose = () => {
    if (!createRequestMutation.isPending) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg mx-3 max-h-[90vh] overflow-y-auto rounded-2xl border-0 bg-white shadow-2xl" dir="rtl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-primary">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            طلب خدمة جديدة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نوع الخدمة */}
          <Card className="border border-university-blue/10 shadow-soft">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-university-blue flex items-center gap-3 text-right">
                <FileText className="h-5 w-5" />
                نوع الخدمة
              </h3>
              
              <Select 
                value={formData.service_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
              >
                <SelectTrigger className="h-12 rounded-xl border-university-blue/20 text-right">
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* تفاصيل الطلب */}
          <Card className="border border-university-blue/10 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold text-university-blue text-right">تفاصيل الطلب</h3>
              
              <div className="space-y-3">
                <Label htmlFor="title" className="text-university-blue font-semibold text-right block">عنوان الطلب *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="اكتب عنوان واضح للطلب"
                  className="h-12 rounded-xl border-university-blue/20 text-right"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-university-blue font-semibold text-right block">وصف مفصل للطلب</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="اشرح طلبك بالتفصيل..."
                  className="rounded-xl min-h-[120px] border-university-blue/20 text-right"
                  dir="rtl"
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="priority" className="text-university-blue font-semibold text-right block">أولوية الطلب</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="h-12 rounded-xl border-university-blue/20 text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* معلومات مهمة */}
          <Card className="border border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-2">معلومات مهمة:</p>
                  <ul className="space-y-1 text-xs leading-relaxed">
                    <li>• سيتم مراجعة طلبك خلال 1-3 أيام عمل</li>
                    <li>• ستصلك رسالة تأكيد على البريد الإلكتروني</li>
                    <li>• يمكنك متابعة حالة الطلب من صفحة "طلباتي"</li>
                    <li>• للطوارئ، يرجى الاتصال بالرقم: 123-456-789</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أزرار العمل */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createRequestMutation.isPending}
              className="flex-1 h-12 rounded-xl border-university-blue text-university-blue hover:bg-university-blue/5"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createRequestMutation.isPending || !formData.service_type}
              className="flex-1 h-12 rounded-xl bg-university-blue hover:bg-university-blue/90 text-white font-semibold"
            >
              {createRequestMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                'إرسال الطلب'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestModal;