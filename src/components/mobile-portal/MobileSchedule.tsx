
import React, { useEffect } from 'react';
import { useSchedule } from '@/hooks/useSchedule';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, BookOpen, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';

const MobileSchedule = () => {
  const { data: schedule, isLoading, refetch } = useSchedule();
  const queryClient = useQueryClient();
  
  // Enable real-time updates
  useRealtime();

  // Auto refresh schedule data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  // ترتيب الأيام من السبت إلى الجمعة (النظام الأكاديمي العربي)
  const days = [
    { id: 6, name: 'السبت', shortName: 'سب' },
    { id: 0, name: 'الأحد', shortName: 'أحد' },
    { id: 1, name: 'الإثنين', shortName: 'إث' },
    { id: 2, name: 'الثلاثاء', shortName: 'ثل' },
    { id: 3, name: 'الأربعاء', shortName: 'أرب' },
    { id: 4, name: 'الخميس', shortName: 'خم' },
    { id: 5, name: 'الجمعة', shortName: 'جم' }
  ];

  const getClassesForDay = (dayId: number) => {
    return schedule?.filter(cls => cls.day_of_week === dayId)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)) || [];
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-university-blue/5 to-university-gold/5 min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-university-blue font-medium">جاري تحميل الجدول...</p>
        </div>
      </div>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <div className="px-4 py-6 bg-gradient-to-br from-university-blue/5 to-university-gold/5 min-h-screen" dir="rtl">
        <Card className="text-center py-12 border-dashed border-2 border-university-blue/20 bg-gradient-to-br from-university-blue/5 to-university-gold/5">
          <CardContent>
            <Calendar className="w-16 h-16 text-university-blue/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-university-blue mb-2">لا يوجد جدول دراسي</h3>
            <p className="text-academic-gray">لم يتم تحديد أي محاضرات في الجدول الدراسي بعد</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 space-y-3 bg-gradient-to-br from-university-blue/5 to-university-gold/5 min-h-screen" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-university-blue to-university-blue-dark rounded-xl flex items-center justify-center shadow-university">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-university-blue">الجدول الدراسي</h1>
            <p className="text-xs text-academic-gray">جدولك الأسبوعي المحدث</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-1 border-university-blue text-university-blue hover:bg-university-blue hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* الجدول الأسبوعي */}
      <div className="space-y-3">
        {days.map(day => {
          const dayClasses = getClassesForDay(day.id);
          const today = new Date().getDay(); // 0=الأحد, 6=السبت
          const isToday = day.id === today;
          
          return (
            <Card key={day.id} className={`border-0 shadow-md transition-all duration-300 hover:shadow-lg ${
              isToday ? 'ring-2 ring-university-blue shadow-university bg-gradient-to-l from-university-blue/10 to-white' : ''
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                      isToday 
                        ? 'bg-gradient-to-br from-university-blue to-university-blue-dark' 
                        : 'bg-gradient-to-br from-academic-gray to-gray-500'
                    }`}>
                      {day.shortName}
                    </div>
                    <div>
                      <span className={`text-lg font-bold ${isToday ? 'text-university-blue' : 'text-gray-800'}`}>
                        {day.name}
                      </span>
                      {isToday && (
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className="bg-university-gold text-university-blue text-xs font-medium">اليوم</Badge>
                          <Badge variant="outline" className="text-xs border-university-red text-university-red">
                            {new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={dayClasses.length > 0 ? "default" : "secondary"}
                    className={`text-xs ${
                      dayClasses.length > 0 
                        ? 'bg-university-blue text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {dayClasses.length} محاضرة
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {dayClasses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">لا توجد محاضرات في هذا اليوم</p>
                    <p className="text-xs text-gray-400 mt-1">يوم راحة للطلاب</p>
                  </div>
                ) : (
                  dayClasses.map((classItem, index) => (
                    <div key={classItem.id} className={`rounded-xl p-4 border transition-all duration-300 hover:shadow-md ${
                      isToday 
                        ? 'bg-gradient-to-l from-university-blue/5 via-university-gold/5 to-white border-university-blue/20' 
                        : 'bg-gradient-to-l from-blue-50 to-white border-blue-100'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md ${
                          isToday 
                            ? 'bg-gradient-to-br from-university-blue to-university-blue-dark' 
                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className={`font-bold text-base mb-1 ${
                              isToday ? 'text-university-blue' : 'text-gray-800'
                            }`}>
                              {classItem.courses?.course_name_ar || 'اسم المقرر'}
                            </h4>
                            <p className={`text-sm font-medium ${
                              isToday ? 'text-university-red' : 'text-blue-600'
                            }`}>
                              {classItem.courses?.course_code || 'كود المقرر'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                isToday ? 'bg-university-gold/20' : 'bg-blue-100'
                              }`}>
                                <Clock className={`h-3 w-3 ${
                                  isToday ? 'text-university-blue' : 'text-blue-600'
                                }`} />
                              </div>
                              <span className="font-medium">
                                {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                isToday ? 'bg-university-gold/20' : 'bg-blue-100'
                              }`}>
                                <MapPin className={`h-3 w-3 ${
                                  isToday ? 'text-university-blue' : 'text-blue-600'
                                }`} />
                              </div>
                              <span>{classItem.classroom || 'قاعة غير محددة'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                isToday ? 'bg-university-gold/20' : 'bg-blue-100'
                              }`}>
                                <User className={`h-3 w-3 ${
                                  isToday ? 'text-university-blue' : 'text-blue-600'
                                }`} />
                              </div>
                              <span>{classItem.instructor_name || 'المدرس'}</span>
                            </div>
                          </div>
                          
                          {classItem.courses?.credit_hours && (
                            <div className="pt-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  isToday 
                                    ? 'border-university-gold text-university-blue bg-university-gold/10' 
                                    : 'border-blue-200 text-blue-700 bg-blue-50'
                                }`}
                              >
                                {classItem.courses.credit_hours} ساعة معتمدة
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ملخص الجدول */}
      <Card className="border-0 shadow-md bg-gradient-to-l from-university-blue/5 via-university-gold/5 to-white">
        <CardContent className="p-5">
          <h3 className="font-bold text-university-blue mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-university-blue to-university-blue-dark rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            ملخص الجدول الأسبوعي
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 shadow-soft border border-university-blue/10">
              <div className="w-8 h-8 bg-gradient-to-br from-university-blue to-university-blue-dark rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-university-blue mb-1">
                {schedule?.length || 0}
              </div>
              <div className="text-xs text-academic-gray">إجمالي المحاضرات</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-soft border border-university-gold/20">
              <div className="w-8 h-8 bg-gradient-to-br from-university-gold to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-4 w-4 text-university-blue" />
              </div>
              <div className="text-2xl font-bold text-university-red mb-1">
                {days.filter(day => getClassesForDay(day.id).length > 0).length}
              </div>
              <div className="text-xs text-academic-gray">أيام الدراسة</div>
            </div>
          </div>
          
          {/* إحصائيات إضافية */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-university-blue">
                  {Math.max(...days.map(day => getClassesForDay(day.id).length))}
                </div>
                <div className="text-xs text-gray-600">أقصى محاضرات/يوم</div>
              </div>
              <div>
                <div className="text-lg font-bold text-university-red">
                  {new Date().getDay()}
                </div>
                <div className="text-xs text-gray-600">اليوم الحالي</div>
              </div>
              <div>
                <div className="text-lg font-bold text-university-gold">
                  {schedule?.reduce((total, item) => total + (item.courses?.credit_hours || 0), 0) || 0}
                </div>
                <div className="text-xs text-gray-600">إجمالي الساعات</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSchedule;
