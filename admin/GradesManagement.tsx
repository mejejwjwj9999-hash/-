import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, GraduationCap, Search, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Grade = {
  id: string;
  student_id: string;
  course_id: string;
  coursework_grade?: number;
  midterm_grade?: number;
  final_grade?: number;
  total_grade?: number;
  letter_grade?: string;
  gpa_points?: number;
  academic_year: string;
  semester: string;
  status: string;
  created_at: string;
  student_profiles?: {
    student_id: string;
    first_name: string;
    last_name: string;
  };
  courses?: {
    course_code: string;
    course_name_ar: string;
    credit_hours: number;
  };
};

const GradesManagement: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterAcademicYear, setFilterAcademicYear] = useState("2024-2025");

  // جلب الدرجات مع بيانات الطلاب والمقررات
  const { data: grades, isLoading } = useQuery({
    queryKey: ["admin-grades", searchTerm, filterSemester, filterAcademicYear],
    queryFn: async (): Promise<Grade[]> => {
      let query = supabase
        .from("grades")
        .select(`
          *,
          student_profiles!grades_student_id_fkey (student_id, first_name, last_name),
          courses!grades_course_id_fkey (course_code, course_name_ar, credit_hours)
        `)
        .order("created_at", { ascending: false });

      if (filterAcademicYear !== "all") {
        query = query.eq("academic_year", filterAcademicYear);
      }

      if (filterSemester !== "all") {
        query = query.eq("semester", filterSemester);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 30,
  });

  // جلب قائمة الطلاب
  const { data: students } = useQuery({
    queryKey: ["students-for-grades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("id, student_id, first_name, last_name")
        .order("student_id");
      if (error) throw error;
      return data;
    }
  });

  // جلب قائمة المقررات
  const { data: courses } = useQuery({
    queryKey: ["courses-for-grades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, course_code, course_name_ar, credit_hours")
        .order("course_code");
      if (error) throw error;
      return data;
    }
  });

  // حساب الدرجة النهائية ونقاط الجودة
  const calculateGrade = (coursework: number, midterm: number, final: number) => {
    const total = (coursework || 0) + (midterm || 0) + (final || 0);
    let letterGrade = '';
    let gpaPoints = 0;

    if (total >= 90) {
      letterGrade = 'A';
      gpaPoints = 4.0;
    } else if (total >= 80) {
      letterGrade = 'B';
      gpaPoints = 3.0;
    } else if (total >= 70) {
      letterGrade = 'C';
      gpaPoints = 2.0;
    } else if (total >= 60) {
      letterGrade = 'D';
      gpaPoints = 1.0;
    } else {
      letterGrade = 'F';
      gpaPoints = 0.0;
    }

    return { total, letterGrade, gpaPoints };
  };

  // إضافة أو تعديل درجة
  const saveGrade = useMutation({
    mutationFn: async (gradeData: any) => {
      const coursework = parseFloat(gradeData.coursework_grade) || 0;
      const midterm = parseFloat(gradeData.midterm_grade) || 0;
      const final = parseFloat(gradeData.final_grade) || 0;
      
      const { total, letterGrade, gpaPoints } = calculateGrade(coursework, midterm, final);
      
      const payload = {
        student_id: gradeData.student_id,
        course_id: gradeData.course_id,
        coursework_grade: coursework,
        midterm_grade: midterm,
        final_grade: final,
        total_grade: total,
        letter_grade: letterGrade,
        gpa_points: gpaPoints,
        academic_year: gradeData.academic_year,
        semester: gradeData.semester,
        status: gradeData.status || 'enrolled'
      };

      if (editingGrade) {
        const { error } = await supabase
          .from("grades")
          .update(payload)
          .eq("id", editingGrade.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("grades")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-grades"] });
      toast({ 
        title: editingGrade ? "تم التحديث" : "تم الإضافة", 
        description: editingGrade ? "تم تحديث الدرجة بنجاح" : "تم إضافة الدرجة بنجاح" 
      });
      setIsDialogOpen(false);
      setEditingGrade(null);
    },
    onError: () => {
      toast({ 
        title: "خطأ", 
        description: "فشل في حفظ الدرجة", 
        variant: "destructive" 
      });
    }
  });

  // حذف درجة
  const deleteGrade = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("grades")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-grades"] });
      toast({ title: "تم الحذف", description: "تم حذف الدرجة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في حذف الدرجة", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const gradeData = {
      student_id: formData.get("student_id") as string,
      course_id: formData.get("course_id") as string,
      coursework_grade: formData.get("coursework_grade") as string,
      midterm_grade: formData.get("midterm_grade") as string,
      final_grade: formData.get("final_grade") as string,
      academic_year: formData.get("academic_year") as string,
      semester: formData.get("semester") as string,
      status: formData.get("status") as string,
    };

    saveGrade.mutate(gradeData);
  };

  // فلترة الدرجات حسب البحث
  const filteredGrades = grades?.filter(grade => {
    if (!searchTerm) return true;
    
    const studentName = `${grade.student_profiles?.first_name} ${grade.student_profiles?.last_name}`.toLowerCase();
    const studentId = grade.student_profiles?.student_id?.toLowerCase() || '';
    const courseName = grade.courses?.course_name_ar?.toLowerCase() || '';
    const courseCode = grade.courses?.course_code?.toLowerCase() || '';
    
    return studentName.includes(searchTerm.toLowerCase()) ||
           studentId.includes(searchTerm.toLowerCase()) ||
           courseName.includes(searchTerm.toLowerCase()) ||
           courseCode.includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الدرجات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة درجة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingGrade ? "تعديل الدرجة" : "إضافة درجة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student_id">الطالب</Label>
                  <Select name="student_id" defaultValue={editingGrade?.student_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.student_id} - {student.first_name} {student.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="course_id">المقرر</Label>
                  <Select name="course_id" defaultValue={editingGrade?.course_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المقرر" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.course_code} - {course.course_name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="coursework_grade">درجة الأعمال (30%)</Label>
                  <Input
                    type="number"
                    name="coursework_grade"
                    min="0"
                    max="30"
                    step="0.5"
                    defaultValue={editingGrade?.coursework_grade}
                    placeholder="0-30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="midterm_grade">درجة النصفي (30%)</Label>
                  <Input
                    type="number"
                    name="midterm_grade"
                    min="0"
                    max="30"
                    step="0.5"
                    defaultValue={editingGrade?.midterm_grade}
                    placeholder="0-30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="final_grade">درجة النهائي (40%)</Label>
                  <Input
                    type="number"
                    name="final_grade"
                    min="0"
                    max="40"
                    step="0.5"
                    defaultValue={editingGrade?.final_grade}
                    placeholder="0-40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="academic_year">السنة الأكاديمية</Label>
                  <Select name="academic_year" defaultValue={editingGrade?.academic_year || "2024-2025"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="semester">الفصل</Label>
                  <Select name="semester" defaultValue={editingGrade?.semester || "الفصل الأول"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الفصل الأول">الفصل الأول</SelectItem>
                      <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                      <SelectItem value="الفصل الصيفي">الفصل الصيفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <Select name="status" defaultValue={editingGrade?.status || "enrolled"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enrolled">مسجل</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="withdrawn">منسحب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setEditingGrade(null);
                }}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saveGrade.isPending}>
                  {saveGrade.isPending ? "جاري الحفظ..." : (editingGrade ? "تحديث" : "إضافة")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* البحث والفلترة */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالطالب أو المقرر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterAcademicYear} onValueChange={setFilterAcademicYear}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="all">جميع السنوات</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterSemester} onValueChange={setFilterSemester}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفصول</SelectItem>
                <SelectItem value="الفصل الأول">الفصل الأول</SelectItem>
                <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                <SelectItem value="الفصل الصيفي">الفصل الصيفي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            قائمة الدرجات ({filteredGrades.length})
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
                    <TableHead>الطالب</TableHead>
                    <TableHead>المقرر</TableHead>
                    <TableHead>الأعمال</TableHead>
                    <TableHead>النصفي</TableHead>
                    <TableHead>النهائي</TableHead>
                    <TableHead>المجموع</TableHead>
                    <TableHead>التقدير</TableHead>
                    <TableHead>الفصل</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {grade.student_profiles?.first_name} {grade.student_profiles?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {grade.student_profiles?.student_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{grade.courses?.course_code}</div>
                          <div className="text-sm text-muted-foreground">
                            {grade.courses?.course_name_ar}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{grade.coursework_grade || '-'}</TableCell>
                      <TableCell>{grade.midterm_grade || '-'}</TableCell>
                      <TableCell>{grade.final_grade || '-'}</TableCell>
                      <TableCell className="font-medium">{grade.total_grade || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          grade.letter_grade === 'A' ? 'bg-green-100 text-green-800' :
                          grade.letter_grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          grade.letter_grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          grade.letter_grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          grade.letter_grade === 'F' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {grade.letter_grade || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{grade.semester}</div>
                          <div className="text-muted-foreground">{grade.academic_year}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingGrade(grade);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteGrade.mutate(grade.id)}
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

export default GradesManagement;