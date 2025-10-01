import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { EnrolledCourse, Course } from '@/types/course';

// Hook محسن لجلب المقررات المسجل فيها الطالب مع تحسينات الأداء
export const useOptimizedStudentEnrollments = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['optimized-student-enrollments', profile?.id],
    queryFn: async (): Promise<EnrolledCourse[]> => {
      if (!profile?.id) return [];

      try {
        // جلب تسجيلات الطالب أولاً
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('student_enrollments')
          .select('*')
          .eq('student_id', profile.id)
          .eq('status', 'enrolled')
          .order('created_at', { ascending: false });

        if (enrollmentsError) {
          console.error('خطأ في جلب التسجيلات:', enrollmentsError);
          throw enrollmentsError;
        }

        if (!enrollments || enrollments.length === 0) {
          return [];
        }

        // جلب تفاصيل المقررات
        const courseIds = enrollments.map(e => e.course_id);
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds);

        if (coursesError) {
          console.error('خطأ في جلب المقررات:', coursesError);
          throw coursesError;
        }

        // جلب الدرجات للمقررات المسجلة
        const { data: grades, error: gradesError } = await supabase
          .from('grades')
          .select('course_id, total_grade, status')
          .in('course_id', courseIds)
          .eq('student_id', profile.id);

        if (gradesError) {
          console.warn('تحذير في جلب الدرجات:', gradesError);
        }

        // فلترة المقررات للتأكد من توافقها مع ملف الطالب
        const validCourses = courses?.filter(course => {
          const departmentMatch = !profile.department_id || course.department_id === profile.department_id;
          const programMatch = !profile.program_id || course.program_id === profile.program_id;
          const yearMatch = !profile.academic_year || course.academic_year === profile.academic_year;
          const semesterMatch = !profile.semester || course.semester === profile.semester;
          
          return departmentMatch && programMatch && yearMatch && semesterMatch;
        });

        // دمج بيانات التسجيل والمقررات
        const enrolledCourses: EnrolledCourse[] = enrollments
          .filter(enrollment => validCourses?.some(course => course.id === enrollment.course_id))
          .map(enrollment => {
            const course = validCourses?.find(c => c.id === enrollment.course_id)!;
            const courseGrade = grades?.find(g => g.course_id === enrollment.course_id && g.status === 'completed')?.total_grade || 0;
            
            return {
              id: course.id,
              course_code: course.course_code,
              course_name_ar: course.course_name_ar,
              course_name_en: course.course_name_en,
              credit_hours: course.credit_hours,
              department: course.department,
              department_id: course.department_id,
              college: course.college,
              description: course.description,
              academic_year: course.academic_year,
              semester: course.semester,
              program_id: course.program_id,
              specialization: course.specialization,
              created_at: course.created_at,
              enrollmentId: enrollment.id,
              enrollmentDate: enrollment.enrollment_date,
              instructor: course.instructor_name || 'غير محدد',
              currentGrade: courseGrade,
              status: courseGrade > 0 ? 'completed' : 'enrolled',
              color: courseGrade > 0 ? 
                (courseGrade >= 85 ? 'bg-green-500' : 
                 courseGrade >= 75 ? 'bg-blue-500' : 
                 courseGrade >= 60 ? 'bg-orange-500' : 'bg-red-500') : 'bg-gray-500',
              // Aliases for backwards compatibility
              courseId: course.id,
              name: course.course_name_ar,
              code: course.course_code,
              credits: course.credit_hours
            };
          });

        console.log('تم جلب المقررات المحسنة:', enrolledCourses.length);
        return enrolledCourses;

      } catch (error) {
        console.error('خطأ في جلب المقررات المسجلة:', error);
        throw error;
      }
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 دقائق
    gcTime: 10 * 60 * 1000, // 10 دقائق (بدلاً من cacheTime المهجورة)
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

// Hook لجلب المقررات المتاحة للتسجيل مع تحسينات الأداء
export const useOptimizedAvailableCoursesForEnrollment = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: [
      'optimized-available-courses', 
      profile?.id, 
      profile?.department_id, 
      profile?.program_id, 
      profile?.academic_year, 
      profile?.semester
    ],
    queryFn: async (): Promise<Course[]> => {
      if (!profile?.id) return [];

      try {
        // بناء استعلام محسن مع فلترة دقيقة
        let coursesQuery = supabase.from('courses').select('*');

        // فلترة صارمة حسب معايير الطالب
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

        if (coursesError) {
          console.error('خطأ في جلب المقررات المتاحة:', coursesError);
          throw coursesError;
        }

        // جلب المقررات المسجلة بالفعل في استعلام منفصل
        const { data: enrolledCourses, error: enrolledError } = await supabase
          .from('student_enrollments')
          .select('course_id')
          .eq('student_id', profile.id)
          .in('status', ['enrolled', 'completed']);

        if (enrolledError) {
          console.error('خطأ في جلب المقررات المسجلة:', enrolledError);
          throw enrolledError;
        }

        const enrolledCourseIds = enrolledCourses?.map(e => e.course_id) || [];

        // فلترة المقررات غير المسجلة
        const coursesNotEnrolled = availableCourses?.filter(course => 
          !enrolledCourseIds.includes(course.id)
        ) || [];

        console.log('المقررات المتاحة للتسجيل:', coursesNotEnrolled.length);
        return coursesNotEnrolled;

      } catch (error) {
        console.error('خطأ في جلب المقررات المتاحة:', error);
        throw error;
      }
    },
    enabled: !!profile?.id,
    staleTime: 10 * 60 * 1000, // 10 دقائق
    gcTime: 15 * 60 * 1000, // 15 دقيقة
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook محسن للتسجيل مع تحسينات الأداء والأمان
export const useOptimizedEnrollInCourse = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!profile?.id) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // التحقق من وجود المقرر والتأكد من أنه متاح للتسجيل
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        throw new Error('المقرر غير موجود أو غير متاح');
      }

      // التحقق من عدم التسجيل المسبق
      const { data: existingEnrollment } = await supabase
        .from('student_enrollments')
        .select('id')
        .eq('student_id', profile.id)
        .eq('course_id', courseId)
        .single();

      if (existingEnrollment) {
        throw new Error('أنت مسجل في هذا المقرر بالفعل');
      }

      // التسجيل في المقرر
      const { data, error } = await supabase
        .from('student_enrollments')
        .insert({
          student_id: profile.id,
          course_id: courseId,
          status: 'enrolled',
          enrollment_date: new Date().toISOString(),
          academic_year: courseData.academic_year,
          semester: courseData.semester
        })
        .select()
        .single();

      if (error) {
        console.error('خطأ في التسجيل:', error);
        throw new Error('فشل في التسجيل: ' + error.message);
      }

      return { enrollment: data, course: courseData };
    },
    onSuccess: (data) => {
      toast.success(`تم التسجيل في مقرر ${data.course.course_name_ar} بنجاح`);
      
      // تحديث الكاش بذكاء
      queryClient.invalidateQueries({ queryKey: ['optimized-student-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-available-courses'] });
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['available-courses-enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
    onError: (error: Error) => {
      console.error('فشل التسجيل:', error);
      toast.error(error.message || 'فشل في التسجيل في المقرر');
    },
    retry: 1,
  });
};