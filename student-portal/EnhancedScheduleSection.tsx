
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  Plus,
  Download,
  Filter
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  credit_hours: number;
  department: string;
};

type ScheduleItem = {
  id: string;
  course_id?: string;
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

const EnhancedScheduleSection: React.FC = () => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState('current');

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['student-schedule', user?.id],
    queryFn: async () => {
      if (!user?.id) return { schedule: [], courses: [] };
      
      try {
        // Get schedule data
        const { data: schedule, error: scheduleError } = await supabase
          .from('class_schedule')
          .select('*')
          .order('day_of_week')
          .order('start_time');

        if (scheduleError) {
          console.error('Schedule error:', scheduleError);
          throw scheduleError;
        }

        // Get all courses
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('course_name_ar');

        if (coursesError) {
          console.error('Courses error:', coursesError);
          throw coursesError;
        }

        // Manually join the data
        const scheduleWithCourses = (schedule || []).map(scheduleItem => ({
          ...scheduleItem,
          courses: (courses || []).find(course => course.id === scheduleItem.course_id)
        }));

        return {
          schedule: scheduleWithCourses as ScheduleItem[],
          courses: courses as Course[] || []
        };
      } catch (error) {
        console.error('Query error:', error);
        return { schedule: [], courses: [] };
      }
    },
    enabled: !!user?.id,
  });

  const daysOfWeek = [
    { id: 1, name: 'الاثنين', nameEn: 'Monday' },
    { id: 2, name: 'الثلاثاء', nameEn: 'Tuesday' },
    { id: 3, name: 'الأربعاء', nameEn: 'Wednesday' },
    { id: 4, name: 'الخميس', nameEn: 'Thursday' },
    { id: 5, name: 'الجمعة', nameEn: 'Friday' },
    { id: 6, name: 'السبت', nameEn: 'Saturday' },
    { id: 0, name: 'الأحد', nameEn: 'Sunday' },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getScheduleForDay = (dayId: number) => {
    return scheduleData?.schedule?.filter(item => item.day_of_week === dayId) || [];
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getColorForCourse = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-red-100 text-red-800 border-red-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">الجدول الدراسي</h1>
            <p className="text-muted-foreground">تصفح جدولك الدراسي والمواد المسجلة</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              فلترة
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              تحميل PDF
            </Button>
          </div>
        </div>

        <Tabs value={selectedWeek} onValueChange={setSelectedWeek} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">الأسبوع الحالي</TabsTrigger>
            <TabsTrigger value="grid">عرض الجدول</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  جاري تحميل الجدول...
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {daysOfWeek.map((day) => {
                  const daySchedule = getScheduleForDay(day.id);
                  return (
                    <Card key={day.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                          {day.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {daySchedule.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            لا توجد محاضرات في هذا اليوم
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {daySchedule.map((item, index) => (
                              <div
                                key={item.id}
                                className={`p-4 rounded-lg border-2 ${getColorForCourse(index)}`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">
                                      {item.courses?.course_name_ar || 'مادة غير محددة'}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm mb-2">
                                      <BookOpen className="h-4 w-4" />
                                      <span>{item.courses?.course_code || 'غير محدد'}</span>
                                      <Badge variant="secondary" className="mr-2">
                                        {item.courses?.credit_hours || 0} ساعة معتمدة
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="space-y-2 sm:text-left">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <MapPin className="h-4 w-4" />
                                      <span>{item.classroom}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <User className="h-4 w-4" />
                                      <span>{item.instructor_name}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="grid">
            <Card>
              <CardHeader>
                <CardTitle>جدول الحصص الأسبوعي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      <div className="font-semibold text-center p-2">الوقت</div>
                      {daysOfWeek.map((day) => (
                        <div key={day.id} className="font-semibold text-center p-2 bg-gray-100 rounded">
                          {day.name}
                        </div>
                      ))}
                    </div>
                    {timeSlots.map((timeSlot) => (
                      <div key={timeSlot} className="grid grid-cols-8 gap-2 mb-2">
                        <div className="text-center p-2 bg-gray-50 rounded font-medium">
                          {timeSlot}
                        </div>
                        {daysOfWeek.map((day) => {
                          const daySchedule = getScheduleForDay(day.id);
                          const classAtTime = daySchedule.find(item => 
                            item.start_time <= `${timeSlot}:00` && 
                            item.end_time > `${timeSlot}:00`
                          );
                          
                          return (
                            <div key={`${day.id}-${timeSlot}`} className="p-1">
                              {classAtTime ? (
                                <div className="bg-primary/10 border border-primary/20 p-2 rounded text-xs">
                                  <div className="font-semibold truncate">
                                    {classAtTime.courses?.course_name_ar || 'مادة'}
                                  </div>
                                  <div className="text-muted-foreground truncate">
                                    {classAtTime.classroom}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-12 border border-gray-200 rounded bg-gray-50/30"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{scheduleData?.courses?.length || 0}</div>
              <div className="text-sm text-muted-foreground">إجمالي المواد</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{scheduleData?.schedule?.length || 0}</div>
              <div className="text-sm text-muted-foreground">الحصص الأسبوعية</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">
                {scheduleData?.courses?.reduce((sum, course) => sum + (course.credit_hours || 0), 0) || 0}
              </div>
              <div className="text-sm text-muted-foreground">الساعات المعتمدة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">
                {new Set(scheduleData?.schedule?.map(s => s.instructor_name)).size || 0}
              </div>
              <div className="text-sm text-muted-foreground">أعضاء هيئة التدريس</div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة المواد المسجلة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              المواد المسجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduleData?.courses?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد مواد مسجلة حالياً
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scheduleData?.courses?.map((course, index) => (
                  <Card key={course.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{course.course_code}</Badge>
                          <Badge className={getColorForCourse(index)}>
                            {course.credit_hours} ساعة
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900">{course.course_name_ar}</h3>
                        <p className="text-sm text-muted-foreground">{course.department}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedScheduleSection;
