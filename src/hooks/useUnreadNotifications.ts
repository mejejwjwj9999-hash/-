
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export const useUnreadNotifications = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["unread-notifications", profile?.id],
    queryFn: async (): Promise<number> => {
      if (!profile?.id) return 0;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', profile.id)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error fetching unread notifications count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 60, // 1 minute
  });
};
