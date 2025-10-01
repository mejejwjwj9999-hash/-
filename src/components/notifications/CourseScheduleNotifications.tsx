import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Bell, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const useCourseScheduleNotifications = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['course-schedule-notifications', profile?.id],
    queryFn: async (): Promise<{ newCourses: any[]; newSchedules: any[] }> => {
      if (!profile?.id) return { newCourses: [], newSchedules: [] };

      // Get recent courses added for student's department/program with better filtering
      const { data: recentCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('department_id', profile.department_id)
        .eq('program_id', profile.program_id)
        .eq('academic_year', profile.academic_year)
        .eq('semester', profile.semester)
        .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()) // Last 3 days for better relevance
        .order('created_at', { ascending: false })
        .limit(5); // Limit for performance

      if (coursesError) throw coursesError;

      // Get recent schedules for enrolled courses with improved logic
      const { data: enrolledCourses, error: enrolledError } = await supabase
        .from('student_enrollments')
        .select('course_id')
        .eq('student_id', profile.id)
        .eq('status', 'enrolled');

      if (enrolledError) throw enrolledError;

      const enrolledCourseIds = enrolledCourses?.map(e => e.course_id).filter(Boolean) || [];

      let recentSchedules = [];
      if (enrolledCourseIds.length > 0) {
        const { data: scheduleData, error: schedulesError } = await supabase
          .from('class_schedule')
          .select(`
            *,
            courses!class_schedule_course_id_fkey (
              course_name_ar,
              course_code
            )
          `)
          .in('course_id', enrolledCourseIds)
          .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()) // Last 3 days
          .order('created_at', { ascending: false })
          .limit(10); // Limit for performance

        if (schedulesError) throw schedulesError;
        recentSchedules = scheduleData || [];
      }

      console.log('Course notifications data:', {
        recentCourses: recentCourses?.length,
        recentSchedules: recentSchedules.length,
        enrolledCourseIds: enrolledCourseIds.length
      });

      return {
        newCourses: recentCourses || [],
        newSchedules: recentSchedules
      };
    },
    enabled: !!profile?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes for more frequent updates
    refetchInterval: 5 * 60 * 1000, // Auto refetch every 5 minutes
  });
};

const CourseScheduleNotifications: React.FC = () => {
  const { data, isLoading } = useCourseScheduleNotifications();

  if (isLoading || !data) return null;

  const { newCourses = [], newSchedules = [] } = data;
  const hasNotifications = newCourses.length > 0 || newSchedules.length > 0;

  if (!hasNotifications) return null;

  return (
    <div className="space-y-4" dir="rtl">
      {newCourses.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">مقررات جديدة متاحة</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {newCourses.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {newCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-2 bg-white rounded-md">
                  <div>
                    <p className="font-medium text-gray-800">{course.course_name_ar}</p>
                    <p className="text-sm text-gray-600">{course.course_code} • {course.credit_hours} ساعة معتمدة</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    جديد
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {newSchedules.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">جداول دراسية جديدة</h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {newSchedules.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {newSchedules.map(schedule => (
                <div key={schedule.id} className="flex items-center justify-between p-2 bg-white rounded-md">
                  <div>
                    <p className="font-medium text-gray-800">{schedule.courses?.course_name_ar}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{schedule.classroom}</span>
                      <Clock className="h-3 w-3" />
                      <span>{schedule.start_time} - {schedule.end_time}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    محدث
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseScheduleNotifications;