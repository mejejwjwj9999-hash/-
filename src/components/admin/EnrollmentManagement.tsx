import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Search, 
  Filter, 
  UserPlus, 
  UserMinus,
  Calendar,
  GraduationCap,
  Building,
  Eye
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const EnrollmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  // Get all enrollments with student and course details
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['all-enrollments', selectedDepartment, selectedProgram, selectedYear, selectedSemester],
    queryFn: async () => {
      let query = supabase
        .from('student_enrollments')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });

      if (selectedYear !== 'all') {
        query = query.eq('academic_year', parseInt(selectedYear));
      }
      if (selectedSemester !== 'all') {
        query = query.eq('semester', parseInt(selectedSemester));
      }

      const { data: enrollmentData, error: enrollmentError } = await query;
      
      if (enrollmentError) throw enrollmentError;

      if (!enrollmentData || enrollmentData.length === 0) return [];

      // Get student details
      const studentIds = [...new Set(enrollmentData.map(e => e.student_id))];
      const { data: students } = await supabase
        .from('student_profiles')
        .select('*')
        .in('id', studentIds);

      // Get course details
      const courseIds = [...new Set(enrollmentData.map(e => e.course_id))];
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds);

      // Combine data
      const enrichedEnrollments = enrollmentData.map(enrollment => {
        const student = students?.find(s => s.id === enrollment.student_id);
        const course = courses?.find(c => c.id === enrollment.course_id);
        
        return {
          ...enrollment,
          student,
          course
        };
      });

      // Apply additional filters
      let filteredEnrollments = enrichedEnrollments;

      if (selectedDepartment !== 'all') {
        filteredEnrollments = filteredEnrollments.filter(e => 
          e.student?.department_id === selectedDepartment
        );
      }

      if (selectedProgram !== 'all') {
        filteredEnrollments = filteredEnrollments.filter(e => 
          e.student?.program_id === selectedProgram
        );
      }

      if (searchTerm) {
        filteredEnrollments = filteredEnrollments.filter(e => 
          e.student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.course?.course_name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.course?.course_code?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredEnrollments;
    },
  });

  // Get enrollment statistics
  const { data: stats } = useQuery({
    queryKey: ['enrollment-stats'],
    queryFn: async () => {
      const { data: totalEnrollments } = await supabase
        .from('student_enrollments')
        .select('id', { count: 'exact' })
        .eq('status', 'enrolled');

      const { data: totalStudents } = await supabase
        .from('student_profiles')
        .select('id', { count: 'exact' });

      const { data: totalCourses } = await supabase
        .from('courses')
        .select('id', { count: 'exact' });

      const { data: recentEnrollments } = await supabase
        .from('student_enrollments')
        .select('id', { count: 'exact' })
        .eq('status', 'enrolled')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      return {
        totalEnrollments: totalEnrollments?.length || 0,
        totalStudents: totalStudents?.length || 0,
        totalCourses: totalCourses?.length || 0,
        recentEnrollments: recentEnrollments?.length || 0
      };
    },
  });

  // Get departments for filter - using courses data
  const { data: departments } = useQuery({
    queryKey: ['departments-from-courses'],
    queryFn: async () => {
      const { data } = await supabase
        .from('courses')
        .select('department, college')
        .order('department');
      
      // Get unique departments
      const uniqueDepts = [...new Set(data?.map(c => c.department).filter(Boolean))];
      return uniqueDepts.map((dept, index) => ({
        id: `dept-${index}`,
        name_ar: dept
      }));
    },
  });

  // Get programs for filter - using courses data  
  const { data: programs } = useQuery({
    queryKey: ['programs-from-courses'],
    queryFn: async () => {
      const { data } = await supabase
        .from('courses')
        .select('college, department')
        .order('college');
      
      // Get unique colleges as programs
      const uniquePrograms = [...new Set(data?.map(c => c.college).filter(Boolean))];
      return uniquePrograms.map((program, index) => ({
        id: `prog-${index}`,
        name_ar: program
      }));
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <Badge className="bg-green-100 text-green-800">مسجل</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">مكتمل</Badge>;
      case 'dropped':
        return <Badge className="bg-red-100 text-red-800">منسحب</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة تسجيل المقررات</h1>
          <p className="text-gray-600">إدارة تسجيلات الطلاب في المقررات الدراسية</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التسجيلات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalEnrollments || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalStudents || 0}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المقررات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalCourses || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تسجيلات الأسبوع</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.recentEnrollments || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلاتر البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم أو رمز المقرر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="التخصص" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التخصصات</SelectItem>
                  {programs?.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="السنة الدراسية" />
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
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="الفصل الدراسي" />
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
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            تسجيلات المقررات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollmentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">جاري تحميل التسجيلات...</p>
            </div>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الطالب</TableHead>
                    <TableHead>المقرر</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>السنة الدراسية</TableHead>
                    <TableHead>الفصل</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {enrollment.student?.first_name} {enrollment.student?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {enrollment.student?.student_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {enrollment.course?.course_name_ar}
                          </p>
                          <p className="text-sm text-gray-600">
                            {enrollment.course?.course_code}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {enrollment.student?.department || 'غير محدد'}
                      </TableCell>
                      <TableCell>
                        {enrollment.academic_year}
                      </TableCell>
                      <TableCell>
                        {enrollment.semester}
                      </TableCell>
                      <TableCell>
                        {new Date(enrollment.enrollment_date).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(enrollment.status || 'enrolled')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد تسجيلات</h3>
              <p className="text-gray-500">لا توجد تسجيلات مطابقة للفلاتر المحددة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentManagement;