import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { NotificationWithFilters } from '@/types/course';

export interface NotificationFilters {
  category?: 'academic' | 'financial' | 'administrative' | 'general';
  type?: string;
  priority?: 'low' | 'normal' | 'medium' | 'high';
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationSort {
  field: 'created_at' | 'priority' | 'is_read';
  direction: 'asc' | 'desc';
}

// Hook محسن للإشعارات مع نظام التصفية والترتيب المتقدم
export const useNotificationsWithFilters = (
  filters: NotificationFilters = {},
  sort: NotificationSort = { field: 'created_at', direction: 'desc' }
) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications-filtered', profile?.id, filters, sort],
    queryFn: async (): Promise<NotificationWithFilters[]> => {
      if (!profile?.id) return [];

      try {
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('student_id', profile.id);

        // تطبيق الفلاتر
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        
        if (filters.priority) {
          query = query.eq('priority', filters.priority);
        }
        
        if (filters.isRead !== undefined) {
          query = query.eq('is_read', filters.isRead);
        }
        
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom);
        }
        
        if (filters.dateTo) {
          query = query.lte('created_at', filters.dateTo);
        }

        // تطبيق الترتيب
        if (sort.field === 'priority') {
          // ترتيب مخصص للأولوية
          query = query.order('priority', { ascending: sort.direction === 'asc' });
        } else {
          query = query.order(sort.field, { ascending: sort.direction === 'asc' });
        }

        // إضافة ترتيب ثانوي بالتاريخ
        if (sort.field !== 'created_at') {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query.limit(100);

        if (error) {
          console.error('خطأ في جلب الإشعارات:', error);
          throw error;
        }

        return (data || []) as NotificationWithFilters[];

      } catch (error) {
        console.error('خطأ في جلب الإشعارات المفلترة:', error);
        throw error;
      }
    },
    enabled: !!profile?.id,
    staleTime: 2 * 60 * 1000, // دقيقتان
    gcTime: 5 * 60 * 1000, // 5 دقائق
    retry: 3,
    refetchOnWindowFocus: true,
  });

  // إحصائيات محسنة للإشعارات
  const statisticsQuery = useQuery({
    queryKey: ['notifications-statistics', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      try {
        // جلب إحصائيات شاملة في استعلامات محسنة
        const { data: allNotifications, error } = await supabase
          .from('notifications')
          .select('category, type, priority, is_read, created_at')
          .eq('student_id', profile.id);

        if (error) throw error;

        const notifications = allNotifications || [];
        
        return {
          total: notifications.length,
          unread: notifications.filter(n => !n.is_read).length,
          byCategory: {
            academic: notifications.filter(n => n.category === 'academic').length,
            financial: notifications.filter(n => n.category === 'financial').length,
            administrative: notifications.filter(n => n.category === 'administrative').length,
            general: notifications.filter(n => !n.category || n.category === 'general').length,
          },
          byPriority: {
            high: notifications.filter(n => n.priority === 'high').length,
            medium: notifications.filter(n => n.priority === 'medium').length,
            normal: notifications.filter(n => n.priority === 'normal').length,
            low: notifications.filter(n => n.priority === 'low').length,
          },
          unreadByCategory: {
            academic: notifications.filter(n => !n.is_read && n.category === 'academic').length,
            financial: notifications.filter(n => !n.is_read && n.category === 'financial').length,
            administrative: notifications.filter(n => !n.is_read && n.category === 'administrative').length,
            general: notifications.filter(n => !n.is_read && (!n.category || n.category === 'general')).length,
          },
          recent: notifications.filter(n => {
            const notificationDate = new Date(n.created_at);
            const now = new Date();
            const diffDays = (now.getTime() - notificationDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= 7; // آخر أسبوع
          }).length
        };

      } catch (error) {
        console.error('خطأ في جلب إحصائيات الإشعارات:', error);
        throw error;
      }
    },
    enabled: !!profile?.id,
    staleTime: 5 * 60 * 1000, // 5 دقائق
    gcTime: 10 * 60 * 1000,
  });

  // تحديد إشعار واحد كمقروء
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('student_id', profile?.id); // أمان إضافي

      if (error) {
        console.error('خطأ في تحديد الإشعار كمقروء:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // تحديث الكاش بذكاء
      queryClient.invalidateQueries({ queryKey: ['notifications-filtered'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('فشل في تحديث الإشعار:', error);
      toast.error('فشل في تحديث حالة الإشعار');
    },
  });

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsReadMutation = useMutation({
    mutationFn: async (notificationIds?: string[]) => {
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('student_id', profile?.id)
        .eq('is_read', false);

      // إذا تم تحديد إشعارات معينة، قم بتحديثها فقط
      if (notificationIds && notificationIds.length > 0) {
        query = query.in('id', notificationIds);
      }

      const { error } = await query;

      if (error) {
        console.error('خطأ في تحديد الإشعارات كمقروءة:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
      queryClient.invalidateQueries({ queryKey: ['notifications-filtered'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('فشل في تحديث الإشعارات:', error);
      toast.error('فشل في تحديث الإشعارات');
    },
  });

  // حذف إشعار
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('student_id', profile?.id); // أمان إضافي

      if (error) {
        console.error('خطأ في حذف الإشعار:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('تم حذف الإشعار بنجاح');
      queryClient.invalidateQueries({ queryKey: ['notifications-filtered'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('فشل في حذف الإشعار:', error);
      toast.error('فشل في حذف الإشعار');
    },
  });

  return {
    // البيانات الأساسية
    ...query,
    notifications: query.data || [],
    statistics: statisticsQuery.data,
    isLoadingStatistics: statisticsQuery.isLoading,
    
    // العمليات
    markAsRead: markAsReadMutation,
    markAllAsRead: markAllAsReadMutation,
    deleteNotification: deleteNotificationMutation,
    
    // دوال مساعدة
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};

// Hook للاستماع للإشعارات الفورية
export const useRealtimeNotifications = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ['realtime-notifications-channel', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      // إنشاء قناة للاستماع للإشعارات الجديدة
      const channel = supabase
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
            console.log('إشعار جديد:', payload.new);
            
            // تحديث الكاش مع الإشعار الجديد
            queryClient.invalidateQueries({ queryKey: ['notifications-filtered'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-statistics'] });
            
            // عرض toast للإشعار الجديد
            const notification = payload.new as NotificationWithFilters;
            toast(notification.title, {
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
            // تحديث الكاش عند تحديث الإشعارات
            queryClient.invalidateQueries({ queryKey: ['notifications-filtered'] });
            queryClient.invalidateQueries({ queryKey: ['notifications-statistics'] });
          }
        )
        .subscribe();

      return channel;
    },
    enabled: !!profile?.id,
    staleTime: Infinity,
  });

  return {
    connected: !!profile?.id,
  };
};