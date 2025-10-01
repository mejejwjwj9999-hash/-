import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ContentElement {
  id: string;
  page_id: string;
  element_key: string;
  element_type: 'text' | 'rich_text' | 'image' | 'link' | 'button' | 'icon' | 'stat' | 'layout' | 'background' | 'animation';
  content_ar?: string;
  content_en?: string;
  metadata?: any;
  status: 'draft' | 'published' | 'archived';
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ContentPage {
  id: string;
  page_key: string;
  page_name_ar: string;
  page_name_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
  display_order: number;
}

// Hook للحصول على جميع الصفحات
export const useContentPages = () => {
  return useQuery({
    queryKey: ['content-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_content_pages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as ContentPage[];
    },
  });
};

// Hook للحصول على عناصر صفحة معينة
export const useContentElements = (pageId?: string) => {
  return useQuery({
    queryKey: ['content-elements', pageId],
    queryFn: async () => {
      if (!pageId) return [];
      
      const { data, error } = await supabase
        .from('admin_content_elements')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as ContentElement[];
    },
    enabled: !!pageId,
  });
};

// Hook للحصول على عنصر محدد
export const useContentElement = (pageKey: string, elementKey: string) => {
  return useQuery({
    queryKey: ['content-element', pageKey, elementKey],
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
        .eq('element_key', elementKey)
        .maybeSingle();
      
      if (error) throw error;
      return data as ContentElement | null;
    },
    enabled: !!pageKey && !!elementKey,
  });
};

// Hook للحصول على المحتوى المنشور للعامة
export const usePublicContent = (pageKey: string, elementKey: string) => {
  return useQuery({
    queryKey: ['public-content', pageKey, elementKey],
    queryFn: async () => {
      const { data: pageData, error: pageError } = await supabase
        .from('admin_content_pages')
        .select('id')
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .single();
      
      if (pageError) throw pageError;
      
      const { data, error } = await supabase
        .from('admin_content_elements')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('element_key', elementKey)
        .eq('status', 'published')
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as ContentElement | null;
    },
    enabled: !!pageKey && !!elementKey,
  });
};

// Hook لإنشاء أو تحديث عنصر المحتوى
export const useUpdateContentElement = () => {
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
      elementType: ContentElement['element_type'];
      contentAr?: string;
      contentEn?: string;
      metadata?: any;
      status?: ContentElement['status'];
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
        .select('id')
        .eq('page_id', pageData.id)
        .eq('element_key', elementKey)
        .maybeSingle();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Map unsupported element types to a DB-safe type and persist original in metadata
      const allowedTypes = new Set(['text', 'rich_text', 'image', 'link', 'button']);
      const dbElementType = allowedTypes.has(elementType as any) ? elementType : 'text';
      const mergedMetadata = {
        ...(metadata || {}),
        // Keep the original type so the UI can render correctly
        elementType: elementType,
      };

      const elementData = {
        page_id: pageData.id,
        element_key: elementKey,
        element_type: dbElementType,
        content_ar: contentAr,
        content_en: contentEn,
        metadata: mergedMetadata,
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
      // Invalidate all related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['content-elements'] });
      queryClient.invalidateQueries({ queryKey: ['content-element', variables.pageKey, variables.elementKey] });
      queryClient.invalidateQueries({ queryKey: ['public-content', variables.pageKey, variables.elementKey] });
      queryClient.invalidateQueries({ queryKey: ['dynamic-content', variables.pageKey, variables.elementKey] });
      queryClient.invalidateQueries({ queryKey: ['dynamic-content'] });
      
      toast({
        title: 'تم حفظ المحتوى بنجاح',
        description: `تم ${data.status === 'published' ? 'نشر' : 'حفظ'} المحتوى وسيظهر في الصفحة فوراً`
      });
    },
    onError: (error: any) => {
      console.error('Error updating content:', error);
      
      let errorTitle = 'خطأ في حفظ المحتوى';
      let errorDescription = 'حدث خطأ أثناء حفظ المحتوى';
      
      // معالجة أنواع مختلفة من الأخطاء
      if (error?.message) {
        if (error.message.includes('permission')) {
          errorTitle = 'خطأ في الصلاحيات';
          errorDescription = 'ليس لديك صلاحية لحفظ هذا المحتوى';
        } else if (error.message.includes('network')) {
          errorTitle = 'خطأ في الاتصال';
          errorDescription = 'تعذر الاتصال بالخادم، تحقق من اتصال الإنترنت';
        } else if (error.message.includes('validation')) {
          errorTitle = 'خطأ في البيانات';
          errorDescription = 'البيانات المدخلة غير صحيحة';
        } else if (error.message.includes('duplicate')) {
          errorTitle = 'عنصر مكرر';
          errorDescription = 'هذا العنصر موجود بالفعل';
        } else {
          errorDescription = `خطأ: ${error.message}`;
        }
      } else if (error?.code) {
        switch (error.code) {
          case 'PGRST116':
            errorTitle = 'لم يتم العثور على السجل';
            errorDescription = 'العنصر المطلوب غير موجود في قاعدة البيانات';
            break;
          case 'PGRST301':
            errorTitle = 'خطأ في الصلاحيات';
            errorDescription = 'ليس لديك صلاحية لتنفيذ هذا الإجراء';
            break;
          case '23505':
            errorTitle = 'بيانات مكررة';
            errorDescription = 'العنصر موجود بالفعل بنفس المفتاح';
            break;
          case '23502':
            errorTitle = 'حقول مطلوبة فارغة';
            errorDescription = 'يرجى ملء جميع الحقول المطلوبة';
            break;
          default:
            errorDescription = `رمز الخطأ: ${error.code}`;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive'
      });
    }
  });
};

// Hook لحذف عنصر المحتوى
export const useDeleteContentElement = () => {
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
      queryClient.invalidateQueries({ queryKey: ['content-elements'] });
      queryClient.invalidateQueries({ queryKey: ['content-element'] });
      queryClient.invalidateQueries({ queryKey: ['public-content'] });
      
      toast({
        title: 'تم حذف المحتوى بنجاح'
      });
    },
    onError: (error: any) => {
      console.error('Error deleting content:', error);
      
      let errorTitle = 'خطأ في حذف المحتوى';
      let errorDescription = 'حدث خطأ أثناء حذف المحتوى';
      
      if (error?.message) {
        if (error.message.includes('permission')) {
          errorTitle = 'خطأ في الصلاحيات';
          errorDescription = 'ليس لديك صلاحية لحذف هذا المحتوى';
        } else if (error.message.includes('foreign key')) {
          errorTitle = 'لا يمكن الحذف';
          errorDescription = 'هذا المحتوى مرتبط بعناصر أخرى ولا يمكن حذفه';
        } else {
          errorDescription = `خطأ: ${error.message}`;
        }
      } else if (error?.code) {
        switch (error.code) {
          case 'PGRST116':
            errorTitle = 'لم يتم العثور على السجل';
            errorDescription = 'العنصر المطلوب حذفه غير موجود';
            break;
          case 'PGRST301':
            errorTitle = 'خطأ في الصلاحيات';
            errorDescription = 'ليس لديك صلاحية لحذف هذا المحتوى';
            break;
          case '23503':
            errorTitle = 'لا يمكن الحذف';
            errorDescription = 'هذا المحتوى مرتبط بعناصر أخرى ولا يمكن حذفه';
            break;
          default:
            errorDescription = `رمز الخطأ: ${error.code}`;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive'
      });
    }
  });
};