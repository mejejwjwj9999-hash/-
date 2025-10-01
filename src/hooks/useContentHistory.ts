import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ContentRevision {
  id: string;
  element_id: string;
  revision_number: number;
  content_ar?: string;
  content_en?: string;
  metadata?: any;
  created_at: string;
  created_by?: string;
}

// Hook للحصول على مراجعات عنصر معين
export const useContentRevisions = (elementId?: string) => {
  return useQuery({
    queryKey: ['content-revisions', elementId],
    queryFn: async () => {
      if (!elementId) return [];
      
      const { data, error } = await supabase
        .from('admin_content_revisions')
        .select('*')
        .eq('element_id', elementId)
        .order('revision_number', { ascending: false });
      
      if (error) throw error;
      return data as ContentRevision[];
    },
    enabled: !!elementId,
  });
};

// Hook لاستعادة مراجعة معينة
export const useRestoreRevision = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      elementId,
      revisionId
    }: {
      elementId: string;
      revisionId: string;
    }) => {
      // الحصول على بيانات المراجعة
      const { data: revision, error: revisionError } = await supabase
        .from('admin_content_revisions')
        .select('*')
        .eq('id', revisionId)
        .single();
      
      if (revisionError) throw revisionError;
      
      // تحديث العنصر بمحتوى المراجعة
      const { data, error } = await supabase
        .from('admin_content_elements')
        .update({
          content_ar: revision.content_ar,
          content_en: revision.content_en,
          metadata: revision.metadata,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', elementId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-elements'] });
      queryClient.invalidateQueries({ queryKey: ['content-element'] });
      queryClient.invalidateQueries({ queryKey: ['public-content'] });
      
      toast({
        title: 'تم استعادة المراجعة بنجاح',
        description: 'تم استعادة المحتوى من المراجعة المحددة'
      });
    },
    onError: (error) => {
      console.error('Error restoring revision:', error);
      toast({
        title: 'خطأ في استعادة المراجعة',
        description: 'حدث خطأ أثناء استعادة المراجعة',
        variant: 'destructive'
      });
    }
  });
};