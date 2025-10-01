
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatTimeForInput, sanitizeTimeForDatabase, validateTimeRange } from '@/utils/dateUtils';
import { useDepartments } from '@/hooks/useDepartments';
import { useProgramsByDepartment } from '@/hooks/usePrograms';
import { DepartmentId, ProgramId, getDepartmentName, getProgramName } from '@/domain/academics';

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
  department_id?: DepartmentId;
  program_id?: ProgramId;
  courses?: {
    course_code: string;
    course_name_ar: string;
    credit_hours: number;
    department_id?: DepartmentId;
    program_id?: ProgramId;
  };
};

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  credit_hours: number;
};

const SchedulesManagementRadical: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);

  const { data: departments } = useDepartments();

  const [formData, setFormData] = useState({
    course_id: '',
    day_of_week: 0,
    start_time: '',
    end_time: '',
    classroom: '',
    instructor_name: '',
    academic_year: '2024',
    semester: '1'
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const days = [
    { id: 0, name: 'الأحد' },
    { id: 1, name: 'الإثنين' },
    { id: 2, name: 'الثلاثاء' },
    { id: 3, name: 'الأربعاء' },
    { id: 4, name: 'الخميس' },
    { id: 5, name: 'الجمعة' },
    { id: 6, name: 'السبت' }
  ];

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.course_id.trim()) {
      errors.course_id = 'يرجى اختيار المقرر';
    }

    if (!formData.classroom.trim()) {
      errors.classroom = 'يرجى إدخال اسم القاعة';
    }

    if (!formData.instructor_name.trim()) {
      errors.instructor_name = 'يرجى إدخال اسم المدرس';
    }

    if (!formData.start_time.trim()) {
      errors.start_time = 'يرجى تحديد وقت البداية';
    }

    if (!formData.end_time.trim()) {
      errors.end_time = 'يرجى تحديد وقت النهاية';
    }

    if (formData.start_time && formData.end_time && !validateTimeRange(formData.start_time, formData.end_time)) {
      errors.time_range = 'وقت البداية يجب أن يكون أقل من وقت النهاية';
    }

    if (formData.day_of_week < 0 || formData.day_of_week > 6) {
      errors.day_of_week = 'يوم الأسبوع غير صحيح';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { data: schedules, isLoading: schedulesLoading, refetch } = useQuery({
    queryKey: ['admin-schedules-radical'],
    queryFn: async () => {
      console.log('Fetching schedules data...');
      const { data, error } = await supabase
        .from('class_schedule')
        .select(`
          *,
          courses!class_schedule_course_id_fkey (
            course_code,
            course_name_ar,
            credit_hours
          )
        `)
        .order('day_of_week')
        .order('start_time');
      
      if (error) {
        console.error('Error fetching schedules:', error);
        throw error;
      }
      
      console.log('Schedules data fetched successfully:', data?.length || 0, 'schedules');
      return data as ClassSchedule[] || [];
    },
  });

  // Get enrollment counts for courses in schedules
  const { data: scheduleEnrollments } = useQuery({
    queryKey: ['schedule-enrollments'],
    queryFn: async () => {
      if (!schedules?.length) return {};
      
      const courseIds = schedules.map(s => s.course_id).filter(Boolean);
      const { data, error } = await supabase
        .from('student_enrollments')
        .select('course_id')
        .eq('status', 'enrolled')
        .in('course_id', courseIds);
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(enrollment => {
        counts[enrollment.course_id] = (counts[enrollment.course_id] || 0) + 1;
      });
      
      return counts;
    },
    enabled: !!schedules?.length,
    staleTime: 1000 * 30,
  });

  const { data: courses } = useQuery({
    queryKey: ['admin-courses-for-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, course_code, course_name_ar, credit_hours')
        .order('course_code');
      
      if (error) throw error;
      return data as Course[] || [];
    },
  });

  // Conflict detection function
  const checkScheduleConflicts = (newSchedule: typeof formData, excludeId?: string): string[] => {
    const conflicts: string[] = [];
    
    if (!schedules) return conflicts;
    
    const sameTimeSlot = schedules.filter(schedule => 
      schedule.id !== excludeId &&
      schedule.day_of_week === newSchedule.day_of_week &&
      schedule.start_time === newSchedule.start_time &&
      schedule.end_time === newSchedule.end_time
    );

    // Check instructor conflicts
    const instructorConflicts = sameTimeSlot.filter(schedule => 
      schedule.instructor_name.toLowerCase() === newSchedule.instructor_name.toLowerCase()
    );
    
    if (instructorConflicts.length > 0) {
      conflicts.push(`المدرس ${newSchedule.instructor_name} لديه محاضرة أخرى في نفس الوقت`);
    }

    // Check classroom conflicts
    const classroomConflicts = sameTimeSlot.filter(schedule => 
      schedule.classroom.toLowerCase() === newSchedule.classroom.toLowerCase()
    );
    
    if (classroomConflicts.length > 0) {
      conflicts.push(`القاعة ${newSchedule.classroom} محجوزة في نفس الوقت`);
    }

    return conflicts;
  };

  const addScheduleMutation = useMutation({
    mutationFn: async (newSchedule: typeof formData) => {
      console.log('Adding schedule with data:', newSchedule);
      
      // Check for conflicts
      const conflicts = checkScheduleConflicts(newSchedule);
      if (conflicts.length > 0) {
        throw new Error(`تضارب في الجدول: ${conflicts.join(', ')}`);
      }
      
      const sanitizedData = {
        course_id: newSchedule.course_id,
        day_of_week: Number(newSchedule.day_of_week),
        start_time: sanitizeTimeForDatabase(newSchedule.start_time),
        end_time: sanitizeTimeForDatabase(newSchedule.end_time),
        classroom: newSchedule.classroom.trim(),
        instructor_name: newSchedule.instructor_name.trim(),
        academic_year: newSchedule.academic_year,
        semester: newSchedule.semester
      };

      const { error } = await supabase
        .from('class_schedule')
        .insert([sanitizedData]);
      
      if (error) {
        console.error('Error adding schedule:', error);
        throw new Error(error.message || 'فشل في إضافة الجدول الدراسي');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules-radical'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] }); // Invalidate student schedules
      toast({
        title: 'تمت الإضافة بنجاح ✅',
        description: 'تم إضافة الجدول الدراسي بنجاح وإشعار الطلاب.',
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'خطأ في الإضافة ❌',
        description: error.message || 'فشل في إضافة الجدول الدراسي.',
        variant: 'destructive',
      });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async (updatedSchedule: typeof formData & { id: string }) => {
      console.log('Updating schedule with data:', updatedSchedule);
      
      // Check for conflicts, excluding current schedule
      const conflicts = checkScheduleConflicts(updatedSchedule, updatedSchedule.id);
      if (conflicts.length > 0) {
        throw new Error(`تضارب في الجدول: ${conflicts.join(', ')}`);
      }
      
      const sanitizedData = {
        course_id: updatedSchedule.course_id,
        day_of_week: Number(updatedSchedule.day_of_week),
        start_time: sanitizeTimeForDatabase(updatedSchedule.start_time),
        end_time: sanitizeTimeForDatabase(updatedSchedule.end_time),
        classroom: updatedSchedule.classroom.trim(),
        instructor_name: updatedSchedule.instructor_name.trim(),
        academic_year: updatedSchedule.academic_year,
        semester: updatedSchedule.semester
      };

      const { error } = await supabase
        .from('class_schedule')
        .update(sanitizedData)
        .eq('id', updatedSchedule.id);
      
      if (error) {
        console.error('Error updating schedule:', error);
        throw new Error(error.message || 'فشل في تحديث الجدول الدراسي');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules-radical'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] }); // Invalidate student schedules
      toast({
        title: 'تم التحديث بنجاح ✅',
        description: 'تم تحديث الجدول الدراسي بنجاح وإشعار الطلاب.',
      });
      setEditingSchedule(null);
      resetForm();
    },
    onError: (error: Error) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'خطأ في التحديث ❌',
        description: error.message || 'فشل في تحديث الجدول الدراسي.',
        variant: 'destructive',
      });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('class_schedule')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message || 'فشل في حذف الجدول الدراسي');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules-radical'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] }); // Invalidate student schedules
      toast({
        title: 'تم الحذف بنجاح ✅',
        description: 'تم حذف الجدول الدراسي بنجاح وإشعار الطلاب.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ في الحذف ❌',
        description: error.message || 'فشل في حذف الجدول الدراسي.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      course_id: '',
      day_of_week: 0,
      start_time: '',
      end_time: '',
      classroom: '',
      instructor_name: '',
      academic_year: '2024',
      semester: '1'
    });
    setValidationErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'خطأ في البيانات ❌',
        description: 'يرجى تصحيح الأخطاء المحددة في النموذج.',
        variant: 'destructive',
      });
      return;
    }

    if (editingSchedule) {
      updateScheduleMutation.mutate({ ...formData, id: editingSchedule.id });
    } else {
      addScheduleMutation.mutate(formData);
    }
  };

  const handleEdit = (schedule: ClassSchedule) => {
    setFormData({
      course_id: schedule.course_id,
      day_of_week: schedule.day_of_week,
      start_time: formatTimeForInput(schedule.start_time),
      end_time: formatTimeForInput(schedule.end_time),
      classroom: schedule.classroom,
      instructor_name: schedule.instructor_name,
      academic_year: schedule.academic_year,
      semester: schedule.semester
    });
    setEditingSchedule(schedule);
    setValidationErrors({});
  };

  const handleDelete = (id: string, courseName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف جدول ${courseName}؟\nلا يمكن التراجع عن هذا الإجراء.`)) {
      deleteScheduleMutation.mutate(id);
    }
  };

  const filteredSchedules = schedules?.filter(schedule => {
    const matchesSearch = !searchTerm || 
      schedule.courses?.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.courses?.course_name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.classroom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDay = selectedDay === 'all' || schedule.day_of_week === parseInt(selectedDay);
    
    const matchesDepartment = selectedDepartment === 'all' || 
      schedule.courses?.department_id === selectedDepartment;
    
    return matchesSearch && matchesDay && matchesDepartment;
  }) || [];

  if (schedulesLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">جاري تحميل الجداول الدراسية...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والأزرار */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة الجداول الدراسية</h1>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            محسنة
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            disabled={schedulesLoading}
          >
            <RefreshCw className={`h-4 w-4 ${schedulesLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة جدول
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'تعديل جدول دراسي' : 'إضافة جدول دراسي جديد'}
                </DialogTitle>
              </DialogHeader>
              
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">يرجى تصحيح الأخطاء التالية:</span>
                  </div>
                  <ul className="text-red-700 text-sm space-y-1">
                    {Object.values(validationErrors).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">المقرر *</label>
                  <Select 
                    value={formData.course_id} 
                    onValueChange={(value) => setFormData({...formData, course_id: value})}
                  >
                    <SelectTrigger className={validationErrors.course_id ? 'border-red-500' : ''}>
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
                
                <div>
                  <label className="block text-sm font-medium mb-1">اليوم *</label>
                  <Select 
                    value={formData.day_of_week.toString()} 
                    onValueChange={(value) => setFormData({...formData, day_of_week: parseInt(value)})}
                  >
                    <SelectTrigger className={validationErrors.day_of_week ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر اليوم" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.id} value={day.id.toString()}>
                          {day.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">وقت البداية *</label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                      className={validationErrors.start_time || validationErrors.time_range ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">وقت النهاية *</label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                      className={validationErrors.end_time || validationErrors.time_range ? 'border-red-500' : ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">القاعة *</label>
                  <Input
                    value={formData.classroom}
                    onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                    placeholder="مثال: قاعة 101"
                    className={validationErrors.classroom ? 'border-red-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">اسم المدرس *</label>
                  <Input
                    value={formData.instructor_name}
                    onChange={(e) => setFormData({...formData, instructor_name: e.target.value})}
                    placeholder="اسم المدرس"
                    className={validationErrors.instructor_name ? 'border-red-500' : ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">السنة الدراسية *</label>
                    <Input
                      value={formData.academic_year}
                      onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الفصل الدراسي *</label>
                    <Select 
                      value={formData.semester} 
                      onValueChange={(value) => setFormData({...formData, semester: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">الفصل الأول</SelectItem>
                        <SelectItem value="2">الفصل الثاني</SelectItem>
                        <SelectItem value="3">الفصل الصيفي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={addScheduleMutation.isPending || updateScheduleMutation.isPending}
                    className="flex-1"
                  >
                    {editingSchedule ? 'تحديث الجدول' : 'إضافة الجدول'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingSchedule(null);
                      resetForm();
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بكود المقرر، اسم المقرر، القاعة، أو المدرس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="فلترة باليوم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأيام</SelectItem>
                {days.map((day) => (
                  <SelectItem key={day.id} value={day.id.toString()}>
                    {day.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول الجداول الدراسية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>الجداول الدراسية ({filteredSchedules.length})</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {schedules?.length === 0 ? 'لا يوجد جداول دراسية' : 'لا توجد نتائج'}
              </h3>
              <p className="text-gray-600">
                {schedules?.length === 0 
                  ? 'لم يتم إنشاء أي جدول دراسي في النظام بعد.' 
                  : 'لا توجد نتائج تطابق معايير البحث المحددة.'
                }
              </p>
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
                     <TableHead>المدرس</TableHead>
                     <TableHead>الطلاب المسجلون</TableHead>
                     <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {schedule.courses?.course_code}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.courses?.course_name_ar}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {days.find(d => d.id === schedule.day_of_week)?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{schedule.start_time} - {schedule.end_time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{schedule.classroom}</span>
                        </div>
                      </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-1">
                           <User className="h-4 w-4" />
                           <span>{schedule.instructor_name}</span>
                         </div>
                         <div className="mt-1">
                           <Badge variant="secondary" className="text-xs">
                             {scheduleEnrollments?.[schedule.course_id] || 0} طالب مسجل
                           </Badge>
                         </div>
                       </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              handleEdit(schedule);
                              setIsAddModalOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(
                              schedule.id, 
                              schedule.courses?.course_code || 'المقرr'
                            )}
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

export default SchedulesManagementRadical;
