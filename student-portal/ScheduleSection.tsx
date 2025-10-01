import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  Filter
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const ScheduleSection = () => {
  const { profile } = useAuth();

  // Fetch schedule data
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['schedule', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      // Get current student's courses through grades table
      const { data: studentGrades } = await supabase
        .from('grades')
        .select('course_id')
        .eq('student_id', profile.id);

      const courseIds = studentGrades?.map(grade => grade.course_id) || [];

      if (courseIds.length === 0) return [];

      const { data, error } = await supabase
        .from('class_schedule')
        .select(`
          *,
          courses:course_id (
            course_name_ar,
            course_code,
            credit_hours
          )
        `)
        .in('course_id', courseIds)
        .eq('academic_year', '2024-2025')
        .eq('semester', 'الفصل الأول')
        .order('day_of_week')
        .order('start_time');

      if (error) {
        console.error('Error fetching schedule:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!profile?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-academic-gray-light rounded w-48"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-academic-gray-light rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Group schedule by day
  const scheduleByDay = scheduleData?.reduce((acc: any, item: any) => {
    const day = daysOfWeek[item.day_of_week - 1];
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-section-title">الجدول الدراسي</h2>
        <Badge variant="outline" className="text-sm">
          الفصل الأول 2024-2025
        </Badge>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-university-blue" />
            الجدول الأسبوعي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(scheduleByDay).map((day) => (
            <div key={day} className="border-r-4 border-r-university-blue bg-academic-gray-light p-4 rounded-lg">
              <h3 className="text-lg font-bold text-university-blue mb-3">{day}</h3>
              <div className="space-y-3">
                {scheduleByDay[day].map((item: any) => (
                  <Card key={item.id} className="bg-white shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-university-blue mb-1">
                            {item.courses?.course_name_ar}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-academic-gray">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{item.courses?.course_code}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{item.instructor_name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {item.courses?.credit_hours} ساعة معتمدة
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2 text-university-blue font-medium">
                            <Clock className="h-4 w-4" />
                            <span>{item.start_time} - {item.end_time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-academic-gray text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{item.classroom}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(scheduleByDay).length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-academic-gray mx-auto mb-4" />
              <p className="text-lg text-academic-gray">لا توجد محاضرات مجدولة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      {scheduleData && scheduleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-university-blue" />
              ملخص الجدول
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-academic-gray-light rounded-lg">
                <div className="text-2xl font-bold text-university-blue">
                  {scheduleData.length}
                </div>
                <div className="text-sm text-academic-gray">إجمالي المواد</div>
              </div>
              <div className="text-center p-3 bg-academic-gray-light rounded-lg">
                <div className="text-2xl font-bold text-university-blue">
                  {scheduleData.reduce((total: number, item: any) => 
                    total + (item.courses?.credit_hours || 0), 0
                  )}
                </div>
                <div className="text-sm text-academic-gray">الساعات المعتمدة</div>
              </div>
              <div className="text-center p-3 bg-academic-gray-light rounded-lg">
                <div className="text-2xl font-bold text-university-blue">
                  {new Set(scheduleData.map((item: any) => item.day_of_week)).size}
                </div>
                <div className="text-sm text-academic-gray">أيام الحضور</div>
              </div>
              <div className="text-center p-3 bg-academic-gray-light rounded-lg">
                <div className="text-2xl font-bold text-university-blue">
                  {new Set(scheduleData.map((item: any) => item.instructor_name)).size}
                </div>
                <div className="text-sm text-academic-gray">أعضاء التدريس</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScheduleSection;