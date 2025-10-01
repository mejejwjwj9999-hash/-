
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
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Eye,
  UserPlus,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  Upload,
  Download
} from 'lucide-react';
import EnhancedAddStudentModal from './EnhancedAddStudentModal';
import AddStudentModalRadical from './AddStudentModalRadical';
import EditStudentModalRadical from './EditStudentModalRadical';
import StudentDetailsModal from './StudentDetailsModal';
import BulkStudentImporter from './BulkStudentImporter';

type Student = {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  academic_year: number;
  semester: number;
  admission_date: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const StudentsManagementRadical: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const { data: students, isLoading, refetch } = useQuery({
    queryKey: ['admin-students-radical'],
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
      return data as Student[] || [];
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting student:', id);
      const { error } = await supabase
        .from('student_profiles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting student:', error);
        throw new Error(error.message || 'فشل في حذف الطالب');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students-radical'] });
      toast({
        title: 'تم الحذف بنجاح ✅',
        description: 'تم حذف الطالب بنجاح.',
      });
    },
    onError: (error: Error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'خطأ في الحذف ❌',
        description: error.message || 'فشل في حذف الطالب.',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (student: Student) => {
    if (window.confirm(`هل أنت متأكد من حذف الطالب ${student.first_name} ${student.last_name}؟\nرقم الطالب: ${student.student_id}\nلا يمكن التراجع عن هذا الإجراء.`)) {
      deleteStudentMutation.mutate(student.id);
    }
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingStudent(null);
    refetch();
  };

  const toggleAccountMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const { error } = await supabase
        .from('student_profiles')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw new Error(error.message || 'فشل في تحديث حالة الحساب');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students-radical'] });
      toast({
        title: 'تم التحديث بنجاح ✅',
        description: 'تم تحديث حالة حساب الطالب بنجاح.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ في التحديث ❌',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) throw new Error(error.message || 'فشل في إرسال رابط إعادة تعيين كلمة المرور');
    },
    onSuccess: () => {
      toast({
        title: 'تم الإرسال بنجاح ✅',
        description: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني للطالب.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ في الإرسال ❌',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAccountToggle = (student: Student) => {
    const newStatus = student.status === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'suspended' ? 'تعليق' : 'تفعيل';
    
    if (window.confirm(`هل أنت متأكد من ${action} حساب الطالب ${student.first_name} ${student.last_name}؟`)) {
      toggleAccountMutation.mutate({ id: student.id, newStatus });
    }
  };

  const handleResetPassword = (student: Student) => {
    if (window.confirm(`هل أنت متأكد من إرسال رابط إعادة تعيين كلمة المرور للطالب ${student.first_name} ${student.last_name}؟\nسيتم الإرسال إلى: ${student.email}`)) {
      resetPasswordMutation.mutate(student.email);
    }
  };

  // الفلترة
  const filteredStudents = students?.filter(student => {
    const matchesSearch = !searchTerm || 
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollege = selectedCollege === 'all' || student.college === selectedCollege;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    const matchesYear = selectedYear === 'all' || student.academic_year.toString() === selectedYear;
    
    return matchesSearch && matchesCollege && matchesStatus && matchesYear;
  }) || [];

  // الإحصائيات
  const stats = {
    total: students?.length || 0,
    active: students?.filter(s => s.status === 'active').length || 0,
    inactive: students?.filter(s => s.status === 'inactive').length || 0,
    suspended: students?.filter(s => s.status === 'suspended').length || 0,
    graduated: students?.filter(s => s.status === 'graduated').length || 0,
  };

  const colleges = [...new Set(students?.map(s => s.college) || [])].sort();
  const years = [...new Set(students?.map(s => s.academic_year) || [])].sort();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', className: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'معلق', className: 'bg-red-100 text-red-800' },
      graduated: { label: 'متخرج', className: 'bg-blue-100 text-blue-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">جاري تحميل بيانات الطلاب...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* العنوان والإحصائيات */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة الطلاب</h1>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            محسنة
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="h-4 w-4 ml-2" />
            إضافة طالب
          </Button>
          <BulkStudentImporter />
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">إجمالي الطلاب</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">نشط</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-muted-foreground">غير نشط</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <div className="text-sm text-muted-foreground">معلق</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.graduated}</div>
            <div className="text-sm text-muted-foreground">متخرج</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالرقم، الاسم، البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
            
            <Select value={selectedCollege} onValueChange={setSelectedCollege}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الكليات" />
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
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
                <SelectItem value="graduated">متخرج</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="جميع السنوات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع السنوات</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    السنة {year}
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
          <CardTitle className="flex items-center justify-between">
            <span>قائمة الطلاب ({filteredStudents.length})</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {students?.length === 0 ? 'لا يوجد طلاب' : 'لا توجد نتائج'}
              </h3>
              <p className="text-gray-600">
                {students?.length === 0 
                  ? 'لم يتم تسجيل أي طالب في النظام بعد.' 
                  : 'لا توجد نتائج تطابق معايير البحث المحددة.'
                }
              </p>
              {students?.length === 0 && (
                <Button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة أول طالب
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطالب</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الكلية</TableHead>
                    <TableHead className="text-right">السنة/الفصل</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-right">
                        <div className="font-medium">{student.student_id}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div className="font-medium">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.department}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-sm">{student.email}</span>
                          <Mail className="h-3 w-3" />
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground justify-end">
                            <span className="text-sm">{student.phone}</span>
                            <Phone className="h-3 w-3" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{student.college}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-sm">
                            السنة {student.academic_year} - الفصل {student.semester}
                          </span>
                          <GraduationCap className="h-3 w-3" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(student.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-start">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setViewingStudent(student)}
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingStudent(student)}
                            title="تعديل"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAccountToggle(student)}
                            className={student.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                            title={student.status === 'active' ? 'تعليق الحساب' : 'تفعيل الحساب'}
                          >
                            {student.status === 'active' ? '⏸️' : '▶️'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResetPassword(student)}
                            className="text-blue-600 hover:text-blue-700"
                            title="إعادة تعيين كلمة المرور"
                          >
                            🔑
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(student)}
                            className="text-destructive hover:text-destructive"
                            title="حذف"
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

      {/* Modals */}
      <AddStudentModalRadical
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {editingStudent && (
        <EditStudentModalRadical
          student={editingStudent}
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {viewingStudent && (
        <StudentDetailsModal
          student={viewingStudent}
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentsManagementRadical;
