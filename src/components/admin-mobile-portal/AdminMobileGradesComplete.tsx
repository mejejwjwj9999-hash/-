import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Users, 
  BookOpen,
  TrendingUp,
  Eye,
  BarChart3,
  Upload,
  Download,
  Award,
  AlertTriangle,
  Edit,
  Trash2,
  Filter,
  FileText,
  Calendar,
  Star
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGradeStatistics } from '@/hooks/useGradeStatistics';
import { AddGradeDialog } from '../admin/grades/AddGradeDialog';
import { GradeEditDialog } from '../admin/grades/GradeEditDialog';
import { BulkGradeImport } from '../admin/grades/BulkGradeImport';

const AdminMobileGradesComplete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const { toast } = useToast();

  // جلب الإحصائيات العامة
  const { data: quickStats } = useQuery({
    queryKey: ['admin-mobile-quick-stats'],
    queryFn: async () => {
      const { count: totalStudents } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });

      const { count: totalCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      const { count: totalGrades } = await supabase
        .from('grades')
        .select('*', { count: 'exact', head: true });

      // حساب معدل النجاح
      const { data: gradesData } = await supabase
        .from('grades')
        .select('gpa_points')
        .gte('gpa_points', 1.0);

      const { count: allGradesCount } = await supabase
        .from('grades')
        .select('*', { count: 'exact', head: true });

      const passRate = allGradesCount ? Math.round(((gradesData?.length || 0) / allGradesCount) * 100) : 0;

      return {
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        totalGrades: totalGrades || 0,
        passRate: passRate,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  // جلب قائمة الدرجات مع الفلترة
  const { data: gradesData, isLoading: gradesLoading } = useQuery({
    queryKey: ['filtered-grades', searchTerm, selectedStudent, selectedCourse, selectedSemester],
    queryFn: async () => {
      let query = supabase
        .from('grades')
        .select(`
          *,
          student_profiles!grades_student_id_fkey (
            id,
            student_id,
            first_name,
            last_name,
            email
          ),
          courses!grades_course_id_fkey (
            id,
            course_code,
            course_name_ar,
            credit_hours,
            department
          )
        `)
        .order('created_at', { ascending: false });

      // تطبيق الفلاتر
      if (selectedStudent) {
        query = query.eq('student_id', selectedStudent);
      }
      if (selectedCourse) {
        query = query.eq('course_id', selectedCourse);
      }
      if (selectedSemester) {
        query = query.eq('semester', selectedSemester);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      // فلترة بالبحث النصي
      if (searchTerm && data) {
        return data.filter(grade => 
          grade.student_profiles?.first_name?.includes(searchTerm) ||
          grade.student_profiles?.last_name?.includes(searchTerm) ||
          grade.student_profiles?.student_id?.includes(searchTerm) ||
          grade.courses?.course_code?.includes(searchTerm) ||
          grade.courses?.course_name_ar?.includes(searchTerm)
        );
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  // جلب قوائم الفلترة
  const { data: studentsOptions } = useQuery({
    queryKey: ['students-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, student_id, first_name, last_name')
        .order('first_name');
      if (error) throw error;
      return data;
    }
  });

  const { data: coursesOptions } = useQuery({
    queryKey: ['courses-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, course_code, course_name_ar')
        .order('course_code');
      if (error) throw error;
      return data;
    }
  });

  // استخدام هوك الإحصائيات المتقدمة
  const { data: gradeStatistics } = useGradeStatistics();

  return (
    <div className="space-y-4 p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="h-6 w-6 text-university-blue" />
          <h1 className="text-xl font-bold text-university-blue">إدارة الدرجات المتقدمة</h1>
        </div>
        <p className="text-sm text-academic-gray">
          نظام متكامل لإدارة ومتابعة درجات الطلاب مع جميع الوظائف المتقدمة
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="text-center">
          <CardContent className="p-3">
            <Users className="h-6 w-6 text-university-blue mx-auto mb-1" />
            <div className="text-lg font-bold text-university-blue">
              {quickStats?.totalStudents || 0}
            </div>
            <div className="text-xs text-academic-gray">الطلاب</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-3">
            <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">
              {quickStats?.totalCourses || 0}
            </div>
            <div className="text-xs text-academic-gray">المقررات</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-3">
            <GraduationCap className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600">
              {quickStats?.totalGrades || 0}
            </div>
            <div className="text-xs text-academic-gray">الدرجات</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-3">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-600">{quickStats?.passRate || 0}%</div>
            <div className="text-xs text-academic-gray">معدل النجاح</div>
          </CardContent>
        </Card>
      </div>

      {/* أزرار العمليات السريعة */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <AddGradeDialog onSuccess={() => {}} />
        <BulkGradeImport onSuccess={() => {}} />
      </div>

      {/* التبويبات الرئيسية */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">الإحصائيات</TabsTrigger>
          <TabsTrigger value="grades">الدرجات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        {/* تبويبة الإحصائيات */}
        <TabsContent value="overview" className="space-y-4">
          {gradeStatistics && (
            <>
              {/* إحصائيات عامة */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الإحصائيات العامة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{gradeStatistics.totalStudents}</div>
                      <div className="text-sm text-blue-700">إجمالي الطلاب</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{gradeStatistics.overallGPA.toFixed(2)}</div>
                      <div className="text-sm text-green-700">المعدل العام</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{gradeStatistics.passRate.toFixed(1)}%</div>
                    <div className="text-sm text-orange-700">معدل النجاح</div>
                  </div>
                </CardContent>
              </Card>

              {/* توزيع الدرجات */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">توزيع التقديرات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(gradeStatistics.gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{grade}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* تبويبة الدرجات */}
        <TabsContent value="grades" className="space-y-4">
          {/* أدوات البحث والفلترة */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                البحث والفلترة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في الأسماء أو المقررات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* الفلاتر */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طالب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الطلاب</SelectItem>
                    {studentsOptions?.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مقرر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع المقررات</SelectItem>
                    {coursesOptions?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.course_code} - {course.course_name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فصل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الفصول</SelectItem>
                    <SelectItem value="الأول">الفصل الأول</SelectItem>
                    <SelectItem value="الثاني">الفصل الثاني</SelectItem>
                    <SelectItem value="الصيفي">الفصل الصيفي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* إحصائيات البحث */}
              <div className="text-sm text-gray-600">
                عرض {gradesData?.length || 0} من النتائج
              </div>
            </CardContent>
          </Card>

          {/* قائمة الدرجات */}
          <div className="space-y-3">
            {gradesLoading ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-university-blue mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">جاري التحميل...</p>
                </CardContent>
              </Card>
            ) : gradesData?.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">لا توجد نتائج مطابقة للبحث</p>
                </CardContent>
              </Card>
            ) : (
              gradesData?.map((grade) => (
                <Card key={grade.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-university-blue">
                          {grade.student_profiles?.first_name} {grade.student_profiles?.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          رقم الطالب: {grade.student_profiles?.student_id}
                        </p>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-green-600">
                          {grade.total_grade}/100
                        </div>
                        <Badge variant={grade.gpa_points >= 2.0 ? "default" : "destructive"}>
                          {grade.letter_grade}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium text-gray-800">
                        {grade.courses?.course_code} - {grade.courses?.course_name_ar}
                      </p>
                      <p className="text-sm text-gray-600">
                        {grade.academic_year} - {grade.semester}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-bold text-blue-600">{grade.coursework_grade}</div>
                        <div className="text-xs">أعمال السنة</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-bold text-purple-600">{grade.midterm_grade}</div>
                        <div className="text-xs">النصفي</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-bold text-green-600">{grade.final_grade}</div>
                        <div className="text-xs">النهائي</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <GradeEditDialog grade={grade} onSuccess={() => {}} />
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" />
                        عرض
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* تبويبة التقارير */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                التقارير المتاحة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                تصدير جميع الدرجات (Excel)
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <BarChart3 className="h-4 w-4" />
                تقرير الإحصائيات التفصيلي
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Calendar className="h-4 w-4" />
                تقرير الأداء الفصلي
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Award className="h-4 w-4" />
                قائمة المتفوقين
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMobileGradesComplete;