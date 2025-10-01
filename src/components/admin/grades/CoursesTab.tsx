import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Calendar,
  GraduationCap,
  ChevronRight,
  Plus,
  BarChart3,
  Award,
  Clock,
  Eye
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  course_code: string;
  course_name_ar: string;
  course_name_en?: string;
  credit_hours: number;
  department: string;
  academic_year: number;
  semester: number;
  enrolled_students?: number;
  average_grade?: number;
  completion_rate?: number;
}

interface CoursesTabProps {
  onViewCourse?: (courseId: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ onViewCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  // جلب بيانات المقررات مع إحصائياتها
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses-with-stats', searchTerm, selectedDepartment, selectedYear, selectedSemester],
    queryFn: async (): Promise<Course[]> => {
      let query = supabase
        .from('courses')
        .select(`
          id,
          course_code,
          course_name_ar,
          course_name_en,
          credit_hours,
          department,
          academic_year,
          semester
        `)
        .order('course_code');

      if (selectedDepartment !== 'all') {
        query = query.eq('department', selectedDepartment);
      }
      
      if (selectedYear !== 'all') {
        query = query.eq('academic_year', parseInt(selectedYear));
      }
      
      if (selectedSemester !== 'all') {
        query = query.eq('semester', parseInt(selectedSemester));
      }

      const { data: coursesData, error } = await query;
      if (error) throw error;

      // جلب إحصائيات لكل مقرر
      const coursesWithStats = await Promise.all(
        (coursesData || []).map(async (course) => {
          // عدد الطلاب المسجلين
          const { count: enrolledCount } = await supabase
            .from('grades')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          // متوسط الدرجات
          const { data: gradesData } = await supabase
            .from('grades')
            .select('total_grade, gpa_points')
            .eq('course_id', course.id)
            .not('total_grade', 'is', null);

          const validGrades = gradesData || [];
          const averageGrade = validGrades.length > 0 
            ? validGrades.reduce((sum, g) => sum + (g.total_grade || 0), 0) / validGrades.length 
            : 0;

          // معدل النجاح
          const passedCount = validGrades.filter(g => (g.gpa_points || 0) >= 1.0).length;
          const completionRate = validGrades.length > 0 
            ? (passedCount / validGrades.length) * 100 
            : 0;

          return {
            ...course,
            enrolled_students: enrolledCount || 0,
            average_grade: averageGrade,
            completion_rate: completionRate,
          };
        })
      );

      return coursesWithStats;
    },
    staleTime: 2 * 60 * 1000,
  });

  // فلترة المقررات حسب البحث
  const filteredCourses = courses.filter(course => {
    const searchMatch = !searchTerm || 
      course.course_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.course_name_en && course.course_name_en.toLowerCase().includes(searchTerm.toLowerCase()));

    return searchMatch;
  });

  const getGradeColor = (average: number) => {
    if (average >= 85) return 'text-green-600 bg-green-50';
    if (average >= 75) return 'text-blue-600 bg-blue-50';
    if (average >= 65) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-blue-600';
    if (rate >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

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

  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray h-4 w-4" />
          <Input
            placeholder="البحث في المقررات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                فلترة متقدمة
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">القسم</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقسام</SelectItem>
                      <SelectItem value="pharmacy">الصيدلة</SelectItem>
                      <SelectItem value="nursing">التمريض</SelectItem>
                      <SelectItem value="midwifery">القبالة</SelectItem>
                      <SelectItem value="it">تقنية المعلومات</SelectItem>
                      <SelectItem value="business">إدارة الأعمال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">السنة الأكاديمية</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع السنوات</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">الفصل الدراسي</label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفصل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفصول</SelectItem>
                      <SelectItem value="1">الفصل الأول</SelectItem>
                      <SelectItem value="2">الفصل الثاني</SelectItem>
                      <SelectItem value="3">الفصل الصيفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة مقرر
          </Button>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-university-blue" />
            <div className="text-2xl font-bold text-university-blue">
              {filteredCourses.length}
            </div>
            <div className="text-sm text-academic-gray">إجمالي المقررات</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {filteredCourses.reduce((sum, course) => sum + (course.enrolled_students || 0), 0)}
            </div>
            <div className="text-sm text-academic-gray">إجمالي المسجلين</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">
              {filteredCourses.length > 0 
                ? (filteredCourses.reduce((sum, course) => sum + (course.average_grade || 0), 0) / filteredCourses.length).toFixed(1)
                : '0'
              }
            </div>
            <div className="text-sm text-academic-gray">متوسط الدرجات</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">
              {filteredCourses.length > 0 
                ? (filteredCourses.reduce((sum, course) => sum + (course.completion_rate || 0), 0) / filteredCourses.length).toFixed(1)
                : '0'
              }%
            </div>
            <div className="text-sm text-academic-gray">معدل النجاح</div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة المقررات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-university-blue mb-1">
                    {course.course_name_ar}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-academic-gray">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.course_code}</span>
                    <Badge variant="outline" className="mr-2">
                      {course.credit_hours} ساعة
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewCourse?.(course.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* معلومات أساسية */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-university-blue" />
                  <span className="text-academic-gray">{course.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-university-blue" />
                  <span className="text-academic-gray">
                    {course.academic_year} - ف{course.semester}
                  </span>
                </div>
              </div>
              
              {/* الإحصائيات */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-university-blue" />
                  </div>
                  <div className="text-xl font-bold text-university-blue">
                    {course.enrolled_students || 0}
                  </div>
                  <div className="text-xs text-academic-gray">طالب</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="h-4 w-4 text-university-blue" />
                  </div>
                  <div className={`text-xl font-bold ${getGradeColor(course.average_grade || 0)}`}>
                    {(course.average_grade || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-academic-gray">متوسط</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BarChart3 className="h-4 w-4 text-university-blue" />
                  </div>
                  <div className={`text-xl font-bold ${getCompletionColor(course.completion_rate || 0)}`}>
                    {(course.completion_rate || 0).toFixed(0)}%
                  </div>
                  <div className="text-xs text-academic-gray">نجاح</div>
                </div>
              </div>
              
              {/* أزرار الإجراءات */}
              <div className="flex gap-2 pt-3">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onViewCourse?.(course.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  عرض التفاصيل
                </Button>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة درجة
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-academic-gray mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold mb-2">لا توجد مقررات</h3>
          <p className="text-academic-gray mb-4">
            {searchTerm 
              ? 'لم يتم العثور على مقررات تطابق البحث'
              : 'لم يتم إضافة أي مقررات بعد'
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة مقرر جديد
          </Button>
        </div>
      )}
    </div>
  );
};