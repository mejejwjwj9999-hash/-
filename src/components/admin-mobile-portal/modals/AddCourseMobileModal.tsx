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
import { BookOpen, Clock, Users, X, Plus } from 'lucide-react';

interface AddCourseMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CourseFormData {
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  description?: string;
  credit_hours: number;
  college: string;
  department: string;
  academic_year: number;
  semester: number;
  prerequisites?: string[];
}

const AddCourseMobileModal: React.FC<AddCourseMobileModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CourseFormData>({
    course_code: '',
    course_name_ar: '',
    course_name_en: '',
    description: '',
    credit_hours: 3,
    college: '',
    department: '',
    academic_year: new Date().getFullYear(),
    semester: 1,
    prerequisites: []
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCourse = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const { error } = await supabase
        .from('courses')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({
        title: '✅ تم إضافة المقرر بنجاح',
        description: 'تم إنشاء المقرر الدراسي الجديد وإضافته للنظام',
      });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: '❌ خطأ في إضافة المقرر',
        description: error.message || 'حدث خطأ أثناء إضافة المقرر',
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
      course_code: '',
      course_name_ar: '',
      course_name_en: '',
      description: '',
      credit_hours: 3,
      college: '',
      department: '',
      academic_year: new Date().getFullYear(),
      semester: 1,
      prerequisites: []
    });
    setStep(1);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addCourse.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.course_code && formData.course_name_ar;
      case 2:
        return formData.college && formData.department;
      case 3:
        return true; // Optional fields
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
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-green-50/30" dir="rtl">
        <DialogHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute -left-2 -top-2 h-8 w-8 rounded-full hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center text-xl font-bold text-green-700 flex items-center justify-center gap-2 pr-8">
            <div className="p-2 bg-green-100 rounded-xl">
              <Plus className="h-5 w-5 text-green-700" />
            </div>
            إضافة مقرر جديد
          </DialogTitle>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    s === step 
                      ? 'bg-green-600 shadow-md' 
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
                <div className="p-3 bg-green-100 rounded-2xl w-fit mx-auto mb-2">
                  <BookOpen className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-green-700">معلومات المقرر الأساسية</h3>
                <p className="text-sm text-academic-gray">أدخل كود المقرر واسمه</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-green-700">كود المقرر *</Label>
                  <Input
                    placeholder="مثال: CS101"
                    value={formData.course_code}
                    onChange={(e) => handleInputChange('course_code', e.target.value)}
                    className="text-right border-green-200 focus:border-green-600"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700">اسم المقرر بالعربية *</Label>
                  <Input
                    placeholder="مقدمة في البرمجة"
                    value={formData.course_name_ar}
                    onChange={(e) => handleInputChange('course_name_ar', e.target.value)}
                    className="text-right border-green-200 focus:border-green-600"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700">اسم المقرر بالإنجليزية</Label>
                  <Input
                    placeholder="Introduction to Programming"
                    value={formData.course_name_en}
                    onChange={(e) => handleInputChange('course_name_en', e.target.value)}
                    className="text-right border-green-200 focus:border-green-600"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    الساعات المعتمدة
                  </Label>
                  <Select 
                    value={formData.credit_hours.toString()} 
                    onValueChange={(value) => handleInputChange('credit_hours', parseInt(value))}
                  >
                    <SelectTrigger className="border-green-200 focus:border-green-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 ساعة</SelectItem>
                      <SelectItem value="2">2 ساعة</SelectItem>
                      <SelectItem value="3">3 ساعات</SelectItem>
                      <SelectItem value="4">4 ساعات</SelectItem>
                      <SelectItem value="5">5 ساعات</SelectItem>
                      <SelectItem value="6">6 ساعات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: College & Department */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="p-3 bg-green-100 rounded-2xl w-fit mx-auto mb-2">
                  <Users className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-green-700">الكلية والقسم</h3>
                <p className="text-sm text-academic-gray">حدد الكلية والقسم والسنة الدراسية</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-green-700">الكلية *</Label>
                  <Select value={formData.college} onValueChange={(value) => handleInputChange('college', value)}>
                    <SelectTrigger className="border-green-200 focus:border-green-600">
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
                    <Label className="text-sm font-semibold text-green-700">القسم *</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger className="border-green-200 focus:border-green-600">
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
                    <Label className="text-sm font-semibold text-green-700">السنة الدراسية</Label>
                    <Select value={formData.academic_year.toString()} onValueChange={(value) => handleInputChange('academic_year', parseInt(value))}>
                      <SelectTrigger className="border-green-200 focus:border-green-600">
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
                    <Label className="text-sm font-semibold text-green-700">الفصل الدراسي</Label>
                    <Select value={formData.semester.toString()} onValueChange={(value) => handleInputChange('semester', parseInt(value))}>
                      <SelectTrigger className="border-green-200 focus:border-green-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">الفصل الأول</SelectItem>
                        <SelectItem value="2">الفصل الثاني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="text-center mb-4">
                <div className="p-3 bg-green-100 rounded-2xl w-fit mx-auto mb-2">
                  <BookOpen className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-green-700">تفاصيل إضافية</h3>
                <p className="text-sm text-academic-gray">الوصف والمتطلبات (اختياري)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-green-700">وصف المقرر</Label>
                  <Textarea
                    placeholder="وصف مختصر لمحتوى المقرر وأهدافه..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="text-right border-green-200 focus:border-green-600 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700">المتطلبات السابقة</Label>
                  <Input
                    placeholder="مثال: CS100, MATH101"
                    value={formData.prerequisites}
                    onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                    className="text-right border-green-200 focus:border-green-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t border-green-200">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              >
                السابق
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className={`flex-1 bg-green-600 hover:bg-green-700 text-white ${
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
                    إضافة المقرر
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

export default AddCourseMobileModal;