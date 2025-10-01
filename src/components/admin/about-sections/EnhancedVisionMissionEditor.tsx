import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Eye, Target, Star, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface VisionMissionEditorProps {
  pageKey: string;
}

interface CoreValue {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  icon: string;
  color: string;
}

interface StrategicGoal {
  title_ar: string;
  title_en?: string;
  content_ar: string;
  content_en?: string;
  color: string;
}

export const EnhancedVisionMissionEditor: React.FC<VisionMissionEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  
  const [formData, setFormData] = useState({
    pageTitle: '',
    pageSubtitle: '',
    visionTitle: '',
    visionContent: '',
    missionTitle: '',
    missionContent: '',
    valuesTitle: '',
    valuesSubtitle: '',
    goalsTitle: '',
    goalsSubtitle: ''
  });

  const [coreValues, setCoreValues] = useState<CoreValue[]>([
    {
      title_ar: 'التميز الأكاديمي',
      description_ar: 'نسعى للوصول إلى أعلى معايير الجودة في التعليم والبحث العلمي',
      icon: 'Award',
      color: 'text-university-blue'
    },
    {
      title_ar: 'النزاهة والشفافية',
      description_ar: 'نلتزم بأعلى معايير النزاهة والشفافية في جميع أعمالنا وعلاقاتنا',
      icon: 'Heart',
      color: 'text-university-red'
    },
    {
      title_ar: 'خدمة المجتمع',
      description_ar: 'نركز على تلبية احتياجات المجتمع وتقديم الحلول للتحديات المحلية',
      icon: 'Users',
      color: 'text-university-gold'
    },
    {
      title_ar: 'التعلم المستمر',
      description_ar: 'نشجع ثقافة التعلم مدى الحياة والتطوير المستمر للقدرات',
      icon: 'BookOpen',
      color: 'text-university-blue'
    },
    {
      title_ar: 'الابتكار والإبداع',
      description_ar: 'نحفز الابتكار والإبداع في المناهج وطرق التدريس والبحث العلمي',
      icon: 'Target',
      color: 'text-university-red'
    },
    {
      title_ar: 'المسؤولية المجتمعية',
      description_ar: 'نؤمن بدورنا في التنمية المستدامة والمسؤولية تجاه البيئة والمجتمع',
      icon: 'Award',
      color: 'text-university-gold'
    }
  ]);

  const [strategicGoals, setStrategicGoals] = useState<StrategicGoal[]>([
    {
      title_ar: 'التعليم والتعلم',
      content_ar: '• تطوير برامج أكاديمية متميزة تواكب التطورات العلمية\n• تحسين جودة التعليم وطرق التدريس الحديثة\n• رفع معدلات نجاح الطلاب وتخرجهم في الوقت المحدد\n• تعزيز التعلم الإلكتروني والتكنولوجيا التعليمية',
      color: 'text-university-blue'
    },
    {
      title_ar: 'البحث العلمي',
      content_ar: '• تشجيع أعضاء هيئة التدريس على البحث العلمي\n• إقامة شراكات مع مؤسسات بحثية محلية وإقليمية\n• نشر البحوث في مجلات علمية محكمة\n• تطوير مراكز بحثية متخصصة',
      color: 'text-university-blue'
    },
    {
      title_ar: 'خدمة المجتمع',
      content_ar: '• تقديم برامج التدريب والتطوير المهني\n• إجراء الاستشارات التخصصية للمؤسسات\n• تنظيم فعاليات توعوية وثقافية\n• المساهمة في حل مشكلات المجتمع المحلي',
      color: 'text-university-blue'
    },
    {
      title_ar: 'البنية التحتية',
      content_ar: '• تطوير المرافق والمختبرات العلمية\n• توسيع المكتبة الأكاديمية والرقمية\n• تحديث الأنظمة الإدارية والأكاديمية\n• توفير بيئة تعليمية محفزة ومريحة',
      color: 'text-university-blue'
    }
  ]);

  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('main-content');

  React.useEffect(() => {
    if (section?.elements) {
      const pageTitle = section.elements.find(el => el.element_key === 'page_title');
      const pageSubtitle = section.elements.find(el => el.element_key === 'page_subtitle');
      const visionTitle = section.elements.find(el => el.element_key === 'vision_title');
      const visionContent = section.elements.find(el => el.element_key === 'vision_content');
      const missionTitle = section.elements.find(el => el.element_key === 'mission_title');
      const missionContent = section.elements.find(el => el.element_key === 'mission_content');
      const valuesTitle = section.elements.find(el => el.element_key === 'values_title');
      const valuesSubtitle = section.elements.find(el => el.element_key === 'values_subtitle');
      const goalsTitle = section.elements.find(el => el.element_key === 'goals_title');
      const goalsSubtitle = section.elements.find(el => el.element_key === 'goals_subtitle');
      
      setFormData({
        pageTitle: pageTitle?.content_ar || 'الرؤية والرسالة',
        pageSubtitle: pageSubtitle?.content_ar || 'نحو مستقبل أكاديمي متميز ومجتمع معرفي رائد',
        visionTitle: visionTitle?.content_ar || 'رؤيتنا',
        visionContent: visionContent?.content_ar || '',
        missionTitle: missionTitle?.content_ar || 'رسالتنا',
        missionContent: missionContent?.content_ar || '',
        valuesTitle: valuesTitle?.content_ar || 'قيمنا الأساسية',
        valuesSubtitle: valuesSubtitle?.content_ar || 'تستند كلية أيلول الجامعية في عملها على مجموعة من القيم الراسخة',
        goalsTitle: goalsTitle?.content_ar || 'أهدافنا الاستراتيجية',
        goalsSubtitle: goalsSubtitle?.content_ar || 'نعمل على تحقيق مجموعة من الأهداف الاستراتيجية'
      });

      // Load core values
      const valuesElement = section.elements.find(el => el.element_key === 'core_values');
      if (valuesElement?.metadata?.values) {
        setCoreValues(valuesElement.metadata.values);
      }

      // Load strategic goals
      const goalsElement = section.elements.find(el => el.element_key === 'strategic_goals');
      if (goalsElement?.metadata?.goals) {
        setStrategicGoals(goalsElement.metadata.goals);
      }
    }
  }, [section]);

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      const updates = [
        // Main content
        { key: 'page_title', type: 'text' as const, content: formData.pageTitle },
        { key: 'page_subtitle', type: 'text' as const, content: formData.pageSubtitle },
        { key: 'vision_title', type: 'text' as const, content: formData.visionTitle },
        { key: 'vision_content', type: 'rich_text' as const, content: formData.visionContent },
        { key: 'mission_title', type: 'text' as const, content: formData.missionTitle },
        { key: 'mission_content', type: 'rich_text' as const, content: formData.missionContent },
        { key: 'values_title', type: 'text' as const, content: formData.valuesTitle },
        { key: 'values_subtitle', type: 'text' as const, content: formData.valuesSubtitle },
        { key: 'goals_title', type: 'text' as const, content: formData.goalsTitle },
        { key: 'goals_subtitle', type: 'text' as const, content: formData.goalsSubtitle },
      ];

      // Save main content elements
      await Promise.all(updates.map(update => 
        updateElement.mutateAsync({
          pageKey,
          elementKey: update.key,
          elementType: update.type,
          contentAr: update.content,
          status
        })
      ));

      // Save core values
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'core_values',
        elementType: 'rich_text',
        contentAr: '',
        metadata: { values: coreValues },
        status
      });

      // Save strategic goals
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'strategic_goals',
        elementType: 'rich_text',
        contentAr: '',
        metadata: { goals: strategicGoals },
        status
      });

    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const addCoreValue = () => {
    setCoreValues([...coreValues, {
      title_ar: '',
      description_ar: '',
      icon: 'Star',
      color: 'text-university-blue'
    }]);
  };

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    const updated = [...coreValues];
    updated[index] = { ...updated[index], [field]: value };
    setCoreValues(updated);
  };

  const removeCoreValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const addStrategicGoal = () => {
    setStrategicGoals([...strategicGoals, {
      title_ar: '',
      content_ar: '',
      color: 'text-university-blue'
    }]);
  };

  const updateStrategicGoal = (index: number, field: keyof StrategicGoal, value: string) => {
    const updated = [...strategicGoals];
    updated[index] = { ...updated[index], [field]: value };
    setStrategicGoals(updated);
  };

  const removeStrategicGoal = (index: number) => {
    setStrategicGoals(strategicGoals.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل محرر الرؤية والرسالة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">محرر الرؤية والرسالة المتطور</h2>
          <p className="text-muted-foreground">تحكم كامل في محتوى صفحة الرؤية والرسالة والأهداف</p>
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
            onClick={() => handleSave('draft')}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ مسودة
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            {updateElement.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            نشر التغييرات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="main-content">المحتوى الأساسي</TabsTrigger>
              <TabsTrigger value="core-values">القيم الأساسية</TabsTrigger>
              <TabsTrigger value="strategic-goals">الأهداف الاستراتيجية</TabsTrigger>
            </TabsList>

            {/* Main Content Tab */}
            <TabsContent value="main-content">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الصفحة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>عنوان الصفحة</Label>
                      <Input
                        value={formData.pageTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, pageTitle: e.target.value }))}
                        placeholder="الرؤية والرسالة"
                      />
                    </div>
                    <div>
                      <Label>وصف الصفحة</Label>
                      <Textarea
                        value={formData.pageSubtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, pageSubtitle: e.target.value }))}
                        placeholder="نحو مستقبل أكاديمي متميز..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      الرؤية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>عنوان القسم</Label>
                      <Input
                        value={formData.visionTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, visionTitle: e.target.value }))}
                        placeholder="رؤيتنا"
                      />
                    </div>
                    <div>
                      <Label>محتوى الرؤية</Label>
                      <RichTextEditor
                        value={formData.visionContent}
                        onChange={(value) => setFormData(prev => ({ ...prev, visionContent: value }))}
                        placeholder="أن نكون كلية رائدة ومتميزة في التعليم العالي..."
                        height="200px"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      الرسالة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>عنوان القسم</Label>
                      <Input
                        value={formData.missionTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, missionTitle: e.target.value }))}
                        placeholder="رسالتنا"
                      />
                    </div>
                    <div>
                      <Label>محتوى الرسالة</Label>
                      <RichTextEditor
                        value={formData.missionContent}
                        onChange={(value) => setFormData(prev => ({ ...prev, missionContent: value }))}
                        placeholder="تقديم تعليم عالي الجودة في التخصصات..."
                        height="200px"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>عناوين الأقسام الفرعية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>عنوان قسم القيم</Label>
                      <Input
                        value={formData.valuesTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, valuesTitle: e.target.value }))}
                        placeholder="قيمنا الأساسية"
                      />
                    </div>
                    <div>
                      <Label>وصف قسم القيم</Label>
                      <Textarea
                        value={formData.valuesSubtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, valuesSubtitle: e.target.value }))}
                        placeholder="تستند كلية أيلول الجامعية في عملها..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>عنوان قسم الأهداف</Label>
                      <Input
                        value={formData.goalsTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, goalsTitle: e.target.value }))}
                        placeholder="أهدافنا الاستراتيجية"
                      />
                    </div>
                    <div>
                      <Label>وصف قسم الأهداف</Label>
                      <Textarea
                        value={formData.goalsSubtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, goalsSubtitle: e.target.value }))}
                        placeholder="نعمل على تحقيق مجموعة من الأهداف..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Core Values Tab */}
            <TabsContent value="core-values">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    القيم الأساسية ({coreValues.length})
                  </CardTitle>
                  <Button onClick={addCoreValue} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة قيمة
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coreValues.map((value, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">قيمة {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeCoreValue(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>عنوان القيمة</Label>
                            <Input
                              value={value.title_ar}
                              onChange={(e) => updateCoreValue(index, 'title_ar', e.target.value)}
                              placeholder="التميز الأكاديمي"
                            />
                          </div>
                          <div>
                            <Label>الأيقونة</Label>
                            <Input
                              value={value.icon}
                              onChange={(e) => updateCoreValue(index, 'icon', e.target.value)}
                              placeholder="Award"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>وصف القيمة</Label>
                          <Textarea
                            value={value.description_ar}
                            onChange={(e) => updateCoreValue(index, 'description_ar', e.target.value)}
                            placeholder="نسعى للوصول إلى أعلى معايير الجودة..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>لون القيمة</Label>
                          <select
                            value={value.color}
                            onChange={(e) => updateCoreValue(index, 'color', e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="text-university-blue">الأزرق الجامعي</option>
                            <option value="text-university-red">الأحمر الجامعي</option>
                            <option value="text-university-gold">الذهبي الجامعي</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Strategic Goals Tab */}
            <TabsContent value="strategic-goals">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    الأهداف الاستراتيجية ({strategicGoals.length})
                  </CardTitle>
                  <Button onClick={addStrategicGoal} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة هدف
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strategicGoals.map((goal, index) => (
                    <Card key={index} className="border-l-4 border-l-secondary">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">هدف {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeStrategicGoal(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>عنوان الهدف</Label>
                          <Input
                            value={goal.title_ar}
                            onChange={(e) => updateStrategicGoal(index, 'title_ar', e.target.value)}
                            placeholder="التعليم والتعلم"
                          />
                        </div>
                        <div>
                          <Label>محتوى الهدف (استخدم • للنقاط)</Label>
                          <Textarea
                            value={goal.content_ar}
                            onChange={(e) => updateStrategicGoal(index, 'content_ar', e.target.value)}
                            placeholder="• تطوير برامج أكاديمية متميزة&#10;• تحسين جودة التعليم..."
                            rows={6}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  معاينة مباشرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 max-h-96 overflow-y-auto">
                  {/* Page Header Preview */}
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                    <h1 className="text-2xl font-bold mb-2">{formData.pageTitle}</h1>
                    <p className="text-muted-foreground">{formData.pageSubtitle}</p>
                  </div>

                  {/* Vision & Mission Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-primary">{formData.visionTitle}</h3>
                      </div>
                      <div 
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: formData.visionContent }}
                      />
                    </div>

                    <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-secondary" />
                        <h3 className="font-bold text-secondary">{formData.missionTitle}</h3>
                      </div>
                      <div 
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: formData.missionContent }}
                      />
                    </div>
                  </div>

                  {/* Values Preview */}
                  <div>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold">{formData.valuesTitle}</h3>
                      <p className="text-sm text-muted-foreground">{formData.valuesSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {coreValues.map((value, index) => (
                        <div key={index} className="p-3 border rounded-lg text-center">
                          <div className="text-2xl mb-2">{value.icon}</div>
                          <h4 className="font-semibold text-xs mb-1">{value.title_ar}</h4>
                          <p className="text-xs text-muted-foreground">{value.description_ar}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goals Preview */}
                  <div>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold">{formData.goalsTitle}</h3>
                      <p className="text-sm text-muted-foreground">{formData.goalsSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {strategicGoals.map((goal, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-semibold text-xs mb-2">{goal.title_ar}</h4>
                          <div className="text-xs text-muted-foreground">
                            {goal.content_ar?.split('\n').map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};