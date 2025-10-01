
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useSchedule } from '@/hooks/useSchedule';
import { useAuth } from '@/components/auth/AuthProvider';

const DAYS_OF_WEEK = [
  { id: 0, name: 'الأحد', short: 'ح' },
  { id: 1, name: 'الاثنين', short: 'ن' },
  { id: 2, name: 'الثلاثاء', short: 'ث' },
  { id: 3, name: 'الأربعاء', short: 'ر' },
  { id: 4, name: 'الخميس', short: 'خ' },
  { id: 5, name: 'الجمعة', short: 'ج' },
  { id: 6, name: 'السبت', short: 'س' }
];

const ImprovedScheduleSection = () => {
  const { profile } = useAuth();
  const { data: schedule, isLoading, refetch, error } = useSchedule();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const filteredSchedule = selectedDay !== null 
    ? schedule?.filter(item => item.day_of_week === selectedDay) || []
    : schedule || [];

  const getDayName = (dayNumber: number) => {
    return DAYS_OF_WEEK.find(day => day.id === dayNumber)?.name || 'غير محدد';
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeColor = (startTime: string) => {
    if (!startTime) return 'from-gray-500 to-gray-600';
    const hour = parseInt(startTime.split(':')[0]);
    if (hour < 10) return 'from-blue-500 to-blue-600';
    if (hour < 14) return 'from-green-500 to-green-600';
    return 'from-orange-500 to-orange-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin ml-3" />
            <span>جاري تحميل الجدول الدراسي...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">خطأ في تحميل الجدول</h3>
                <p>حدث خطأ أثناء تحميل الجدول الدراسي. يرجى المحاولة مرة أخرى.</p>
              </div>
              <Button onClick={() => refetch()} variant="outline" className="mt-4">
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-primary to-accent text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 right-8 w-32 h-32 rounded-full border-2 border-white/20"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white/10"></div>
          </div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <Calendar className="h-8 w-8" />
                  الجدول الدراسي
                </h1>
                <p className="text-white/90 text-lg">
                  السنة الأكاديمية {profile?.academic_year} - الفصل {profile?.semester}
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="rounded-2xl hover:scale-105 transition-all duration-300"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                  تحديث
                </Button>
                <Button variant="secondary" className="rounded-2xl hover:scale-105 transition-all duration-300">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل الجدول
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Filter */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDay === null ? "default" : "outline"}
                onClick={() => setSelectedDay(null)}
                className="rounded-2xl"
              >
                جميع الأيام
              </Button>
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.id}
                  variant={selectedDay === day.id ? "default" : "outline"}
                  onClick={() => setSelectedDay(day.id)}
                  className="rounded-2xl"
                >
                  {day.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Content */}
        {filteredSchedule.length > 0 ? (
          <div className="space-y-6">
            {selectedDay !== null ? (
              // Single Day View
              <Card className="border-0 shadow-lg rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-2xl text-white">
                      <Calendar className="h-6 w-6" />
                    </div>
                    جدول يوم {getDayName(selectedDay)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredSchedule
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${getTimeColor(item.start_time)} text-white`}>
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-primary">
                              {item.courses?.course_name_ar || 'مقرر غير محدد'}
                            </h3>
                            <p className="text-muted-foreground">
                              {item.courses?.course_code || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-semibold">
                              {formatTime(item.start_time)} - {formatTime(item.end_time)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              المدة: {(() => {
                                const start = new Date(`2000-01-01T${item.start_time}`);
                                const end = new Date(`2000-01-01T${item.end_time}`);
                                const diff = (end.getTime() - start.getTime()) / (1000 * 60);
                                return `${diff} دقيقة`;
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-semibold">{item.classroom}</div>
                            <div className="text-sm text-muted-foreground">القاعة</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-semibold">{item.instructor_name}</div>
                            <div className="text-sm text-muted-foreground">المدرس</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              // Weekly View
              DAYS_OF_WEEK.map((day) => {
                const daySchedule = filteredSchedule
                  .filter(item => item.day_of_week === day.id)
                  .sort((a, b) => a.start_time.localeCompare(b.start_time));
                
                if (daySchedule.length === 0) return null;
                
                return (
                  <Card key={day.id} className="border-0 shadow-lg rounded-2xl bg-white">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-2xl text-white">
                          <span className="font-bold">{day.short}</span>
                        </div>
                        {day.name}
                        <Badge variant="secondary" className="rounded-full">
                          {daySchedule.length} محاضرة
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {daySchedule.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl bg-gradient-to-br ${getTimeColor(item.start_time)} text-white`}>
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary">
                                {item.courses?.course_name_ar || 'مقرر غير محدد'}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {item.classroom}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {item.instructor_name}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            {item.courses?.course_code || 'N/A'}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        ) : (
          <Card className="border-0 shadow-lg rounded-2xl bg-white">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                لا يوجد جدول دراسي
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedDay !== null 
                  ? `لا توجد محاضرات في يوم ${getDayName(selectedDay)}`
                  : 'لم يتم العثور على جدول دراسي للفصل الحالي'
                }
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث البيانات
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImprovedScheduleSection;
