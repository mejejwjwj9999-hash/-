import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Eye, Award, TrendingUp, Target, Users, CheckCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { QualityStatistic } from '@/types/aboutSections';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface QualityProgram {
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: 'active' | 'completed' | 'planned';
  startDate?: string;
  endDate?: string;
  outcomes?: string[];
}

interface QualityProcedure {
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  steps_ar: string[];
  steps_en?: string[];
  documents_required?: string[];
}

interface QualityAssuranceEditorProps {
  pageKey: string;
}

export const QualityAssuranceEditor: React.FC<QualityAssuranceEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [overviewAr, setOverviewAr] = useState('');
  const [overviewEn, setOverviewEn] = useState('');
  const [statistics, setStatistics] = useState<QualityStatistic[]>([]);
  const [objectivesAr, setObjectivesAr] = useState('');
  const [objectivesEn, setObjectivesEn] = useState('');
  const [programs, setPrograms] = useState<QualityProgram[]>([]);
  const [procedures, setProcedures] = useState<QualityProcedure[]>([]);
  const [policiesAr, setPoliciesAr] = useState('');
  const [policiesEn, setPoliciesEn] = useState('');

  React.useEffect(() => {
    if (section?.elements) {
      const overviewElement = section.elements.find(el => el.element_key === 'quality-overview');
      if (overviewElement) {
        setOverviewAr(overviewElement.content_ar || '');
        setOverviewEn(overviewElement.content_en || '');
      }

      const statsElement = section.elements.find(el => el.element_key === 'quality-statistics');
      if (statsElement?.metadata?.stats) {
        setStatistics(statsElement.metadata.stats);
      }

      const objectivesElement = section.elements.find(el => el.element_key === 'quality-objectives');
      if (objectivesElement) {
        setObjectivesAr(objectivesElement.content_ar || '');
        setObjectivesEn(objectivesElement.content_en || '');
      }

      const programsElement = section.elements.find(el => el.element_key === 'quality-programs');
      if (programsElement?.metadata?.programs) {
        setPrograms(programsElement.metadata.programs);
      }

      const proceduresElement = section.elements.find(el => el.element_key === 'quality-procedures');
      if (proceduresElement?.metadata?.procedures) {
        setProcedures(proceduresElement.metadata.procedures);
      }

      const policiesElement = section.elements.find(el => el.element_key === 'quality-policies');
      if (policiesElement) {
        setPoliciesAr(policiesElement.content_ar || '');
        setPoliciesEn(policiesElement.content_en || '');
      }
    }
  }, [section]);

  // Statistics Functions
  const addStatistic = () => {
    const newStat: QualityStatistic = {
      label_ar: '',
      label_en: '',
      value: '',
      icon: 'TrendingUp',
      color: '#3b82f6'
    };
    setStatistics([...statistics, newStat]);
  };

  const updateStatistic = (index: number, field: keyof QualityStatistic, value: string) => {
    const updatedStats = [...statistics];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setStatistics(updatedStats);
  };

  const removeStatistic = (index: number) => {
    setStatistics(statistics.filter((_, i) => i !== index));
  };

  // Programs Functions
  const addProgram = () => {
    const newProgram: QualityProgram = {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      status: 'active',
      startDate: '',
      endDate: '',
      outcomes: ['']
    };
    setPrograms([...programs, newProgram]);
  };

  const updateProgram = (index: number, field: keyof QualityProgram, value: string | string[]) => {
    const updatedPrograms = [...programs];
    updatedPrograms[index] = { ...updatedPrograms[index], [field]: value };
    setPrograms(updatedPrograms);
  };

  const removeProgram = (index: number) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const addOutcome = (programIndex: number) => {
    const updatedPrograms = [...programs];
    if (!updatedPrograms[programIndex].outcomes) {
      updatedPrograms[programIndex].outcomes = [];
    }
    updatedPrograms[programIndex].outcomes!.push('');
    setPrograms(updatedPrograms);
  };

  const updateOutcome = (programIndex: number, outcomeIndex: number, value: string) => {
    const updatedPrograms = [...programs];
    updatedPrograms[programIndex].outcomes![outcomeIndex] = value;
    setPrograms(updatedPrograms);
  };

  const removeOutcome = (programIndex: number, outcomeIndex: number) => {
    const updatedPrograms = [...programs];
    updatedPrograms[programIndex].outcomes = updatedPrograms[programIndex].outcomes!.filter((_, i) => i !== outcomeIndex);
    setPrograms(updatedPrograms);
  };

  // Procedures Functions
  const addProcedure = () => {
    const newProcedure: QualityProcedure = {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      steps_ar: [''],
      steps_en: [''],
      documents_required: ['']
    };
    setProcedures([...procedures, newProcedure]);
  };

  const updateProcedure = (index: number, field: keyof QualityProcedure, value: string | string[]) => {
    const updatedProcedures = [...procedures];
    updatedProcedures[index] = { ...updatedProcedures[index], [field]: value };
    setProcedures(updatedProcedures);
  };

  const removeProcedure = (index: number) => {
    setProcedures(procedures.filter((_, i) => i !== index));
  };

  const addStep = (procedureIndex: number, lang: 'ar' | 'en') => {
    const updatedProcedures = [...procedures];
    const field = lang === 'ar' ? 'steps_ar' : 'steps_en';
    if (!updatedProcedures[procedureIndex][field]) {
      updatedProcedures[procedureIndex][field] = [];
    }
    updatedProcedures[procedureIndex][field]!.push('');
    setProcedures(updatedProcedures);
  };

  const updateStep = (procedureIndex: number, stepIndex: number, value: string, lang: 'ar' | 'en') => {
    const updatedProcedures = [...procedures];
    const field = lang === 'ar' ? 'steps_ar' : 'steps_en';
    updatedProcedures[procedureIndex][field]![stepIndex] = value;
    setProcedures(updatedProcedures);
  };

  const removeStep = (procedureIndex: number, stepIndex: number, lang: 'ar' | 'en') => {
    const updatedProcedures = [...procedures];
    const field = lang === 'ar' ? 'steps_ar' : 'steps_en';
    updatedProcedures[procedureIndex][field] = updatedProcedures[procedureIndex][field]!.filter((_, i) => i !== stepIndex);
    setProcedures(updatedProcedures);
  };

  const saveDraft = async () => {
    try {
      await Promise.all([
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-overview',
          elementType: 'rich_text',
          contentAr: overviewAr,
          contentEn: overviewEn,
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-statistics',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { stats: statistics },
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-objectives',
          elementType: 'rich_text',
          contentAr: objectivesAr,
          contentEn: objectivesEn,
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-programs',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { programs },
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-procedures',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { procedures },
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-policies',
          elementType: 'rich_text',
          contentAr: policiesAr,
          contentEn: policiesEn,
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
          elementKey: 'quality-overview',
          elementType: 'rich_text',
          contentAr: overviewAr,
          contentEn: overviewEn,
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-statistics',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { stats: statistics },
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-objectives',
          elementType: 'rich_text',
          contentAr: objectivesAr,
          contentEn: objectivesEn,
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-programs',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { programs },
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-procedures',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { procedures },
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'quality-policies',
          elementType: 'rich_text',
          contentAr: policiesAr,
          contentEn: policiesEn,
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
          <h2 className="text-2xl font-bold">محرر وحدة ضمان الجودة</h2>
          <p className="text-muted-foreground">إدارة جميع محتويات وحدة ضمان الجودة والبرامج والإجراءات</p>
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="statistics">الإحصائيات</TabsTrigger>
              <TabsTrigger value="objectives">الأهداف</TabsTrigger>
              <TabsTrigger value="programs">البرامج</TabsTrigger>
              <TabsTrigger value="procedures">الإجراءات</TabsTrigger>
              <TabsTrigger value="policies">السياسات</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    نظرة عامة على وحدة ضمان الجودة
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
                        placeholder="وحدة ضمان الجودة تعمل على تطوير وتحسين جودة التعليم والخدمات المقدمة..."
                        height="300px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <RichTextEditor
                        value={overviewEn}
                        onChange={setOverviewEn}
                        label="Content in English"
                        placeholder="Quality assurance unit works to develop and improve the quality of education..."
                        height="300px"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    إحصائيات الجودة
                  </CardTitle>
                  <Button onClick={addStatistic} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة إحصائية
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statistics.map((stat, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline">إحصائية {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeStatistic(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>التسمية بالعربية</Label>
                            <Input
                              value={stat.label_ar}
                              onChange={(e) => updateStatistic(index, 'label_ar', e.target.value)}
                              placeholder="معدل رضا الطلاب"
                            />
                          </div>
                          <div>
                            <Label>Label in English</Label>
                            <Input
                              value={stat.label_en || ''}
                              onChange={(e) => updateStatistic(index, 'label_en', e.target.value)}
                              placeholder="Student Satisfaction Rate"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>القيمة</Label>
                            <Input
                              value={stat.value}
                              onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                              placeholder="95%"
                            />
                          </div>
                          <div>
                            <Label>الأيقونة</Label>
                            <Input
                              value={stat.icon || ''}
                              onChange={(e) => updateStatistic(index, 'icon', e.target.value)}
                              placeholder="TrendingUp"
                            />
                          </div>
                          <div>
                            <Label>اللون</Label>
                            <Input
                              type="color"
                              value={stat.color || '#3b82f6'}
                              onChange={(e) => updateStatistic(index, 'color', e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {statistics.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد إحصائيات مضافة</p>
                      <p className="text-sm">انقر على "إضافة إحصائية" لبدء الإضافة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Objectives Tab */}
            <TabsContent value="objectives">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    أهداف وحدة ضمان الجودة
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
                        value={objectivesAr}
                        onChange={setObjectivesAr}
                        label="الأهداف بالعربية"
                        placeholder="• ضمان جودة البرامج الأكاديمية&#10;• تطوير معايير الجودة&#10;• متابعة تطبيق الإجراءات..."
                        height="300px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <RichTextEditor
                        value={objectivesEn}
                        onChange={setObjectivesEn}
                        label="Objectives in English"
                        placeholder="• Ensure quality of academic programs&#10;• Develop quality standards&#10;• Monitor implementation..."
                        height="300px"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Programs Tab */}
            <TabsContent value="programs">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    برامج ضمان الجودة
                  </CardTitle>
                  <Button onClick={addProgram} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة برنامج
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {programs.map((program, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline">برنامج {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeProgram(index)}
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
                              <Label>عنوان البرنامج</Label>
                              <Input
                                value={program.title_ar}
                                onChange={(e) => updateProgram(index, 'title_ar', e.target.value)}
                                placeholder="برنامج تقييم الجودة الأكاديمية"
                              />
                            </div>
                            <div>
                              <Label>وصف البرنامج</Label>
                              <Textarea
                                value={program.description_ar || ''}
                                onChange={(e) => updateProgram(index, 'description_ar', e.target.value)}
                                placeholder="وصف شامل للبرنامج وأهدافه..."
                                rows={3}
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="en" className="space-y-4">
                            <div>
                              <Label>Program Title</Label>
                              <Input
                                value={program.title_en || ''}
                                onChange={(e) => updateProgram(index, 'title_en', e.target.value)}
                                placeholder="Academic Quality Assessment Program"
                              />
                            </div>
                            <div>
                              <Label>Program Description</Label>
                              <Textarea
                                value={program.description_en || ''}
                                onChange={(e) => updateProgram(index, 'description_en', e.target.value)}
                                placeholder="Comprehensive description of the program and its objectives..."
                                rows={3}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label>حالة البرنامج</Label>
                            <select
                              value={program.status}
                              onChange={(e) => updateProgram(index, 'status', e.target.value as QualityProgram['status'])}
                              className="w-full p-2 border rounded"
                            >
                              <option value="active">نشط</option>
                              <option value="completed">مكتمل</option>
                              <option value="planned">مخطط</option>
                            </select>
                          </div>
                          <div>
                            <Label>تاريخ البداية</Label>
                            <Input
                              type="date"
                              value={program.startDate || ''}
                              onChange={(e) => updateProgram(index, 'startDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>تاريخ النهاية</Label>
                            <Input
                              type="date"
                              value={program.endDate || ''}
                              onChange={(e) => updateProgram(index, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <Label>مخرجات البرنامج</Label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addOutcome(index)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(program.outcomes || []).map((outcome, oIndex) => (
                              <div key={oIndex} className="flex gap-2">
                                <Input
                                  value={outcome}
                                  onChange={(e) => updateOutcome(index, oIndex, e.target.value)}
                                  placeholder="مخرج البرنامج"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeOutcome(index, oIndex)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {programs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد برامج مضافة</p>
                      <p className="text-sm">انقر على "إضافة برنامج" لبدء الإضافة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Procedures Tab */}
            <TabsContent value="procedures">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    إجراءات ضمان الجودة
                  </CardTitle>
                  <Button onClick={addProcedure} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة إجراء
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {procedures.map((procedure, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline">إجراء {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeProcedure(index)}
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
                              <Label>عنوان الإجراء</Label>
                              <Input
                                value={procedure.title_ar}
                                onChange={(e) => updateProcedure(index, 'title_ar', e.target.value)}
                                placeholder="إجراء تقييم جودة التدريس"
                              />
                            </div>
                            <div>
                              <Label>وصف الإجراء</Label>
                              <Textarea
                                value={procedure.description_ar || ''}
                                onChange={(e) => updateProcedure(index, 'description_ar', e.target.value)}
                                placeholder="وصف مفصل للإجراء..."
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label>خطوات الإجراء</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addStep(index, 'ar')}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {(procedure.steps_ar || []).map((step, sIndex) => (
                                  <div key={sIndex} className="flex gap-2">
                                    <Input
                                      value={step}
                                      onChange={(e) => updateStep(index, sIndex, e.target.value, 'ar')}
                                      placeholder={`الخطوة ${sIndex + 1}`}
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeStep(index, sIndex, 'ar')}
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
                              <Label>Procedure Title</Label>
                              <Input
                                value={procedure.title_en || ''}
                                onChange={(e) => updateProcedure(index, 'title_en', e.target.value)}
                                placeholder="Teaching Quality Assessment Procedure"
                              />
                            </div>
                            <div>
                              <Label>Procedure Description</Label>
                              <Textarea
                                value={procedure.description_en || ''}
                                onChange={(e) => updateProcedure(index, 'description_en', e.target.value)}
                                placeholder="Detailed description of the procedure..."
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label>Procedure Steps</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addStep(index, 'en')}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {(procedure.steps_en || []).map((step, sIndex) => (
                                  <div key={sIndex} className="flex gap-2">
                                    <Input
                                      value={step}
                                      onChange={(e) => updateStep(index, sIndex, e.target.value, 'en')}
                                      placeholder={`Step ${sIndex + 1}`}
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeStep(index, sIndex, 'en')}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {procedures.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد إجراءات مضافة</p>
                      <p className="text-sm">انقر على "إضافة إجراء" لبدء الإضافة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    سياسات ضمان الجودة
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
                        value={policiesAr}
                        onChange={setPoliciesAr}
                        label="السياسات بالعربية"
                        placeholder="سياسة ضمان الجودة الأكاديمية&#10;سياسة التقييم والمراجعة..."
                        height="400px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <RichTextEditor
                        value={policiesEn}
                        onChange={setPoliciesEn}
                        label="Policies in English"
                        placeholder="Academic Quality Assurance Policy&#10;Assessment and Review Policy..."
                        height="400px"
                      />
                    </TabsContent>
                  </Tabs>
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
                <CardTitle>معاينة وحدة ضمان الجودة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overview Preview */}
                {overviewAr && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">وحدة ضمان الجودة</h3>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: overviewAr }} />
                  </div>
                )}

                {/* Statistics Preview */}
                {statistics.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">إحصائيات الجودة</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {statistics.map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg text-center"
                          style={{ borderColor: stat.color }}
                        >
                          <div
                            className="text-2xl font-bold mb-1"
                            style={{ color: stat.color }}
                          >
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label_ar}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Objectives Preview */}
                {objectivesAr && (
                  <div>
                    <h4 className="font-semibold mb-4">أهداف الوحدة</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: objectivesAr }} />
                  </div>
                )}

                {/* Programs Preview */}
                {programs.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">برامج ضمان الجودة</h4>
                    <div className="space-y-4">
                      {programs.slice(0, 3).map((program, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{program.title_ar}</h5>
                            <Badge variant={
                              program.status === 'active' ? 'default' :
                              program.status === 'completed' ? 'secondary' : 'outline'
                            }>
                              {program.status === 'active' ? 'نشط' :
                               program.status === 'completed' ? 'مكتمل' : 'مخطط'}
                            </Badge>
                          </div>
                          {program.description_ar && (
                            <p className="text-sm text-muted-foreground">{program.description_ar}</p>
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