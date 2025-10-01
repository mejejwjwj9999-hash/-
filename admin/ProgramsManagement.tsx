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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BasicInfoTab, 
  FacultyTab, 
  CurriculumTab, 
  StatisticsTab, 
  CareerTab,
  createInitialFormData,
  ProgramFormData 
} from '@/components/admin/ProgramForm';

// استخدام النوع والبيانات الأولية من المكونات الجديدة

// البرامج الأكاديمية الفعلية الموجودة في النظام
const existingPrograms = [
  {
    id: 'pharmacy',
    program_key: 'pharmacy',
    title_ar: 'كلية الصيدلة',
    title_en: 'College of Pharmacy',
    description_ar: 'برنامج شامل ومتطور لإعداد صيادلة مؤهلين قادرين على المساهمة الفعالة في القطاع الصحي والدوائي',
    description_en: 'Comprehensive program to prepare qualified pharmacists capable of effective contribution to the health and pharmaceutical sector',
    summary_ar: 'إعداد صيادلة مؤهلين ومتخصصين قادرين على تقديم الرعاية الدوائية الشاملة والآمنة للمرضى في مختلف البيئات الصحية',
    icon: Pill,
    icon_color: '#3b82f6',
    background_color: '#f0f9ff',
    duration_years: 5,
    credit_hours: 168,
    degree_type: 'bachelor',
    student_count: 85,
    college_ar: 'كلية الصيدلة',
    college_en: 'College of Pharmacy',
    is_active: true,
    is_featured: true,
    has_page: true,
    route: '/pharmacy'
  },
  {
    id: 'nursing',
    program_key: 'nursing',
    title_ar: 'كلية التمريض',
    title_en: 'College of Nursing',
    description_ar: 'برنامج شامل ومتطور لإعداد ممرضين مؤهلين قادرين على تقديم رعاية تمريضية متميزة في مختلف المجالات الصحية',
    description_en: 'Comprehensive program to prepare qualified nurses capable of providing excellent nursing care in various healthcare fields',
    summary_ar: 'إعداد ممرضين مؤهلين ومتخصصين قادرين على تقديم رعاية تمريضية شاملة وآمنة للمرضى في مختلف البيئات الصحية',
    icon: Heart,
    icon_color: '#dc2626',
    background_color: '#fef2f2',
    duration_years: 4,
    credit_hours: 132,
    degree_type: 'bachelor',
    student_count: 95,
    college_ar: 'كلية التمريض',
    college_en: 'College of Nursing',
    is_active: true,
    is_featured: true,
    has_page: true,
    route: '/nursing'
  },
  {
    id: 'information-technology',
    program_key: 'information-technology',
    title_ar: 'كلية تكنولوجيا المعلومات',
    title_en: 'College of Information Technology',
    description_ar: 'برنامج شامل ومتطور لإعداد متخصصين في تكنولوجيا المعلومات قادرين على المساهمة في التحول الرقمي',
    description_en: 'Comprehensive program to prepare IT specialists capable of contributing to digital transformation',
    summary_ar: 'إعداد متخصصين مؤهلين في مجال التكنولوجيا قادرين على تطوير الحلول التقنية المبتكرة والمساهمة في التحول الرقمي',
    icon: Monitor,
    icon_color: '#7c3aed',
    background_color: '#faf5ff',
    duration_years: 4,
    credit_hours: 124,
    degree_type: 'bachelor',
    student_count: 75,
    college_ar: 'كلية تكنولوجيا المعلومات',
    college_en: 'College of Information Technology',
    is_active: true,
    is_featured: true,
    has_page: true,
    route: '/information-technology'
  },
  {
    id: 'business-administration',
    program_key: 'business-administration',
    title_ar: 'كلية إدارة الأعمال',
    title_en: 'College of Business Administration',
    description_ar: 'برنامج شامل ومتطور لإعداد قادة وإداريين مؤهلين قادرين على المساهمة الفعالة في القطاع التجاري والاقتصادي',
    description_en: 'Comprehensive program to prepare qualified leaders and administrators capable of effective contribution to the commercial and economic sector',
    summary_ar: 'إعداد قادة وإداريين مؤهلين قادرين على إدارة المؤسسات والشركات بكفاءة عالية والمساهمة في التنمية الاقتصادية',
    icon: Briefcase,
    icon_color: '#059669',
    background_color: '#f0fdf4',
    duration_years: 4,
    credit_hours: 126,
    degree_type: 'bachelor',
    student_count: 120,
    college_ar: 'كلية إدارة الأعمال',
    college_en: 'College of Business Administration',
    is_active: true,
    is_featured: true,
    has_page: true,
    route: '/business-administration'
  },
  {
    id: 'midwifery',
    program_key: 'midwifery',
    title_ar: 'كلية القبالة',
    title_en: 'College of Midwifery',
    description_ar: 'برنامج متخصص ومتطور لإعداد قابلات قانونيات مؤهلات لتقديم رعاية شاملة للأمهات والأطفال حديثي الولادة',
    description_en: 'Specialized program to prepare qualified legal midwives to provide comprehensive care for mothers and newborns',
    summary_ar: 'إعداد قابلات قانونيات مؤهلات قادرات على تقديم رعاية متخصصة وشاملة للأمهات والأطفال حديثي الولادة',
    icon: Baby,
    icon_color: '#f59e0b',
    background_color: '#fffbeb',
    duration_years: 4,
    credit_hours: 128,
    degree_type: 'bachelor',
    student_count: 65,
    college_ar: 'كلية القبالة',
    college_en: 'College of Midwifery',
    is_active: true,
    is_featured: true,
    has_page: true,
    route: '/midwifery'
  }
];

