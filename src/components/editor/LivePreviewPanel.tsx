import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Smartphone, Tablet, Monitor, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { PreviewStorage } from '@/utils/previewStorage';
import { usePreview } from '@/contexts/PreviewContext';

interface LivePreviewPanelProps {
  content: string;
  isVisible: boolean;
  onToggle: () => void;
  language: 'ar' | 'en';
  pageKey?: string;
  elementKey?: string;
  elementType?: 'text' | 'rich_text' | 'image' | 'button';
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  content,
  isVisible,
  onToggle,
  language,
  pageKey,
  elementKey,
  elementType = 'rich_text'
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = React.useState<'content' | 'fullpage'>('content');
  const [iframeKey, setIframeKey] = React.useState(0);
  const [iframeError, setIframeError] = React.useState(false);
  
  // استخدام PreviewContext للتحكم الموحد
  const { updatePreviewContent, refreshPreview: contextRefreshPreview } = usePreview();

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-full';
    }
  };

  const getIframeSize = () => {
    switch (viewMode) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '600px' };
    }
  };

  const cleanContent = DOMPurify.sanitize(content);

  // حفظ المحتوى للمعاينة عند التغيير مع منع الحلقة اللا نهائية
  React.useEffect(() => {
    if (pageKey && elementKey && content) {
      const existingPreview = PreviewStorage.getPreviewContent(pageKey, elementKey);
      
      // تحقق إذا كان المحتوى تغير فعلاً لتجنب التحديث غير المبرر
      const currentContent = language === 'ar' ? existingPreview?.contentAr : existingPreview?.contentEn;
      if (currentContent !== content) {
        const updatedContent = {
          pageKey,
          elementKey,
          contentAr: language === 'ar' ? content : (existingPreview?.contentAr || ''),
          contentEn: language === 'en' ? content : (existingPreview?.contentEn || ''),
          elementType
        };
        
        updatePreviewContent(updatedContent);
        
        // تحديث iframe فوراً مع تأخير قصير
        setTimeout(() => {
          setIframeKey(prev => prev + 1);
        }, 100);
      }
    }
  }, [content, pageKey, elementKey, language, elementType]);
  // إزالة updatePreviewContent من dependencies لمنع الحلقة اللا نهائية

  const refreshPreview = React.useCallback(() => {
    setIframeKey(prev => prev + 1);
    contextRefreshPreview();
    
    // إرسال رسالة إلى iframe للتحديث الفوري
    setTimeout(() => {
      const iframe = document.querySelector('iframe[title="معاينة الصفحة الكاملة"]') as HTMLIFrameElement;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'REFRESH_PREVIEW',
          timestamp: Date.now()
        }, '*');
      }
    }, 500);
  }, [contextRefreshPreview]);

  const getCurrentPagePath = () => {
    // استخراج المسار الحالي وتحويله لمسار المعاينة
    const path = window.location.pathname;
    if (path.includes('/edit')) {
      return path.replace('/edit', '');
    }
    return path || '/';
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="gap-2"
      >
        <Eye className="h-4 w-4" />
        عرض المعاينة
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">المعاينة المباشرة</h3>
              
              {/* أزرار وضع المعاينة */}
              <div className="flex gap-1 mr-2">
                <Button
                  variant={previewMode === 'content' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('content')}
                  className="h-7 px-3 text-xs"
                >
                  المحتوى
                </Button>
                <Button
                  variant={previewMode === 'fullpage' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('fullpage')}
                  className="h-7 px-3 text-xs"
                >
                  الصفحة الكاملة
                </Button>
              </div>
              
              {/* أزرار حجم الشاشة */}
              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="h-8 w-8 p-0"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tablet')}
                  className="h-8 w-8 p-0"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="h-8 w-8 p-0"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {previewMode === 'fullpage' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshPreview}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const previewUrl = PreviewStorage.createPreviewUrl(getCurrentPagePath());
                      window.open(previewUrl, '_blank');
                    }}
                    className="gap-2 h-8 px-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                    فتح في علامة تبويب جديدة
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="gap-2"
              >
                <EyeOff className="h-4 w-4" />
                إخفاء
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="bg-background border rounded-lg overflow-hidden min-h-[200px] transition-all duration-300">
            {previewMode === 'content' ? (
              // معاينة المحتوى فقط
              <div className="p-4">
                <div className={`mx-auto ${getPreviewWidth()}`}>
                  <div
                    className={`prose prose-sm max-w-none ${
                      language === 'ar' 
                        ? 'prose-headings:text-right prose-p:text-right' 
                        : 'prose-headings:text-left prose-p:text-left'
                    }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    dangerouslySetInnerHTML={{ __html: cleanContent }}
                  />
                  {!content.trim() && (
                    <div className="text-center text-muted-foreground py-8">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>ابدأ بكتابة المحتوى لرؤية المعاينة</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // معاينة الصفحة الكاملة
              <div className="flex justify-center bg-gray-100 p-4" style={{ minHeight: '400px' }}>
                <div 
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                  style={getIframeSize()}
                >
                  <iframe
                    key={iframeKey}
                    src={PreviewStorage.createPreviewUrl(getCurrentPagePath())}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    className="rounded-lg"
                    title="معاينة الصفحة الكاملة"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>عدد الكلمات: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</span>
            <div className="flex items-center gap-4">
              <span>وضع العرض: {viewMode === 'desktop' ? 'سطح المكتب' : viewMode === 'tablet' ? 'تابلت' : 'هاتف'}</span>
              <span>نوع المعاينة: {previewMode === 'content' ? 'المحتوى' : 'الصفحة الكاملة'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};