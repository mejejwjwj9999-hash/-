import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { ProgramFormData, CareerOpportunity } from './types';

interface CareerTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

export const CareerTab: React.FC<CareerTabProps> = ({ formData, setFormData }) => {
  const [newCareer, setNewCareer] = useState('');

  const addCareerOpportunity = () => {
    if (!newCareer.trim()) return;
    
    const newOpp: CareerOpportunity = {
      id: Date.now().toString(),
      title_ar: newCareer,
      order: formData.career_opportunities_list.length
    };
    
    setFormData(prev => ({
      ...prev,
      career_opportunities_list: [...prev.career_opportunities_list, newOpp]
    }));
    
    setNewCareer('');
  };

  const removeCareerOpportunity = (id: string) => {
    setFormData(prev => ({
      ...prev,
      career_opportunities_list: prev.career_opportunities_list.filter(career => career.id !== id)
    }));
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
        <div className="flex gap-2">
          <Input
            value={newCareer}
            onChange={(e) => setNewCareer(e.target.value)}
            placeholder="صيدلي مجتمعي في الصيدليات الخاصة"
            dir="rtl"
          />
          <Button onClick={addCareerOpportunity}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.career_opportunities_list.map((career) => (
            <div key={career.id} className="flex items-center justify-between p-3 border rounded-lg">
              <span>{career.title_ar}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCareerOpportunity(career.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};