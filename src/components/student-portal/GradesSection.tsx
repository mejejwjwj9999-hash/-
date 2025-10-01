import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  TrendingUp, 
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const GradesSection = () => {
  const { profile } = useAuth();

  // Fetch grades data
  const { data: gradesData, isLoading } = useQuery({
    queryKey: ['grades', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      const { data, error } = await supabase
        .from('grades')
        .select('*, courses!inner(*)')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching grades:', error);
        throw error;
      }

      // Calculate statistics  
      const completedGrades = data?.filter(grade => grade.status === 'مكتملة') || [];
      const totalCreditHours = completedGrades.reduce((sum: number, grade: any) => 
        sum + (grade.courses?.credit_hours || 0), 0
      );
      const weightedGPA = completedGrades.reduce((sum: number, grade: any) => 
        sum + (grade.gpa_points || 0) * (grade.courses?.credit_hours || 0), 0
      );
      const gpa = totalCreditHours > 0 ? Math.round((weightedGPA / totalCreditHours) * 100) / 100 : 0;

      const gradeDistribution = completedGrades.reduce((acc: any, grade) => {
        const letter = grade.letter_grade || 'غير محدد';
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
      }, {});

      return {
        grades: data || [],
        gpa,
        totalCreditHours,
        completedCourses: completedGrades.length,
        gradeDistribution
      };
    },
    enabled: !!profile?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-academic-gray-light rounded w-48"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-academic-gray-light rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': case 'A+': return 'bg-green-100 text-green-800 border-green-300';
      case 'A-': case 'B+': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'B': case 'B-': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'C+': case 'C': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-section-title">الدرجات والتقييمات</h2>
        <Badge variant="outline" className="text-sm">
          الفصل الأول 2024-2025
        </Badge>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-university-blue to-university-blue-dark text-white">
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{gradesData?.gpa.toFixed(2) || '0.00'}</div>
            <div className="text-sm opacity-90">المعدل التراكمي</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-university-blue">
              {gradesData?.totalCreditHours || 0}
            </div>
            <div className="text-sm text-academic-gray">الساعات المكتسبة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-university-blue">
              {gradesData?.completedCourses || 0}
            </div>
            <div className="text-sm text-academic-gray">المواد المكتملة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-university-blue">
              {gradesData?.grades?.filter((g: any) => g.status === 'مسجلة').length || 0}
            </div>
            <div className="text-sm text-academic-gray">المواد الحالية</div>
          </CardContent>
        </Card>
      </div>

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-university-blue" />
            تفاصيل الدرجات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gradesData?.grades.map((grade: any) => (
            <Card key={grade.id} className="border-r-4 border-r-university-blue">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-university-blue">
                      {grade.courses?.course_name_ar}
                    </h3>
                    <p className="text-sm text-academic-gray">
                      {grade.courses?.course_code} - {grade.courses?.credit_hours} ساعة معتمدة
                    </p>
                    <p className="text-xs text-academic-gray mt-1">
                      {grade.semester} - {grade.academic_year}
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Grade Breakdown */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-academic-gray">نصفي</div>
                        <div className="font-semibold text-university-blue">
                          {grade.midterm_grade || '-'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-academic-gray">أعمال</div>
                        <div className="font-semibold text-university-blue">
                          {grade.coursework_grade || '-'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-academic-gray">نهائي</div>
                        <div className="font-semibold text-university-blue">
                          {grade.final_grade || '-'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Final Grade */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-university-blue">
                          {grade.total_grade?.toFixed(1) || '-'}
                        </div>
                        <div className="text-xs text-academic-gray">
                          {grade.gpa_points} نقاط
                        </div>
                      </div>
                      <Badge 
                        className={`${getGradeColor(grade.letter_grade)} border`}
                      >
                        {grade.letter_grade || 'غير محدد'}
                      </Badge>
                    </div>
                    
                    {/* Status */}
                    <Badge 
                      variant={grade.status === 'مكتملة' ? 'default' : 'secondary'}
                      className="whitespace-nowrap"
                    >
                      {grade.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!gradesData?.grades || gradesData.grades.length === 0) && (
            <div className="text-center py-8">
              <GraduationCap className="h-16 w-16 text-academic-gray mx-auto mb-4" />
              <p className="text-lg text-academic-gray">لا توجد درجات مسجلة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      {gradesData?.gradeDistribution && Object.keys(gradesData.gradeDistribution).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-university-blue" />
              توزيع الدرجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(gradesData.gradeDistribution).map(([grade, count]: [string, any]) => (
                <div key={grade} className="text-center p-3 bg-academic-gray-light rounded-lg">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getGradeColor(grade)}`}>
                    {grade}
                  </div>
                  <div className="text-lg font-bold text-university-blue">{count}</div>
                  <div className="text-xs text-academic-gray">
                    {Math.round((count / gradesData.completedCourses) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GradesSection;