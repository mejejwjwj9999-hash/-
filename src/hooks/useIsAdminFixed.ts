
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useIsAdminFixed = (userId?: string) => {
  return useQuery({
    queryKey: ['is-admin', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
          return false;
        }
        
        return !!data;
      } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
