
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User } from 'lucide-react';

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

interface ScheduleGridProps {
  schedule: ScheduleItem[];
}

const ScheduleGrid = ({ schedule }: ScheduleGridProps) => {
  const days = [
    { id: 0, name: 'الأحد', shortName: 'أحد' },
    { id: 1, name: 'الإثنين', shortName: 'إث' },
    { id: 2, name: 'الثلاثاء', shortName: 'ثل' },
    { id: 3, name: 'الأربعاء', shortName: 'أرب' },
    { id: 4, name: 'الخميس', shortName: 'خم' },
    { id: 5, name: 'الجمعة', shortName: 'جم' },
    { id: 6, name: 'السبت', shortName: 'سب' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getClassForTimeAndDay = (time: string, dayId: number) => {
    return schedule?.find(cls => 
      cls.day_of_week === dayId && 
      cls.start_time.substring(0, 5) === time
    );
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  if (!schedule || schedule.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">لا توجد محاضرات مجدولة</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="font-semibold text-center p-3 bg-muted rounded-lg">
            الوقت
          </div>
          {days.map(day => (
            <div key={day.id} className="font-semibold text-center p-3 bg-muted rounded-lg">
              <div className="hidden md:block">{day.name}</div>
              <div className="md:hidden">{day.shortName}</div>
            </div>
          ))}
        </div>
        
        {/* Time slots */}
        {timeSlots.map(time => (
          <div key={time} className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-center p-3 font-medium bg-gray-50 rounded flex items-center justify-center">
              {time}
            </div>
            {days.map(day => {
              const classItem = getClassForTimeAndDay(time, day.id);
              return (
                <div key={`${time}-${day.id}`} className="min-h-[80px]">
                  {classItem ? (
                    <Card className="h-full bg-primary/10 border-primary/30 hover:shadow-md transition-shadow">
                      <CardContent className="p-3 h-full">
                        <div className="space-y-1">
                          <div className="font-semibold text-sm">
                            {classItem.courses?.course_code || 'كود المادة'}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {classItem.courses?.course_name_ar || 'اسم المادة'}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            <span>{classItem.classroom}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <User className="h-3 w-3" />
                            <span>{classItem.instructor_name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}</span>
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
  );
};

export default ScheduleGrid;
