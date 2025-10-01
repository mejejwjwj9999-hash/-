import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, Globe, Languages, Monitor, Smartphone, Tablet,
  RefreshCw, ExternalLink, Code, Settings
} from 'lucide-react';
import { useContentElements, useContentPages, ContentElement } from '@/hooks/useContentEditor';

interface ContentPreviewPanelProps {
  pageKey?: string | null;
  element?: ContentElement | null;
}

export const ContentPreviewPanel: React.FC<ContentPreviewPanelProps> = ({
  pageKey,
  element
}) => {
  const [previewLanguage, setPreviewLanguage] = useState<'ar' | 'en'>('ar');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const { data: pages } = useContentPages();
  const { data: elements } = useContentElements(
    pageKey ? pages?.find(p => p.page_key === pageKey)?.id : undefined
  );

  const selectedPage = pageKey ? pages?.find(p => p.page_key === pageKey) : null;
  const publishedElements = elements?.filter(el => el.status === 'published' && el.is_active);

  const renderElement = (element: ContentElement) => {
    const content = previewLanguage === 'ar' ? (element.content_ar || '') : (element.content_en || '');
    
    switch (element.element_type) {
      case 'text':
        return (
          <div className={`text-foreground ${previewLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
            {content}
          </div>
        );
      
      case 'rich_text':
        return (
          <div 
            className={`prose max-w-none ${previewLanguage === 'ar' ? 'text-right' : 'text-left'}`}
            dangerouslySetInnerHTML={{ __html: content || '' }}
          />
        );
      
      default:
        return <div className="text-muted-foreground">نوع عنصر غير مدعوم</div>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معاينة المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={previewLanguage} onValueChange={(value: 'ar' | 'en') => setPreviewLanguage(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar">عربي</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
          </Tabs>

          {selectedPage && (
            <div className="mt-4 p-3 bg-muted/20 rounded-lg">
              <h4 className="font-medium">
                {previewLanguage === 'ar' ? selectedPage.page_name_ar : selectedPage.page_name_en}
              </h4>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          {!pageKey ? (
            <div className="p-8 text-center text-muted-foreground">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>اختر صفحة لمعاينة محتواها</p>
            </div>
          ) : !publishedElements?.length ? (
            <div className="p-8 text-center text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد عناصر منشورة في هذه الصفحة</p>
            </div>
          ) : (
            <div className="space-y-6">
              {publishedElements
                ?.sort((a, b) => a.display_order - b.display_order)
                .map((el) => (
                  <div key={el.id} className="preview-element">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-mono">
                        {el.element_key}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {el.element_type}
                      </Badge>
                    </div>
                    {renderElement(el)}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};