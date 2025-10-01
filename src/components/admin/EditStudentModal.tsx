
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  academic_year: number;
  semester: number;
  admission_date: string;
  status: string;
}

interface EditStudentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    academic_year: 1,
    semester: 1,
    admission_date: '',
    status: 'active',
    specialization: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        phone: student.phone || '',
        college: student.college,
        department: student.department,
        academic_year: student.academic_year,
        semester: student.semester,
        admission_date: student.admission_date,
        status: student.status,
        specialization: (student as any).specialization || '',
      });
    }
  }, [student]);

  const updateStudent = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Updating student:', student.id, data);
      
      const { error } = await supabase
        .from('student_profiles')
        .update({
          student_id: data.student_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || null,
          college: data.college,
          department: data.department,
          academic_year: data.academic_year,
          semester: data.semester,
          admission_date: data.admission_date,
          status: data.status,
          specialization: data.specialization || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', student.id);

      if (error) {
        console.error('Error updating student:', error);
        throw error;
      }
      
      console.log('Student updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث بيانات الطالب بنجاح.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error updating student:', error);
      toast({
        title: 'خطأ في التحديث',
        description: error.message || 'فشل في تحديث بيانات الطالب.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.first_name || !formData.last_name || 
        !formData.email || !formData.college || !formData.department) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }

    updateStudent.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الطالب</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_id">رقم الطالب *</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => handleInputChange('student_id', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">الحالة</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="suspended">معلق</SelectItem>
                  <SelectItem value="graduated">متخرج</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">الاسم الأول *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="last_name">الاسم الأخير *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="مثال: 777123456"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="college">الكلية *</Label>
              <Select value={formData.college} onValueChange={(value) => handleInputChange('college', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الكلية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="كلية الطب">كلية الطب</SelectItem>
                  <SelectItem value="كلية الهندسة">كلية الهندسة</SelectItem>
                  <SelectItem value="كلية الحاسوب">كلية الحاسوب</SelectItem>
                  <SelectItem value="كلية إدارة الأعمال">كلية إدارة الأعمال</SelectItem>
                  <SelectItem value="كلية القانون">كلية القانون</SelectItem>
                  <SelectItem value="كلية التربية">كلية التربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="department">القسم *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="academic_year">السنة الدراسية *</Label>
              <Select 
                value={formData.academic_year.toString()} 
                onValueChange={(value) => handleInputChange('academic_year', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">السنة الأولى</SelectItem>
                  <SelectItem value="2">السنة الثانية</SelectItem>
                  <SelectItem value="3">السنة الثالثة</SelectItem>
                  <SelectItem value="4">السنة الرابعة</SelectItem>
                  <SelectItem value="5">السنة الخامسة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="semester">الفصل الدراسي *</Label>
              <Select 
                value={formData.semester.toString()} 
                onValueChange={(value) => handleInputChange('semester', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">الفصل الأول</SelectItem>
                  <SelectItem value="2">الفصل الثاني</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="admission_date">تاريخ القبول *</Label>
              <Input
                id="admission_date"
                type="date"
                value={formData.admission_date}
                onChange={(e) => handleInputChange('admission_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={updateStudent.isPending}>
              {updateStudent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                'تحديث البيانات'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentModal;
