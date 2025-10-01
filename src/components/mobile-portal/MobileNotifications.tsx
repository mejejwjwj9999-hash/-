
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  GraduationCap, 
  CreditCard, 
  Calendar, 
  FileText,
  MessageSquare,
  Settings,
  Check,
  Trash2,
  Filter,
  Loader2,
  AlertCircle,
  Building,
  DollarSign,
  Users,
  Archive
} from 'lucide-react';
import { useNotificationsWithFilters } from '@/hooks/useNotificationsWithFilters';

const MobileNotifications = () => {
  const { notifications, isLoading, error, markAsRead } = useNotificationsWithFilters({}, { field: 'created_at', direction: 'desc' });
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const filteredNotifications = notifications?.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'academic') return notif.category === 'academic';
    if (filter === 'financial') return notif.category === 'financial';
    if (filter === 'administrative') return notif.category === 'administrative';
    return notif.type === filter;
  }) || [];

  // ترتيب الإشعارات
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'date_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, normal: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 1) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 1);
      case 'unread_first':
        if (a.is_read === b.is_read) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_read ? 1 : -1;
      default:
        return 0;
    }
  });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
  const academicCount = notifications?.filter(n => n.category === 'academic').length || 0;
  const financialCount = notifications?.filter(n => n.category === 'financial').length || 0;
  const administrativeCount = notifications?.filter(n => n.category === 'administrative').length || 0;

  const markAllAsRead = () => {
    notifications?.filter(n => !n.is_read).forEach(notification => {
      markAsRead.mutate(notification.id);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-r-red-500 bg-red-50/50';
      case 'medium': return 'border-r-yellow-500 bg-yellow-50/50';
      default: return 'border-r-blue-500 bg-blue-50/50';
    }
  };

  const getTimeColor = (priority: string, isRead: boolean) => {
    if (!isRead && priority === 'high') return 'text-red-600 font-medium';
    if (!isRead && priority === 'medium') return 'text-orange-600 font-medium';
    return 'text-gray-500';
  };

  const getNotificationIcon = (type: string, category: string) => {
    // أولوية للفئة ثم النوع
    switch (category) {
      case 'academic':
        return GraduationCap;
      case 'financial':
        return DollarSign;
      case 'administrative':
        return Building;
      default:
        switch (type) {
          case 'grades': return GraduationCap;
          case 'payment': return CreditCard;
          case 'schedule': return Calendar;
          case 'materials': return FileText;
          case 'message': return MessageSquare;
          default: return Bell;
        }
    }
  };

  const getNotificationColor = (type: string, category: string, priority: string) => {
    // ألوان حسب الأولوية أولاً
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'medium') return 'bg-orange-500';
    
    // ثم حسب الفئة
    switch (category) {
      case 'academic': return 'bg-blue-500';
      case 'financial': return 'bg-green-500';
      case 'administrative': return 'bg-purple-500';
      default:
        switch (type) {
          case 'grades': return 'bg-blue-500';
          case 'payment': return 'bg-red-500';
          case 'schedule': return 'bg-green-500';
          case 'materials': return 'bg-purple-500';
          case 'message': return 'bg-yellow-500';
          default: return 'bg-gray-500';
        }
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'academic': return 'أكاديمية';
      case 'financial': return 'مالية';
      case 'administrative': return 'إدارية';
      default: return 'عامة';
    }
  };

  if (isLoading) {
    return (
      <div className="px-3 py-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>جاري تحميل الإشعارات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-3">
        <Card className="border-0 shadow-md bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-3 text-red-300" />
            <h3 className="font-medium text-red-800 mb-1">خطأ في تحميل الإشعارات</h3>
            <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-3 py-3" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">الإشعارات</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600">
              لديك {unreadCount} إشعار غير مقروء
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || markAsRead.isPending}
            className="text-xs"
          >
            <Check className="h-3 w-3 ml-1" />
            قراءة الكل
          </Button>
        </div>
      </div>

      {/* أدوات التصفية والترتيب */}
      <Card className="border-0 shadow-sm mb-4">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">التصفية:</label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل ({notifications?.length || 0})</SelectItem>
                  <SelectItem value="unread">غير مقروءة ({unreadCount})</SelectItem>
                  <SelectItem value="academic">أكاديمية ({academicCount})</SelectItem>
                  <SelectItem value="financial">مالية ({financialCount})</SelectItem>
                  <SelectItem value="administrative">إدارية ({administrativeCount})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">الترتيب:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">الأحدث أولاً</SelectItem>
                  <SelectItem value="date_asc">الأقدم أولاً</SelectItem>
                  <SelectItem value="priority">حسب الأولوية</SelectItem>
                  <SelectItem value="unread_first">غير المقروءة أولاً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-2 text-center">
            <GraduationCap className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">{academicCount}</div>
            <div className="text-xs text-blue-600">أكاديمية</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-green-50">
          <CardContent className="p-2 text-center">
            <DollarSign className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">{financialCount}</div>
            <div className="text-xs text-green-600">مالية</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-purple-50">
          <CardContent className="p-2 text-center">
            <Building className="h-4 w-4 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600">{administrativeCount}</div>
            <div className="text-xs text-purple-600">إدارية</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-red-50">
          <CardContent className="p-2 text-center">
            <Bell className="h-4 w-4 text-red-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-red-600">{unreadCount}</div>
            <div className="text-xs text-red-600">غير مقروءة</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {sortedNotifications.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-600 mb-2">
                {filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}
              </h3>
              <p className="text-sm text-gray-500">
                {filter === 'unread' 
                  ? 'جميع إشعاراتك مقروءة!' 
                  : filter === 'all'
                  ? 'ستظهر إشعاراتك الجديدة هنا'
                  : `لا توجد إشعارات في فئة "${getCategoryLabel(filter)}"`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type, notification.category || 'general');
            const color = getNotificationColor(notification.type, notification.category || 'general', notification.priority);
            
            return (
              <Card 
                key={notification.id} 
                className={`border-0 shadow-sm transition-all relative ${
                  !notification.is_read 
                    ? `border-r-4 ${getPriorityColor(notification.priority)} shadow-md` 
                    : 'bg-gray-50/50'
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className={`font-semibold text-sm ${
                            !notification.is_read ? 'text-gray-800' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                notification.category === 'academic' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                                notification.category === 'financial' ? 'border-green-500 text-green-700 bg-green-50' :
                                notification.category === 'administrative' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                                'border-gray-500 text-gray-700 bg-gray-50'
                              }`}
                            >
                              {getCategoryLabel(notification.category || 'general')}
                            </Badge>
                            {notification.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">
                                عاجل
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className={`text-sm leading-relaxed mb-3 ${
                        !notification.is_read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${getTimeColor(notification.priority, notification.is_read)}`}>
                          {new Date(notification.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead.mutate(notification.id)}
                            disabled={markAsRead.isPending}
                            className="text-xs h-6 px-2 text-primary hover:text-primary"
                          >
                            <Check className="h-3 w-3 ml-1" />
                            تم القراءة
                          </Button>
                        )}
                      </div>
                      
                      {!notification.is_read && (
                        <div className="absolute top-4 left-4">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MobileNotifications;
