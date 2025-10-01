import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Loader2, 
  Eye, 
  FileText, 
  Building,
  Award,
  Users,
  MapPin,
  ImageIcon,
  BarChart3,
  Globe,
  Phone,
  Calendar
} from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { useToast } from '@/hooks/use-toast';
import { StatisticsEditor } from './StatisticsEditor';
import { ImageGalleryEditor } from './ImageGalleryEditor';
import { ContactInfoEditor } from './ContactInfoEditor';
import { motion } from 'framer-motion';

interface EnhancedAboutCollegeEditorProps {
  pageKey: string;
}

interface FormData {
  // النصوص الأساسية
  heroTitle: string;
  heroTitleEn: string;
  heroDescription: string;
  heroDescriptionEn: string;
  historySection: string;
  historySectionEn: string;
  
  // المحتوى المتقدم
  visionStatement: string;
  visionStatementEn: string;
  missionStatement: string;
  missionStatementEn: string;
  valuesStatement: string;
  valuesStatementEn: string;
  
  // البيانات المركبة
  statistics: Array<{
    id: string;
    key: string;
    valueAr: string;
    valueEn: string;
    labelAr: string;
    labelEn: string;
    icon: string;
    color: string;
  }>;
  
  galleryImages: Array<{
    id: string;
    url: string;
    altAr: string;
    altEn: string;
    captionAr: string;
    captionEn: string;
    order: number;
  }>;
  
  contactMethods: Array<{
    id: string;
    type: 'phone' | 'email' | 'address' | 'website' | 'hours';
    labelAr: string;
    labelEn: string;
    valueAr: string;
    valueEn: string;
    isPrimary: boolean;
  }>;
  
  accreditations: Array<{
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    logoUrl: string;
    year: string;
  }>;
}

