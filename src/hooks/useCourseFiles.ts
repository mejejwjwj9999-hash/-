import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useCourseFiles = (courseId?: string) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['course-files', courseId, profile?.id],
    queryFn: async () => {
      if (!profile?.id || !courseId) return [];
      
      const { data, error } = await supabase
        .from('course_files')
        .select(`
          *,
          courses:course_id (
            course_name_ar,
            course_name_en,
            course_code
          )
        `)
        .eq('course_id', courseId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id && !!courseId,
  });
};

export const useAllCourseFiles = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['course-files', 'all', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('course_files')
        .select(`
          *,
          courses:course_id (
            course_name_ar,
            course_name_en,
            course_code
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });
};

export const useUploadCourseFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileData: {
      course_id: string;
      file_name: string;
      file_path: string;
      file_size?: number;
      file_type: string;
      category?: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('course_files')
        .insert(fileData);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-files'] });
    },
  });
};

export const useDeleteCourseFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('course_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-files'] });
    },
  });
};