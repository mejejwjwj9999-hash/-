import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, Plus, Edit3, Trash2, Eye, Globe, Languages,
  BookOpen, Settings, AlertCircle, CheckCircle
} from 'lucide-react';
import { useContentPages, ContentPage } from '@/hooks/useContentEditor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ContentPageManagerProps {
  onPageSaved: () => void;
  onPageSelected: (pageKey: string) => void;
}

export const ContentPageManager: React.FC<ContentPageManagerProps> = ({
  onPageSaved,
  onPageSelected
}) => {
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'ar' | 'en'>('ar');
  
  // Form states
  const [pageKey, setPageKey] = useState('');
  const [pageNameAr, setPageNameAr] = useState('');
  const [pageNameEn, setPageNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { data: pages, refetch: refetchPages } = useContentPages();
  
  // Create/Update page functions
  const createPage = async (pageData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('admin_content_pages')
      .insert({
        ...pageData,
        created_by: user?.id,
        updated_by: user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updatePage = async (id: string, pageData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('admin_content_pages')
      .update({
        ...pageData,
        updated_by: user?.id
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const resetForm = () => {
    setSelectedPage(null);
    setIsCreating(false);
    setPageKey('');
    setPageNameAr('');
    setPageNameEn('');
    setDescriptionAr('');
    setDescriptionEn('');
    setIsActive(true);
    setDisplayOrder(0);
  };

  const handleEditPage = (page: ContentPage) => {
    setSelectedPage(page);
    setIsCreating(false);
    setPageKey(page.page_key);
    setPageNameAr(page.page_name_ar);
    setPageNameEn(page.page_name_en);
    setDescriptionAr(page.description_ar || '');
    setDescriptionEn(page.description_en || '');
    setIsActive(page.is_active);
    setDisplayOrder(page.display_order);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsCreating(true);
    setDisplayOrder((pages?.length || 0) + 1);
  };

  const handleSave = async () => {
    if (!pageKey || (!pageNameAr && !pageNameEn)) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء الحقول المطلوبة على الأقل',
        variant: 'destructive'
      });
      return;
    }

    setIsPending(true);
    try {
      if (isCreating) {
        await createPage({
          page_key: pageKey,
          page_name_ar: pageNameAr,
          page_name_en: pageNameEn,
          description_ar: descriptionAr,
          description_en: descriptionEn,
          is_active: isActive,
          display_order: displayOrder
        });
        toast({
          title: 'تم إنشاء الصفحة بنجاح',
          description: 'تم إضافة الصفحة الجديدة إلى قاعدة البيانات'
        });
      } else if (selectedPage) {
        await updatePage(selectedPage.id, {
          page_key: pageKey,
          page_name_ar: pageNameAr,
          page_name_en: pageNameEn,
          description_ar: descriptionAr,
          description_en: descriptionEn,
          is_active: isActive,
          display_order: displayOrder
        });
        toast({
          title: 'تم تحديث الصفحة بنجاح',
          description: 'تم حفظ التغييرات في قاعدة البيانات'
        });
      }

      resetForm();
      refetchPages();
      onPageSaved();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: 'خطأ في حفظ الصفحة',
        description: 'حدث خطأ أثناء حفظ الصفحة',
        variant: 'destructive'
      });
    } finally {
      setIsPending(false);
    }
  };

  const [isPending, setIsPending] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">إدارة الصفحات</h3>
          <p className="text-sm text-muted-foreground">إنشاء وتحرير صفحات الموقع</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          صفحة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                قائمة الصفحات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pages?.map((page) => (
                  <div
                    key={page.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedPage?.id === page.id ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => handleEditPage(page)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{page.page_name_ar}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={page.is_active ? 'default' : 'secondary'}>
                          {page.is_active ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      مفتاح الصفحة: {page.page_key}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ترتيب العرض: {page.display_order}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        الصفحة: {page.page_key}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPageSelected(page.page_key);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPage(page);
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {!pages?.length && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    لا توجد صفحات. أنشئ صفحة جديدة للبدء.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page Editor */}
        <div className="space-y-4">
          {(isCreating || selectedPage) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {isCreating ? 'إنشاء صفحة جديدة' : 'تحرير الصفحة'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>مفتاح الصفحة *</Label>
                    <Input
                      value={pageKey}
                      onChange={(e) => setPageKey(e.target.value)}
                      placeholder="مثل: home, about, contact"
                      disabled={!isCreating} // Can't change key for existing pages
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ترتيب العرض</Label>
                    <Input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="page-active">تفعيل الصفحة</Label>
                  <Switch
                    id="page-active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
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
                      <Label>اسم الصفحة بالعربية *</Label>
                      <Input
                        value={pageNameAr}
                        onChange={(e) => setPageNameAr(e.target.value)}
                        placeholder="مثل: الصفحة الرئيسية"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>وصف الصفحة بالعربية</Label>
                      <Textarea
                        value={descriptionAr}
                        onChange={(e) => setDescriptionAr(e.target.value)}
                        placeholder="وصف مختصر للصفحة"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4">
                    <div className="space-y-2">
                      <Label>English Page Name</Label>
                      <Input
                        value={pageNameEn}
                        onChange={(e) => setPageNameEn(e.target.value)}
                        placeholder="e.g., Home Page"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>English Page Description</Label>
                      <Textarea
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        placeholder="Brief description of the page"
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Page Info for existing pages */}
                {selectedPage && (
                  <div className="p-4 bg-muted/20 rounded-lg space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {selectedPage.is_active ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="font-medium">
                        {selectedPage.is_active ? 'صفحة نشطة' : 'صفحة غير نشطة'}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      <div>معرف الصفحة: {selectedPage.id}</div>
                      <div>مفتاح الصفحة: {selectedPage.page_key}</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating ? 'إنشاء الصفحة' : 'حفظ التغييرات'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={isPending}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isCreating && !selectedPage && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>اختر صفحة من القائمة للتحرير أو أنشئ صفحة جديدة</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};