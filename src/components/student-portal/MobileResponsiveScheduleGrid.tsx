
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';

interface ScheduleItem {
  id: string;
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classroom: string;
  instructor_name: string;
  courses?: {
    course_code: string;
    course_name_ar: string;
    credit_hours: number;
  };
}

interface MobileResponsiveScheduleGridProps {
  schedule: ScheduleItem[];
}

const MobileResponsiveScheduleGrid = ({ schedule }: MobileResponsiveScheduleGridProps) => {
  const days = [
    { id: 0, name: 'الأحد', shortName: 'أحد' },
    { id: 1, name: 'الإثنين', shortName: 'إث' },
    { id: 2, name: 'الثلاثاء', shortName: 'ثل' },
    { id: 3, name: 'الأربعاء', shortName: 'أرب' },
    { id: 4, name: 'الخميس', shortName: 'خم' },
    { id: 5, name: 'الجمعة', shortName: 'جم' },
    { id: 6, name: 'السبت', shortName: 'سب' }
  ];

  const getScheduleForDay = (dayId: number) => {
    return schedule?.filter(item => item.day_of_week === dayId) || [];
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return time.substring(0, 5);
    }
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

  if (!schedule || schedule.length === 0) {
    return (
      <div className="text-center py-8" dir="rtl">
        <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد محاضرات مجدولة</h3>
        <p className="text-gray-500">سيتم إضافة الجدول الدراسي قريباً</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Mobile View - Cards per Day */}
      <div className="lg:hidden space-y-4">
        {days.map((day) => {
          const daySchedule = getScheduleForDay(day.id);
          if (daySchedule.length === 0) return null;
          
          return (
            <Card key={day.id} className="overflow-hidden">
              <div className="bg-primary/10 px-4 py-3 border-b">
                <h3 className="font-semibold text-primary">{day.name}</h3>
              </div>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {daySchedule.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 border-b last:border-b-0 ${getColorForCourse(index)}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base mb-1">
                              {item.courses?.course_name_ar || 'مادة غير محددة'}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {item.courses?.course_code || 'غير محدد'}
                              </Badge>
                              <Badge className="text-xs bg-white/20">
                                {item.courses?.credit_hours || 0} ساعة
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(item.start_time)} - {formatTime(item.end_time)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.classroom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{item.instructor_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Desktop View - Grid */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-semibold text-center p-3 bg-muted rounded-lg">
              الوقت
            </div>
            {days.map(day => (
              <div key={day.id} className="font-semibold text-center p-3 bg-muted rounded-lg">
                {day.name}
              </div>
            ))}
          </div>
          
          {/* Time slots for desktop */}
          {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
            <div key={time} className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-center p-3 font-medium bg-gray-50 rounded flex items-center justify-center">
                {time}
              </div>
              {days.map(day => {
                const daySchedule = getScheduleForDay(day.id);
                const classItem = daySchedule.find(item => 
                  item.start_time <= `${time}:00` && item.end_time > `${time}:00`
                );
                
                return (
                  <div key={`${time}-${day.id}`} className="min-h-[80px]">
                    {classItem ? (
                      <Card className="h-full bg-primary/10 border-primary/30 hover:shadow-md transition-shadow">
                        <CardContent className="p-3 h-full">
                          <div className="space-y-1">
                            <div className="font-semibold text-sm">
                              {classItem.courses?.course_code || 'مادة'}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {classItem.courses?.course_name_ar || 'غير محددة'}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3" />
                              <span>{classItem.classroom}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <User className="h-3 w-3" />
                              <span className="truncate">{classItem.instructor_name}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="h-full border-2 border-dashed border-muted rounded-lg opacity-50"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileResponsiveScheduleGrid;
