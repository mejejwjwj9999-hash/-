import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Assignment, AssignmentSubmission } from '@/types/course';

// Hook للطلاب لجلب الواجبات
export const useStudentAssignments = (courseId?: string) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['student-assignments', profile?.id, courseId],
    queryFn: async (): Promise<Assignment[]> => {
      if (!profile?.id) return [];

      try {
        // أولاً، نحصل على المقررات المسجل فيها الطالب
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('student_enrollments')
          .select('course_id')
          .eq('student_id', profile.id)
          .eq('status', 'enrolled');

        if (enrollmentError) {
          console.error('خطأ في جلب تسجيلات الطالب:', enrollmentError);
          throw enrollmentError;
        }

        const enrolledCourseIds = enrollments?.map(e => e.course_id) || [];
        
        if (enrolledCourseIds.length === 0) {
          console.log('الطالب غير مسجل في أي مقررات');
          return [];
        }

        // ثم نحصل على الواجبات للمقررات المسجل فيها
        let query = supabase
          .from('assignments')
          .select(`
            *,
            courses:course_id (
              course_name_ar,
              course_name_en,
              course_code
            ),
            assignment_submissions!left (
              id,
              status,
              grade,
              submitted_at,
              file_path,
              file_name,
              feedback,
              student_id
            )
          `)
          .in('course_id', enrolledCourseIds);

        if (courseId) {
          query = query.eq('course_id', courseId);
        }

        query = query.order('due_date', { ascending: true });

        const { data, error } = await query;

        if (error) {
          console.error('خطأ في جلب واجبات الطالب:', error);
          throw error;
        }

        // تصفية التسليمات لهذا الطالب فقط
        const assignmentsWithFilteredSubmissions = (data || []).map(assignment => ({
          ...assignment,
          assignment_submissions: assignment.assignment_submissions?.filter(
            (sub: any) => sub.student_id === profile.id
          ) || []
        }));

        console.log('تم جلب واجبات الطالب:', assignmentsWithFilteredSubmissions.length);
        return assignmentsWithFilteredSubmissions as Assignment[];

      } catch (error) {
        console.error('خطأ في جلب واجبات الطالب:', error);
        throw error;
      }
    },
    enabled: !!profile?.id,
    staleTime: 2 * 60 * 1000, // دقيقتان
    retry: 2,
  });
};

// Hook للمدرسين/المسؤولين لإدارة الواجبات
export const useAdminAssignments = (courseId?: string) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['admin-assignments', courseId],
    queryFn: async (): Promise<Assignment[]> => {
      try {
        let query = supabase
          .from('assignments')
          .select(`
            *,
            courses:course_id (
              course_name_ar,
              course_name_en,
              course_code
            ),
            assignment_submissions (
              id,
              status,
              submitted_at,
              student_id
            )
          `);

        if (courseId) {
          query = query.eq('course_id', courseId);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error('خطأ في جلب واجبات المسؤول:', error);
          throw error;
        }

        // إضافة إحصائيات التسليمات لكل واجب
        const assignmentsWithStats = (data || []).map(assignment => ({
          ...assignment,
          submissionCount: assignment.assignment_submissions?.length || 0,
          gradedCount: assignment.assignment_submissions?.filter((s: any) => s.status === 'graded').length || 0,
          pendingCount: assignment.assignment_submissions?.filter((s: any) => s.status === 'submitted').length || 0
        }));

        return assignmentsWithStats as any;

      } catch (error) {
        console.error('خطأ في جلب واجبات المسؤول:', error);
        throw error;
      }
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 دقائق
    retry: 2,
  });
};

// Hook لجلب تسليمات واجب معين
export const useAssignmentSubmissions = (assignmentId: string) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['assignment-submissions', assignmentId],
    queryFn: async (): Promise<AssignmentSubmission[]> => {
      if (!assignmentId) return [];

      try {
        console.log('جاري جلب تسليمات الواجب:', assignmentId);
        
        // جلب التسليمات أولاً
        const { data: submissions, error: submissionsError } = await supabase
          .from('assignment_submissions')
          .select('*')
          .eq('assignment_id', assignmentId)
          .order('submitted_at', { ascending: false });

        if (submissionsError) {
          console.error('خطأ في جلب تسليمات الواجب:', submissionsError);
          throw submissionsError;
        }

        if (!submissions || submissions.length === 0) {
          console.log('لا توجد تسليمات لهذا الواجب');
          return [];
        }

        // استخراج معرفات الطلاب
        const studentIds = [...new Set(submissions.map(s => s.student_id))];

        // جلب بيانات الطلاب
        const { data: students, error: studentsError } = await supabase
          .from('student_profiles')
          .select('id, user_id, student_id, first_name, last_name, email, phone')
          .in('id', studentIds);

        if (studentsError) {
          console.error('خطأ في جلب بيانات الطلاب:', studentsError);
          // لا نتوقف هنا، بل نستمر بدون بيانات الطلاب
        }

        // دمج البيانات
        const submissionsWithStudents = submissions.map(submission => {
          const studentProfile = students?.find(s => s.id === submission.student_id);
          return {
            ...submission,
            student_profiles: studentProfile || null
          };
        });

        console.log('تم جلب', submissionsWithStudents.length, 'تسليم مع بيانات الطلاب');
        
        return submissionsWithStudents as any[];

      } catch (error) {
        console.error('خطأ في جلب تسليمات الواجب:', error);
        throw error;
      }
    },
    enabled: !!assignmentId && !!profile?.id,
    staleTime: 30 * 1000, // 30 ثانية للتحديث السريع أثناء التطوير
    retry: 2,
  });
};

