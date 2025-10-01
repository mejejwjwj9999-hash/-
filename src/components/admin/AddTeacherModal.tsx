import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Building2, Briefcase, MapPin, Clock, FileText, Image as ImageIcon, UserPlus } from 'lucide-react';
import EnhancedImageUpload from '@/components/editors/EnhancedImageUpload';
import { Separator } from '@/components/ui/separator';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeacherFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  specialization?: string;
  qualifications?: string;
  hire_date?: string;
  position?: string;
  office_location?: string;
  office_hours?: string;
  bio?: string;
  profile_image_url?: string;
  cv_file_url?: string;
  cv_file_name?: string;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, setValue } = useForm<TeacherFormData>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addTeacher = useMutation({
    mutationFn: async (data: TeacherFormData) => {
      // استدعاء Edge Function لإضافة المعلم بشكل آمن
      const { data: result, error } = await supabase.functions.invoke('create-teacher', {
        body: data
      });

      if (error) throw error;
      if (!result?.success) throw new Error(result?.error || 'حدث خطأ أثناء إضافة المعلم');

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast({
        title: 'نجح',
        description: 'تم إضافة المعلم بنجاح',
      });
      reset();
      onClose();
    },
    onError: (error: any) => {
      console.error('خطأ في الإضافة:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء إضافة المعلم',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TeacherFormData) => {
    addTeacher.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            إضافة معلم جديد
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            قم بإدخال المعلومات الأساسية والبيانات الأكاديمية للمعلم الجديد
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* الصورة الشخصية */}
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">الصورة الشخصية</Label>
            </div>
            <EnhancedImageUpload
              onImageSelect={(url) => setValue('profile_image_url', url)}
            />
            <p className="text-xs text-muted-foreground">
              اختر صورة واضحة للمعلم (يُفضل خلفية بيضاء أو محايدة)
            </p>
          </div>

          <Separator />

          {/* المعلومات الأساسية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: true })}
                  placeholder="teacher@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  سيتم استخدامه لتسجيل الدخول
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+967 77X XXX XXX"
                  dir="ltr"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  الاسم الأول *
                </Label>
                <Input
                  id="first_name"
                  {...register('first_name', { required: true })}
                  placeholder="أحمد"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  اسم العائلة *
                </Label>
                <Input
                  id="last_name"
                  {...register('last_name', { required: true })}
                  placeholder="محمد"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hire_date" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  تاريخ التعيين
                </Label>
                <Input
                  id="hire_date"
                  type="date"
                  {...register('hire_date')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* البيانات الأكاديمية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              البيانات الأكاديمية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department_id" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  القسم *
                </Label>
                <Select onValueChange={(value) => setValue('department_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech_science">قسم العلوم التقنية والحاسوب</SelectItem>
                    <SelectItem value="admin_humanities">قسم العلوم الإدارية والإنسانية</SelectItem>
                    <SelectItem value="medical">قسم العلوم الطبية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  المنصب *
                </Label>
                <Select onValueChange={(value) => setValue('position', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنصب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="معيد">معيد</SelectItem>
                    <SelectItem value="مدرس">مدرس</SelectItem>
                    <SelectItem value="دكتور">دكتور</SelectItem>
                    <SelectItem value="مدرس دكتور">مدرس دكتور</SelectItem>
                    <SelectItem value="رئيس قسم">رئيس قسم</SelectItem>
                    <SelectItem value="عميد">عميد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  التخصص
                </Label>
                <Input
                  id="specialization"
                  {...register('specialization')}
                  placeholder="هندسة البرمجيات"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="office_location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  مكان المكتب
                </Label>
                <Input
                  id="office_location"
                  {...register('office_location')}
                  placeholder="مبنى أ - الطابق الثاني - مكتب 201"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="office_hours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  ساعات المكتب
                </Label>
                <Input
                  id="office_hours"
                  {...register('office_hours')}
                  placeholder="الأحد - الخميس: 8:00 صباحاً - 12:00 ظهراً"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* المؤهلات والسيرة الذاتية */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              المؤهلات والسيرة الذاتية
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qualifications" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  المؤهلات الأكاديمية
                </Label>
                <Textarea
                  id="qualifications"
                  {...register('qualifications')}
                  placeholder="بكالوريوس في هندسة البرمجيات - جامعة صنعاء&#10;ماجستير في علوم الحاسوب - جامعة تعز"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  نبذة شخصية
                </Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="معلومات إضافية عن المعلم والخبرات السابقة..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv_file_url" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  رابط السيرة الذاتية (PDF)
                </Label>
                <Input
                  id="cv_file_url"
                  type="url"
                  {...register('cv_file_url')}
                  placeholder="https://..."
                  onChange={(e) => {
                    const url = e.target.value;
                    const fileName = url.split('/').pop() || 'cv.pdf';
                    setValue('cv_file_name', fileName);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  يُفضل رفع السيرة الذاتية بصيغة PDF
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* أزرار الإجراءات */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} size="lg">
              إلغاء
            </Button>
            <Button type="submit" disabled={addTeacher.isPending} size="lg">
              {addTeacher.isPending ? 'جاري الإضافة...' : 'إضافة المعلم'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherModal;
