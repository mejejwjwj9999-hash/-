
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface AbsenceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AbsenceRequestForm: React.FC<AbsenceRequestFormProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    reason: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: '',
  });

  const createAbsenceRequest = useMutation({
    mutationFn: async (requestData: any) => {
      if (!profile?.id) throw new Error('يجب تسجيل الدخول أولاً');
      
      const { error } = await supabase
        .from('service_requests')
        .insert({
          student_id: profile.id,
          title: requestData.title,
          description: requestData.description,
          service_type: 'absence_request',
          priority: 'normal',
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'تم إرسال طلب الغياب',
        description: 'سيتم مراجعة طلبك والرد عليه قريباً',
      });
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'خطأ في إرسال الطلب',
        description: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      reason: '',
      startDate: undefined,
      endDate: undefined,
      description: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.reason.trim()) {
      toast({
        title: 'يرجى ملء البيانات المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    const description = `
سبب الغياب: ${formData.reason}

${formData.startDate ? `تاريخ البداية: ${format(formData.startDate, 'PPP', { locale: ar })}` : ''}
${formData.endDate ? `تاريخ النهاية: ${format(formData.endDate, 'PPP', { locale: ar })}` : ''}

${formData.description ? `تفاصيل إضافية: ${formData.description}` : ''}
    `.trim();

    createAbsenceRequest.mutate({
      title: formData.title.trim(),
      description,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4 rounded-2xl">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            طلب غياب
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الطلب *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: طلب غياب لظروف صحية"
              className="rounded-xl border-2 focus:border-primary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">سبب الغياب *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="مثال: ظروف صحية، ظروف عائلية"
              className="rounded-xl border-2 focus:border-primary/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>تاريخ البداية</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right rounded-xl border-2"
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {formData.startDate 
                      ? format(formData.startDate, 'PPP', { locale: ar })
                      : 'اختر التاريخ'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>تاريخ النهاية</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right rounded-xl border-2"
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {formData.endDate 
                      ? format(formData.endDate, 'PPP', { locale: ar })
                      : 'اختر التاريخ'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">تفاصيل إضافية</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="أضف أي تفاصيل إضافية حول طلب الغياب..."
              className="rounded-xl border-2 focus:border-primary/50 min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-2"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createAbsenceRequest.isPending}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl font-semibold"
            >
              {createAbsenceRequest.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الطلب
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AbsenceRequestForm;
