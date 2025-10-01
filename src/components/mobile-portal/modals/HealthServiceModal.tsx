import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, CalendarIcon, AlertCircle } from 'lucide-react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface HealthServiceModalProps {
  open: boolean;
  onClose: () => void;
}

const HealthServiceModal: React.FC<HealthServiceModalProps> = ({ open, onClose }) => {
  const { createServiceRequest } = useServiceRequests();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    serviceType: '',
    symptoms: '',
    medicalHistory: 'no',
    medicalDetails: '',
    medications: '',
    allergies: '',
    emergencyContact: '',
    notes: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceType) {
      toast({ title: "خطأ", description: "يرجى اختيار نوع الخدمة الصحية", variant: "destructive" });
      return;
    }

    try {
      await createServiceRequest.mutateAsync({
        title: `طلب خدمة صحية: ${getServiceTypeName(formData.serviceType)}`,
        description: formData.symptoms || 'طلب خدمة صحية',
        service_type: 'health_services',
        priority: formData.serviceType === 'emergency' ? 'urgent' : 'normal',
        additional_data: {
          ...formData,
          preferredDate: selectedDate?.toISOString(),
          preferredTime: selectedTime
        }
      });
      
      setFormData({
        serviceType: '',
        symptoms: '',
        medicalHistory: 'no',
        medicalDetails: '',
        medications: '',
        allergies: '',
        emergencyContact: '',
        notes: ''
      });
      setSelectedDate(undefined);
      setSelectedTime('');
      
      onClose();
      toast({ title: "نجح", description: "تم إرسال طلب الخدمة الصحية بنجاح" });
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في إرسال الطلب", variant: "destructive" });
    }
  };

  const getServiceTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      'general_checkup': 'فحص عام',
      'emergency': 'حالة طوارئ',
      'consultation': 'استشارة طبية',
      'prescription': 'وصفة طبية',
      'health_certificate': 'شهادة صحية',
      'vaccination': 'تطعيم'
    };
    return types[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />
            طلب خدمة صحية
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>نوع الخدمة الصحية *</Label>
                <Select 
                  value={formData.serviceType} 
                  onValueChange={(value) => setFormData({...formData, serviceType: value})}
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
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  placeholder="اذكر الأعراض أو سبب المراجعة..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label>هل لديك تاريخ مرضي؟</Label>
                <RadioGroup 
                  value={formData.medicalHistory} 
                  onValueChange={(value) => setFormData({...formData, medicalHistory: value})}
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

              {formData.medicalHistory === 'yes' && (
                <div>
                  <Label>التاريخ المرضي</Label>
                  <Textarea
                    value={formData.medicalDetails}
                    onChange={(e) => setFormData({...formData, medicalDetails: e.target.value})}
                    placeholder="اذكر التاريخ المرضي والأمراض المزمنة..."
                  />
                </div>
              )}

              <div>
                <Label>الأدوية الحالية</Label>
                <Textarea
                  value={formData.medications}
                  onChange={(e) => setFormData({...formData, medications: e.target.value})}
                  placeholder="اذكر الأدوية التي تتناولها حالياً..."
                />
              </div>

              <div>
                <Label>الحساسية</Label>
                <Input
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  placeholder="هل لديك حساسية من أدوية أو مواد معينة؟"
                />
              </div>

              <div>
                <Label>رقم هاتف للطوارئ</Label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  placeholder="رقم هاتف لشخص يمكن الاتصال به في حالة الطوارئ"
                />
              </div>

              {formData.serviceType !== 'emergency' && (
                <>
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
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={createServiceRequest.isPending || !formData.serviceType}
              className="flex-1"
            >
              {createServiceRequest.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">معلومات مهمة:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• العيادة الطبية مفتوحة من 8 صباحاً إلى 4 عصراً</li>
                    <li>• في حالات الطوارئ اتصل على: 123-456-789</li>
                    <li>• يرجى إحضار البطاقة الطلابية والهوية</li>
                    <li>• للحالات الخطيرة توجه للمستشفى مباشرة</li>
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

export default HealthServiceModal;