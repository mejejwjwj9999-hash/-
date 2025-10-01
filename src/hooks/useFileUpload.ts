import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const uploadFile = useCallback(async (file: File, path: string): Promise<string> => {
    const controller = new AbortController();
    setAbortController(controller);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename - sanitize path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      // Clean the path to avoid issues with special characters
      const cleanPath = path.replace(/[^\w\/-]/g, '_');
      const fullPath = `${cleanPath}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('course-files')
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('course-files')
        .getPublicUrl(fullPath);

      setUploadProgress(100);
      toast.success('تم رفع الملف بنجاح');
      return publicUrlData.publicUrl;

    } catch (error: any) {
      if (error.message === 'Upload cancelled') {
        toast.info('تم إلغاء رفع الملف');
      } else {
        toast.error('فشل في رفع الملف');
        console.error('Upload error:', error);
      }
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setAbortController(null);
    }
  }, []);

  const cancelUpload = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setIsUploading(false);
      setUploadProgress(0);
      setAbortController(null);
    }
  }, [abortController]);

  const uploadMultipleFiles = useCallback(async (
    files: File[], 
    getPath: (file: File, index: number) => string
  ): Promise<string[]> => {
    const uploadPromises = files.map((file, index) => 
      uploadFile(file, getPath(file, index))
    );
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      toast.error('فشل في رفع بعض الملفات');
      throw error;
    }
  }, [uploadFile]);

  return {
    uploadProgress,
    isUploading,
    uploadFile,
    uploadMultipleFiles,
    cancelUpload,
  };
};