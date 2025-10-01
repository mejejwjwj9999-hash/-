import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, Loader2, Eye, Award, BookOpen, TrendingUp, Users, Target, CheckCircle } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { useToast } from '@/hooks/use-toast';

interface EnhancedQualityAssuranceEditorProps {
  pageKey: string;
}

interface ServiceData {
  title: string;
  description: string;
  icon: string;
}

interface AchievementData {
  title: string;
  percentage: string;
  color: string;
}

interface QualityStandardCategory {
  category: string;
  standards: string[];
}

interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

interface FormData {
  // Header Section
  pageTitle: string;
  pageSubtitle: string;
  
  // Services Section
  servicesTitle: string;
  servicesSubtitle: string;
  services: ServiceData[];
  
  // Achievements Section
  achievementsTitle: string;
  achievements: AchievementData[];
  
  // Quality Standards Section
  standardsTitle: string;
  standardsSubtitle: string;
  qualityStandards: QualityStandardCategory[];
  
  // Process Section
  processTitle: string;
  processSubtitle: string;
  processSteps: ProcessStep[];
  
  // English versions
  pageTitleEn?: string;
  pageSubtitleEn?: string;
  servicesTitleEn?: string;
  servicesSubtitleEn?: string;
  achievementsTitleEn?: string;
  standardsTitleEn?: string;
  standardsSubtitleEn?: string;
  processTitleEn?: string;
  processSubtitleEn?: string;
}

