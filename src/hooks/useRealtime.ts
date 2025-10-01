
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useRealtime = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!profile?.id) return;

    // Subscribe to notifications
    const notificationsChannel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `student_id=eq.${profile.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          const notification = payload.new as any;
          toast({
            title: notification.title,
            description: notification.message,
            duration: 5000,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `student_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    // Subscribe to service requests updates
    const serviceRequestsChannel = supabase
      .channel(`service-requests-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'service_requests',
          filter: `student_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        }
      )
      .subscribe();

    // Subscribe to grades updates
    const gradesChannel = supabase
      .channel(`grades-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grades',
          filter: `student_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['grades'] });
        }
      )
      .subscribe();

    // Subscribe to payments updates
    const paymentsChannel = supabase
      .channel(`payments-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `student_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['payments'] });
        }
      )
      .subscribe();

    // Subscribe to class schedule updates
    const scheduleChannel = supabase
      .channel(`schedule-updates-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_schedule',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['schedule'] });
          toast({
            title: 'تحديث الجدول الدراسي',
            description: 'تم تحديث الجدول الدراسي، يرجى مراجعة جدولك.',
            duration: 6000,
          });
        }
      )
      .subscribe();

    // Subscribe to course updates
    const coursesChannel = supabase
      .channel(`courses-updates-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'courses',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['courses'] });
          toast({
            title: 'مقرر جديد متاح',
            description: 'تم إضافة مقرر جديد، تحقق من المقررات المتاحة.',
            duration: 6000,
          });
        }
      )
      .subscribe();

    // Subscribe to student enrollments updates
    const enrollmentsChannel = supabase
      .channel(`enrollments-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_enrollments',
          filter: `student_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['schedule'] });
          queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(serviceRequestsChannel);
      supabase.removeChannel(gradesChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(scheduleChannel);
      supabase.removeChannel(coursesChannel);
      supabase.removeChannel(enrollmentsChannel);
    };
  }, [profile?.id, queryClient, toast]);
};
