import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Brain, Zap, Trophy } from 'lucide-react';
import { ProgramFormData } from './types';

interface LearningOutcomesSectionProps {
  form: UseFormReturn<ProgramFormData>;
}

export const LearningOutcomesSection: React.FC<LearningOutcomesSectionProps> = ({ form }) => {
  const learningOutcomes = form.watch('learning_outcomes') || [
    { category: 'knowledge', title_ar: 'المعرفة والفهم', title_en: 'Knowledge and Understanding', outcomes: [] },
    { category: 'skills', title_ar: 'المهارات', title_en: 'Skills', outcomes: [] },
    { category: 'competencies', title_ar: 'الكفاءات', title_en: 'Competencies', outcomes: [] }
  ];

  const updateCategory = (categoryIndex: number, field: string, value: any) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes[categoryIndex] = { ...newOutcomes[categoryIndex], [field]: value };
    form.setValue('learning_outcomes', newOutcomes);
  };

  const addOutcome = (categoryIndex: number) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes[categoryIndex].outcomes.push({ ar: '', en: '' });
    form.setValue('learning_outcomes', newOutcomes);
  };

  const removeOutcome = (categoryIndex: number, outcomeIndex: number) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes[categoryIndex].outcomes.splice(outcomeIndex, 1);
    form.setValue('learning_outcomes', newOutcomes);
  };

  const updateOutcome = (categoryIndex: number, outcomeIndex: number, field: 'ar' | 'en', value: string) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes[categoryIndex].outcomes[outcomeIndex][field] = value;
    form.setValue('learning_outcomes', newOutcomes);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'knowledge': return <Brain className="w-5 h-5" />;
      case 'skills': return <Zap className="w-5 h-5" />;
      case 'competencies': return <Trophy className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          مخرجات التعلم
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="knowledge" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              المعرفة والفهم
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              المهارات
            </TabsTrigger>
            <TabsTrigger value="competencies" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              الكفاءات
            </TabsTrigger>
          </TabsList>

          {learningOutcomes.map((category: any, categoryIndex: number) => (
            <TabsContent key={category.category} value={category.category} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">عنوان الفئة (عربي)</label>
                  <Textarea
                    value={category.title_ar || ''}
                    onChange={(e) => updateCategory(categoryIndex, 'title_ar', e.target.value)}
                    placeholder="أدخل عنوان الفئة باللغة العربية"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">عنوان الفئة (إنجليزي)</label>
                  <Textarea
                    value={category.title_en || ''}
                    onChange={(e) => updateCategory(categoryIndex, 'title_en', e.target.value)}
                    placeholder="Enter category title in English"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    {getCategoryIcon(category.category)}
                    مخرجات {category.title_ar}
                  </h4>
                  <Button
                    type="button"
                    onClick={() => addOutcome(categoryIndex)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مخرج
                  </Button>
                </div>

                {category.outcomes?.map((outcome: any, outcomeIndex: number) => (
                  <Card key={outcomeIndex} className="border-l-4 border-l-secondary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          المخرج {outcomeIndex + 1}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOutcome(categoryIndex, outcomeIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">المخرج (عربي)</label>
                          <Textarea
                            value={outcome.ar || ''}
                            onChange={(e) => updateOutcome(categoryIndex, outcomeIndex, 'ar', e.target.value)}
                            placeholder="أدخل مخرج التعلم باللغة العربية"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">المخرج (إنجليزي)</label>
                          <Textarea
                            value={outcome.en || ''}
                            onChange={(e) => updateOutcome(categoryIndex, outcomeIndex, 'en', e.target.value)}
                            placeholder="Enter learning outcome in English"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!category.outcomes || category.outcomes.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    {getCategoryIcon(category.category)}
                    <p className="mt-2">لا توجد مخرجات تعلم مضافة لهذه الفئة</p>
                    <p className="text-sm">اضغط على "إضافة مخرج" لبدء إضافة مخرجات التعلم</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};