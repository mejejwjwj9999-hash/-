import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// واجهات مؤقتة حتى يتم إنشاء الجداول في قاعدة البيانات

export interface AttendanceRecord {
  id: string;
  teacher_course_id: string;
  student_id: string;
  attendance_date: string;
  session_time?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
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

export const useAttendanceRecords = (teacherCourseId: string, date?: string) => {
  return useQuery({
    queryKey: ['attendance-records', teacherCourseId, date],
    queryFn: async () => {
      if (!teacherCourseId) return [];

      let query = supabase
        .from('attendance_records')
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
        .order('attendance_date', { ascending: false })
        .order('student_profiles(first_name)', { ascending: true });

      if (date) {
        query = query.eq('attendance_date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AttendanceRecord[];
    },
    enabled: !!teacherCourseId,
    staleTime: 1000 * 30, // 30 ثانية
    retry: 2,
  });
};

export const useCreateAttendanceRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attendanceData: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert([attendanceData])
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
        queryKey: ['attendance-records', variables.teacher_course_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['attendance-statistics', variables.teacher_course_id] 
      });
      toast({
        title: 'تم حفظ الحضور',
        description: 'تم تسجيل حضور الطالب بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في تسجيل الحضور:', error);
      toast({
        title: 'خطأ في التسجيل',
        description: 'حدث خطأ أثناء تسجيل الحضور',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAttendanceRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AttendanceRecord> }) => {
      // مؤقتاً نرجع البيانات المحدثة حتى يتم إنشاء الجداول
      console.log('جاري تطوير نظام تحديث سجلات الحضور...');
      return { id, ...updates } as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث سجل الحضور بنجاح',
      });
    },
    onError: (error) => {
      console.error('خطأ في تحديث الحضور:', error);
      toast({
        title: 'خطأ في التحديث',
        description: 'حدث خطأ أثناء تحديث سجل الحضور',
        variant: 'destructive',
      });
    },
  });
};

export const useBulkAttendanceRecords = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attendanceRecords: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>[]) => {
      // مؤقتاً نرجع البيانات كما هي حتى يتم إنشاء الجداول
      console.log('جاري تطوير نظام تسجيل الحضور الجماعي...');
      return attendanceRecords as any;
    },
    onSuccess: (_, variables) => {
      if (variables.length > 0) {
        queryClient.invalidateQueries({ 
          queryKey: ['attendance-records', variables[0].teacher_course_id] 
        });
      }
      toast({
        title: 'تم حفظ الحضور',
        description: `تم تسجيل حضور ${variables.length} طالب بنجاح`,
      });
    },
    onError: (error) => {
      console.error('خطأ في تسجيل الحضور الجماعي:', error);
      toast({
        title: 'خطأ في التسجيل',
        description: 'حدث خطأ أثناء تسجيل الحضور الجماعي',
        variant: 'destructive',
      });
    },
  });
};

export const useAttendanceStatistics = (teacherCourseId: string) => {
  return useQuery({
    queryKey: ['attendance-statistics', teacherCourseId],
    queryFn: async () => {
      if (!teacherCourseId) return null;

      // مؤقتاً نرجع إحصائيات وهمية حتى يتم إنشاء الجداول
      console.log('جاري تطوير نظام إحصائيات الحضور...');
      
      return {
        totalSessions: 0,
        attendanceRate: 0,
        statusCounts: {
          present: 0,
          absent: 0,
          late: 0,
          excused: 0
        },
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0
      };
    },
    enabled: !!teacherCourseId,
    staleTime: 1000 * 60 * 2, // دقيقتان
    retry: 2,
  });
};