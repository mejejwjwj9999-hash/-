import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Eye, Beaker, BookOpen, FlaskConical, FileText, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { ResearchProject, ResearchField, Publication, ResearchFacility } from '@/types/aboutSections';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface ScientificResearchEditorProps {
  pageKey: string;
}

export const ScientificResearchEditor: React.FC<ScientificResearchEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [overviewAr, setOverviewAr] = useState('');
  const [overviewEn, setOverviewEn] = useState('');
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [researchFields, setResearchFields] = useState<ResearchField[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [facilities, setFacilities] = useState<ResearchFacility[]>([]);

  React.useEffect(() => {
    if (section?.elements) {
      const overviewElement = section.elements.find(el => el.element_key === 'research-overview');
      if (overviewElement) {
        setOverviewAr(overviewElement.content_ar || '');
        setOverviewEn(overviewElement.content_en || '');
      }

      const fieldsElement = section.elements.find(el => el.element_key === 'research-fields');
      if (fieldsElement?.metadata?.fields) {
        setResearchFields(fieldsElement.metadata.fields);
      }

      const projectsElement = section.elements.find(el => el.element_key === 'research-projects');
      if (projectsElement?.metadata?.projects) {
        setProjects(projectsElement.metadata.projects);
      }

      const publicationsElement = section.elements.find(el => el.element_key === 'research-publications');
      if (publicationsElement?.metadata?.publications) {
        setPublications(publicationsElement.metadata.publications);
      }

      const facilitiesElement = section.elements.find(el => el.element_key === 'research-facilities');
      if (facilitiesElement?.metadata?.facilities) {
        setFacilities(facilitiesElement.metadata.facilities);
      }
    }
  }, [section]);

  // Research Fields Functions
  const addResearchField = () => {
    const newField: ResearchField = {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      icon: 'Beaker',
      color: '#3b82f6',
      projectCount: 0
    };
    setResearchFields([...researchFields, newField]);
  };

  const updateResearchField = (index: number, field: keyof ResearchField, value: string | number) => {
    const updatedFields = [...researchFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setResearchFields(updatedFields);
  };

  const removeResearchField = (index: number) => {
    setResearchFields(researchFields.filter((_, i) => i !== index));
  };

  // Publications Functions
  const addPublication = () => {
    const newPublication: Publication = {
      title_ar: '',
      title_en: '',
      authors_ar: [''],
      authors_en: [''],
      journal_ar: '',
      journal_en: '',
      year: new Date().getFullYear().toString(),
      category: 'طبي',
      downloadUrl: '',
      abstract_ar: '',
      abstract_en: ''
    };
    setPublications([...publications, newPublication]);
  };

  const updatePublication = (index: number, field: keyof Publication, value: string | string[]) => {
    const updatedPublications = [...publications];
    updatedPublications[index] = { ...updatedPublications[index], [field]: value };
    setPublications(updatedPublications);
  };

  const removePublication = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
  };

  const addAuthor = (pubIndex: number, lang: 'ar' | 'en') => {
    const updatedPublications = [...publications];
    const field = lang === 'ar' ? 'authors_ar' : 'authors_en';
    if (!updatedPublications[pubIndex][field]) {
      updatedPublications[pubIndex][field] = [];
    }
    updatedPublications[pubIndex][field]!.push('');
    setPublications(updatedPublications);
  };

  const updateAuthor = (pubIndex: number, authorIndex: number, value: string, lang: 'ar' | 'en') => {
    const updatedPublications = [...publications];
    const field = lang === 'ar' ? 'authors_ar' : 'authors_en';
    updatedPublications[pubIndex][field]![authorIndex] = value;
    setPublications(updatedPublications);
  };

  const removeAuthor = (pubIndex: number, authorIndex: number, lang: 'ar' | 'en') => {
    const updatedPublications = [...publications];
    const field = lang === 'ar' ? 'authors_ar' : 'authors_en';
    updatedPublications[pubIndex][field] = updatedPublications[pubIndex][field]!.filter((_, i) => i !== authorIndex);
    setPublications(updatedPublications);
  };

  // Research Facilities Functions
  const addFacility = () => {
    const newFacility: ResearchFacility = {
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      equipment_ar: [''],
      equipment_en: [''],
      image: '',
      capacity: ''
    };
    setFacilities([...facilities, newFacility]);
  };

  const updateFacility = (index: number, field: keyof ResearchFacility, value: string | string[]) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index] = { ...updatedFacilities[index], [field]: value };
    setFacilities(updatedFacilities);
  };

  const removeFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const addEquipment = (facilityIndex: number, lang: 'ar' | 'en') => {
    const updatedFacilities = [...facilities];
    const field = lang === 'ar' ? 'equipment_ar' : 'equipment_en';
    if (!updatedFacilities[facilityIndex][field]) {
      updatedFacilities[facilityIndex][field] = [];
    }
    updatedFacilities[facilityIndex][field]!.push('');
    setFacilities(updatedFacilities);
  };

  const updateEquipment = (facilityIndex: number, equipIndex: number, value: string, lang: 'ar' | 'en') => {
    const updatedFacilities = [...facilities];
    const field = lang === 'ar' ? 'equipment_ar' : 'equipment_en';
    updatedFacilities[facilityIndex][field]![equipIndex] = value;
    setFacilities(updatedFacilities);
  };

  const removeEquipment = (facilityIndex: number, equipIndex: number, lang: 'ar' | 'en') => {
    const updatedFacilities = [...facilities];
    const field = lang === 'ar' ? 'equipment_ar' : 'equipment_en';
    updatedFacilities[facilityIndex][field] = updatedFacilities[facilityIndex][field]!.filter((_, i) => i !== equipIndex);
    setFacilities(updatedFacilities);
  };

  // Projects Functions (existing ones)
  const addProject = () => {
    const newProject: ResearchProject = {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      status: 'planned',
      year: new Date().getFullYear().toString(),
      researchers: [],
      publications: []
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (index: number, field: keyof ResearchProject, value: string | string[]) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const saveDraft = async () => {
    try {
      await Promise.all([
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-overview',
          elementType: 'rich_text',
          contentAr: overviewAr,
          contentEn: overviewEn,
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-fields',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { fields: researchFields },
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-projects',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { projects },
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-publications',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { publications },
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-facilities',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { facilities },
          status: 'draft'
        })
      ]);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const publish = async () => {
    try {
      await Promise.all([
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-overview',
          elementType: 'rich_text',
          contentAr: overviewAr,
          contentEn: overviewEn,
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-fields',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { fields: researchFields },
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-projects',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { projects },
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-publications',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { publications },
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'research-facilities',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { facilities },
          status: 'published'
        })
      ]);
    } catch (error) {
      console.error('Error publishing:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">محرر البحث العلمي</h2>
          <p className="text-muted-foreground">إدارة جميع محتويات صفحة البحث العلمي</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {preview ? 'إخفاء المعاينة' : 'معاينة'}
          </Button>
          <Button
            variant="outline"
            onClick={saveDraft}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ مسودة
          </Button>
          <Button
            onClick={publish}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            نشر
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="fields">مجالات البحث</TabsTrigger>
              <TabsTrigger value="publications">المنشورات</TabsTrigger>
              <TabsTrigger value="facilities">المرافق</TabsTrigger>
              <TabsTrigger value="projects">المشاريع</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="w-5 h-5" />
                    النظرة العامة على البحث العلمي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="ar" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ar" className="space-y-4">
                      <RichTextEditor
                        value={overviewAr}
                        onChange={setOverviewAr}
                        label="المحتوى بالعربية"
                        placeholder="نعزز ثقافة البحث العلمي والابتكار لخدمة المجتمع وتطوير المعرفة..."
                        height="300px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <RichTextEditor
                        value={overviewEn}
                        onChange={setOverviewEn}
                        label="Content in English"
                        placeholder="We promote a culture of scientific research and innovation to serve society..."
                        height="300px"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Research Fields Tab */}
            <TabsContent value="fields">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    مجالات البحث
                  </CardTitle>
                  <Button onClick={addResearchField} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة مجال
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {researchFields.map((field, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline">مجال {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeResearchField(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Tabs defaultValue="ar" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="ar">العربية</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="ar" className="space-y-4">
                            <div>
                              <Label>عنوان المجال</Label>
                              <Input
                                value={field.title_ar}
                                onChange={(e) => updateResearchField(index, 'title_ar', e.target.value)}
                                placeholder="البحوث الطبية"
                              />
                            </div>
                            <div>
                              <Label>وصف المجال</Label>
                              <Textarea
                                value={field.description_ar || ''}
                                onChange={(e) => updateResearchField(index, 'description_ar', e.target.value)}
                                placeholder="بحوث في مجال الطب والعلوم الصحية"
                                rows={3}
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="en" className="space-y-4">
                            <div>
                              <Label>Field Title</Label>
                              <Input
                                value={field.title_en || ''}
                                onChange={(e) => updateResearchField(index, 'title_en', e.target.value)}
                                placeholder="Medical Research"
                              />
                            </div>
                            <div>
                              <Label>Field Description</Label>
                              <Textarea
                                value={field.description_en || ''}
                                onChange={(e) => updateResearchField(index, 'description_en', e.target.value)}
                                placeholder="Research in medicine and health sciences"
                                rows={3}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label>عدد المشاريع</Label>
                            <Input
                              type="number"
                              value={field.projectCount}
                              onChange={(e) => updateResearchField(index, 'projectCount', parseInt(e.target.value) || 0)}
                              placeholder="15"
                            />
                          </div>
                          <div>
                            <Label>الأيقونة</Label>
                            <Input
                              value={field.icon || ''}
                              onChange={(e) => updateResearchField(index, 'icon', e.target.value)}
                              placeholder="Beaker"
                            />
                          </div>
                          <div>
                            <Label>اللون</Label>
                            <Input
                              type="color"
                              value={field.color || '#3b82f6'}
                              onChange={(e) => updateResearchField(index, 'color', e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {researchFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد مجالات بحثية مضافة</p>
                      <p className="text-sm">انقر على "إضافة مجال" لبدء الإضافة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Publications Tab */}
            <TabsContent value="publications">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    أحدث المنشورات العلمية
                  </CardTitle>
                  <Button onClick={addPublication} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة منشور
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {publications.map((pub, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline">منشور {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removePublication(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Tabs defaultValue="ar" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="ar">العربية</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="ar" className="space-y-4">
                            <div>
                              <Label>عنوان البحث</Label>
                              <Input
                                value={pub.title_ar}
                                onChange={(e) => updatePublication(index, 'title_ar', e.target.value)}
                                placeholder="تأثير العلاج الطبيعي على مرضى السكري"
                              />
                            </div>
                            <div>
                              <Label>المجلة العلمية</Label>
                              <Input
                                value={pub.journal_ar}
                                onChange={(e) => updatePublication(index, 'journal_ar', e.target.value)}
                                placeholder="مجلة الطب اليمنية"
                              />
                            </div>
                            <div>
                              <Label>الملخص</Label>
                              <Textarea
                                value={pub.abstract_ar || ''}
                                onChange={(e) => updatePublication(index, 'abstract_ar', e.target.value)}
                                placeholder="ملخص البحث..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label>الباحثون</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addAuthor(index, 'ar')}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {(pub.authors_ar || []).map((author, aIndex) => (
                                  <div key={aIndex} className="flex gap-2">
                                    <Input
                                      value={author}
                                      onChange={(e) => updateAuthor(index, aIndex, e.target.value, 'ar')}
                                      placeholder="د. أحمد محمد"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeAuthor(index, aIndex, 'ar')}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="en" className="space-y-4">
                            <div>
                              <Label>Research Title</Label>
                              <Input
                                value={pub.title_en || ''}
                                onChange={(e) => updatePublication(index, 'title_en', e.target.value)}
                                placeholder="Effect of Physical Therapy on Diabetes Patients"
                              />
                            </div>
                            <div>
                              <Label>Journal</Label>
                              <Input
                                value={pub.journal_en || ''}
                                onChange={(e) => updatePublication(index, 'journal_en', e.target.value)}
                                placeholder="Yemeni Medical Journal"
                              />
                            </div>
                            <div>
                              <Label>Abstract</Label>
                              <Textarea
                                value={pub.abstract_en || ''}
                                onChange={(e) => updatePublication(index, 'abstract_en', e.target.value)}
                                placeholder="Research abstract..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label>Authors</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addAuthor(index, 'en')}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {(pub.authors_en || []).map((author, aIndex) => (
                                  <div key={aIndex} className="flex gap-2">
                                    <Input
                                      value={author}
                                      onChange={(e) => updateAuthor(index, aIndex, e.target.value, 'en')}
                                      placeholder="Dr. Ahmed Mohammed"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeAuthor(index, aIndex, 'en')}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label>السنة</Label>
                            <Input
                              value={pub.year}
                              onChange={(e) => updatePublication(index, 'year', e.target.value)}
                              placeholder="2024"
                            />
                          </div>
                          <div>
                            <Label>التصنيف</Label>
                            <Select
                              value={pub.category}
                              onValueChange={(value) => updatePublication(index, 'category', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="طبي">طبي</SelectItem>
                                <SelectItem value="تقني">تقني</SelectItem>
                                <SelectItem value="صيدلة">صيدلة</SelectItem>
                                <SelectItem value="تمريض">تمريض</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>رابط التحميل</Label>
                            <Input
                              value={pub.downloadUrl || ''}
                              onChange={(e) => updatePublication(index, 'downloadUrl', e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {publications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد منشورات مضافة</p>
                      <p className="text-sm">انقر على "إضافة منشور" لبدء الإضافة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Facilities Tab */}
            <TabsContent value="facilities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    مرافق البحث العلمي
                  </CardTitle>
                  <Button onClick={addFacility} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة مرفق
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {facilities.map((facility, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline">مرفق {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFacility(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Tabs defaultValue="ar" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="ar">العربية</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="ar" className="space-y-4">
                            <div>
                              <Label>اسم المرفق</Label>
                              <Input
                                value={facility.name_ar}
                                onChange={(e) => updateFacility(index, 'name_ar', e.target.value)}
                                placeholder="مختبر البحوث الطبية"
                              />
                            </div>
                            <div>
                              <Label>وصف المرفق</Label>
                              <Textarea
                                value={facility.description_ar || ''}
                                onChange={(e) => updateFacility(index, 'description_ar', e.target.value)}
                                placeholder="مجهز بأحدث الأجهزة للبحوث الطبية والسريرية"
                                rows={3}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label>الأجهزة المتوفرة</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addEquipment(index, 'ar')}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {(facility.equipment_ar || []).map((equipment, eIndex) => (
                                  <div key={eIndex} className="flex gap-2">
                                    <Input
                                      value={equipment}
                                      onChange={(e) => updateEquipment(index, eIndex, e.target.value, 'ar')}
                                      placeholder="جهاز الطرد المركزي"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeEquipment(index, eIndex, 'ar')}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="en" className="space-y-4">
                            <div>
                              <Label>Facility Name</Label>
                              <Input
                                value={facility.name_en || ''}
                                onChange={(e) => updateFacility(index, 'name_en', e.target.value)}
                                placeholder="Medical Research Laboratory"
                              />
                            </div>
                            <div>
                              <Label>Facility Description</Label>
                              <Textarea
                                value={facility.description_en || ''}
                                onChange={(e) => updateFacility(index, 'description_en', e.target.value)}
                                placeholder="Equipped with latest equipment for medical and clinical research"
                                rows={3}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label>Available Equipment</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addEquipment(index, 'en')}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {(facility.equipment_en || []).map((equipment, eIndex) => (
                                  <div key={eIndex} className="flex gap-2">
                                    <Input
                                      value={equipment}
                                      onChange={(e) => updateEquipment(index, eIndex, e.target.value, 'en')}
                                      placeholder="Centrifuge Machine"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeEquipment(index, eIndex, 'en')}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label>صورة المرفق</Label>
                            <Input
                              value={facility.image || ''}
                              onChange={(e) => updateFacility(index, 'image', e.target.value)}
                              placeholder="رابط الصورة"
                            />
                          </div>
                          <div>
                            <Label>السعة</Label>
                            <Input
                              value={facility.capacity || ''}
                              onChange={(e) => updateFacility(index, 'capacity', e.target.value)}
                              placeholder="20 باحث"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {facilities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد مرافق مضافة</p>
                      <p className="text-sm">انقر على "إضافة مرفق" لبدء الإضافة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab - Simplified as it's less critical */}
            <TabsContent value="projects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    مشاريع البحث الإضافية
                  </CardTitle>
                  <Button onClick={addProject} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة مشروع
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.map((project, index) => (
                    <Card key={index} className="border-l-4 border-l-secondary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="secondary">مشروع {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeProject(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>عنوان المشروع (عربي)</Label>
                            <Input
                              value={project.title_ar}
                              onChange={(e) => updateProject(index, 'title_ar', e.target.value)}
                              placeholder="عنوان المشروع"
                            />
                          </div>
                          <div>
                            <Label>حالة المشروع</Label>
                            <Select
                              value={project.status}
                              onValueChange={(value: ResearchProject['status']) => updateProject(index, 'status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planned">مخطط</SelectItem>
                                <SelectItem value="active">نشط</SelectItem>
                                <SelectItem value="completed">مكتمل</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {projects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد مشاريع إضافية</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        {preview && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>معاينة صفحة البحث العلمي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overview Preview */}
                {overviewAr && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">البحث العلمي</h3>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: overviewAr }} />
                  </div>
                )}

                {/* Research Fields Preview */}
                {researchFields.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">مجالات البحث</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {researchFields.map((field, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">{field.title_ar}</h5>
                          <p className="text-sm text-muted-foreground mb-3">{field.description_ar}</p>
                          <div className="text-center">
                            <div className="text-2xl font-bold" style={{ color: field.color }}>
                              {field.projectCount}
                            </div>
                            <div className="text-sm text-muted-foreground">مشروع بحثي</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications Preview */}
                {publications.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">أحدث المنشورات العلمية</h4>
                    <div className="space-y-4">
                      {publications.slice(0, 3).map((pub, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{pub.category}</Badge>
                            <span className="text-sm text-muted-foreground">{pub.year}</span>
                          </div>
                          <h5 className="font-medium mb-2">{pub.title_ar}</h5>
                          <p className="text-sm text-muted-foreground mb-2">
                            {pub.authors_ar?.join('، ')}
                          </p>
                          <p className="text-sm font-medium text-primary">{pub.journal_ar}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilities Preview */}
                {facilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">مرافق البحث العلمي</h4>
                    <div className="space-y-4">
                      {facilities.map((facility, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">{facility.name_ar}</h5>
                          <p className="text-sm text-muted-foreground mb-3">{facility.description_ar}</p>
                          {facility.equipment_ar && facility.equipment_ar.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">الأجهزة المتوفرة:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {facility.equipment_ar.filter(eq => eq).map((equipment, eIndex) => (
                                  <li key={eIndex}>• {equipment}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};