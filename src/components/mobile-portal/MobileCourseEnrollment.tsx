import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Loader2, AlertCircle, User, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAvailableCoursesForEnrollment, useEnrollInCourse, useStudentEnrollments } from '@/hooks/useStudentEnrollments';
import { useAuth } from '@/components/auth/AuthProvider';

interface MobileCourseEnrollmentProps {
  onBack?: () => void;
}

const MobileCourseEnrollment = ({ onBack }: MobileCourseEnrollmentProps) => {
  const { profile } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const { 
    data: availableCourses, 
    isLoading: availableLoading, 
    error: availableError 
  } = useAvailableCoursesForEnrollment();
  
  const { data: enrolledCourses } = useStudentEnrollments();
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollMutation.mutateAsync(courseId);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  if (availableLoading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>جاري تحميل المقررات المتاحة...</span>
        </div>
      </div>
    );
  }

  if (availableError) {
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
        <Button 
          variant="ghost" 
          onClick={() => setSelectedCourse(null)} 
          className="mb-4 pr-0"
        >
          <ArrowLeft className="h-4 w-4 ml-1" />
          العودة للمقررات
        </Button>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-mobile-auth-button flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-800">
                  {selectedCourse.course_name_ar || selectedCourse.course_name_en}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedCourse.course_code} • {selectedCourse.credit_hours} ساعة معتمدة
                </p>
                <Badge variant="outline" className="mt-2">
                  السنة {selectedCourse.academic_year} - الفصل {selectedCourse.semester}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">وصف المقرر</h3>
                <p className="text-sm text-gray-600">
                  {selectedCourse.description || 'لا يوجد وصف متاح لهذا المقرر'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">الساعات المعتمدة</p>
                  <p className="font-semibold">{selectedCourse.credit_hours}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">القسم</p>
                  <p className="font-semibold text-xs">{selectedCourse.department}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleEnroll(selectedCourse.id)}
              disabled={enrollMutation.isPending}
              className="w-full"
              size="lg"
            >
              {enrollMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري التسجيل...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 ml-2" />
                  تسجيل في المقرر
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">تسجيل المقررات</h1>
          <p className="text-sm text-gray-600">المقررات المتاحة للتسجيل هذا الفصل</p>
        </div>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة
          </Button>
        )}
      </div>

      {/* Student Info */}
      <Card className="border-0 shadow-md bg-gradient-to-l from-primary/10 to-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-800">
                {profile?.first_name} {profile?.last_name}
              </h3>
              <p className="text-sm text-gray-600">
                {profile?.department} • السنة {profile?.academic_year} • الفصل {profile?.semester}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Enrollments Summary */}
      {enrolledCourses && enrolledCourses.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">مسجل في {enrolledCourses.length} مقررات</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {enrolledCourses.reduce((sum, e) => sum + (e.courses?.credit_hours || 0), 0)} ساعة
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Courses */}
      {!availableCourses || availableCourses.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-gray-600 mb-2">لا توجد مقررات متاحة</h3>
            <p className="text-sm text-gray-500">
              لا توجد مقررات متاحة للتسجيل في قسمك وبرنامجك الحالي
            </p>
            <p className="text-xs text-gray-400 mt-2">
              القسم: {profile?.department} • البرنامج: {profile?.program_id} • السنة: {profile?.academic_year}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">المقررات المتاحة</h3>
            <Badge variant="secondary" className="text-xs">
              {availableCourses.length} مقرر
            </Badge>
          </div>
          
          {availableCourses.map((course) => (
            <Card 
              key={course.id} 
              className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCourse(course)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-mobile-auth-button flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-800">
                        {course.course_name_ar || course.course_name_en}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                        <span>{course.course_code}</span>
                        <span>•</span>
                        <span>{course.credit_hours} ساعة</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          السنة {course.academic_year}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          الفصل {course.semester}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
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

export default MobileCourseEnrollment;