export const EnhancedAboutCollegeEditor: React.FC<EnhancedAboutCollegeEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<FormData>({
    heroTitle: '',
    heroTitleEn: '',
    heroDescription: '',
    heroDescriptionEn: '',
    historySection: '',
    historySectionEn: '',
    visionStatement: '',
    visionStatementEn: '',
    missionStatement: '',
    missionStatementEn: '',
    valuesStatement: '',
    valuesStatementEn: '',
    statistics: [],
    galleryImages: [],
    contactMethods: [],
    accreditations: []
  });

  useEffect(() => {
    if (section?.elements) {
      const getElementContent = (key: string, lang: 'ar' | 'en' = 'ar') => {
        const element = section.elements?.find(el => el.element_key === key);
        return element?.[`content_${lang}`] || '';
      };

      const getElementMetadata = (key: string) => {
        const element = section.elements?.find(el => el.element_key === key);
        return element?.metadata || {};
      };

      setFormData({
        heroTitle: getElementContent('hero-title', 'ar'),
        heroTitleEn: getElementContent('hero-title', 'en'),
        heroDescription: getElementContent('hero-description', 'ar'),
        heroDescriptionEn: getElementContent('hero-description', 'en'),
        historySection: getElementContent('history-section', 'ar'),
        historySectionEn: getElementContent('history-section', 'en'),
        visionStatement: getElementContent('vision-statement', 'ar'),
        visionStatementEn: getElementContent('vision-statement', 'en'),
        missionStatement: getElementContent('mission-statement', 'ar'),
        missionStatementEn: getElementContent('mission-statement', 'en'),
        valuesStatement: getElementContent('values-statement', 'ar'),
        valuesStatementEn: getElementContent('values-statement', 'en'),
        statistics: getElementMetadata('statistics')?.data || [],
        galleryImages: getElementMetadata('gallery-images')?.data || [],
        contactMethods: getElementMetadata('contact-methods')?.data || [],
        accreditations: getElementMetadata('accreditations')?.data || []
      });
    }
  }, [section]);

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      const savePromises = [
        // النصوص الأساسية
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'hero-title',
          elementType: 'text',
          contentAr: formData.heroTitle,
          contentEn: formData.heroTitleEn,
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'hero-description',
          elementType: 'rich_text',
          contentAr: formData.heroDescription,
          contentEn: formData.heroDescriptionEn,
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'history-section',
          elementType: 'rich_text',
          contentAr: formData.historySection,
          contentEn: formData.historySectionEn,
          status
        }),
        
        // المحتوى المتقدم
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'vision-statement',
          elementType: 'rich_text',
          contentAr: formData.visionStatement,
          contentEn: formData.visionStatementEn,
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'mission-statement',
          elementType: 'rich_text',
          contentAr: formData.missionStatement,
          contentEn: formData.missionStatementEn,
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'values-statement',
          elementType: 'rich_text',
          contentAr: formData.valuesStatement,
          contentEn: formData.valuesStatementEn,
          status
        }),
        
        // البيانات المركبة
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'statistics',
          elementType: 'text',
          contentAr: JSON.stringify(formData.statistics),
          metadata: { data: formData.statistics },
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'gallery-images',
          elementType: 'text',
          contentAr: JSON.stringify(formData.galleryImages),
          metadata: { data: formData.galleryImages },
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'contact-methods',
          elementType: 'text',
          contentAr: JSON.stringify(formData.contactMethods),
          metadata: { data: formData.contactMethods },
          status
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'accreditations',
          elementType: 'text',
          contentAr: JSON.stringify(formData.accreditations),
          metadata: { data: formData.accreditations },
          status
        })
      ];

      await Promise.all(savePromises);

      toast({
        title: status === 'published' ? 'تم النشر بنجاح' : 'تم الحفظ بنجاح',
        description: `تم ${status === 'published' ? 'نشر' : 'حفظ'} محتوى حول الكلية بجميع العناصر`
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ المحتوى',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const tabsConfig = [
    { id: 'basic', label: 'المحتوى الأساسي', icon: FileText },
    { id: 'vision', label: 'الرؤية والرسالة', icon: Award },
    { id: 'statistics', label: 'الإحصائيات', icon: BarChart3 },
    { id: 'gallery', label: 'معرض الصور', icon: ImageIcon },
    { id: 'contact', label: 'معلومات الاتصال', icon: MapPin },
    { id: 'accreditations', label: 'الاعتمادات', icon: Building }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            محرر حول الكلية المتطور
          </h2>
          <p className="text-muted-foreground mt-2">
            تحرير شامل لجميع عناصر صفحة "حول الكلية" - النصوص، الصور، الإحصائيات، والاتصال
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={updateElement.isPending}
            className="hover:bg-secondary/80"
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ كمسودة
          </Button>
          
          <Button
            onClick={() => handleSave('published')}
            disabled={updateElement.isPending}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {updateElement.isPending ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 ml-2" />
            )}
            نشر التغييرات
          </Button>
        </div>
      </motion.div>

      <Separator />

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-muted/30">
          {tabsConfig.map(tab => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {/* Basic Content Tab */}
        <TabsContent value="basic" className="space-y-6 mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  المحتوى الأساسي للكلية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="arabic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="arabic">المحتوى العربي</TabsTrigger>
                    <TabsTrigger value="english">المحتوى الإنجليزي</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="arabic" className="space-y-4 mt-6">
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
                  </TabsContent>

                  <TabsContent value="english" className="space-y-4 mt-6">
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vision & Mission Tab */}
        <TabsContent value="vision" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                الرؤية والرسالة والقيم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="arabic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="arabic">المحتوى العربي</TabsTrigger>
                  <TabsTrigger value="english">المحتوى الإنجليزي</TabsTrigger>
                </TabsList>
                
                <TabsContent value="arabic" className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="visionStatement">الرؤية</Label>
                    <Textarea
                      id="visionStatement"
                      value={formData.visionStatement}
                      onChange={(e) => setFormData(prev => ({ ...prev, visionStatement: e.target.value }))}
                      placeholder="رؤية الكلية للمستقبل..."
                      rows={4}
                      className="text-right"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="missionStatement">الرسالة</Label>
                    <Textarea
                      id="missionStatement"
                      value={formData.missionStatement}
                      onChange={(e) => setFormData(prev => ({ ...prev, missionStatement: e.target.value }))}
                      placeholder="رسالة الكلية وأهدافها..."
                      rows={4}
                      className="text-right"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="valuesStatement">القيم</Label>
                    <Textarea
                      id="valuesStatement"
                      value={formData.valuesStatement}
                      onChange={(e) => setFormData(prev => ({ ...prev, valuesStatement: e.target.value }))}
                      placeholder="قيم ومبادئ الكلية..."
                      rows={4}
                      className="text-right"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="english" className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="visionStatementEn">Vision</Label>
                    <Textarea
                      id="visionStatementEn"
                      value={formData.visionStatementEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, visionStatementEn: e.target.value }))}
                      placeholder="College vision for the future..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="missionStatementEn">Mission</Label>
                    <Textarea
                      id="missionStatementEn"
                      value={formData.missionStatementEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, missionStatementEn: e.target.value }))}
                      placeholder="College mission and objectives..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="valuesStatementEn">Values</Label>
                    <Textarea
                      id="valuesStatementEn"
                      value={formData.valuesStatementEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, valuesStatementEn: e.target.value }))}
                      placeholder="College values and principles..."
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="mt-6">
          <StatisticsEditor
            statistics={formData.statistics}
            onChange={(statistics) => setFormData(prev => ({ ...prev, statistics }))}
          />
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="mt-6">
          <ImageGalleryEditor
            images={formData.galleryImages}
            onChange={(galleryImages) => setFormData(prev => ({ ...prev, galleryImages }))}
          />
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-6">
          <ContactInfoEditor
            contactMethods={formData.contactMethods}
            onChange={(contactMethods) => setFormData(prev => ({ ...prev, contactMethods }))}
          />
        </TabsContent>

        {/* Accreditations Tab */}
        <TabsContent value="accreditations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                الشهادات والاعتمادات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">قريباً - محرر الشهادات والاعتمادات</p>
                <Badge variant="outline">قيد التطوير</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Global Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            معاينة شاملة للصفحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8 rounded-xl">
            {/* Hero Section Preview */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formData.heroTitle || 'عنوان الكلية'}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {formData.heroDescription || 'وصف الكلية'}
              </p>
            </div>

            {/* Statistics Preview */}
            {formData.statistics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {formData.statistics.slice(0, 4).map(stat => (
                  <div key={stat.id} className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stat.valueAr}</div>
                    <div className="text-sm text-muted-foreground">{stat.labelAr}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Content Preview */}
            <div className="bg-background/80 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">نبذة تاريخية</h2>
              <p className="text-muted-foreground mb-4">
                {formData.historySection || 'النبذة التاريخية عن الكلية'}
              </p>
              
              {formData.visionStatement && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">الرؤية</h3>
                  <p className="text-sm text-muted-foreground">{formData.visionStatement}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};