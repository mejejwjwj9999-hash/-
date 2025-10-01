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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, GraduationCap, X, Save } from 'lucide-react';

interface EditStudentMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

interface StudentFormData {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  academic_year: number;
  semester: number;
  program: string;
  status: string;
}

const EditStudentMobileModal: React.FC<EditStudentMobileModalProps> = ({ isOpen, onClose, student }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<StudentFormData>({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    academic_year: new Date().getFullYear(),
    semester: 1,
    program: '',
    status: 'active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        student_id: student.student_id || '',
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        phone: student.phone || '',
        college: student.college || '',
        department: student.department || '',
        academic_year: student.academic_year || new Date().getFullYear(),
        semester: student.semester || 1,
        program: student.program || '',
        status: student.status || 'active'
      });
    }
  }, [student, isOpen]);

  const updateStudent = useMutation({
    mutationFn: async (data: StudentFormData) => {
      const { error } = await supabase
        .from('student_profiles')
        .update(data)
        .eq('id', student.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: '✅ تم تحديث بيانات الطالب بنجاح',
        description: 'تم حفظ التعديلات بنجاح',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: '❌ خطأ في تحديث البيانات',
        description: error.message || 'حدث خطأ أثناء تحديث بيانات الطالب',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateStudent.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const colleges = [
    'كلية تقنية المعلومات',
    'كلية إدارة الأعمال', 
    'كلية العلوم الطبية',
    'كلية الصيدلة',
    'كلية التمريض والقبالة'
  ];

  const departments = {
    'كلية تقنية المعلومات': ['هندسة البرمجيات', 'تقنية المعلومات', 'أمن المعلومات'],
    'كلية إدارة الأعمال': ['إدارة الأعمال', 'المحاسبة', 'التسويق'],
    'كلية العلوم الطبية': ['الطب البشري', 'طب الأسنان'],
    'كلية الصيدلة': ['الصيدلة السريرية', 'الصيدلة الصناعية'],
    'كلية التمريض والقبالة': ['التمريض', 'القبالة']
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-university-blue/5" dir="rtl">
        <DialogHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute -left-2 -top-2 h-8 w-8 rounded-full hover:bg-university-blue/10"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-xl font-bold text-university-blue flex items-center justify-center gap-2 pr-8">
            <div className="p-2 bg-university-blue/10 rounded-xl">
              <User className="h-5 w-5 text-university-blue" />
            </div>
            تعديل بيانات الطالب
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-4 animate-fade-in">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-university-blue">رقم الطالب *</Label>
                <Input
                  value={formData.student_id}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                  className="text-right border-university-blue/20 focus:border-university-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold text-university-blue">الاسم الأول *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="text-right border-university-blue/20 focus:border-university-blue"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-university-blue">اسم العائلة *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="text-right border-university-blue/20 focus:border-university-blue"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-university-blue">البريد الإلكتروني *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="text-right border-university-blue/20 focus:border-university-blue"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-university-blue">رقم الهاتف</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="text-right border-university-blue/20 focus:border-university-blue"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-university-blue">الكلية *</Label>
                <Select value={formData.college} onValueChange={(value) => handleInputChange('college', value)}>
                  <SelectTrigger className="border-university-blue/20 focus:border-university-blue">
                    <SelectValue placeholder="اختر الكلية" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.college && (
                <div>
                  <Label className="text-sm font-semibold text-university-blue">القسم *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className="border-university-blue/20 focus:border-university-blue">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments[formData.college]?.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-semibold text-university-blue">السنة الدراسية *</Label>
                  <Select value={formData.academic_year.toString()} onValueChange={(value) => handleInputChange('academic_year', parseInt(value))}>
                    <SelectTrigger className="border-university-blue/20 focus:border-university-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-university-blue">الفصل الدراسي *</Label>
                  <Select value={formData.semester.toString()} onValueChange={(value) => handleInputChange('semester', parseInt(value))}>
                    <SelectTrigger className="border-university-blue/20 focus:border-university-blue">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">الفصل الأول</SelectItem>
                      <SelectItem value="2">الفصل الثاني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-university-blue">البرنامج الدراسي *</Label>
                <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                  <SelectTrigger className="border-university-blue/20 focus:border-university-blue">
                    <SelectValue placeholder="اختر البرنامج" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                    <SelectItem value="ماجستير">ماجستير</SelectItem>
                    <SelectItem value="دبلوم عالي">دبلوم عالي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-university-blue">الحالة *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-university-blue/20 focus:border-university-blue">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="suspended">موقوف</SelectItem>
                    <SelectItem value="graduated">متخرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t border-university-blue/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-university-blue/30 text-university-blue hover:bg-university-blue/5"
            >
              إلغاء
            </Button>
            
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-university-blue hover:bg-university-blue-dark text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الحفظ...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التعديلات
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentMobileModal;