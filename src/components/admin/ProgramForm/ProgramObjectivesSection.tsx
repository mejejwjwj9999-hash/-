import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2, Plus, Target } from 'lucide-react';
import { ProgramFormData } from './types';

interface ProgramObjectivesSectionProps {
  form: UseFormReturn<ProgramFormData>;
}

export const ProgramObjectivesSection: React.FC<ProgramObjectivesSectionProps> = ({ form }) => {
  const objectives = form.watch('program_objectives') || [];

  const addObjective = () => {
    const newObjectives = [...objectives, { ar: '', en: '' }];
    form.setValue('program_objectives', newObjectives);
  };

  const removeObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    form.setValue('program_objectives', newObjectives);
  };

  const updateObjective = (index: number, field: 'ar' | 'en', value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = { ...newObjectives[index], [field]: value };
    form.setValue('program_objectives', newObjectives);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          أهداف البرنامج
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="program_vision_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رؤية البرنامج (عربي)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="أدخل رؤية البرنامج" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_vision_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رؤية البرنامج (إنجليزي)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter program vision" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_mission_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رسالة البرنامج (عربي)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="أدخل رسالة البرنامج" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program_mission_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رسالة البرنامج (إنجليزي)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter program mission" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">أهداف البرنامج التفصيلية</h3>
            <Button type="button" onClick={addObjective} size="sm">
              <Plus className="w-4 h-4 ml-2" />
              إضافة هدف
            </Button>
          </div>

          {objectives.map((objective: any, index: number) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    الهدف {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeObjective(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">الهوف (عربي)</label>
                    <Textarea
                      value={objective.ar || ''}
                      onChange={(e) => updateObjective(index, 'ar', e.target.value)}
                      placeholder="أدخل الهدف باللغة العربية"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">الهدف (إنجليزي)</label>
                    <Textarea
                      value={objective.en || ''}
                      onChange={(e) => updateObjective(index, 'en', e.target.value)}
                      placeholder="Enter objective in English"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {objectives.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أهداف مضافة بعد</p>
              <p className="text-sm">اضغط على "إضافة هدف" لبدء إضافة أهداف البرنامج</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};