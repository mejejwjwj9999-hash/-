import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, Loader2, Eye, Search, BookOpen, Users, Award, TrendingUp, Download } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { useToast } from '@/hooks/use-toast';

interface EnhancedScientificResearchEditorProps {
  pageKey: string;
}

interface ResearchAreaData {
  title: string;
  description: string;
  projects: number;
  icon: string;
}

interface PublicationData {
  title: string;
  authors: string;
  journal: string;
  year: string;
  category: string;
}

interface ResearchFacilityData {
  name: string;
  description: string;
  equipment: string[];
}

interface SupportTypeData {
  title: string;
  description: string;
  icon: string;
}

interface FormData {
  // Header Section
  pageTitle: string;
  pageSubtitle: string;
  
  // Research Areas Section
  areasTitle: string;
  areasSubtitle: string;
  researchAreas: ResearchAreaData[];
  
  // Publications Section
  publicationsTitle: string;
  publicationsSubtitle: string;
  publications: PublicationData[];
  
  // Facilities Section
  facilitiesTitle: string;
  facilitiesSubtitle: string;
  facilities: ResearchFacilityData[];
  
  // Support Section
  supportTitle: string;
  supportSubtitle: string;
  supportTypes: SupportTypeData[];
  
  // English versions
  pageTitleEn?: string;
  pageSubtitleEn?: string;
  areasTitleEn?: string;
  areasSubtitleEn?: string;
  publicationsTitleEn?: string;
  publicationsSubtitleEn?: string;
  facilitiesTitleEn?: string;
  facilitiesSubtitleEn?: string;
  supportTitleEn?: string;
  supportSubtitleEn?: string;
}

