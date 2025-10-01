import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, User, Clock, ChevronLeft, Plus, Loader2, AlertCircle, Award, TrendingUp, FileText, Upload, Calendar, ArrowLeft } from 'lucide-react';
import { useOptimizedStudentEnrollments, useOptimizedAvailableCoursesForEnrollment, useOptimizedEnrollInCourse } from '@/hooks/useOptimizedStudentEnrollments';
import { useAuth } from '@/components/auth/AuthProvider';
import { useGrades } from '@/hooks/useGrades';
import { useStudentAssignments } from '@/hooks/useAssignmentsManagement';
import { useStudentCourseFiles } from '@/hooks/useCourseFilesManagement';
import { EnrolledCourse } from '@/types/course';
import MobileAssignments from './MobileAssignments';
import MobileCourseFiles from './MobileCourseFiles';
import MobileCourseEnrollment from './MobileCourseEnrollment';

interface MobileCoursesProps {
  onBack?: () => void;
}

const MobileCourses = ({ onBack }: MobileCoursesProps) => {
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const [activeView, setActiveView] = useState<'courses' | 'assignments' | 'files' | 'enrollment'>('courses');
  const { profile } = useAuth();
  const { 
    data: enrolledCourses = [], 
    isLoading: enrollmentsLoading, 
    error: enrollmentsError 
  } = useOptimizedStudentEnrollments();
  
  const { 
    data: availableCoursesData = [], 
    isLoading: availableLoading 
  } = useOptimizedAvailableCoursesForEnrollment();
  
  const { data: courseAssignments = [] } = useStudentAssignments(selectedCourse?.id);
  const { data: courseFiles = [] } = useStudentCourseFiles(selectedCourse?.id);
  
  const enrollMutation = useOptimizedEnrollInCourse();

  const isLoading = enrollmentsLoading || availableLoading;
  const error = enrollmentsError;

  // Handle different views
  if (activeView === 'assignments') {
    return <MobileAssignments onBack={() => setActiveView('courses')} />;
  }

  if (activeView === 'files') {
    return <MobileCourseFiles onBack={() => setActiveView('courses')} />;
  }

  if (activeView === 'enrollment') {
    return <MobileCourseEnrollment onBack={() => setActiveView('courses')} />;
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-university-blue" />
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
          <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="mb-4 pr-0">
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة للمقررات
          </Button>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${selectedCourse.color} flex items-center justify-center`}>
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-800">{selectedCourse.course_name_ar}</h1>
                  <p className="text-sm text-gray-600">{selectedCourse.course_code} • {selectedCourse.credit_hours} ساعة معتمدة</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <User className="h-3 w-3" />
                    <span>{selectedCourse.instructor}</span>
                  </div>
                  {selectedCourse.currentGrade > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={
                          selectedCourse.currentGrade >= 85 ? 'border-green-500 text-green-700 bg-green-50' :
                          selectedCourse.currentGrade >= 75 ? 'border-blue-500 text-blue-700 bg-blue-50' :
                          selectedCourse.currentGrade >= 60 ? 'border-orange-500 text-orange-700 bg-orange-50' :
                          'border-red-500 text-red-700 bg-red-50'
                        }
                      >
                        الدرجة النهائية: {selectedCourse.currentGrade}%
                      </Badge>
                      <Badge 
                        variant={selectedCourse.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {selectedCourse.status === 'completed' ? 'مكتمل' : 'قيد الدراسة'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="info" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="info" className="text-xs">معلومات</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">التقدم</TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs">الواجبات</TabsTrigger>
            <TabsTrigger value="files" className="text-xs">الملفات</TabsTrigger>
          </TabsList>

          {/* Course Info Tab */}
          <TabsContent value="info" className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-3">تفاصيل المقرر</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رمز المقرر:</span>
                    <span className="font-medium">{selectedCourse.course_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الساعات المعتمدة:</span>
                    <span className="font-medium">{selectedCourse.credit_hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المدرس:</span>
                    <span className="font-medium">{selectedCourse.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <Badge variant={selectedCourse.status === 'enrolled' ? 'default' : 'secondary'}>
                      {selectedCourse.status === 'enrolled' ? 'مسجل' : 'قيد الدراسة'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-3">التقدم الأكاديمي</h3>
                {selectedCourse.currentGrade > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${
                        selectedCourse.currentGrade >= 85 ? 'text-green-600' :
                        selectedCourse.currentGrade >= 75 ? 'text-blue-600' :
                        selectedCourse.currentGrade >= 60 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {selectedCourse.currentGrade}%
                      </div>
                      <p className="text-sm text-gray-600 font-medium">الدرجة النهائية</p>
                      <Badge 
                        variant="outline"
                        className={`mt-2 ${
                          selectedCourse.currentGrade >= 90 ? 'border-green-500 text-green-700 bg-green-50' :
                          selectedCourse.currentGrade >= 80 ? 'border-blue-500 text-blue-700 bg-blue-50' :
                          selectedCourse.currentGrade >= 70 ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                          selectedCourse.currentGrade >= 60 ? 'border-orange-500 text-orange-700 bg-orange-50' :
                          'border-red-500 text-red-700 bg-red-50'
                        }`}
                      >
                        {selectedCourse.currentGrade >= 90 ? 'ممتاز' :
                         selectedCourse.currentGrade >= 80 ? 'جيد جداً' :
                         selectedCourse.currentGrade >= 70 ? 'جيد' :
                         selectedCourse.currentGrade >= 60 ? 'مقبول' : 'راسب'}
                      </Badge>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          selectedCourse.currentGrade >= 85 ? 'bg-green-500' :
                          selectedCourse.currentGrade >= 75 ? 'bg-blue-500' :
                          selectedCourse.currentGrade >= 60 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(selectedCourse.currentGrade, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Award className="h-5 w-5 text-university-blue" />
                      <span className="text-sm font-medium text-gray-700">
                        تم اكمال المقرر بنجاح
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium mb-2">المقرر قيد الدراسة</p>
                    <p className="text-xs text-gray-400">ستظهر الدرجات عند اكتمال التقييم</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-800">واجبات المقرر</h3>
                  <Badge variant="outline" className="text-xs">
                    {courseAssignments?.length || 0} واجب
                  </Badge>
                </div>
                
                {courseAssignments && courseAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {courseAssignments.slice(0, 3).map((assignment: any) => {
                      const isOverdue = new Date(assignment.due_date) < new Date();
                      const submission = assignment.assignment_submissions?.[0];
                      
                      return (
                        <div key={assignment.id} className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm text-gray-800">{assignment.title}</h4>
                            <Badge 
                              variant={submission ? 'default' : isOverdue ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {submission ? 'مُسلم' : isOverdue ? 'متأخر' : 'قيد التنفيذ'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(assignment.due_date).toLocaleDateString('ar-SA')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{assignment.max_grade || 100} درجة</span>
                            </div>
                          </div>
                          {submission?.grade && (
                            <div className="mt-2 pt-2 border-t">
                              <span className="text-xs text-green-600 font-medium">
                                الدرجة: {submission.grade} / {assignment.max_grade || 100}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setActiveView('assignments')}
                    >
                      عرض جميع الواجبات
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">لا توجد واجبات لهذا المقرر</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-800">ملفات المقرر</h3>
                  <Badge variant="outline" className="text-xs">
                    {courseFiles?.length || 0} ملف
                  </Badge>
                </div>
                
                {courseFiles && courseFiles.length > 0 ? (
                  <div className="space-y-2">
                    {courseFiles.slice(0, 5).map((file: any) => (
                      <div key={file.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-university-blue rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {file.file_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {file.category === 'lecture' ? 'محاضرة' : 
                             file.category === 'assignment' ? 'واجب' : 
                             file.category === 'reference' ? 'مرجع' : 'عام'} • 
                            {file.file_type.toUpperCase()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setActiveView('files')}
                    >
                      عرض جميع الملفات
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Upload className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs">لا توجد ملفات لهذا المقرر</p>
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
      {/* Header with Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">المقررات الدراسية</h1>
            <p className="text-sm text-gray-600">إدارة مقرراتك وواجباتك</p>
          </div>
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 ml-1" />
              العودة
            </Button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant={activeView === 'courses' ? 'default' : 'outline'}
            onClick={() => setActiveView('courses')}
            className="text-xs h-8"
          >
            <BookOpen className="h-3 w-3 ml-1" />
            مقرراتي
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveView('assignments')}
            className="text-xs h-8"
          >
            <FileText className="h-3 w-3 ml-1" />
            الواجبات
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveView('files')}
            className="text-xs h-8"
          >
            <Upload className="h-3 w-3 ml-1" />
            الملفات
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveView('enrollment')}
            className="text-xs h-8"
          >
            <Plus className="h-3 w-3 ml-1" />
            التسجيل
          </Button>
        </div>
      </div>

      {/* Student Progress Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="border-0 shadow-sm bg-gradient-to-l from-university-blue/10 to-white">
          <CardContent className="p-3 text-center">
            <BookOpen className="h-8 w-8 text-university-blue mx-auto mb-1" />
            <div className="text-lg font-bold text-university-blue">{enrolledCourses.length}</div>
            <div className="text-xs text-gray-600">مقرر مسجل</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-l from-green-500/10 to-white">
          <CardContent className="p-3 text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">
              {enrolledCourses.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">مكتمل</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm bg-gradient-to-l from-orange-500/10 to-white">
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-600">
              {enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}
            </div>
            <div className="text-xs text-gray-600">ساعة معتمدة</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      {enrolledCourses.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-gray-600 mb-2">لا توجد مقررات مسجلة</h3>
            <p className="text-sm text-gray-500 mb-4">ستظهر مقرراتك المسجلة هنا</p>
            <Button 
              variant="outline"
              onClick={() => setActiveView('enrollment')}
              className="text-xs"
            >
              <Plus className="h-3 w-3 ml-1" />
              سجّل في مقررات جديدة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {enrolledCourses.map((course, index) => (
            <Card 
              key={`course-${course.courseId}-${index}`} 
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
                    {course.currentGrade > 0 && (
                      <div className="text-center">
                        <p className="text-sm font-bold text-university-blue">{course.currentGrade}%</p>
                        <p className="text-xs text-gray-500">الدرجة</p>
                      </div>
                    )}
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileCourses;