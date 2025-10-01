
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
  Filter
} from 'lucide-react';

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
  courses?: {
    course_code: string;
    course_name_ar: string;
    credit_hours: number;
  };
};

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  credit_hours: number;
};

const SchedulesManagementFixed: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);

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

  const days = [
    { id: 0, name: 'الأحد' },
    { id: 1, name: 'الإثنين' },
    { id: 2, name: 'الثلاثاء' },
    { id: 3, name: 'الأربعاء' },
    { id: 4, name: 'الخميس' },
    { id: 5, name: 'الجمعة' },
    { id: 6, name: 'السبت' }
  ];

  const { data: schedules, isLoading: schedulesLoading, refetch } = useQuery({
    queryKey: ['admin-schedules'],
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

  const { data: courses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, course_code, course_name_ar, credit_hours')
        .order('course_code');
      
      if (error) throw error;
      return data as Course[] || [];
    },
  });

  const addScheduleMutation = useMutation({
    mutationFn: async (newSchedule: typeof formData) => {
      console.log('Adding schedule with data:', newSchedule);
      
      // التأكد من أن day_of_week بين 0 و 6
      if (newSchedule.day_of_week < 0 || newSchedule.day_of_week > 6) {
        throw new Error('يجب أن يكون يوم الأسبوع بين 0 و 6');
      }
      
      const { error } = await supabase
        .from('class_schedule')
        .insert([{
          course_id: newSchedule.course_id,
          day_of_week: Number(newSchedule.day_of_week),
          start_time: newSchedule.start_time,
          end_time: newSchedule.end_time,
          classroom: newSchedule.classroom.trim(),
          instructor_name: newSchedule.instructor_name.trim(),
          academic_year: newSchedule.academic_year,
          semester: newSchedule.semester
        }]);
      
      if (error) {
        console.error('Error adding schedule:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] });
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الجدول الدراسي بنجاح.',
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: error.message || 'فشل في إضافة الجدول الدراسي.',
        variant: 'destructive',
      });
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async (updatedSchedule: typeof formData & { id: string }) => {
      console.log('Updating schedule with data:', updatedSchedule);
      
      // التأكد من أن day_of_week بين 0 و 6
      if (updatedSchedule.day_of_week < 0 || updatedSchedule.day_of_week > 6) {
        throw new Error('يجب أن يكون يوم الأسبوع بين 0 و 6');
      }
      
      const { error } = await supabase
        .from('class_schedule')
        .update({
          course_id: updatedSchedule.course_id,
          day_of_week: Number(updatedSchedule.day_of_week),
          start_time: updatedSchedule.start_time,
          end_time: updatedSchedule.end_time,
          classroom: updatedSchedule.classroom.trim(),
          instructor_name: updatedSchedule.instructor_name.trim(),
          academic_year: updatedSchedule.academic_year,
          semester: updatedSchedule.semester
        })
        .eq('id', updatedSchedule.id);
      
      if (error) {
        console.error('Error updating schedule:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الجدول الدراسي بنجاح.',
      });
      setEditingSchedule(null);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'خطأ في التحديث',
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
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الجدول الدراسي بنجاح.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في الحذف',
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من البيانات المطلوبة
    if (!formData.course_id || !formData.classroom.trim() || !formData.instructor_name.trim() || 
        !formData.start_time || !formData.end_time) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }

    // التحقق من أن وقت البداية أقل من وقت النهاية
    if (formData.start_time >= formData.end_time) {
      toast({
        title: 'خطأ في الأوقات',
        description: 'وقت البداية يجب أن يكون أقل من وقت النهاية.',
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
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      classroom: schedule.classroom,
      instructor_name: schedule.instructor_name,
      academic_year: schedule.academic_year,
      semester: schedule.semester
    });
    setEditingSchedule(schedule);
  };

  const handleDelete = (id: string, courseName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف جدول ${courseName}؟`)) {
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
    
    return matchesSearch && matchesDay;
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
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة الجداول الدراسية</h1>
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة جدول دراسي جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">المقرر *</label>
                  <Select 
                    value={formData.course_id} 
                    onValueChange={(value) => setFormData({...formData, course_id: value})}
                    required
                  >
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
                
                <div>
                  <label className="block text-sm font-medium mb-1">اليوم *</label>
                  <Select 
                    value={formData.day_of_week.toString()} 
                    onValueChange={(value) => setFormData({...formData, day_of_week: parseInt(value)})}
                    required
                  >
                    <SelectTrigger>
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
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">وقت النهاية *</label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">القاعة *</label>
                  <Input
                    value={formData.classroom}
                    onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                    placeholder="مثال: قاعة 101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">اسم المدرس *</label>
                  <Input
                    value={formData.instructor_name}
                    onChange={(e) => setFormData({...formData, instructor_name: e.target.value})}
                    placeholder="اسم المدرس"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">السنة الدراسية *</label>
                    <Input
                      value={formData.academic_year}
                      onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الفصل الدراسي *</label>
                    <Select 
                      value={formData.semester} 
                      onValueChange={(value) => setFormData({...formData, semester: value})}
                      required
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
          <CardTitle>الجداول الدراسية ({filteredSchedules.length})</CardTitle>
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
                              schedule.courses?.course_code || 'المقرر'
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

export default SchedulesManagementFixed;
