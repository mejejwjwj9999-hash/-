import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgramsManagement } from '@/components/admin/ProgramsManagement';
import DepartmentsManagement from '@/components/admin/DepartmentsManagement';
import { StatisticsOverview } from '@/components/admin/programs/StatisticsOverview';
import { Building2, GraduationCap } from 'lucide-react';
import { seedAcademicDepartments } from '@/utils/seedAcademicDepartments';

const ProgramsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('programs');

  // تحميل البيانات الأولية للأقسام عند أول تحميل
  useEffect(() => {
    const initializeData = async () => {
      try {
        await seedAcademicDepartments();
      } catch (error) {
        console.error('Error initializing departments:', error);
      }
    };
    initializeData();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">إدارة البرامج والأقسام الأكاديمية</h1>
        <p className="text-muted-foreground">
          نظام متكامل لإدارة الأقسام الأكاديمية وبرامجها الدراسية
        </p>
      </div>

      {/* Statistics Overview */}
      <StatisticsOverview />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
          <TabsTrigger value="programs" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            البرامج الأكاديمية
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="w-4 h-4" />
            الأقسام الأكاديمية
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="mt-6">
          <ProgramsManagement />
        </TabsContent>

        <TabsContent value="departments" className="mt-6">
          <DepartmentsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramsPage;