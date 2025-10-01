import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AboutSection, AboutSectionElement, AboutSectionStats, SectionType } from '@/types/aboutSections';

// Hook للحصول على جميع أقسام عن الكلية
export const useAboutSections = () => {
  return useQuery({
    queryKey: ['about-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_content_pages')
        .select(`
          *,
          elements:admin_content_elements(*)
        `)
        .like('page_key', 'about-%')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AboutSection[];
    },
  });
};

// Hook للحصول على قسم محدد مع عناصره
export const useAboutSection = (pageKey: string) => {
  return useQuery({
    queryKey: ['about-section', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_content_pages')
        .select(`
          *,
          elements:admin_content_elements(*)
        `)
        .eq('page_key', pageKey)
        .single();
      
      if (error) throw error;
      return data as AboutSection;
    },
    enabled: !!pageKey,
  });
};

// Hook للحصول على عناصر قسم معين
export const useAboutSectionElements = (pageKey: string) => {
  return useQuery({
    queryKey: ['about-section-elements', pageKey],
    queryFn: async () => {
      const { data: pageData, error: pageError } = await supabase
        .from('admin_content_pages')
        .select('id')
        .eq('page_key', pageKey)
        .single();
      
      if (pageError) throw pageError;
      
      const { data, error } = await supabase
        .from('admin_content_elements')
        .select('*')
        .eq('page_id', pageData.id)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AboutSectionElement[];
    },
    enabled: !!pageKey,
  });
};

// Hook لتحديث قسم معين
export const useUpdateAboutSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      pageKey,
      updates
    }: {
      pageKey: string;
      updates: Partial<AboutSection>;
    }) => {
      const { data, error } = await supabase
        .from('admin_content_pages')
        .update(updates)
        .eq('page_key', pageKey)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
      queryClient.invalidateQueries({ queryKey: ['about-section', variables.pageKey] });
      
      toast({
        title: 'تم تحديث القسم بنجاح',
        description: 'تم حفظ التغييرات بنجاح'
      });
    },
    onError: (error: any) => {
      console.error('Error updating section:', error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث القسم',
        variant: 'destructive'
      });
    }
  });
};

// Hook لتحديث عنصر في قسم معين
export const useUpdateAboutSectionElement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      pageKey,
      elementKey,
      elementType,
      contentAr,
      contentEn,
      metadata,
      status = 'draft'
    }: {
      pageKey: string;
      elementKey: string;
      elementType: AboutSectionElement['element_type'];
      contentAr?: string;
      contentEn?: string;
      metadata?: any;
      status?: AboutSectionElement['status'];
    }) => {
      // الحصول على page_id
      const { data: pageData, error: pageError } = await supabase
        .from('admin_content_pages')
        .select('id')
        .eq('page_key', pageKey)
        .single();
      
      if (pageError) throw pageError;
      
      // التحقق من وجود العنصر
      const { data: existingElement } = await supabase
        .from('admin_content_elements')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('element_key', elementKey)
        .maybeSingle();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const elementData = {
        page_id: pageData.id,
        element_key: elementKey,
        element_type: elementType,
        content_ar: contentAr,
        content_en: contentEn,
        metadata: metadata || {},
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_by: user?.id
      };
      
      if (existingElement) {
        // تحديث العنصر الموجود
        const { data, error } = await supabase
          .from('admin_content_elements')
          .update(elementData)
          .eq('id', existingElement.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // إنشاء عنصر جديد
        const { data, error } = await supabase
          .from('admin_content_elements')
          .insert({
            ...elementData,
            created_by: user?.id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
      queryClient.invalidateQueries({ queryKey: ['about-section', variables.pageKey] });
      queryClient.invalidateQueries({ queryKey: ['about-section-elements', variables.pageKey] });
      
      toast({
        title: 'تم حفظ المحتوى بنجاح',
        description: `تم ${data.status === 'published' ? 'نشر' : 'حفظ'} المحتوى`
      });
    },
    onError: (error: any) => {
      console.error('Error updating element:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ المحتوى',
        variant: 'destructive'
      });
    }
  });
};

// Hook للحصول على إحصائيات الأقسام
export const useAboutSectionStats = (): AboutSectionStats => {
  const { data: sections = [] } = useAboutSections();
  
  const stats: AboutSectionStats = {
    totalSections: sections.length,
    activeSections: sections.filter(s => s.is_active).length,
    inactiveSections: sections.filter(s => !s.is_active).length,
    sectionsWithContent: sections.filter(s => s.elements && s.elements.length > 0).length,
    lastUpdated: sections.length > 0 
      ? Math.max(...sections.map(s => new Date(s.updated_at || s.created_at || '').getTime()))
        .toString()
      : undefined
  };
  
  return stats;
};

// Hook لحذف عنصر من قسم
export const useDeleteAboutSectionElement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (elementId: string) => {
      const { error } = await supabase
        .from('admin_content_elements')
        .delete()
        .eq('id', elementId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
      queryClient.invalidateQueries({ queryKey: ['about-section-elements'] });
      
      toast({
        title: 'تم حذف العنصر بنجاح'
      });
    },
    onError: (error: any) => {
      console.error('Error deleting element:', error);
      toast({
        title: 'خطأ في الحذف',
        description: 'حدث خطأ أثناء حذف العنصر',
        variant: 'destructive'
      });
    }
  });
};

// Hook للحصول على المحتوى المنشور للعرض العام
export const usePublicAboutSection = (pageKey: string) => {
  return useQuery({
    queryKey: ['public-about-section', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_content_pages')
        .select(`
          *,
          elements:admin_content_elements!inner(*)
        `)
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .eq('elements.status', 'published')
        .eq('elements.is_active', true)
        .single();
      
      if (error) throw error;
      return data as AboutSection;
    },
    enabled: !!pageKey,
  });
};