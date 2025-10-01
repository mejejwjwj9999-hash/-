import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Bell, 
  Check, 
  X, 
  Eye, 
  Trash2, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Star,
  Clock,
  Filter,
  RotateCcw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const EnhancedNotificationSystem: React.FC = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('all');

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', profile?.id, selectedTab],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });

      if (selectedTab === 'unread') {
        query = query.eq('is_read', false);
      } else if (selectedTab === 'important') {
        query = query.eq('priority', 'high');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Mark as read mutation
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
      toast.success('تم تمييز الإشعار كمقروء');
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث الإشعار');
    }
  });

  // Mark as unread mutation
  const markAsUnreadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('تم تمييز الإشعار كغير مقروء');
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث الإشعار');
    }
  });

  // Delete notification mutation
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
      toast.success('تم حذف الإشعار');
    },
    onError: () => {
      toast.error('حدث خطأ في حذف الإشعار');
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('student_id', profile?.id)
        .eq('is_read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('تم تمييز جميع الإشعارات كمقروءة');
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث الإشعارات');
    }
  });

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'high') return AlertCircle;
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600';
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getNotificationBgColor = (type: string, priority: string, isRead: boolean) => {
    const baseColor = isRead ? 'bg-gray-50' : 'bg-white border-r-4';
    if (priority === 'high' && !isRead) return `${baseColor} border-r-red-500`;
    if (!isRead) {
      switch (type) {
        case 'success': return `${baseColor} border-r-green-500`;
        case 'warning': return `${baseColor} border-r-yellow-500`;
        case 'info': return `${baseColor} border-r-blue-500`;
        default: return `${baseColor} border-r-university-blue`;
      }
    }
    return baseColor;
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
  const importantCount = notifications?.filter(n => n.priority === 'high').length || 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الإشعارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-university-blue/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-university-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">الإشعارات</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <Check className="w-4 h-4 ml-2" />
            تمييز الكل كمقروء
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            الكل
            {notifications && (
              <Badge variant="secondary" className="text-xs">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            غير مقروء
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs bg-university-blue">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="important" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            مهم
            {importantCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {importantCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type, notification.priority);
                const iconColor = getNotificationColor(notification.type, notification.priority);
                const bgColor = getNotificationBgColor(notification.type, notification.priority, notification.is_read);
                
                return (
                  <Card key={notification.id} className={`${bgColor} hover:shadow-medium transition-all duration-200`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold truncate ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </h3>
                              <p className={`text-sm mt-1 ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(notification.created_at), { 
                                    addSuffix: true, 
                                    locale: ar 
                                  })}
                                </div>
                                {notification.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs">
                                    مهم
                                  </Badge>
                                )}
                                {!notification.is_read && (
                                  <Badge variant="default" className="text-xs bg-university-blue">
                                    جديد
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {notification.is_read ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsUnreadMutation.mutate(notification.id)}
                                  disabled={markAsUnreadMutation.isPending}
                                  title="تمييز كغير مقروء"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsReadMutation.mutate(notification.id)}
                                  disabled={markAsReadMutation.isPending}
                                  title="تمييز كمقروء"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotificationMutation.mutate(notification.id)}
                                disabled={deleteNotificationMutation.isPending}
                                title="حذف"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد إشعارات</h3>
                <p className="text-gray-500">
                  {selectedTab === 'unread' 
                    ? 'جميع الإشعارات مقروءة' 
                    : selectedTab === 'important'
                    ? 'لا توجد إشعارات مهمة'
                    : 'لا توجد إشعارات حالياً'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedNotificationSystem;