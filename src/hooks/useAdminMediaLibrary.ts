import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type MediaType = 'image' | 'video' | 'document' | 'audio';

export interface MediaFormData {
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  media_type: MediaType;
  alt_text_ar?: string;
  alt_text_en?: string;
  description_ar?: string;
  description_en?: string;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  uploaded_by?: string;
}

export const useAdminMediaLibrary = (mediaType?: MediaType) => {
  return useQuery({
    queryKey: ['admin-media-library', mediaType],
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

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, mediaData }: { file: File, mediaData: Omit<MediaFormData, 'file_name' | 'original_name' | 'file_path' | 'file_size' | 'mime_type' | 'uploaded_by'> }) => {
      // Validate file is actually a File object
      if (!(file instanceof File)) {
        throw new Error('يجب أن يكون الملف من نوع File object');
      }
      
      // Validate MIME type
      if (!file.type || file.type === 'application/octet-stream') {
        throw new Error('نوع الملف غير صحيح أو غير مدعوم');
      }
      
      // Ensure filename is clean and includes extension
      const fileExtension = file.name.split('.').pop() || '';
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${cleanName}`;
      const filePath = `media/${mediaData.media_type}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`فشل في رفع الملف إلى التخزين: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-media')
        .getPublicUrl(filePath);
      
      // Save media record to database
      const mediaRecord: MediaFormData = {
        ...mediaData,
        file_name: fileName,
        original_name: file.name,
        file_path: publicUrl,
        file_size: file.size,
        mime_type: file.type,
      };
      
      const { data, error } = await supabase
        .from('admin_media_library')
        .insert([mediaRecord])
        .select()
        .single();
      
      if (error) {
        console.error('Database insert error:', error);
        
        // Try to clean up uploaded file if database insert fails
        await supabase.storage
          .from('site-media')
          .remove([filePath])
          .catch(console.error);
          
        throw new Error(`فشل في حفظ بيانات الملف: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media-library'] });
      queryClient.invalidateQueries({ queryKey: ['media-images'] });
      queryClient.invalidateQueries({ queryKey: ['media-videos'] });
      toast.success('تم رفع الملف بنجاح');
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
      toast.error('فشل في رفع الملف: ' + error.message);
    }
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<MediaFormData> }) => {
      const { data: result, error } = await supabase
        .from('admin_media_library')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media-library'] });
      toast.success('تم تحديث الملف بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في تحديث الملف: ' + error.message);
    }
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Get file path first
      const { data: mediaItem } = await supabase
        .from('admin_media_library')
        .select('file_path')
        .eq('id', id)
        .single();
      
      if (mediaItem?.file_path) {
        // Extract file path from URL
        const filePath = mediaItem.file_path.split('/').slice(-3).join('/');
        
        // Delete from storage
        await supabase.storage
          .from('site-media')
          .remove([filePath]);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('admin_media_library')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media-library'] });
      queryClient.invalidateQueries({ queryKey: ['media-images'] });
      queryClient.invalidateQueries({ queryKey: ['media-videos'] });
      toast.success('تم حذف الملف بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في حذف الملف: ' + error.message);
    }
  });
};