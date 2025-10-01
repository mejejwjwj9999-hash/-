import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentsManagement from '@/components/admin/DepartmentsManagement';
import { ProgramsManagement } from '@/components/admin/ProgramsManagement';
import { Building2, GraduationCap } from 'lucide-react';

const DepartmentsPage: React.FC = () => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h1 className="text-3xl font-bold text-foreground mb-2">إدارة الأقسام والبرامج الأكاديمية</h1>
        <p className="text-muted-foreground">
          إدارة شاملة للأقسام الأكاديمية وبرامجها في الكلية
        </p>
      </div>

      <Tabs defaultValue="departments" className="w-full" dir="rtl">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-auto p-1">
          <TabsTrigger 
            value="departments" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
          >
            <Building2 className="w-4 h-4" />
            الأقسام الأكاديمية
          </TabsTrigger>
          <TabsTrigger 
            value="programs" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 py-3"
          >
            <GraduationCap className="w-4 h-4" />
            البرامج الأكاديمية
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="mt-6">
          <DepartmentsManagement />
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <ProgramsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentsPage;
