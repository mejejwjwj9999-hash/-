import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PreviewStorage, PreviewContent } from '@/utils/previewStorage';

interface PreviewContextType {
  isPreviewMode: boolean;
  setPreviewMode: (enabled: boolean) => void;
  updatePreviewContent: (content: Omit<PreviewContent, 'timestamp'>) => void;
  getPreviewContent: (pageKey: string, elementKey: string) => PreviewContent | null;
  clearPreviewContent: (pageKey: string, elementKey: string) => void;
  refreshPreview: () => void;
  previewUpdateCounter: number;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within PreviewProvider');
  }
  return context;
};

interface PreviewProviderProps {
  children: ReactNode;
}

export const PreviewProvider: React.FC<PreviewProviderProps> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(() => PreviewStorage.isPreviewMode());
  const [previewUpdateCounter, setPreviewUpdateCounter] = useState(0);

  // مراقبة تغييرات URL للكشف عن وضع المعاينة
  useEffect(() => {
    const handleUrlChange = () => {
      const newPreviewMode = PreviewStorage.isPreviewMode();
      setIsPreviewMode(newPreviewMode);
    };

    // استمع لتغييرات التاريخ
    window.addEventListener('popstate', handleUrlChange);
    
    // استمع لتغييرات في sessionStorage من نوافذ أخرى
    window.addEventListener('storage', (e) => {
      if (e.key === 'lovable_preview_content') {
        setPreviewUpdateCounter(prev => prev + 1);
      }
    });

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('storage', handleUrlChange);
    };
  }, []);

  const setPreviewMode = (enabled: boolean) => {
    setIsPreviewMode(enabled);
    if (enabled) {
      const url = new URL(window.location.href);
      url.searchParams.set('preview', '1');
      window.history.pushState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('preview');
      window.history.pushState({}, '', url.toString());
      PreviewStorage.clearAllPreviewContent();
    }
  };

  const updatePreviewContent = (content: Omit<PreviewContent, 'timestamp'>) => {
    PreviewStorage.savePreviewContent(content);
    setPreviewUpdateCounter(prev => prev + 1);
    
    // إرسال رسالة إلى iframe للتحديث
    const iframes = document.querySelectorAll('iframe[title*="معاينة"]');
    iframes.forEach(iframe => {
      const iframeWindow = (iframe as HTMLIFrameElement).contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage({
          type: 'PREVIEW_CONTENT_UPDATED',
          payload: { content, updateCounter: previewUpdateCounter + 1 }
        }, '*');
      }
    });
  };

  const getPreviewContent = (pageKey: string, elementKey: string) => {
    return PreviewStorage.getPreviewContent(pageKey, elementKey);
  };

  const clearPreviewContent = (pageKey: string, elementKey: string) => {
    PreviewStorage.clearPreviewContent(pageKey, elementKey);
    setPreviewUpdateCounter(prev => prev + 1);
  };

  const refreshPreview = () => {
    setPreviewUpdateCounter(prev => prev + 1);
  };

  return (
    <PreviewContext.Provider value={{
      isPreviewMode,
      setPreviewMode,
      updatePreviewContent,
      getPreviewContent,
      clearPreviewContent,
      refreshPreview,
      previewUpdateCounter
    }}>
      {children}
    </PreviewContext.Provider>
  );
};