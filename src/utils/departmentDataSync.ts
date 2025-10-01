import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * مزامنة البرامج مع الأقسام - ربط البرامج بـ department_id بناءً على department_ar
 */
export const syncProgramsWithDepartments = async () => {
  try {
    console.log('بدء مزامنة البرامج مع الأقسام...');

    // جلب جميع الأقسام
    const { data: departments, error: deptError } = await supabase
      .from('academic_departments')
      .select('id, department_key, name_ar');
    
    if (deptError) throw deptError;

    // جلب البرامج التي لا تحتوي على department_id
    const { data: programs, error: progError } = await supabase
      .from('dynamic_academic_programs')
      .select('id, department_ar, department_id')
      .is('department_id', null);
    
    if (progError) throw progError;

    if (!programs || programs.length === 0) {
      console.log('جميع البرامج مربوطة بالأقسام بالفعل');
      return { success: true, updated: 0 };
    }

    // إنشاء خريطة للأقسام
    const departmentMap = new Map(
      departments?.map(d => [d.name_ar, d.id]) || []
    );

    // تحديث البرامج
    let updated = 0;
    for (const program of programs) {
      if (program.department_ar && departmentMap.has(program.department_ar)) {
        const departmentId = departmentMap.get(program.department_ar);
        
        const { error: updateError } = await supabase
          .from('dynamic_academic_programs')
          .update({ department_id: departmentId })
          .eq('id', program.id);
        
        if (updateError) {
          console.error(`خطأ في تحديث البرنامج ${program.id}:`, updateError);
        } else {
          updated++;
        }
      }
    }

    console.log(`تم مزامنة ${updated} برنامج مع الأقسام`);
    
    if (updated > 0) {
      toast({
        title: "تم المزامنة بنجاح",
        description: `تم ربط ${updated} برنامج بالأقسام المناسبة`,
      });
    }

    return { success: true, updated };
  } catch (error) {
    console.error('خطأ في مزامنة البرامج:', error);
    toast({
      title: "خطأ في المزامنة",
      description: "حدث خطأ أثناء مزامنة البرامج مع الأقسام",
      variant: "destructive"
    });
    return { success: false, updated: 0, error };
  }
};

/**
 * التحقق من سلامة البيانات
 */
export const validateDepartmentData = async () => {
  try {
    const { data: programs, error } = await supabase
      .from('dynamic_academic_programs')
      .select(`
        id,
        title_ar,
        department_id,
        department_ar,
        academic_departments (
          id,
          name_ar
        )
      `);
    
    if (error) throw error;

    const orphanedPrograms = programs?.filter(p => 
      !p.department_id || !p.academic_departments
    ) || [];

    return {
      total: programs?.length || 0,
      orphaned: orphanedPrograms.length,
      orphanedPrograms
    };
  } catch (error) {
    console.error('خطأ في التحقق من البيانات:', error);
    return { total: 0, orphaned: 0, orphanedPrograms: [], error };
  }
};
