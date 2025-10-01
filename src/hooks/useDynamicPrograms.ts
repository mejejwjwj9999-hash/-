import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// معلومات عضو هيئة التدريس
export interface FacultyMember {
  id: string;
  name_ar: string;
  name_en?: string;
  position_ar: string;
  position_en?: string;
  qualification_ar: string;
  qualification_en?: string;
  specialization_ar: string;
  specialization_en?: string;
  university_ar?: string;
  university_en?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  bio_ar?: string;
  bio_en?: string;
  research_interests?: string[];
  publications?: string[];
  order: number;
}

// مادة دراسية
export interface CourseSubject {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  credit_hours: number;
  theory_hours: number;
  practical_hours: number;
  prerequisites?: string[];
  description_ar?: string;
  description_en?: string;
  order: number;
}

// سنة دراسية
export interface AcademicYear {
  year_number: number;
  year_name_ar: string;
  year_name_en?: string;
  total_credit_hours: number;
  subjects: CourseSubject[];
}

// شرط قبول
export interface AdmissionRequirement {
  id: string;
  type: 'academic' | 'general';
  requirement_ar: string;
  requirement_en?: string;
  is_mandatory: boolean;
  order: number;
}

// إحصائية البرنامج
export interface ProgramStatistic {
  label_ar: string;
  label_en?: string;
  value: string | number;
  icon?: string;
  order: number;
}

// فرصة مهنية
export interface CareerOpportunity {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  sector?: string;
  order: number;
}

export interface DynamicAcademicProgram {
  id: string;
  program_key: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  summary_ar?: string;
  summary_en?: string;
  icon_name: string;
  icon_color: string;
  background_color: string;
  featured_image?: string;
  gallery: any[];
  duration_years: number;
  credit_hours: number;
  degree_type: string;
  department_ar?: string;
  department_en?: string;
  college_ar?: string;
  college_en?: string;
  admission_requirements_ar?: string;
  admission_requirements_en?: string;
  career_opportunities_ar?: string;
  career_opportunities_en?: string;
  curriculum: any[];
  contact_info: any;
  seo_settings: any;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  has_page: boolean;
  page_template: string;
  metadata: any;
  published_at?: string;
  created_at: string;
  updated_at: string;
  
  // الحقول الجديدة
  faculty_members?: FacultyMember[];
  yearly_curriculum?: AcademicYear[];
  academic_requirements?: AdmissionRequirement[];
  general_requirements?: AdmissionRequirement[];
  program_statistics?: ProgramStatistic[];
  career_opportunities_list?: CareerOpportunity[];
  program_overview_ar?: string;
  program_overview_en?: string;
  student_count?: number;
  program_vision_ar?: string;
  program_vision_en?: string;
  program_mission_ar?: string;
  program_mission_en?: string;
  program_objectives?: any[];
  graduate_specifications?: any[];
  learning_outcomes?: any[];
  benchmark_programs?: any[];
  program_references?: any[];
  job_opportunities?: any[];
}

// Hook لجلب جميع البرامج الأكاديمية المنشورة
export const useDynamicPrograms = () => {
  return useQuery({
    queryKey: ['dynamic-academic-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .select('*')
        .eq('is_active', true)
        .not('published_at', 'is', null)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as unknown as DynamicAcademicProgram[];
    },
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });
};

// Hook لجلب برنامج واحد
export const useDynamicProgram = (programKey: string) => {
  return useQuery({
    queryKey: ['dynamic-academic-program', programKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .select('*')
        .eq('program_key', programKey)
        .eq('is_active', true)
        .not('published_at', 'is', null)
        .maybeSingle();
      
      if (error) throw error;
      return data as unknown as DynamicAcademicProgram;
    },
    enabled: !!programKey,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لإدارة البرامج (للمديرين)
export const useManagePrograms = () => {
  return useQuery({
    queryKey: ['admin-dynamic-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as unknown as DynamicAcademicProgram[];
    },
  });
};

// Hook لإنشاء برنامج جديد
export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (program: Omit<DynamicAcademicProgram, 'id' | 'created_at' | 'updated_at' | 'published_at'>) => {
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .insert({
          ...program,
          created_by: (await supabase.auth.getUser()).data.user?.id
        } as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamic-academic-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dynamic-programs'] });
      toast({
        title: "تم إنشاء البرنامج بنجاح",
        description: "تم إضافة البرنامج الأكاديمي الجديد",
      });
    },
    onError: (error) => {
      console.error('Error creating program:', error);
      toast({
        title: "خطأ في إنشاء البرنامج",
        description: "حدث خطأ أثناء إنشاء البرنامج الأكاديمي",
        variant: "destructive",
      });
    },
  });
};

// Hook لتحديث برنامج
export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DynamicAcademicProgram> }) => {
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .update({
          ...updates,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        } as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamic-academic-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dynamic-programs'] });
      toast({
        title: "تم تحديث البرنامج بنجاح",
        description: "تم حفظ التغييرات على البرنامج الأكاديمي",
      });
    },
    onError: (error) => {
      console.error('Error updating program:', error);
      toast({
        title: "خطأ في تحديث البرنامج",
        description: "حدث خطأ أثناء تحديث البرنامج الأكاديمي",
        variant: "destructive",
      });
    },
  });
};

// Hook لحذف برنامج
export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dynamic_academic_programs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamic-academic-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dynamic-programs'] });
      toast({
        title: "تم حذف البرنامج بنجاح",
        description: "تم حذف البرنامج الأكاديمي نهائياً",
      });
    },
    onError: (error) => {
      console.error('Error deleting program:', error);
      toast({
        title: "خطأ في حذف البرنامج",
        description: "حدث خطأ أثناء حذف البرنامج الأكاديمي",
        variant: "destructive",
      });
    },
  });
};

// Hook لنشر برنامج
export const usePublishProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .update({
          published_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        } as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamic-academic-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dynamic-programs'] });
      toast({
        title: "تم نشر البرنامج بنجاح",
        description: "البرنامج الأكاديمي متاح الآن للعامة",
      });
    },
  });
};

// Hook لإلغاء نشر برنامج
export const useUnpublishProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .update({
          published_at: null,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        } as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamic-academic-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dynamic-programs'] });
      toast({
        title: "تم إلغاء نشر البرنامج",
        description: "البرنامج الأكاديمي لم يعد متاحاً للعامة",
      });
    },
  });
};