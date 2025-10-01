import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Search, Save, X, BookOpen, GraduationCap, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getDepartmentName, getProgramName, DepartmentId, ProgramId } from '@/domain/academics';

interface CourseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  editingCourse: any | null;
  departments: Array<{ id: string; name: { ar: string } }> | undefined;
  availablePrograms: ProgramId[] | undefined;
  teachers: any[] | undefined;
  selectedDepartment: DepartmentId | '';
  setSelectedDepartment: (value: DepartmentId | '') => void;
}

export const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCourse,
  departments,
  availablePrograms,
  teachers,
  selectedDepartment,
  setSelectedDepartment
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [formData, setFormData] = useState<any>({
    course_code: '',
    course_name_ar: '',
    course_name_en: '',
    credit_hours: '',
    description: '',
    academic_year: '1',
    semester: '1',
    department_id: '',
    program_id: ''
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        course_code: editingCourse.course_code || '',
        course_name_ar: editingCourse.course_name_ar || '',
        course_name_en: editingCourse.course_name_en || '',
        credit_hours: editingCourse.credit_hours?.toString() || '',
        description: editingCourse.description || '',
        academic_year: editingCourse.academic_year?.toString() || '1',
        semester: editingCourse.semester?.toString() || '1',
        department_id: editingCourse.department_id || '',
        program_id: editingCourse.program_id || ''
      });
      setSelectedTeacher(editingCourse.instructor_name || '');
      if (editingCourse.department_id) {
        setSelectedDepartment(editingCourse.department_id);
      }
    } else {
      setFormData({
        course_code: '',
        course_name_ar: '',
        course_name_en: '',
        credit_hours: '',
        description: '',
        academic_year: '1',
        semester: '1',
        department_id: '',
        program_id: ''
      });
      setSelectedTeacher('');
      setSelectedDepartment('');
    }
    setActiveTab('basic');
  }, [editingCourse, isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // التحقق من البيانات الأساسية
    if (!formData.course_code?.trim()) {
      alert('يرجى إدخال رمز المقرر');
      setActiveTab('basic');
      return;
    }
    
    if (!formData.course_name_ar?.trim()) {
      alert('يرجى إدخال اسم المقرر بالعربي');
      setActiveTab('basic');
      return;
    }
    
    if (!formData.credit_hours || isNaN(parseInt(formData.credit_hours))) {
      alert('يرجى إدخال عدد الساعات المعتمدة');
      setActiveTab('basic');
      return;
    }
    
    // التحقق من البيانات الأكاديمية
    const departmentId = formData.department_id as DepartmentId;
    const programId = formData.program_id as ProgramId;
    
    if (!departmentId) {
      alert('يرجى تحديد القسم');
      setActiveTab('academic');
      return;
    }
    
    if (!programId) {
      alert('يرجى تحديد التخصص');
      setActiveTab('academic');
      return;
    }
    
    console.log('Creating course with data:', {
      departmentId,
      programId,
      formData
    });
    
    const courseData = {
      course_code: formData.course_code.trim(),
      course_name_ar: formData.course_name_ar.trim(),
      course_name_en: formData.course_name_en?.trim() || null,
      description: formData.description?.trim() || null,
      credit_hours: parseInt(formData.credit_hours),
      instructor_name: selectedTeacher || null,
      college: getDepartmentName(departmentId, 'ar'),
      department: getProgramName(programId, 'ar'),
      department_id: departmentId,
      program_id: programId,
      academic_year: parseInt(formData.academic_year || '1'),
      semester: parseInt(formData.semester || '1'),
    };

    console.log('Submitting course data:', courseData);
    onSubmit(courseData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    setActiveTab('basic');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" dir="rtl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl flex items-center gap-3 justify-start text-right">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            {editingCourse ? 'تعديل المقرر الدراسي' : 'إضافة مقرر جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col" dir="rtl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden" dir="rtl">
            <TabsList className="grid w-full grid-cols-3 mb-4" dir="rtl">
              <TabsTrigger value="basic" className="gap-2 flex items-center justify-center" dir="rtl">
                <BookOpen className="h-4 w-4" />
                المعلومات الأساسية
              </TabsTrigger>
              <TabsTrigger value="academic" className="gap-2 flex items-center justify-center" dir="rtl">
                <GraduationCap className="h-4 w-4" />
                المعلومات الأكاديمية
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2 flex items-center justify-center" dir="rtl">
                <Info className="h-4 w-4" />
                التفاصيل الإضافية
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto pl-2" dir="rtl">
              {/* Tab 1: المعلومات الأساسية */}
              <TabsContent value="basic" className="space-y-6 mt-0" dir="rtl">
                <Card className="border-primary/20 bg-primary/5" dir="rtl">
                  <CardContent className="p-6 space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="course_code" className="text-sm font-semibold text-right block">
                          رمز المقرر *
                        </Label>
                        <Input
                          id="course_code"
                          name="course_code"
                          value={formData.course_code}
                          onChange={(e) => handleInputChange('course_code', e.target.value)}
                          placeholder="مثال: CS101"
                          required
                          className="h-11 text-right"
                          dir="rtl"
                        />
                      </div>

                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="credit_hours" className="text-sm font-semibold text-right block">
                          الساعات المعتمدة *
                        </Label>
                        <Input
                          id="credit_hours"
                          name="credit_hours"
                          type="number"
                          min="1"
                          max="30"
                          value={formData.credit_hours}
                          onChange={(e) => handleInputChange('credit_hours', e.target.value)}
                          required
                          className="h-11 text-right"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="course_name_ar" className="text-sm font-semibold text-right block">
                        اسم المقرر (عربي) *
                      </Label>
                      <Input
                        id="course_name_ar"
                        name="course_name_ar"
                        value={formData.course_name_ar}
                        onChange={(e) => handleInputChange('course_name_ar', e.target.value)}
                        placeholder="مثال: مقدمة في البرمجة"
                        required
                        className="h-11 text-right"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="course_name_en" className="text-sm font-semibold text-right block">
                        اسم المقرر (إنجليزي)
                      </Label>
                      <Input
                        id="course_name_en"
                        name="course_name_en"
                        value={formData.course_name_en}
                        onChange={(e) => handleInputChange('course_name_en', e.target.value)}
                        placeholder="Example: Introduction to Programming"
                        className="h-11 text-left"
                        dir="ltr"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2: المعلومات الأكاديمية */}
              <TabsContent value="academic" className="space-y-6 mt-0" dir="rtl">
                <Card className="border-primary/20 bg-primary/5" dir="rtl">
                  <CardContent className="p-6 space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="department_id" className="text-sm font-semibold text-right block">
                          القسم *
                        </Label>
                        <select
                          id="department_id"
                          name="department_id"
                          value={formData.department_id}
                          onChange={(e) => {
                            handleInputChange('department_id', e.target.value);
                            setSelectedDepartment(e.target.value as DepartmentId);
                            handleInputChange('program_id', '');
                          }}
                          className="w-full border rounded-md h-11 px-3 bg-background text-right"
                          required
                          dir="rtl"
                        >
                          <option value="">اختر القسم</option>
                          {departments?.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name.ar}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="program_id" className="text-sm font-semibold text-right block">
                          التخصص *
                        </Label>
                        <select
                          id="program_id"
                          name="program_id"
                          value={formData.program_id}
                          onChange={(e) => handleInputChange('program_id', e.target.value)}
                          className="w-full border rounded-md h-11 px-3 bg-background text-right"
                          required
                          disabled={!selectedDepartment}
                          dir="rtl"
                        >
                          <option value="">اختر التخصص</option>
                          {availablePrograms?.map((programId) => (
                            <option key={programId} value={programId}>
                              {getProgramName(programId, 'ar')}
                            </option>
                          ))}
                        </select>
                        {!selectedDepartment && (
                          <p className="text-xs text-muted-foreground text-right">يرجى اختيار القسم أولاً</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="academic_year" className="text-sm font-semibold text-right block">
                          السنة الدراسية *
                        </Label>
                        <select
                          id="academic_year"
                          name="academic_year"
                          value={formData.academic_year}
                          onChange={(e) => handleInputChange('academic_year', e.target.value)}
                          className="w-full border rounded-md h-11 px-3 bg-background text-right"
                          required
                          dir="rtl"
                        >
                          <option value="1">السنة الأولى</option>
                          <option value="2">السنة الثانية</option>
                          <option value="3">السنة الثالثة</option>
                          <option value="4">السنة الرابعة</option>
                          <option value="5">السنة الخامسة</option>
                          <option value="6">السنة السادسة</option>
                        </select>
                      </div>

                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="semester" className="text-sm font-semibold text-right block">
                          الفصل الدراسي *
                        </Label>
                        <select
                          id="semester"
                          name="semester"
                          value={formData.semester}
                          onChange={(e) => handleInputChange('semester', e.target.value)}
                          className="w-full border rounded-md h-11 px-3 bg-background text-right"
                          required
                          dir="rtl"
                        >
                          <option value="1">الفصل الأول</option>
                          <option value="2">الفصل الثاني</option>
                          <option value="3">الفصل الصيفي</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                      <Label className="text-sm font-semibold text-right block">مدرس المقرر</Label>
                      <div className="space-y-2" dir="rtl">
                        <div className="relative" dir="rtl">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="ابحث عن المدرس..."
                            value={teacherSearchTerm}
                            onChange={(e) => setTeacherSearchTerm(e.target.value)}
                            className="pr-9 h-11 text-right"
                            dir="rtl"
                          />
                        </div>
                        <Select
                          value={selectedTeacher}
                          onValueChange={setSelectedTeacher}
                          dir="rtl"
                        >
                          <SelectTrigger className="h-11 text-right" dir="rtl">
                            <SelectValue placeholder="اختر المدرس" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60" dir="rtl">
                            <SelectItem value="">بدون مدرس</SelectItem>
                            {teachers
                              ?.filter(teacher =>
                                !teacherSearchTerm ||
                                `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
                                teacher.email.toLowerCase().includes(teacherSearchTerm.toLowerCase())
                              )
                              .map((teacher) => (
                                <SelectItem
                                  key={teacher.id}
                                  value={`${teacher.first_name} ${teacher.last_name}`}
                                >
                                  <div className="flex flex-col text-right" dir="rtl">
                                    <span className="font-medium">{teacher.first_name} {teacher.last_name}</span>
                                    <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3: التفاصيل الإضافية */}
              <TabsContent value="details" className="space-y-6 mt-0" dir="rtl">
                <Card className="border-primary/20 bg-primary/5" dir="rtl">
                  <CardContent className="p-6 space-y-4" dir="rtl">
                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="description" className="text-sm font-semibold text-right block">
                        وصف المقرر
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={5}
                        placeholder="أدخل وصفاً تفصيلياً للمقرر وأهدافه ومحتوياته..."
                        className="resize-none text-right"
                        dir="rtl"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        يمكنك إضافة معلومات حول محتوى المقرر، الأهداف التعليمية، والمخرجات المتوقعة
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex flex-col sm:flex-row justify-start gap-3 pt-4 border-t mt-4" dir="rtl">
            <Button type="submit" className="gap-2 flex items-center">
              <Save className="h-4 w-4" />
              {editingCourse ? 'تحديث المقرر' : 'إضافة المقرر'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} className="gap-2 flex items-center">
              <X className="h-4 w-4" />
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
