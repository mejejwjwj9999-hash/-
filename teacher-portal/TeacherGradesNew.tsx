import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Award, 
  Users, 
  TrendingUp,
  Search,
  Plus,
  Edit,
  Save,
  Calculator,
  BarChart3,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { useTeacherGrades, useCreateGrade, useUpdateGrade, useGradeStatistics } from '@/hooks/useTeacherGrades';

interface TeacherGradesNewProps {
  onTabChange?: (tab: string) => void;
}

const TeacherGradesNew: React.FC<TeacherGradesNewProps> = ({ onTabChange }) => {
  const { data: courses = [] } = useTeacherCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [newGrade, setNewGrade] = useState({
    assessment_title: '',
    assessment_type: 'assignment' as const,
    max_score: 100,
    weight: 1.0,
    assessment_date: new Date().toISOString().split('T')[0]
  });

  const { data: grades = [] } = useTeacherGrades(selectedCourse);
  const { data: statistics } = useGradeStatistics(selectedCourse);
  const createGradeMutation = useCreateGrade();
  const updateGradeMutation = useUpdateGrade();

  const filteredGrades = grades.filter(grade => 
    (grade.student_profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     grade.student_profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     grade.student_profiles?.student_id?.includes(searchTerm)) &&
    (selectedAssessmentType === '' || grade.assessment_type === selectedAssessmentType)
  );

  const assessmentTypes = [
    { value: 'midterm', label: 'امتحان نصفي' },
    { value: 'final', label: 'امتحان نهائي' },
    { value: 'quiz', label: 'اختبار قصير' },
    { value: 'assignment', label: 'واجب' },
    { value: 'participation', label: 'مشاركة' },
    { value: 'project', label: 'مشروع' }
  ];

  const getAssessmentTypeLabel = (type: string) => {
    return assessmentTypes.find(t => t.value === type)?.label || type;
  };

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const handleCreateGrade = async () => {
    if (!selectedCourse) return;

    try {
      // هنا نحتاج إلى إنشاء درجات لجميع الطلاب المسجلين في المقرر
      // للتبسيط، سنضيف واجهة لإنشاء التقييم أولاً
      // يمكن تطوير هذا لاحقاً لإضافة درجات لجميع الطلاب تلقائياً
      
      setIsAddingGrade(false);
      setNewGrade({
        assessment_title: '',
        assessment_type: 'assignment',
        max_score: 100,
        weight: 1.0,
        assessment_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating grade:', error);
    }
  };

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* العنوان والإعدادات */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">إدارة الدرجات</h1>
          <Dialog open={isAddingGrade} onOpenChange={setIsAddingGrade}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={!selectedCourse}>
                <Plus className="h-4 w-4" />
                إضافة تقييم
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة تقييم جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="عنوان التقييم"
                  value={newGrade.assessment_title}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, assessment_title: e.target.value }))}
                />
                <Select 
                  value={newGrade.assessment_type} 
                  onValueChange={(value: any) => setNewGrade(prev => ({ ...prev, assessment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="الدرجة العظمى"
                    value={newGrade.max_score}
                    onChange={(e) => setNewGrade(prev => ({ ...prev, max_score: Number(e.target.value) }))}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="الوزن"
                    value={newGrade.weight}
                    onChange={(e) => setNewGrade(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  />
                </div>
                <Input
                  type="date"
                  value={newGrade.assessment_date}
                  onChange={(e) => setNewGrade(prev => ({ ...prev, assessment_date: e.target.value }))}
                />
                <Button onClick={handleCreateGrade} className="w-full">
                  إنشاء التقييم
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
          
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={selectedAssessmentType} onValueChange={setSelectedAssessmentType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأنواع</SelectItem>
                {assessmentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* إحصائيات المقرر */}
      {selectedCourse && statistics && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">{statistics.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">المتوسط العام</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">{statistics.passRate}%</div>
                  <div className="text-sm text-muted-foreground">نسبة النجاح</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* قائمة الدرجات */}
      {selectedCourse ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              سجل الدرجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredGrades.length > 0 ? (
              <div className="space-y-3">
                {filteredGrades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 border rounded-xl hover:border-university-blue/30 hover:bg-university-blue/5 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-university-blue/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-university-blue" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {grade.student_profiles?.first_name} {grade.student_profiles?.last_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {grade.student_profiles?.student_id}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-700">
                          {grade.assessment_title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getAssessmentTypeLabel(grade.assessment_type)}
                        </Badge>
                      </div>
                      
                      <div className="text-center">
                        {grade.score !== null ? (
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade.score, grade.max_score)}`}>
                            {grade.score}/{grade.max_score}
                          </div>
                        ) : (
                          <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-500">
                            لم يتم التقييم
                          </div>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-lg font-semibold mb-2">لا توجد درجات مسجلة</h3>
                <p className="text-muted-foreground">قم بإضافة تقييم جديد لبدء تسجيل الدرجات</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-semibold mb-2">اختر مقرراً لعرض الدرجات</h3>
              <p className="text-muted-foreground">قم بتحديد المقرر أولاً</p>
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
              <span className="text-sm">تصدير الدرجات</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Calculator className="h-5 w-5" />
              <span className="text-sm">حساب المعدلات</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">تقرير إحصائي</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Eye className="h-5 w-5" />
              <span className="text-sm">معاينة النتائج</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherGradesNew;