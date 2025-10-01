import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Eye, FileText, Image as ImageIcon } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { useToast } from '@/hooks/use-toast';

interface AboutCollegeEditorProps {
  pageKey: string;
}

export const AboutCollegeEditor: React.FC<AboutCollegeEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroTitleEn: '',
    heroDescription: '',
    heroDescriptionEn: '',
    historySection: '',
    historySectionEn: '',
    featuredImage: ''
  });

  React.useEffect(() => {
    if (section?.elements) {
      const heroTitle = section.elements.find(el => el.element_key === 'hero-title');
      const heroDescription = section.elements.find(el => el.element_key === 'hero-description');
      const historySection = section.elements.find(el => el.element_key === 'history-section');
      
      setFormData({
        heroTitle: heroTitle?.content_ar || '',
        heroTitleEn: heroTitle?.content_en || '',
        heroDescription: heroDescription?.content_ar || '',
        heroDescriptionEn: heroDescription?.content_en || '',
        historySection: historySection?.content_ar || '',
        historySectionEn: historySection?.content_en || '',
        featuredImage: ''
      });
    }
  }, [section]);

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      // حفظ عنوان البطل
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'hero-title',
        elementType: 'text',
        contentAr: formData.heroTitle,
        contentEn: formData.heroTitleEn,
        status
      });

      // حفظ وصف البطل
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'hero-description',
        elementType: 'rich_text',
        contentAr: formData.heroDescription,
        contentEn: formData.heroDescriptionEn,
        status
      });

      // حفظ قسم التاريخ
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'history-section',
        elementType: 'rich_text',
        contentAr: formData.historySection,
        contentEn: formData.historySectionEn,
        status
      });

      toast({
        title: status === 'published' ? 'تم النشر بنجاح' : 'تم الحفظ بنجاح',
        description: `تم ${status === 'published' ? 'نشر' : 'حفظ'} محتوى عن الكلية`
      });
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">تحرير صفحة عن الكلية</h2>
          <p className="text-muted-foreground">تحرير المحتوى الأساسي لصفحة عن الكلية</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={updateElement.isPending}
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ كمسودة
          </Button>
          
          <Button
            onClick={() => handleSave('published')}
            disabled={updateElement.isPending}
          >
            {updateElement.isPending ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 ml-2" />
            )}
            نشر التغييرات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="arabic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="arabic">المحتوى العربي</TabsTrigger>
          <TabsTrigger value="english">المحتوى الإنجليزي</TabsTrigger>
        </TabsList>
        
        <TabsContent value="arabic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                قسم البطل الرئيسي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">عنوان الصفحة الرئيسي</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="مثال: كلية أيلول الجامعية"
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="heroDescription">وصف الكلية</Label>
                <Textarea
                  id="heroDescription"
                  value={formData.heroDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroDescription: e.target.value }))}
                  placeholder="وصف مختصر عن رؤية ورسالة الكلية..."
                  rows={4}
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                تاريخ الكلية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="historySection">نبذة تاريخية عن الكلية</Label>
                <Textarea
                  id="historySection"
                  value={formData.historySection}
                  onChange={(e) => setFormData(prev => ({ ...prev, historySection: e.target.value }))}
                  placeholder="تاريخ تأسيس الكلية ومسيرتها..."
                  rows={6}
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="english" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitleEn">Main Page Title</Label>
                <Input
                  id="heroTitleEn"
                  value={formData.heroTitleEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroTitleEn: e.target.value }))}
                  placeholder="Example: Aeloul University College"
                />
              </div>
              
              <div>
                <Label htmlFor="heroDescriptionEn">College Description</Label>
                <Textarea
                  id="heroDescriptionEn"
                  value={formData.heroDescriptionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroDescriptionEn: e.target.value }))}
                  placeholder="Brief description about college vision and mission..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                College History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="historySectionEn">Historical Overview</Label>
                <Textarea
                  id="historySectionEn"
                  value={formData.historySectionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, historySectionEn: e.target.value }))}
                  placeholder="College establishment history and journey..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معاينة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              {formData.heroTitle || 'عنوان الكلية'}
            </h1>
            <p className="text-lg text-center text-muted-foreground mb-6">
              {formData.heroDescription || 'وصف الكلية'}
            </p>
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">نبذة تاريخية</h2>
              <p className="text-muted-foreground">
                {formData.historySection || 'النبذة التاريخية عن الكلية'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};