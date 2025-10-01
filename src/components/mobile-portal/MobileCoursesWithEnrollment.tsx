import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, User, Plus, ChevronLeft, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { useStudentEnrollments, useAvailableCoursesForEnrollment, useEnrollInCourse } from '@/hooks/useStudentEnrollments';
import { useAuth } from '@/components/auth/AuthProvider';
import { useGrades } from '@/hooks/useGrades';
import MobileCourseEnrollment from './MobileCourseEnrollment';

const MobileCoursesWithEnrollment = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const { profile } = useAuth();
  
  const { 
    data: enrollmentsData, 
    isLoading: enrollmentsLoading, 
    error: enrollmentsError 
  } = useStudentEnrollments();
  
  const { 
    data: availableCoursesData, 
    isLoading: availableLoading 
  } = useAvailableCoursesForEnrollment();

  const { data: gradesData } = useGrades();

  // Get enrolled courses with grades
  const enrolledCourses = enrollmentsData?.map(enrollment => {
    const courseGrades = gradesData?.filter(grade => grade.course_id === enrollment.course_id) || [];
    
    return {
      id: enrollment.courses?.id || '',
      name: enrollment.courses?.course_name_ar || enrollment.courses?.course_name_en || 'مقرر غير محدد',
      code: enrollment.courses?.course_code || '',
      instructor: 'غير محدد',
      credits: enrollment.courses?.credit_hours || 0,
      color: 'bg-blue-500',
      currentGrade: courseGrades.length > 0 ? courseGrades[0].total_grade || 0 : 0,
      status: 'enrolled',
      academic_year: enrollment.courses?.academic_year,
      semester: enrollment.courses?.semester,
      description: enrollment.courses?.description,
      enrollmentId: enrollment.id,
      enrollmentDate: enrollment.enrollment_date,
      grades: courseGrades
    };
  }) || [];

  const isLoading = enrollmentsLoading || availableLoading;
  const error = enrollmentsError;
  
  if (showEnrollment) {
    return <MobileCourseEnrollment />;
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>جاري تحميل المقررات...</span>
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
            <h3 className="font-medium text-red-800 mb-1">خطأ في تحميل المقررات</h3>
            <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="px-4 py-6" dir="rtl">
        {/* Course Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCourse(null)} 
            className="mb-4 pr-0"
          >
            ← العودة للمقررات
          </Button>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${selectedCourse.color} flex items-center justify-center`}>
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-800">{selectedCourse.name}</h1>
                  <p className="text-sm text-gray-600">{selectedCourse.code} • {selectedCourse.credits} ساعة معتمدة</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <User className="h-3 w-3" />
                    <span>{selectedCourse.instructor}</span>
                  </div>
                  {selectedCourse.enrollmentDate && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      مسجل في: {new Date(selectedCourse.enrollmentDate).toLocaleDateString('ar-SA')}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="info" className="text-xs">معلومات المقرر</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">التقدم</TabsTrigger>
          </TabsList>

          {/* Course Info Tab */}
          <TabsContent value="info" className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-3">تفاصيل المقرر</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رمز المقرر:</span>
                    <span className="font-medium">{selectedCourse.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الساعات المعتمدة:</span>
                    <span className="font-medium">{selectedCourse.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المدرس:</span>
                    <span className="font-medium">{selectedCourse.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">السنة الدراسية:</span>
                    <span className="font-medium">{selectedCourse.academic_year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفصل الدراسي:</span>
                    <span className="font-medium">{selectedCourse.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <Badge variant="default">
                      مسجل
                    </Badge>
                  </div>
                  {selectedCourse.description && (
                    <div>
                      <span className="text-gray-600 block mb-1">وصف المقرر:</span>
                      <p className="text-gray-800 text-sm leading-relaxed">{selectedCourse.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-3">التقدم الأكاديمي</h3>
                {selectedCourse.grades && selectedCourse.grades.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCourse.grades.map((grade: any) => (
                      <div key={grade.id} className="bg-gradient-to-l from-blue-50 to-white rounded-lg p-3 border">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {grade.midterm_grade && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">النصفي:</span>
                              <span className="font-bold text-blue-600">{grade.midterm_grade}</span>
                            </div>
                          )}
                          {grade.final_grade && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">النهائي:</span>
                              <span className="font-bold text-green-600">{grade.final_grade}</span>
                            </div>
                          )}
                          {grade.coursework_grade && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">الأعمال:</span>
                              <span className="font-bold text-purple-600">{grade.coursework_grade}</span>
                            </div>
                          )}
                          {grade.total_grade && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">الإجمالي:</span>
                              <span className="font-bold text-primary">{grade.total_grade}</span>
                            </div>
                          )}
                        </div>
                        {grade.letter_grade && (
                          <div className="mt-2 pt-2 border-t">
                            <Badge variant="outline" className="text-xs">
                              التقدير: {grade.letter_grade}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">لا توجد درجات متاحة بعد</p>
                    <p className="text-xs text-gray-400 mt-1">ستظهر الدرجات هنا عند توفرها</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4" dir="rtl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">مقرراتي الدراسية</h1>
        <p className="text-sm text-gray-600">المقررات المسجلة حالياً</p>
      </div>

      {/* Student Info */}
      {profile && (
        <Card className="border-0 shadow-sm bg-gradient-to-l from-primary/5 to-white mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mobile-auth-button rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{profile.full_name || 'الطالب'}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>السنة: {profile.academic_year} - الفصل: {profile.semester}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEnrollment(true)}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                تسجيل مقررات
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-0 shadow-sm bg-gradient-to-l from-blue-50 to-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {enrolledCourses.length}
            </div>
            <div className="text-xs text-gray-600">مقرر مسجل</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-l from-green-50 to-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {availableCoursesData?.length || 0}
            </div>
            <div className="text-xs text-gray-600">مقرر متاح</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      {enrolledCourses.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-gray-600 mb-2">لا توجد مقررات مسجلة</h3>
            <p className="text-sm text-gray-500 mb-4">ابدأ بتسجيل مقرراتك الدراسية</p>
            <Button 
              onClick={() => setShowEnrollment(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              تسجيل مقررات جديدة
            </Button>
          </CardContent>
        </Card>
      ) : (
        enrolledCourses.map(course => (
          <Card 
            key={course.id} 
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCourse(course)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl ${course.color} flex items-center justify-center`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-800">{course.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                      <span>{course.code}</span>
                      <span>•</span>
                      <span>{course.credits} ساعة</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                      <User className="h-3 w-3" />
                      <span>{course.instructor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    مسجل
                  </Badge>
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MobileCoursesWithEnrollment;