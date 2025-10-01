
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    is_read: boolean;
    created_at: string;
    action_url?: string;
  };
  onMarkAsRead: (id: string) => void;
  onAction?: (url: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onAction,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  return (
    <Card className="m-2 border-l-4" style={{
      borderLeftColor: getPriorityColor(notification.priority)
    }}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className={`text-sm font-medium ${
                !notification.is_read ? 'font-bold' : ''
              }`}>
                {notification.title}
              </h4>
              {!notification.is_read && (
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1"></div>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            
            <p className="text-xs text-muted-foreground mt-2">
              {formatDate(notification.created_at)}
            </p>

            <div className="flex items-center justify-between mt-2">
              {notification.action_url && onAction && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs"
                  onClick={() => onAction(notification.action_url!)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  عرض التفاصيل
                </Button>
              )}

              {!notification.is_read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
