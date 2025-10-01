import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';

interface DocumentRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const DocumentRequestModal: React.FC<DocumentRequestModalProps> = ({ open, onClose }) => {
  const { createServiceRequest } = useServiceRequests();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    documentType: '',
    copies: 1,
    language: 'arabic',
    urgentDelivery: false,
    purpose: '',
    deliveryAddress: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.documentType) {
      toast({ title: "خطأ", description: "يرجى اختيار نوع الوثيقة", variant: "destructive" });
      return;
    }

    try {
      await createServiceRequest.mutateAsync({
        title: `طلب ${getDocumentTypeName(formData.documentType)}`,
        description: `طلب إصدار ${getDocumentTypeName(formData.documentType)} - ${formData.copies} نسخة`,
        service_type: 'document_requests',
        priority: formData.urgentDelivery ? 'urgent' : 'normal',
        additional_data: formData
      });
      
      setFormData({
        documentType: '',
        copies: 1,
        language: 'arabic',
        urgentDelivery: false,
        purpose: '',
        deliveryAddress: '',
        notes: ''
      });
      
      onClose();
      toast({ title: "نجح", description: "تم إرسال طلب الوثيقة بنجاح" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إرسال الطلب", variant: "destructive" });
    }
  };

  const getDocumentTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      'transcript': 'كشف درجات',
      'enrollment_certificate': 'شهادة قيد',
      'graduation_certificate': 'شهادة تخرج',
      'conduct_certificate': 'شهادة حسن سيرة وسلوك',
      'enrollment_letter': 'خطاب قيد',
      'grade_verification': 'تصديق درجات'
    };
    return types[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            طلب الوثائق الرسمية
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border border-university-blue/10 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">نوع الوثيقة المطلوبة *</Label>
                <Select 
                  value={formData.documentType} 
                  onValueChange={(value) => setFormData({...formData, documentType: value})}
                >
                  <SelectTrigger className="h-12 border-university-blue/20 rounded-xl text-right">
                    <SelectValue placeholder="اختر نوع الوثيقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transcript">كشف درجات</SelectItem>
                    <SelectItem value="enrollment_certificate">شهادة قيد</SelectItem>
                    <SelectItem value="graduation_certificate">شهادة تخرج</SelectItem>
                    <SelectItem value="conduct_certificate">شهادة حسن سيرة وسلوك</SelectItem>
                    <SelectItem value="enrollment_letter">خطاب قيد</SelectItem>
                    <SelectItem value="grade_verification">تصديق درجات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">عدد النسخ المطلوبة</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.copies}
                  onChange={(e) => setFormData({...formData, copies: parseInt(e.target.value)})}
                  className="h-12 border-university-blue/20 rounded-xl text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">اللغة المطلوبة</Label>
                <RadioGroup 
                  value={formData.language} 
                  onValueChange={(value) => setFormData({...formData, language: value})}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-end space-x-reverse space-x-3">
                    <Label htmlFor="arabic" className="text-academic-gray cursor-pointer">العربية</Label>
                    <RadioGroupItem value="arabic" id="arabic" className="border-university-blue" />
                  </div>
                  <div className="flex items-center justify-end space-x-reverse space-x-3">
                    <Label htmlFor="english" className="text-academic-gray cursor-pointer">الإنجليزية</Label>
                    <RadioGroupItem value="english" id="english" className="border-university-blue" />
                  </div>
                  <div className="flex items-center justify-end space-x-reverse space-x-3">
                    <Label htmlFor="both" className="text-academic-gray cursor-pointer">كلا اللغتين</Label>
                    <RadioGroupItem value="both" id="both" className="border-university-blue" />
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">الغرض من الوثيقة</Label>
                <Input
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  placeholder="مثال: للعمل، للدراسة، للسفر..."
                  className="h-12 border-university-blue/20 rounded-xl text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">عنوان التسليم</Label>
                <Input
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                  placeholder="العنوان الذي تريد استلام الوثيقة فيه"
                  className="h-12 border-university-blue/20 rounded-xl text-right"
                  dir="rtl"
                />
              </div>

              <div className="flex items-center justify-end space-x-reverse space-x-3">
                <Label htmlFor="urgent_delivery" className="text-academic-gray cursor-pointer">تسليم عاجل (رسوم إضافية)</Label>
                <Checkbox 
                  id="urgent_delivery"
                  checked={formData.urgentDelivery}
                  onCheckedChange={(checked) => setFormData({...formData, urgentDelivery: checked as boolean})}
                  className="border-university-blue"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={createServiceRequest.isPending || !formData.documentType}
              className="flex-1 h-12 rounded-xl bg-university-blue hover:bg-university-blue/90 text-white font-semibold"
            >
              {createServiceRequest.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12 rounded-xl border-university-blue text-university-blue hover:bg-university-blue/5"
            >
              إلغاء
            </Button>
          </div>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">معلومات مهمة:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• سيتم تجهيز الوثائق خلال 3-5 أيام عمل</li>
                    <li>• التسليم العاجل خلال 24 ساعة (رسوم إضافية)</li>
                    <li>• يمكن الاستلام من مكتب شؤون الطلاب</li>
                    <li>• مطلوب إحضار الهوية الشخصية عند الاستلام</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentRequestModal;