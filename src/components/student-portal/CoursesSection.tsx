
import React, { useState } from 'react';
import { useStudentAvailableCourses } from '@/hooks/useStudentCourses';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, 
  Search, 
  Filter, 
  RefreshCw, 
  Clock, 
  GraduationCap,
  Book,
  Award,
  Users
} from 'lucide-react';

type Course = {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  credit_hours: number;
  department: string;
  college: string;
  description?: string;
  prerequisites?: string[];
  instructor?: string;
  academic_year?: number;
  semester?: number;
  max_students?: number;
  created_at: string;
};

const CoursesSection = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

  const { data: courses, isLoading, refetch } = useStudentAvailableCourses();

  // فلترة المقررات
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = !searchTerm || 
      course.course_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.course_name_en && course.course_name_en.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = departmentFilter === 'all' || course.department === departmentFilter;
    const matchesCollege = collegeFilter === 'all' || course.college === collegeFilter;
    const matchesYear = yearFilter === 'all' || course.academic_year?.toString() === yearFilter;
    const matchesSemester = semesterFilter === 'all' || course.semester?.toString() === semesterFilter;
    
    return matchesSearch && matchesDepartment && matchesCollege && matchesYear && matchesSemester;
  }) || [];

  // استخراج القوائم الفريدة للفلترة
  const departments = Array.from(new Set(courses?.map(c => c.department) || []));
  const colleges = Array.from(new Set(courses?.map(c => c.college) || []));
  const academicYears = Array.from(new Set(courses?.map(c => c.academic_year?.toString()).filter(Boolean) || []));
  const semesters = Array.from(new Set(courses?.map(c => c.semester?.toString()).filter(Boolean) || []));

  // إحصائيات
  const stats = {
    total: filteredCourses.length,
    creditHours: filteredCourses.reduce((sum, course) => sum + course.credit_hours, 0),
    departments: new Set(filteredCourses.map(c => c.department)).size,
    colleges: new Set(filteredCourses.map(c => c.college)).size,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <RefreshCw className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">جاري تحميل المقررات</h3>
              <p className="text-muted-foreground">يرجى الانتظار بينما نحضر قائمة المقررات...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان والأدوات */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">المقررات الدراسية</h1>
            <p className="text-muted-foreground">استعرض المقررات المخصصة لتخصصك</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المقررات</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الساعات المعتمدة</p>
                <p className="text-2xl font-bold text-green-600">{stats.creditHours}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الأقسام</p>
                <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الكليات</p>
                <p className="text-2xl font-bold text-orange-600">{stats.colleges}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو رمز المقرر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة بالكلية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الكليات</SelectItem>
                {colleges.map((college) => (
                  <SelectItem key={college} value={college}>
                    {college}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة بالقسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="السنة الدراسية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع السنوات</SelectItem>
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    السنة {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الفصل الدراسي" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفصول</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester === '1' ? 'الفصل الأول' : 
                     semester === '2' ? 'الفصل الثاني' : 
                     semester === '3' ? 'الفصل الصيفي' : `الفصل ${semester}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المقررات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المقررات ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-600">
                    {courses?.length === 0 ? 'لا توجد مقررات' : 'لا توجد نتائج'}
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    {courses?.length === 0 
                      ? 'لم يتم إضافة أي مقررات إلى النظام بعد.' 
                      : 'لا توجد مقررات تطابق معايير البحث المحددة. جرب تغيير الفلاتر.'
                    }
                  </p>
                </div>
                <Button onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* رأس المقرر */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="font-mono text-primary">
                            {course.course_code}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.credit_hours} ساعة
                          </Badge>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">
                          {course.course_name_ar}
                        </h3>
                        {course.course_name_en && (
                          <p className="text-sm text-gray-600 italic">
                            {course.course_name_en}
                          </p>
                        )}
                      </div>

                      {/* معلومات القسم والكلية والسنة */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{course.college}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{course.department}</span>
                        </div>
                        {course.academic_year && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Book className="h-4 w-4 text-gray-400" />
                            <span>السنة {course.academic_year} - {
                              course.semester === 1 ? 'الفصل الأول' : 
                              course.semester === 2 ? 'الفصل الثاني' : 
                              course.semester === 3 ? 'الفصل الصيفي' : `الفصل ${course.semester}`
                            }</span>
                          </div>
                        )}
                        {course.instructor && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>المدرس: {course.instructor}</span>
                          </div>
                        )}
                      </div>

                      {/* وصف المقرر */}
                      {course.description && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">وصف المقرر</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {course.description}
                          </p>
                        </div>
                      )}

                      {/* المتطلبات السابقة */}
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">المتطلبات السابقة</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {course.prerequisites.map((prereq, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* أزرار الإجراءات */}
                      <div className="pt-2 border-t">
                        <Button className="w-full" size="sm">
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesSection;
