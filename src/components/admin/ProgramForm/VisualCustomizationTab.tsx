import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, GraduationCap } from 'lucide-react';
import { ProgramFormData } from './types';
import { IconSelector } from './IconSelector';

interface VisualCustomizationTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

export const VisualCustomizationTab: React.FC<VisualCustomizationTabProps> = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          التخصيص المرئي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>لون الأيقونة</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.icon_color}
                onChange={(e) => setFormData(prev => ({ ...prev, icon_color: e.target.value }))}
                className="w-16 h-10"
              />
              <Input
                value={formData.icon_color}
                onChange={(e) => setFormData(prev => ({ ...prev, icon_color: e.target.value }))}
                placeholder="#3b82f6"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>لون الخلفية</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                className="w-16 h-10"
              />
              <Input
                value={formData.background_color}
                onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                placeholder="#f8fafc"
              />
            </div>
          </div>
        </div>

        <IconSelector
          selectedIcon={formData.icon_name}
          onIconSelect={(icon) => setFormData(prev => ({ ...prev, icon_name: icon }))}
          label="أيقونة البرنامج"
          variant="inline"
        />

        <div className="space-y-2">
          <Label>معاينة</Label>
          <div className="p-4 border rounded-lg flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: formData.background_color }}
            >
              <GraduationCap
                className="w-6 h-6"
                style={{ color: formData.icon_color }}
              />
            </div>
            <div>
              <h4 className="font-medium">{formData.title_ar || 'عنوان البرنامج'}</h4>
              <p className="text-sm text-muted-foreground">معاينة البرنامج</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};