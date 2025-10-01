import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GradeDetail {
  id: string;
  teacher_course_id: string;
  student_id: string;
  assessment_type: 'midterm' | 'final' | 'quiz' | 'assignment' | 'participation' | 'project';
  assessment_title: string;
  max_score: number;
  score?: number;
  weight: number;
  assessment_date?: string;
  feedback?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  student_profiles?: {
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const useTeacherGrades = (teacherCourseId: string) => {
  return useQuery({
    queryKey: ['teacher-grades', teacherCourseId],
    queryFn: async () => {
      if (!teacherCourseId) return [];

      const { data, error } = await supabase
        .from('grade_details')
        .select(`
          *,
          student_profiles:student_id (
            id,
            student_id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('teacher_course_id', teacherCourseId)
        .order('assessment_date', { ascending: false })
        .order('student_profiles(first_name)', { ascending: true });

      if (error) throw error;
      return data as GradeDetail[];
    },
    enabled: !!teacherCourseId,
    staleTime: 1000 * 60 * 2, // دقيقتان
    retry: 2,
  });
};

export const useCreateGrade = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (gradeData: Omit<GradeDetail, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('grade_details')
        .insert([gradeData])
        .select(`
          *,
          student_profiles:student_id (
            id,
            student_id,
            first_name,
            last_name,
            email
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['teacher-grades', variables.teacher_course_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['grade-statistics', variables.teacher_course_id] 
      });
      toast({
        title: 'تم حفظ الدرجة',
        description: 'تم إضافة الدرجة بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في إضافة الدرجة:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ الدرجة',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GradeDetail> }) => {
      const { data, error } = await supabase
        .from('grade_details')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          student_profiles:student_id (
            id,
            student_id,
            first_name,
            last_name,
            email
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['teacher-grades', data.teacher_course_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['grade-statistics', data.teacher_course_id] 
      });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الدرجة بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في تحديث الدرجة:', error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث الدرجة',
        variant: 'destructive',
      });
    },
  });
};

export const useBulkCreateGrades = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (gradesData: Omit<GradeDetail, 'id' | 'created_at' | 'updated_at'>[]) => {
      const { data, error } = await supabase
        .from('grade_details')
        .insert(gradesData)
        .select(`
          *,
          student_profiles:student_id (
            id,
            student_id,
            first_name,
            last_name,
            email
          )
        `);

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.length > 0) {
        queryClient.invalidateQueries({ 
          queryKey: ['teacher-grades', variables[0].teacher_course_id] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['grade-statistics', variables[0].teacher_course_id] 
        });
      }
      toast({
        title: 'تم حفظ الدرجات',
        description: `تم إضافة ${variables.length} درجة بنجاح`,
      });
    },
    onError: (error) => {
      console.error('خطأ في إضافة الدرجات:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ الدرجات',
        variant: 'destructive',
      });
    },
  });
};

export const useGradeStatistics = (teacherCourseId: string) => {
  return useQuery({
    queryKey: ['grade-statistics', teacherCourseId],
    queryFn: async () => {
      if (!teacherCourseId) return null;

      const { data, error } = await supabase
        .from('grade_details')
        .select('score, max_score, assessment_type')
        .eq('teacher_course_id', teacherCourseId)
        .not('score', 'is', null);

      if (error) throw error;

      const validGrades = data.filter(g => g.score !== null);
      
      if (validGrades.length === 0) {
        return {
          totalAssessments: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          passRate: 0,
          assessmentTypes: {}
        };
      }

      const scores = validGrades.map(g => (g.score! / g.max_score) * 100);
      const assessmentTypes = validGrades.reduce((acc, g) => {
        acc[g.assessment_type] = (acc[g.assessment_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalAssessments: validGrades.length,
        averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
        highestScore: Math.round(Math.max(...scores)),
        lowestScore: Math.round(Math.min(...scores)),
        passRate: Math.round((scores.filter(s => s >= 60).length / scores.length) * 100),
        assessmentTypes
      };
    },
    enabled: !!teacherCourseId,
    staleTime: 1000 * 60 * 2, // دقيقتان
    retry: 2,
  });
};