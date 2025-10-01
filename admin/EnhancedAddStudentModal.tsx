import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDateForInput, sanitizeDateForDatabase } from '@/utils/dateUtils';
import { useDepartments } from '@/hooks/useDepartments';
import { useProgramsByDepartment } from '@/hooks/usePrograms';
import { DepartmentId, ProgramId, getDepartmentName, getProgramName } from '@/domain/academics';

interface EnhancedAddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EnhancedAddStudentModal: React.FC<EnhancedAddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: departments } = useDepartments();
  
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '' as DepartmentId | '',
    program_id: '' as ProgramId | '',
    academic_year: 1,
    semester: 1,
    admission_date: new Date().toISOString().split('T')[0],
    status: 'active',
    date_of_birth: '',
    residence_address: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_relationship: '',
    nationality: 'يمني',
    national_id: '',
    emergency_contact: '',
    emergency_phone: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { data: availablePrograms } = useProgramsByDepartment(
    formData.department_id as DepartmentId || null
  );

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.student_id.trim()) {
      errors.student_id = 'رقم الطالب مطلوب';
    } else if (!/^[A-Za-z0-9]+$/.test(formData.student_id)) {
      errors.student_id = 'رقم الطالب يجب أن يحتوي على أرقام وحروف إنجليزية فقط';
    }

    if (!formData.first_name.trim()) {
      errors.first_name = 'الاسم الأول مطلوب';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'الاسم الأخير مطلوب';
    }

    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!formData.department_id) {
      errors.department_id = 'القسم مطلوب';
    }

    if (!formData.program_id) {
      errors.program_id = 'التخصص مطلوب';
    }

    if (!formData.admission_date) {
      errors.admission_date = 'تاريخ القبول مطلوب';
    }

    if (!formData.date_of_birth) {
      errors.date_of_birth = 'تاريخ الميلاد مطلوب';
    }

    if (!formData.residence_address.trim()) {
      errors.residence_address = 'عنوان السكن مطلوب';
    }

    if (!formData.guardian_name.trim()) {
      errors.guardian_name = 'اسم ولي الأمر مطلوب';
    }

    if (!formData.guardian_phone.trim()) {
      errors.guardian_phone = 'رقم هاتف ولي الأمر مطلوب';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addStudent = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Adding new enhanced student:', data);
      
      const sanitizedData = {
        student_id: data.student_id.trim(),
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim() || null,
        college: getDepartmentName(data.department_id as DepartmentId, 'ar'),
        department: getProgramName(data.program_id as ProgramId, 'ar'),
        academic_year: data.academic_year,
        semester: data.semester,
        admission_date: sanitizeDateForDatabase(data.admission_date),
        status: data.status,
      };

      const { error } = await supabase
        .from('student_profiles')
        .insert([sanitizedData]);

      if (error) {
        console.error('Error adding student:', error);
        if (error.code === '23505') {
          if (error.message.includes('student_id')) {
            throw new Error('رقم الطالب موجود مسبقاً');
          } else if (error.message.includes('email')) {
            throw new Error('البريد الإلكتروني مستخدم مسبقاً');
          }
        }
        throw new Error(error.message || 'فشل في إضافة الطالب');
      }
      
      console.log('Enhanced student added successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students-radical'] });
      toast({
        title: 'تمت الإضافة بنجاح ✅',
        description: 'تم إضافة الطالب بنجاح مع جميع البيانات المطلوبة.',
      });
      onSuccess();
      resetForm();
    },
    onError: (error: Error) => {
      console.error('Error adding student:', error);
      toast({
        title: 'خطأ في الإضافة ❌',
        description: error.message || 'فشل في إضافة الطالب.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      student_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
      department_id: '' as DepartmentId | '',
      program_id: '' as ProgramId | '',
      academic_year: 1,
      semester: 1,
      admission_date: new Date().toISOString().split('T')[0],
      status: 'active',
      date_of_birth: '',
      residence_address: '',
      guardian_name: '',
      guardian_phone: '',
      guardian_relationship: '',
      nationality: 'يمني',
      national_id: '',
      emergency_contact: '',
      emergency_phone: '',
    });
    setValidationErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'خطأ في البيانات ❌',
        description: 'يرجى تصحيح الأخطاء المحددة في النموذج.',
        variant: 'destructive',
      });
      return;
    }

    addStudent.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Clear program selection when department changes
      if (field === 'department_id') {
        newData.program_id = '' as ProgramId | '';
      }
      
      return newData;
    });
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            إضافة طالب جديد - النموذج المحسن
          </DialogTitle>
        </DialogHeader>
        
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">يرجى تصحيح الأخطاء التالية:</span>
            </div>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات أساسية */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-4">المعلومات الأساسية</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_id">رقم الطالب *</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                  placeholder="مثال: STD202400001"
                  className={validationErrors.student_id ? 'border-red-500' : ''}
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
          </div>

          {/* الاسم والمعلومات الشخصية */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-4">المعلومات الشخصية</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="first_name">الاسم الأول *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={validationErrors.first_name ? 'border-red-500' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="middle_name">الاسم الأوسط</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => handleInputChange('middle_name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">الاسم الأخير *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={validationErrors.last_name ? 'border-red-500' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="date_of_birth">تاريخ الميلاد *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className={validationErrors.date_of_birth ? 'border-red-500' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="nationality">الجنسية</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="national_id">رقم الهوية الوطنية</Label>
                <Input
                  id="national_id"
                  value={formData.national_id}
                  onChange={(e) => handleInputChange('national_id', e.target.value)}
                  placeholder="مثال: 01234567890"
                />
              </div>
              
              <div>
                <Label htmlFor="residence_address">عنوان السكن *</Label>
                <Input
                  id="residence_address"
                  value={formData.residence_address}
                  onChange={(e) => handleInputChange('residence_address', e.target.value)}
                  className={validationErrors.residence_address ? 'border-red-500' : ''}
                />
              </div>
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-4">معلومات التواصل</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={validationErrors.email ? 'border-red-500' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="مثال: 777123456"
                  className={validationErrors.phone ? 'border-red-500' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact">اسم جهة الاتصال الطارئ</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="emergency_phone">رقم الطوارئ</Label>
                <Input
                  id="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
                  placeholder="مثال: 777123456"
                />
              </div>
            </div>
          </div>

          {/* معلومات ولي الأمر */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-4">معلومات ولي الأمر</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="guardian_name">اسم ولي الأمر *</Label>
                <Input
                  id="guardian_name"
                  value={formData.guardian_name}
                  onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                  className={validationErrors.guardian_name ? 'border-red-500' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="guardian_phone">رقم هاتف ولي الأمر *</Label>
                <Input
                  id="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={(e) => handleInputChange('guardian_phone', e.target.value)}
                  placeholder="مثال: 777123456"
                  className={validationErrors.guardian_phone ? 'border-red-500' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="guardian_relationship">صلة القرابة</Label>
                <Select value={formData.guardian_relationship} onValueChange={(value) => handleInputChange('guardian_relationship', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر صلة القرابة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">الأب</SelectItem>
                    <SelectItem value="mother">الأم</SelectItem>
                    <SelectItem value="brother">الأخ</SelectItem>
                    <SelectItem value="sister">الأخت</SelectItem>
                    <SelectItem value="uncle">العم</SelectItem>
                    <SelectItem value="aunt">العمة</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* معلومات أكاديمية */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-800 mb-4">المعلومات الأكاديمية</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="department_id">القسم *</Label>
                <Select 
                  value={formData.department_id || ''} 
                  onValueChange={(value) => handleInputChange('department_id', value as DepartmentId)}
                >
                  <SelectTrigger className={validationErrors.department_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name.ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="program_id">التخصص *</Label>
                <Select 
                  value={formData.program_id || ''} 
                  onValueChange={(value) => handleInputChange('program_id', value as ProgramId)}
                  disabled={!formData.department_id}
                >
                  <SelectTrigger className={validationErrors.program_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrograms?.map((programId) => (
                      <SelectItem key={programId} value={programId}>
                        {getProgramName(programId, 'ar')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!formData.department_id && (
                  <p className="text-xs text-gray-500 mt-1">يرجى اختيار القسم أولاً</p>
                )}
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
                    <SelectItem value="6">السنة السادسة</SelectItem>
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
                    <SelectItem value="3">الفصل الصيفي</SelectItem>
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
                  className={validationErrors.admission_date ? 'border-red-500' : ''}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={addStudent.isPending}>
              {addStudent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                'إضافة الطالب'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddStudentModal;