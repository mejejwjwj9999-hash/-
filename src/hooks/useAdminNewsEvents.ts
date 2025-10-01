import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NewsEventFormData {
  title_ar: string;
  title_en?: string;
  summary_ar?: string;
  summary_en?: string;
  content_ar?: string;
  content_en?: string;
  type: 'news' | 'event';
  featured_image?: string;
  images?: string[];
  tags?: string[];
  event_date?: string;
  event_location_ar?: string;
  event_location_en?: string;
  is_featured?: boolean;
  is_breaking?: boolean;
  status?: 'draft' | 'published' | 'archived';
}

export const useAdminNewsEvents = () => {
  return useQuery({
    queryKey: ['admin-news-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_news_events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateNewsEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: NewsEventFormData) => {
      const { data, error } = await supabase
        .from('admin_news_events')
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news-events'] });
      queryClient.invalidateQueries({ queryKey: ['news-events'] });
      toast.success('تم إنشاء المحتوى بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في إنشاء المحتوى: ' + error.message);
    }
  });
};

export const useUpdateNewsEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<NewsEventFormData> }) => {
      const { data: result, error } = await supabase
        .from('admin_news_events')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news-events'] });
      queryClient.invalidateQueries({ queryKey: ['news-events'] });
      toast.success('تم تحديث المحتوى بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في تحديث المحتوى: ' + error.message);
    }
  });
};

export const useDeleteNewsEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_news_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news-events'] });
      queryClient.invalidateQueries({ queryKey: ['news-events'] });
      toast.success('تم حذف المحتوى بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في حذف المحتوى: ' + error.message);
    }
  });
};