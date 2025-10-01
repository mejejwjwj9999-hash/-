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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, GraduationCap, X, Plus } from 'lucide-react';

interface AddStudentMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

const AddStudentMobileModal: React.FC<AddStudentMobileModalProps> = ({ isOpen, onClose }) => {
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
    program: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStudent = useMutation({
    mutationFn: async (data: StudentFormData) => {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: 'Student123!', // Default password
        email_confirm: true,
        user_metadata: {
          first_name: data.first_name,
          last_name: data.last_name,
          role: 'student'
        }
      });

      if (authError) throw authError;

      // Add student profile
      const { error: profileError } = await supabase
        .from('student_profiles')
        .insert([{
          user_id: authData.user.id,
          ...data,
          status: 'active',
          admission_date: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      // Add user role
      await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: 'student'
        }]);

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: '✅ تم إضافة الطالب بنجاح',
        description: 'تم إنشاء حساب جديد للطالب. كلمة المرور الافتراضية: Student123!',
      });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: '❌ خطأ في إضافة الطالب',
        description: error.message || 'حدث خطأ أثناء إضافة الطالب',
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

  const resetForm = () => {
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      college: '',
      department: '',
      academic_year: new Date().getFullYear(),
      semester: 1,
      program: ''
    });
    setStep(1);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addStudent.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.student_id && formData.first_name && formData.last_name;
      case 2:
        return formData.email && formData.college && formData.department;
      case 3:
        return formData.academic_year && formData.semester && formData.program;
      default:
        return false;
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
              <Plus className="h-5 w-5 text-university-blue" />
            </div>
            إضافة طالب جديد
          </DialogTitle>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    s === step 
                      ? 'bg-university-blue shadow-md' 
                      : s < step 
                        ? 'bg-green-500' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="p-3 bg-university-blue/10 rounded-2xl w-fit mx-auto mb-2">
                  <User className="h-8 w-8 text-university-blue" />
                </div>
                <h3 className="text-lg font-semibold text-university-blue">المعلومات الشخصية</h3>
                <p className="text-sm text-academic-gray">أدخل البيانات الأساسية للطالب</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-university-blue">رقم الطالب *</Label>
                  <Input
                    placeholder="مثال: ST001"
                    value={formData.student_id}
                    onChange={(e) => handleInputChange('student_id', e.target.value)}
                    className="text-right border-university-blue/20 focus:border-university-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-semibold text-university-blue">الاسم الأول *</Label>
                    <Input
                      placeholder="أحمد"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="text-right border-university-blue/20 focus:border-university-blue"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-university-blue">اسم العائلة *</Label>
                    <Input
                      placeholder="محمد"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="text-right border-university-blue/20 focus:border-university-blue"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="p-3 bg-university-blue/10 rounded-2xl w-fit mx-auto mb-2">
                  <Mail className="h-8 w-8 text-university-blue" />
                </div>
                <h3 className="text-lg font-semibold text-university-blue">معلومات الاتصال والكلية</h3>
                <p className="text-sm text-academic-gray">أدخل البريد الإلكتروني والكلية</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-university-blue">البريد الإلكتروني *</Label>
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-right border-university-blue/20 focus:border-university-blue"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-university-blue">رقم الهاتف</Label>
                  <Input
                    placeholder="+967 77X XXX XXX"
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
              </div>
            </div>
          )}

          {/* Step 3: Academic Information */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="p-3 bg-university-blue/10 rounded-2xl w-fit mx-auto mb-2">
                  <GraduationCap className="h-8 w-8 text-university-blue" />
                </div>
                <h3 className="text-lg font-semibold text-university-blue">المعلومات الأكاديمية</h3>
                <p className="text-sm text-academic-gray">حدد السنة والفصل والبرنامج الدراسي</p>
              </div>

              <div className="space-y-4">
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
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t border-university-blue/10">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 border-university-blue/30 text-university-blue hover:bg-university-blue/5"
              >
                السابق
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className={`flex-1 bg-university-blue hover:bg-university-blue-dark text-white ${
                  step === 1 ? 'w-full' : ''
                }`}
              >
                التالي
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الإضافة...
                  </div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة الطالب
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentMobileModal;