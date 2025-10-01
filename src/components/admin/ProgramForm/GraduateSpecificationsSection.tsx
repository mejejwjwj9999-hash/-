import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, GraduationCap } from 'lucide-react';
import { ProgramFormData } from './types';

interface GraduateSpecificationsSectionProps {
  form: UseFormReturn<ProgramFormData>;
}

export const GraduateSpecificationsSection: React.FC<GraduateSpecificationsSectionProps> = ({ form }) => {
  const specifications = form.watch('graduate_specifications') || [];

  const addSpecification = () => {
    const newSpecifications = [...specifications, { ar: '', en: '' }];
    form.setValue('graduate_specifications', newSpecifications);
  };

  const removeSpecification = (index: number) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    form.setValue('graduate_specifications', newSpecifications);
  };

  const updateSpecification = (index: number, field: 'ar' | 'en', value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = { ...newSpecifications[index], [field]: value };
    form.setValue('graduate_specifications', newSpecifications);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          مواصفات الخريج
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">مواصفات وخصائص الخريج</h3>
          <Button type="button" onClick={addSpecification} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مواصفة
          </Button>
        </div>

        {specifications.map((specification: any, index: number) => (
          <Card key={index} className="border-l-4 border-l-accent">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  المواصفة {index + 1}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSpecification(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">المواصفة (عربي)</label>
                  <Textarea
                    value={specification.ar || ''}
                    onChange={(e) => updateSpecification(index, 'ar', e.target.value)}
                    placeholder="أدخل مواصفة الخريج باللغة العربية"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">المواصفة (إنجليزي)</label>
                  <Textarea
                    value={specification.en || ''}
                    onChange={(e) => updateSpecification(index, 'en', e.target.value)}
                    placeholder="Enter graduate specification in English"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {specifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد مواصفات مضافة بعد</p>
            <p className="text-sm">اضغط على "إضافة مواصفة" لبدء إضافة مواصفات الخريج</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};