import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  ImageIcon, Link2, Upload, Table, Code, Palette, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Undo, Redo, Save, Eye,
  Settings, History, Video, FileText, Hash, Strikethrough,
  Subscript, Superscript, PaintBucket, Type, Ruler,
  Layout, BookOpen, Globe, Zap, RefreshCw, Brain, Clock,
  BarChart3, Search, CheckCircle, Download, Brush, Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useImages } from '@/hooks/useMediaLibrary';
import { toast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedEditor } from '@/hooks/useAdvancedEditor';
import { useImageManagement } from '@/hooks/useImageManagement';
import AdvancedToolbar from './AdvancedToolbar';
import MediaManager from './MediaManager';
import ImageEditor from './ImageEditor';
import AIContentAssistant from './AIContentAssistant';
import VersionHistory from './VersionHistory';
import { LivePreviewPanel } from '@/components/editor/LivePreviewPanel';
import { ContentAnalyzer } from '@/components/editor/ContentAnalyzer';
import { SEOToolbox } from '@/components/editor/SEOToolbox';
import { SpellChecker } from '@/components/editor/SpellChecker';
import { ExportTools } from '@/components/editor/ExportTools';
import { ThemeBuilder } from './ThemeBuilder';
import { StylePanel } from '@/components/editor/StylePanel';
import { ColorPicker } from '@/components/editor/ColorPicker';
import { TemplateManager } from './TemplateManager';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import { SmartCacheManager } from './SmartCacheManager';

interface EnhancedWysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  language?: 'ar' | 'en';
  disabled?: boolean;
  autoSave?: boolean;
  onAutoSave?: (content: string, metadata?: any) => Promise<void>;
  templates?: EditorTemplate[];
  showAdvancedFeatures?: boolean;
  elementId?: string;
  pageKey?: string;
  elementKey?: string;
  initialMetadata?: any;
  enableAI?: boolean;
  enableVersionHistory?: boolean;
  enableImageEditing?: boolean;
}

interface EditorTemplate {
  id: string;
  name: string;
  content: string;
  preview: string;
  category: string;
}

interface EditorHistory {
  id: string;
  content: string;
  timestamp: Date;
  action: string;
}

const DEFAULT_TEMPLATES: EditorTemplate[] = [
  {
    id: 'news-article',
    name: 'مقال إخباري',
    content: `<h1>عنوان الخبر</h1><p class="lead">المقدمة الرئيسية للخبر...</p><p>تفاصيل الخبر...</p>`,
    preview: 'قالب مقال إخباري مع عنوان ومقدمة',
    category: 'أخبار'
  },
  {
    id: 'announcement',
    name: 'إعلان رسمي', 
    content: `<div class="announcement-box"><h2>إعلان هام</h2><p>محتوى الإعلان...</p><p><strong>تاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</p></div>`,
    preview: 'قالب إعلان رسمي مع تاريخ',
    category: 'إعلانات'
  },
  {
    id: 'course-description',
    name: 'وصف مادة دراسية',
    content: `<h2>اسم المادة</h2><p><strong>رمز المادة:</strong> XXX-000</p><p><strong>الساعات المعتمدة:</strong> 3</p><h3>وصف المادة</h3><p>وصف تفصيلي للمادة...</p><h3>أهداف المادة</h3><ul><li>الهدف الأول</li><li>الهدف الثاني</li></ul>`,
    preview: 'قالب وصف مادة دراسية مع التفاصيل',
    category: 'أكاديمي'
  },
  {
    id: 'event-details',
    name: 'تفاصيل فعالية',
    content: `<h1>اسم الفعالية</h1><p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</p><p><strong>المكان:</strong> قاعة المؤتمرات</p><p><strong>الوقت:</strong> من 9:00 ص إلى 12:00 م</p><h2>وصف الفعالية</h2><p>تفاصيل الفعالية...</p>`,
    preview: 'قالب تفاصيل فعالية مع التوقيت والمكان',
    category: 'فعاليات'
  }
];

