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
import EnhancedImageUpload from '@/components/editors/EnhancedImageUpload';
import { useAdminTeachers } from '@/hooks/useAdminTeachers';

interface AddTeacherModalProps {
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
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, setValue } = useForm<TeacherFormData>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: teachers } = useAdminTeachers();

  const addTeacher = useMutation({
    mutationFn: async (data: TeacherFormData) => {
      // أولاً نحاول إنشاء مستخدم جديد
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: 'Teacher123!', // كلمة مرور افتراضية
        email_confirm: true,
        user_metadata: {
          first_name: data.first_name,
          last_name: data.last_name,
          role: 'teacher'
        }
      });

      if (authError) throw authError;

      // ثم نضيف ملف المعلم
      const { error: profileError } = await supabase
        .from('teacher_profiles')
        .insert([{
          user_id: authData.user.id,
          ...data,
          is_active: true
        }]);

      if (profileError) throw profileError;

      // إضافة دور المعلم
      await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: 'staff'
        }]);

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast({
        title: 'تم إضافة المعلم',
        description: 'تم إضافة المعلم بنجاح. كلمة المرور الافتراضية: Teacher123!',
      });
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في الإضافة',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة معلم جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* اختيار معلم موجود للتعبئة التلقائية */}
          <div className="space-y-2">
            <Label>اختيار معلم موجود (للتعبئة التلقائية)</Label>
            <Select
              onValueChange={(value) => {
                const teacher = (teachers || []).find(t => t.id === value);
                if (teacher) {
                  setValue('first_name', teacher.first_name || '');
                  setValue('last_name', teacher.last_name || '');
                  setValue('email', teacher.email || '');
                  setValue('position', teacher.position || '');
                  setValue('specialization', teacher.specialization || '');
                  setValue('profile_image_url', teacher.profile_image_url || '');
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر معلمًا لتعبئة الحقول تلقائيًا" />
              </SelectTrigger>
              <SelectContent>
                {(teachers || []).map(t => (
                  <SelectItem key={t.id} value={t.id}>{`${t.first_name} ${t.last_name}`.trim()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الصورة الشخصية */}
          <div className="space-y-2">
            <Label>الصورة الشخصية</Label>
            <EnhancedImageUpload onImageSelect={(url) => setValue('profile_image_url', url)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacher_id">رقم المعلم *</Label>
              <Input
                id="teacher_id"
                {...register('teacher_id', { required: true })}
                placeholder="T001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: true })}
                placeholder="teacher@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">الاسم الأول *</Label>
              <Input
                id="first_name"
                {...register('first_name', { required: true })}
                placeholder="أحمد"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">اسم العائلة *</Label>
              <Input
                id="last_name"
                {...register('last_name', { required: true })}
                placeholder="محمد"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+967 77X XXX XXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hire_date">تاريخ التعيين</Label>
              <Input id="hire_date" type="date" {...register('hire_date')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_id">القسم</Label>
              <Select onValueChange={(value) => setValue('department_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech_science">التقنية والعلوم</SelectItem>
                  <SelectItem value="admin_humanities">الإدارة والإنسانيات</SelectItem>
                  <SelectItem value="medical">الطبي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">التخصص</Label>
              <Input
                id="specialization"
                {...register('specialization')}
                placeholder="هندسة البرمجيات"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">المنصب</Label>
              <Select onValueChange={(value) => setValue('position', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنصب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="معلم">معلم</SelectItem>
                  <SelectItem value="معلم أول">معلم أول</SelectItem>
                  <SelectItem value="رئيس قسم">رئيس قسم</SelectItem>
                  <SelectItem value="عميد">عميد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="office_location">مكان المكتب</Label>
              <Input
                id="office_location"
                {...register('office_location')}
                placeholder="مبنى أ - الطابق الثاني - مكتب 201"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="office_hours">ساعات المكتب</Label>
              <Input
                id="office_hours"
                {...register('office_hours')}
                placeholder="الأحد - الخميس: 8:00 - 12:00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifications">المؤهلات</Label>
            <Textarea
              id="qualifications"
              {...register('qualifications')}
              placeholder="بكالوريوس في هندسة البرمجيات - جامعة صنعاء"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">نبذة شخصية</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="معلومات إضافية عن المعلم..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={addTeacher.isPending}>
              {addTeacher.isPending ? 'جاري الإضافة...' : 'إضافة المعلم'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherModal;