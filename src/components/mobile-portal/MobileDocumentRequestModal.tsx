import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  AlertCircle, 
  Loader2, 
  Calendar,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface MobileDocumentRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const MobileDocumentRequestModal: React.FC<MobileDocumentRequestModalProps> = ({
  open,
  onClose
}) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    documentType: '',
    copies: 1,
    language: 'arabic',
    urgentDelivery: false,
    deliveryMethod: 'pickup',
    contactPhone: '',
    alternativeEmail: '',
    notes: ''
  });

  const documentTypes = [
    { value: 'academic_transcript', label: 'كشف درجات أكاديمي', price: '2000' },
    { value: 'enrollment_certificate', label: 'شهادة قيد', price: '1000' },
    { value: 'graduation_certificate', label: 'شهادة تخرج', price: '3000' },
    { value: 'conduct_certificate', label: 'شهادة حسن سير وسلوك', price: '1500' },
    { value: 'enrollment_letter', label: 'خطاب قيد', price: '1000' },
    { value: 'grade_verification', label: 'تصديق درجات', price: '2500' }
  ];

  const createRequestMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!profile?.id) throw new Error('المستخدم غير مسجل الدخول');

      const selectedDoc = documentTypes.find(d => d.value === data.documentType);
      const basePrice = parseInt(selectedDoc?.price || '0');
      const urgentFee = data.urgentDelivery ? Math.floor(basePrice * 0.5) : 0;
      const totalPrice = (basePrice * data.copies) + urgentFee;

      const { error } = await supabase
        .from('service_requests')
        .insert({
          student_id: profile.id,
          service_type: 'document_request',
          title: `طلب ${selectedDoc?.label}`,
          description: `طلب ${data.copies} نسخة من ${selectedDoc?.label}`,
          priority: data.urgentDelivery ? 'urgent' : 'normal',
          status: 'pending',
          additional_data: {
            ...data,
            documentName: selectedDoc?.label,
            totalPrice,
            urgentFee
          }
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سيتم مراجعة طلبك وإرسال إشعار بالموافقة",
      });
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إرسال الطلب",
        description: error.message || 'حدث خطأ غير متوقع',
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      documentType: '',
      copies: 1,
      language: 'arabic',
      urgentDelivery: false,
      deliveryMethod: 'pickup',
      contactPhone: '',
      alternativeEmail: '',
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.documentType) {
      toast({
        title: "حقل مطلوب",
        description: "يرجى اختيار نوع الوثيقة",
        variant: "destructive"
      });
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

  const selectedDoc = documentTypes.find(d => d.value === formData.documentType);
  const basePrice = selectedDoc ? parseInt(selectedDoc.price) : 0;
  const urgentFee = formData.urgentDelivery ? Math.floor(basePrice * 0.5) : 0;
  const totalPrice = (basePrice * formData.copies) + urgentFee;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg mx-auto max-h-[90vh] overflow-y-auto rounded-2xl border-0 bg-white shadow-2xl" dir="rtl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-primary">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            طلب وثيقة رسمية
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نوع الوثيقة */}
          <Card className="border border-gray-100">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-right text-lg">
                <FileText className="h-5 w-5 text-primary" />
                نوع الوثيقة المطلوبة
              </h3>
              
              <Select 
                value={formData.documentType} 
                onValueChange={(value) => setFormData({...formData, documentType: value})}
                dir="rtl"
              >
                <SelectTrigger className="h-12 rounded-xl text-right border-2 hover:border-primary/50 focus:border-primary">
                  <SelectValue placeholder="اختر نوع الوثيقة" className="text-right" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-xl z-50" dir="rtl">
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="text-right hover:bg-primary/10 focus:bg-primary/10">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{type.label}</span>
                        <Badge variant="outline" className="mr-2 bg-primary/10 text-primary border-primary/30">{type.price} ريال</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDoc && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">{selectedDoc.label}</p>
                    <p>السعر: {selectedDoc.price} ريال يمني للنسخة الواحدة</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* تفاصيل الطلب */}
          <Card className="border border-gray-100">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-bold text-gray-800 text-right text-lg">تفاصيل الطلب</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>عدد النسخ</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.copies}
                    onChange={(e) => setFormData({...formData, copies: parseInt(e.target.value) || 1})}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label>اللغة</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})} dir="rtl">
                    <SelectTrigger className="h-12 rounded-xl text-right border-2 hover:border-primary/50 focus:border-primary">
                      <SelectValue className="text-right" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 shadow-xl z-50" dir="rtl">
                      <SelectItem value="arabic" className="text-right hover:bg-primary/10 focus:bg-primary/10 font-medium">العربية</SelectItem>
                      <SelectItem value="english" className="text-right hover:bg-primary/10 focus:bg-primary/10 font-medium">الإنجليزية</SelectItem>
                      <SelectItem value="both" className="text-right hover:bg-primary/10 focus:bg-primary/10 font-medium">كلا اللغتين (+500 ريال)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="urgent"
                  checked={formData.urgentDelivery}
                  onCheckedChange={(checked) => setFormData({...formData, urgentDelivery: checked as boolean})}
                />
                <Label htmlFor="urgent" className="text-sm">
                  تسليم عاجل خلال 24 ساعة (+50% رسوم إضافية)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* معلومات التواصل */}
          <Card className="border border-gray-100">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-4 w-4" />
                معلومات التواصل
              </h3>

              <div>
                <Label htmlFor="phone">رقم الهاتف للتواصل</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="771234567"
                  className="h-12 rounded-xl"
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="alt-email">بريد إلكتروني بديل (اختياري)</Label>
                <Input
                  id="alt-email"
                  type="email"
                  value={formData.alternativeEmail}
                  onChange={(e) => setFormData({...formData, alternativeEmail: e.target.value})}
                  placeholder="alternative@email.com"
                  className="h-12 rounded-xl"
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="أي ملاحظات أو متطلبات خاصة..."
                  className="rounded-xl"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* ملخص التكلفة */}
          {selectedDoc && (
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800 mb-3">ملخص التكلفة</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>سعر الوثيقة ({formData.copies} نسخة)</span>
                    <span>{basePrice * formData.copies} ريال</span>
                  </div>
                  {formData.urgentDelivery && (
                    <div className="flex justify-between text-orange-600">
                      <span>رسوم التسليم العاجل</span>
                      <span>{urgentFee} ريال</span>
                    </div>
                  )}
                  {formData.language === 'both' && (
                    <div className="flex justify-between text-blue-600">
                      <span>رسوم الترجمة</span>
                      <span>500 ريال</span>
                    </div>
                  )}
                  <div className="border-t border-green-300 pt-2 font-bold text-green-800 flex justify-between">
                    <span>المجموع</span>
                    <span>{totalPrice + (formData.language === 'both' ? 500 : 0)} ريال</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* تنبيه مهم */}
          <Card className="border border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-2">معلومات مهمة:</p>
                  <ul className="space-y-1 text-xs leading-relaxed">
                    <li>• سيتم إشعارك عبر الرسائل النصية والبريد الإلكتروني</li>
                    <li>• يجب إحضار الهوية الشخصية عند الاستلام</li>
                    <li>• الوثائق العاجلة تحتاج موافقة إضافية</li>
                    <li>• يمكن الدفع عند الاستلام أو مسبقاً</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أزرار العمل */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createRequestMutation.isPending}
              className="flex-1 h-12 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createRequestMutation.isPending || !formData.documentType}
              className="flex-1 h-12 rounded-xl bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white"
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

export default MobileDocumentRequestModal;