export const EnhancedQualityAssuranceEditor: React.FC<EnhancedQualityAssuranceEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    // Header Section
    pageTitle: 'وحدة التطوير وضمان الجودة',
    pageSubtitle: 'نعمل على ضمان جودة التعليم والتطوير المستمر للعمليات الأكاديمية',
    
    // Services Section
    servicesTitle: 'خدماتنا',
    servicesSubtitle: 'تقدم وحدة التطوير وضمان الجودة مجموعة شاملة من الخدمات',
    services: [
      {
        title: 'تطوير البرامج الأكاديمية',
        description: 'مراجعة وتطوير المناهج والبرامج الدراسية لضمان جودتها',
        icon: 'BookOpen'
      },
      {
        title: 'التقييم المستمر',
        description: 'تقييم أداء أعضاء هيئة التدريس والطلاب والعمليات التعليمية',
        icon: 'TrendingUp'
      },
      {
        title: 'ضمان الجودة',
        description: 'تطبيق معايير الجودة المحلية والدولية في جميع العمليات',
        icon: 'Award'
      },
      {
        title: 'التدريب والتطوير',
        description: 'تنظيم برامج تدريبية لتطوير قدرات الكادر التدريسي والإداري',
        icon: 'Users'
      }
    ],
    
    // Achievements Section
    achievementsTitle: 'إنجازاتنا في الجودة',
    achievements: [
      { title: 'اعتماد البرامج الأكاديمية', percentage: '100%', color: 'university-blue' },
      { title: 'رضا الطلاب', percentage: '95%', color: 'university-green' },
      { title: 'معدل نجاح الخريجين', percentage: '92%', color: 'university-gold' },
      { title: 'تطبيق معايير الجودة', percentage: '98%', color: 'university-red' }
    ],
    
    // Quality Standards Section
    standardsTitle: 'معايير الجودة المطبقة',
    standardsSubtitle: 'نطبق معايير شاملة لضمان جودة التعليم في جميع جوانب العمل الأكاديمي',
    qualityStandards: [
      {
        category: 'المعايير الأكاديمية',
        standards: [
          'تطوير المناهج وفقاً للمعايير الدولية',
          'تقييم مخرجات التعلم بشكل دوري',
          'تحديث طرق التدريس والتقييم',
          'ضمان كفاءة أعضاء هيئة التدريس'
        ]
      },
      {
        category: 'معايير الخدمات الطلابية',
        standards: [
          'توفير بيئة تعليمية محفزة',
          'دعم الطلاب أكاديمياً ونفسياً',
          'تطوير المهارات العملية والبحثية',
          'متابعة الخريجين في سوق العمل'
        ]
      },
      {
        category: 'معايير الإدارة والحوكمة',
        standards: [
          'شفافية في العمليات الإدارية',
          'مشاركة جميع الأطراف في اتخاذ القرارات',
          'تطبيق أنظمة إدارة الجودة',
          'المراجعة والتحسين المستمر'
        ]
      }
    ],
    
    // Process Section
    processTitle: 'عملية ضمان الجودة',
    processSubtitle: 'نتبع منهجية علمية مدروسة لضمان التطوير والتحسين المستمر',
    processSteps: [
      {
        title: 'التخطيط',
        description: 'وضع الأهداف والمعايير',
        icon: 'Target'
      },
      {
        title: 'التنفيذ',
        description: 'تطبيق المعايير والإجراءات',
        icon: 'TrendingUp'
      },
      {
        title: 'التقييم',
        description: 'مراجعة النتائج والأداء',
        icon: 'CheckCircle'
      },
      {
        title: 'التحسين',
        description: 'تطوير وتحسين العمليات',
        icon: 'Award'
      }
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
        servicesTitle: getElementContent('services_title') || prev.servicesTitle,
        servicesSubtitle: getElementContent('services_subtitle') || prev.servicesSubtitle,
        services: getElementMetadata('services').items || prev.services,
        achievementsTitle: getElementContent('achievements_title') || prev.achievementsTitle,
        achievements: getElementMetadata('achievements').items || prev.achievements,
        standardsTitle: getElementContent('standards_title') || prev.standardsTitle,
        standardsSubtitle: getElementContent('standards_subtitle') || prev.standardsSubtitle,
        qualityStandards: getElementMetadata('quality_standards').items || prev.qualityStandards,
        processTitle: getElementContent('process_title') || prev.processTitle,
        processSubtitle: getElementContent('process_subtitle') || prev.processSubtitle,
        processSteps: getElementMetadata('process_steps').items || prev.processSteps,
      }));
    }
  }, [section]);

  const updateServiceItem = (index: number, field: keyof ServiceData, value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const updateAchievementItem = (index: number, field: keyof AchievementData, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const updateStandardCategory = (categoryIndex: number, field: 'category' | 'standards', value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      qualityStandards: prev.qualityStandards.map((standard, i) => 
        i === categoryIndex ? { ...standard, [field]: value } : standard
      )
    }));
  };

  const updateStandardItem = (categoryIndex: number, standardIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      qualityStandards: prev.qualityStandards.map((category, i) => 
        i === categoryIndex ? {
          ...category,
          standards: category.standards.map((standard, j) => 
            j === standardIndex ? value : standard
          )
        } : category
      )
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
        
        // Services
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'services',
          elementType: 'rich_text',
          contentAr: formData.servicesTitle,
          contentEn: formData.servicesTitleEn,
          metadata: {
            subtitle: formData.servicesSubtitle,
            subtitleEn: formData.servicesSubtitleEn,
            items: formData.services
          },
          status
        }),
        
        // Achievements
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'achievements',
          elementType: 'rich_text',
          contentAr: formData.achievementsTitle,
          contentEn: formData.achievementsTitleEn,
          metadata: {
            items: formData.achievements
          },
          status
        }),
        
        // Quality Standards
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality_standards',
          elementType: 'rich_text',
          contentAr: formData.standardsTitle,
          contentEn: formData.standardsTitleEn,
          metadata: {
            subtitle: formData.standardsSubtitle,
            subtitleEn: formData.standardsSubtitleEn,
            items: formData.qualityStandards
          },
          status
        }),
        
        // Process Steps
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'process_steps',
          elementType: 'rich_text',
          contentAr: formData.processTitle,
          contentEn: formData.processTitleEn,
          metadata: {
            subtitle: formData.processSubtitle,
            subtitleEn: formData.processSubtitleEn,
            items: formData.processSteps
          },
          status
        })
      ];

      await Promise.all(savePromises);

      toast({
        title: status === 'published' ? 'تم النشر بنجاح' : 'تم الحفظ بنجاح',
        description: `تم ${status === 'published' ? 'نشر' : 'حفظ'} محتوى صفحة ضمان الجودة`
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
          <h2 className="text-2xl font-bold">تحرير صفحة ضمان الجودة</h2>
          <p className="text-muted-foreground">إدارة محتوى صفحة وحدة التطوير وضمان الجودة</p>
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

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                قسم الخدمات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="servicesTitle">عنوان قسم الخدمات</Label>
                <Input
                  id="servicesTitle"
                  value={formData.servicesTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicesTitle: e.target.value }))}
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="servicesSubtitle">وصف قسم الخدمات</Label>
                <Textarea
                  id="servicesSubtitle"
                  value={formData.servicesSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, servicesSubtitle: e.target.value }))}
                  rows={2}
                  className="text-right"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>الخدمات المقدمة</Label>
                {formData.services.map((service, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`service-title-${index}`}>عنوان الخدمة</Label>
                        <Input
                          id={`service-title-${index}`}
                          value={service.title}
                          onChange={(e) => updateServiceItem(index, 'title', e.target.value)}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`service-desc-${index}`}>وصف الخدمة</Label>
                        <Textarea
                          id={`service-desc-${index}`}
                          value={service.description}
                          onChange={(e) => updateServiceItem(index, 'description', e.target.value)}
                          rows={2}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`service-icon-${index}`}>أيقونة الخدمة</Label>
                        <Input
                          id={`service-icon-${index}`}
                          value={service.icon}
                          onChange={(e) => updateServiceItem(index, 'icon', e.target.value)}
                          className="text-right"
                          placeholder="BookOpen, Award, TrendingUp, Users"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                قسم الإنجازات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="achievementsTitle">عنوان قسم الإنجازات</Label>
                <Input
                  id="achievementsTitle"
                  value={formData.achievementsTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, achievementsTitle: e.target.value }))}
                  className="text-right"
                />
              </div>

              <div className="space-y-4">
                <Label>الإنجازات والإحصائيات</Label>
                {formData.achievements.map((achievement, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`achievement-title-${index}`}>عنوان الإنجاز</Label>
                        <Input
                          id={`achievement-title-${index}`}
                          value={achievement.title}
                          onChange={(e) => updateAchievementItem(index, 'title', e.target.value)}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`achievement-percentage-${index}`}>النسبة المئوية</Label>
                        <Input
                          id={`achievement-percentage-${index}`}
                          value={achievement.percentage}
                          onChange={(e) => updateAchievementItem(index, 'percentage', e.target.value)}
                          className="text-right"
                          placeholder="95%"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`achievement-color-${index}`}>لون الإحصائية</Label>
                        <Input
                          id={`achievement-color-${index}`}
                          value={achievement.color}
                          onChange={(e) => updateAchievementItem(index, 'color', e.target.value)}
                          className="text-right"
                          placeholder="university-blue"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Standards Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                معايير الجودة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="standardsTitle">عنوان قسم المعايير</Label>
                <Input
                  id="standardsTitle"
                  value={formData.standardsTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, standardsTitle: e.target.value }))}
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="standardsSubtitle">وصف قسم المعايير</Label>
                <Textarea
                  id="standardsSubtitle"
                  value={formData.standardsSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, standardsSubtitle: e.target.value }))}
                  rows={2}
                  className="text-right"
                />
              </div>

              <div className="space-y-4">
                <Label>فئات معايير الجودة</Label>
                {formData.qualityStandards.map((category, categoryIndex) => (
                  <Card key={categoryIndex} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`category-${categoryIndex}`}>اسم الفئة</Label>
                        <Input
                          id={`category-${categoryIndex}`}
                          value={category.category}
                          onChange={(e) => updateStandardCategory(categoryIndex, 'category', e.target.value)}
                          className="text-right"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>معايير هذه الفئة</Label>
                        {category.standards.map((standard, standardIndex) => (
                          <Input
                            key={standardIndex}
                            value={standard}
                            onChange={(e) => updateStandardItem(categoryIndex, standardIndex, e.target.value)}
                            className="text-right"
                            placeholder={`معيار ${standardIndex + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
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
            معاينة صفحة ضمان الجودة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{formData.pageTitle}</h1>
              <p className="text-lg text-muted-foreground">{formData.pageSubtitle}</p>
            </div>

            {/* Services Preview */}
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">{formData.servicesTitle}</h2>
              <p className="text-muted-foreground mb-4">{formData.servicesSubtitle}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg text-center">
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">{formData.achievementsTitle}</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-university-blue mb-2">
                      {achievement.percentage}
                    </div>
                    <p className="font-medium">{achievement.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};