import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useAssignments = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['assignments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          courses:course_id (
            course_name_ar,
            course_name_en,
            course_code
          ),
          assignment_submissions!inner (
            id,
            status,
            grade,
            submitted_at,
            file_path,
            file_name
          )
        `)
        .eq('assignment_submissions.student_id', profile.id)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });
};

export const useAssignmentsForCourse = (courseId: string) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['assignments', 'course', courseId, profile?.id],
    queryFn: async () => {
      if (!profile?.id || !courseId) return [];
      
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          assignment_submissions (
            id,
            status,
            grade,
            submitted_at,
            file_path,
            file_name
          )
        `)
        .eq('course_id', courseId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id && !!courseId,
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({ assignmentId, submissionText, filePath, fileName }: {
      assignmentId: string;
      submissionText?: string;
      filePath?: string;
      fileName?: string;
    }) => {
      if (!profile?.id) throw new Error('المستخدم غير مسجل');

      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: assignmentId,
          student_id: profile.id,
          submission_text: submissionText,
          file_path: filePath,
          file_name: fileName,
          status: 'submitted'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentData: {
      course_id: string;
      title: string;
      description?: string;
      due_date: string;
      max_grade?: number;
      submission_type?: string;
      instructions?: string;
    }) => {
      const { data, error } = await supabase
        .from('assignments')
        .insert(assignmentData);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};