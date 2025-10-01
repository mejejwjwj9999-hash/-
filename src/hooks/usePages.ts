import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Page {
  id: string;
  page_key: string;
  page_name_ar: string;
  page_name_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const usePages = () => {
  return useQuery({
    queryKey: ['content-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_content_pages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Page[];
    },
  });
};