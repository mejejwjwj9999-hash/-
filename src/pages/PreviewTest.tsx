import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentPreviewPanel } from '@/components/admin/ContentPreviewPanel';
import { usePreview } from '@/contexts/PreviewContext';
import { Eye, Edit } from 'lucide-react';

export const PreviewTest: React.FC = () => {
  const [pageKey, setPageKey] = useState('home');
  const [elementKey, setElementKey] = useState('hero_title');
  const [elementType, setElementType] = useState<'text' | 'rich_text'>('rich_text');
  const [contentAr, setContentAr] = useState('<h1 style="color: blue;">مرحبا بكم في الكلية</h1><p style="color: red;">هذا نص تجريبي للمعاينة المباشرة</p>');
  const [contentEn, setContentEn] = useState('<h1 style="color: blue;">Welcome to the College</h1><p style="color: red;">This is a test text for live preview</p>');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  const { isPreviewMode, setPreviewMode } = usePreview();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>اختبار نظام المعاينة المباشرة</CardTitle>
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              onClick={() => setPreviewMode(!isPreviewMode)}
              className="gap-2"
            >
              {isPreviewMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isPreviewMode ? 'وضع المعاينة نشط' : 'تفعيل المعاينة'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* المحرر */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">المحرر</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">مفتاح الصفحة</label>
                  <Input 
                    value={pageKey} 
                    onChange={(e) => setPageKey(e.target.value)}
                    placeholder="home, about, contact..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">مفتاح العنصر</label>
                  <Input 
                    value={elementKey} 
                    onChange={(e) => setElementKey(e.target.value)}
                    placeholder="hero_title, description..."
                  />
                </div>

                <Tabs value={language} onValueChange={(val: 'ar' | 'en') => setLanguage(val)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ar">عربي</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar" className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">المحتوى العربي (HTML)</label>
                      <Textarea
                        value={contentAr}
                        onChange={(e) => setContentAr(e.target.value)}
                        placeholder="<h1>العنوان</h1><p>الوصف</p>"
                        className="min-h-32"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">المحتوى الإنجليزي (HTML)</label>
                      <Textarea
                        value={contentEn}
                        onChange={(e) => setContentEn(e.target.value)}
                        placeholder="<h1>Title</h1><p>Description</p>"
                        className="min-h-32"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="text-sm text-muted-foreground p-3 bg-muted rounded">
                  <p><strong>تعليمات الاختبار:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>قم بتفعيل "وضع المعاينة" أولاً</li>
                    <li>غير لون النص في HTML (مثل: color: red, blue, green)</li>
                    <li>ستظهر التغييرات فوراً في المعاينة</li>
                    <li>جرب تغيير اللغة بين العربية والإنجليزية</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* المعاينة */}
            <div>
              <ContentPreviewPanel
                pageKey={pageKey}
                element={{
                  id: 'preview-element',
                  page_id: 'preview-page',
                  element_key: elementKey,
                  element_type: elementType,
                  content_ar: contentAr,
                  content_en: contentEn,
                  metadata: {},
                  status: 'published',
                  is_active: true,
                  display_order: 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                } as any}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewTest;