import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export interface TeacherProfile {
  id: string;
  user_id: string;
  teacher_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  specialization?: string;
  qualifications?: string;
  hire_date?: string;
  position?: string;
  office_location?: string;
  office_hours?: string;
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTeacherProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          department_id,
          specialization,
          qualifications,
          hire_date,
          position,
          office_location,
          office_hours,
          bio,
          profile_image_url
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      return data as TeacherProfile;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 دقائق
    retry: 2,
  });
};

export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<TeacherProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('غير مصرح للدخول');

      const { data, error } = await supabase
        .from('teacher_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-profile'] });
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث ملفك الشخصي بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في تحديث ملف المعلم:', error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث ملفك الشخصي',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateTeacherProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: Omit<TeacherProfile, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-profile'] });
      toast({
        title: 'تم إنشاء الملف الشخصي',
        description: 'تم إنشاء ملفك الشخصي بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في إنشاء ملف المعلم:', error);
      toast({
        title: 'خطأ في الإنشاء',
        description: 'حدث خطأ أثناء إنشاء ملفك الشخصي',
        variant: 'destructive',
      });
    },
  });
};