export const EnhancedWysiwygEditor: React.FC<EnhancedWysiwygEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'اكتب المحتوى هنا...',
  height = '400px',
  language = 'ar',
  disabled = false,
  autoSave = true,
  onAutoSave,
  templates = DEFAULT_TEMPLATES,
  showAdvancedFeatures = true,
  elementId,
  pageKey,
  elementKey,
  initialMetadata = {},
  enableAI = true,
  enableVersionHistory = true,
  enableImageEditing = true
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<string | null>(null);
  
  // New advanced panels state
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [isContentAnalyzerOpen, setIsContentAnalyzerOpen] = useState(false);
  const [isSEOToolboxOpen, setIsSEOToolboxOpen] = useState(false);
  const [isSpellCheckerOpen, setIsSpellCheckerOpen] = useState(false);
  const [isExportToolsOpen, setIsExportToolsOpen] = useState(false);
  const [isThemeBuilderOpen, setIsThemeBuilderOpen] = useState(false);
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isPerformanceOptimizerOpen, setIsPerformanceOptimizerOpen] = useState(false);
  const [isSmartCacheManagerOpen, setIsSmartCacheManagerOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementStyles, setElementStyles] = useState<any>({});
  const [activeEditorTab, setActiveEditorTab] = useState('editor');
  
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  
  // Advanced settings
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('arabic');
  const [lineHeight, setLineHeight] = useState('1.6');
  const [enableSpellCheck, setEnableSpellCheck] = useState(true);
  const [enableAutoSave, setEnableAutoSave] = useState(autoSave);
  
  // التأكد من جاهزية المحرر
  useEffect(() => {
    const timer = setTimeout(() => {
      if (quillRef.current?.getEditor()) {
        setEditorReady(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // استخدام الـ hooks المتقدمة
  const advancedEditor = useAdvancedEditor({
    elementId,
    pageKey,
    elementKey,
    initialContent: value,
    initialMetadata,
    language,
    autoSave: enableAutoSave,
    onSave: onAutoSave,
    enableAI,
    enableCollaboration: false
  });

  const imageManager = useImageManagement({
    bucket: 'site-media',
    folder: 'content-images',
    compress: true,
    quality: 0.8
  });

  // تنظيف دوال التاريخ - استخدام advanced editor بدلاً منها
  const handleUndo = () => {
    return advancedEditor.undo();
  };

  const handleRedo = () => {
    return advancedEditor.redo();
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const result = await imageManager.uploadImage(file);
    if (result) {
      insertImage(result.url, file.name);
      setIsImageModalOpen(false);
    }
  };

  // Enhanced toolbar configuration - مبسط لتجنب الأخطاء
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      [{ 'direction': 'rtl' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    }
  }), []);

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'direction', 'blockquote', 'code-block', 'link', 'image'
  ];

  const handleChange = useCallback((content: string) => {
    try {
      // تنظيف أساسي للمحتوى
      if (typeof content !== 'string') {
        console.warn('Invalid content type received:', typeof content);
        return;
      }
      
      const cleanContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'span', 'div',
          'pre', 'code', 'sub', 'sup'
        ],
        ALLOWED_ATTR: [
          'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel',
          'width', 'height', 'data-*', 'id'
        ]
      });
      
      onChange(cleanContent);
      
      // تحديث المحرر المتقدم بحذر
      if (editorReady && advancedEditor && typeof advancedEditor.updateContent === 'function') {
        try {
          advancedEditor.updateContent(cleanContent);
        } catch (advError) {
          console.warn('Advanced editor update failed:', advError);
        }
      }
    } catch (error) {
      console.error('Error in handleChange:', error);
      // fallback - استخدم المحتوى كما هو
      if (typeof content === 'string') {
        onChange(content);
      }
    }
  }, [onChange, advancedEditor, editorReady]);

  const insertImage = (url: string, alt: string = '') => {
    try {
      const quill = quillRef.current?.getEditor();
      if (quill && editorReady) {
        const range = quill.getSelection();
        const index = range?.index || 0;
        quill.insertEmbed(index, 'image', url);
        quill.insertText(index + 1, '\n');
        
        if (advancedEditor && typeof advancedEditor.updateContent === 'function') {
          advancedEditor.updateContent(quill.root.innerHTML);
        }
      }
    } catch (error) {
      console.error('Error inserting image:', error);
    }
  };

  const insertLink = () => {
    if (!linkUrl || !linkText) return;
    
    try {
      const quill = quillRef.current?.getEditor();
      if (quill && editorReady) {
        const range = quill.getSelection();
        const index = range?.index || 0;
        quill.insertText(index, linkText, 'link', linkUrl);
        
        if (advancedEditor && typeof advancedEditor.updateContent === 'function') {
          advancedEditor.updateContent(quill.root.innerHTML);
        }
      }
    } catch (error) {
      console.error('Error inserting link:', error);
    }
    
    setLinkText('');
    setLinkUrl('');
    setIsLinkModalOpen(false);
  };

  const insertTable = () => {
    try {
      const quill = quillRef.current?.getEditor();
      if (quill && editorReady) {
        const range = quill.getSelection();
        let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
        
        // Header row
        tableHTML += '<thead><tr>';
        for (let j = 0; j < tableCols; j++) {
          tableHTML += `<th style="border: 1px solid #ccc; padding: 8px;">رأس ${j + 1}</th>`;
        }
        tableHTML += '</tr></thead>';
        
        // Body rows
        tableHTML += '<tbody>';
        for (let i = 0; i < tableRows - 1; i++) {
          tableHTML += '<tr>';
          for (let j = 0; j < tableCols; j++) {
            tableHTML += `<td style="border: 1px solid #ccc; padding: 8px;">خلية ${i + 1}-${j + 1}</td>`;
          }
          tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table><p><br></p>';
        
        const index = range?.index || 0;
        quill.clipboard.dangerouslyPasteHTML(index, tableHTML);
        
        if (advancedEditor && typeof advancedEditor.updateContent === 'function') {
          advancedEditor.updateContent(quill.root.innerHTML);
        }
      }
    } catch (error) {
      console.error('Error inserting table:', error);
    }
    
    setIsTableModalOpen(false);
  };

  const applyTemplate = (template: EditorTemplate) => {
    onChange(template.content);
    advancedEditor.updateContent(template.content);
    setIsTemplateModalOpen(false);
    toast({
      title: 'تم تطبيق القالب',
      description: `تم تطبيق قالب: ${template.name}`
    });
  };

  const restoreFromHistory = (historyItem: EditorHistory) => {
    onChange(historyItem.content);
    advancedEditor.updateContent(historyItem.content);
    setIsHistoryModalOpen(false);
    toast({
      title: 'تم استعادة الإصدار',
      description: `تم استعادة الإصدار من ${historyItem.timestamp.toLocaleTimeString('ar-SA')}`
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Editor Interface with Comprehensive Tabs */}
      <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="editor" className="gap-2">
            <FileText className="h-4 w-4" />
            المحرر
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            المعاينة
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            التحليل
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="spellcheck" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            التدقيق
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <Download className="h-4 w-4" />
            التصدير
          </TabsTrigger>
        </TabsList>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-4">
          {/* Advanced Toolbar Integration */}
          <AdvancedToolbar
            editor={quillRef.current?.getEditor()}
            onImageInsert={() => setIsImageModalOpen(true)}
            onVideoInsert={() => {
              // إضافة فيديو - يمكن توسيعها لاحقاً
              const videoUrl = prompt('أدخل رابط الفيديو:');
              if (videoUrl) {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  const range = quill.getSelection();
                  quill.insertEmbed(range?.index || 0, 'video', videoUrl);
                  advancedEditor.updateContent(quill.root.innerHTML);
                }
              }
            }}
            onTableInsert={() => setIsTableModalOpen(true)}
            onLinkInsert={() => setIsLinkModalOpen(true)}
            onSettingsOpen={() => setIsSettingsModalOpen(true)}
            onHistoryOpen={() => setIsHistoryModalOpen(true)}
            onSave={() => advancedEditor.save()}
            language={language}
          />

          {/* Additional Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStylePanelOpen(true)}
              className="gap-2"
            >
              <Palette className="h-4 w-4" />
              لوحة التصميم
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsColorPickerOpen(true)}
              className="gap-2"
            >
              <Brush className="h-4 w-4" />
              منتقي الألوان
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsThemeBuilderOpen(true)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              منشئ التصاميم
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTemplateManagerOpen(true)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              مدير القوالب
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPerformanceOptimizerOpen(true)}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              محسن الأداء
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSmartCacheManagerOpen(true)}  
              className="gap-2"
            >
              <Database className="h-4 w-4" />
              مدير التخزين المؤقت
            </Button>
          </div>

          {/* Enhanced Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/30 border border-border rounded-lg text-sm">
            <div className="flex items-center gap-4">
              <Badge variant={advancedEditor.isDirty ? "destructive" : "secondary"}>
                {advancedEditor.isDirty ? 'غير محفوظ' : 'محفوظ'}
              </Badge>
              
              {advancedEditor.lastSaved && (
                <span className="text-xs text-muted-foreground">
                  آخر حفظ: {advancedEditor.lastSaved.toLocaleTimeString('ar-SA')}
                </span>
              )}

              {advancedEditor.isAutoSaving && (
                <span className="text-xs text-amber-600 animate-pulse">
                  جاري الحفظ التلقائي...
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{advancedEditor.wordCount} كلمة</span>
                <span>•</span>
                <span>{advancedEditor.characterCount} حرف</span>
                <span>•</span>
                <span>{advancedEditor.readingTime} دقيقة قراءة</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="text-xs gap-2"
                >
                  <Layout className="h-3 w-3" />
                  القوالب
                </Button>
                
                {enableAI && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAIAssistantOpen(true)}
                    className="text-xs gap-2"
                  >
                    <Brain className="h-3 w-3" />
                    المساعد الذكي
                  </Button>
                )}
                
                {enableVersionHistory && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsVersionHistoryOpen(true)}
                    className="text-xs gap-2"
                  >
                    <Clock className="h-3 w-3" />
                    المراجعات
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Editor - مع حماية إضافية */}
          <div className="relative">
            {value !== undefined && (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
                readOnly={disabled}
                style={{
                  direction: language === 'ar' ? 'rtl' : 'ltr',
                  textAlign: language === 'ar' ? 'right' : 'left'
                }}
                className={`
                  bg-background text-foreground
                  [&_.ql-toolbar]:bg-card [&_.ql-toolbar]:border-border
                  [&_.ql-container]:bg-background [&_.ql-container]:border-border
                  [&_.ql-editor]:text-foreground
                  ${language === 'ar' ? '[&_.ql-editor]:text-right [&_.ql-editor]:direction-rtl' : ''}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              />
            )}
          </div>
        </TabsContent>

        {/* Live Preview Tab */}
        <TabsContent value="preview">
          <LivePreviewPanel
            content={value}
            isVisible={true}
            onToggle={() => {}}
            language={language}
            pageKey={pageKey}
            elementKey={elementKey}
            elementType="rich_text"
          />
        </TabsContent>

        {/* Content Analysis Tab */}
        <TabsContent value="analysis">
          <ContentAnalyzer
            content={value}
            language={language}
            isVisible={true}
          />
        </TabsContent>

        {/* SEO Tools Tab */}
        <TabsContent value="seo">
          <SEOToolbox
            content={value}
            language={language}
            isVisible={true}
            onUpdateContent={(updatedContent) => {
              onChange(updatedContent);
              advancedEditor.updateContent(updatedContent);
            }}
          />
        </TabsContent>

        {/* Spell Checker Tab */}
        <TabsContent value="spellcheck">
          <SpellChecker
            content={value}
            language={language}
            isVisible={true}
            onContentChange={(correctedContent) => {
              onChange(correctedContent);
              advancedEditor.updateContent(correctedContent);
            }}
          />
        </TabsContent>

        {/* Export Tools Tab */}
        <TabsContent value="export">
          <ExportTools
            content={value}
            language={language}
            isVisible={true}
            title="المحتوى"
            metadata={initialMetadata}
          />
        </TabsContent>
      </Tabs>

      {/* Templates Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>اختيار قالب</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="أخبار">أخبار</TabsTrigger>
              <TabsTrigger value="إعلانات">إعلانات</TabsTrigger>
              <TabsTrigger value="أكاديمي">أكاديمي</TabsTrigger>
            </TabsList>
            
            {['all', 'أخبار', 'إعلانات', 'أكاديمي'].map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates
                    .filter(template => category === 'all' || template.category === category)
                    .map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => applyTemplate(template)}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{template.preview}</p>
                          <Badge variant="outline">{template.category}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* AI Content Assistant */}
      {enableAI && (
        <AIContentAssistant
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          currentContent={value}
          onContentUpdate={(newContent) => {
            onChange(newContent);
            advancedEditor.updateContent(newContent);
          }}
          language={language}
        />
      )}

      {/* Version History */}
      {enableVersionHistory && (
        <VersionHistory
          isOpen={isVersionHistoryOpen}
          onClose={() => setIsVersionHistoryOpen(false)}
          currentContent={value}
          onRestore={(content) => {
            onChange(content);
            advancedEditor.updateContent(content);
          }}
          elementId={elementId}
        />
      )}

      {/* Image Editor */}
      {selectedImageForEdit && enableImageEditing && (
        <ImageEditor
          isOpen={!!selectedImageForEdit}
          onClose={() => setSelectedImageForEdit(null)}
          imageSrc={selectedImageForEdit}
          onSave={(editedUrl) => {
            // استبدال الصورة في المحرر
            const currentContent = value.replace(selectedImageForEdit, editedUrl);
            onChange(currentContent);
            advancedEditor.updateContent(currentContent);
            setSelectedImageForEdit(null);
          }}
        />
      )}

      {/* History Modal */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تاريخ التعديلات</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2">
            {(advancedEditor.history || []).slice().reverse().map((item, index) => (
              <Card key={item.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => restoreFromHistory(item)}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.timestamp.toLocaleString('ar-SA')}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      استعادة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {(advancedEditor.history || []).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                لا يوجد تاريخ للتعديلات
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إعدادات المحرر</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="font-size">حجم الخط</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="font-family">نوع الخط</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="line-height">ارتفاع السطر</Label>
              <Select value={lineHeight} onValueChange={setLineHeight}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">1.2</SelectItem>
                  <SelectItem value="1.4">1.4</SelectItem>
                  <SelectItem value="1.6">1.6</SelectItem>
                  <SelectItem value="1.8">1.8</SelectItem>
                  <SelectItem value="2.0">2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="spell-check"
                checked={enableSpellCheck}
                onCheckedChange={setEnableSpellCheck}
              />
              <Label htmlFor="spell-check">التدقيق الإملائي</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-save"
                checked={enableAutoSave}
                onCheckedChange={setEnableAutoSave}
              />
              <Label htmlFor="auto-save">الحفظ التلقائي</Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Media Manager */}
      <MediaManager
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={(media) => {
          const { data: { publicUrl } } = supabase.storage
            .from('site-media')
            .getPublicUrl(media.file_path);
          insertImage(publicUrl, media.alt_text_ar || media.original_name);
          setIsImageModalOpen(false);
        }}
        allowMultiple={false}
        mediaType="image"
      />

      {/* Link Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إدراج رابط</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-text">نص الرابط</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="اكتب النص المراد ربطه"
              />
            </div>
            
            <div>
              <Label htmlFor="link-url">عنوان الرابط</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsLinkModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button 
                onClick={insertLink}
                disabled={!linkText || !linkUrl}
              >
                إدراج الرابط
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table Modal */}
      <Dialog open={isTableModalOpen} onOpenChange={setIsTableModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إدراج جدول</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="table-rows">عدد الصفوف</Label>
                <Input
                  id="table-rows"
                  type="number"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                  min="1"
                  max="20"
                />
              </div>
              
              <div>
                <Label htmlFor="table-cols">عدد الأعمدة</Label>
                <Input
                  id="table-cols"
                  type="number"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsTableModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={insertTable}>
                إدراج الجدول
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Style Panel */}
      <StylePanel
        isOpen={isStylePanelOpen}
        onClose={() => setIsStylePanelOpen(false)}
        selectedElement={selectedElement}
        onStyleChange={(styles) => {
          // Apply styles to selected element or entire editor
          const quill = quillRef.current?.getEditor();
          if (quill && editorReady) {
            const selection = quill.getSelection();
            if (selection && selection.length > 0) {
              // Apply to selected text
              Object.entries(styles).forEach(([property, value]) => {
                if (property === 'fontSize') {
                  quill.format('size', value + 'px');
                } else if (property === 'color') {
                  quill.format('color', value);
                } else if (property === 'fontFamily') {
                  quill.format('font', value);
                }
              });
            } else {
              // Apply to editor root as fallback
              if (quill.root) {
                Object.entries(styles).forEach(([property, value]) => {
                  if (property === 'fontSize') {
                    quill.root.style.fontSize = value + 'px';
                  } else if (property === 'color') {
                    quill.root.style.color = value;
                  } else if (property === 'fontFamily') {
                    quill.root.style.fontFamily = value;
                  } else if (property === 'backgroundColor') {
                    quill.root.style.backgroundColor = value;
                  }
                });
              }
            }
          }
        }}
      />

      {/* Color Picker */}
      <ColorPicker
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        onColorSelect={(color) => {
          const quill = quillRef.current?.getEditor();
          if (quill && editorReady) {
            const selection = quill.getSelection();
            if (selection && selection.length > 0) {
              // Apply color to selected text
              quill.format('color', color);
            } else {
              // Apply as default color
              if (quill.root) {
                quill.root.style.color = color;
              }
            }
            
            if (advancedEditor && typeof advancedEditor.updateContent === 'function') {
              advancedEditor.updateContent(quill.root.innerHTML);
            }
          }
        }}
      />

      {/* Template Manager */}
      <TemplateManager
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
        onTemplateSelect={(template) => {
          const content = language === 'ar' ? template.content.ar : template.content.en;
          onChange(content);
          if (advancedEditor && typeof advancedEditor.updateContent === 'function') {
            advancedEditor.updateContent(content);
          }
        }}
        currentContent={value}
        language={language}
      />

      {/* Performance Optimizer */}
      <PerformanceOptimizer
        isOpen={isPerformanceOptimizerOpen}
        onClose={() => setIsPerformanceOptimizerOpen(false)}
      />

      {/* Smart Cache Manager */}
      <SmartCacheManager
        isOpen={isSmartCacheManagerOpen}
        onClose={() => setIsSmartCacheManagerOpen(false)}
      />

      {/* Theme Builder Dialog Wrapper */}
      <Dialog open={isThemeBuilderOpen} onOpenChange={setIsThemeBuilderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <ThemeBuilder
            isOpen={isThemeBuilderOpen}
            onClose={() => setIsThemeBuilderOpen(false)}
            onThemeApply={(theme) => {
              // Apply theme by setting CSS variables on :root
              const root = document.documentElement;
              Object.entries(theme.colors).forEach(([key, value]) => {
                const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                root.style.setProperty(`--${cssVar}`, value);
              });
              
              // Apply typography
              root.style.setProperty('--font-family', theme.typography.fontFamily);
              
              toast({
                title: 'تم تطبيق التصميم',
                description: `تم تطبيق تصميم: ${theme.name}`
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};