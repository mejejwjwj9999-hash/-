import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, Plus, Save, Eye, Edit3, Trash2, 
  Globe, Languages, Clock, CheckCircle, RefreshCw,
  Search, Filter, Calendar, User, Image, Link, MousePointer,
  Settings, BookOpen, Layout, Layers, Palette
} from 'lucide-react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { ElementLibrary } from '@/components/content-editor/ElementLibrary';
import { VisualEditor } from '@/components/content-editor/VisualEditor';
import { ElementPropertiesPanel } from '@/components/content-editor/ElementPropertiesPanel';
import { ContentElementEditor } from './ContentElementEditor';
import { ContentPageManager } from './ContentPageManager';
import { ContentPreviewPanel } from './ContentPreviewPanel';
import { useContentElements, useContentPages, ContentElement, useUpdateContentElement, useDeleteContentElement } from '@/hooks/useContentEditor';
import { useToast } from '@/hooks/use-toast';

export const AdvancedContentManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('visual-editor');
  const [selectedPageKey, setSelectedPageKey] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<ContentElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [isElementEditorOpen, setIsElementEditorOpen] = useState(false);
  const [isPageManagerOpen, setIsPageManagerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [elementCategory, setElementCategory] = useState('all');
  const [draggedElement, setDraggedElement] = useState<string | null>(null);

  const { data: pages, refetch: refetchPages } = useContentPages();
  const { data: elements, refetch: refetchElements } = useContentElements(selectedPageId || undefined);
  const updateElementMutation = useUpdateContentElement();
  const deleteElementMutation = useDeleteContentElement();

  // تحديث page_id عند تغيير selectedPageKey
  useEffect(() => {
    if (selectedPageKey && pages) {
      const selectedPage = pages.find(p => p.page_key === selectedPageKey);
      if (selectedPage) {
        setSelectedPageId(selectedPage.id);
      }
    }
  }, [selectedPageKey, pages]);

  const getElementIcon = (type: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const filteredElements = elements?.filter(element => {
    const matchesSearch = searchTerm === '' || 
      element.element_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.content_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.content_en?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || element.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleElementEdit = (element: ContentElement) => {
    setSelectedElement(element);
    setIsElementEditorOpen(true);
  };

  const handleElementCreate = () => {
    setSelectedElement(null);
    setIsElementEditorOpen(true);
  };

  const handleElementSaved = () => {
    setIsElementEditorOpen(false);
    setSelectedElement(null);
    refetchElements();
    toast({
      title: 'تم حفظ العنصر بنجاح',
      description: 'تم تحديث محتوى العنصر في قاعدة البيانات'
    });
  };

  const handlePageSaved = () => {
    setIsPageManagerOpen(false);
    refetchPages();
    toast({
      title: 'تم حفظ الصفحة بنجاح',
      description: 'تم تحديث معلومات الصفحة في قاعدة البيانات'
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setDraggedElement(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedElement(null);

    if (!over) return;

    // Handle adding new element from library
    if (active.data.current?.type === 'element-type' && over.id === 'visual-editor-dropzone') {
      handleAddNewElement(
        active.data.current.elementType,
        active.data.current.name
      );
      return;
    }

    // Handle reordering existing elements
    if (elements && active.id !== over.id) {
      const oldIndex = elements.findIndex(el => el.id === active.id);
      const newIndex = elements.findIndex(el => el.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newElements = arrayMove(elements, oldIndex, newIndex);
        handleReorderElements(newElements.map(el => el.id));
      }
    }
  };

  const handleAddNewElement = async (elementType: ContentElement['element_type'], name: string) => {
    if (!selectedPageKey) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار صفحة أولاً',
        variant: 'destructive'
      });
      return;
    }

    try {
      const elementKey = `${elementType}_${Date.now()}`;
      await updateElementMutation.mutateAsync({
        pageKey: selectedPageKey,
        elementKey,
        elementType,
        contentAr: name,
        contentEn: name,
        metadata: {},
        status: 'draft'
      });

      refetchElements();
      toast({
        title: 'تم إضافة العنصر',
        description: `تم إضافة ${name} إلى الصفحة بنجاح`
      });
    } catch (error) {
      console.error('Error adding element:', error);
    }
  };

  const handleReorderElements = async (elementIds: string[]) => {
    // Implementation for reordering elements
    // This would typically involve updating display_order in database
    console.log('Reorder elements:', elementIds);
  };

  const handleDeleteElement = async (elementId: string) => {
    try {
      await deleteElementMutation.mutateAsync(elementId);
      refetchElements();
      if (selectedElement?.id === elementId) {
        setSelectedElement(null);
      }
      toast({
        title: 'تم حذف العنصر',
        description: 'تم حذف العنصر من الصفحة بنجاح'
      });
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };

  const handleDuplicateElement = async (element: ContentElement) => {
    if (!selectedPageKey) return;

    try {
      const newElementKey = `${element.element_key}_copy_${Date.now()}`;
      await updateElementMutation.mutateAsync({
        pageKey: selectedPageKey,
        elementKey: newElementKey,
        elementType: element.element_type,
        contentAr: element.content_ar,
        contentEn: element.content_en,
        metadata: element.metadata,
        status: 'draft'
      });

      refetchElements();
      toast({
        title: 'تم نسخ العنصر',
        description: 'تم إنشاء نسخة من العنصر بنجاح'
      });
    } catch (error) {
      console.error('Error duplicating element:', error);
    }
  };

  const handleToggleElementVisibility = async (elementId: string, currentVisibility: boolean) => {
    // Implementation for toggling element visibility
    // This would involve updating is_active field
    console.log('Toggle visibility:', elementId, !currentVisibility);
  };

  const handleElementUpdate = (updatedElement: ContentElement) => {
    // Real-time preview update
    setSelectedElement(updatedElement);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">المحرر المرئي للمحتوى</h1>
            <p className="text-muted-foreground">نظام السحب والإفلات المتقدم لإدارة وتحرير محتوى الموقع</p>
          </div>
          <div className="flex items-center gap-2">
          <Dialog open={isPageManagerOpen} onOpenChange={setIsPageManagerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                إدارة الصفحات
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>إدارة الصفحات</DialogTitle>
              </DialogHeader>
              <ContentPageManager
                onPageSaved={handlePageSaved}
                onPageSelected={(pageKey) => {
                  setSelectedPageKey(pageKey);
                  setIsPageManagerOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isElementEditorOpen} onOpenChange={setIsElementEditorOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleElementCreate}>
                <Plus className="w-4 h-4 mr-2" />
                عنصر جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedElement ? 'تحرير العنصر' : 'إنشاء عنصر جديد'}
                </DialogTitle>
              </DialogHeader>
              <ContentElementEditor
                element={selectedElement}
                pageKey={selectedPageKey}
                onSaved={handleElementSaved}
                onCancel={() => setIsElementEditorOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" dir="rtl">
            <TabsTrigger value="visual-editor" className="gap-2">
              <Palette className="w-4 h-4" />
              المحرر المرئي
            </TabsTrigger>
            <TabsTrigger value="elements" className="gap-2">
              <Edit3 className="w-4 h-4" />
              العناصر
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              المعاينة
            </TabsTrigger>
            <TabsTrigger value="pages" className="gap-2">
              <BookOpen className="w-4 h-4" />
              الصفحات
            </TabsTrigger>
          </TabsList>

        <TabsContent value="pages" className="space-y-6">
          {/* Pages Grid */}
          <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pages?.map((page) => (
              <Card key={page.id} 
                    className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                      selectedPageKey === page.page_key ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setSelectedPageKey(page.page_key);
                      setActiveTab('elements');
                    }}>
                <div className="flex items-center justify-between mb-4" dir="rtl">
                  <Badge variant={page.is_active ? 'default' : 'secondary'}>
                    {page.is_active ? 'نشط' : 'غير نشط'}
                  </Badge>
                  <h3 className="text-lg font-semibold text-foreground truncate">{page.page_name_ar}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {page.description_ar || 'لا يوجد وصف'}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>مفتاح: {page.page_key}</span>
                  <span>ترتيب: {page.display_order}</span>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {elements?.filter(el => el.page_id === page.id).length || 0} عنصر
                  </span>
                  <Button size="sm" variant="ghost" onClick={(e) => {
                    e.stopPropagation();
                    // Edit page logic
                  }}>
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="elements" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-row-reverse">
            <select 
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-right"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">جميع الحالات</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="archived">مؤرشف</option>
            </select>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في العناصر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Selected Page Info */}
          {selectedPageKey && (
            <Card className="p-4 bg-primary/5">
              <div className="flex items-center gap-2 text-primary justify-end" dir="rtl">
                <span className="font-medium">
                  الصفحة المحددة: {pages?.find(p => p.page_key === selectedPageKey)?.page_name_ar}
                </span>
                <Eye className="w-4 h-4" />
              </div>
            </Card>
          )}

          {/* Elements List */}
          <div className="space-y-4">
            {!selectedPageKey ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>اختر صفحة من تبويب "الصفحات" لعرض عناصرها</p>
                </div>
              </Card>
            ) : filteredElements?.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد عناصر تطابق البحث</p>
                  <Button className="mt-4" onClick={handleElementCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء عنصر جديد
                  </Button>
                </div>
              </Card>
            ) : (
              filteredElements?.map((element) => (
                <Card key={element.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between" dir="rtl">
                    <div className="flex items-start gap-4 flex-1 text-right">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 justify-end">
                          <Badge className={getStatusColor(element.status)}>
                            {element.status === 'published' ? 'منشور' : 
                             element.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                          </Badge>
                          <h4 className="font-semibold text-foreground">{element.element_key}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground text-right">
                          النوع: {element.element_type === 'text' ? 'نص بسيط' :
                                  element.element_type === 'rich_text' ? 'نص منسق' :
                                  element.element_type === 'image' ? 'صورة' :
                                  element.element_type === 'link' ? 'رابط' :
                                  element.element_type === 'button' ? 'زر' : element.element_type}
                        </p>
                        {element.content_ar && (
                          <p className="text-sm text-muted-foreground line-clamp-2 text-right">
                            {element.content_ar.length > 100 
                              ? element.content_ar.substring(0, 100) + '...' 
                              : element.content_ar}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground justify-end">
                          {element.published_at && (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              نُشر: {new Date(element.published_at).toLocaleDateString('ar')}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            آخر تحديث: {new Date(element.updated_at).toLocaleDateString('ar')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                        {getElementIcon(element.element_type)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleElementEdit(element)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        تحرير
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

          <TabsContent value="visual-editor" className="space-y-6">
            {!selectedPageKey ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>اختر صفحة من تبويب "الصفحات" لبدء التحرير المرئي</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-12 gap-6 h-[800px]">
                {/* Element Library - Left Panel */}
                <div className="col-span-3">
                  <ElementLibrary
                    selectedCategory={elementCategory}
                    onCategoryChange={setElementCategory}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                  />
                </div>

                {/* Visual Editor - Center Panel */}
                <div className="col-span-6">
                  <VisualEditor
                    elements={filteredElements || []}
                    selectedElement={selectedElement}
                    selectedPageKey={selectedPageKey}
                    onElementSelect={setSelectedElement}
                    onElementEdit={handleElementEdit}
                    onElementDuplicate={handleDuplicateElement}
                    onElementDelete={handleDeleteElement}
                    onElementToggleVisibility={handleToggleElementVisibility}
                  />
                </div>

                {/* Properties Panel - Right Panel */}
                <div className="col-span-3">
                  <ElementPropertiesPanel
                    element={selectedElement}
                    onElementUpdate={handleElementUpdate}
                    onElementDelete={handleDeleteElement}
                    onElementDuplicate={handleDuplicateElement}
                    onClose={() => setSelectedElement(null)}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview">
            <ContentPreviewPanel 
              pageKey={selectedPageKey}
              element={selectedElement}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DndContext>
  );
};