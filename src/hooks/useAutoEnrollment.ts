import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Hook لتسجيل الطلاب تلقائياً في المقررات المناسبة
export const useAutoEnrollStudents = () => {
  return useMutation({
    mutationFn: async (courseData: {
      courseId: string;
      departmentId?: string;
      programId?: string;
      academicYear?: number;
      semester?: number;
    }) => {
      console.log('Starting auto-enrollment for course:', courseData);
      
      // Since we don't have direct access to student profiles, 
      // we'll use existing enrollments to find active students
      // This is a simplified approach - in production you'd want a proper students table
      const { data: activeStudents, error: studentsError } = await supabase
        .from('student_enrollments')
        .select('student_id')
        .eq('status', 'enrolled')
        .limit(1000); // Get a reasonable number of active students

      if (studentsError) {
        console.error('Error fetching active students:', studentsError);
        throw studentsError;
      }

      if (!activeStudents || activeStudents.length === 0) {
        console.log('No active students found for auto-enrollment');
        return { enrolledCount: 0, students: [] };
      }

      // Get unique student IDs
      const uniqueStudentIds = [...new Set(activeStudents.map(s => s.student_id))];

      // التحقق من الطلاب المسجلين مسبقاً في هذا المقرر
      const { data: existingEnrollments, error: enrollmentsError } = await supabase
        .from('student_enrollments')
        .select('student_id')
        .eq('course_id', courseData.courseId)
        .eq('status', 'enrolled');

      if (enrollmentsError) {
        console.error('Error checking existing enrollments:', enrollmentsError);
        throw enrollmentsError;
      }

      const alreadyEnrolledIds = existingEnrollments?.map(e => e.student_id) || [];
      
      // تصفية الطلاب غير المسجلين في هذا المقرر
      const studentsToEnroll = uniqueStudentIds.filter(
        studentId => !alreadyEnrolledIds.includes(studentId)
      );

      if (studentsToEnroll.length === 0) {
        console.log('All eligible students are already enrolled');
        return { enrolledCount: 0, students: [] };
      }

      // إنشاء تسجيلات جديدة (نأخذ أول 50 طالب فقط لتجنب التحميل الزائد)
      const studentsToProcess = studentsToEnroll.slice(0, 50);
      const enrollmentData = studentsToProcess.map(studentId => ({
        student_id: studentId,
        course_id: courseData.courseId,
        status: 'enrolled' as const,
        enrollment_date: new Date().toISOString(),
        academic_year: courseData.academicYear || new Date().getFullYear(),
        semester: courseData.semester || 1
      }));

      const { error: insertError } = await supabase
        .from('student_enrollments')
        .insert(enrollmentData);

      if (insertError) {
        console.error('Error inserting enrollments:', insertError);
        throw insertError;
      }

      console.log(`Successfully enrolled ${studentsToProcess.length} students`);
      
      return {
        enrolledCount: studentsToProcess.length,
        students: studentsToProcess.map(id => ({ id }))
      };
    },
    onSuccess: (data) => {
      if (data.enrolledCount > 0) {
        toast.success(`تم تسجيل ${data.enrolledCount} طالب تلقائياً في المقرر`);
      } else {
        toast.info('جميع الطلاب المؤهلين مسجلين مسبقاً في هذا المقرر');
      }
    },
    onError: (error: any) => {
      console.error('Auto-enrollment failed:', error);
      toast.error('فشل في التسجيل التلقائي للطلاب: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};