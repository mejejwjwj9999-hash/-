
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

type Course = {
  course_code: string;
  course_name_ar: string;
  course_name_en: string;
  credit_hours: number;
};

type ClassScheduleItem = {
  id: string;
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classroom: string;
  instructor_name: string;
  academic_year: string;
  semester: string;
  courses: Course;
};

const ClassSchedule = () => {
  const { profile } = useAuth();

  const { data: schedule, isLoading } = useQuery({
    queryKey: ['class-schedule', profile?.academic_year, profile?.semester],
    queryFn: async () => {
      if (!profile?.academic_year || !profile?.semester) return [];
      
      const { data, error } = await supabase
        .from('class_schedule')
        .select(`
          *,
          courses!class_schedule_course_id_fkey (
            course_code,
            course_name_ar,
            course_name_en,
            credit_hours
          )
        `)
        .eq('academic_year', profile.academic_year.toString())
        .eq('semester', profile.semester.toString())
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      return data as ClassScheduleItem[] || [];
    },
    enabled: !!profile?.academic_year && !!profile?.semester,
  });

  const getDayName = (dayNumber: number): string => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[dayNumber] || 'غير محدد';
  };

  const formatTime = (time: string): string => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupedSchedule = schedule?.reduce((acc, item) => {
    const day = item.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {} as Record<number, ClassScheduleItem[]>) || {};

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الجدول الدراسي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          الجدول الدراسي
        </h1>
        <div className="text-sm text-gray-600">
          السنة الدراسية {profile?.academic_year} - الفصل {profile?.semester}
        </div>
      </div>

      {Object.keys(groupedSchedule).length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا يوجد جدول دراسي</h3>
            <p className="text-gray-500">لم يتم تحديد جدول دراسي لهذا الفصل بعد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedSchedule)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([dayNumber, classes]) => (
              <Card key={dayNumber}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {getDayName(parseInt(dayNumber))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {classItem.courses?.course_name_ar}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Badge variant="outline">
                                  {classItem.courses?.course_code}
                                </Badge>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {classItem.courses?.credit_hours} ساعة
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>القاعة: {classItem.classroom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>المدرس: {classItem.instructor_name}</span>
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
    </div>
  );
};

export default ClassSchedule;