// Hook لإنشاء واجب جديد (للمسؤولين)
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (assignmentData: {
      course_id: string;
      title: string;
      description?: string;
      instructions?: string;
      due_date: string;
      max_grade?: number;
      submission_type?: string;
    }) => {
      if (!profile?.user_id) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const { data, error } = await supabase
        .from('assignments')
        .insert({
          ...assignmentData,
          created_by: profile.user_id,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('خطأ في إنشاء الواجب:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success('تم إنشاء الواجب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
    },
    onError: (error: any) => {
      console.error('فشل في إنشاء الواجب:', error);
      toast.error('فشل في إنشاء الواجب: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لتحديث واجب (للمسؤولين)
export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      assignmentId, 
      updates 
    }: {
      assignmentId: string;
      updates: Partial<Assignment>;
    }) => {
      const { data, error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) {
        console.error('خطأ في تحديث الواجب:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('تم تحديث الواجب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
    },
    onError: (error: any) => {
      console.error('فشل في تحديث الواجب:', error);
      toast.error('فشل في تحديث الواجب: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لحذف واجب (للمسؤولين)
export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      // حذف التسليمات أولاً
      const { error: submissionsError } = await supabase
        .from('assignment_submissions')
        .delete()
        .eq('assignment_id', assignmentId);

      if (submissionsError) {
        console.error('خطأ في حذف تسليمات الواجب:', submissionsError);
        throw submissionsError;
      }

      // ثم حذف الواجب
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        console.error('خطأ في حذف الواجب:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('تم حذف الواجب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
    },
    onError: (error: any) => {
      console.error('فشل في حذف الواجب:', error);
      toast.error('فشل في حذف الواجب: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لتسليم واجب (للطلاب)
export const useSubmitAssignment = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      submissionText,
      filePath,
      fileName
    }: {
      assignmentId: string;
      submissionText?: string;
      filePath?: string;
      fileName?: string;
    }) => {
      if (!profile?.id) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      console.log('محاولة تسليم واجب:', { assignmentId, studentId: profile.id });

      // التحقق من وجود تسليم سابق
      const { data: existingSubmission, error: checkError } = await supabase
        .from('assignment_submissions')
        .select('id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', profile.id)
        .maybeSingle();

      if (checkError) {
        console.error('خطأ في التحقق من التسليم المسبق:', checkError);
        throw checkError;
      }

      if (existingSubmission) {
        // تحديث التسليم الموجود
        const { data, error } = await supabase
          .from('assignment_submissions')
          .update({
            submission_text: submissionText,
            file_path: filePath,
            file_name: fileName,
            status: 'submitted',
            submitted_at: new Date().toISOString()
          })
          .eq('id', existingSubmission.id)
          .select()
          .single();

        if (error) {
          console.error('خطأ في تحديث التسليم:', error);
          throw error;
        }
        console.log('تم تحديث التسليم بنجاح');
        return data;
      } else {
        // إنشاء تسليم جديد
        const { data, error } = await supabase
          .from('assignment_submissions')
          .insert({
            assignment_id: assignmentId,
            student_id: profile.id,
            submission_text: submissionText,
            file_path: filePath,
            file_name: fileName,
            status: 'submitted'
          })
          .select()
          .single();

        if (error) {
          console.error('خطأ في إنشاء تسليم جديد:', error);
          throw error;
        }
        console.log('تم إنشاء تسليم جديد بنجاح');
        return data;
      }
    },
    onSuccess: (data) => {
      console.log('تم تسليم الواجب بنجاح:', data);
      toast.success('تم تسليم الواجب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
    onError: (error: any) => {
      console.error('فشل في تسليم الواجب:', error);
      toast.error('فشل في تسليم الواجب: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};

// Hook لتقييم تسليم واجب (للمسؤولين)
export const useGradeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      grade,
      feedback
    }: {
      submissionId: string;
      grade: number;
      feedback?: string;
    }) => {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .update({
          grade,
          feedback,
          status: 'graded'
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        console.error('خطأ في تقييم التسليم:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast.success('تم تقييم التسليم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
    },
    onError: (error: any) => {
      console.error('فشل في تقييم التسليم:', error);
      toast.error('فشل في تقييم التسليم: ' + (error.message || 'خطأ غير معروف'));
    },
  });
};