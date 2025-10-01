import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeacherMaterial {
  id: string;
  teacher_course_id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  material_type: 'lecture' | 'assignment' | 'reference' | 'exam';
  week_number?: number;
  is_required: boolean;
  is_public: boolean;
  download_count: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export const useTeacherMaterials = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teacher-materials', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];

      const { data, error } = await supabase
        .from('teacher_course_materials')
        .select(`
          *,
          teacher_courses!inner(
            course_id,
            courses(
              course_name_ar,
              course_code
            )
          )
        `)
        .eq('teacher_courses.teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TeacherMaterial[];
    },
    enabled: !!teacherId,
    staleTime: 1000 * 60 * 2, // دقيقتان
    retry: 2,
  });
};

export const useUploadMaterial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (materialData: Omit<TeacherMaterial, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('teacher_course_materials')
        .insert([materialData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-materials'] });
      toast({
        title: 'تم رفع المادة',
        description: 'تم رفع المادة التعليمية بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في رفع المادة:', error);
      toast({
        title: 'خطأ في الرفع',
        description: 'حدث خطأ أثناء رفع المادة التعليمية',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TeacherMaterial> }) => {
      const { data, error } = await supabase
        .from('teacher_course_materials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-materials'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث المادة التعليمية بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في تحديث المادة:', error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث المادة التعليمية',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teacher_course_materials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-materials'] });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المادة التعليمية بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في حذف المادة:', error);
      toast({
        title: 'خطأ في الحذف',
        description: 'حدث خطأ أثناء حذف المادة التعليمية',
        variant: 'destructive',
      });
    },
  });
};