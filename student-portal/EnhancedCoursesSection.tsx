
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  Clock,
  GraduationCap,
  Calendar,
  MapPin,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useSchedule } from '@/hooks/useSchedule';

const EnhancedCoursesSection = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('all');
  
  // Use the centralized schedule hook
  const { data: schedule, isLoading: scheduleLoading, error: scheduleError } = useSchedule();

  // Fetch all available courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('course_code');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch enrolled courses for this student
  const { data: enrolledCourses, isLoading: enrolledLoading } = useQuery({
    queryKey: ['enrolled-courses', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select(`
          *,
          courses!grades_course_id_fkey (
            course_name_ar,
            course_code,
            credit_hours,
            course_name_en,
            description,
            college,
            department,
            prerequisites
          )
        `)
        .eq('student_id', profile.id)
        .eq('academic_year', profile.academic_year.toString())
        .eq('semester', profile.semester.toString())
        .in('status', ['enrolled', 'completed']);
      
      if (gradesError) throw gradesError;
      return gradesData || [];
    },
    enabled: !!profile?.id && !!profile?.academic_year && !!profile?.semester,
  });

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = !searchTerm || 
      course.course_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.course_name_en && course.course_name_en.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCollege = selectedCollege === 'all' || course.college === selectedCollege;

    const matchesYear = !course.academic_year || course.academic_year === profile?.academic_year;
    const matchesSemester = !course.semester || course.semester === profile?.semester;
    const matchesSpec = !course.specialization || (profile as any)?.specialization === course.specialization || (profile as any)?.department === course.specialization;
    
    return matchesSearch && matchesCollege && matchesYear && matchesSemester && matchesSpec;
  }) || [];

  const colleges = [...new Set(courses?.map(course => course.college) || [])];

  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  if (coursesLoading || enrolledLoading || scheduleLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-gray-600">جاري تحميل المقررات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          المقررات الدراسية
        </h1>
      </div>

      <Tabs defaultValue="my-courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-gray-100 p-1">
          <TabsTrigger value="my-courses" className="rounded-xl font-semibold">
            مقرراتي الحالية
          </TabsTrigger>
          <TabsTrigger value="all-courses" className="rounded-xl font-semibold">
            جميع المقررات
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-xl font-semibold">
            الجدول الدراسي
          </TabsTrigger>
        </TabsList>

        {/* My Current Courses */}
        <TabsContent value="my-courses" className="space-y-4">
          {enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="grid gap-4">
              {enrolledCourses.map((enrollment) => (
                <Card key={enrollment.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">
                              {enrollment.courses?.course_name_ar || 'اسم المقرر غير متوفر'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {enrollment.courses?.course_code || 'N/A'} • {enrollment.courses?.credit_hours || 0} ساعة معتمدة
                            </p>
                          </div>
                        </div>
                        
                        {enrollment.courses?.description && (
                          <p className="text-gray-600 text-sm mb-3 bg-gray-50 rounded-lg p-3">
                            {enrollment.courses.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {enrollment.courses?.college || 'غير محدد'}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {enrollment.courses?.department || 'غير محدد'}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {enrollment.academic_year} - الفصل {enrollment.semester}
                          </Badge>
                        </div>

                        {(enrollment.midterm_grade || enrollment.final_grade || enrollment.total_grade) && (
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border-l-4 border-green-400">
                            <h4 className="font-semibold text-green-800 mb-2">الدرجات:</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              {enrollment.midterm_grade && (
                                <div>
                                  <span className="text-green-700">النصفي: </span>
                                  <span className="font-bold text-green-800">{enrollment.midterm_grade}</span>
                                </div>
                              )}
                              {enrollment.final_grade && (
                                <div>
                                  <span className="text-green-700">النهائي: </span>
                                  <span className="font-bold text-green-800">{enrollment.final_grade}</span>
                                </div>
                              )}
                              {enrollment.total_grade && (
                                <div>
                                  <span className="text-green-700">الإجمالي: </span>
                                  <span className="font-bold text-green-800">{enrollment.total_grade}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Badge 
                        variant={enrollment.status === 'enrolled' ? 'default' : 'secondary'}
                        className={enrollment.status === 'enrolled' ? 'bg-green-500' : ''}
                      >
                        {enrollment.status === 'enrolled' ? 'مسجل' : 'مكتمل'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 border-dashed border-2">
              <CardContent>
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد مقررات مسجلة</h3>
                <p className="text-gray-500">لم يتم تسجيلك في أي مقررات للفصل الحالي</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* All Courses */}
        <TabsContent value="all-courses" className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="البحث في المقررات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 rounded-xl border-2 focus:border-primary/50"
                />
              </div>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="px-4 py-2 border-2 rounded-xl focus:outline-none focus:border-primary/50"
              >
                <option value="all">جميع الكليات</option>
                {colleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {course.course_name_ar}
                          </h3>
                          {course.course_name_en && (
                            <p className="text-gray-500 text-sm mb-2">{course.course_name_en}</p>
                          )}
                          <p className="text-sm font-medium text-primary">
                            {course.course_code}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-700">{course.credit_hours}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">ساعة معتمدة</p>
                        </div>
                      </div>
                      
                      {course.description && (
                        <p className="text-gray-600 text-sm mb-4 bg-gray-50 rounded-lg p-3">
                          {course.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {course.college}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {course.department}
                        </Badge>
                      </div>

                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
                          <h4 className="font-semibold text-amber-800 text-sm mb-1">المتطلبات السابقة:</h4>
                          <p className="text-amber-700 text-sm">{course.prerequisites.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Card className="text-center py-12 border-dashed border-2">
              <CardContent>
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-500">لم يتم العثور على مقررات تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Class Schedule */}
        <TabsContent value="schedule" className="space-y-4">
          {scheduleError ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">خطأ في تحميل الجدول</h3>
                <p className="text-red-700">حدث خطأ أثناء تحميل الجدول الدراسي.</p>
              </CardContent>
            </Card>
          ) : schedule && schedule.length > 0 ? (
            <div className="space-y-4">
              {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                const daySchedule = schedule.filter(item => item.day_of_week === dayIndex);
                
                if (daySchedule.length === 0) return null;
                
                return (
                  <Card key={dayIndex} className="border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-primary" />
                        {dayNames[dayIndex]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {daySchedule.map((classItem, index) => (
                        <div key={classItem.id} className={`p-4 ${index !== daySchedule.length - 1 ? 'border-b' : ''}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                              <Clock className="w-6 h-6 text-blue-700" />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 mb-1">
                                {classItem.courses?.course_name_ar || 'مقرر غير محدد'}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {classItem.instructor_name} • {classItem.courses?.course_code || 'N/A'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <Clock className="w-3 h-3 ml-1" />
                                  {classItem.start_time} - {classItem.end_time}
                                </Badge>
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  <MapPin className="w-3 h-3 ml-1" />
                                  {classItem.classroom}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {classItem.academic_year} - {classItem.semester}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-12 border-dashed border-2">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">لا يوجد جدول دراسي</h3>
                <p className="text-gray-500">لم يتم إعداد الجدول الدراسي للفصل الحالي</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCoursesSection;
