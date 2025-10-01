import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  college: string;
  department: string;
  credit_hours: number;
  academic_year?: number;
  semester?: number;
  description?: string;
  created_at: string;
}

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('course_code', { ascending: true });

      if (error) {
        console.error('خطأ في جلب المقررات:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
    retry: 2,
  });
};