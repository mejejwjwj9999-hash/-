import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  GraduationCap, 
  Users, 
  FileText,
  TrendingUp,
  Search,
  Plus,
  Save,
  Edit3,
  Eye,
  Calculator,
  BarChart3,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';

interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  midterm: number | null;
  final: number | null;
  assignments: number | null;
  attendance: number | null;
  total: number | null;
  grade: string;
  status: 'pass' | 'fail' | 'pending';
}

interface TeacherGradesProps {
  onTabChange?: (tab: string) => void;
}

const TeacherGrades: React.FC<TeacherGradesProps> = ({ onTabChange }) => {
  const { data: courses = [] } = useTeacherCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGrade, setEditingGrade] = useState<string | null>(null);

  // بيانات وهمية للدرجات
  const mockGrades: StudentGrade[] = [
    {
      id: '1',
      studentId: '20231001',
      studentName: 'أحمد محمد علي',
      midterm: 85,
      final: 90,
      assignments: 88,
      attendance: 95,
      total: 89,
      grade: 'A',
      status: 'pass'
    },
    {
      id: '2',
      studentId: '20231002',
      studentName: 'فاطمة أحمد حسن',
      midterm: 92,
      final: 88,
      assignments: 95,
      attendance: 100,
      total: 92,
      grade: 'A+',
      status: 'pass'
    },
    {
      id: '3',
      studentId: '20231003',
      studentName: 'محمد سالم قاسم',
      midterm: 65,
      final: 70,
      assignments: 72,
      attendance: 80,
      total: 70,
      grade: 'B-',
      status: 'pass'
    },
    {
      id: '4',
      studentId: '20231004',
      studentName: 'عائشة علي محمد',
      midterm: null,
      final: null,
      assignments: 85,
      attendance: 90,
      total: null,
      grade: '-',
      status: 'pending'
    },
    {
      id: '5',
      studentId: '20231005',
      studentName: 'يوسف عبدالله حميد',
      midterm: 45,
      final: 55,
      assignments: 60,
      attendance: 70,
      total: 56,
      grade: 'F',
      status: 'fail'
    }
  ];

  const [grades, setGrades] = useState<StudentGrade[]>(mockGrades);

  const filteredGrades = grades.filter(grade => 
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.studentId.includes(searchTerm)
  );

  const getGradeStats = () => {
    const completed = grades.filter(g => g.total !== null);
    const passed = grades.filter(g => g.status === 'pass');
    const failed = grades.filter(g => g.status === 'fail');
    const pending = grades.filter(g => g.status === 'pending');
    const averageTotal = completed.length > 0 
      ? Math.round(completed.reduce((sum, g) => sum + (g.total || 0), 0) / completed.length)
      : 0;
    
    return {
      total: grades.length,
      completed: completed.length,
      passed: passed.length,
      failed: failed.length,
      pending: pending.length,
      average: averageTotal,
      passRate: grades.length > 0 ? Math.round((passed.length / (passed.length + failed.length)) * 100) || 0 : 0
    };
  };

  const stats = getGradeStats();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-50';
      case 'A-':
      case 'B+':
      case 'B':
        return 'text-blue-600 bg-blue-50';
      case 'B-':
      case 'C+':
      case 'C':
        return 'text-yellow-600 bg-yellow-50';
      case 'C-':
      case 'D+':
      case 'D':
        return 'text-orange-600 bg-orange-50';
      case 'F':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateTotalGrade = (student: StudentGrade) => {
    const weights = { midterm: 0.3, final: 0.4, assignments: 0.2, attendance: 0.1 };
    const total = 
      (student.midterm || 0) * weights.midterm +
      (student.final || 0) * weights.final +
      (student.assignments || 0) * weights.assignments +
      (student.attendance || 0) * weights.attendance;
    
    return Math.round(total);
  };

  const getLetterGrade = (total: number) => {
    if (total >= 95) return 'A+';
    if (total >= 90) return 'A';
    if (total >= 85) return 'A-';
    if (total >= 80) return 'B+';
    if (total >= 75) return 'B';
    if (total >= 70) return 'B-';
    if (total >= 65) return 'C+';
    if (total >= 60) return 'C';
    if (total >= 55) return 'C-';
    if (total >= 50) return 'D';
    return 'F';
  };

  const updateGrade = (studentId: string, field: keyof StudentGrade, value: any) => {
    setGrades(prev => 
      prev.map(student => {
        if (student.id === studentId) {
          const updated = { ...student, [field]: value };
          
          // إعادة حساب الدرجة الإجمالية إذا تم تحديث أي من المكونات
          if (['midterm', 'final', 'assignments', 'attendance'].includes(field)) {
            const total = calculateTotalGrade(updated);
            updated.total = total;
            updated.grade = getLetterGrade(total);
            updated.status = total >= 60 ? 'pass' : 'fail';
          }
          
          return updated;
        }
        return student;
      })
    );
  };

  const saveGrades = () => {
    // هنا سيتم حفظ الدرجات إلى قاعدة البيانات
    alert('تم حفظ الدرجات بنجاح');
  };

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* العنوان والإعدادات */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الدرجات</h1>
          <Button onClick={saveGrades} className="gap-2">
            <Save className="h-4 w-4" />
            حفظ الدرجات
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
          
          <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
            <SelectTrigger>
              <SelectValue placeholder="نوع التقييم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التقييمات</SelectItem>
              <SelectItem value="midterm">امتحان منتصف الفصل</SelectItem>
              <SelectItem value="final">الامتحان النهائي</SelectItem>
              <SelectItem value="assignments">الواجبات</SelectItem>
              <SelectItem value="attendance">الحضور</SelectItem>
            </SelectContent>
          </Select>
          
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

      {/* إحصائيات الدرجات */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.average}%</div>
                <div className="text-sm text-muted-foreground">المعدل العام</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.passRate}%</div>
                <div className="text-sm text-muted-foreground">نسبة النجاح</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* معلومات تفصيلية */}
      <div className="grid grid-cols-4 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-muted-foreground">إجمالي الطلاب</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-600">{stats.passed}</div>
            <div className="text-xs text-muted-foreground">ناجحين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-red-600">{stats.failed}</div>
            <div className="text-xs text-muted-foreground">راسبين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">معلق</div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الدرجات */}
      {selectedCourse ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              سجل الدرجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredGrades.map((student) => (
                <Card key={student.id} className="p-4">
                  <div className="space-y-3">
                    {/* معلومات الطالب */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{student.studentName}</div>
                        <div className="text-sm text-muted-foreground">{student.studentId}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getGradeColor(student.grade)}>
                          {student.grade}
                        </Badge>
                        <Badge variant={student.status === 'pass' ? 'default' : student.status === 'fail' ? 'destructive' : 'secondary'}>
                          {student.status === 'pass' ? 'ناجح' : student.status === 'fail' ? 'راسب' : 'معلق'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* الدرجات */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">منتصف الفصل (30%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={student.midterm || ''}
                          onChange={(e) => updateGrade(student.id, 'midterm', e.target.value ? Number(e.target.value) : null)}
                          className="mt-1"
                          placeholder="--"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">النهائي (40%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={student.final || ''}
                          onChange={(e) => updateGrade(student.id, 'final', e.target.value ? Number(e.target.value) : null)}
                          className="mt-1"
                          placeholder="--"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">الواجبات (20%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={student.assignments || ''}
                          onChange={(e) => updateGrade(student.id, 'assignments', e.target.value ? Number(e.target.value) : null)}
                          className="mt-1"
                          placeholder="--"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">الحضور (10%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={student.attendance || ''}
                          onChange={(e) => updateGrade(student.id, 'attendance', e.target.value ? Number(e.target.value) : null)}
                          className="mt-1"
                          placeholder="--"
                        />
                      </div>
                    </div>
                    
                    {/* الدرجة الإجمالية */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-medium">الدرجة الإجمالية:</span>
                      <div className="text-xl font-bold">
                        {student.total !== null ? `${student.total}%` : '--'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-semibold mb-2">اختر مقرراً لإدارة الدرجات</h3>
              <p className="text-muted-foreground">قم بتحديد المقرر أولاً لعرض سجل الدرجات</p>
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
              <span className="text-sm">تصدير النتائج</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Upload className="h-5 w-5" />
              <span className="text-sm">استيراد درجات</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">تقرير إحصائي</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Calculator className="h-5 w-5" />
              <span className="text-sm">حاسبة المعدل</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherGrades;