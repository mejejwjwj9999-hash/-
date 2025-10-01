
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useGrades } from '@/hooks/useGrades';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const MobileGrades = () => {
  const { data: grades, isLoading, error } = useGrades();
  const [openSemesters, setOpenSemesters] = useState<Record<string, boolean>>({});

  // حساب المعدل التراكمي
  const completedGrades = grades?.filter(g => g.status === 'completed' && g.gpa_points) || [];
  const gpa = completedGrades.length > 0 ? 
    completedGrades.reduce((sum, grade) => sum + (grade.gpa_points || 0), 0) / completedGrades.length : 0;

  // تجميع الدرجات حسب الفصل الدراسي
  const gradesBySemester = grades?.reduce((acc, grade) => {
    const semesterKey = `${grade.academic_year}-${grade.semester}`;
    const semesterName = `السنة ${grade.academic_year} - الفصل ${grade.semester}`;
    
    if (!acc[semesterKey]) {
      acc[semesterKey] = {
        name: semesterName,
        grades: [],
        gpa: 0,
        totalCredits: 0
      };
    }
    
    acc[semesterKey].grades.push(grade);
    return acc;
  }, {} as Record<string, any>) || {};

  // حساب معدل كل فصل
  Object.keys(gradesBySemester).forEach(semesterKey => {
    const semester = gradesBySemester[semesterKey];
    const completedCourses = semester.grades.filter((g: any) => g.status === 'completed' && g.gpa_points);
    semester.gpa = completedCourses.length > 0 ? 
      completedCourses.reduce((sum: number, grade: any) => sum + (grade.gpa_points || 0), 0) / completedCourses.length : 0;
    semester.totalCredits = semester.grades.reduce((sum: number, grade: any) => sum + (grade.courses?.credit_hours || 0), 0);
  });

  const toggleSemester = (semesterKey: string) => {
    setOpenSemesters(prev => ({
      ...prev,
      [semesterKey]: !prev[semesterKey]
    }));
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 95) return 'text-green-600 bg-green-50';
    if (grade >= 90) return 'text-blue-600 bg-blue-50';
    if (grade >= 85) return 'text-purple-600 bg-purple-50';
    if (grade >= 80) return 'text-orange-600 bg-orange-50';
    if (grade >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getLetterGrade = (grade: number) => {
    if (grade >= 95) return 'A+';
    if (grade >= 90) return 'A';
    if (grade >= 85) return 'B+';
    if (grade >= 80) return 'B';
    if (grade >= 75) return 'C+';
    if (grade >= 70) return 'C';
    if (grade >= 65) return 'D+';
    if (grade >= 60) return 'D';
    return 'F';
  };

  if (isLoading) {
    return (
      <div className="px-3 py-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-university-blue" />
          <span>جاري تحميل الدرجات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <Card className="border-0 shadow-md bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-3 text-red-300" />
            <h3 className="font-medium text-red-800 mb-1">خطأ في تحميل الدرجات</h3>
            <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 space-y-3">
      {/* رأس الصفحة */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-1">الدرجات والتقييمات</h1>
        <p className="text-sm text-gray-600">متابعة الأداء الأكاديمي والدرجات</p>
      </div>

      {/* بطاقة المعدل التراكمي */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-university-blue to-university-blue-dark text-white">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-6 w-6" />
                <span className="text-sm opacity-90">المعدل التراكمي</span>
              </div>
              <div className="text-4xl font-bold mb-1">{gpa.toFixed(2)}</div>
              <div className="flex items-center gap-2 text-sm opacity-75">
                <TrendingUp className="h-4 w-4" />
                <span>في تحسن مستمر</span>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="h-10 w-10" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-75">التقدير العام</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {gpa >= 3.7 ? 'ممتاز' : gpa >= 3.0 ? 'جيد جداً' : gpa >= 2.0 ? 'جيد' : 'مقبول'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الفصول الدراسية */}
      <div className="space-y-2">
        {Object.entries(gradesBySemester).map(([semesterKey, semester]) => (
          <Card key={semesterKey} className="border-0 shadow-sm">
            <Collapsible
              open={openSemesters[semesterKey]}
              onOpenChange={() => toggleSemester(semesterKey)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base text-gray-800">{semester.name}</CardTitle>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          {semester.grades.length} مقرر
                        </span>
                        <span className="text-sm font-medium text-university-blue">
                          المعدل: {semester.gpa.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {semester.totalCredits} ساعة
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${semester.gpa >= 3.5 ? 'border-green-200 bg-green-50 text-green-700' : 
                                   semester.gpa >= 3.0 ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                   'border-gray-200 bg-gray-50 text-gray-700'}`}
                      >
                        {semester.gpa >= 3.5 ? 'ممتاز' : semester.gpa >= 3.0 ? 'جيد جداً' : 'جيد'}
                      </Badge>
                      {openSemesters[semesterKey] ? 
                        <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      }
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-2">
                  {semester.grades.map((grade: any) => (
                    <div key={grade.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">
                            {grade.courses?.course_name_ar || grade.courses?.course_name_en}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                            <span>{grade.courses?.course_code}</span>
                            <span>{grade.courses?.credit_hours} ساعة</span>
                            <Badge 
                              variant="outline" 
                              className={grade.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}
                            >
                              {grade.status === 'completed' ? 'مكتمل' : 'مسجل'}
                            </Badge>
                          </div>
                        </div>
                        
                        {grade.total_grade && (
                          <div className="text-center min-w-0">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getGradeColor(grade.total_grade)} mb-2`}>
                              <div className="text-center">
                                <div className="text-lg font-bold">{grade.total_grade}</div>
                                <div className="text-xs">{getLetterGrade(grade.total_grade)}</div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {grade.gpa_points?.toFixed(1)} نقطة
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
        
        {Object.keys(gradesBySemester).length === 0 && (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-3 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-600 mb-2">لا توجد درجات</h3>
              <p className="text-sm text-gray-500">
                ستظهر درجاتك هنا بمجرد إدخالها من قبل الأساتذة
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MobileGrades;
