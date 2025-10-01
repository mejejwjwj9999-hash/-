
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useDepartments } from '@/hooks/useDepartments';
import { useProgramsByDepartment } from '@/hooks/usePrograms';
import { DepartmentId, ProgramId, getDepartmentName, getProgramName } from '@/domain/academics';
import { useAutoEnrollStudents } from '@/hooks/useAutoEnrollment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const CoursesManagement: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId | ''>('');

  // Set selected department when editing a course
  React.useEffect(() => {
    if (editingCourse?.department_id) {
      setSelectedDepartment(editingCourse.department_id);
    }
  }, [editingCourse]);

  const { data: departments } = useDepartments();
  const { data: availablePrograms } = useProgramsByDepartment(
    selectedDepartment as DepartmentId || null
  );
  const autoEnrollMutation = useAutoEnrollStudents();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, instructor_name")
        .order("course_code");
      if (error) throw error;
      // Return data directly as it matches our schema
      return (data || []).map(course => ({
        ...course,
        // Use actual department_id and program_id from database, fallback to conversion
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

  // Get enrollment counts for each course
  const { data: enrollmentCounts } = useQuery({
    queryKey: ["course-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_enrollments")
        .select("course_id")
        .eq("status", "enrolled");
      
      if (error) throw error;
      
      // Count enrollments per course
      const counts: Record<string, number> = {};
      data?.forEach(enrollment => {
        counts[enrollment.course_id] = (counts[enrollment.course_id] || 0) + 1;
      });
      
      return counts;
    },
    staleTime: 1000 * 30,
  });

  const createCourse = useMutation({
    mutationFn: async (courseData: any) => {
      console.log('Creating course with data:', courseData);
      const { data, error } = await supabase
        .from("courses")
        .insert(courseData)
        .select()
        .single();
      if (error) {
        console.error('Error creating course:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (courseData) => {
      // تحديث البيانات
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      qc.invalidateQueries({ queryKey: ["course-enrollments"] });
      qc.invalidateQueries({ queryKey: ["schedule"] });
      qc.invalidateQueries({ queryKey: ["student-enrollments"] });
      qc.invalidateQueries({ queryKey: ["available-courses-enrollment"] });
      
      toast({ title: "تم الإنشاء", description: "تم إنشاء المقرر بنجاح." });
      
      // التسجيل التلقائي للطلاب المؤهلين
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
      toast({ title: "خطأ", description: "فشل في إنشاء المقرر.", variant: "destructive" });
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Course> }) => {
      console.log('Updating course:', id, 'with data:', data);
      const { error } = await supabase
        .from("courses")
        .update(data)
        .eq("id", id);
      if (error) {
        console.error('Error updating course:', error);
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      qc.invalidateQueries({ queryKey: ["course-enrollments"] });
      qc.invalidateQueries({ queryKey: ["schedule"] });
      qc.invalidateQueries({ queryKey: ["student-enrollments"] });
      qc.invalidateQueries({ queryKey: ["available-courses-enrollment"] });
      toast({ title: "تم التحديث", description: "تم تحديث المقرر بنجاح." });
      setIsDialogOpen(false);
      setEditingCourse(null);
    },
    onError: (error: any) => {
      console.error('Update course error:', error);
      toast({ title: "خطأ", description: "فشل في تحديث المقرر.", variant: "destructive" });
    },
  });

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
      toast({ title: "تم الحذف", description: "تم حذف المقرر بنجاح." });
    },
    onError: (error: any) => {
      console.error('Delete course error:', error);
      toast({ title: "خطأ", description: "فشل في حذف المقرر.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const departmentId = formData.get("department_id") as DepartmentId;
    const programId = formData.get("program_id") as ProgramId;
    
    const courseData = {
      course_code: formData.get("course_code") as string,
      course_name_ar: formData.get("course_name_ar") as string,
      course_name_en: (formData.get("course_name_en") as string) || null,
      description: (formData.get("description") as string) || null,
      credit_hours: parseInt(formData.get("credit_hours") as string),
      instructor_name: (formData.get("instructor_name") as string) || null,
      // Map to database schema fields
      college: getDepartmentName(departmentId, 'ar'),
      department: getProgramName(programId, 'ar'),
      department_id: departmentId,
      program_id: programId,
      academic_year: parseInt((formData.get("academic_year") as string) || '1'),
      semester: parseInt((formData.get("semester") as string) || '1'),
    };

    console.log('Form data being submitted:', courseData);

    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse.id, data: courseData });
    } else {
      createCourse.mutate(courseData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة المقررات</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCourse(null);
            setSelectedDepartment('');
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة مقرر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "تعديل المقرر" : "إضافة مقرر جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course_code">رمز المقرر</Label>
                  <Input
                    id="course_code"
                    name="course_code"
                    defaultValue={editingCourse?.course_code}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="credit_hours">الساعات المعتمدة</Label>
                  <Input
                    id="credit_hours"
                    name="credit_hours"
                    type="number"
                    defaultValue={editingCourse?.credit_hours}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="course_name_ar">اسم المقرر (عربي)</Label>
                <Input
                  id="course_name_ar"
                  name="course_name_ar"
                  defaultValue={editingCourse?.course_name_ar}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="course_name_en">اسم المقرر (إنجليزي)</Label>
                <Input
                  id="course_name_en"
                  name="course_name_en"
                  defaultValue={editingCourse?.course_name_en || ""}
                />
              </div>
              
              <div>
                <Label htmlFor="instructor_name">مدرس المقرر</Label>
                <select
                  id="instructor_name"
                  name="instructor_name"
                  defaultValue={editingCourse?.instructor_name || ""}
                  className="w-full border rounded-md h-10 px-3"
                >
                  <option value="">اختر المدرس</option>
                  <option value="د. أحمد محمد">د. أحمد محمد</option>
                  <option value="د. فاطمة علي">د. فاطمة علي</option>
                  <option value="د. محمود حسن">د. محمود حسن</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department_id">القسم *</Label>
                  <select
                    id="department_id"
                    name="department_id"
                    defaultValue={editingCourse?.department_id || selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value as DepartmentId)}
                    className="w-full border rounded-md h-10 px-3"
                    required
                  >
                    <option value="">اختر القسم</option>
                    {departments?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name.ar}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="program_id">التخصص *</Label>
                  <select
                    id="program_id" 
                    name="program_id"
                    defaultValue={editingCourse?.program_id}
                    className="w-full border rounded-md h-10 px-3"
                    required
                    disabled={!selectedDepartment}
                  >
                    <option value="">اختر التخصص</option>
                    {availablePrograms?.map((programId) => (
                      <option key={programId} value={programId}>
                        {getProgramName(programId, 'ar')}
                      </option>
                    ))}
                  </select>
                  {!selectedDepartment && (
                    <p className="text-xs text-gray-500 mt-1">يرجى اختيار القسم أولاً</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">وصف المقرر</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingCourse?.description || ""}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="academic_year">السنة الدراسية *</Label>
                  <select
                    id="academic_year"
                    name="academic_year"
                    defaultValue={editingCourse?.academic_year?.toString() || "1"}
                    className="w-full border rounded-md h-10 px-3"
                    required
                  >
                    <option value="1">السنة الأولى</option>
                    <option value="2">السنة الثانية</option>
                    <option value="3">السنة الثالثة</option>
                    <option value="4">السنة الرابعة</option>
                    <option value="5">السنة الخامسة</option>
                    <option value="6">السنة السادسة</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="semester">الفصل *</Label>
                  <select
                    id="semester"
                    name="semester"
                    defaultValue={editingCourse?.semester?.toString() || "1"}
                    className="w-full border rounded-md h-10 px-3"
                    required
                  >
                    <option value="1">الفصل الأول</option>
                    <option value="2">الفصل الثاني</option>
                    <option value="3">الفصل الصيفي</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingCourse ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            قائمة المقررات ({courses?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                  <TableHeader>
                     <TableRow>
                       <TableHead>رمز المقرر</TableHead>
                       <TableHead>اسم المقرر</TableHead>
                       <TableHead>المدرس</TableHead>
                       <TableHead>القسم</TableHead>
                       <TableHead>التخصص</TableHead>
                       <TableHead>السنة</TableHead>
                       <TableHead>الفصل</TableHead>
                       <TableHead>الساعات المعتمدة</TableHead>
                       <TableHead>الطلاب المسجلون</TableHead>
                       <TableHead>الإجراءات</TableHead>
                     </TableRow>
                  </TableHeader>
                <TableBody>
                  {courses?.map((course) => (
                     <TableRow key={course.id}>
                       <TableCell className="font-medium">{course.course_code}</TableCell>
                       <TableCell>
                         <div>
                           <div className="font-medium">{course.course_name_ar}</div>
                           {course.course_name_en && (
                             <div className="text-sm text-muted-foreground">{course.course_name_en}</div>
                           )}
                         </div>
                       </TableCell>
                       <TableCell>
                         <div className="text-sm">
                           {course.instructor_name || "غير محدد"}
                         </div>
                       </TableCell>
                       <TableCell>{getDepartmentName(course.department_id, 'ar')}</TableCell>
                       <TableCell>{getProgramName(course.program_id, 'ar')}</TableCell>
                       <TableCell>{course.academic_year}</TableCell>
                       <TableCell>{course.semester}</TableCell>
                       <TableCell>{course.credit_hours}</TableCell>
                       <TableCell>
                         <Badge variant="secondary" className="text-xs">
                           {enrollmentCounts?.[course.id] || 0} طالب
                         </Badge>
                       </TableCell>
                       <TableCell>
                         <div className="flex gap-2">
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => {
                               setEditingCourse(course);
                               setIsDialogOpen(true);
                             }}
                           >
                             <Edit className="h-3 w-3" />
                           </Button>
                           <Button 
                             variant="outline" 
                             size="sm" 
                             onClick={() => deleteCourse.mutate(course.id)}
                             className="text-destructive hover:text-destructive"
                           >
                             <Trash2 className="h-3 w-3" />
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesManagement;
