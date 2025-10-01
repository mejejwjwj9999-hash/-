import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Users,
  ArrowLeft,
  ArrowRight,
  Plus,
  BookOpen,
  Bell,
  Eye,
  Edit,
  Download,
  RefreshCw
} from 'lucide-react';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';

interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  type: 'lecture' | 'lab' | 'tutorial';
  studentsCount: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface TeacherScheduleProps {
  onTabChange?: (tab: string) => void;
}

const TeacherSchedule: React.FC<TeacherScheduleProps> = ({ onTabChange }) => {
  const { data: courses = [] } = useTeacherCourses();
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());

  function getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return startOfWeek.toISOString().split('T')[0];
  }

  function getCurrentDay() {
    return new Date().toISOString().split('T')[0];
  }

  // بيانات وهمية للجدول
  const mockSchedule: ScheduleItem[] = [
    {
      id: '1',
      courseId: 'CS101',
      courseName: 'مقدمة في علوم الحاسوب',
      courseCode: 'CS101',
      day: 'الأحد',
      startTime: '08:00',
      endTime: '09:30',
      room: '101',
      building: 'مبنى الحاسوب',
      type: 'lecture',
      studentsCount: 25,
      status: 'scheduled'
    },
    {
      id: '2',
      courseId: 'CS101',
      courseName: 'مقدمة في علوم الحاسوب',
      courseCode: 'CS101',
      day: 'الأحد',
      startTime: '10:00',
      endTime: '11:30',
      room: 'مختبر 1',
      building: 'مبنى الحاسوب',
      type: 'lab',
      studentsCount: 15,
      status: 'scheduled'
    },
    {
      id: '3',
      courseId: 'MATH201',
      courseName: 'رياضيات متقدمة',
      courseCode: 'MATH201',
      day: 'الاثنين',
      startTime: '09:00',
      endTime: '10:30',
      room: '205',
      building: 'مبنى العلوم',
      type: 'lecture',
      studentsCount: 30,
      status: 'completed'
    },
    {
      id: '4',
      courseId: 'CS102',
      courseName: 'برمجة متقدمة',
      courseCode: 'CS102',
      day: 'الثلاثاء',
      startTime: '11:00',
      endTime: '12:30',
      room: '102',
      building: 'مبنى الحاسوب',
      type: 'lecture',
      studentsCount: 20,
      status: 'scheduled'
    },
    {
      id: '5',
      courseId: 'CS102',
      courseName: 'برمجة متقدمة',
      courseCode: 'CS102',
      day: 'الأربعاء',
      startTime: '14:00',
      endTime: '16:00',
      room: 'مختبر 2',
      building: 'مبنى الحاسوب',
      type: 'lab',
      studentsCount: 20,
      status: 'scheduled'
    },
    {
      id: '6',
      courseId: 'PHYS101',
      courseName: 'فيزياء عامة',
      courseCode: 'PHYS101',
      day: 'الخميس',
      startTime: '08:30',
      endTime: '10:00',
      room: '301',
      building: 'مبنى العلوم',
      type: 'lecture',
      studentsCount: 28,
      status: 'scheduled'
    }
  ];

  const [schedule, setSchedule] = useState<ScheduleItem[]>(mockSchedule);

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'lecture':
        return { label: 'محاضرة', color: 'bg-blue-50 text-blue-700', icon: BookOpen };
      case 'lab':
        return { label: 'مختبر', color: 'bg-green-50 text-green-700', icon: Users };
      case 'tutorial':
        return { label: 'مراجعة', color: 'bg-purple-50 text-purple-700', icon: Edit };
      default:
        return { label: 'نشاط', color: 'bg-gray-50 text-gray-700', icon: Calendar };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: 'مجدول', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { label: 'مكتمل', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { label: 'ملغي', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'غير محدد', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getTodaySchedule = () => {
    const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long' });
    return schedule.filter(item => item.day === today);
  };

  const getWeekSchedule = () => {
    return daysOfWeek.map(day => ({
      day,
      sessions: schedule.filter(item => item.day === day)
    }));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentWeek = new Date(selectedWeek);
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newWeek.toISOString().split('T')[0]);
  };

  const weekSchedule = getWeekSchedule();
  const todaySchedule = getTodaySchedule();

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* العنوان */}
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الجدول الدراسي</h1>
          <p className="text-sm text-gray-600">عرض جدولك الدراسي المحدد من قبل الإدارة</p>
        </div>
        
        {/* خيارات العرض */}
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'week' | 'day')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوعي</SelectItem>
              <SelectItem value="day">يومي</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3">
              {viewMode === 'week' ? 'هذا الأسبوع' : 'اليوم'}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todaySchedule.length}</div>
                <div className="text-sm text-muted-foreground">حصص اليوم</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{schedule.length}</div>
                <div className="text-sm text-muted-foreground">حصص الأسبوع</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول اليوم */}
      {viewMode === 'day' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              جدول اليوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((session) => {
                  const typeInfo = getTypeInfo(session.type);
                  const statusInfo = getStatusInfo(session.status);
                  const TypeIcon = typeInfo.icon;
                  
                  return (
                    <Card key={session.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${typeInfo.color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{session.courseName}</div>
                            <div className="text-sm text-muted-foreground mb-2">{session.courseCode}</div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {session.startTime} - {session.endTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {session.room}, {session.building}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {session.studentsCount} طالب
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-lg font-semibold mb-2">لا توجد حصص مجدولة اليوم</h3>
                <p className="text-muted-foreground">استمتع بيومك!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* الجدول الأسبوعي */}
      {viewMode === 'week' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              الجدول الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekSchedule.map((daySchedule) => (
                <div key={daySchedule.day}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-lg">{daySchedule.day}</h3>
                    <Badge variant="outline">{daySchedule.sessions.length} حصة</Badge>
                  </div>
                  
                  {daySchedule.sessions.length > 0 ? (
                    <div className="grid gap-2">
                      {daySchedule.sessions.map((session) => {
                        const typeInfo = getTypeInfo(session.type);
                        const statusInfo = getStatusInfo(session.status);
                        
                        return (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-center min-w-[60px]">
                                <div className="font-medium text-sm">{session.startTime}</div>
                                <div className="text-xs text-muted-foreground">{session.endTime}</div>
                              </div>
                              <div className="h-8 w-px bg-gray-300"></div>
                              <div>
                                <div className="font-medium">{session.courseName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {session.room}, {session.building} • {session.studentsCount} طالب
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={statusInfo.color} variant="outline">
                                {statusInfo.label}
                              </Badge>
                              <Badge className={typeInfo.color} variant="outline">
                                {typeInfo.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm bg-gray-50 rounded-lg">
                      لا توجد حصص مجدولة
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* الإجراءات السريعة */}
      <div className="teacher-card animate-slide-in-right">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">الإجراءات المتاحة</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
              <Eye className="h-5 w-5" />
              <span className="text-sm">عرض التفاصيل</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300">
              <Download className="h-5 w-5" />
              <span className="text-sm">تصدير الجدول</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
              <Bell className="h-5 w-5" />
              <span className="text-sm">تذكير الحصص</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300">
              <RefreshCw className="h-5 w-5" />
              <span className="text-sm">تحديث الجدول</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedule;