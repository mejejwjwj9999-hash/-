import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DigitalLibraryResource {
  id: string;
  title_ar: string;
  title_en?: string;
  author_ar?: string;
  author_en?: string;
  description_ar?: string;
  description_en?: string;
  resource_type: 'book' | 'journal' | 'thesis' | 'database' | 'article' | 'document';
  category: 'pharmacy' | 'nursing' | 'it' | 'business' | 'midwifery' | 'general';
  subject_area?: string;
  language: 'ar' | 'en' | 'both';
  publication_year?: number;
  isbn?: string;
  doi?: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  thumbnail_url?: string;
  media_id?: string;
  access_level: 'public' | 'students' | 'faculty' | 'admin';
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  views_count?: number;
  downloads_count?: number;
  tags: string[];
  metadata: Record<string, any>;
  published_at?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceFilters {
  category?: string;
  resource_type?: string;
  language?: string;
  access_level?: string;
  status?: string;
  is_featured?: boolean;
  search?: string;
}

export const useDigitalLibraryResources = (filters?: ResourceFilters) => {
  return useQuery({
    queryKey: ['digital-library-resources', filters],
    queryFn: async () => {
      console.log('useDigitalLibraryResources - filters:', filters);
      
      let query = supabase
        .from('admin_digital_library_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
      }
      if (filters?.language) {
        query = query.eq('language', filters.language);
      }
      if (filters?.access_level) {
        query = query.eq('access_level', filters.access_level);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status as 'draft' | 'published' | 'archived');
      }
      if (filters?.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters?.search) {
        query = query.or(`title_ar.ilike.%${filters.search}%,title_en.ilike.%${filters.search}%,author_ar.ilike.%${filters.search}%,author_en.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      console.log('useDigitalLibraryResources - data:', data);
      console.log('useDigitalLibraryResources - error:', error);
      if (error) throw error;
      return data as DigitalLibraryResource[];
    },
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resource: Omit<DigitalLibraryResource, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'downloads_count'>) => {
      const { data, error } = await supabase
        .from('admin_digital_library_resources')
        .insert([{ ...resource, metadata: resource.metadata || {} }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-library-resources'] });
      toast.success('تم إنشاء المصدر بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في إنشاء المصدر');
      console.error('Create resource error:', error);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DigitalLibraryResource> & { id: string }) => {
      const { data, error } = await supabase
        .from('admin_digital_library_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-library-resources'] });
      toast.success('تم تحديث المصدر بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في تحديث المصدر');
      console.error('Update resource error:', error);
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_digital_library_resources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digital-library-resources'] });
      toast.success('تم حذف المصدر بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في حذف المصدر');
      console.error('Delete resource error:', error);
    },
  });
};

export const useIncrementCounter = () => {
  return useMutation({
    mutationFn: async ({ resourceId, counterType }: { resourceId: string; counterType: 'views' | 'downloads' }) => {
      const { error } = await supabase.rpc('increment_resource_counter', {
        resource_id: resourceId,
        counter_type: counterType
      });
      
      if (error) throw error;
    },
    onError: (error) => {
      console.error('Increment counter error:', error);
    },
  });
};

export const useToggleResourceStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'draft' | 'published' | 'archived' }) => {
      const updates: any = { status };
      if (status === 'published') {
        updates.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('admin_digital_library_resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['digital-library-resources'] });
      const statusText = data.status === 'published' ? 'نشر' : data.status === 'draft' ? 'حفظ كمسودة' : 'أرشفة';
      toast.success(`تم ${statusText} المصدر بنجاح`);
    },
    onError: (error) => {
      toast.error('فشل في تغيير حالة المصدر');
      console.error('Toggle status error:', error);
    },
  });
};