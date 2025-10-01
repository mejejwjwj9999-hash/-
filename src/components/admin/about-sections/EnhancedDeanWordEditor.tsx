import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, Loader2, Eye, User, Mail, Phone, Upload } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDeanWordEditorProps {
  pageKey: string;
}

interface FormData {
  // Header Section
  pageTitle: string;
  pageSubtitle: string;
  
  // Dean Info
  deanImage: string;
  deanName: string;
  deanTitle: string;
  deanPosition: string;
  deanEmail: string;
  deanPhone: string;
  
  // Dean Message
  messageContent: string;
  messageQuote: string;
  
  // Biography Section
  biographyTitle: string;
  qualificationsTitle: string;
  qualifications: string[];
  experienceTitle: string;
  experiences: string[];
  
  // English versions
  pageTitleEn?: string;
  pageSubtitleEn?: string;
  deanNameEn?: string;
  deanTitleEn?: string;
  deanPositionEn?: string;
  messageContentEn?: string;
  messageQuoteEn?: string;
  biographyTitleEn?: string;
  qualificationsTitleEn?: string;
  qualificationsEn?: string[];
  experienceTitleEn?: string;
  experiencesEn?: string[];
}

export const EnhancedDeanWordEditor: React.FC<EnhancedDeanWordEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    // Header Section
    pageTitle: 'كلمة عميد الكلية',
    pageSubtitle: 'رسالة من عميد كلية أيلول الجامعية إلى الطلاب والمجتمع',
    
    // Dean Info
    deanImage: '/lovable-uploads/3b66f222-08f7-4d05-b5b1-4ddb5a1651b2.png',
    deanName: 'مراد المجاهد',
    deanTitle: 'الدكتور',
    deanPosition: 'عميد كلية أيلول الجامعية',
    deanEmail: 'dean@eylool.edu.ye',
    deanPhone: '+967 4 123456',
    
    // Dean Message
    messageContent: '',
    messageQuote: 'نسعى لتحقيق التميز في التعليم العالي وإعداد جيل قادر على مواجهة تحديات المستقبل',
    
    // Biography
    biographyTitle: 'السيرة العلمية للعميد',
    qualificationsTitle: 'المؤهلات العلمية',
    qualifications: [
      'دكتوراه في الطب من جامعة القاهرة',
      'ماجستير في الطب الباطني',
      'بكالوريوس طب وجراحة بدرجة امتياز',
      'زمالة في أمراض القلب'
    ],
    experienceTitle: 'الخبرات العملية',
    experiences: [
      '15 عاماً في التدريس الجامعي',
      '20 عاماً في الممارسة الطبية',
      'عضو في عدة جمعيات طبية دولية',
      'مؤلف لأكثر من 30 بحثاً علمياً'
    ]
  });

  useEffect(() => {
    if (section?.elements) {
      const getElementContent = (key: string, lang: 'ar' | 'en' = 'ar') => {
        const element = section.elements?.find(el => el.element_key === key);
        return lang === 'ar' ? element?.content_ar || '' : element?.content_en || '';
      };

      const getElementMetadata = (key: string) => {
        const element = section.elements?.find(el => el.element_key === key);
        return element?.metadata || {};
      };

      setFormData(prev => ({
        ...prev,
        pageTitle: getElementContent('page_title') || prev.pageTitle,
        pageSubtitle: getElementContent('page_subtitle') || prev.pageSubtitle,
        
        deanImage: getElementMetadata('dean_info').image || prev.deanImage,
        deanName: getElementContent('dean_name') || prev.deanName,
        deanTitle: getElementContent('dean_title') || prev.deanTitle,
        deanPosition: getElementContent('dean_position') || prev.deanPosition,
        deanEmail: getElementMetadata('dean_contact').email || prev.deanEmail,
        deanPhone: getElementMetadata('dean_contact').phone || prev.deanPhone,
        
        messageContent: getElementContent('message_content') || prev.messageContent,
        messageQuote: getElementContent('message_quote') || prev.messageQuote,
        
        biographyTitle: getElementContent('biography_title') || prev.biographyTitle,
        qualificationsTitle: getElementContent('qualifications_title') || prev.qualificationsTitle,
        qualifications: getElementMetadata('qualifications').items || prev.qualifications,
        experienceTitle: getElementContent('experience_title') || prev.experienceTitle,
        experiences: getElementMetadata('experiences').items || prev.experiences,
      }));
    }
  }, [section]);

  const updateListItem = (listType: 'qualifications' | 'experiences' | 'qualificationsEn' | 'experiencesEn', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [listType]: prev[listType]?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const addListItem = (listType: 'qualifications' | 'experiences' | 'qualificationsEn' | 'experiencesEn') => {
    setFormData(prev => ({
      ...prev,
      [listType]: [...(prev[listType] || []), '']
    }));
  };

  const removeListItem = (listType: 'qualifications' | 'experiences' | 'qualificationsEn' | 'experiencesEn', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listType]: prev[listType]?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      const savePromises = [
        // Header elements
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'page_title',
          elementType: 'text',
          contentAr: formData.pageTitle,
          contentEn: formData.pageTitleEn,
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'page_subtitle',
          elementType: 'text',
          contentAr: formData.pageSubtitle,
          contentEn: formData.pageSubtitleEn,
          status
        }),
        
        // Dean info
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'dean_info',
          elementType: 'text',
          contentAr: formData.deanName,
          contentEn: formData.deanNameEn,
          metadata: {
            image: formData.deanImage,
            title: formData.deanTitle,
            titleEn: formData.deanTitleEn,
            position: formData.deanPosition,
            positionEn: formData.deanPositionEn
          },
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'dean_contact',
          elementType: 'text',
          contentAr: '',
          metadata: {
            email: formData.deanEmail,
            phone: formData.deanPhone
          },
          status
        }),
        
        // Message content
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'message_content',
          elementType: 'rich_text',
          contentAr: formData.messageContent,
          contentEn: formData.messageContentEn,
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'message_quote',
          elementType: 'text',
          contentAr: formData.messageQuote,
          contentEn: formData.messageQuoteEn,
          status
        }),
        
        // Biography
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'qualifications',
          elementType: 'rich_text',
          contentAr: formData.qualificationsTitle,
          contentEn: formData.qualificationsTitleEn,
          metadata: {
            items: formData.qualifications,
            itemsEn: formData.qualificationsEn
          },
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'experiences',
          elementType: 'rich_text',
          contentAr: formData.experienceTitle,
          contentEn: formData.experienceTitleEn,
          metadata: {
            items: formData.experiences,
            itemsEn: formData.experiencesEn
          },
          status
        })
      ];

      await Promise.all(savePromises);

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
          <p className="text-muted-foreground">إدارة محتوى صفحة كلمة العميد بالكامل</p>
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
          {/* Header Section */}
          <Card>
            <CardHeader>
              <CardTitle>قسم الرأس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pageTitle">عنوان الصفحة</Label>
                <Input
                  id="pageTitle"
                  value={formData.pageTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageTitle: e.target.value }))}
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="pageSubtitle">وصف الصفحة</Label>
                <Textarea
                  id="pageSubtitle"
                  value={formData.pageSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageSubtitle: e.target.value }))}
                  rows={2}
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>

          {/* Dean Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                معلومات العميد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deanImage">صورة العميد</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="deanImage"
                    value={formData.deanImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, deanImage: e.target.value }))}
                    className="text-right"
                    placeholder="رابط الصورة"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 ml-2" />
                    رفع صورة
                  </Button>
                </div>
                {formData.deanImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.deanImage} 
                      alt="صورة العميد" 
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deanTitle">لقب العميد</Label>
                  <Input
                    id="deanTitle"
                    value={formData.deanTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, deanTitle: e.target.value }))}
                    className="text-right"
                    placeholder="الدكتور"
                  />
                </div>

                <div>
                  <Label htmlFor="deanName">اسم العميد</Label>
                  <Input
                    id="deanName"
                    value={formData.deanName}
                    onChange={(e) => setFormData(prev => ({ ...prev, deanName: e.target.value }))}
                    className="text-right"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deanPosition">منصب العميد</Label>
                <Input
                  id="deanPosition"
                  value={formData.deanPosition}
                  onChange={(e) => setFormData(prev => ({ ...prev, deanPosition: e.target.value }))}
                  className="text-right"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deanEmail">البريد الإلكتروني</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="deanEmail"
                      type="email"
                      value={formData.deanEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, deanEmail: e.target.value }))}
                      className="text-right"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deanPhone">رقم الهاتف</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="deanPhone"
                      value={formData.deanPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, deanPhone: e.target.value }))}
                      className="text-right"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card>
            <CardHeader>
              <CardTitle>محتوى كلمة العميد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="messageContent">نص كلمة العميد</Label>
                <Textarea
                  id="messageContent"
                  value={formData.messageContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, messageContent: e.target.value }))}
                  rows={10}
                  className="text-right"
                  placeholder="اكتب كلمة العميد الكاملة هنا..."
                />
              </div>

              <div>
                <Label htmlFor="messageQuote">اقتباس ملهم من العميد</Label>
                <Textarea
                  id="messageQuote"
                  value={formData.messageQuote}
                  onChange={(e) => setFormData(prev => ({ ...prev, messageQuote: e.target.value }))}
                  rows={3}
                  className="text-right"
                  placeholder="اقتباس يلخص رؤية العميد..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Biography Section */}
          <Card>
            <CardHeader>
              <CardTitle>السيرة العلمية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="biographyTitle">عنوان قسم السيرة العلمية</Label>
                <Input
                  id="biographyTitle"
                  value={formData.biographyTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, biographyTitle: e.target.value }))}
                  className="text-right"
                />
              </div>

              <Separator />

              {/* Qualifications */}
              <div className="space-y-4">
                <Label htmlFor="qualificationsTitle">عنوان المؤهلات العلمية</Label>
                <Input
                  id="qualificationsTitle"
                  value={formData.qualificationsTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, qualificationsTitle: e.target.value }))}
                  className="text-right"
                />

                <div className="space-y-2">
                  <Label>قائمة المؤهلات العلمية</Label>
                  {formData.qualifications.map((qualification, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={qualification}
                        onChange={(e) => updateListItem('qualifications', index, e.target.value)}
                        className="text-right"
                        placeholder={`مؤهل ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeListItem('qualifications', index)}
                      >
                        حذف
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addListItem('qualifications')}
                  >
                    إضافة مؤهل
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Experiences */}
              <div className="space-y-4">
                <Label htmlFor="experienceTitle">عنوان الخبرات العملية</Label>
                <Input
                  id="experienceTitle"
                  value={formData.experienceTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceTitle: e.target.value }))}
                  className="text-right"
                />

                <div className="space-y-2">
                  <Label>قائمة الخبرات العملية</Label>
                  {formData.experiences.map((experience, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={experience}
                        onChange={(e) => updateListItem('experiences', index, e.target.value)}
                        className="text-right"
                        placeholder={`خبرة ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeListItem('experiences', index)}
                      >
                        حذف
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addListItem('experiences')}
                  >
                    إضافة خبرة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="english" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>English Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                English content editing interface can be added here following the same structure as Arabic content.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معاينة كلمة العميد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{formData.pageTitle}</h1>
              <p className="text-lg text-muted-foreground">{formData.pageSubtitle}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Dean Info Preview */}
              <div className="bg-white p-6 rounded-lg text-center">
                {formData.deanImage && (
                  <img 
                    src={formData.deanImage} 
                    alt="صورة العميد" 
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                  />
                )}
                <h3 className="font-bold text-lg">{formData.deanTitle}</h3>
                <p className="text-university-blue font-bold text-lg mb-2">{formData.deanName}</p>
                <p className="text-muted-foreground mb-4">{formData.deanPosition}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-university-blue" />
                    <span>{formData.deanEmail}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-university-blue" />
                    <span>{formData.deanPhone}</span>
                  </div>
                </div>
              </div>

              {/* Message Preview */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {formData.messageContent || 'نص كلمة العميد سيظهر هنا...'}
                </p>
                {formData.messageQuote && (
                  <blockquote className="border-l-4 border-university-blue pl-4 italic text-university-blue">
                    "{formData.messageQuote}"
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};