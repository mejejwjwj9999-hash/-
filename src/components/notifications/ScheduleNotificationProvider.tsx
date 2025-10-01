import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface ScheduleNotificationProviderProps {
  children: React.ReactNode;
}

export const ScheduleNotificationProvider: React.FC<ScheduleNotificationProviderProps> = ({ children }) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Auto-create notifications for new courses and schedules
  useEffect(() => {
    if (!profile?.id) return;

    const handleNewCourse = async (courseData: any) => {
      // Check if course is relevant to student's program
      if (courseData.program_id === profile.program_id && 
          courseData.department_id === profile.department_id &&
          courseData.academic_year === profile.academic_year &&
          courseData.semester === profile.semester) {
        
        // Create notification for new course
        const { error } = await supabase
          .from('notifications')
          .insert([{
            student_id: profile.id,
            title: 'مقرر جديد متاح',
            message: `تم إضافة مقرر جديد: ${courseData.course_name_ar} (${courseData.course_code})`,
            type: 'course_added',
            priority: 'high'
          }]);

        if (!error) {
          toast({
            title: 'مقرر جديد متاح!',
            description: `${courseData.course_name_ar} - ${courseData.course_code}`,
            duration: 8000,
          });
        }
      }
    };

    const handleNewSchedule = async (scheduleData: any) => {
      // Check if student is enrolled in this course
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('course_id')
        .eq('student_id', profile.id)
        .eq('course_id', scheduleData.course_id)
        .eq('status', 'enrolled');

      if (enrollments && enrollments.length > 0) {
        // Get course information
        const { data: course } = await supabase
          .from('courses')
          .select('course_name_ar, course_code')
          .eq('id', scheduleData.course_id)
          .single();

        if (course) {
          // Create notification for new schedule
          const { error } = await supabase
            .from('notifications')
            .insert([{
              student_id: profile.id,
              title: 'جدول دراسي جديد',
              message: `تم إضافة جدول للمقرر: ${course.course_name_ar} في يوم ${getDayName(scheduleData.day_of_week)} من ${scheduleData.start_time} إلى ${scheduleData.end_time}`,
              type: 'schedule_updated',
              priority: 'normal'
            }]);

          if (!error) {
            toast({
              title: 'تحديث الجدول الدراسي',
              description: `${course.course_name_ar} - ${getDayName(scheduleData.day_of_week)}`,
              duration: 6000,
            });
          }
        }
      }
    };

    const coursesChannel = supabase
      .channel('new-courses-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'courses',
        },
        (payload) => {
          handleNewCourse(payload.new);
        }
      )
      .subscribe();

    const schedulesChannel = supabase
      .channel('new-schedules-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'class_schedule',
        },
        (payload) => {
          handleNewSchedule(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(schedulesChannel);
    };
  }, [profile?.id, toast]);

  const getDayName = (dayNumber: number): string => {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[dayNumber] || 'غير محدد';
  };

  return <>{children}</>;
};

export default ScheduleNotificationProvider;