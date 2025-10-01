import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PreviewStorage } from '@/utils/previewStorage';

/**
 * Hook لمزامنة المعاينة مع التحديثات في الوقت الفعلي
 */
export const usePreviewSync = (pageKey?: string, elementKey?: string) => {
  const queryClient = useQueryClient();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    // استمع للرسائل من النوافذ الأخرى أو iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_CONTENT_UPDATED') {
        const { payload } = event.data;
        
        // تجنب التحديث المضاعف
        if (payload.updateCounter <= lastUpdateRef.current) {
          return;
        }
        
        lastUpdateRef.current = payload.updateCounter;
        
        // إذا كان هناك عنصر محدد، حدث query محدد فقط
        if (pageKey && elementKey) {
          queryClient.invalidateQueries({
            queryKey: ['dynamic-content', pageKey, elementKey]
          });
        } else {
          // وإلا حدث جميع queries المعاينة
          queryClient.invalidateQueries({
            queryKey: ['dynamic-content']
          });
        }
      }
    };

    // استمع لتغييرات sessionStorage المباشرة
    const handleStorageChange = () => {
      // تأخير قصير للسماح بانتهاء العملية
      setTimeout(() => {
        if (pageKey && elementKey) {
          queryClient.invalidateQueries({
            queryKey: ['dynamic-content', pageKey, elementKey]
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ['dynamic-content']
          });
        }
      }, 100);
    };

    window.addEventListener('message', handleMessage);
    
    // مراقبة تغييرات sessionStorage للنافذة الحالية
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key: string, value: string) {
      const result = originalSetItem.apply(this, [key, value]);
      if (key === 'lovable_preview_content') {
        handleStorageChange();
      }
      return result;
    };

    return () => {
      window.removeEventListener('message', handleMessage);
      // استعادة الدالة الأصلية
      sessionStorage.setItem = originalSetItem;
    };
  }, [queryClient, pageKey, elementKey]);

  // دالة لإرسال تحديث المعاينة
  const notifyPreviewUpdate = (content: any, updateCounter: number) => {
    // إرسال رسالة إلى iframe
    const iframes = document.querySelectorAll('iframe[title*="معاينة"]');
    iframes.forEach(iframe => {
      const iframeWindow = (iframe as HTMLIFrameElement).contentWindow;
      if (iframeWindow) {
        try {
          iframeWindow.postMessage({
            type: 'PREVIEW_CONTENT_UPDATED',
            payload: { content, updateCounter }
          }, '*');
        } catch (error) {
          console.warn('فشل في إرسال رسالة المعاينة:', error);
        }
      }
    });

    // إرسال رسالة إلى النافذة الرئيسية إذا كنا في iframe
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({
          type: 'PREVIEW_CONTENT_UPDATED',
          payload: { content, updateCounter }
        }, '*');
      } catch (error) {
        console.warn('فشل في إرسال رسالة إلى النافذة الرئيسية:', error);
      }
    }
  };

  return { notifyPreviewUpdate };
};