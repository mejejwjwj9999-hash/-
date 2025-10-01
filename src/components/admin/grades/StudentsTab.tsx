import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Users, 
  GraduationCap, 
  Award,
  AlertTriangle,
  ChevronRight,
  Plus
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
import { StudentDetails } from './StudentDetails';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  academic_year: number;
  status: string;
  current_gpa?: number;
  total_credit_hours?: number;
  completed_hours?: number;
}

interface StudentsTabProps {
  onAddGrade?: (studentId: string) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({ onAddGrade }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [gpaRange, setGpaRange] = useState({ min: '', max: '' });
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // جلب بيانات الطلاب مع إحصائياتهم
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students-with-grades', searchTerm, selectedDepartment, selectedLevel, selectedStatus],
    queryFn: async (): Promise<Student[]> => {
      let query = supabase
        .from('student_profiles')
        .select(`
          id,
          student_id,
          first_name,
          last_name,
          email,
          department,
          academic_year,
          status
        `)
        .order('student_id');

      if (selectedDepartment !== 'all') {
        query = query.eq('department', selectedDepartment);
      }

      // Remove academic_level filter as column doesn't exist

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data: studentsData, error } = await query;
      if (error) throw error;

      // جلب إحصائيات الدرجات لكل طالب
      const studentsWithStats = await Promise.all(
        (studentsData || []).map(async (student) => {
          const { data: grades } = await supabase
            .from('grades')
            .select(`
              gpa_points,
              courses!grades_course_id_fkey (credit_hours)
            `)
            .eq('student_id', student.id);

          const validGrades = grades || [];
          const totalCreditHours = validGrades.reduce((sum, grade) => 
            sum + (grade.courses?.credit_hours || 0), 0);
          
          const weightedGPASum = validGrades.reduce((sum, grade) => 
            sum + ((grade.gpa_points || 0) * (grade.courses?.credit_hours || 0)), 0);

          const currentGPA = totalCreditHours > 0 ? weightedGPASum / totalCreditHours : 0;
          
          const completedHours = validGrades
            .filter(g => (g.gpa_points || 0) >= 1.0)
            .reduce((sum, grade) => sum + (grade.courses?.credit_hours || 0), 0);

          return {
            ...student,
            current_gpa: currentGPA,
            total_credit_hours: totalCreditHours,
            completed_hours: completedHours,
          };
        })
      );

      return studentsWithStats;
    },
    staleTime: 2 * 60 * 1000,
  });

  // فلترة الطلاب حسب البحث ونطاق المعدل
  const filteredStudents = students.filter(student => {
    // فلترة البحث
    const searchMatch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    // فلترة نطاق المعدل
    const gpaMatch = (!gpaRange.min || (student.current_gpa || 0) >= parseFloat(gpaRange.min)) &&
                     (!gpaRange.max || (student.current_gpa || 0) <= parseFloat(gpaRange.max));

    return searchMatch && gpaMatch;
  });

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600 bg-green-50';
    if (gpa >= 3.0) return 'text-blue-600 bg-blue-50';
    if (gpa >= 2.0) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'graduated': return 'متخرج';
      case 'suspended': return 'موقوف';
      default: return status;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (selectedStudent) {
    return (
      <StudentDetails 
        studentId={selectedStudent} 
        onBack={() => setSelectedStudent(null)}
        onAddGrade={onAddGrade}
      />
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* شريط البحث والفلاتر */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن طالب (الاسم، الرقم الجامعي، البريد الإلكتروني...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* الفلاتر */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  <SelectItem value="computer_science">علوم الحاسوب</SelectItem>
                  <SelectItem value="engineering">الهندسة</SelectItem>
                  <SelectItem value="business">إدارة الأعمال</SelectItem>
                  <SelectItem value="medicine">الطب</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="المستوى الأكاديمي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="1">المستوى الأول</SelectItem>
                  <SelectItem value="2">المستوى الثاني</SelectItem>
                  <SelectItem value="3">المستوى الثالث</SelectItem>
                  <SelectItem value="4">المستوى الرابع</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="حالة الطالب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="graduated">متخرج</SelectItem>
                  <SelectItem value="suspended">موقوف</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    نطاق المعدل
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">فلترة حسب المعدل التراكمي</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">الحد الأدنى</label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="4"
                          placeholder="0.0"
                          value={gpaRange.min}
                          onChange={(e) => setGpaRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">الحد الأعلى</label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="4"
                          placeholder="4.0"
                          value={gpaRange.max}
                          onChange={(e) => setGpaRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setGpaRange({ min: '', max: '' })}
                      className="w-full"
                    >
                      إعادة تعيين
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* النتائج */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          الطلاب ({filteredStudents.length})
        </h3>
      </div>

      {/* شبكة الطلاب */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedStudent(student.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`/avatars/${student.student_id}.jpg`} />
                    <AvatarFallback className="bg-university-blue/10 text-university-blue font-semibold">
                      {getInitials(student.first_name, student.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {student.first_name} {student.last_name}
                      </h4>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      {student.student_id}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="h-4 w-4 text-university-blue" />
                      <span className="text-sm text-gray-600">{student.department}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(student.status)}
                      >
                        {getStatusLabel(student.status)}
                      </Badge>
                      
                      {student.current_gpa && student.current_gpa >= 3.5 && (
                        <Badge className="bg-yellow-100 text-yellow-800 gap-1">
                          <Award className="h-3 w-3" />
                          متفوق
                        </Badge>
                      )}
                      
                      {student.current_gpa && student.current_gpa < 2.0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          تحت المراقبة
                        </Badge>
                      )}
                    </div>

                    {/* الإحصائيات */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className={`text-lg font-bold px-2 py-1 rounded ${getGPAColor(student.current_gpa || 0)}`}>
                          {student.current_gpa?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-xs text-muted-foreground">المعدل</div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {student.completed_hours || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">ساعات مكتملة</div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-bold text-gray-600">
                          1
                        </div>
                        <div className="text-xs text-muted-foreground">المستوى</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudent(student.id);
                    }}
                  >
                    عرض التفاصيل
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddGrade?.(student.id);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة درجة
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* حالة عدم وجود نتائج */}
      {!isLoading && filteredStudents.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على طلاب يطابقون معايير البحث المحددة
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};