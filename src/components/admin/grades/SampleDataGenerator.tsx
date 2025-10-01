import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Users, BookOpen, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SampleDataGenerator = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSampleStudents = async () => {
    const sampleStudents = [
      {
        student_id: 'ST001',
        first_name: 'أحمد',
        last_name: 'محمد',
        email: 'ahmed.mohamed@university.edu.sa',
        department: 'computer_science',
        academic_year: 2024,
        status: 'active',
        college: 'كلية علوم الحاسوب',
        admission_date: '2024-09-01',
        semester: 1
      },
      {
        student_id: 'ST002',
        first_name: 'فاطمة',
        last_name: 'علي',
        email: 'fatima.ali@university.edu.sa',
        department: 'engineering',
        academic_year: 2024,
        status: 'active',
        college: 'كلية الهندسة',
        admission_date: '2024-09-01',
        semester: 1
      },
      {
        student_id: 'ST003',
        first_name: 'خالد',
        last_name: 'السالم',
        email: 'khalid.alsalem@university.edu.sa',
        department: 'business',
        academic_year: 2023,
        status: 'active',
        college: 'كلية إدارة الأعمال',
        admission_date: '2023-09-01',
        semester: 1
      },
      {
        student_id: 'ST004',
        first_name: 'نور',
        last_name: 'الهدى',
        email: 'noor.alhuda@university.edu.sa',
        department: 'medicine',
        academic_year: 2024,
        status: 'active',
        college: 'كلية الطب',
        admission_date: '2024-09-01',
        semester: 1
      },
      {
        student_id: 'ST005',
        first_name: 'عبدالله',
        last_name: 'العتيبي',
        email: 'abdullah.alotaibi@university.edu.sa',
        department: 'computer_science',
        academic_year: 2023,
        status: 'active',
        college: 'كلية علوم الحاسوب',
        admission_date: '2023-09-01',
        semester: 1
      },
      {
        student_id: 'ST006',
        first_name: 'سارة',
        last_name: 'القحطاني',
        email: 'sarah.alqahtani@university.edu.sa',
        department: 'engineering',
        academic_year: 2024,
        status: 'active',
        college: 'كلية الهندسة',
        admission_date: '2024-09-01',
        semester: 1
      }
    ];

    const { error } = await supabase
      .from('student_profiles')
      .upsert(sampleStudents, { onConflict: 'student_id' });

    if (error) throw error;
    return sampleStudents.length;
  };

  const generateSampleCourses = async () => {
    const sampleCourses = [
      {
        course_code: 'CS101',
        course_name_ar: 'مقدمة في علوم الحاسوب',
        course_name_en: 'Introduction to Computer Science',
        credit_hours: 3,
        department: 'computer_science',
        college: 'كلية علوم الحاسوب'
      },
      {
        course_code: 'CS201',
        course_name_ar: 'برمجة الحاسوب',
        course_name_en: 'Computer Programming',
        credit_hours: 4,
        department: 'computer_science',
        college: 'كلية علوم الحاسوب'
      },
      {
        course_code: 'ENG101',
        course_name_ar: 'الرياضيات الهندسية',
        course_name_en: 'Engineering Mathematics',
        credit_hours: 3,
        department: 'engineering',
        college: 'كلية الهندسة'
      },
      {
        course_code: 'BUS101',
        course_name_ar: 'مبادئ إدارة الأعمال',
        course_name_en: 'Business Management Principles',
        credit_hours: 3,
        department: 'business',
        college: 'كلية إدارة الأعمال'
      },
      {
        course_code: 'MED101',
        course_name_ar: 'علم التشريح',
        course_name_en: 'Anatomy',
        credit_hours: 5,
        department: 'medicine',
        college: 'كلية الطب'
      },
      {
        course_code: 'CS301',
        course_name_ar: 'قواعد البيانات',
        course_name_en: 'Database Systems',
        credit_hours: 3,
        department: 'computer_science',
        college: 'كلية علوم الحاسوب'
      }
    ];

    const { error } = await supabase
      .from('courses')
      .upsert(sampleCourses, { onConflict: 'course_code' });

    if (error) throw error;
    return sampleCourses.length;
  };

  const generateSampleGrades = async () => {
    // جلب الطلاب والمقررات الموجودة
    const { data: students } = await supabase
      .from('student_profiles')
      .select('id, student_id');

    const { data: courses } = await supabase
      .from('courses')
      .select('id, course_code');

    if (!students || !courses) return 0;

    const sampleGrades = [];
    
    // إنشاء درجات عشوائية لكل طالب في مقررات مختلفة
    for (const student of students.slice(0, 4)) {
      for (const course of courses.slice(0, 3)) {
        const courseworkGrade = Math.floor(Math.random() * 15) + 25; // 25-40
        const midtermGrade = Math.floor(Math.random() * 8) + 12; // 12-20
        const finalGrade = Math.floor(Math.random() * 15) + 25; // 25-40
        const totalGrade = courseworkGrade + midtermGrade + finalGrade;
        
        // تحديد التقدير والنقاط
        let letterGrade = 'F';
        let gpaPoints = 0;
        
        if (totalGrade >= 95) { letterGrade = 'A+'; gpaPoints = 4.0; }
        else if (totalGrade >= 90) { letterGrade = 'A'; gpaPoints = 3.7; }
        else if (totalGrade >= 85) { letterGrade = 'B+'; gpaPoints = 3.3; }
        else if (totalGrade >= 80) { letterGrade = 'B'; gpaPoints = 3.0; }
        else if (totalGrade >= 75) { letterGrade = 'C+'; gpaPoints = 2.7; }
        else if (totalGrade >= 70) { letterGrade = 'C'; gpaPoints = 2.3; }
        else if (totalGrade >= 65) { letterGrade = 'D+'; gpaPoints = 2.0; }
        else if (totalGrade >= 60) { letterGrade = 'D'; gpaPoints = 1.7; }

        sampleGrades.push({
          student_id: student.id,
          course_id: course.id,
          coursework_grade: courseworkGrade,
          midterm_grade: midtermGrade,
          final_grade: finalGrade,
          total_grade: totalGrade,
          letter_grade: letterGrade,
          gpa_points: gpaPoints,
          academic_year: '2024',
          semester: '1'
        });
      }
    }

    const { error } = await supabase
      .from('grades')
      .upsert(sampleGrades);

    if (error) throw error;
    return sampleGrades.length;
  };

  const handleGenerateAllData = async () => {
    setLoading(true);
    try {
      const studentsCount = await generateSampleStudents();
      const coursesCount = await generateSampleCourses();
      const gradesCount = await generateSampleGrades();

      toast({
        title: "تم إنشاء البيانات التجريبية",
        description: `تم إضافة ${studentsCount} طلاب، ${coursesCount} مقررات، ${gradesCount} درجة`,
      });

      // إعادة تحميل الصفحة لإظهار البيانات الجديدة
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast({
        title: "خطأ في إنشاء البيانات",
        description: "حدث خطأ أثناء إنشاء البيانات التجريبية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-university-blue" />
          إنشاء بيانات تجريبية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            لاختبار النظام، يمكنك إنشاء بيانات تجريبية تتضمن طلاب ومقررات ودرجات
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-600" />
              <span>6 طلاب تجريبيين</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span>6 مقررات دراسية</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4 text-orange-600" />
              <span>درجات متنوعة</span>
            </div>
          </div>

          <Button 
            onClick={handleGenerateAllData}
            disabled={loading}
            className="w-fit"
          >
            <Database className="h-4 w-4 mr-2" />
            {loading ? 'جاري الإنشاء...' : 'إنشاء البيانات التجريبية'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};