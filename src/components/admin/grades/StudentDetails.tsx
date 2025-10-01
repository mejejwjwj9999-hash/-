import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
  BookOpen,
  Plus
} from 'lucide-react';
import { useStudentGradeDetails } from '@/hooks/useGradeStatistics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface StudentDetailsProps {
  studentId: string;
  onBack: () => void;
  onAddGrade?: (studentId: string) => void;
}

export const StudentDetails: React.FC<StudentDetailsProps> = ({ 
  studentId, 
  onBack, 
  onAddGrade 
}) => {
  const { data: studentData, isLoading } = useStudentGradeDetails(studentId);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        جاري تحميل بيانات الطالب...
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h3 className="text-lg font-semibold mb-2">لم يتم العثور على بيانات الطالب</h3>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          العودة
        </Button>
      </div>
    );
  }

  const grades = studentData.grades;
  
  // استخدام بيانات الطالب الحقيقية من الخطاف
  const student = studentData.student || {
    student_id: 'غير محدد',
    first_name: 'غير محدد',
    last_name: '',
    email: 'غير محدد',
    department: 'غير محدد',
    academic_year: 1,
    created_at: new Date().toISOString()
  };

  // تجهيز البيانات للرسوم البيانية
  const semesterGPAData = grades
    .reduce((acc: any[], grade) => {
      const key = `${grade.academic_year} - ${grade.semester}`;
      const existing = acc.find(item => item.semester === key);
      if (existing) {
        existing.totalGPA += grade.gpa_points || 0;
        existing.count += 1;
      } else {
        acc.push({
          semester: key,
          totalGPA: grade.gpa_points || 0,
          count: 1,
          gpa: grade.gpa_points || 0
        });
      }
      return acc;
    }, [])
    .map(item => ({
      ...item,
      gpa: item.totalGPA / item.count
    }))
    .slice(-6); // آخر 6 فصول

  const gradeDistribution = grades.reduce((acc: any, grade) => {
    const letter = grade.letter_grade || 'غير محدد';
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(gradeDistribution).map(([letter, count]) => ({
    name: letter,
    value: count,
    color: getGradeColor(letter)
  }));

  const coursePerformance = grades.map(grade => ({
    course: grade.courses?.course_code || 'غير محدد',
    courseName: grade.courses?.course_name_ar || 'غير محدد',
    grade: grade.total_grade || 0,
    gpa: grade.gpa_points || 0,
    creditHours: grade.courses?.credit_hours || 0
  })).slice(0, 10); // أحدث 10 مقررات

  function getGradeColor(letter: string) {
    const colors: Record<string, string> = {
      'A': '#22c55e',
      'B': '#3b82f6', 
      'C': '#f59e0b',
      'D': '#ef4444',
      'F': '#dc2626',
    };
    return colors[letter] || '#6b7280';
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600 bg-green-50';
    if (gpa >= 3.0) return 'text-blue-600 bg-blue-50';
    if (gpa >= 2.0) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* العودة والعنوان */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          العودة
        </Button>
        <h2 className="text-2xl font-bold">تفاصيل الطالب</h2>
      </div>

      {/* معلومات الطالب الأساسية */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={`/avatars/${student?.student_id}.jpg`} />
              <AvatarFallback className="bg-university-blue/10 text-university-blue font-bold text-xl">
                {getInitials(student?.first_name || '', student?.last_name || '')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {student?.first_name} {student?.last_name}
                  </h3>
                  <p className="text-lg text-muted-foreground">{student?.student_id}</p>
                </div>
                
                <div className="flex gap-2">
                  {studentData.cumulativeGPA >= 3.5 && (
                    <Badge className="bg-yellow-100 text-yellow-800 gap-1">
                      <Award className="h-4 w-4" />
                      طالب متفوق
                    </Badge>
                  )}
                  {studentData.cumulativeGPA < 2.0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      تحت المراقبة
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {studentData.academicStatus}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-university-blue" />
                  <div>
                    <div className="text-sm text-muted-foreground">البريد الإلكتروني</div>
                    <div className="font-medium">{student?.email || 'غير محدد'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-university-blue" />
                  <div>
                    <div className="text-sm text-muted-foreground">القسم</div>
                    <div className="font-medium">{student?.department || 'غير محدد'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-university-blue" />
                  <div>
                    <div className="text-sm text-muted-foreground">السنة الأكاديمية</div>
                    <div className="font-medium">{student?.academic_year || 'غير محدد'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-university-blue" />
                  <div>
                    <div className="text-sm text-muted-foreground">تاريخ التسجيل</div>
                    <div className="font-medium">
                      {student?.created_at ? new Date(student.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات الأكاديمية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${getGPAColor(studentData.cumulativeGPA)}`}>
                  {studentData.cumulativeGPA.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">المعدل التراكمي</div>
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
                  {studentData.completedHours}
                </div>
                <div className="text-sm text-muted-foreground">الساعات المكتملة</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <GraduationCap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {studentData.totalCreditHours}
                </div>
                <div className="text-sm text-muted-foreground">إجمالي الساعات</div>
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
                  {grades.length}
                </div>
                <div className="text-sm text-muted-foreground">المقررات المسجلة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* تطور المعدل */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              تطور المعدل التراكمي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={semesterGPAData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" fontSize={12} />
                <YAxis domain={[0, 4]} fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => `الفصل: ${label}`}
                  formatter={(value: number) => [`${value.toFixed(2)}`, 'المعدل']}
                />
                <Line 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* توزيع الدرجات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              توزيع التقديرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* أداء المقررات */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              أداء المقررات الحديثة
            </CardTitle>
            <Button 
              onClick={() => onAddGrade?.(studentId)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة درجة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coursePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(label) => `المقرر: ${label}`}
                formatter={(value: number, name: string) => {
                  if (name === 'grade') return [`${value}`, 'الدرجة'];
                  if (name === 'gpa') return [`${value}`, 'نقاط الجودة'];
                  return [value, name];
                }}
              />
              <Bar dataKey="grade" fill="#3b82f6" name="grade" />
              <Bar dataKey="gpa" fill="#10b981" name="gpa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* سجل الدرجات التفصيلي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            سجل الدرجات التفصيلي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">المقرر</th>
                  <th className="text-right py-3 px-4">رمز المقرر</th>
                  <th className="text-right py-3 px-4">الساعات</th>
                  <th className="text-right py-3 px-4">الأعمال</th>
                  <th className="text-right py-3 px-4">النصفي</th>
                  <th className="text-right py-3 px-4">النهائي</th>
                  <th className="text-right py-3 px-4">المجموع</th>
                  <th className="text-right py-3 px-4">التقدير</th>
                  <th className="text-right py-3 px-4">الفصل</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {grade.courses?.course_name_ar || 'غير محدد'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {grade.courses?.course_code || 'غير محدد'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {grade.courses?.credit_hours || 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {grade.coursework_grade || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {grade.midterm_grade || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {grade.final_grade || '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      {grade.total_grade || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        className={`${getGPAColor(grade.gpa_points || 0)} border-0`}
                      >
                        {grade.letter_grade || '-'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {grade.academic_year} - {grade.semester}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};