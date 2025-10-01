import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useBeforeUnload } from 'react-router-dom';

interface UnsavedChangesOptions {
  message?: string;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export const useUnsavedChanges = (
  hasUnsavedChanges: boolean,
  options: UnsavedChangesOptions = {}
) => {
  const {
    message = 'لديك تغييرات غير محفوظة. هل أنت متأكد من الخروج؟',
    onUnsavedChanges
  } = options;

  const [showWarning, setShowWarning] = useState(false);
  const hasChangesRef = useRef(hasUnsavedChanges);

  // تحديث المرجع عند تغيير الحالة
  useEffect(() => {
    hasChangesRef.current = hasUnsavedChanges;
    setShowWarning(hasUnsavedChanges);
    onUnsavedChanges?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChanges]);

  // منع إغلاق النافذة/التبويب
  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasChangesRef.current) {
          event.preventDefault();
          return message;
        }
      },
      [message]
    )
  );

  // منع التنقل داخل التطبيق
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasChangesRef.current) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    const handlePopstate = (event: PopStateEvent) => {
      if (hasChangesRef.current) {
        const confirmLeave = window.confirm(message);
        if (!confirmLeave) {
          // إعادة التاريخ إلى الحالة السابقة
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [message]);

  return {
    hasUnsavedChanges,
    showWarning,
    confirmNavigation: (callback: () => void) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(message);
        if (confirmLeave) {
          callback();
        }
      } else {
        callback();
      }
    }
  };
};