import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar,
  Search, 
  Download,
  BarChart3,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

const StudentAttendanceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('all');

  const attendanceData = [
    {
      id: '1',
      studentName: 'أحمد محمد علي',
      studentId: 'ST2024001',
      course: 'برمجة الحاسوب',
      date: '2024-01-15',
      status: 'present',
      time: '08:30'
    },
    {
      id: '2',
      studentName: 'فاطمة سالم أحمد',
      studentId: 'ST2024002',
      course: 'برمجة الحاسوب',
      date: '2024-01-15',
      status: 'absent',
      time: '--'
    },
    {
      id: '3',
      studentName: 'محمد عبدالله حسن',
      studentId: 'ST2024003',
      course: 'برمجة الحاسوب',
      date: '2024-01-15',
      status: 'late',
      time: '08:45'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      present: 'حاضر',
      absent: 'غائب',
      late: 'متأخر',
      excused: 'غياب بعذر'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'excused': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة حضور وغياب الطلاب</h2>
          <p className="text-muted-foreground">تتبع وإدارة حضور الطلاب والتقارير</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
          <Button>
            <UserCheck className="w-4 h-4 mr-2" />
            تسجيل حضور
          </Button>
        </div>
      </div>

      {/* إحصائيات الحضور */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">نسبة الحضور اليوم</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلاب حاضرون</p>
                <p className="text-2xl font-bold text-blue-600">1,085</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلاب غائبون</p>
                <p className="text-2xl font-bold text-red-600">162</p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متأخرون</p>
                <p className="text-2xl font-bold text-yellow-600">43</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="daily">الحضور اليومي</TabsTrigger>
          <TabsTrigger value="course">حسب المقرر</TabsTrigger>
          <TabsTrigger value="student">حسب الطالب</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="statistics">الإحصائيات</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* فلاتر البحث */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر المقرر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المقررات</SelectItem>
                <SelectItem value="programming">برمجة الحاسوب</SelectItem>
                <SelectItem value="math">الرياضيات</SelectItem>
                <SelectItem value="physics">الفيزياء</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث عن طالب..." className="pr-10" />
            </div>
          </div>

          {/* جدول الحضور */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-4 font-medium">اسم الطالب</th>
                      <th className="text-right p-4 font-medium">الرقم الجامعي</th>
                      <th className="text-right p-4 font-medium">المقرر</th>
                      <th className="text-right p-4 font-medium">الحالة</th>
                      <th className="text-right p-4 font-medium">وقت الوصول</th>
                      <th className="text-right p-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{record.studentName}</td>
                        <td className="p-4 text-muted-foreground">{record.studentId}</td>
                        <td className="p-4">{record.course}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <Badge className={getStatusColor(record.status)}>
                              {getStatusText(record.status)}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">{record.time}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              تعديل
                            </Button>
                            <Button variant="outline" size="sm">
                              ملاحظة
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course" className="space-y-4">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">حضور المقررات</h3>
            <p className="text-muted-foreground">تقارير الحضور مصنفة حسب المقررات</p>
          </div>
        </TabsContent>

        <TabsContent value="student" className="space-y-4">
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">حضور الطلاب</h3>
            <p className="text-muted-foreground">سجل حضور كل طالب على حدة</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">تقرير يومي</h3>
                <p className="text-sm text-muted-foreground">حضور اليوم والأسبوع</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">تقرير شهري</h3>
                <p className="text-sm text-muted-foreground">إحصائيات الحضور الشهرية</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">تقرير سنوي</h3>
                <p className="text-sm text-muted-foreground">اتجاهات الحضور السنوية</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">إحصائيات الحضور</h3>
            <p className="text-muted-foreground">رسوم بيانية وتحليلات مفصلة</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAttendanceManager;