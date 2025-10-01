
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Send, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface ServiceModalProps {
  service: {
    id: string;
    title: string;
    description: string;
    icon: any;
    category: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: '',
    priority: 'normal',
    attachmentFile: null as File | null,
  });

  // دالة رفع المرفقات إلى Supabase Storage
  const uploadAttachment = async (file: File): Promise<string | null> => {
    if (!profile?.id || !file) return null;
    
    try {
      setUploadingFile(true);
      
      // إنشاء مسار فريد للملف
      const fileExt = file.name.split('.').pop();
      const timestamp = new Date().getTime();
      const fileName = `${profile.student_id}/${timestamp}.${fileExt}`;
      
      // رفع الملف إلى Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      
      // الحصول على رابط الملف العام
      const { data: { publicUrl } } = supabase.storage
        .from('student-documents')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadAttachment:', error);
      toast({
        title: 'خطأ في رفع الملف',
        description: 'حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // دالة إرسال النموذج
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !profile?.id) {
      toast({
        title: 'بيانات ناقصة',
        description: 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      let attachmentUrl = '';
      
      // رفع المرفق إن وجد
      if (formData.attachmentFile) {
        attachmentUrl = await uploadAttachment(formData.attachmentFile) || '';
      }
      
      // إنشاء كائن الطلب
      const serviceRequest = {
        student_id: profile.id,
        title: formData.title,
        description: formData.description,
        service_type: service.category,
        priority: formData.priority,
        status: 'pending',
        documents: attachmentUrl ? { attachment_url: attachmentUrl } : null,
        created_at: new Date().toISOString(),
      };
      
      // حفظ الطلب في قاعدة البيانات
      const { error } = await supabase
        .from('service_requests')
        .insert([serviceRequest]);
      
      if (error) {
        console.error('Error saving service request:', error);
        throw error;
      }
      
      // إظهار رسالة نجاح
      toast({
        title: 'تم إرسال الطلب بنجاح',
        description: `تم إرسال طلبك لخدمة "${service.title}" بنجاح. سيتم مراجعته والرد عليه قريباً.`,
      });
      
      // إغلاق النافذة المنبثقة
      onClose();
      resetForm();
      
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast({
        title: 'خطأ في إرسال الطلب',
        description: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: service?.title || '',
      description: '',
      priority: 'normal',
      attachmentFile: null,
    });
  };

  const handleClose = () => {
    if (!isSubmitting && !uploadingFile) {
      onClose();
      resetForm();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // التحقق من حجم الملف (50 ميجابايت كحد أقصى)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast({
          title: 'حجم الملف كبير جداً',
          description: 'يجب أن يكون حجم الملف أقل من 50 ميجابايت.',
          variant: 'destructive',
        });
        return;
      }
      
      // التحقق من نوع الملف
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'نوع ملف غير مدعوم',
          description: 'يرجى اختيار ملف من الأنواع المدعومة: PDF, JPG, PNG, DOC, DOCX',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setFormData({ ...formData, attachmentFile: file });
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent flex items-center justify-between">
            <span className="flex items-center gap-3">
              <service.icon className="w-6 h-6 text-primary" />
              طلب خدمة: {service.title}
            </span>
            <Button variant="ghost" size="icon" onClick={handleClose} disabled={isSubmitting || uploadingFile}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-bold text-primary mb-2">{service.title}</h3>
            <p className="text-muted-foreground mb-3">{service.description}</p>
            <div className="text-xs text-muted-foreground">
              التصنيف: {service.category}
            </div>
          </div>

          {/* Request Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الطلب *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-xl border-2 focus:border-primary/50"
                required
                disabled={isSubmitting || uploadingFile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">أولوية الطلب</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                disabled={isSubmitting || uploadingFile}
              >
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">عادي</SelectItem>
                  <SelectItem value="normal">متوسط</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="urgent">عاجل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">تفاصيل الطلب *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="اشرح تفاصيل طلبك بوضوح..."
                className="rounded-xl border-2 focus:border-primary/50 min-h-[120px] resize-none"
                required
                disabled={isSubmitting || uploadingFile}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">إرفاق ملف (اختياري)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  className="rounded-xl border-2"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={isSubmitting || uploadingFile}
                />
                {uploadingFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="animate-spin h-4 w-4" />
                    جاري الرفع...
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                الملفات المدعومة: PDF, JPG, PNG, DOC, DOCX (حتى 50 ميجابايت)
              </div>
              {formData.attachmentFile && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                  ✓ تم اختيار الملف: {formData.attachmentFile.name}
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">ملاحظات مهمة:</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• سيتم الرد على طلبك خلال 24-48 ساعة</li>
                    <li>• تأكد من دقة المعلومات المدخلة</li>
                    <li>• يمكنك متابعة حالة الطلب من قسم "الخدمات الطلابية"</li>
                    <li>• للاستفسارات العاجلة اتصل على: +967779553944</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl border-2"
                disabled={isSubmitting || uploadingFile}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || uploadingFile || !formData.title.trim() || !formData.description.trim()}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
