import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, { notifications: [] });

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer notifications={state.notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-[100] space-y-3" dir="rtl">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      message: 'text-green-700',
      button: 'text-green-600 hover:text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'text-red-600 hover:text-red-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      button: 'text-yellow-600 hover:text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      message: 'text-blue-700',
      button: 'text-blue-600 hover:text-blue-800',
    },
  };

  const Icon = icons[notification.type];
  const colorScheme = colors[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        ${colorScheme.bg} ${colorScheme.border}
        border rounded-xl shadow-large backdrop-blur-sm
        max-w-sm mx-auto w-full
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${colorScheme.icon}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className={`text-sm font-bold ${colorScheme.title} mb-1`}>
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className={`text-xs ${colorScheme.message} leading-relaxed`}>
                    {notification.message}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => onRemove(notification.id)}
                className={`
                  flex-shrink-0 p-1 rounded-full transition-colors
                  ${colorScheme.button}
                `}
                aria-label="إغلاق الإشعار"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {notification.action && (
              <div className="mt-3 pt-3 border-t border-current/10">
                <button
                  onClick={notification.action.onClick}
                  className={`
                    text-xs font-semibold px-3 py-1 rounded-full
                    border border-current/20 hover:border-current/40
                    transition-all duration-200
                    ${colorScheme.button}
                  `}
                >
                  {notification.action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar for timed notifications */}
      {notification.duration && notification.duration > 0 && (
        <motion.div
          className={`h-1 ${colorScheme.bg} rounded-b-xl overflow-hidden`}
        >
          <motion.div
            className="h-full bg-current/20"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ 
              duration: notification.duration / 1000, 
              ease: 'linear' 
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

// Helper hook for common notification patterns
export const useNotificationHelpers = () => {
  const { showNotification } = useNotification();

  const success = (title: string, message?: string) => {
    showNotification({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    showNotification({ type: 'error', title, message });
  };

  const warning = (title: string, message?: string) => {
    showNotification({ type: 'warning', title, message });
  };

  const info = (title: string, message?: string) => {
    showNotification({ type: 'info', title, message });
  };

  const loading = (title: string, message?: string) => {
    showNotification({ 
      type: 'info', 
      title, 
      message, 
      duration: 0 // Don't auto-dismiss
    });
  };

  return { success, error, warning, info, loading };
};