import React, { useEffect } from 'react';
import { DynamicContent } from './DynamicContent';
import { PreviewStorage } from '@/utils/previewStorage';

interface DynamicContentWrapperProps {
  pageKey: string;
  elementKey: string;
  fallback?: React.ReactNode;
  language?: 'ar' | 'en';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * مكون محسّن للمحتوى الديناميكي مع دعم أفضل للمعاينة
 */
export const DynamicContentWrapper: React.FC<DynamicContentWrapperProps> = (props) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  // مراقبة تحديثات المعاينة
  useEffect(() => {
    if (!PreviewStorage.isPreviewMode()) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lovable_preview_content') {
        // تحديث المكون عند تغيير محتوى المعاينة
        setRefreshKey(prev => prev + 1);
      }
    };

    const handlePreviewUpdate = (event: CustomEvent) => {
      const { pageKey, elementKey } = event.detail;
      if (pageKey === props.pageKey && elementKey === props.elementKey) {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('previewContentUpdated', handlePreviewUpdate as EventListener);

    // استمع للرسائل من نوافذ أخرى
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_CONTENT_UPDATED' || event.data?.type === 'REFRESH_PREVIEW') {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('previewContentUpdated', handlePreviewUpdate as EventListener);
      window.removeEventListener('message', handleMessage);
    };
  }, [props.pageKey, props.elementKey]);

  return <DynamicContent key={refreshKey} {...props} />;
};