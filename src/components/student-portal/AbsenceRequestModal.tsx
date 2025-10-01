
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface AbsenceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AbsenceRequestModal: React.FC<AbsenceRequestModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    reason: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    description: '',
    attachments: null as FileList | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get student profile
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!studentProfile) {
        toast({
          title: 'خطأ',
          description: 'لم يتم العثور على ملف الطالب',
          variant: 'destructive',
        });
        return;
      }

      const requestData = {
        student_id: studentProfile.id,
        title: formData.title,
        description: `${formData.reason}\n\nالتفاصيل: ${formData.description}\n\nتاريخ البداية: ${formData.startDate ? format(formData.startDate, 'yyyy-MM-dd', { locale: ar }) : 'غير محدد'}\nتاريخ النهاية: ${formData.endDate ? format(formData.endDate, 'yyyy-MM-dd', { locale: ar }) : 'غير محدد'}`,
        service_type: 'absence_request',
        status: 'pending',
        priority: 'normal',
      };

      const { error } = await supabase
        .from('service_requests')
        .insert(requestData);

      if (error) throw error;

      toast({
        title: 'تم الإرسال بنجاح',
        description: 'تم تقديم طلب الغياب بنجاح وسيتم مراجعته قريباً',
      });

      setFormData({
        title: '',
        reason: '',
        startDate: undefined,
        endDate: undefined,
        description: '',
        attachments: null,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting absence request:', error);
      toast({
        title: 'خطأ في الإرسال',
        description: 'حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">طلب غياب</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الطلب *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: طلب غياب لظروف صحية"
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
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>تاريخ بداية الغياب</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right"
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
              <Label>تاريخ نهاية الغياب</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right"
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
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">المرفقات (اختياري)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachments"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments')?.click()}
                className="w-full"
              >
                <Upload className="ml-2 h-4 w-4" />
                اختر الملفات
              </Button>
            </div>
            {formData.attachments && (
              <div className="text-sm text-muted-foreground">
                تم اختيار {formData.attachments.length} ملف
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.reason}
              className="flex-1"
            >
              {loading ? 'جاري الإرسال...' : 'تقديم الطلب'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AbsenceRequestModal;
