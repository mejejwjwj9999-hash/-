import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ClipboardCheck, 
  Users, 
  Calendar,
  Clock,
  Search,
  Filter,
  Save,
  CheckCircle,
  XCircle,
  User,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';

interface Student {
  id: string;
  name: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

interface TeacherAttendanceProps {
  onTabChange?: (tab: string) => void;
}

const TeacherAttendance: React.FC<TeacherAttendanceProps> = ({ onTabChange }) => {
  const { data: courses = [] } = useTeacherCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // بيانات وهمية للطلاب
  const mockStudents: Student[] = [
    { id: '1', name: 'أحمد محمد علي', studentId: '20231001', status: 'present' },
    { id: '2', name: 'فاطمة أحمد حسن', studentId: '20231002', status: 'present' },
    { id: '3', name: 'محمد سالم قاسم', studentId: '20231003', status: 'absent' },
    { id: '4', name: 'عائشة علي محمد', studentId: '20231004', status: 'late' },
    { id: '5', name: 'يوسف عبدالله حميد', studentId: '20231005', status: 'present' },
    { id: '6', name: 'زينب حسن أحمد', studentId: '20231006', status: 'excused' },
    { id: '7', name: 'عمر محمد سعيد', studentId: '20231007', status: 'present' },
    { id: '8', name: 'خديجة عبدالرحمن', studentId: '20231008', status: 'present' },
  ];

  const [students, setStudents] = useState<Student[]>(mockStudents);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.includes(searchTerm)
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'present':
        return { label: 'حاضر', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle };
      case 'absent':
        return { label: 'غائب', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle };
      case 'late':
        return { label: 'متأخر', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: Clock };
      case 'excused':
        return { label: 'معذور', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: AlertCircle };
      default:
        return { label: 'غير محدد', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: User };
    }
  };

  const updateStudentStatus = (studentId: string, status: Student['status']) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const getAttendanceStats = () => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(s => s.status === 'present').length;
    const absent = filteredStudents.filter(s => s.status === 'absent').length;
    const late = filteredStudents.filter(s => s.status === 'late').length;
    const excused = filteredStudents.filter(s => s.status === 'excused').length;
    const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    
    return { total, present, absent, late, excused, attendanceRate };
  };

  const stats = getAttendanceStats();

  const saveAttendance = () => {
    setIsRecording(true);
    // هنا سيتم حفظ البيانات إلى قاعدة البيانات
    setTimeout(() => {
      setIsRecording(false);
      // يمكن إضافة toast notification هنا
      alert('تم حفظ الحضور بنجاح');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* العنوان والإعدادات */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">تسجيل الحضور</h1>
          <Button 
            onClick={saveAttendance} 
            disabled={isRecording || !selectedCourse}
            className="gap-2"
          >
            {isRecording ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            حفظ الحضور
          </Button>
        </div>
        
        {/* خيارات الفلترة */}
        <div className="grid grid-cols-1 gap-3">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المقرر" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.courses?.course_name_ar || 'مقرر غير محدد'} - {course.courses?.course_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن طالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </div>

      {/* إحصائيات الحضور */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">{stats.attendanceRate}%</div>
                <div className="text-sm text-muted-foreground">نسبة الحضور</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.present + stats.late}/{stats.total}</div>
                <div className="text-sm text-muted-foreground">حاضرين</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الطلاب */}
      {selectedCourse ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              قائمة الحضور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const statusInfo = getStatusInfo(student.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-university-blue/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-university-blue" />
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.studentId}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs ${statusInfo.bgColor} ${statusInfo.color} flex items-center gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </div>
                      
                      <Select value={student.status} onValueChange={(value) => updateStudentStatus(student.id, value as Student['status'])}>
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">حاضر</SelectItem>
                          <SelectItem value="absent">غائب</SelectItem>
                          <SelectItem value="late">متأخر</SelectItem>
                          <SelectItem value="excused">معذور</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <ClipboardCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-semibold mb-2">اختر مقرراً لبدء تسجيل الحضور</h3>
              <p className="text-muted-foreground">قم بتحديد المقرر والتاريخ أولاً</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الإجراءات السريعة */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="h-5 w-5" />
              <span className="text-sm">تصدير الحضور</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">تقرير شهري</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">الغيابات المتكررة</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <RefreshCw className="h-5 w-5" />
              <span className="text-sm">مزامنة البيانات</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAttendance;