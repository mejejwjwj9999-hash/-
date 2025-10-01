import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, FileCheck } from 'lucide-react';
import { ProgramFormData, AdmissionRequirement } from './types';

interface RequirementsTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

const createEmptyRequirement = (type: 'academic' | 'general'): AdmissionRequirement => ({
  id: Date.now().toString(),
  type,
  requirement_ar: '',
  requirement_en: '',
  is_mandatory: true,
  order: 0
});

export const RequirementsTab: React.FC<RequirementsTabProps> = ({ formData, setFormData }) => {
  const [newAcademicReq, setNewAcademicReq] = useState('');
  const [newGeneralReq, setNewGeneralReq] = useState('');

  const addAcademicRequirement = () => {
    if (!newAcademicReq.trim()) return;
    
    const newReq = createEmptyRequirement('academic');
    newReq.requirement_ar = newAcademicReq;
    newReq.order = formData.academic_requirements.length;
    
    setFormData(prev => ({
      ...prev,
      academic_requirements: [...prev.academic_requirements, newReq]
    }));
    
    setNewAcademicReq('');
  };

  const addGeneralRequirement = () => {
    if (!newGeneralReq.trim()) return;
    
    const newReq = createEmptyRequirement('general');
    newReq.requirement_ar = newGeneralReq;
    newReq.order = formData.general_requirements.length;
    
    setFormData(prev => ({
      ...prev,
      general_requirements: [...prev.general_requirements, newReq]
    }));
    
    setNewGeneralReq('');
  };

  const removeAcademicRequirement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      academic_requirements: prev.academic_requirements.filter(req => req.id !== id)
    }));
  };

  const removeGeneralRequirement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      general_requirements: prev.general_requirements.filter(req => req.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            الشروط الأكاديمية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newAcademicReq}
              onChange={(e) => setNewAcademicReq(e.target.value)}
              placeholder="شهادة الثانوية العامة (القسم العلمي) بنسبة لا تقل عن 75%"
              dir="rtl"
            />
            <Button onClick={addAcademicRequirement}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.academic_requirements.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span>{req.requirement_ar}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAcademicRequirement(req.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الشروط العامة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newGeneralReq}
              onChange={(e) => setNewGeneralReq(e.target.value)}
              placeholder="اجتياز المقابلة الشخصية"
              dir="rtl"
            />
            <Button onClick={addGeneralRequirement}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.general_requirements.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span>{req.requirement_ar}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeGeneralRequirement(req.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};