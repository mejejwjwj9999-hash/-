import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  GraduationCap,
  Heart,
  Briefcase
} from 'lucide-react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

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

const EnhancedServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  open,
  onClose,
  service
}) => {
  const { createServiceRequest } = useServiceRequests();
  const { toast } = useToast();
  
  // بيانات الطلب العامة
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    contactMethod: 'email',
    phoneNumber: '',
    emergencyContact: '',
    notes: ''
  });

  // بيانات خاصة بكل خدمة
  const [serviceSpecificData, setServiceSpecificData] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    try {
      const requestData = {
        title: formData.title || service.title,
        description: formData.description,
        service_type: service.id,
        priority: formData.priority,
        additional_data: {
          ...serviceSpecificData,
          contactMethod: formData.contactMethod,
          phoneNumber: formData.phoneNumber,
          emergencyContact: formData.emergencyContact,
          notes: formData.notes,
          selectedDate: selectedDate?.toISOString(),
          selectedTime
        }
      };

      await createServiceRequest.mutateAsync(requestData);
      
      // إعادة تعيين النموذج
      setFormData({
        title: '',
        description: '',
        priority: 'normal',
        contactMethod: 'email',
        phoneNumber: '',
        emergencyContact: '',
        notes: ''
      });
      setServiceSpecificData({});
      setSelectedDate(undefined);
      setSelectedTime('');
      setAttachments([]);
      
      onClose();
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };

  const renderServiceSpecificFields = () => {
    if (!service) return null;

    switch (service.id) {
      case 'document_requests':
        return (
          <div className="space-y-4">
            <div>
              <Label>نوع الوثيقة المطلوبة</Label>
              <Select 
                value={serviceSpecificData.documentType || ''} 
                onValueChange={(value) => setServiceSpecificData({...serviceSpecificData, documentType: value})}
              >
                <SelectTrigger>
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

            <div>
              <Label>عدد النسخ المطلوبة</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={serviceSpecificData.copies || 1}
                onChange={(e) => setServiceSpecificData({...serviceSpecificData, copies: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <Label>اللغة المطلوبة</Label>
              <RadioGroup 
                value={serviceSpecificData.language || 'arabic'} 
                onValueChange={(value) => setServiceSpecificData({...serviceSpecificData, language: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="arabic" id="arabic" />
                  <Label htmlFor="arabic">العربية</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="english" id="english" />
                  <Label htmlFor="english">الإنجليزية</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">كلا اللغتين</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="urgent_delivery"
                checked={serviceSpecificData.urgentDelivery || false}
                onCheckedChange={(checked) => setServiceSpecificData({...serviceSpecificData, urgentDelivery: checked})}
              />
              <Label htmlFor="urgent_delivery">تسليم عاجل (رسوم إضافية)</Label>
            </div>
          </div>
        );

      case 'health_services':
        return (
          <div className="space-y-4">
            <div>
              <Label>نوع الخدمة الصحية</Label>
              <Select 
                value={serviceSpecificData.serviceType || ''} 
                onValueChange={(value) => setServiceSpecificData({...serviceSpecificData, serviceType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general_checkup">فحص عام</SelectItem>
                  <SelectItem value="emergency">حالة طوارئ</SelectItem>
                  <SelectItem value="consultation">استشارة طبية</SelectItem>
                  <SelectItem value="prescription">وصفة طبية</SelectItem>
                  <SelectItem value="health_certificate">شهادة صحية</SelectItem>
                  <SelectItem value="vaccination">تطعيم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>الأعراض أو السبب</Label>
              <Textarea
                value={serviceSpecificData.symptoms || ''}
                onChange={(e) => setServiceSpecificData({...serviceSpecificData, symptoms: e.target.value})}
                placeholder="اذكر الأعراض أو سبب المراجعة..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>هل لديك تاريخ مرضي؟</Label>
              <RadioGroup 
                value={serviceSpecificData.medicalHistory || 'no'} 
                onValueChange={(value) => setServiceSpecificData({...serviceSpecificData, medicalHistory: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no_history" />
                  <Label htmlFor="no_history">لا</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes_history" />
                  <Label htmlFor="yes_history">نعم</Label>
                </div>
              </RadioGroup>
            </div>

            {serviceSpecificData.medicalHistory === 'yes' && (
              <div>
                <Label>التاريخ المرضي</Label>
                <Textarea
                  value={serviceSpecificData.medicalDetails || ''}
                  onChange={(e) => setServiceSpecificData({...serviceSpecificData, medicalDetails: e.target.value})}
                  placeholder="اذكر التاريخ المرضي والأدوية التي تتناولها..."
                />
              </div>
            )}

            <div>
              <Label>تاريخ الموعد المفضل</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>الوقت المفضل</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوقت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8:00">8:00 صباحاً</SelectItem>
                  <SelectItem value="9:00">9:00 صباحاً</SelectItem>
                  <SelectItem value="10:00">10:00 صباحاً</SelectItem>
                  <SelectItem value="11:00">11:00 صباحاً</SelectItem>
                  <SelectItem value="12:00">12:00 ظهراً</SelectItem>
                  <SelectItem value="1:00">1:00 ظهراً</SelectItem>
                  <SelectItem value="2:00">2:00 ظهراً</SelectItem>
                  <SelectItem value="3:00">3:00 ظهراً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label>تفاصيل إضافية</Label>
            <Textarea
              value={serviceSpecificData.additionalDetails || ''}
              onChange={(e) => setServiceSpecificData({...serviceSpecificData, additionalDetails: e.target.value})}
              placeholder="اذكر أي تفاصيل إضافية للطلب..."
              className="min-h-[100px]"
            />
          </div>
        );
    }
  };

  if (!service) return null;

  const Icon = service.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div>طلب خدمة: {service.title}</div>
              <Badge variant="outline" className="text-xs mt-1">
                {service.category === 'academic' && 'أكاديمية'}
                {service.category === 'administrative' && 'إدارية'}
                {service.category === 'support' && 'دعم الطلاب'}
                {service.category === 'health' && 'صحية'}
                {service.category === 'career' && 'مهنية'}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* بيانات الطلب الأساسية */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                بيانات الطلب
              </h3>

              <div>
                <Label>عنوان الطلب</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={`طلب ${service.title}`}
                />
              </div>

              <div>
                <Label>وصف مفصل للطلب</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="اشرح طلبك بالتفصيل..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label>أولوية الطلب</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
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
            </CardContent>
          </Card>

          {/* الحقول الخاصة بالخدمة */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Icon className="h-4 w-4" />
                تفاصيل الخدمة
              </h3>
              {renderServiceSpecificFields()}
            </CardContent>
          </Card>

          {/* أزرار العمل */}
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={createServiceRequest.isPending || !formData.description}
              className="flex-1"
            >
              {createServiceRequest.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>

          {/* تنبيه مهم */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">معلومات مهمة:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• سيتم مراجعة طلبك خلال 1-3 أيام عمل</li>
                    <li>• ستصلك رسالة تأكيد على البريد الإلكتروني</li>
                    <li>• يمكنك متابعة حالة الطلب من صفحة "طلباتي"</li>
                    <li>• للطوارئ، يرجى الاتصال بالرقم: 123-456-789</li>
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

export default EnhancedServiceRequestModal;