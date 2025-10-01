import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInfoTab } from './BasicInfoTab';
import { FacultyTab } from './FacultyTab';
import { CurriculumTab } from './CurriculumTab';
import { RequirementsTab } from './RequirementsTab';
import { CareerTab } from './EnhancedCareerTab';
import { StatisticsTab } from './EnhancedStatisticsTab';
import { VisualCustomizationTab } from './VisualCustomizationTab';
import { ProgramFormData } from './types';

interface ProgramFormTabsProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProgramFormTabs: React.FC<ProgramFormTabsProps> = ({
  formData,
  setFormData,
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-7 mb-6">
        <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
        <TabsTrigger value="faculty">أعضاء هيئة التدريس</TabsTrigger>
        <TabsTrigger value="curriculum">الخطة الدراسية</TabsTrigger>
        <TabsTrigger value="requirements">شروط القبول</TabsTrigger>
        <TabsTrigger value="career">الفرص المهنية</TabsTrigger>
        <TabsTrigger value="statistics">الإحصائيات</TabsTrigger>
        <TabsTrigger value="visual">التخصيص المرئي</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6">
        <BasicInfoTab formData={formData} setFormData={setFormData} />
      </TabsContent>

      <TabsContent value="faculty" className="space-y-6">
        <FacultyTab formData={formData} setFormData={setFormData} />
      </TabsContent>

      <TabsContent value="curriculum" className="space-y-6">
        <CurriculumTab formData={formData} setFormData={setFormData} />
      </TabsContent>

      <TabsContent value="requirements" className="space-y-6">
        <RequirementsTab formData={formData} setFormData={setFormData} />
      </TabsContent>

      <TabsContent value="career" className="space-y-6">
        <CareerTab formData={formData} setFormData={setFormData} />
      </TabsContent>

      <TabsContent value="statistics" className="space-y-6">
        <StatisticsTab formData={formData} setFormData={setFormData} />
      </TabsContent>

      <TabsContent value="visual" className="space-y-6">
        <VisualCustomizationTab formData={formData} setFormData={setFormData} />
      </TabsContent>
    </Tabs>
  );
};