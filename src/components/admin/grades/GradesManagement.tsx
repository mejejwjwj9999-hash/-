import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Users, 
  Upload, 
  Download, 
  BarChart3,
  FolderOpen
} from 'lucide-react';
import { StudentsTab } from './StudentsTab';
import { BulkOperationsTab } from './BulkOperationsTab';
import { CoursesTab } from './CoursesTab';
import { ReportsTab } from './ReportsTab';
import { GradeActions } from './GradeActions';
import { QuickStats } from './QuickStats';
import { AddGradeDialog } from './AddGradeDialog';
import { useState } from 'react';

const GradesManagement = () => {
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<string | null>(null);
  
  return (
    <div className="container mx-auto p-6 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-8 w-8 text-university-blue" />
            <h1 className="text-3xl font-bold text-university-blue">
              إدارة الدرجات
            </h1>
          </div>
          <p className="text-academic-gray">
            نظام متكامل لإدارة ومتابعة درجات الطلاب والإحصائيات الأكاديمية
          </p>
        </div>
        
        <div className="flex gap-3">
          <GradeActions 
            onRefresh={() => window.location.reload()}
            onExport={(format) => console.log('Export:', format)}
            onImport={() => console.log('Import')}
          />
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <QuickStats className="mb-8" />

      {/* Main Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">الطلاب</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">المقررات</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">العمليات الجماعية</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">التقارير</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <StudentsTab onAddGrade={(studentId) => setSelectedStudentForGrade(studentId)} />
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <CoursesTab />
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <BulkOperationsTab />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsTab />
        </TabsContent>
      </Tabs>
      
      {/* نافذة إضافة الدرجة */}
      <AddGradeDialog
        key={selectedStudentForGrade}
        studentId={selectedStudentForGrade || undefined}
        trigger={<div style={{ display: 'none' }} />}
        onSuccess={() => setSelectedStudentForGrade(null)}
      />
    </div>
  );
};

export default GradesManagement;