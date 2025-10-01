import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';

interface GeneralServiceModalProps {
  open: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    description: string;
    icon: any;
  } | null;
}

const GeneralServiceModal: React.FC<GeneralServiceModalProps> = ({ open, onClose, service }) => {
  const { createServiceRequest } = useServiceRequests();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    contactMethod: 'email',
    phoneNumber: '',
    preferredContactTime: '',
    additionalDetails: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !formData.description) {
      toast({ title: "خطأ", description: "يرجى ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }

    try {
      await createServiceRequest.mutateAsync({
        title: formData.title || `طلب ${service.title}`,
        description: formData.description,
        service_type: service.id,
        priority: formData.priority,
        additional_data: formData
      });
      
      setFormData({
        title: '',
        description: '',
        priority: 'normal',
        contactMethod: 'email',
        phoneNumber: '',
        preferredContactTime: '',
        additionalDetails: '',
        notes: ''
      });
      
      onClose();
      toast({ title: "نجح", description: "تم إرسال الطلب بنجاح" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إرسال الطلب", variant: "destructive" });
    }
  };

  if (!service) return null;

  const Icon = service.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            طلب خدمة: {service.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border border-university-blue/10 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">عنوان الطلب</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={`طلب ${service.title}`}
                  className="h-12 border-university-blue/20 rounded-xl text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">وصف مفصل للطلب *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="اشرح طلبك بالتفصيل..."
                  className="min-h-[120px] border-university-blue/20 rounded-xl text-right"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">أولوية الطلب</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger className="h-12 border-university-blue/20 rounded-xl text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="normal">عادية</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                    <SelectItem value="urgent">عاجلة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">طريقة التواصل المفضلة</Label>
                <Select value={formData.contactMethod} onValueChange={(value) => setFormData({...formData, contactMethod: value})}>
                  <SelectTrigger className="h-12 border-university-blue/20 rounded-xl text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">البريد الإلكتروني</SelectItem>
                    <SelectItem value="phone">الهاتف</SelectItem>
                    <SelectItem value="sms">رسائل نصية</SelectItem>
                    <SelectItem value="in_person">مقابلة شخصية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.contactMethod === 'phone' || formData.contactMethod === 'sms') && (
                <div className="space-y-3">
                  <Label className="text-university-blue font-semibold text-right block">رقم الهاتف</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="أدخل رقم هاتفك"
                    className="h-12 border-university-blue/20 rounded-xl text-right"
                    dir="rtl"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">الوقت المفضل للتواصل</Label>
                <Select value={formData.preferredContactTime} onValueChange={(value) => setFormData({...formData, preferredContactTime: value})}>
                  <SelectTrigger className="h-12 border-university-blue/20 rounded-xl text-right">
                    <SelectValue placeholder="اختر الوقت المناسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">صباحاً (8-12)</SelectItem>
                    <SelectItem value="afternoon">ظهراً (12-4)</SelectItem>
                    <SelectItem value="evening">مساءً (4-8)</SelectItem>
                    <SelectItem value="anytime">أي وقت</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">تفاصيل إضافية</Label>
                <Textarea
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
                  placeholder="أي معلومات إضافية تريد إضافتها..."
                  className="min-h-[100px] border-university-blue/20 rounded-xl text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-university-blue font-semibold text-right block">ملاحظات</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات أخرى..."
                  className="min-h-[100px] border-university-blue/20 rounded-xl text-right"
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={createServiceRequest.isPending || !formData.description}
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

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">معلومات مهمة:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• سيتم مراجعة طلبك خلال 1-3 أيام عمل</li>
                    <li>• ستصلك رسالة تأكيد على البريد الإلكتروني</li>
                    <li>• يمكنك متابعة حالة الطلب من صفحة "طلباتي"</li>
                    <li>• للاستفسارات العاجلة، اتصل بخدمة الطلاب</li>
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

export default GeneralServiceModal;