export const EnhancedScientificResearchEditor: React.FC<EnhancedScientificResearchEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    // Header Section
    pageTitle: 'البحث العلمي',
    pageSubtitle: 'نعزز ثقافة البحث العلمي والابتكار لخدمة المجتمع وتطوير المعرفة',
    
    // Research Areas Section
    areasTitle: 'مجالات البحث',
    areasSubtitle: 'نركز على مجالات بحثية متنوعة تخدم التخصصات المختلفة في الكلية',
    researchAreas: [
      {
        title: 'البحوث الطبية',
        description: 'بحوث في مجال الطب والعلوم الصحية',
        projects: 15,
        icon: 'Award'
      },
      {
        title: 'البحوث الصيدلانية',
        description: 'دراسات في علوم الصيدلة والأدوية',
        projects: 12,
        icon: 'BookOpen'
      },
      {
        title: 'بحوث التمريض',
        description: 'أبحاث في مجال التمريض والرعاية الصحية',
        projects: 8,
        icon: 'Users'
      },
      {
        title: 'تكنولوجيا المعلومات',
        description: 'بحوث في التقنيات الحديثة والذكاء الاصطناعي',
        projects: 10,
        icon: 'TrendingUp'
      }
    ],
    
    // Publications Section
    publicationsTitle: 'أحدث المنشورات العلمية',
    publicationsSubtitle: 'تعرف على آخر إصدارات أعضاء هيئة التدريس من البحوث والدراسات',
    publications: [
      {
        title: 'تأثير العلاج الطبيعي على مرضى السكري',
        authors: 'د. أحمد محمد، د. فاطمة علي',
        journal: 'مجلة الطب اليمنية',
        year: '2024',
        category: 'طبي'
      },
      {
        title: 'تطوير أنظمة إدارة المعلومات الصحية',
        authors: 'د. محمد الحداد، د. سارة أحمد',
        journal: 'مجلة تكنولوجيا المعلومات',
        year: '2024',
        category: 'تقني'
      },
      {
        title: 'دراسة فعالية الأدوية التقليدية اليمنية',
        authors: 'د. علي الزبيري، د. منى عبدالله',
        journal: 'مجلة الصيدلة العربية',
        year: '2023',
        category: 'صيدلة'
      },
      {
        title: 'تحسين جودة الرعاية التمريضية',
        authors: 'د. زينب محمد، د. أمل يحيى',
        journal: 'مجلة التمريض الحديث',
        year: '2023',
        category: 'تمريض'
      }
    ],
    
    // Facilities Section
    facilitiesTitle: 'مرافق البحث العلمي',
    facilitiesSubtitle: 'مختبرات ومرافق حديثة مجهزة بأفضل الإمكانيات لدعم البحث العلمي',
    facilities: [
      {
        name: 'مختبر البحوث الطبية',
        description: 'مجهز بأحدث الأجهزة للبحوث الطبية والسريرية',
        equipment: ['جهاز الطرد المركزي', 'المجهر الإلكتروني', 'أجهزة التحليل الكيميائي']
      },
      {
        name: 'مختبر الصيدلة',
        description: 'متخصص في تطوير وتحليل الأدوية والمركبات الصيدلانية',
        equipment: ['جهاز الكروماتوغرافيا', 'أجهزة القياس الطيفي', 'أجهزة تحليل الجودة']
      },
      {
        name: 'مختبر تكنولوجيا المعلومات',
        description: 'يركز على بحوث الذكاء الاصطناعي وتطوير البرمجيات',
        equipment: ['خوادم عالية الأداء', 'أجهزة محاكاة', 'معدات الشبكات المتقدمة']
      }
    ],
    
    // Support Section
    supportTitle: 'دعم الباحثين',
    supportSubtitle: 'نقدم الدعم الكامل للباحثين في جميع مراحل العملية البحثية',
    supportTypes: [
      {
        title: 'التمويل',
        description: 'دعم مالي للمشاريع البحثية',
        icon: 'BookOpen'
      },
      {
        title: 'الإشراف',
        description: 'إشراف أكاديمي متخصص',
        icon: 'Users'
      },
      {
        title: 'النشر',
        description: 'دعم نشر البحوث في المجلات',
        icon: 'Award'
      },
      {
        title: 'التدريب',
        description: 'ورش تدريبية في منهجية البحث',
        icon: 'TrendingUp'
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
        areasTitle: getElementContent('areas_title') || prev.areasTitle,
        areasSubtitle: getElementContent('areas_subtitle') || prev.areasSubtitle,
        researchAreas: getElementMetadata('research_areas').items || prev.researchAreas,
        publicationsTitle: getElementContent('publications_title') || prev.publicationsTitle,
        publicationsSubtitle: getElementContent('publications_subtitle') || prev.publicationsSubtitle,
        publications: getElementMetadata('publications').items || prev.publications,
        facilitiesTitle: getElementContent('facilities_title') || prev.facilitiesTitle,
        facilitiesSubtitle: getElementContent('facilities_subtitle') || prev.facilitiesSubtitle,
        facilities: getElementMetadata('research_facilities').items || prev.facilities,
        supportTitle: getElementContent('support_title') || prev.supportTitle,
        supportSubtitle: getElementContent('support_subtitle') || prev.supportSubtitle,
        supportTypes: getElementMetadata('support_types').items || prev.supportTypes,
      }));
    }
  }, [section]);

  const updateResearchAreaItem = (index: number, field: keyof ResearchAreaData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.map((area, i) => 
        i === index ? { ...area, [field]: value } : area
      )
    }));
  };

  const updatePublicationItem = (index: number, field: keyof PublicationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.map((publication, i) => 
        i === index ? { ...publication, [field]: value } : publication
      )
    }));
  };

  const updateFacilityItem = (index: number, field: keyof ResearchFacilityData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) => 
        i === index ? { ...facility, [field]: value } : facility
      )
    }));
  };

  const updateFacilityEquipment = (facilityIndex: number, equipmentIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) => 
        i === facilityIndex ? {
          ...facility,
          equipment: facility.equipment.map((equipment, j) => 
            j === equipmentIndex ? value : equipment
          )
        } : facility
      )
    }));
  };

  const addFacilityEquipment = (facilityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) => 
        i === facilityIndex ? {
          ...facility,
          equipment: [...facility.equipment, '']
        } : facility
      )
    }));
  };

  const removeFacilityEquipment = (facilityIndex: number, equipmentIndex: number) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) => 
        i === facilityIndex ? {
          ...facility,
          equipment: facility.equipment.filter((_, j) => j !== equipmentIndex)
        } : facility
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
        
        // Research Areas
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research_areas',
          elementType: 'rich_text',
          contentAr: formData.areasTitle,
          contentEn: formData.areasTitleEn,
          metadata: {
            subtitle: formData.areasSubtitle,
            subtitleEn: formData.areasSubtitleEn,
            items: formData.researchAreas
          },
          status
        }),
        
        // Publications
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'publications',
          elementType: 'rich_text',
          contentAr: formData.publicationsTitle,
          contentEn: formData.publicationsTitleEn,
          metadata: {
            subtitle: formData.publicationsSubtitle,
            subtitleEn: formData.publicationsSubtitleEn,
            items: formData.publications
          },
          status
        }),
        
        // Research Facilities
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research_facilities',
          elementType: 'rich_text',
          contentAr: formData.facilitiesTitle,
          contentEn: formData.facilitiesTitleEn,
          metadata: {
            subtitle: formData.facilitiesSubtitle,
            subtitleEn: formData.facilitiesSubtitleEn,
            items: formData.facilities
          },
          status
        }),
        
        // Support Types
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'support_types',
          elementType: 'rich_text',
          contentAr: formData.supportTitle,
          contentEn: formData.supportTitleEn,
          metadata: {
            subtitle: formData.supportSubtitle,
            subtitleEn: formData.supportSubtitleEn,
            items: formData.supportTypes
          },
          status
        })
      ];

      await Promise.all(savePromises);

      toast({
        title: status === 'published' ? 'تم النشر بنجاح' : 'تم الحفظ بنجاح',
        description: `تم ${status === 'published' ? 'نشر' : 'حفظ'} محتوى صفحة البحث العلمي`
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
          <h2 className="text-2xl font-bold">تحرير صفحة البحث العلمي</h2>
          <p className="text-muted-foreground">إدارة محتوى صفحة البحث العلمي بالكامل</p>
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

          {/* Research Areas Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                مجالات البحث
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="areasTitle">عنوان قسم مجالات البحث</Label>
                <Input
                  id="areasTitle"
                  value={formData.areasTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, areasTitle: e.target.value }))}
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="areasSubtitle">وصف قسم مجالات البحث</Label>
                <Textarea
                  id="areasSubtitle"
                  value={formData.areasSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, areasSubtitle: e.target.value }))}
                  rows={2}
                  className="text-right"
                />
              </div>

              <div className="space-y-4">
                <Label>مجالات البحث</Label>
                {formData.researchAreas.map((area, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`area-title-${index}`}>عنوان المجال</Label>
                          <Input
                            id={`area-title-${index}`}
                            value={area.title}
                            onChange={(e) => updateResearchAreaItem(index, 'title', e.target.value)}
                            className="text-right"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`area-projects-${index}`}>عدد المشاريع</Label>
                          <Input
                            id={`area-projects-${index}`}
                            type="number"
                            value={area.projects}
                            onChange={(e) => updateResearchAreaItem(index, 'projects', parseInt(e.target.value) || 0)}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`area-desc-${index}`}>وصف المجال</Label>
                        <Textarea
                          id={`area-desc-${index}`}
                          value={area.description}
                          onChange={(e) => updateResearchAreaItem(index, 'description', e.target.value)}
                          rows={2}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`area-icon-${index}`}>أيقونة المجال</Label>
                        <Input
                          id={`area-icon-${index}`}
                          value={area.icon}
                          onChange={(e) => updateResearchAreaItem(index, 'icon', e.target.value)}
                          className="text-right"
                          placeholder="Award, BookOpen, Users, TrendingUp"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                المنشورات العلمية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="publicationsTitle">عنوان قسم المنشورات</Label>
                <Input
                  id="publicationsTitle"
                  value={formData.publicationsTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicationsTitle: e.target.value }))}
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="publicationsSubtitle">وصف قسم المنشورات</Label>
                <Textarea
                  id="publicationsSubtitle"
                  value={formData.publicationsSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicationsSubtitle: e.target.value }))}
                  rows={2}
                  className="text-right"
                />
              </div>

              <div className="space-y-4">
                <Label>المنشورات العلمية</Label>
                {formData.publications.map((publication, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`pub-title-${index}`}>عنوان البحث</Label>
                        <Input
                          id={`pub-title-${index}`}
                          value={publication.title}
                          onChange={(e) => updatePublicationItem(index, 'title', e.target.value)}
                          className="text-right"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`pub-authors-${index}`}>أسماء الباحثين</Label>
                          <Input
                            id={`pub-authors-${index}`}
                            value={publication.authors}
                            onChange={(e) => updatePublicationItem(index, 'authors', e.target.value)}
                            className="text-right"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`pub-journal-${index}`}>اسم المجلة</Label>
                          <Input
                            id={`pub-journal-${index}`}
                            value={publication.journal}
                            onChange={(e) => updatePublicationItem(index, 'journal', e.target.value)}
                            className="text-right"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`pub-year-${index}`}>سنة النشر</Label>
                          <Input
                            id={`pub-year-${index}`}
                            value={publication.year}
                            onChange={(e) => updatePublicationItem(index, 'year', e.target.value)}
                            className="text-right"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`pub-category-${index}`}>فئة البحث</Label>
                          <Input
                            id={`pub-category-${index}`}
                            value={publication.category}
                            onChange={(e) => updatePublicationItem(index, 'category', e.target.value)}
                            className="text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Facilities Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                مرافق البحث العلمي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facilitiesTitle">عنوان قسم المرافق</Label>
                <Input
                  id="facilitiesTitle"
                  value={formData.facilitiesTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, facilitiesTitle: e.target.value }))}
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="facilitiesSubtitle">وصف قسم المرافق</Label>
                <Textarea
                  id="facilitiesSubtitle"
                  value={formData.facilitiesSubtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, facilitiesSubtitle: e.target.value }))}
                  rows={2}
                  className="text-right"
                />
              </div>

              <div className="space-y-4">
                <Label>مرافق البحث</Label>
                {formData.facilities.map((facility, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`facility-name-${index}`}>اسم المرفق</Label>
                        <Input
                          id={`facility-name-${index}`}
                          value={facility.name}
                          onChange={(e) => updateFacilityItem(index, 'name', e.target.value)}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`facility-desc-${index}`}>وصف المرفق</Label>
                        <Textarea
                          id={`facility-desc-${index}`}
                          value={facility.description}
                          onChange={(e) => updateFacilityItem(index, 'description', e.target.value)}
                          rows={2}
                          className="text-right"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>الأجهزة والمعدات</Label>
                        {facility.equipment.map((equipment, equipIndex) => (
                          <div key={equipIndex} className="flex gap-2">
                            <Input
                              value={equipment}
                              onChange={(e) => updateFacilityEquipment(index, equipIndex, e.target.value)}
                              className="text-right"
                              placeholder={`جهاز ${equipIndex + 1}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFacilityEquipment(index, equipIndex)}
                            >
                              حذف
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addFacilityEquipment(index)}
                        >
                          إضافة جهاز
                        </Button>
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
            معاينة صفحة البحث العلمي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{formData.pageTitle}</h1>
              <p className="text-lg text-muted-foreground">{formData.pageSubtitle}</p>
            </div>

            {/* Research Areas Preview */}
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">{formData.areasTitle}</h2>
              <p className="text-muted-foreground mb-4">{formData.areasSubtitle}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {formData.researchAreas.map((area, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg text-center">
                    <h3 className="font-semibold mb-2">{area.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{area.description}</p>
                    <div className="bg-university-blue-light p-2 rounded">
                      <span className="text-university-blue font-bold">{area.projects}</span>
                      <p className="text-xs text-university-blue">مشروع بحثي</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications Preview */}
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">{formData.publicationsTitle}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {formData.publications.slice(0, 2).map((publication, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-university-blue text-white px-2 py-1 rounded text-xs">
                        {publication.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{publication.year}</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">{publication.title}</h3>
                    <p className="text-xs text-university-blue mb-1">{publication.authors}</p>
                    <p className="text-xs text-muted-foreground">{publication.journal}</p>
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