import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Briefcase } from 'lucide-react';
import { ProgramFormData } from './types';

interface JobOpportunitiesSectionProps {
  form: UseFormReturn<ProgramFormData>;
}

export const JobOpportunitiesSection: React.FC<JobOpportunitiesSectionProps> = ({ form }) => {
  const opportunities = form.watch('job_opportunities') || [];

  const addOpportunity = () => {
    const newOpportunities = [...opportunities, { ar: '', en: '' }];
    form.setValue('job_opportunities', newOpportunities);
  };

  const removeOpportunity = (index: number) => {
    const newOpportunities = opportunities.filter((_, i) => i !== index);
    form.setValue('job_opportunities', newOpportunities);
  };

  const updateOpportunity = (index: number, field: 'ar' | 'en', value: string) => {
    const newOpportunities = [...opportunities];
    newOpportunities[index] = { ...newOpportunities[index], [field]: value };
    form.setValue('job_opportunities', newOpportunities);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          الفرص المهنية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">الفرص المهنية المتاحة للخريجين</h3>
          <Button type="button" onClick={addOpportunity} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة فرصة مهنية
          </Button>
        </div>

        {opportunities.map((opportunity: any, index: number) => (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  الفرصة المهنية {index + 1}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeOpportunity(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">الفرصة المهنية (عربي)</label>
                  <Textarea
                    value={opportunity.ar || ''}
                    onChange={(e) => updateOpportunity(index, 'ar', e.target.value)}
                    placeholder="أدخل الفرصة المهنية باللغة العربية"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">الفرصة المهنية (إنجليزي)</label>
                  <Textarea
                    value={opportunity.en || ''}
                    onChange={(e) => updateOpportunity(index, 'en', e.target.value)}
                    placeholder="Enter job opportunity in English"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {opportunities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد فرص مهنية مضافة بعد</p>
            <p className="text-sm">اضغط على "إضافة فرصة مهنية" لبدء إضافة الفرص المهنية</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};