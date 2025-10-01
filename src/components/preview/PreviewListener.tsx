import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PreviewStorage } from '@/utils/previewStorage';

/**
 * مكون للاستماع للرسائل الواردة من المحرر في iframe
 */
export const PreviewListener: React.FC = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // إذا لم نكن في وضع المعاينة، لا نحتاج للاستماع
    if (!PreviewStorage.isPreviewMode()) return;

    const handleMessage = (event: MessageEvent) => {
      // التأكد من أن الرسالة من نفس النطاق أو من iframe موثوق
      if (event.origin !== window.location.origin && 
          !event.origin.includes('lovable.app')) return;

      const { type, payload, timestamp } = event.data;

      switch (type) {
        case 'PREVIEW_CONTENT_UPDATED':
          // تحديث المحتوى في cache
          if (payload?.content) {
            queryClient.invalidateQueries({
              queryKey: ['dynamic-content']
            });
          }
          break;

        case 'REFRESH_PREVIEW':
          // تحديث شامل للصفحة
          queryClient.invalidateQueries({
            queryKey: ['dynamic-content']
          });
          
          // تحديث الصفحة إذا لزم الأمر
          setTimeout(() => {
            window.location.reload();
          }, 100);
          break;

        case 'PREVIEW_MODE_CHANGED':
          // تغيير وضع المعاينة
          if (payload?.enabled === false) {
            PreviewStorage.clearAllPreviewContent();
            queryClient.invalidateQueries({
              queryKey: ['dynamic-content']
            });
          }
          break;

        default:
          break;
      }
    };

    // استمع للرسائل من النافذة الرئيسية أو iframe
    window.addEventListener('message', handleMessage);

    // إرسال رسالة تأكيد أن المعاينة جاهزة
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'PREVIEW_READY',
        timestamp: Date.now()
      }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [queryClient]);

  return null;
};