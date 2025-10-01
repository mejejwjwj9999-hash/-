import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AcademicDepartment {
  id: string;
  department_key: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  icon_name: string;
  icon_color: string;
  background_color: string;
  featured_image?: string;
  head_of_department_ar?: string;
  head_of_department_en?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

// Hook لجلب جميع الأقسام
export const useAcademicDepartments = () => {
  return useQuery({
    queryKey: ['academic-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_departments')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }
      return data as AcademicDepartment[];
    },
    staleTime: 1000 * 60, // 1 دقيقة بدلاً من 5
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Hook لجلب الأقسام النشطة فقط
export const useActiveAcademicDepartments = () => {
  return useQuery({
    queryKey: ['active-academic-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_departments')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AcademicDepartment[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لجلب قسم واحد
export const useAcademicDepartment = (departmentKey: string) => {
  return useQuery({
    queryKey: ['academic-department', departmentKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_departments')
        .select('*')
        .eq('department_key', departmentKey)
        .maybeSingle();
      
      if (error) throw error;
      return data as AcademicDepartment | null;
    },
    enabled: !!departmentKey,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لإنشاء قسم جديد
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (department: Omit<AcademicDepartment, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating department:', department);
      const { data, error } = await supabase
        .from('academic_departments')
        .insert(department as any)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating department:', error);
        throw error;
      }
      console.log('Department created successfully:', data);
      return data;
    },
    onSuccess: async (data) => {
      // إلغاء cache وإعادة جلب البيانات فوراً
      await queryClient.invalidateQueries({ queryKey: ['academic-departments'] });
      await queryClient.invalidateQueries({ queryKey: ['active-academic-departments'] });
      
      // إعادة جلب البيانات فوراً
      await queryClient.refetchQueries({ queryKey: ['academic-departments'] });
      
      toast({
        title: "✅ تم إنشاء القسم بنجاح",
        description: `تم إضافة ${data.name_ar} بنجاح`,
      });
    },
    onError: (error: any) => {
      console.error('Error creating department:', error);
      toast({
        title: "❌ خطأ في إنشاء القسم",
        description: error?.message || "حدث خطأ أثناء إنشاء القسم الأكاديمي",
        variant: "destructive",
      });
    },
  });
};

// Hook لتحديث قسم
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AcademicDepartment> }) => {
      console.log('Updating department:', id, updates);
      const { data, error } = await supabase
        .from('academic_departments')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating department:', error);
        throw error;
      }
      console.log('Department updated successfully:', data);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['academic-departments'] });
      await queryClient.invalidateQueries({ queryKey: ['active-academic-departments'] });
      await queryClient.refetchQueries({ queryKey: ['academic-departments'] });
      
      toast({
        title: "✅ تم تحديث القسم بنجاح",
        description: "تم حفظ التغييرات على القسم الأكاديمي",
      });
    },
    onError: (error: any) => {
      console.error('Error updating department:', error);
      toast({
        title: "❌ خطأ في تحديث القسم",
        description: error?.message || "حدث خطأ أثناء تحديث القسم الأكاديمي",
        variant: "destructive",
      });
    },
  });
};

// Hook لحذف قسم
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academic_departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-departments'] });
      queryClient.invalidateQueries({ queryKey: ['active-academic-departments'] });
      toast({
        title: "تم حذف القسم بنجاح",
        description: "تم حذف القسم الأكاديمي نهائياً",
      });
    },
    onError: (error) => {
      console.error('Error deleting department:', error);
      toast({
        title: "خطأ في حذف القسم",
        description: "حدث خطأ أثناء حذف القسم الأكاديمي",
        variant: "destructive",
      });
    },
  });
};
