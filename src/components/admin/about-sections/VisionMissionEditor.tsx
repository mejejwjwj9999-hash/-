import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, Eye, Target, Star, CheckCircle } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { useToast } from '@/hooks/use-toast';

interface VisionMissionEditorProps {
  pageKey: string;
}

export const VisionMissionEditor: React.FC<VisionMissionEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    vision: '',
    visionEn: '',
    mission: '',
    missionEn: '',
    objectives: '',
    objectivesEn: '',
    values: '',
    valuesEn: ''
  });

  React.useEffect(() => {
    if (section?.elements) {
      const vision = section.elements.find(el => el.element_key === 'vision-text');
      const mission = section.elements.find(el => el.element_key === 'mission-text');
      const objectives = section.elements.find(el => el.element_key === 'objectives-list');
      
      setFormData({
        vision: vision?.content_ar || '',
        visionEn: vision?.content_en || '',
        mission: mission?.content_ar || '',
        missionEn: mission?.content_en || '',
        objectives: objectives?.content_ar || '',
        objectivesEn: objectives?.content_en || '',
        values: '',
        valuesEn: ''
      });
    }
  }, [section]);

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      // حفظ الرؤية
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'vision-text',
        elementType: 'rich_text',
        contentAr: formData.vision,
        contentEn: formData.visionEn,
        status
      });

      // حفظ الرسالة
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'mission-text',
        elementType: 'rich_text',
        contentAr: formData.mission,
        contentEn: formData.missionEn,
        status
      });

      // حفظ الأهداف
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'objectives-list',
        elementType: 'rich_text',
        contentAr: formData.objectives,
        contentEn: formData.objectivesEn,
        status
      });

      // حفظ القيم (إذا كانت متوفرة)
      if (formData.values || formData.valuesEn) {
        await updateElement.mutateAsync({
          pageKey,
          elementKey: 'values-list',
          elementType: 'rich_text',
          contentAr: formData.values,
          contentEn: formData.valuesEn,
          status
        });
      }

      toast({
        title: status === 'published' ? 'تم النشر بنجاح' : 'تم الحفظ بنجاح',
        description: `تم ${status === 'published' ? 'نشر' : 'حفظ'} الرؤية والرسالة والأهداف`
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
          <h2 className="text-2xl font-bold">تحرير الرؤية والرسالة والأهداف</h2>
          <p className="text-muted-foreground">تحديد رؤية ورسالة وأهداف الكلية</p>
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
                <Target className="w-5 h-5" />
                الرؤية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="vision">رؤية الكلية</Label>
                <Textarea
                  id="vision"
                  value={formData.vision}
                  onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                  placeholder="أن نكون كلية رائدة في التعليم العالي والبحث العلمي..."
                  rows={4}
                  className="text-right"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  اكتب رؤية الكلية المستقبلية وما تسعى لتحقيقه
                </p>
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
            <CardContent>
              <div>
                <Label htmlFor="mission">رسالة الكلية</Label>
                <Textarea
                  id="mission"
                  value={formData.mission}
                  onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  placeholder="تقديم تعليم عالي الجودة وإجراء بحوث علمية متميزة..."
                  rows={4}
                  className="text-right"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  اكتب رسالة الكلية والأهداف الأساسية التي تسعى لتحقيقها
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                الأهداف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="objectives">أهداف الكلية</Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                  placeholder="• إعداد خريجين مؤهلين&#10;• تطوير البحث العلمي&#10;• خدمة المجتمع"
                  rows={6}
                  className="text-right"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  اكتب أهداف الكلية الاستراتيجية. استخدم النقاط (•) لتنسيق القائمة
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                القيم (اختياري)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="values">قيم الكلية</Label>
                <Textarea
                  id="values"
                  value={formData.values}
                  onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
                  placeholder="• الجودة والتميز&#10;• الابتكار والإبداع&#10;• المسؤولية المجتمعية"
                  rows={4}
                  className="text-right"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  اكتب القيم الأساسية التي تؤمن بها الكلية (اختياري)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="english" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="visionEn">College Vision</Label>
                <Textarea
                  id="visionEn"
                  value={formData.visionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, visionEn: e.target.value }))}
                  placeholder="To be a leading college in higher education and scientific research..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Write the college's future vision and what it seeks to achieve
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="missionEn">College Mission</Label>
                <Textarea
                  id="missionEn"
                  value={formData.missionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, missionEn: e.target.value }))}
                  placeholder="Providing high-quality education and conducting distinguished scientific research..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Write the college's mission and core objectives
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="objectivesEn">College Objectives</Label>
                <Textarea
                  id="objectivesEn"
                  value={formData.objectivesEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, objectivesEn: e.target.value }))}
                  placeholder="• Preparing qualified graduates&#10;• Developing scientific research&#10;• Serving the community"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Write the college's strategic objectives. Use bullets (•) for formatting
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Values (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="valuesEn">College Values</Label>
                <Textarea
                  id="valuesEn"
                  value={formData.valuesEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, valuesEn: e.target.value }))}
                  placeholder="• Quality and Excellence&#10;• Innovation and Creativity&#10;• Social Responsibility"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Write the core values that the college believes in (optional)
                </p>
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
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-3">الرؤية</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {formData.vision || 'رؤية الكلية'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-3">الرسالة</h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  {formData.mission || 'رسالة الكلية'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-800 mb-3">الأهداف</h3>
                <div className="text-purple-700 text-sm leading-relaxed text-right">
                  {formData.objectives?.split('\n').map((objective, index) => (
                    <p key={index} className="mb-1">{objective}</p>
                  )) || 'أهداف الكلية'}
                </div>
              </CardContent>
            </Card>
          </div>

          {formData.values && (
            <Card className="mt-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-orange-800 mb-3">القيم</h3>
                <div className="text-orange-700 text-sm leading-relaxed text-right max-w-2xl mx-auto">
                  {formData.values.split('\n').map((value, index) => (
                    <p key={index} className="mb-1">{value}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};