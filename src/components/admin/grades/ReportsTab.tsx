import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Award,
  BookOpen,
  Download,
  Filter
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useGradeStatistics } from '@/hooks/useGradeStatistics';

export const ReportsTab: React.FC = () => {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [selectedSemester, setSelectedSemester] = useState('');

  const { data: statistics, isLoading } = useGradeStatistics(
    selectedAcademicYear === 'all' ? undefined : selectedAcademicYear,
    selectedSemester === 'all' ? undefined : selectedSemester
  );

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        جاري تحميل التقارير...
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h3 className="text-lg font-semibold mb-2">لا توجد بيانات</h3>
        <p className="text-muted-foreground">لا توجد درجات مسجلة للفترة المحددة</p>
      </div>
    );
  }

  // تجهيز البيانات للرسوم البيانية
  const gradeDistributionData = Object.entries(statistics.gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: ((count as number) / Object.values(statistics.gradeDistribution).reduce((a, b) => a + b, 0) * 100).toFixed(1)
  }));

  const departmentStatsData = Object.entries(statistics.departmentStats).map(([dept, stats]) => ({
    department: dept,
    students: stats.students,
    averageGPA: stats.averageGPA,
    passRate: stats.passRate
  }));

  const semesterComparisonData = statistics.semesterComparison.map(semester => ({
    period: `${semester.semester}`,
    year: semester.academicYear,
    gpa: semester.averageGPA,
    students: semester.totalStudents
  }));

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.0) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* الفلاتر */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع السنوات</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الفصل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفصول</SelectItem>
                <SelectItem value="الفصل الأول">الفصل الأول</SelectItem>
                <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                <SelectItem value="الفصل الصيفي">الفصل الصيفي</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              تصدير التقرير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* المؤشرات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.totalStudents}
                </div>
                <div className="text-sm text-muted-foreground">إجمالي الطلاب</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.totalCourses}
                </div>
                <div className="text-sm text-muted-foreground">إجمالي المقررات</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${getGPAColor(statistics.overallGPA)}`}>
                  {statistics.overallGPA.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">المعدل العام</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {statistics.passRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">نسبة النجاح</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* توزيع الدرجات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              توزيع التقديرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? [`${value} طالب`, 'العدد'] : [value, name]
                  ]}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* أداء الأقسام */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              أداء الأقسام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" fontSize={12} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'averageGPA') return [`${(value as number).toFixed(2)}`, 'المعدل'];
                    if (name === 'passRate') return [`${(value as number).toFixed(1)}%`, 'نسبة النجاح'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="averageGPA" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* مقارنة الفصول */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            مقارنة أداء الفصول
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={semesterComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 4]} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'gpa') return [`${(value as number).toFixed(2)}`, 'المعدل'];
                  if (name === 'students') return [`${value} طالب`, 'عدد الطلاب'];
                  return [value, name];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="gpa" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.1}
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* تفاصيل الأقسام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            تفاصيل أداء الأقسام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-right py-3 px-4">القسم</th>
                  <th className="text-center py-3 px-4">عدد الطلاب</th>
                  <th className="text-center py-3 px-4">المعدل العام</th>
                  <th className="text-center py-3 px-4">نسبة النجاح</th>
                  <th className="text-center py-3 px-4">التقييم</th>
                </tr>
              </thead>
              <tbody>
                {departmentStatsData.map((dept, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{dept.department}</td>
                    <td className="py-3 px-4 text-center">{dept.students}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${getGPAColor(dept.averageGPA)}`}>
                        {dept.averageGPA.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={dept.passRate >= 80 ? 'text-green-600' : dept.passRate >= 60 ? 'text-orange-600' : 'text-red-600'}>
                        {dept.passRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        className={
                          dept.averageGPA >= 3.5 ? 'bg-green-100 text-green-800' :
                          dept.averageGPA >= 3.0 ? 'bg-blue-100 text-blue-800' :
                          dept.averageGPA >= 2.0 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {dept.averageGPA >= 3.5 ? 'ممتاز' :
                         dept.averageGPA >= 3.0 ? 'جيد جداً' :
                         dept.averageGPA >= 2.0 ? 'جيد' : 'ضعيف'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* نظرة عامة سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الطلاب المتفوقون (معدل 3.5+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {Object.values(statistics.departmentStats).reduce((total, dept) => {
                  return total + (dept.averageGPA >= 3.5 ? dept.students : 0);
                }, 0)}
              </div>
              <div className="text-muted-foreground">
                من أصل {statistics.totalStudents} طالب
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">
                  {(Object.values(statistics.departmentStats).reduce((total, dept) => {
                    return total + (dept.averageGPA >= 3.5 ? dept.students : 0);
                  }, 0) / statistics.totalStudents * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الطلاب تحت المراقبة (معدل أقل من 2.0)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {Object.values(statistics.departmentStats).reduce((total, dept) => {
                  return total + (dept.averageGPA < 2.0 ? dept.students : 0);
                }, 0)}
              </div>
              <div className="text-muted-foreground">
                من أصل {statistics.totalStudents} طالب
              </div>
              <div className="mt-2">
                <Badge className="bg-red-100 text-red-800">
                  {(Object.values(statistics.departmentStats).reduce((total, dept) => {
                    return total + (dept.averageGPA < 2.0 ? dept.students : 0);
                  }, 0) / statistics.totalStudents * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};