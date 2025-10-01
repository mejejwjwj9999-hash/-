import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useDepartments } from '@/hooks/useDepartments';
import { useProgramsByDepartment } from '@/hooks/usePrograms';
import { DepartmentId, ProgramId, getDepartmentName, getProgramName } from '@/domain/academics';
import { useAutoEnrollStudents } from '@/hooks/useAutoEnrollment';

// استيراد المكونات الجديدة
import { CoursesHeader } from './courses/CoursesHeader';
import { CoursesFilters } from './courses/CoursesFilters';
import { CourseCard } from './courses/CourseCard';
import { CourseFormDialog } from './courses/CourseFormDialog';

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  description?: string;
  credit_hours: number;
  college: string;
  department: string;
  department_id?: DepartmentId;
  program_id?: ProgramId;
  academic_year?: number;
  semester?: number;
  prerequisites?: string[];
  instructor_name?: string;
  created_at: string;
};

const CoursesManagementEnhanced: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId | ''>('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  
  // حالات التصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  const { data: departments } = useDepartments();
  const { data: availablePrograms } = useProgramsByDepartment(
    selectedDepartment as DepartmentId || null
  );
  const autoEnrollMutation = useAutoEnrollStudents();

  // جلب المدرسين
  const { data: teachers } = useQuery({
    queryKey: ['active-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('id, first_name, last_name, email, phone')
        .eq('is_active', true)
        .order('first_name');
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // جلب المقررات
  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, instructor_name")
        .order("course_code");
      if (error) throw error;
      
      return (data || []).map(course => ({
        ...course,
        department_id: (course.department_id as DepartmentId) || Object.values(DepartmentId).find(id => 
          getDepartmentName(id, 'ar') === course.college
        ) || DepartmentId.TECH_SCIENCE,
        program_id: (course.program_id as ProgramId) || Object.values(ProgramId).find(id => 
          getProgramName(id, 'ar') === course.department
        ) || ProgramId.IT,
      }));
    },
    staleTime: 1000 * 30,
  });

  // جلب عدد الطلاب المسجلين
  const { data: enrollmentCounts } = useQuery({
    queryKey: ["course-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_enrollments")
        .select("course_id")
        .eq("status", "enrolled");
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(enrollment => {
        counts[enrollment.course_id] = (counts[enrollment.course_id] || 0) + 1;
      });
      
      return counts;
    },
    staleTime: 1000 * 30,
  });

  // إنشاء مقرر
  const createCourse = useMutation({
    mutationFn: async (courseData: any) => {
      console.log('Attempting to create course:', courseData);
      
      // التحقق من البيانات المطلوبة قبل الإرسال
      if (!courseData.college || !courseData.department) {
        throw new Error('القسم والتخصص مطلوبان');
      }
      
      const { data, error } = await supabase
        .from("courses")
        .insert(courseData)
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Course created successfully:', data);
      return data;
    },
    onSuccess: (courseData) => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      qc.invalidateQueries({ queryKey: ["course-enrollments"] });
      qc.invalidateQueries({ queryKey: ["schedule"] });
      qc.invalidateQueries({ queryKey: ["student-enrollments"] });
      qc.invalidateQueries({ queryKey: ["available-courses-enrollment"] });
      
      toast({ 
        title: "✅ تم الإنشاء بنجاح", 
        description: "تم إضافة المقرر الدراسي الجديد" 
      });
      
      autoEnrollMutation.mutate({
        courseId: courseData.id,
        departmentId: courseData.department_id,
        programId: courseData.program_id,
        academicYear: courseData.academic_year,
        semester: courseData.semester
      });
      
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Create course error:', error);
      const errorMessage = error?.message || 'فشل في إنشاء المقرر';
      toast({ 
        title: "❌ خطأ", 
        description: errorMessage === 'القسم والتخصص مطلوبان' 
          ? 'يرجى تحديد القسم والتخصص أولاً'
          : errorMessage, 
        variant: "destructive" 
      });
    },
  });

  // تحديث مقرر
  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Course> }) => {
      const { error } = await supabase
        .from("courses")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      qc.invalidateQueries({ queryKey: ["course-enrollments"] });
      toast({ 
        title: "✅ تم التحديث", 
        description: "تم تحديث بيانات المقرر بنجاح" 
      });
      setIsDialogOpen(false);
      setEditingCourse(null);
    },
    onError: () => {
      toast({ 
        title: "❌ خطأ", 
        description: "فشل في تحديث المقرر", 
        variant: "destructive" 
      });
    },
  });

  // حذف مقرر
  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({ 
        title: "✅ تم الحذف", 
        description: "تم حذف المقرر بنجاح" 
      });
    },
    onError: () => {
      toast({ 
        title: "❌ خطأ", 
        description: "فشل في حذف المقرر", 
        variant: "destructive" 
      });
    },
  });

  // معالجة إرسال النموذج
  const handleSubmit = (courseData: any) => {
    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse.id, data: courseData });
    } else {
      createCourse.mutate(courseData);
    }
  };

  // نسخ مقرر
  const handleDuplicate = (course: Course) => {
    const duplicatedCourse = {
      ...course,
      course_code: `${course.course_code}_نسخة`,
      course_name_ar: `${course.course_name_ar} (نسخة)`,
    };
    delete duplicatedCourse.id;
    delete duplicatedCourse.created_at;
    
    createCourse.mutate(duplicatedCourse);
  };

  // تصفية المقررات
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.course_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name_en?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || course.department_id === filterDepartment;
    const matchesProgram = filterProgram === '' || course.program_id === filterProgram;
    const matchesYear = filterYear === '' || course.academic_year?.toString() === filterYear;
    const matchesSemester = filterSemester === '' || course.semester?.toString() === filterSemester;
    
    return matchesSearch && matchesDepartment && matchesProgram && matchesYear && matchesSemester;
  });

  // حساب الإحصائيات
  const totalCourses = courses?.length || 0;
  const totalStudents = Object.values(enrollmentCounts || {}).reduce((a, b) => a + b, 0);
  const totalHours = courses?.reduce((sum, course) => sum + (course.credit_hours || 0), 0) || 0;
  const activeCoursesPercentage = totalCourses > 0 
    ? Math.round((filteredCourses?.length || 0) / totalCourses * 100) 
    : 0;

  // تصدير البيانات
  const handleExport = () => {
    const csvContent = filteredCourses?.map(course => 
      `${course.course_code},${course.course_name_ar},${course.credit_hours},${getDepartmentName(course.department_id, 'ar')},${getProgramName(course.program_id, 'ar')}`
    ).join('\n');
    
    const blob = new Blob([`الرمز,الاسم,الساعات,القسم,التخصص\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'courses.csv';
    link.click();
    
    toast({ 
      title: "✅ تم التصدير", 
      description: "تم تصدير البيانات بنجاح" 
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* رأس الصفحة */}
      <CoursesHeader
        totalCourses={totalCourses}
        totalStudents={totalStudents}
        totalHours={totalHours}
        activeCoursesPercentage={activeCoursesPercentage}
      />

      {/* شريط الأدوات */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button 
          onClick={() => {
            setEditingCourse(null);
            setSelectedDepartment('');
            setIsDialogOpen(true);
          }} 
          className="gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          إضافة مقرر جديد
        </Button>
      </div>

      {/* المرشحات */}
      <CoursesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDepartment={filterDepartment}
        setSelectedDepartment={setFilterDepartment}
        selectedProgram={filterProgram}
        setSelectedProgram={setFilterProgram}
        selectedYear={filterYear}
        setSelectedYear={setFilterYear}
        selectedSemester={filterSemester}
        setSelectedSemester={setFilterSemester}
        departments={departments}
        onRefresh={() => refetch()}
        onExport={handleExport}
      />

      {/* قائمة المقررات */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">جاري تحميل المقررات...</p>
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <div 
              key={course.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CourseCard
                course={course}
                enrollmentCount={enrollmentCounts?.[course.id] || 0}
                onEdit={() => {
                  setEditingCourse(course);
                  setIsDialogOpen(true);
                }}
                onDelete={() => {
                  if (window.confirm('هل أنت متأكد من حذف هذا المقرر؟')) {
                    deleteCourse.mutate(course.id);
                  }
                }}
                onDuplicate={() => handleDuplicate(course)}
                onViewDetails={() => {
                  // يمكن إضافة صفحة تفاصيل المقرر هنا
                  toast({ 
                    title: "معلومات المقرر", 
                    description: `عرض تفاصيل: ${course.course_name_ar}` 
                  });
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">لا توجد مقررات تطابق معايير البحث</p>
        </div>
      )}

      {/* نموذج الإضافة/التعديل */}
      <CourseFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCourse(null);
          setSelectedDepartment('');
        }}
        onSubmit={handleSubmit}
        editingCourse={editingCourse}
        departments={departments}
        availablePrograms={availablePrograms}
        teachers={teachers}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
      />
    </div>
  );
};

export default CoursesManagementEnhanced;
