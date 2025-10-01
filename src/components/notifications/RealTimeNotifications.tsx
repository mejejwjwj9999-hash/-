import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Filter
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LoadingSkeleton from '@/components/ui/loading-skeleton';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
  student_id: string;
  action_url?: string;
  expires_at?: string;
}

const RealTimeNotifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // جلب الإشعارات
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id, filter],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'read') {
        query = query.eq('is_read', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user?.id
  });

  // وضع علامة مقروء على الإشعار
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "تم التحديث",
        description: "تم وضع علامة مقروء على الإشعار"
      });
    }
  });

  // حذف الإشعار
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الإشعار بنجاح"
      });
    }
  });

  // وضع علامة مقروء على جميع الإشعارات
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('student_id', user?.id)
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "تم التحديث",
        description: "تم وضع علامة مقروء على جميع الإشعارات"
      });
    }
  });

  // الاستماع للإشعارات الجديدة في الوقت الفعلي
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `student_id=eq.${user.id}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          // عرض إشعار فوري
          toast({
            title: "إشعار جديد",
            description: payload.new.title,
            duration: 5000
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, queryClient, toast]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">عالي</Badge>;
      case 'medium': return <Badge variant="default">متوسط</Badge>;
      case 'low': return <Badge variant="secondary">منخفض</Badge>;
      default: return <Badge variant="outline">عادي</Badge>;
    }
  };

  if (isLoading) {
    return <LoadingSkeleton variant="list" count={5} />;
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="space-y-6">
      {/* رأس الإشعارات */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <BellRing className="h-8 w-8 text-university-blue" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-university-red"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-university-blue">الإشعارات</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
          >
            <Check className="h-4 w-4 ml-2" />
            وضع علامة مقروء على الكل
          </Button>
        </div>
      </div>

      {/* فلاتر الإشعارات */}
      <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
        <TabsList>
          <TabsTrigger value="all">
            <Filter className="h-4 w-4 ml-2" />
            جميع الإشعارات
          </TabsTrigger>
          <TabsTrigger value="unread">
            غير المقروءة ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">
            المقروءة
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {!notifications || notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد إشعارات</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' ? 'جميع إشعاراتك مقروءة' : 'لا توجد إشعارات حتى الآن'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    !notification.is_read 
                      ? 'border-university-blue/30 bg-university-blue/5' 
                      : 'opacity-75'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-university-blue truncate">
                                {notification.title}
                              </h4>
                              {getPriorityBadge(notification.priority || 'medium')}
                              {!notification.is_read && (
                                <Badge variant="outline" className="bg-university-blue text-white">
                                  جديد
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(notification.created_at).toLocaleString('ar')}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotificationMutation.mutate(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeNotifications;
