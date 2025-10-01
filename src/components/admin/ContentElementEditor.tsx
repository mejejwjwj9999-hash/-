import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Save, X, Eye, Loader2, FileText, Edit3, Image, 
  Link, MousePointer, Globe, Languages, Settings,
  AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { EnhancedWysiwygEditor } from './EnhancedWysiwygEditor';
import { useUpdateContentElement, useContentPages, ContentElement } from '@/hooks/useContentEditor';
import { toast } from '@/hooks/use-toast';

interface ContentElementEditorProps {
  element?: ContentElement | null;
  pageKey?: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

export const ContentElementEditor: React.FC<ContentElementEditorProps> = ({
  element,
  pageKey,
  onSaved,
  onCancel
}) => {
  const [selectedPageKey, setSelectedPageKey] = useState(pageKey || '');
  const [elementKey, setElementKey] = useState(element?.element_key || '');
  const [elementType, setElementType] = useState<'text' | 'rich_text' | 'image' | 'link' | 'button' | 'icon' | 'stat' | 'layout' | 'background' | 'animation'>(
    element?.element_type || 'rich_text'
  );
  const [contentAr, setContentAr] = useState(element?.content_ar || '');
  const [contentEn, setContentEn] = useState(element?.content_en || '');
  const [metadata, setMetadata] = useState(element?.metadata || {});
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    (element?.status as 'draft' | 'published' | 'archived') || 'draft'
  );
  const [isActive, setIsActive] = useState(element?.is_active ?? true);
  const [displayOrder, setDisplayOrder] = useState(element?.display_order || 0);
  const [activeLanguage, setActiveLanguage] = useState<'ar' | 'en'>('ar');
  const [isPreview, setIsPreview] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const { data: pages } = useContentPages();
  const updateElementMutation = useUpdateContentElement();

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && element && elementKey && selectedPageKey) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [contentAr, contentEn, metadata, autoSave, element]);

  const handleAutoSave = async () => {
    if (!element || !elementKey || !selectedPageKey) return;

    try {
      await updateElementMutation.mutateAsync({
        pageKey: selectedPageKey,
        elementKey,
        elementType,
        contentAr,
        contentEn,
        metadata,
        status: 'draft' // Auto-save always as draft
      });
    } catch (error) {
      // Silent fail for auto-save
      console.error('Auto-save failed:', error);
    }
  };

  const handleSave = async (saveStatus: 'draft' | 'published' | 'archived' = status as 'draft' | 'published' | 'archived') => {
    if (!elementKey || !selectedPageKey) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    try {
      await updateElementMutation.mutateAsync({
        pageKey: selectedPageKey,
        elementKey,
        elementType,
        contentAr,
        contentEn,
        metadata: {
          ...metadata,
          isActive,
          displayOrder
        },
        status: saveStatus as 'draft' | 'published' | 'archived'
      });

      onSaved();
    } catch (error) {
      console.error('Error saving element:', error);
    }
  };

  const getElementTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'rich_text':
        return <Edit3 className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'link':
        return <Link className="w-4 h-4" />;
      case 'button':
        return <MousePointer className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const renderContentEditor = () => {
    const editorProps = {
      value: activeLanguage === 'ar' ? contentAr : contentEn,
      onChange: activeLanguage === 'ar' ? setContentAr : setContentEn,
      placeholder: activeLanguage === 'ar' ? 'اكتب المحتوى العربي هنا...' : 'Enter English content here...',
      language: activeLanguage,
      height: '400px'
    };

    switch (elementType) {
      case 'rich_text':
        return (
          <EnhancedWysiwygEditor
            {...editorProps}
            onAutoSave={autoSave ? handleAutoSave : undefined}
            autoSave={autoSave}
            showAdvancedFeatures={true}
            pageKey={selectedPageKey || undefined}
            elementKey={elementKey}
            enableAI={true}
            enableVersionHistory={true}
            enableImageEditing={true}
          />
        );
      case 'text':
        return (
          <Textarea
            value={editorProps.value}
            onChange={(e) => editorProps.onChange(e.target.value)}
            placeholder={editorProps.placeholder}
            rows={8}
            className={`resize-y ${activeLanguage === 'ar' ? 'text-right' : 'text-left'}`}
          />
        );
      case 'image':
        return (
          <div className="space-y-4">
            <Input
              value={editorProps.value}
              onChange={(e) => editorProps.onChange(e.target.value)}
              placeholder={activeLanguage === 'ar' ? 'رابط الصورة' : 'Image URL'}
            />
            {editorProps.value && (
              <div className="border rounded-lg p-4">
                <img 
                  src={editorProps.value} 
                  alt="Preview" 
                  className="max-w-full h-auto max-h-64 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="space-y-4">
            <Input
              value={editorProps.value}
              onChange={(e) => editorProps.onChange(e.target.value)}
              placeholder={activeLanguage === 'ar' ? 'نص الرابط' : 'Link text'}
            />
            <Input
              value={metadata.url || ''}
              onChange={(e) => setMetadata({ ...metadata, url: e.target.value })}
              placeholder={activeLanguage === 'ar' ? 'عنوان الرابط' : 'Link URL'}
              type="url"
            />
          </div>
        );
      case 'button':
        return (
          <div className="space-y-4">
            <Input
              value={editorProps.value}
              onChange={(e) => editorProps.onChange(e.target.value)}
              placeholder={activeLanguage === 'ar' ? 'نص الزر' : 'Button text'}
            />
            <Input
              value={metadata.action || ''}
              onChange={(e) => setMetadata({ ...metadata, action: e.target.value })}
              placeholder={activeLanguage === 'ar' ? 'إجراء الزر' : 'Button action'}
            />
            <Select
              value={metadata.variant || 'default'}
              onValueChange={(value) => setMetadata({ ...metadata, variant: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="نمط الزر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">افتراضي</SelectItem>
                <SelectItem value="secondary">ثانوي</SelectItem>
                <SelectItem value="outline">مخطط</SelectItem>
                <SelectItem value="ghost">شفاف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getElementTypeIcon(elementType)}
          <div>
            <h3 className="text-lg font-semibold">
              {element ? 'تحرير العنصر' : 'إنشاء عنصر جديد'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {element ? `تحرير: ${element.element_key}` : 'إنشاء عنصر محتوى جديد'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-save" className="text-sm">حفظ تلقائي</Label>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'تحرير' : 'معاينة'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                محرر المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الصفحة *</Label>
                  <Select value={selectedPageKey} onValueChange={setSelectedPageKey}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصفحة" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages?.map((page) => (
                        <SelectItem key={page.id} value={page.page_key}>
                          {page.page_name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>مفتاح العنصر *</Label>
                  <Input
                    value={elementKey}
                    onChange={(e) => setElementKey(e.target.value)}
                    placeholder="مثل: hero_title, description"
                    disabled={!!element} // Disable editing key for existing elements
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>نوع العنصر</Label>
                  <Select 
                    value={elementType} 
                    onValueChange={(value: 'text' | 'rich_text' | 'image' | 'link' | 'button') => setElementType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">نص عادي</SelectItem>
                      <SelectItem value="rich_text">نص منسق (WYSIWYG)</SelectItem>
                      <SelectItem value="image">صورة</SelectItem>
                      <SelectItem value="link">رابط</SelectItem>
                      <SelectItem value="button">زر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                   <Select 
                     value={status} 
                     onValueChange={(value: 'draft' | 'published' | 'archived') => setStatus(value)}
                   >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ترتيب العرض</Label>
                  <Input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Language Tabs */}
              <Tabs value={activeLanguage} onValueChange={(value: 'ar' | 'en') => setActiveLanguage(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ar" className="gap-2">
                    <Languages className="h-4 w-4" />
                    العربية
                  </TabsTrigger>
                  <TabsTrigger value="en" className="gap-2">
                    <Globe className="h-4 w-4" />
                    English
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ar" className="space-y-4">
                  <div className="space-y-2">
                    <Label>المحتوى العربي</Label>
                    {isPreview ? (
                      <div className="border rounded-lg p-4 bg-muted/20 min-h-[200px]">
                        <div className="text-right" dangerouslySetInnerHTML={{ __html: contentAr || 'لا يوجد محتوى' }} />
                      </div>
                    ) : (
                      renderContentEditor()
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label>English Content</Label>
                    {isPreview ? (
                      <div className="border rounded-lg p-4 bg-muted/20 min-h-[200px]">
                        <div className="text-left" dangerouslySetInnerHTML={{ __html: contentEn || 'No content' }} />
                      </div>
                    ) : (
                      renderContentEditor()
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Element Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات العنصر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-active">تفعيل العنصر</Label>
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="space-y-2">
                <Label>حالة النشر</Label>
                <div className="flex items-center gap-2">
                   {status === 'published' && <CheckCircle className="w-4 h-4 text-green-500" />}
                   {status === 'draft' && <Clock className="w-4 h-4 text-yellow-500" />}
                   {status === 'archived' && <AlertCircle className="w-4 h-4 text-gray-500" />}
                  <Badge className={
                    status === 'published' ? 'bg-green-100 text-green-800' :
                    status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {status === 'published' ? 'منشور' : 
                     status === 'draft' ? 'مسودة' : 'مؤرشف'}
                  </Badge>
                </div>
              </div>

              {element && (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <strong>تاريخ الإنشاء:</strong><br />
                    {new Date(element.created_at).toLocaleString('ar')}
                  </div>
                  <div>
                    <strong>آخر تحديث:</strong><br />
                    {new Date(element.updated_at).toLocaleString('ar')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={() => handleSave('published')}
                disabled={updateElementMutation.isPending}
                className="w-full"
              >
                {updateElementMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                حفظ ونشر
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                disabled={updateElementMutation.isPending}
                className="w-full"
              >
                حفظ كمسودة
              </Button>
              
              <Button
                variant="ghost"
                onClick={onCancel}
                disabled={updateElementMutation.isPending}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};