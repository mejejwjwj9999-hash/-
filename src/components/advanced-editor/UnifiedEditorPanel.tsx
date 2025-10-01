import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedWysiwygEditor } from '@/components/admin/EnhancedWysiwygEditor';
import { LivePreviewPanel } from '@/components/editor/LivePreviewPanel';
import { ContentAnalyzer } from '@/components/editor/ContentAnalyzer';
import { SEOToolbox } from '@/components/editor/SEOToolbox';
import { SpellChecker } from '@/components/editor/SpellChecker';
// import { ImageEditor } from '@/components/editor/ImageEditor';
// import { AIContentAssistant } from '@/components/editor/AIContentAssistant';
import VersionHistory from '@/components/admin/VersionHistory';
import { useUpdateContentElement } from '@/hooks/useContentEditor';
import { 
  Edit3,
  Eye,
  BarChart3,
  Search,
  CheckSquare,
  Image,
  Bot,
  History,
  Save,
  Upload,
  Download,
  Share,
  Settings,
  Maximize2,
  Minimize2,
  Split,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedEditorPanelProps {
  element?: any;
  onSave?: (data: any) => void;
  language?: 'ar' | 'en';
}

export const UnifiedEditorPanel: React.FC<UnifiedEditorPanelProps> = ({
  element,
  onSave,
  language = 'ar'
}) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [contentAr, setContentAr] = useState(element?.content_ar || '');
  const [contentEn, setContentEn] = useState(element?.content_en || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'split'>('single');
  const [zoom, setZoom] = useState(100);

  const updateElement = useUpdateContentElement();

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!element) {
      toast.error('لا يوجد عنصر محدد للحفظ');
      return;
    }

    try {
      await updateElement.mutateAsync({
        pageKey: element.page_key,
        elementKey: element.element_key,
        elementType: element.element_type,
        contentAr,
        contentEn,
        status
      });

      onSave?.({
        contentAr,
        contentEn,
        status
      });

      toast.success(`تم ${status === 'published' ? 'نشر' : 'حفظ'} المحتوى بنجاح`);
    } catch (error) {
      console.error('Error saving element:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const exportContent = () => {
    const content = {
      element_key: element?.element_key,
      content_ar: contentAr,
      content_en: contentEn,
      element_type: element?.element_type,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${element?.element_key || 'content'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'editor', label: 'المحرر', icon: Edit3 },
    { id: 'preview', label: 'المعاينة', icon: Eye },
    { id: 'analysis', label: 'التحليل', icon: BarChart3 },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'spell', label: 'الإملاء', icon: CheckSquare },
    { id: 'image', label: 'الصور', icon: Image },
    { id: 'ai', label: 'الذكاء الاصطناعي', icon: Bot },
    { id: 'history', label: 'الإصدارات', icon: History },
  ];

  if (!element) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>اختر عنصراً لبدء التحرير</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* شريط الأدوات العلوي */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{element.element_key}</h3>
          <Badge variant="outline" className="text-xs">
            {element.element_type === 'text' ? 'نص بسيط' :
             element.element_type === 'rich_text' ? 'نص منسق' :
             element.element_type === 'image' ? 'صورة' :
             element.element_type === 'link' ? 'رابط' :
             element.element_type === 'button' ? 'زر' : element.element_type}
          </Badge>
          <Badge 
            variant={element.status === 'published' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {element.status === 'published' ? 'منشور' : 
             element.status === 'draft' ? 'مسودة' : 'مؤرشف'}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* أدوات العرض */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2">{zoom}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'single' ? 'split' : 'single')}
            className="h-8 w-8 p-0"
          >
            <Split className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {/* أدوات الملف */}
          <div className="h-6 w-px bg-border mx-1" />
          
          <Button variant="ghost" size="sm" onClick={exportContent} className="h-8 w-8 p-0">
            <Download className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Upload className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share className="w-4 h-4" />
          </Button>

          {/* أدوات الحفظ */}
          <div className="h-6 w-px bg-border mx-1" />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSave('draft')}
            disabled={updateElement.isPending}
            className="h-8"
          >
            <Save className="w-4 h-4 mr-2" />
            حفظ
          </Button>

          <Button 
            size="sm"
            onClick={() => handleSave('published')}
            disabled={updateElement.isPending}
            className="h-8"
          >
            نشر
          </Button>
        </div>
      </div>

      {/* علامات التبويب */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-8 m-3 mb-0">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs">
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-hidden" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
          <TabsContent value="editor" className="h-full mt-0">
            <div className="h-full p-3">
              {viewMode === 'split' ? (
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">المحتوى العربي</label>
                    <div className="h-full border rounded-lg overflow-hidden">
                      <EnhancedWysiwygEditor
                        value={contentAr}
                        onChange={setContentAr}
                        language="ar"
                        placeholder="اكتب المحتوى العربي هنا..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">English Content</label>
                    <div className="h-full border rounded-lg overflow-hidden">
                      <EnhancedWysiwygEditor
                        value={contentEn}
                        onChange={setContentEn}
                        language="en"
                        placeholder="Write English content here..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={language === 'ar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {/* تبديل اللغة */}}
                    >
                      العربية
                    </Button>
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {/* تبديل اللغة */}}
                    >
                      English
                    </Button>
                  </div>
                  <div className="h-full border rounded-lg overflow-hidden">
                    <EnhancedWysiwygEditor
                      value={language === 'ar' ? contentAr : contentEn}
                      onChange={language === 'ar' ? setContentAr : setContentEn}
                      language={language}
                      placeholder={language === 'ar' ? 'اكتب المحتوى العربي هنا...' : 'Write English content here...'}
                      
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="h-full mt-0">
            <ScrollArea className="h-full p-3">
              <LivePreviewPanel 
                content={language === 'ar' ? contentAr : contentEn}
                isVisible={true}
                onToggle={() => {}}
                language={language}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analysis" className="h-full mt-0">
            <ScrollArea className="h-full p-3">
              <ContentAnalyzer 
                content={language === 'ar' ? contentAr : contentEn}
                isVisible={true}
                language={language}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="seo" className="h-full mt-0">
            <ScrollArea className="h-full p-3">
              <SEOToolbox 
                content={language === 'ar' ? contentAr : contentEn}
                isVisible={true}
                language={language}
                onUpdateContent={() => {}}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="spell" className="h-full mt-0">
            <ScrollArea className="h-full p-3">
              <SpellChecker 
                content={language === 'ar' ? contentAr : contentEn}
                language={language}
                isVisible={true}
                onContentChange={(corrected) => {
                  if (language === 'ar') {
                    setContentAr(corrected);
                  } else {
                    setContentEn(corrected);
                  }
                }}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="image" className="h-full mt-0">
            <ScrollArea className="h-full p-3">
              <div className="text-center text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>محرر الصور قيد التطوير</p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ai" className="h-full mt-0">
            <ScrollArea className="h-full p-3">
              <div className="text-center text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>مساعد الذكاء الاصطناعي قيد التطوير</p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="h-full mt-0">
            <ScrollArea className="h-full p-3">
              <VersionHistory 
                isOpen={true}
                onClose={() => {}}
                currentContent={language === 'ar' ? contentAr : contentEn}
                onRestore={(content) => {
                  if (language === 'ar') {
                    setContentAr(content);
                  } else {
                    setContentEn(content);
                  }
                }}
              />
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};