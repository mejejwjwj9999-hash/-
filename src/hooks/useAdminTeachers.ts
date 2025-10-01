import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminTeacherOption {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  position?: string;
  specialization?: string;
  profile_image_url?: string;
  is_active: boolean;
}

export const useAdminTeachers = () => {
  return useQuery({
    queryKey: ['active-teachers'],
    queryFn: async (): Promise<AdminTeacherOption[]> => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('id, first_name, last_name, email, position, specialization, profile_image_url, is_active')
        .eq('is_active', true)
        .order('first_name', { ascending: true });
      if (error) throw error;
      return (data || []) as AdminTeacherOption[];
    },
    staleTime: 1000 * 60 * 2,
  });
};


