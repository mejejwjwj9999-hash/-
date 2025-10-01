import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AddGradeDialogProps {
  studentId?: string;
  courseId?: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const AddGradeDialog: React.FC<AddGradeDialogProps> = ({
  studentId,
  courseId,
  onSuccess,
  trigger
}) => {
  const [open, setOpen] = useState(!!studentId);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_id: studentId || '',
    course_id: courseId || '',
    grade: '',
    gpa_points: '',
    letter_grade: '',
    academic_year: new Date().getFullYear(),
    semester: 1
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب قائمة الطلاب
  const { data: students = [] } = useQuery({
    queryKey: ['students-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, student_id, first_name, last_name')
        .order('student_id');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !studentId
  });

  // جلب قائمة المقررات
  const { data: courses = [] } = useQuery({
    queryKey: ['courses-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, course_code, course_name_ar, credit_hours')
        .order('course_code');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !courseId
  });

  // تحويل الدرجة إلى نقاط ورموز
  const calculateGradePoints = (grade: number) => {
    if (grade >= 95) return { points: 4.0, letter: 'A+' };
    if (grade >= 90) return { points: 3.75, letter: 'A' };
    if (grade >= 85) return { points: 3.5, letter: 'B+' };
    if (grade >= 80) return { points: 3.0, letter: 'B' };
    if (grade >= 75) return { points: 2.5, letter: 'C+' };
    if (grade >= 70) return { points: 2.0, letter: 'C' };
    if (grade >= 65) return { points: 1.5, letter: 'D+' };
    if (grade >= 60) return { points: 1.0, letter: 'D' };
    return { points: 0.0, letter: 'F' };
  };

  const handleGradeChange = (value: string) => {
    const grade = parseFloat(value);
    if (!isNaN(grade)) {
      const { points, letter } = calculateGradePoints(grade);
      setFormData(prev => ({
        ...prev,
        grade: value,
        gpa_points: points.toString(),
        letter_grade: letter
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        grade: value,
        gpa_points: '',
        letter_grade: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.course_id || !formData.grade) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('grades')
        .insert({
          student_id: formData.student_id,
          course_id: formData.course_id,
          total_grade: parseFloat(formData.grade),
          gpa_points: parseFloat(formData.gpa_points),
          letter_grade: formData.letter_grade,
          academic_year: formData.academic_year.toString(),
          semester: formData.semester.toString()
        });

      if (error) throw error;

      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة الدرجة بنجاح",
      });

      // إعادة تحميل البيانات
      queryClient.invalidateQueries({ queryKey: ['students-with-grades'] });
      queryClient.invalidateQueries({ queryKey: ['student-grade-details'] });
      queryClient.invalidateQueries({ queryKey: ['courses-with-stats'] });

      setOpen(false);
      onSuccess?.();
      
      // إعادة تعيين النموذج
      setFormData({
        student_id: studentId || '',
        course_id: courseId || '',
        grade: '',
        gpa_points: '',
        letter_grade: '',
        academic_year: new Date().getFullYear(),
        semester: 1
      });

    } catch (error) {
      console.error('Error adding grade:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء إضافة الدرجة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) onSuccess?.();
    }}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && !studentId && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة درجة
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-university-blue" />
            إضافة درجة جديدة
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اختيار الطالب */}
          {!studentId && (
            <div className="space-y-2">
              <Label htmlFor="student">الطالب</Label>
              <Select 
                value={formData.student_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الطالب" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} - {student.student_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* اختيار المقرر */}
          {!courseId && (
            <div className="space-y-2">
              <Label htmlFor="course">المقرر</Label>
              <Select 
                value={formData.course_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المقرر" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_code} - {course.course_name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* الدرجة */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">الدرجة</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                placeholder="0-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gpa">النقاط</Label>
              <Input
                id="gpa"
                type="number"
                step="0.1"
                value={formData.gpa_points}
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="letter">الرمز</Label>
              <Input
                id="letter"
                value={formData.letter_grade}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* السنة والفصل */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">السنة الأكاديمية</Label>
              <Input
                id="year"
                type="number"
                value={formData.academic_year}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  academic_year: parseInt(e.target.value) || new Date().getFullYear()
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semester">الفصل الدراسي</Label>
              <Select 
                value={formData.semester.toString()} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  semester: parseInt(value) 
                }))}
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
          </div>


          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'جاري الحفظ...' : 'حفظ الدرجة'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};