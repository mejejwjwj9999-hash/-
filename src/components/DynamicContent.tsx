import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { icons } from 'lucide-react';

interface DynamicContentProps {
  pageKey: string;
  elementKey: string;
  fallback?: React.ReactNode;
  language?: 'ar' | 'en';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

interface ContentData {
  id: string;
  page_id: string;
  element_key: string;
  element_type: string;
  content_ar?: string;
  content_en?: string;
  metadata?: any;
  status: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  published_at?: string;
  page_key?: string;
}

export const DynamicContent: React.FC<DynamicContentProps> = ({
  pageKey,
  elementKey,
  fallback = null,
  language = 'ar',
  className = '',
  as: Component = 'div'
}) => {
  
  const { data: content, isLoading } = useQuery<ContentData | null>({
    queryKey: ['dynamic-content', pageKey, elementKey, language],
    queryFn: async (): Promise<ContentData | null> => {
      // جلب المحتوى من قاعدة البيانات
      const { data: pageData, error: pageError } = await supabase
        .from('admin_content_pages')
        .select('id')
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .maybeSingle();

      if (pageError) throw pageError;
      if (!pageData) return null;

      const { data, error } = await supabase
        .from('admin_content_elements')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('element_key', elementKey)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as ContentData | null;
    },
    enabled: !!pageKey && !!elementKey,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return null; // لا نظهر نص التحميل، سيتم التعامل معه على مستوى الصفحة
  }

  if (!content) {
    return fallback ? <Component className={className}>{fallback}</Component> : null;
  }

  const displayContent = language === 'ar' ? content.content_ar : content.content_en;
  const type = (content as any).metadata?.elementType || content.element_type;

  // دالة للتحقق من روابط الصور
  const isImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    // التحقق من امتدادات الصور الشائعة
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
    // التحقق من روابط Supabase storage
    const isSupabaseImage = url.includes('supabase') && url.includes('storage');
    // التحقق من بروتوكولات الصور
    const isImageProtocol = url.startsWith('data:image/') || url.startsWith('blob:');
    
    return imageExtensions.test(url) || isSupabaseImage || isImageProtocol;
  };

  // معالجة الأنواع المختلفة من العناصر
  if (type === 'rich_text') {
    return (
      <Component 
        className={className}
        dangerouslySetInnerHTML={{ __html: displayContent || '' }}
      />
    );
  }
  
  if (type === 'icon' && content.metadata?.iconName) {
    try {
      // تحويل اسم الأيقونة إلى PascalCase مع معالجة أفضل
      const cleanIconName = content.metadata.iconName
        .toLowerCase()
        .split(/[-_\s]/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      const IconComponent = icons[cleanIconName as keyof typeof icons];
      
      if (IconComponent) {
        return (
          <Component className={className}>
            <IconComponent 
              size={content.metadata?.size || 24}
              color={content.metadata?.color || 'currentColor'}
            />
          </Component>
        );
      }
    } catch (error) {
      console.warn('خطأ في تحميل الأيقونة:', content.metadata.iconName, error);
    }
    
    // في حالة عدم وجود الأيقونة، عرض النص
    return <Component className={className}>{displayContent}</Component>;
  }
  
  if (type === 'stat') {
    try {
      // تحويل اسم الأيقونة إلى PascalCase للإحصائيات مع معالجة أفضل
      let StatIconComponent = null;
      
      if (content.metadata?.iconName) {
        const cleanIconName = content.metadata.iconName
          .toLowerCase()
          .split(/[-_\s]/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        
        StatIconComponent = icons[cleanIconName as keyof typeof icons];
      }
      
      return (
        <Component className={className}>
          <div className="text-center">
            {StatIconComponent && (
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-3">
                <StatIconComponent 
                  size={24}
                  className="text-primary-foreground"
                />
              </div>
            )}
            <div className="text-2xl font-bold mb-1 text-foreground">
              {content.metadata?.number || displayContent}
            </div>
            <div className="text-sm text-muted-foreground">
              {content.metadata?.label || ''}
            </div>
          </div>
        </Component>
      );
    } catch (error) {
      console.warn('خطأ في تحميل إحصائية:', content.metadata?.iconName, error);
      
      // في حالة الخطأ، عرض الرقم فقط بدون أيقونة
      return (
        <Component className={className}>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1 text-foreground">
              {content.metadata?.number || displayContent}
            </div>
            <div className="text-sm text-muted-foreground">
              {content.metadata?.label || ''}
            </div>
          </div>
        </Component>
      );
    }
  }

  // معالجة خاصة للصور - إذا كان المحتوى رابط صورة، عرضه كصورة
  if (displayContent && isImageUrl(displayContent.trim())) {
    return (
      <Component className={className}>
        <img 
          src={displayContent.trim()} 
          alt={content.metadata?.alt || 'صورة'} 
          className={`max-w-full h-auto ${content.metadata?.imageClass || ''}`}
          style={{
            width: content.metadata?.width || 'auto',
            height: content.metadata?.height || 'auto',
            objectFit: content.metadata?.objectFit || 'cover'
          }}
          onError={(e) => {
            // في حالة فشل تحميل الصورة، عرض الرابط كنص
            const target = e.target as HTMLImageElement;
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = displayContent;
            }
          }}
        />
      </Component>
    );
  }

  return <Component className={className}>{displayContent}</Component>;
};

// Hook مساعد لاستخدام المحتوى الديناميكي
export const useDynamicContent = (pageKey: string, elementKey: string, language: 'ar' | 'en' = 'ar') => {
  
  return useQuery<ContentData | null>({
    queryKey: ['dynamic-content', pageKey, elementKey, language],
    queryFn: async (): Promise<ContentData | null> => {
      const { data: pageData, error: pageError } = await supabase
        .from('admin_content_pages')
        .select('id')
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .maybeSingle();

      if (pageError) throw pageError;
      if (!pageData) return null;

      const { data, error } = await supabase
        .from('admin_content_elements')
        .select('*')
        .eq('page_id', pageData.id)
        .eq('element_key', elementKey)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as ContentData | null;
    },
    enabled: !!pageKey && !!elementKey,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};