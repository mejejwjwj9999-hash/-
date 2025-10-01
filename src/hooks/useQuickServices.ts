import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface QuickService {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  icon_name: string;
  icon_color: string;
  background_color: string;
  url?: string;
  category_id?: string;
  display_order: number;
  is_active: boolean;
  is_external: boolean;
  requires_auth: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
  service_categories?: {
    id: string;
    name_ar: string;
    name_en?: string;
    icon?: string;
    color: string;
  };
}

export interface ServiceCategory {
  id: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Hook لجلب الخدمات السريعة المنشورة
export const useQuickServices = () => {
  return useQuery({
    queryKey: ['quick-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_services')
        .select(`
          *,
          service_categories (
            id,
            name_ar,
            name_en,
            icon,
            color
          )
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as QuickService[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لجلب تصنيفات الخدمات
export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as ServiceCategory[];
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Hook لإدارة الخدمات (للمديرين)
export const useManageServices = () => {
  return useQuery({
    queryKey: ['admin-quick-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_services')
        .select(`
          *,
          service_categories (
            id,
            name_ar,
            name_en,
            icon,
            color
          )
        `)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as QuickService[];
    },
  });
};

// Hook لإدارة التصنيفات (للمديرين)
export const useManageCategories = () => {
  return useQuery({
    queryKey: ['admin-service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as ServiceCategory[];
    },
  });
};

// Hook لإنشاء خدمة جديدة
export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (service: Omit<QuickService, 'id' | 'created_at' | 'updated_at' | 'service_categories'>) => {
      const { data, error } = await supabase
        .from('quick_services')
        .insert({
          ...service,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quick-services'] });
      toast({
        title: "تم إنشاء الخدمة بنجاح",
        description: "تم إضافة الخدمة السريعة الجديدة",
      });
    },
    onError: (error) => {
      console.error('Error creating service:', error);
      toast({
        title: "خطأ في إنشاء الخدمة",
        description: "حدث خطأ أثناء إنشاء الخدمة السريعة",
        variant: "destructive",
      });
    },
  });
};

// Hook لتحديث خدمة
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<QuickService> }) => {
      const { data, error } = await supabase
        .from('quick_services')
        .update({
          ...updates,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quick-services'] });
      toast({
        title: "تم تحديث الخدمة بنجاح",
        description: "تم حفظ التغييرات على الخدمة السريعة",
      });
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      toast({
        title: "خطأ في تحديث الخدمة",
        description: "حدث خطأ أثناء تحديث الخدمة السريعة",
        variant: "destructive",
      });
    },
  });
};

// Hook لحذف خدمة
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quick_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quick-services'] });
      toast({
        title: "تم حذف الخدمة بنجاح",
        description: "تم حذف الخدمة السريعة نهائياً",
      });
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
      toast({
        title: "خطأ في حذف الخدمة",
        description: "حدث خطأ أثناء حذف الخدمة السريعة",
        variant: "destructive",
      });
    },
  });
};

// Hook لإنشاء تصنيف جديد
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<ServiceCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('service_categories')
        .insert({
          ...category,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-service-categories'] });
      toast({
        title: "تم إنشاء التصنيف بنجاح",
        description: "تم إضافة تصنيف الخدمات الجديد",
      });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      toast({
        title: "خطأ في إنشاء التصنيف",
        description: "حدث خطأ أثناء إنشاء تصنيف الخدمات",
        variant: "destructive",
      });
    },
  });
};

// Hook لتحديث تصنيف
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ServiceCategory> }) => {
      const { data, error } = await supabase
        .from('service_categories')
        .update({
          ...updates,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-service-categories'] });
      toast({
        title: "تم تحديث التصنيف بنجاح",
        description: "تم حفظ التغييرات على تصنيف الخدمات",
      });
    },
  });
};

// Hook لحذف تصنيف
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-service-categories'] });
      toast({
        title: "تم حذف التصنيف بنجاح",
        description: "تم حذف تصنيف الخدمات نهائياً",
      });
    },
  });
};