import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeacherAnnouncement {
  id: string;
  teacher_id: string;
  course_id?: string;
  title: string;
  content: string;
  announcement_type: 'general' | 'assignment' | 'exam' | 'schedule' | 'material';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target_audience: 'students' | 'all' | 'specific_course';
  is_published: boolean;
  publish_date: string;
  expire_date?: string;
  created_at: string;
  updated_at: string;
  courses?: {
    id: string;
    course_name_ar: string;
    course_code: string;
  };
}

export const useTeacherAnnouncements = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teacher-announcements', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];

      const { data, error } = await supabase
        .from('teacher_announcements')
        .select(`
          *,
          courses:course_id (
            id,
            course_name_ar,
            course_code
          )
        `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TeacherAnnouncement[];
    },
    enabled: !!teacherId,
    staleTime: 1000 * 60 * 2, // دقيقتان
    retry: 2,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (announcementData: Omit<TeacherAnnouncement, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('teacher_announcements')
        .insert([announcementData])
        .select(`
          *,
          courses:course_id (
            id,
            course_name_ar,
            course_code
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['teacher-announcements', variables.teacher_id] 
      });
      // تحديث إشعارات الطلاب أيضاً
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'تم نشر الإعلان',
        description: 'تم إنشاء الإعلان بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في إنشاء الإعلان:', error);
      toast({
        title: 'خطأ في النشر',
        description: 'حدث خطأ أثناء نشر الإعلان',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TeacherAnnouncement> }) => {
      const { data, error } = await supabase
        .from('teacher_announcements')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          courses:course_id (
            id,
            course_name_ar,
            course_code
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['teacher-announcements', data.teacher_id] 
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الإعلان بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في تحديث الإعلان:', error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث الإعلان',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teacher_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الإعلان بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في حذف الإعلان:', error);
      toast({
        title: 'خطأ في الحذف',
        description: 'حدث خطأ أثناء حذف الإعلان',
        variant: 'destructive',
      });
    },
  });
};

export const usePublicAnnouncements = (courseId?: string) => {
  return useQuery({
    queryKey: ['public-announcements', courseId],
    queryFn: async () => {
      let query = supabase
        .from('teacher_announcements')
        .select(`
          *,
          courses:course_id (
            id,
            course_name_ar,
            course_code
          )
        `)
        .eq('is_published', true)
        .or('expire_date.is.null,expire_date.gt.now()')
        .order('priority', { ascending: false })
        .order('publish_date', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TeacherAnnouncement[];
    },
    staleTime: 1000 * 60 * 1, // دقيقة واحدة
    retry: 2,
  });
};