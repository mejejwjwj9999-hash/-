import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  credit_hours: number;
  department: string;
  college: string;
  description?: string;
  prerequisites?: string[];
  instructor?: string;
  academic_year: number;
  semester: number;
  max_students?: number;
  created_at: string;
};

// Hook لجلب جميع المقررات المتاحة للطالب
export const useStudentAvailableCourses = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['student-available-courses', profile?.role],
    queryFn: async (): Promise<Course[]> => {
      // جلب جميع المقررات للطلاب
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('academic_year')
        .order('semester')
        .order('course_code');
      
      if (error) {
        console.error('خطأ في تحميل المقررات المتاحة:', error);
        throw error;
      }
      
      console.log('تم تحميل المقررات المتاحة للطالب:', data?.length || 0);
      return (data as Course[]) || [];
    },
    enabled: profile?.role === 'student',
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

// Hook لجلب مقررات فصل دراسي محدد
export const useStudentCourses = (academicYear?: number, semester?: number) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['student-courses', profile?.role, academicYear, semester],
    queryFn: async (): Promise<Course[]> => {
      let query = supabase
        .from('courses')
        .select('*');

      // فلترة حسب السنة الدراسية والفصل إذا تم تحديدهما
      if (academicYear) {
        query = query.eq('academic_year', academicYear);
      }
      if (semester) {
        query = query.eq('semester', semester);
      }

      query = query.order('course_code');

      const { data, error } = await query;
      
      if (error) {
        console.error('خطأ في تحميل مقررات الطالب:', error);
        throw error;
      }
      
      console.log('تم تحميل مقررات الطالب:', data?.length || 0);
      return (data as Course[]) || [];
    },
    enabled: profile?.role === 'student',
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};