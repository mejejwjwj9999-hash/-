import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

// Hook لجلب المقررات المسجل فيها الطالب
export const useStudentEnrollments = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['student-enrollments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      // Get enrollments first
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('student_enrollments')
        .select('*')
        .eq('student_id', profile.id)
        .eq('status', 'enrolled')
        .order('created_at', { ascending: false });

      if (enrollmentsError) {
        console.error('خطأ في جلب تسجيلات الطالب:', enrollmentsError);
        throw enrollmentsError;
      }

      if (!enrollments || enrollments.length === 0) {
        return [];
      }

      // Get course details for enrolled courses
      const courseIds = enrollments.map(e => e.course_id);
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds);

      if (coursesError) {
        console.error('خطأ في جلب تفاصيل المقررات:', coursesError);
        throw coursesError;
      }

      // Filter courses to ensure they match student's profile
      const validCourses = courses?.filter(course => {
        const departmentMatch = !profile.department_id || course.department_id === profile.department_id;
        const programMatch = !profile.program_id || course.program_id === profile.program_id;
        const yearMatch = !profile.academic_year || course.academic_year === profile.academic_year;
        const semesterMatch = !profile.semester || course.semester === profile.semester;
        
        console.log('Enrollment course validation:', {
          courseId: course.id,
          courseName: course.course_name_ar,
          departmentMatch,
          programMatch,
          yearMatch,
          semesterMatch,
          studentProfile: {
            department_id: profile.department_id,
            program_id: profile.program_id,
            academic_year: profile.academic_year,
            semester: profile.semester
          },
          courseProfile: {
            department_id: course.department_id,
            program_id: course.program_id,
            academic_year: course.academic_year,
            semester: course.semester
          }
        });
        
        return departmentMatch && programMatch && yearMatch && semesterMatch;
      });

      // Filter enrollments to only include valid courses
      const validEnrollments = enrollments.filter(enrollment => 
        validCourses?.some(course => course.id === enrollment.course_id)
      );

      // Combine enrollment and course data for valid enrollments only
      const enrollmentsWithCourses = validEnrollments.map(enrollment => {
        const course = validCourses?.find(c => c.id === enrollment.course_id);
        return {
          ...enrollment,
          courses: course || null
        };
      });

      return enrollmentsWithCourses;
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook لجلب المقررات المتاحة للتسجيل
export const useAvailableCoursesForEnrollment = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['available-courses-enrollment', profile?.id, profile?.department_id, profile?.program_id, profile?.academic_year, profile?.semester],
    queryFn: async () => {
      if (!profile?.id) return [];

      console.log('Filtering courses for student profile:', {
        department_id: profile.department_id,
        program_id: profile.program_id,
        academic_year: profile.academic_year,
        semester: profile.semester
      });

      // First get courses that match student's department/program/year/semester
      let coursesQuery = supabase
        .from('courses')
        .select('*');

      // Filter by student's criteria - STRICT matching
      if (profile.department_id) {
        coursesQuery = coursesQuery.eq('department_id', profile.department_id);
      }
      if (profile.program_id) {
        coursesQuery = coursesQuery.eq('program_id', profile.program_id);
      }
      if (profile.academic_year) {
        coursesQuery = coursesQuery.eq('academic_year', profile.academic_year);
      }
      if (profile.semester) {
        coursesQuery = coursesQuery.eq('semester', profile.semester);
      }

      const { data: availableCourses, error: coursesError } = await coursesQuery
        .order('course_code');

      console.log('Available courses after filtering:', availableCourses?.length || 0, availableCourses);

      if (coursesError) {
        console.error('خطأ في جلب المقررات المتاحة:', coursesError);
        throw coursesError;
      }

      // Get already enrolled courses
      const { data: enrolledCourses, error: enrolledError } = await supabase
        .from('student_enrollments')
        .select('course_id')
        .eq('student_id', profile.id)
        .eq('status', 'enrolled');

      if (enrolledError) {
        console.error('خطأ في جلب المقررات المسجلة:', enrolledError);
        throw enrolledError;
      }

      const enrolledCourseIds = enrolledCourses?.map(e => e.course_id) || [];

      // Filter out already enrolled courses
      const coursesNotEnrolled = availableCourses?.filter(course => 
        !enrolledCourseIds.includes(course.id)
      ) || [];

      return coursesNotEnrolled;
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook لتسجيل الطالب في مقرر
export const useEnrollInCourse = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!profile?.id) throw new Error('المستخدم غير مسجل الدخول');

      const { data, error } = await supabase
        .from('student_enrollments')
        .insert({
          student_id: profile.id,
          course_id: courseId,
          status: 'enrolled',
          enrollment_date: new Date().toISOString(),
          academic_year: profile.academic_year || 1,
          semester: profile.semester || 1
        })
        .select()
        .single();

      if (error) {
        console.error('خطأ في التسجيل:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('تم التسجيل في المقرر بنجاح');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['available-courses-enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
    onError: (error: any) => {
      console.error('فشل التسجيل:', error);
      toast.error('فشل في التسجيل في المقرر: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لإلغاء تسجيل الطالب من مقرر
export const useUnenrollFromCourse = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!profile?.id) throw new Error('المستخدم غير مسجل الدخول');

      const { error } = await supabase
        .from('student_enrollments')
        .delete()
        .eq('student_id', profile.id)
        .eq('course_id', courseId)
        .eq('status', 'enrolled');

      if (error) {
        console.error('خطأ في إلغاء التسجيل:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('تم إلغاء التسجيل من المقرر بنجاح');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['available-courses-enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
    onError: (error: any) => {
      console.error('فشل إلغاء التسجيل:', error);
      toast.error('فشل في إلغاء التسجيل من المقرر: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};