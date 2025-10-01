
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Download,
  UserCheck,
  UserX,
  GraduationCap
} from 'lucide-react';
import BulkStudentImporter from '@/components/admin/BulkStudentImporter';

type StudentProfile = {
  id: string;
  user_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  academic_year: number;
  semester: number;
  status: string;
  admission_date: string;
  created_at: string;
};

const StudentsManagementResponsive: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');

  const { data: students, isLoading, refetch } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      console.log('Fetching students data...');
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      console.log('Students data fetched successfully:', data?.length || 0, 'students');
      return data as StudentProfile[] || [];
    },
    staleTime: 1000 * 30,
  });

  const updateStudentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('student_profiles')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة الطالب بنجاح.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في التحديث',
        description: error.message || 'فشل في تحديث حالة الطالب.',
        variant: 'destructive',
      });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('student_profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الطالب بنجاح.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في الحذف',
        description: error.message || 'فشل في حذف الطالب.',
        variant: 'destructive',
      });
    },
  });

  const filteredStudents = students?.filter(student => {
    const matchesSearch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesCollege = collegeFilter === 'all' || student.college === collegeFilter;
    
    return matchesSearch && matchesStatus && matchesCollege;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'معلق', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      graduated: { label: 'متخرج', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const colleges = Array.from(new Set(students?.map(s => s.college) || []));

  const handleDelete = (id: string, studentName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الطالب ${studentName}؟`)) {
      deleteStudent.mutate(id);
    }
  };

  // إحصائيات سريعة
  const stats = {
    total: filteredStudents.length,
    active: filteredStudents.filter(s => s.status === 'active').length,
    inactive: filteredStudents.filter(s => s.status === 'inactive').length,
    suspended: filteredStudents.filter(s => s.status === 'suspended').length,
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">جاري تحميل بيانات الطلاب...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* العنوان والأزرار */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة الطلاب</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <BulkStudentImporter />
          <Button size="sm">
            <Plus className="h-4 w-4" />
            إضافة طالب
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي الطلاب</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">طلاب نشطون</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600">غير نشطين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <div className="text-sm text-gray-600">معلقون</div>
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، رقم الطالب، أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
                <SelectItem value="graduated">متخرج</SelectItem>
              </SelectContent>
            </Select>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="w-full md:w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* جدول الطلاب */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلاب ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {students?.length === 0 ? 'لا يوجد طلاب مسجلين' : 'لا توجد نتائج'}
              </h3>
              <p className="text-gray-600">
                {students?.length === 0 
                  ? 'لم يتم تسجيل أي طالب في النظام بعد.' 
                  : 'لا توجد نتائج تطابق معايير البحث المحددة.'
                }
              </p>
              {students?.length === 0 && (
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة أول طالب
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطالب</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead className="hidden md:table-cell">الكلية</TableHead>
                    <TableHead className="hidden lg:table-cell">القسم</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{student.student_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.first_name} {student.last_name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {student.college}
                          </div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{student.college}</TableCell>
                      <TableCell className="hidden lg:table-cell">{student.department}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {student.status === 'active' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateStudentStatus.mutate({ 
                                id: student.id, 
                                status: 'inactive' 
                              })}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateStudentStatus.mutate({ 
                                id: student.id, 
                                status: 'active' 
                              })}
                              className="text-green-600 hover:text-green-700"
                            >
                              <UserCheck className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(student.id, `${student.first_name} ${student.last_name}`)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsManagementResponsive;
