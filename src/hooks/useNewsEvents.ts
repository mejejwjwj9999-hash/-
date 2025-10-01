import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNewsEvents = (type?: string) => {
  return useQuery({
    queryKey: ['news-events', type],
    queryFn: async () => {
      let query = supabase
        .from('admin_news_events')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useFeaturedNews = () => {
  return useQuery({
    queryKey: ['featured-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_news_events')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_news_events')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};