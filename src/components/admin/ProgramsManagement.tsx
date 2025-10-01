import React, { useState } from 'react';
import {
  useManagePrograms,
  useCreateProgram,
  useUpdateProgram,
  useDeleteProgram,
  usePublishProgram,
  useUnpublishProgram,
  DynamicAcademicProgram
} from '@/hooks/useDynamicPrograms';
import { useActiveAcademicDepartments } from '@/hooks/useAcademicDepartments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Save,
  X,
  Pill,
  Heart,
  Monitor,
  Briefcase,
  Baby,
  ExternalLink,
  GraduationCap,
  Clock,
  BookOpen,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BasicInfoTab, 
  FacultyTab, 
  CurriculumTab, 
  StatisticsTab, 
  CareerTab,
  RequirementsTab,
  createInitialFormData,
  ProgramFormData 
} from '@/components/admin/ProgramForm';
import { ProgramCard } from './programs/ProgramCard';


export const ProgramsManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<DynamicAcademicProgram | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>(createInitialFormData());
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const { data: programs, isLoading } = useManagePrograms();
  const { data: departments } = useActiveAcademicDepartments();
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();
  const deleteProgram = useDeleteProgram();
  const publishProgram = usePublishProgram();
  const unpublishProgram = useUnpublishProgram();

  // Filter programs by department
  const filteredPrograms = React.useMemo(() => {
    if (!programs) return [];
    if (selectedDepartment === 'all') return programs;
    return programs.filter(p => p.department_ar === selectedDepartment);
  }, [programs, selectedDepartment]);

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setFormData(createInitialFormData());
    setIsDialogOpen(true);
  };

  const handleEditProgram = (program: DynamicAcademicProgram) => {
    setEditingProgram(program);
    const updatedFormData = createInitialFormData();
    setFormData({
      ...updatedFormData,
      program_key: program.program_key,
      title_ar: program.title_ar,
      title_en: program.title_en || '',
      description_ar: program.description_ar || '',
      description_en: program.description_en || '',
      summary_ar: program.summary_ar || '',
      summary_en: program.summary_en || '',
      icon_name: program.icon_name,
      icon_color: program.icon_color,
      background_color: program.background_color,
      featured_image: program.featured_image || '',
      gallery: program.gallery || [],
      curriculum: program.curriculum || [],
      contact_info: program.contact_info || {},
      seo_settings: program.seo_settings || {},
      duration_years: program.duration_years,
      credit_hours: program.credit_hours,
      degree_type: program.degree_type,
      department_ar: program.department_ar || '',
      department_en: program.department_en || '',
      college_ar: program.college_ar || '',
      college_en: program.college_en || '',
      admission_requirements_ar: program.admission_requirements_ar || '',
      admission_requirements_en: program.admission_requirements_en || '',
      career_opportunities_ar: program.career_opportunities_ar || '',
      career_opportunities_en: program.career_opportunities_en || '',
      display_order: program.display_order,
      is_active: program.is_active,
      is_featured: program.is_featured,
      has_page: program.has_page,
      page_template: program.page_template,
      metadata: program.metadata,
      student_count: program.metadata?.student_count || 0,
      faculty_members: Array.isArray(program.faculty_members) ? program.faculty_members : [],
      yearly_curriculum: Array.isArray(program.yearly_curriculum) ? program.yearly_curriculum.map(year => ({
        ...year,
        subjects: year.subjects || [],
        semesters: []
      })) : [],
      academic_requirements: Array.isArray(program.academic_requirements) ? program.academic_requirements : [],
      general_requirements: Array.isArray(program.general_requirements) ? program.general_requirements : [],
      program_statistics: Array.isArray(program.program_statistics) ? program.program_statistics.map((stat: any) => ({
        ...stat,
        id: stat.id || Date.now().toString()
      })) : [],
      career_opportunities_list: Array.isArray(program.career_opportunities_list) ? program.career_opportunities_list : [],
      program_overview_ar: program.program_overview_ar || '',
      program_overview_en: program.program_overview_en || ''
    });
    setIsDialogOpen(true);
  };

  const handleSaveProgram = async () => {
    if (!formData.program_key || !formData.title_ar) {
      return;
    }

    try {
      const { academic_semesters, ...payload } = formData as any;
      if (editingProgram) {
        await updateProgram.mutateAsync({
          id: editingProgram.id,
          updates: payload
        });
      } else {
        await createProgram.mutateAsync(payload);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await deleteProgram.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const handleTogglePublish = async (program: DynamicAcademicProgram) => {
    try {
      if (program.published_at) {
        await unpublishProgram.mutateAsync(program.id);
      } else {
        await publishProgram.mutateAsync(program.id);
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي البرامج</p>
                <h3 className="text-2xl font-bold mt-1">{programs?.length || 0}</h3>
              </div>
              <GraduationCap className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">البرامج المنشورة</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">
                  {programs?.filter(p => p.published_at).length || 0}
                </h3>
              </div>
              <Globe className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">البرامج النشطة</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">
                  {programs?.filter(p => p.is_active).length || 0}
                </h3>
              </div>
              <Eye className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">البرامج المميزة</p>
                <h3 className="text-2xl font-bold mt-1 text-amber-600">
                  {programs?.filter(p => p.is_featured).length || 0}
                </h3>
              </div>
              <Heart className="w-8 h-8 text-amber-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          {/* Filter by Department */}
          {departments && departments.length > 0 && (
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="فلترة حسب القسم" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name_ar}>
                    {dept.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateProgram} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 ml-2" />
                إضافة برنامج جديد
              </Button>
            </DialogTrigger>
          
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto" dir="rtl">
            <DialogHeader className="border-b pb-4 mb-6">
              <DialogTitle className="text-2xl font-bold text-right">
                {editingProgram ? 'تحرير البرنامج الأكاديمي' : 'إضافة برنامج أكاديمي جديد'}
              </DialogTitle>
              <p className="text-muted-foreground text-right mt-2">
                {editingProgram ? 'قم بتحديث معلومات البرنامج الأكاديمي' : 'أدخل تفاصيل البرنامج الأكاديمي الجديد'}
              </p>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
              <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-muted/30 rounded-lg">
                <TabsTrigger 
                  value="basic" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <GraduationCap className="w-4 h-4" />
                  المعلومات الأساسية
                </TabsTrigger>
                <TabsTrigger 
                  value="faculty" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Plus className="w-4 h-4" />
                  هيئة التدريس
                </TabsTrigger>
                <TabsTrigger 
                  value="curriculum" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Monitor className="w-4 h-4" />
                  المنهج الدراسي
                </TabsTrigger>
                <TabsTrigger 
                  value="requirements" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Heart className="w-4 h-4" />
                  شروط القبول
                </TabsTrigger>
                <TabsTrigger 
                  value="career" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Briefcase className="w-4 h-4" />
                  الفرص المهنية
                </TabsTrigger>
                <TabsTrigger 
                  value="statistics" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Heart className="w-4 h-4" />
                  الإحصائيات
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Save className="w-4 h-4" />
                  التخصيص المرئي
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-8 min-h-[500px]">
                <TabsContent value="basic" className="mt-0">
                  <BasicInfoTab 
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>
                
                <TabsContent value="faculty" className="mt-0">
                  <FacultyTab 
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>
                
                <TabsContent value="curriculum" className="mt-0">
                  <CurriculumTab 
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>
                
                <TabsContent value="requirements" className="mt-0">
                  <RequirementsTab 
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>
                
                <TabsContent value="career" className="mt-0">
                  <CareerTab 
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>
                
                <TabsContent value="statistics" className="mt-0">
                  <StatisticsTab 
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">إعدادات البرنامج</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <div className="flex-1 text-right mr-4">
                          <h4 className="font-semibold">البرنامج نشط</h4>
                          <p className="text-sm text-muted-foreground">
                            عندما يكون البرنامج نشطاً، سيظهر للطلاب في القائمة العامة
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Switch
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                        />
                        <div className="flex-1 text-right mr-4">
                          <h4 className="font-semibold">برنامج مميز</h4>
                          <p className="text-sm text-muted-foreground">
                            البرامج المميزة تظهر في المقدمة وبتصميم خاص
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Switch
                          checked={formData.has_page}
                          onCheckedChange={(checked) => setFormData({ ...formData, has_page: checked })}
                        />
                        <div className="flex-1 text-right mr-4">
                          <h4 className="font-semibold">له صفحة منفصلة</h4>
                          <p className="text-sm text-muted-foreground">
                            إنشاء صفحة مستقلة للبرنامج مع تفاصيل شاملة
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
              
              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-start gap-3 pt-6 border-t mt-8">
                <Button 
                  onClick={handleSaveProgram}
                  disabled={!formData.program_key || !formData.title_ar || createProgram.isPending || updateProgram.isPending}
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  {(createProgram.isPending || updateProgram.isPending) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      {editingProgram ? 'تحديث البرنامج' : 'حفظ البرنامج'}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6"
                >
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Programs Grid */}
      {filteredPrograms && filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onEdit={handleEditProgram}
              onDelete={handleDeleteProgram}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold">لا توجد برامج أكاديمية</h3>
            <p className="text-muted-foreground">
              {selectedDepartment === 'all' 
                ? 'ابدأ بإضافة برنامج أكاديمي جديد'
                : 'لا توجد برامج في هذا القسم'}
            </p>
            <Button onClick={handleCreateProgram} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 ml-2" />
              إضافة برنامج جديد
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};