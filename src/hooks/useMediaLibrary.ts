import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type MediaType = 'image' | 'video' | 'document' | 'audio';

export const useMediaLibrary = (mediaType?: MediaType) => {
  return useQuery({
    queryKey: ['media-library', mediaType],
    queryFn: async () => {
      let query = supabase
        .from('admin_media_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (mediaType) {
        query = query.eq('media_type', mediaType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useImages = () => {
  return useQuery({
    queryKey: ['media-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_media_library')
        .select('*')
        .eq('media_type', 'image' as MediaType)
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useVideos = () => {
  return useQuery({
    queryKey: ['media-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_media_library')
        .select('*')
        .eq('media_type', 'video' as MediaType)
        .order('created_at', { ascending: false })
        .limit(9);
      
      if (error) throw error;
      return data || [];
    },
  });
};