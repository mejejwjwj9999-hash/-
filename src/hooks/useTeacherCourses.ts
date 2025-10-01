import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTeacherProfile } from './useTeacherProfile';

export interface TeacherCourse {
  id: string;
  teacher_id: string;
  course_id: string;
  semester: string;
  academic_year: string;
  section?: string;
  schedule_times?: any;
  classroom?: string;
  max_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  courses?: {
    id: string;
    course_name_ar: string;
    course_code: string;
    credit_hours: number;
    description?: string;
  };
  enrolled_students_count?: number;
}

export const useTeacherCourses = () => {
  const { data: teacherProfile } = useTeacherProfile();

  return useQuery({
    queryKey: ['teacher-courses', teacherProfile?.id],
    queryFn: async () => {
      if (!teacherProfile?.id) return [];

      const { data, error } = await supabase
        .from('teacher_courses')
        .select(`
          *,
          course:courses!teacher_courses_course_id_fkey (
            id,
            course_name_ar,
            course_code,
            credit_hours,
            description
          )
        `)
        .eq('teacher_id', teacherProfile.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // حساب عدد الطلاب المسجلين لكل مقرر
      const coursesWithEnrollmentCount = await Promise.all(
        (data || [])
          .filter(course => course.course && typeof course.course === 'object')
          .map(async (course) => {
            const { count } = await supabase
              .from('student_enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.course_id)
              .eq('status', 'enrolled');

            return {
              ...course,
              enrolled_students_count: count || 0,
              courses: course.course
            };
          })
      );

      return coursesWithEnrollmentCount as TeacherCourse[];
    },
    enabled: !!teacherProfile?.id,
    staleTime: 1000 * 60 * 2, // دقيقتان
    retry: 2,
  });
};

export const useTeacherCourseStudents = (teacherCourseId: string) => {
  return useQuery({
    queryKey: ['teacher-course-students', teacherCourseId],
    queryFn: async () => {
      if (!teacherCourseId) return [];

      // أولاً نجلب معلومات المقرر
      const { data: teacherCourse } = await supabase
        .from('teacher_courses')
        .select('course_id')
        .eq('id', teacherCourseId)
        .single();

      if (!teacherCourse) return [];

      // ثم نجلب الطلاب المسجلين في هذا المقرر
      const { data, error } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          student_profiles:student_id (
            id,
            student_id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('course_id', teacherCourse.course_id)
        .eq('status', 'enrolled')
        .order('student_profiles(first_name)', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!teacherCourseId,
    staleTime: 1000 * 60 * 5, // 5 دقائق
    retry: 2,
  });
};