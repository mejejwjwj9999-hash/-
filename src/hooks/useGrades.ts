
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useGrades = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['grades', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          courses!grades_course_id_fkey (
            course_name_ar,
            course_name_en,
            course_code,
            credit_hours
          )
        `)
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching grades:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
