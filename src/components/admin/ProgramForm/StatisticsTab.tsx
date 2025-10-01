import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { ProgramFormData } from './types';

interface StatisticsTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          إحصائيات البرنامج
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>عدد الطلاب الحاليين</Label>
          <Input
            type="number"
            value={formData.student_count || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, student_count: Number(e.target.value) }))}
            placeholder="85"
          />
        </div>
      </CardContent>
    </Card>
  );
};