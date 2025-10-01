import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentElement, ContentPage } from './useContentEditor';

export interface SearchFilters {
  searchTerm?: string;
  pageIds?: string[];
  elementTypes?: string[];
  status?: 'all' | 'published' | 'draft' | 'archived';
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  language?: 'ar' | 'en' | 'both';
}

export interface SearchResult extends ContentElement {
  page_name_ar: string;
  page_key: string;
  relevance_score?: number;
}

// Hook للبحث المتقدم في العناصر
export const useAdvancedContentSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['advanced-content-search', filters],
    queryFn: async () => {
      let query = supabase
        .from('admin_content_elements')
        .select(`
          *,
          admin_content_pages!inner(
            id,
            page_key,
            page_name_ar,
            page_name_en
          )
        `)
        .eq('is_active', true);

      // فلترة حسب الصفحات المحددة
      if (filters.pageIds && filters.pageIds.length > 0) {
        query = query.in('page_id', filters.pageIds);
      }

      // فلترة حسب نوع العنصر
      if (filters.elementTypes && filters.elementTypes.length > 0) {
        query = query.in('element_type', filters.elementTypes);
      }

      // فلترة حسب الحالة
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // فلترة حسب التاريخ
      if (filters.dateRange?.from) {
        query = query.gte('updated_at', filters.dateRange.from.toISOString());
      }
      if (filters.dateRange?.to) {
        query = query.lte('updated_at', filters.dateRange.to.toISOString());
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;

      let results = data?.map(item => ({
        ...item,
        page_name_ar: item.admin_content_pages.page_name_ar,
        page_key: item.admin_content_pages.page_key,
      })) as SearchResult[] || [];

      // البحث النصي في المحتوى
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchTerm = filters.searchTerm.toLowerCase();
        results = results.filter(item => {
          const searchableContent = [
            item.element_key,
            item.content_ar,
            item.content_en,
            item.page_name_ar,
            item.page_key
          ].filter(Boolean).join(' ').toLowerCase();

          return searchableContent.includes(searchTerm);
        });

        // حساب نقاط الصلة
        results = results.map(item => {
          let score = 0;
          if (item.element_key.toLowerCase().includes(searchTerm)) score += 10;
          if (item.content_ar?.toLowerCase().includes(searchTerm)) score += 5;
          if (item.content_en?.toLowerCase().includes(searchTerm)) score += 5;
          if (item.page_name_ar.toLowerCase().includes(searchTerm)) score += 3;
          
          return { ...item, relevance_score: score };
        });

        // ترتيب حسب نقاط الصلة
        results.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
      }

      return results;
    },
    enabled: true,
  });
};

// Hook للإحصائيات المتقدمة
export const useContentStatistics = () => {
  return useQuery({
    queryKey: ['content-statistics'],
    queryFn: async () => {
      // إحصائيات العناصر
      const { data: elementsStats, error: elementsError } = await supabase
        .from('admin_content_elements')
        .select('status, element_type, page_id')
        .eq('is_active', true);

      if (elementsError) throw elementsError;

      // إحصائيات الصفحات
      const { data: pagesStats, error: pagesError } = await supabase
        .from('admin_content_pages')
        .select('id, page_name_ar')
        .eq('is_active', true);

      if (pagesError) throw pagesError;

      // تحليل البيانات
      const statusCounts = {
        published: elementsStats?.filter(e => e.status === 'published').length || 0,
        draft: elementsStats?.filter(e => e.status === 'draft').length || 0,
        archived: elementsStats?.filter(e => e.status === 'archived').length || 0,
      };

      const typeCounts = elementsStats?.reduce((acc, element) => {
        acc[element.element_type] = (acc[element.element_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const pageElementCounts = pagesStats?.map(page => ({
        page_id: page.id,
        page_name: page.page_name_ar,
        element_count: elementsStats?.filter(e => e.page_id === page.id).length || 0,
      })) || [];

      return {
        totalElements: elementsStats?.length || 0,
        totalPages: pagesStats?.length || 0,
        statusCounts,
        typeCounts,
        pageElementCounts,
      };
    },
  });
};

// Hook لحفظ عمليات البحث المفضلة
export const useSaveSearchFilter = () => {
  return {
    mutateAsync: async ({ name, filters }: { name: string; filters: SearchFilters }) => {
      // حفظ في localStorage مؤقتاً
      const savedSearches = JSON.parse(localStorage.getItem('saved_searches') || '[]');
      savedSearches.push({ name, filters, created_at: new Date().toISOString() });
      localStorage.setItem('saved_searches', JSON.stringify(savedSearches));
      return { name, filters };
    }
  };
};

// Hook للحصول على عمليات البحث المحفوظة
export const useSavedSearches = () => {
  return {
    data: JSON.parse(localStorage.getItem('saved_searches') || '[]')
  };
};