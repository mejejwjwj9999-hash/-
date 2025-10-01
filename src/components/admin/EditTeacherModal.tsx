import React, { useEffect } from 'react';
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
import { User, Mail, Phone, Building2, Briefcase, MapPin, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import EnhancedImageUpload from '@/components/editors/EnhancedImageUpload';
import { Separator } from '@/components/ui/separator';

interface Teacher {
  id: string;
  user_id: string;
  teacher_id: string;
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
  is_active: boolean;
}

interface EditTeacherModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
}

interface TeacherFormData {
  teacher_id: string;
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

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ teacher, isOpen, onClose }) => {
  const { register, handleSubmit, reset, setValue } = useForm<TeacherFormData>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (teacher) {
      reset({
        teacher_id: teacher.teacher_id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        phone: teacher.phone || '',
        department_id: teacher.department_id || '',
        specialization: teacher.specialization || '',
        qualifications: teacher.qualifications || '',
        hire_date: teacher.hire_date || '',
        position: teacher.position || '',
        office_location: teacher.office_location || '',
        office_hours: teacher.office_hours || '',
        bio: teacher.bio || '',
        profile_image_url: teacher.profile_image_url || '',
        cv_file_url: teacher.cv_file_url || '',
        cv_file_name: teacher.cv_file_name || '',
      });
    }
  }, [teacher, reset]);

  const updateTeacher = useMutation({
    mutationFn: async (data: TeacherFormData) => {
      const { error } = await supabase
        .from('teacher_profiles')
        .update(data)
        .eq('id', teacher.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast({
        title: 'نجح',
        description: 'تم تحديث بيانات المعلم بنجاح',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء تحديث بيانات المعلم',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TeacherFormData) => {
    updateTeacher.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            تعديل بيانات المعلم
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            قم بتحديث المعلومات الأساسية والبيانات الأكاديمية للمعلم
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
            {teacher.profile_image_url && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span>الصورة الحالية متاحة</span>
              </div>
            )}
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
                <Label htmlFor="teacher_id" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  رقم المعلم *
                </Label>
                <Input
                  id="teacher_id"
                  {...register('teacher_id', { required: true })}
                  placeholder="T001"
                  disabled
                  className="bg-muted/50"
                />
              </div>

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
                <Select 
                  value={teacher.department_id || ''} 
                  onValueChange={(value) => setValue('department_id', value)}
                >
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
                <Select 
                  value={teacher.position || ''} 
                  onValueChange={(value) => setValue('position', value)}
                >
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
            <Button type="submit" disabled={updateTeacher.isPending} size="lg">
              {updateTeacher.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherModal;
