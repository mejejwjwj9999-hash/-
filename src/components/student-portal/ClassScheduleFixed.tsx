
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  RefreshCw, 
  Download,
  AlertCircle 
} from 'lucide-react';

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  credit_hours: number;
};

type ClassSchedule = {
  id: string;
  course_id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  instructor_name: string;
  classroom: string;
  academic_year: string;
  semester: string;
  created_at: string;
};

type ClassScheduleItem = ClassSchedule & {
  courses?: Course;
};

const ClassScheduleFixed = () => {
  const { data: scheduleItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['class-schedule'],
    queryFn: async (): Promise<ClassScheduleItem[]> => {
      console.log('جاري تحميل الجداول الدراسية...');
      
      try {
        // جلب بيانات الجداول
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('class_schedule')
          .select('*')
          .order('day_of_week')
          .order('start_time');

        if (scheduleError) {
          console.error('خطأ في جلب الجداول:', scheduleError);
          throw new Error(`فشل في جلب الجداول: ${scheduleError.message}`);
        }

        // جلب بيانات المقررات
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*');

        if (coursesError) {
          console.error('خطأ في جلب المقررات:', coursesError);
          throw new Error(`فشل في جلب المقررات: ${coursesError.message}`);
        }

        // دمج البيانات يدوياً
        const combinedData = (scheduleData as ClassSchedule[]).map(schedule => ({
          ...schedule,
          courses: (coursesData as Course[]).find(course => course.id === schedule.course_id)
        }));

        console.log('تم تحميل الجداول بنجاح:', combinedData.length);
        return combinedData;
      } catch (err) {
        console.error('خطأ غير متوقع في تحميل الجداول:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const getDayName = (dayNumber: number): string => {
    const days = [
      'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 
      'الخميس', 'الجمعة', 'السبت'
    ];
    return days[dayNumber] || `يوم ${dayNumber}`;
  };

  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'م' : 'ص';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const groupedSchedule = scheduleItems.reduce((acc, item) => {
    const day = getDayName(item.day_of_week);
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {} as Record<string, ClassScheduleItem[]>);

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">الجدول الدراسي</h2>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-red-800">خطأ في تحميل الجدول</h3>
              <p className="text-red-600 max-w-md">
                {error instanceof Error ? error.message : 'حدث خطأ غير متوقع في تحميل الجدول الدراسي'}
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">الجدول الدراسي</h2>
          <p className="text-gray-600 mt-1">جدولك الأسبوعي للمحاضرات والمختبرات</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">جاري تحميل الجدول الدراسي...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Content */}
      {!isLoading && (
        <>
          {scheduleItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">لا يوجد جدول دراسي</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  لم يتم إنشاء جدول دراسي لك بعد. سيتم إضافة الجدول قريباً من قبل الإدارة.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {Object.entries(groupedSchedule).map(([day, classes]) => (
                <Card key={day} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Calendar className="w-5 h-5" />
                      {day}
                      <Badge variant="secondary" className="mr-auto">
                        {classes.length} محاضرة
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {classes.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Course Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {item.courses?.course_name_ar || 'مقرر غير محدد'}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {item.courses?.course_code || 'غير محدد'} - {item.courses?.credit_hours || 0} ساعة معتمدة
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTime(item.start_time)} - {formatTime(item.end_time)}
                              </span>
                            </div>

                            {/* Instructor */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{item.instructor_name}</span>
                            </div>

                            {/* Classroom */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{item.classroom}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      {scheduleItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {scheduleItems.length}
                </div>
                <div className="text-sm text-blue-800">إجمالي المحاضرات</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(groupedSchedule).length}
                </div>
                <div className="text-sm text-green-800">أيام الدراسة</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(scheduleItems.map(item => item.courses?.id)).size}
                </div>
                <div className="text-sm text-purple-800">المقررات</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(scheduleItems.map(item => item.instructor_name)).size}
                </div>
                <div className="text-sm text-orange-800">الأساتذة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassScheduleFixed;
