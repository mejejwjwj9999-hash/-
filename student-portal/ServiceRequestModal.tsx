
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: {
    id: string;
    title: string;
    description: string;
    category: string;
    features?: string[]; // السماح بتمرير خصائص إضافية اختيارية لإيقاف أخطاء الخصائص الزائدة
  };
}

const ServiceRequestModal = ({ isOpen, onClose, serviceData }: ServiceRequestModalProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');

  const createRequest = useMutation({
    mutationFn: async (requestData: any) => {
      if (!profile?.id) throw new Error('يجب تسجيل الدخول أولاً');
      
      const { error } = await supabase
        .from('service_requests')
        .insert({
          student_id: profile.id,
          title: requestData.title,
          description: requestData.description,
          service_type: serviceData.id,
          priority: requestData.priority,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'تم إرسال الطلب بنجاح',
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
      console.error('Error creating service request:', error);
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('normal');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'يرجى إدخال عنوان الطلب',
        variant: 'destructive',
      });
      return;
    }

    createRequest.mutate({
      title: title.trim(),
      description: description.trim(),
      priority,
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      setTitle(serviceData.title);
    }
  }, [isOpen, serviceData.title]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4 rounded-2xl">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            طلب خدمة جديدة
          </DialogTitle>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800">{serviceData.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{serviceData.description}</p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
              عنوان الطلب *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب عنوان واضح للطلب"
              className="rounded-xl border-2 focus:border-primary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              تفاصيل إضافية
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب أي تفاصيل إضافية تساعد في معالجة طلبك..."
              className="rounded-xl border-2 focus:border-primary/50 min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">
              مستوى الأولوية
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">منخفض</SelectItem>
                <SelectItem value="normal">عادي</SelectItem>
                <SelectItem value="high">مرتفع</SelectItem>
                <SelectItem value="urgent">عاجل</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={createRequest.isPending || !title.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl font-semibold"
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
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

export default ServiceRequestModal;
