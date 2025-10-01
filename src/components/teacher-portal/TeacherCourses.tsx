import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Calendar,
  Clock,
  Search,
  Plus,
  Upload,
  Eye,
  Settings,
  MoreVertical,
  Download
} from 'lucide-react';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';

interface TeacherCoursesProps {
  onTabChange?: (tab: string) => void;
}

const TeacherCourses: React.FC<TeacherCoursesProps> = ({ onTabChange }) => {
  const { data: courses = [] } = useTeacherCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const filteredCourses = courses.filter(course => 
    course.courses?.course_name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courses?.course_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mockCourseStats = (courseId: string) => ({
    totalStudents: Math.floor(Math.random() * 50) + 20,
    assignments: Math.floor(Math.random() * 8) + 3,
    materials: Math.floor(Math.random() * 15) + 5,
    completionRate: Math.floor(Math.random() * 30) + 70
  });

  return (
    <div className="space-y-6 pb-20" dir="rtl">
      {/* العنوان */}
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مقرراتي الدراسية</h1>
          <p className="text-sm text-gray-600">عرض وإدارة المقررات المخصصة لك</p>
        </div>
        
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في المقررات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 rounded-xl border-gray-200 focus:border-university-blue"
          />
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 gap-4">
        <div className="teacher-stat-card animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
              <div className="text-sm text-gray-600">المقررات المخصصة</div>
            </div>
          </div>
        </div>
        
        <div className="teacher-stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + (course.enrolled_students_count || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">إجمالي الطلاب</div>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المقررات */}
      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => {
            const stats = mockCourseStats(course.id);
            return (
              <div key={course.id} className="teacher-card animate-scale-in hover-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-university-blue to-university-blue-light rounded-xl flex items-center justify-center shadow-lg">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{course.courses?.course_name_ar || 'مقرر غير محدد'}</h3>
                          <p className="text-sm text-gray-600">{course.courses?.course_code}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{course.courses?.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant={course.is_active ? "default" : "secondary"}
                        className="rounded-full px-3 py-1"
                      >
                        {course.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* إحصائيات المقرر */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{stats.totalStudents}</div>
                      <div className="text-xs text-blue-500">طالب</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{stats.assignments}</div>
                      <div className="text-xs text-green-500">واجب</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{stats.materials}</div>
                      <div className="text-xs text-purple-500">مادة</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{stats.completionRate}%</div>
                      <div className="text-xs text-orange-500">إنجاز</div>
                    </div>
                  </div>
                  
                  {/* الإجراءات */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl border-gray-200 hover:border-university-blue hover:bg-university-blue/5">
                      <Eye className="h-4 w-4" />
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-xl border-gray-200 hover:border-green-500 hover:bg-green-50">
                      <Upload className="h-4 w-4" />
                      رفع مادة
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="teacher-card animate-fade-in">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">لم يتم تخصيص مقررات بعد</h3>
              <p className="text-gray-600 text-sm">سيتم عرض المقررات المخصصة لك من قبل الإدارة هنا</p>
            </div>
          </div>
        )}
      </div>

      {/* الإجراءات السريعة */}
      <div className="teacher-card animate-slide-in-right">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">الإجراءات المتاحة</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
              <Upload className="h-5 w-5" />
              <span className="text-sm">رفع مادة تعليمية</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300">
              <FileText className="h-5 w-5" />
              <span className="text-sm">إنشاء واجب</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
              <Download className="h-5 w-5" />
              <span className="text-sm">تصدير التقارير</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2 rounded-xl border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300">
              <Eye className="h-5 w-5" />
              <span className="text-sm">عرض التفاصيل</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourses;