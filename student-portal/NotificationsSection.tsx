import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Search, Filter, Eye, EyeOff, Trash2, ExternalLink, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', studentProfile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('student_id', studentProfile?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentProfile?.id,
  });

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
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('student_id', studentProfile?.id)
        .eq('is_read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "تم تحديث الإشعارات",
        description: "تم وضع علامة 'مقروء' على جميع الإشعارات",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'financial': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'administrative': return <Info className="w-5 h-5 text-gray-500" />;
      case 'urgent': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'announcement': return <Bell className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationTypeName = (type: string) => {
    const types: Record<string, string> = {
      'academic': 'أكاديمي',
      'financial': 'مالي',
      'administrative': 'إداري',
      'urgent': 'عاجل',
      'announcement': 'إعلان',
      'reminder': 'تذكير',
      'deadline': 'موعد نهائي',
      'event': 'فعالية'
    };
    return types[type] || type;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'عادية';
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const filteredNotifications = notifications?.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
    const matchesReadStatus = !showUnreadOnly || !notification.is_read;
    const notExpired = !isExpired(notification.expires_at);

    return matchesSearch && matchesType && matchesPriority && matchesReadStatus && notExpired;
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  const unreadCount = notifications?.filter(n => !n.is_read && !isExpired(n.expires_at)).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            الإشعارات
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {unreadCount} جديد
              </Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">تابع آخر الأخبار والتحديثات المهمة</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={showUnreadOnly ? 'bg-primary text-white' : ''}
          >
            {showUnreadOnly ? <EyeOff className="w-4 h-4 ml-2" /> : <Eye className="w-4 h-4 ml-2" />}
            {showUnreadOnly ? 'إظهار الكل' : 'غير المقروء فقط'}
          </Button>
          {unreadCount > 0 && (
            <Button onClick={() => markAllAsReadMutation.mutate()}>
              تحديد الكل كمقروء
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في الإشعارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 ml-2" />
            <SelectValue placeholder="نوع الإشعار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="academic">أكاديمي</SelectItem>
            <SelectItem value="financial">مالي</SelectItem>
            <SelectItem value="administrative">إداري</SelectItem>
            <SelectItem value="urgent">عاجل</SelectItem>
            <SelectItem value="announcement">إعلان</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأولويات</SelectItem>
            <SelectItem value="high">عالية</SelectItem>
            <SelectItem value="medium">متوسطة</SelectItem>
            <SelectItem value="low">منخفضة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications && filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover:shadow-md transition-all cursor-pointer ${
                !notification.is_read ? 'border-l-4 border-l-primary bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-semibold ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {getPriorityText(notification.priority)}
                        </Badge>
                        <Badge variant="outline">
                          {getNotificationTypeName(notification.type)}
                        </Badge>
                        {notification.action_url && (
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <p className={`mb-3 ${
                      !notification.is_read ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      
                      {notification.expires_at && (
                        <span className="text-xs text-orange-600">
                          ينتهي: {new Date(notification.expires_at).toLocaleDateString('ar-SA')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {showUnreadOnly ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}
              </h3>
              <p className="text-gray-600">
                {showUnreadOnly 
                  ? 'جميع الإشعارات مقروءة' 
                  : 'لم يتم العثور على إشعارات مطابقة للبحث المحدد'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      {notifications && notifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {notifications.length}
              </div>
              <div className="text-sm text-gray-600">إجمالي الإشعارات</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {unreadCount}
              </div>
              <div className="text-sm text-gray-600">غير مقروء</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">أولوية عالية</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.type === 'announcement').length}
              </div>
              <div className="text-sm text-gray-600">إعلانات</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;