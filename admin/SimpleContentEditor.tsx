import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useContentElements, useUpdateContentElement, useContentPages } from '@/hooks/useContentEditor';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, Plus, Save, Eye, Edit, Trash2, 
  Globe, Languages, Clock, CheckCircle, RefreshCw
} from 'lucide-react';

interface ContentElement {
  id: string;
  page_id: string;
  element_key: string;
  element_type: 'text' | 'rich_text' | 'image' | 'link' | 'button';
  content_ar: string;
  content_en: string;
  metadata: any;
  status: 'draft' | 'published' | 'archived';
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const DEFAULT_PAGES = [
  { page_key: 'home', page_name_ar: 'الصفحة الرئيسية', page_name_en: 'Home Page' },
  { page_key: 'about', page_name_ar: 'حول الكلية', page_name_en: 'About College' },
  { page_key: 'programs', page_name_ar: 'البرامج الأكاديمية', page_name_en: 'Academic Programs' },
  { page_key: 'news', page_name_ar: 'الأخبار والفعاليات', page_name_en: 'News & Events' },
  { page_key: 'contact', page_name_ar: 'اتصل بنا', page_name_en: 'Contact Us' },
  { page_key: 'services', page_name_ar: 'الخدمات الطلابية', page_name_en: 'Student Services' }
];

export const SimpleContentEditor: React.FC = () => {
  const [selectedPageKey, setSelectedPageKey] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [selectedElementKey, setSelectedElementKey] = useState<string>('');
  const [elementType, setElementType] = useState<'text' | 'rich_text'>('rich_text');
  const [contentAr, setContentAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [metadata, setMetadata] = useState({});
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [activeLanguage, setActiveLanguage] = useState<'ar' | 'en'>('ar');
  const [editingElement, setEditingElement] = useState<ContentElement | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const { data: pages, refetch: refetchPages } = useContentPages();
  const { data: elements, refetch: refetchElements } = useContentElements(selectedPageId);
  const updateElementMutation = useUpdateContentElement();

  // إنشاء الصفحات الافتراضية إذا لم تكن موجودة
  useEffect(() => {
    const initializePages = async () => {
      try {
        // التحقق من وجود صفحات
        const { data: existingPages, error } = await supabase
          .from('admin_content_pages')
          .select('page_key')
          .eq('is_active', true);

        if (error) {
          console.error('Error checking pages:', error);
          setIsInitializing(false);
          return;
        }

        const existingPageKeys = existingPages?.map(p => p.page_key) || [];
        const pagesToCreate = DEFAULT_PAGES.filter(p => !existingPageKeys.includes(p.page_key));

        if (pagesToCreate.length > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          
          const pagesToInsert = pagesToCreate.map((page, index) => ({
            page_key: page.page_key,
            page_name_ar: page.page_name_ar,
            page_name_en: page.page_name_en,
            description_ar: `وصف ${page.page_name_ar}`,
            description_en: `Description for ${page.page_name_en}`,
            is_active: true,
            display_order: index + 1,
            created_by: user?.id,
            updated_by: user?.id
          }));

          const { error: insertError } = await supabase
            .from('admin_content_pages')
            .insert(pagesToInsert);

          if (insertError) {
            console.error('Error creating default pages:', insertError);
          } else {
            toast({
              title: 'تم إنشاء الصفحات الافتراضية',
              description: `تم إنشاء ${pagesToCreate.length} صفحة افتراضية`
            });
            refetchPages();
          }
        }
      } catch (error) {
        console.error('Error initializing pages:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializePages();
  }, [refetchPages]);

  // تحديث page_id عند تغيير selectedPageKey
  useEffect(() => {
    if (selectedPageKey && pages) {
      const selectedPage = pages.find(p => p.page_key === selectedPageKey);
      if (selectedPage) {
        setSelectedPageId(selectedPage.id);
      }
    }
  }, [selectedPageKey, pages]);

  const handleCreateOrUpdateElement = async () => {
    if (!selectedPageKey || !selectedElementKey) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار الصفحة ومفتاح العنصر',
        variant: 'destructive'
      });
      return;
    }

    try {
      await updateElementMutation.mutateAsync({
        pageKey: selectedPageKey,
        elementKey: selectedElementKey,
        elementType,
        contentAr,
        contentEn,
        metadata,
        status
      });

      // Reset form
      setSelectedElementKey('');
      setContentAr('');
      setContentEn('');
      setMetadata({});
      setEditingElement(null);
      refetchElements();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleEditElement = (element: ContentElement) => {
    setEditingElement(element);
    setSelectedElementKey(element.element_key);
    setElementType(element.element_type as 'text' | 'rich_text');
    setContentAr(element.content_ar || '');
    setContentEn(element.content_en || '');
    setMetadata(element.metadata || {});
    setStatus(element.status as 'draft' | 'published');
  };

  const resetForm = () => {
    setEditingElement(null);
    setSelectedElementKey('');
    setContentAr('');
    setContentEn('');
    setMetadata({});
    setStatus('draft');
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>جاري تهيئة المحرر...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">محرر المحتوى</h1>
          <p className="text-muted-foreground">إدارة وتحرير محتوى الموقع</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={resetForm} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            عنصر جديد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {editingElement ? 'تحرير العنصر' : 'إنشاء عنصر جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Page and Element Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الصفحة</Label>
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
                  <Label>مفتاح العنصر</Label>
                  <Input
                    value={selectedElementKey}
                    onChange={(e) => setSelectedElementKey(e.target.value)}
                    placeholder="مثل: hero_title, description"
                  />
                </div>
              </div>

              {/* Element Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع العنصر</Label>
                  <Select value={elementType} onValueChange={(value: 'text' | 'rich_text') => setElementType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">نص عادي</SelectItem>
                      <SelectItem value="rich_text">نص منسق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {elementType === 'rich_text' ? (
                    <div className="space-y-2">
                      <Label>المحتوى العربي (منسق)</Label>
                      <RichTextEditor
                        value={contentAr}
                        onChange={setContentAr}
                        placeholder="اكتب المحتوى العربي هنا..."
                        height="400px"
                        label=""
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>المحتوى العربي</Label>
                      <Input
                        value={contentAr}
                        onChange={(e) => setContentAr(e.target.value)}
                        placeholder="اكتب المحتوى العربي هنا..."
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  {elementType === 'rich_text' ? (
                    <div className="space-y-2">
                      <Label>English Content (Formatted)</Label>
                      <RichTextEditor
                        value={contentEn}
                        onChange={setContentEn}
                        placeholder="Enter English content here..."
                        height="400px"
                        label=""
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>English Content</Label>
                      <Input
                        value={contentEn}
                        onChange={(e) => setContentEn(e.target.value)}
                        placeholder="Enter English content here..."
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateOrUpdateElement}
                  disabled={updateElementMutation.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingElement ? 'تحديث' : 'حفظ'}
                </Button>
                
                {editingElement && (
                  <Button onClick={resetForm} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    عنصر جديد
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Elements List Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                عناصر المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPageKey ? (
                <div className="space-y-3">
                  {elements?.map((element: ContentElement) => (
                    <div
                      key={element.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        editingElement?.id === element.id ? 'bg-primary/10 border-primary' : ''
                      }`}
                      onClick={() => handleEditElement(element)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium truncate">{element.element_key}</h4>
                        <div className="flex gap-1">
                          <Badge 
                            variant={element.status === 'published' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {element.status === 'published' ? 'منشور' : 'مسودة'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {element.element_type === 'rich_text' ? 'منسق' : 'نص'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {element.content_ar || element.content_en || 'لا يوجد محتوى'}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(element.updated_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  ))}
                  
                  {!elements?.length && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      لا توجد عناصر محتوى لهذه الصفحة
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  اختر صفحة لعرض عناصر المحتوى
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};