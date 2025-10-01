import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, Eye, User, Image as ImageIcon, Upload } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { useToast } from '@/hooks/use-toast';

interface DeanWordEditorProps {
  pageKey: string;
}

export const DeanWordEditor: React.FC<DeanWordEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    deanName: '',
    deanNameEn: '',
    deanPosition: '',
    deanPositionEn: '',
    deanImage: '',
    deanMessage: '',
    deanMessageEn: '',
    deanBio: '',
    deanBioEn: ''
  });

  React.useEffect(() => {
    if (section?.elements) {
      const deanName = section.elements.find(el => el.element_key === 'dean-name');
      const deanImage = section.elements.find(el => el.element_key === 'dean-image');
      const deanMessage = section.elements.find(el => el.element_key === 'dean-message');
      
      setFormData({
        deanName: deanName?.content_ar || '',
        deanNameEn: deanName?.content_en || '',
        deanPosition: deanName?.metadata?.position || 'عميد الكلية',
        deanPositionEn: deanName?.metadata?.position_en || 'Dean of College',
        deanImage: deanImage?.content_ar || '',
        deanMessage: deanMessage?.content_ar || '',
        deanMessageEn: deanMessage?.content_en || '',
        deanBio: deanName?.metadata?.bio_ar || '',
        deanBioEn: deanName?.metadata?.bio_en || ''
      });
    }
  }, [section]);

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      // حفظ اسم العميد مع البيانات الإضافية
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'dean-name',
        elementType: 'text',
        contentAr: formData.deanName,
        contentEn: formData.deanNameEn,
        metadata: {
          position: formData.deanPosition,
          position_en: formData.deanPositionEn,
          bio_ar: formData.deanBio,
          bio_en: formData.deanBioEn
        },
        status
      });

      // حفظ صورة العميد
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'dean-image',
        elementType: 'image',
        contentAr: formData.deanImage,
        metadata: {
          alt_text: `صورة ${formData.deanName}`,
          alt_text_en: `Photo of ${formData.deanNameEn}`
        },
        status
      });

      // حفظ رسالة العميد
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'dean-message',
        elementType: 'rich_text',
        contentAr: formData.deanMessage,
        contentEn: formData.deanMessageEn,
        status
      });

      toast({
        title: status === 'published' ? 'تم النشر بنجاح' : 'تم الحفظ بنجاح',
        description: `تم ${status === 'published' ? 'نشر' : 'حفظ'} كلمة العميد`
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
          <h2 className="text-2xl font-bold">تحرير كلمة العميد</h2>
          <p className="text-muted-foreground">تحرير رسالة وبيانات عميد الكلية</p>
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
                <User className="w-5 h-5" />
                بيانات العميد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deanName">اسم العميد</Label>
                  <Input
                    id="deanName"
                    value={formData.deanName}
                    onChange={(e) => setFormData(prev => ({ ...prev, deanName: e.target.value }))}
                    placeholder="د. اسم العميد"
                    className="text-right"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deanPosition">المنصب</Label>
                  <Input
                    id="deanPosition"
                    value={formData.deanPosition}
                    onChange={(e) => setFormData(prev => ({ ...prev, deanPosition: e.target.value }))}
                    placeholder="عميد الكلية"
                    className="text-right"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="deanBio">نبذة مختصرة عن العميد</Label>
                <Textarea
                  id="deanBio"
                  value={formData.deanBio}
                  onChange={(e) => setFormData(prev => ({ ...prev, deanBio: e.target.value }))}
                  placeholder="خبرات ومؤهلات العميد..."
                  rows={3}
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                صورة العميد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deanImage">رابط الصورة</Label>
                  <div className="flex gap-2">
                    <Input
                      id="deanImage"
                      value={formData.deanImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, deanImage: e.target.value }))}
                      placeholder="https://example.com/dean-photo.jpg"
                      className="text-right"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                      رفع
                    </Button>
                  </div>
                </div>
                
                {formData.deanImage && (
                  <div className="border rounded-lg p-4">
                    <img 
                      src={formData.deanImage} 
                      alt="صورة العميد"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                كلمة العميد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="deanMessage">رسالة العميد</Label>
                <Textarea
                  id="deanMessage"
                  value={formData.deanMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, deanMessage: e.target.value }))}
                  placeholder="أهلاً وسهلاً بكم في كلية أيلول..."
                  rows={8}
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
                <User className="w-5 h-5" />
                Dean Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deanNameEn">Dean Name</Label>
                  <Input
                    id="deanNameEn"
                    value={formData.deanNameEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, deanNameEn: e.target.value }))}
                    placeholder="Dr. Dean Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deanPositionEn">Position</Label>
                  <Input
                    id="deanPositionEn"
                    value={formData.deanPositionEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, deanPositionEn: e.target.value }))}
                    placeholder="Dean of College"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="deanBioEn">Brief Bio</Label>
                <Textarea
                  id="deanBioEn"
                  value={formData.deanBioEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, deanBioEn: e.target.value }))}
                  placeholder="Dean's experience and qualifications..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dean's Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="deanMessageEn">Dean's Message</Label>
                <Textarea
                  id="deanMessageEn"
                  value={formData.deanMessageEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, deanMessageEn: e.target.value }))}
                  placeholder="Welcome to Aeloul College..."
                  rows={8}
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
            <div className="flex flex-col md:flex-row items-center gap-6">
              {formData.deanImage && (
                <img 
                  src={formData.deanImage} 
                  alt="صورة العميد"
                  className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              )}
              <div className="text-center md:text-right flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {formData.deanName || 'اسم العميد'}
                </h2>
                <p className="text-primary font-semibold mb-2">
                  {formData.deanPosition || 'المنصب'}
                </p>
                {formData.deanBio && (
                  <p className="text-sm text-muted-foreground">
                    {formData.deanBio}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">كلمة العميد</h3>
              <p className="text-muted-foreground leading-relaxed">
                {formData.deanMessage || 'رسالة العميد'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};