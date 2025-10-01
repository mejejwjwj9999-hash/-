
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
import { Plus, Edit, Trash2, Calendar, Search, Clock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  credit_hours: number;
};

type ClassSchedule = {
  id: string;
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classroom: string;
  instructor_name: string;
  academic_year: string;
  semester: string;
  created_at: string;
  courses?: Course;
};

const SchedulesManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState("all");
  const [filterSemester, setFilterSemester] = useState("الفصل الأول");

  const daysOfWeek = [
    { value: 0, name: 'الأحد' },
    { value: 1, name: 'الاثنين' },
    { value: 2, name: 'الثلاثاء' },
    { value: 3, name: 'الأربعاء' },
    { value: 4, name: 'الخميس' },
    { value: 5, name: 'الجمعة' },
    { value: 6, name: 'السبت' }
  ];

  // جلب الجداول الدراسية
  const { data: schedules, isLoading, refetch } = useQuery({
    queryKey: ["admin-schedules", searchTerm, filterDay, filterSemester],
    queryFn: async (): Promise<ClassSchedule[]> => {
      console.log('جاري تحميل الجداول الدراسية...');
      
      let query = supabase
        .from("class_schedule")
        .select(`
          *,
          courses!class_schedule_course_id_fkey (
            id,
            course_code, 
            course_name_ar, 
            credit_hours
          )
        `)
        .eq("semester", filterSemester)
        .order("day_of_week")
        .order("start_time");

      if (filterDay !== "all") {
        query = query.eq("day_of_week", parseInt(filterDay));
      }

      const { data, error } = await query;
      if (error) {
        console.error('خطأ في تحميل الجداول:', error);
        throw error;
      }
      console.log('تم تحميل الجداول بنجاح:', data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 30,
  });

  // جلب قائمة المقررات
  const { data: courses } = useQuery({
    queryKey: ["courses-for-schedules"],
    queryFn: async (): Promise<Course[]> => {
      console.log('جاري تحميل المقررات...');
      const { data, error } = await supabase
        .from("courses")
        .select("id, course_code, course_name_ar, credit_hours")
        .order("course_code");
      if (error) {
        console.error('خطأ في تحميل المقررات:', error);
        throw error;
      }
      console.log('تم تحميل المقررات بنجاح:', data?.length || 0);
      return data || [];
    }
  });

  // إضافة أو تعديل جدول
  const saveSchedule = useMutation({
    mutationFn: async (scheduleData: any) => {
      console.log('حفظ الجدول:', scheduleData);
      
      // التأكد من صحة البيانات
      if (!scheduleData.course_id || scheduleData.day_of_week === undefined || 
          !scheduleData.start_time || !scheduleData.end_time || 
          !scheduleData.classroom || !scheduleData.instructor_name) {
        throw new Error('جميع الحقول مطلوبة');
      }

      // التأكد من أن day_of_week هو رقم صحيح بين 0-6
      const dayOfWeek = parseInt(scheduleData.day_of_week);
      if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        throw new Error('يوم الأسبوع غير صحيح');
      }

      const payload = {
        course_id: scheduleData.course_id,
        day_of_week: dayOfWeek,
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
        classroom: scheduleData.classroom.trim(),
        instructor_name: scheduleData.instructor_name.trim(),
        academic_year: scheduleData.academic_year || "2024-2025",
        semester: scheduleData.semester || "الفصل الأول",
        specialization: scheduleData.specialization || null,
      };

      console.log('بيانات الجدول للحفظ:', payload);

      if (editingSchedule) {
        const { error } = await supabase
          .from("class_schedule")
          .update(payload)
          .eq("id", editingSchedule.id);
        if (error) {
          console.error('خطأ في تحديث الجدول:', error);
          throw error;
        }
        console.log('تم تحديث الجدول بنجاح');
      } else {
        const { error } = await supabase
          .from("class_schedule")
          .insert(payload);
        if (error) {
          console.error('خطأ في إنشاء الجدول:', error);
          throw error;
        }
        console.log('تم إنشاء الجدول بنجاح');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
      toast({ 
        title: editingSchedule ? "تم التحديث" : "تم الإضافة", 
        description: editingSchedule ? "تم تحديث الجدول بنجاح" : "تم إضافة الجدول بنجاح" 
      });
      setIsDialogOpen(false);
      setEditingSchedule(null);
    },
    onError: (error: any) => {
      console.error('خطأ في حفظ الجدول:', error);
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في حفظ الجدول", 
        variant: "destructive" 
      });
    }
  });

  // حذف جدول
  const deleteSchedule = useMutation({
    mutationFn: async (id: string) => {
      console.log('حذف الجدول:', id);
      const { error } = await supabase
        .from("class_schedule")
        .delete()
        .eq("id", id);
      if (error) {
        console.error('خطأ في حذف الجدول:', error);
        throw error;
      }
      console.log('تم حذف الجدول بنجاح');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
      toast({ title: "تم الحذف", description: "تم حذف الجدول بنجاح" });
    },
    onError: (error: any) => {
      console.error('خطأ في حذف الجدول:', error);
      toast({ title: "خطأ", description: "فشل في حذف الجدول", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('تم إرسال النموذج');
    
    const formData = new FormData(e.currentTarget);
    
    const scheduleData = {
      course_id: formData.get("course_id") as string,
      day_of_week: formData.get("day_of_week") as string,
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      classroom: formData.get("classroom") as string,
      instructor_name: formData.get("instructor_name") as string,
      academic_year: formData.get("academic_year") as string,
      semester: formData.get("semester") as string,
      specialization: formData.get("specialization") as string,
    };

    console.log('بيانات النموذج:', scheduleData);
    saveSchedule.mutate(scheduleData);
  };

  const handleEdit = (schedule: ClassSchedule) => {
    console.log('تعديل الجدول:', schedule.id);
    setEditingSchedule(schedule);
    setIsDialogOpen(true);
  };

  const handleDelete = (schedule: ClassSchedule) => {
    if (confirm(`هل أنت متأكد من حذف محاضرة ${schedule.courses?.course_name_ar}؟`)) {
      deleteSchedule.mutate(schedule.id);
    }
  };

  // فلترة الجداول حسب البحث
  const filteredSchedules = schedules?.filter(schedule => {
    if (!searchTerm) return true;
    
    const courseName = schedule.courses?.course_name_ar?.toLowerCase() || '';
    const courseCode = schedule.courses?.course_code?.toLowerCase() || '';
    const instructor = schedule.instructor_name?.toLowerCase() || '';
    const classroom = schedule.classroom?.toLowerCase() || '';
    
    return courseName.includes(searchTerm.toLowerCase()) ||
           courseCode.includes(searchTerm.toLowerCase()) ||
           instructor.includes(searchTerm.toLowerCase()) ||
           classroom.includes(searchTerm.toLowerCase());
  }) || [];

  const getDayName = (dayNumber: number) => {
    return daysOfWeek.find(day => day.value === dayNumber)?.name || 'غير محدد';
  };

  const formatTime = (time: string) => {
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return time;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الجداول الدراسية</h1>
          <p className="text-muted-foreground">إدارة جداول المحاضرات والمواعيد الدراسية</p>
        </div>
        <Button 
          onClick={() => {
            console.log('فتح نافذة إضافة جدول');
            setEditingSchedule(null);
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة محاضرة
        </Button>
      </div>

      {/* البحث والفلترة */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث بالمقرر أو المحاضر أو القاعة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterSemester} onValueChange={setFilterSemester}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الفصل الأول">الفصل الأول</SelectItem>
                <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                <SelectItem value="الفصل الصيفي">الفصل الصيفي</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterDay} onValueChange={setFilterDay}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأيام</SelectItem>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            الجدول الدراسي ({filteredSchedules.length} محاضرة)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المقرر</TableHead>
                    <TableHead>اليوم</TableHead>
                    <TableHead>الوقت</TableHead>
                    <TableHead>القاعة</TableHead>
                    <TableHead>المحاضر</TableHead>
                    <TableHead>الساعات المعتمدة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{schedule.courses?.course_code}</div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.courses?.course_name_ar}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getDayName(schedule.day_of_week)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {schedule.classroom}
                        </span>
                      </TableCell>
                      <TableCell>{schedule.instructor_name}</TableCell>
                      <TableCell className="text-center">
                        {schedule.courses?.credit_hours} ساعة
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(schedule)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(schedule)}
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

      {/* نافذة إضافة/تعديل الجدول */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "تعديل المحاضرة" : "إضافة محاضرة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="course_id">المقرر *</Label>
              <Select name="course_id" defaultValue={editingSchedule?.course_id} required>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="day_of_week">يوم الأسبوع *</Label>
                <Select name="day_of_week" defaultValue={editingSchedule?.day_of_week?.toString()} required>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اليوم" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="classroom">القاعة *</Label>
                <Input
                  name="classroom"
                  defaultValue={editingSchedule?.classroom}
                  placeholder="مثال: A101"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">وقت البداية *</Label>
                <Input
                  type="time"
                  name="start_time"
                  defaultValue={editingSchedule?.start_time}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="end_time">وقت النهاية *</Label>
                <Input
                  type="time"
                  name="end_time"
                  defaultValue={editingSchedule?.end_time}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="instructor_name">اسم المحاضر *</Label>
              <Input
                name="instructor_name"
                defaultValue={editingSchedule?.instructor_name}
                placeholder="د. أحمد محمد علي"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="specialization">التخصص</Label>
                <Input
                  name="specialization"
                  defaultValue={(editingSchedule as any)?.specialization || ""}
                  placeholder="مثال: نظم معلومات"
                />
              </div>
              <div>
                <Label htmlFor="academic_year">السنة الأكاديمية</Label>
                <Select name="academic_year" defaultValue={editingSchedule?.academic_year || "2024-2025"}>
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
                <Select name="semester" defaultValue={editingSchedule?.semester || "الفصل الأول"}>
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
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setEditingSchedule(null);
              }}>
                إلغاء
              </Button>
              <Button type="submit" disabled={saveSchedule.isPending}>
                {saveSchedule.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  editingSchedule ? "تحديث" : "إضافة"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulesManagement;
