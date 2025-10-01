
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, TrendingUp, Award, BarChart3, Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface GradeData {
  id: string;
  course: {
    course_name_ar: string;
    course_name_en: string;
    course_code: string;
    credit_hours: number;
  };
  midterm_grade?: number;
  final_grade?: number;
  coursework_grade?: number;
  total_grade?: number;
  letter_grade?: string;
  gpa_points?: number;
  status: string;
  academic_year: string;
  semester: string;
}

interface GradeSummary {
  totalCourses: number;
  completedCourses: number;
  currentGPA: number;
  cumulativeGPA: number;
  totalCredits: number;
  completedCredits: number;
}

const EnhancedGradesSection = () => {
  const { profile } = useAuth();
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [gradeSummary, setGradeSummary] = useState<GradeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    const fetchGrades = async () => {
      if (!profile?.id) return;

      setIsLoading(true);
      try {
        const { data: gradesData, error } = await supabase
          .from('grades')
          .select(`
            *,
            courses!grades_course_id_fkey (
              course_name_ar,
              course_name_en,
              course_code,
              credit_hours
            )
          `)
          .eq('student_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedGrades: GradeData[] = gradesData?.map(grade => ({
          id: grade.id,
          course: {
            course_name_ar: grade.courses?.course_name_ar || 'مقرر غير محدد',
            course_name_en: grade.courses?.course_name_en || '',
            course_code: grade.courses?.course_code || '',
            credit_hours: grade.courses?.credit_hours || 0
          },
          midterm_grade: grade.midterm_grade,
          final_grade: grade.final_grade,
          coursework_grade: grade.coursework_grade,
          total_grade: grade.total_grade,
          letter_grade: grade.letter_grade,
          gpa_points: grade.gpa_points,
          status: grade.status,
          academic_year: grade.academic_year,
          semester: grade.semester
        })) || [];

        setGrades(formattedGrades);

        // حساب ملخص الدرجات
        const completedGrades = formattedGrades.filter(g => g.status === 'completed' && g.total_grade);
        const currentSemesterGrades = formattedGrades.filter(g => 
          g.academic_year === profile.academic_year.toString() && 
          g.semester === profile.semester.toString()
        );

        let totalGpaPoints = 0;
        let totalCreditHours = 0;
        let currentSemesterGpaPoints = 0;
        let currentSemesterCreditHours = 0;

        completedGrades.forEach(grade => {
          if (grade.gpa_points && grade.course.credit_hours) {
            totalGpaPoints += grade.gpa_points * grade.course.credit_hours;
            totalCreditHours += grade.course.credit_hours;
          }
        });

        currentSemesterGrades.forEach(grade => {
          if (grade.gpa_points && grade.course.credit_hours && grade.status === 'completed') {
            currentSemesterGpaPoints += grade.gpa_points * grade.course.credit_hours;
            currentSemesterCreditHours += grade.course.credit_hours;
          }
        });

        const completedCredits = completedGrades.reduce((sum, grade) => sum + grade.course.credit_hours, 0);
        const totalCredits = formattedGrades.reduce((sum, grade) => sum + grade.course.credit_hours, 0);

        setGradeSummary({
          totalCourses: formattedGrades.length,
          completedCourses: completedGrades.length,
          currentGPA: currentSemesterCreditHours > 0 ? currentSemesterGpaPoints / currentSemesterCreditHours : 0,
          cumulativeGPA: totalCreditHours > 0 ? totalGpaPoints / totalCreditHours : 0,
          totalCredits,
          completedCredits
        });

      } catch (error) {
        console.error('Error fetching grades:', error);
        setGrades([]);
        setGradeSummary({
          totalCourses: 0,
          completedCourses: 0,
          currentGPA: 0,
          cumulativeGPA: 0,
          totalCredits: 0,
          completedCredits: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, [profile?.id]);

  const filteredGrades = selectedSemester === 'all' 
    ? grades 
    : grades.filter(grade => 
        grade.academic_year === profile?.academic_year.toString() && 
        grade.semester === selectedSemester
      );

  const getGradeColor = (grade?: number) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    if (grade >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'enrolled':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'enrolled':
        return 'مسجل';
      case 'failed':
        return 'راسب';
      default:
        return 'غير محدد';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">جاري تحميل الدرجات...</p>
            </div>
          </div>
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
                  <TrendingUp className="h-8 w-8" />
                  الدرجات والنتائج
                </h1>
                <p className="text-white/90 text-lg">
                  متابعة الأداء الأكاديمي والدرجات
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Summary */}
        {gradeSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">المعدل التراكمي</p>
                    <p className="text-3xl font-bold">{gradeSummary.cumulativeGPA.toFixed(2)}</p>
                  </div>
                  <Award className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">معدل الفصل الحالي</p>
                    <p className="text-3xl font-bold">{gradeSummary.currentGPA.toFixed(2)}</p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">الساعات المكتملة</p>
                    <p className="text-3xl font-bold">{gradeSummary.completedCredits}</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">المقررات المكتملة</p>
                    <p className="text-3xl font-bold">{gradeSummary.completedCourses}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grades Table */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                تفاصيل الدرجات
              </CardTitle>
              <div className="flex gap-2">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">جميع الفصول</option>
                  <option value="1">الفصل الأول</option>
                  <option value="2">الفصل الثاني</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredGrades.length > 0 ? (
              <div className="space-y-4">
                {filteredGrades.map((grade) => (
                  <Card key={grade.id} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-primary mb-1">
                            {grade.course.course_name_ar}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {grade.course.course_code} • {grade.course.credit_hours} ساعة معتمدة
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(grade.status)}>
                              {getStatusText(grade.status)}
                            </Badge>
                            <Badge variant="outline">
                              {grade.academic_year} - الفصل {grade.semester}
                            </Badge>
                          </div>
                        </div>
                        
                        {grade.total_grade && (
                          <div className="text-center">
                            <div className={`text-3xl font-bold px-4 py-2 rounded-xl ${getGradeColor(grade.total_grade)}`}>
                              {grade.total_grade}
                            </div>
                            {grade.letter_grade && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {grade.letter_grade}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {(grade.midterm_grade || grade.final_grade || grade.coursework_grade) && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          {grade.midterm_grade && (
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">أعمال السنة</div>
                              <div className={`text-lg font-semibold px-3 py-1 rounded-lg ${getGradeColor(grade.midterm_grade)}`}>
                                {grade.midterm_grade}
                              </div>
                            </div>
                          )}
                          
                          {grade.coursework_grade && (
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">النصفي</div>
                              <div className={`text-lg font-semibold px-3 py-1 rounded-lg ${getGradeColor(grade.coursework_grade)}`}>
                                {grade.coursework_grade}
                              </div>
                            </div>
                          )}

                          {grade.final_grade && (
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">النهائي</div>
                              <div className={`text-lg font-semibold px-3 py-1 rounded-lg ${getGradeColor(grade.final_grade)}`}>
                                {grade.final_grade}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">لا توجد درجات لعرضها</h3>
                <p className="text-muted-foreground">
                  {selectedSemester === 'all' 
                    ? 'لم يتم إدخال أي درجات بعد' 
                    : 'لا توجد درجات للفصل المحدد'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedGradesSection;
