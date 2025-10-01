import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      // Using notifications table for news/announcements
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .is('student_id', null) // Public notifications (news)
        .eq('type', 'news')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
  });
};