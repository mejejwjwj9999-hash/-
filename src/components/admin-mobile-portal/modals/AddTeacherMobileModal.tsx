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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Mail, Phone, X, Plus, Briefcase } from 'lucide-react';

interface AddTeacherMobileModalProps {
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
  position?: string;
  office_location?: string;
  office_hours?: string;
  bio?: string;
}

const AddTeacherMobileModal: React.FC<AddTeacherMobileModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TeacherFormData>({
    teacher_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    specialization: '',
    qualifications: '',
    position: '',
    office_location: '',
    office_hours: '',
    bio: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTeacher = useMutation({
    mutationFn: async (data: TeacherFormData) => {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: 'Teacher123!', // Default password
        email_confirm: true,
        user_metadata: {
          first_name: data.first_name,
          last_name: data.last_name,
          role: 'teacher'
        }
      });

      if (authError) throw authError;

      // Add teacher profile
      const { error: profileError } = await supabase
        .from('teacher_profiles')
        .insert([{
          user_id: authData.user.id,
          ...data,
          is_active: true
        }]);

      if (profileError) throw profileError;

      // Add user role
      await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: 'staff'
        }]);

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers-mobile'] });
      toast({
        title: '✅ تم إضافة المعلم بنجاح',
        description: 'تم إنشاء حساب جديد للمعلم. كلمة المرور الافتراضية: Teacher123!',
      });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: '❌ خطأ في إضافة المعلم',
        description: error.message || 'حدث خطأ أثناء إضافة المعلم',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      teacher_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department_id: '',
      specialization: '',
      qualifications: '',
      position: '',
      office_location: '',
      office_hours: '',
      bio: ''
    });
    setStep(1);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addTeacher.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.teacher_id && formData.first_name && formData.last_name;
      case 2:
        return formData.email;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-emerald-50/30" dir="rtl">
        <DialogHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute -left-2 -top-2 h-8 w-8 rounded-full hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-xl font-bold text-emerald-700 flex items-center justify-center gap-2 pr-8">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Plus className="h-5 w-5 text-emerald-700" />
            </div>
            إضافة معلم جديد
          </DialogTitle>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    s === step 
                      ? 'bg-emerald-600 shadow-md' 
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
                <div className="p-3 bg-emerald-100 rounded-2xl w-fit mx-auto mb-2">
                  <GraduationCap className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-700">المعلومات الشخصية</h3>
                <p className="text-sm text-academic-gray">أدخل البيانات الأساسية للمعلم</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-emerald-700">رقم المعلم *</Label>
                  <Input
                    placeholder="مثال: T001"
                    value={formData.teacher_id}
                    onChange={(e) => handleInputChange('teacher_id', e.target.value)}
                    className="text-right border-emerald-200 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-semibold text-emerald-700">الاسم الأول *</Label>
                    <Input
                      placeholder="أحمد"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="text-right border-emerald-200 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-emerald-700">اسم العائلة *</Label>
                    <Input
                      placeholder="محمد"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="text-right border-emerald-200 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Department */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-2xl w-fit mx-auto mb-2">
                  <Mail className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-700">معلومات الاتصال والقسم</h3>
                <p className="text-sm text-academic-gray">أدخل البريد الإلكتروني والقسم</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-emerald-700">البريد الإلكتروني *</Label>
                  <Input
                    type="email"
                    placeholder="teacher@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-right border-emerald-200 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-emerald-700">رقم الهاتف</Label>
                  <Input
                    placeholder="+967 77X XXX XXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="text-right border-emerald-200 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-emerald-700">القسم</Label>
                  <Select value={formData.department_id} onValueChange={(value) => handleInputChange('department_id', value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-600">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech_science">التقنية والعلوم</SelectItem>
                      <SelectItem value="admin_humanities">الإدارة والإنسانيات</SelectItem>
                      <SelectItem value="medical">الطبي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-emerald-700">التخصص</Label>
                  <Input
                    placeholder="هندسة البرمجيات"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="text-right border-emerald-200 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Professional Details */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-2xl w-fit mx-auto mb-2">
                  <Briefcase className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-700">التفاصيل المهنية</h3>
                <p className="text-sm text-academic-gray">أدخل المؤهلات والمنصب (اختياري)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-emerald-700">المنصب</Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-600">
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

                <div>
                  <Label className="text-sm font-semibold text-emerald-700">المؤهلات</Label>
                  <Textarea
                    placeholder="بكالوريوس في هندسة البرمجيات - جامعة صنعاء"
                    value={formData.qualifications}
                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                    className="text-right border-emerald-200 focus:border-emerald-600 resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-semibold text-emerald-700">مكان المكتب</Label>
                    <Input
                      placeholder="مبنى أ - الطابق الثاني"
                      value={formData.office_location}
                      onChange={(e) => handleInputChange('office_location', e.target.value)}
                      className="text-right border-emerald-200 focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-emerald-700">ساعات المكتب</Label>
                    <Input
                      placeholder="8:00 - 12:00"
                      value={formData.office_hours}
                      onChange={(e) => handleInputChange('office_hours', e.target.value)}
                      className="text-right border-emerald-200 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t border-emerald-200">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                السابق
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className={`flex-1 bg-emerald-600 hover:bg-emerald-700 text-white ${
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
                    إضافة المعلم
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

export default AddTeacherMobileModal;