export const ProgramsManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<DynamicAcademicProgram | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>(createInitialFormData());
  const [activeTab, setActiveTab] = useState('basic');

  const { data: programs, isLoading } = useManagePrograms();
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();
  const deleteProgram = useDeleteProgram();
  const publishProgram = usePublishProgram();
  const unpublishProgram = useUnpublishProgram();

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
      // إضافة الحقول المفقودة
      faculty_members: program.faculty_members || [],
      yearly_curriculum: program.yearly_curriculum || [],
      academic_requirements: program.academic_requirements || [],
      general_requirements: program.general_requirements || [],
      program_statistics: program.program_statistics || [],
      career_opportunities_list: program.career_opportunities_list || [],
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
      if (editingProgram) {
        await updateProgram.mutateAsync({
          id: editingProgram.id,
          updates: formData
        });
      } else {
        await createProgram.mutateAsync(formData);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة البرامج الأكاديمية</h2>
          <p className="text-muted-foreground">إدارة وتحرير البرامج الأكاديمية المتاحة في الكلية</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateProgram} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-muted/30 rounded-lg">
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
                  value="statistics" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Heart className="w-4 h-4" />
                  الإحصائيات
                </TabsTrigger>
                <TabsTrigger 
                  value="career" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Briefcase className="w-4 h-4" />
                  الفرص المهنية
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-col h-16 text-xs gap-1"
                >
                  <Save className="w-4 h-4" />
                  الإعدادات
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
                
                <TabsContent value="statistics" className="mt-0">
                  <StatisticsTab 
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
                
                <TabsContent value="settings" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">إعدادات البرنامج</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 text-right">
                          <h4 className="font-semibold">البرنامج نشط</h4>
                          <p className="text-sm text-muted-foreground">
                            عندما يكون البرنامج نشطاً، سيظهر للطلاب في القائمة العامة
                          </p>
                        </div>
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 text-right">
                          <h4 className="font-semibold">برنامج مميز</h4>
                          <p className="text-sm text-muted-foreground">
                            البرامج المميزة تظهر في المقدمة وبتصميم خاص
                          </p>
                        </div>
                        <Switch
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 text-right">
                          <h4 className="font-semibold">له صفحة منفصلة</h4>
                          <p className="text-sm text-muted-foreground">
                            إنشاء صفحة مستقلة للبرنامج مع تفاصيل شاملة
                          </p>
                        </div>
                        <Switch
                          checked={formData.has_page}
                          onCheckedChange={(checked) => setFormData({ ...formData, has_page: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
              
              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6"
                >
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
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
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* البرامج الموجودة فعلاً في النظام */}
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="text-right">
            <h3 className="text-xl font-bold">البرامج الأكاديمية الحالية</h3>
            <p className="text-muted-foreground text-sm">البرامج المتاحة حالياً في النظام</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {existingPrograms.length} برنامج
          </Badge>
        </div>
        
        <div className="grid gap-6">
          {existingPrograms.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-6 flex-1">
                        {/* الأيقونة */}
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{ backgroundColor: `${program.background_color}` }}
                        >
                          <IconComponent 
                            className="w-8 h-8" 
                            style={{ color: program.icon_color }}
                          />
                        </div>

                        {/* معلومات البرنامج */}
                        <div className="flex-1 text-right">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex gap-2">
                              {program.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  مميز
                                </Badge>
                              )}
                              {program.is_active && (
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  نشط
                                </Badge>
                              )}
                              {program.has_page && (
                                <Badge variant="outline">
                                  له صفحة
                                </Badge>
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">
                                {program.title_ar}
                              </h3>
                              {program.title_en && (
                                <p className="text-sm text-muted-foreground font-medium">
                                  {program.title_en}
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {program.description_ar}
                          </p>

                          {/* تفاصيل إضافية */}
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-bold text-primary">{program.duration_years}</p>
                              <p className="text-xs text-muted-foreground">سنوات</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-bold text-primary">{program.credit_hours}</p>
                              <p className="text-xs text-muted-foreground">ساعة معتمدة</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-bold text-primary">{program.student_count}</p>
                              <p className="text-xs text-muted-foreground">طالب</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm font-bold text-primary">
                                {program.degree_type === 'bachelor' ? 'بكالوريوس' : 
                                 program.degree_type === 'master' ? 'ماجستير' : 'دكتوراه'}
                              </p>
                              <p className="text-xs text-muted-foreground">الدرجة</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCap className="w-4 h-4" />
                            <span>{program.college_ar}</span>
                          </div>
                        </div>
                      </div>

                      {/* أزرار الإجراءات */}
                      <div className="flex flex-col gap-2 mr-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProgram(program as any)}
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          تحرير
                        </Button>
                        
                        {program.has_page && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(program.route, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            معاينة
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground">
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-right">
                                حذف البرنامج الأكاديمي
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-right">
                                هل أنت متأكد من حذف برنامج "{program.title_ar}"؟ هذا الإجراء لا يمكن التراجع عنه.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-2">
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProgram(program.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                حذف نهائي
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* البرامج الديناميكية (من قاعدة البيانات) */}
      {programs && programs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="text-right">
              <h3 className="text-xl font-bold">البرامج المُنشأة</h3>
              <p className="text-muted-foreground text-sm">البرامج التي تم إنشاؤها من خلال النظام</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {programs.length} برنامج
            </Badge>
          </div>
          
          <div className="grid gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-secondary to-secondary/60"></div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-6 flex-1">
                        <div className="flex-1 text-right">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex gap-2">
                              {program.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  مميز
                                </Badge>
                              )}
                              {program.is_active && (
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  نشط
                                </Badge>
                              )}
                              {program.published_at && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                  منشور
                                </Badge>
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">
                                {program.title_ar}
                              </h3>
                              {program.title_en && (
                                <p className="text-sm text-muted-foreground font-medium">
                                  {program.title_en}
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {program.summary_ar}
                          </p>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-bold text-primary">{program.duration_years}</p>
                              <p className="text-xs text-muted-foreground">سنوات</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <p className="text-lg font-bold text-primary">{program.credit_hours}</p>
                              <p className="text-xs text-muted-foreground">ساعة معتمدة</p>
                            </div>
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm font-bold text-primary">
                                {program.degree_type === 'bachelor' ? 'بكالوريوس' : 
                                 program.degree_type === 'master' ? 'ماجستير' : 'دكتوراه'}
                              </p>
                              <p className="text-xs text-muted-foreground">الدرجة</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mr-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProgram(program)}
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          تحرير
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(program)}
                          className="gap-2"
                        >
                          {program.published_at ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              إلغاء نشر
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              نشر
                            </>
                          )}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground">
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-right">
                                حذف البرنامج الأكاديمي
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-right">
                                هل أنت متأكد من حذف برنامج "{program.title_ar}"؟ هذا الإجراء لا يمكن التراجع عنه.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-2">
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProgram(program.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                حذف نهائي
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(!programs || programs.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد برامج ديناميكية مخصصة</h3>
            <p className="text-muted-foreground mb-4">ابدأ بإضافة أول برنامج أكاديمي مخصص</p>
            <Button onClick={handleCreateProgram}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة برنامج جديد
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};