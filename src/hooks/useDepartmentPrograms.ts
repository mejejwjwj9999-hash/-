import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook لجلب البرامج التابعة لقسم معين
export const useDepartmentPrograms = (departmentId?: string) => {
  return useQuery({
    queryKey: ['department-programs', departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      
      const { data, error } = await supabase
        .from('dynamic_academic_programs')
        .select('*')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لإحصاءات الأقسام والبرامج
export const useDepartmentStatistics = () => {
  return useQuery({
    queryKey: ['department-statistics'],
    queryFn: async () => {
      // جلب عدد الأقسام
      const { count: departmentsCount, error: deptError } = await supabase
        .from('academic_departments')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (deptError) throw deptError;

      // جلب عدد البرامج
      const { count: programsCount, error: progError } = await supabase
        .from('dynamic_academic_programs')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      if (progError) throw progError;

      // جلب البرامج مع تفاصيل الأقسام
      const { data: programsByDept, error: byDeptError } = await supabase
        .from('dynamic_academic_programs')
        .select(`
          id,
          title_ar,
          department_id,
          academic_departments (
            id,
            name_ar
          )
        `)
        .eq('is_active', true);
      
      if (byDeptError) throw byDeptError;

      // حساب عدد البرامج لكل قسم
      const programsByDepartment = programsByDept?.reduce((acc: any, prog: any) => {
        const deptId = prog.department_id;
        if (deptId) {
          acc[deptId] = (acc[deptId] || 0) + 1;
        }
        return acc;
      }, {});

      return {
        totalDepartments: departmentsCount || 0,
        totalPrograms: programsCount || 0,
        programsByDepartment: programsByDepartment || {}
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
