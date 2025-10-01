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
        title: 'تم تحديث المعلم',
        description: 'تم تحديث بيانات المعلم بنجاح',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في التحديث',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المعلم</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Select 
                value={teacher.department_id || ''} 
                onValueChange={(value) => setValue('department_id', value)}
              >
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
              <Select 
                value={teacher.position || ''} 
                onValueChange={(value) => setValue('position', value)}
              >
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

          <div className="space-y-2">
            <Label htmlFor="profile_image_url">رابط الصورة الشخصية</Label>
            <Input id="profile_image_url" type="url" {...register('profile_image_url')} placeholder="https://..." />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={updateTeacher.isPending}>
              {updateTeacher.isPending ? 'جاري التحديث...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherModal;