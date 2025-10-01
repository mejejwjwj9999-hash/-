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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

const StudentsManagementComplete: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    academic_year: 1,
    semester: 1,
    student_id: ''
  });

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

  const addStudentMutation = useMutation({
    mutationFn: async (newStudent: typeof formData) => {
      console.log('Adding student with data:', newStudent);
      
      // التحقق من عدم وجود طالب بنفس الإيميل
      const { data: existingStudent } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('email', newStudent.email)
        .single();
        
      if (existingStudent) {
        throw new Error('يوجد طالب مسجل بنفس البريد الإلكتروني');
      }

      // إنشاء حساب المستخدم أولاً
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: 'temp123456', // كلمة مرور مؤقتة
        options: {
          data: {
            first_name: newStudent.first_name,
            last_name: newStudent.last_name,
            student_id: newStudent.student_id,
            college: newStudent.college,
            department: newStudent.department,
            academic_year: newStudent.academic_year,
            semester: newStudent.semester
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('فشل في إنشاء حساب المستخدم: ' + authError.message);
      }

      if (!authData.user) {
        throw new Error('فشل في إنشاء المستخدم');
      }

      // إضافة البروفايل
      const { error: profileError } = await supabase
        .from('student_profiles')
        .insert([{
          user_id: authData.user.id,
          student_id: newStudent.student_id || `STD${Date.now()}`,
          first_name: newStudent.first_name.trim(),
          last_name: newStudent.last_name.trim(),
          email: newStudent.email.trim(),
          phone: newStudent.phone?.trim() || null,
          college: newStudent.college.trim(),
          department: newStudent.department.trim(),
          academic_year: newStudent.academic_year,
          semester: newStudent.semester,
          admission_date: new Date().toISOString().split('T')[0]
        }]);
      
      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الطالب بنجاح.',
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Add student error:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: error.message || 'فشل في إضافة الطالب.',
        variant: 'destructive',
      });
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (updatedStudent: typeof formData & { id: string }) => {
      const { error } = await supabase
        .from('student_profiles')
        .update({
          first_name: updatedStudent.first_name.trim(),
          last_name: updatedStudent.last_name.trim(),
          phone: updatedStudent.phone?.trim() || null,
          college: updatedStudent.college.trim(),
          department: updatedStudent.department.trim(),
          academic_year: updatedStudent.academic_year,
          semester: updatedStudent.semester,
        })
        .eq('id', updatedStudent.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث بيانات الطالب بنجاح.',
      });
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في التحديث',
        description: error.message || 'فشل في تحديث بيانات الطالب.',
        variant: 'destructive',
      });
    },
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

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      college: '',
      department: '',
      academic_year: 1,
      semester: 1,
      student_id: ''
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || 
        !formData.email.trim() || !formData.college.trim() || !formData.department.trim()) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }

    addStudentMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !formData.first_name.trim() || !formData.last_name.trim() || 
        !formData.college.trim() || !formData.department.trim()) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة.',
        variant: 'destructive',
      });
      return;
    }

    updateStudentMutation.mutate({ ...formData, id: selectedStudent.id });
  };

  const handleEdit = (student: StudentProfile) => {
    setSelectedStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone || '',
      college: student.college,
      department: student.department,
      academic_year: student.academic_year,
      semester: student.semester,
      student_id: student.student_id
    });
    setIsEditModalOpen(true);
  };

  const handleView = (student: StudentProfile) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (id: string, studentName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الطالب ${studentName}؟`)) {
      deleteStudent.mutate(id);
    }
  };

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
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4" />
                إضافة طالب
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة طالب جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">الاسم الأول *</label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">اسم العائلة *</label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="مثال: 777123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رقم الطالب</label>
                  <Input
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    placeholder="سيتم توليده تلقائياً إذا تُرك فارغاً"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">الكلية *</label>
                  <Input
                    value={formData.college}
                    onChange={(e) => setFormData({...formData, college: e.target.value})}
                    placeholder="مثال: كلية الطب"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">القسم *</label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="مثال: الطب العام"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">السنة الدراسية *</label>
                    <Select 
                      value={formData.academic_year.toString()} 
                      onValueChange={(value) => setFormData({...formData, academic_year: parseInt(value)})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">السنة الأولى</SelectItem>
                        <SelectItem value="2">السنة الثانية</SelectItem>
                        <SelectItem value="3">السنة الثالثة</SelectItem>
                        <SelectItem value="4">السنة الرابعة</SelectItem>
                        <SelectItem value="5">السنة الخامسة</SelectItem>
                        <SelectItem value="6">السنة السادسة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الفصل الدراسي *</label>
                    <Select 
                      value={formData.semester.toString()} 
                      onValueChange={(value) => setFormData({...formData, semester: parseInt(value)})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">الفصل الأول</SelectItem>
                        <SelectItem value="2">الفصل الثاني</SelectItem>
                        <SelectItem value="3">الفصل الصيفي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={addStudentMutation.isPending}
                    className="flex-1"
                  >
                    {addStudentMutation.isPending ? 'جاري الإضافة...' : 'إضافة الطالب'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleView(student)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(student)}
                          >
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

      {/* مودال التعديل */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الطالب</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الأول *</label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اسم العائلة *</label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الكلية *</label>
              <Input
                value={formData.college}
                onChange={(e) => setFormData({...formData, college: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">القسم *</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">السنة الدراسية *</label>
                <Select 
                  value={formData.academic_year.toString()} 
                  onValueChange={(value) => setFormData({...formData, academic_year: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">السنة الأولى</SelectItem>
                    <SelectItem value="2">السنة الثانية</SelectItem>
                    <SelectItem value="3">السنة الثالثة</SelectItem>
                    <SelectItem value="4">السنة الرابعة</SelectItem>
                    <SelectItem value="5">السنة الخامسة</SelectItem>
                    <SelectItem value="6">السنة السادسة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الفصل الدراسي *</label>
                <Select 
                  value={formData.semester.toString()} 
                  onValueChange={(value) => setFormData({...formData, semester: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">الفصل الأول</SelectItem>
                    <SelectItem value="2">الفصل الثاني</SelectItem>
                    <SelectItem value="3">الفصل الصيفي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={updateStudentMutation.isPending}
                className="flex-1"
              >
                {updateStudentMutation.isPending ? 'جاري التحديث...' : 'تحديث البيانات'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedStudent(null);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* مودال عرض التفاصيل */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الطالب</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">رقم الطالب</label>
                  <div className="font-medium">{selectedStudent.student_id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">الحالة</label>
                  <div>{getStatusBadge(selectedStudent.status)}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">الاسم الكامل</label>
                <div className="font-medium">{selectedStudent.first_name} {selectedStudent.last_name}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                <div className="font-medium">{selectedStudent.email}</div>
              </div>
              
              {selectedStudent.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">رقم الهاتف</label>
                  <div className="font-medium">{selectedStudent.phone}</div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">الكلية</label>
                  <div className="font-medium">{selectedStudent.college}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">القسم</label>
                  <div className="font-medium">{selectedStudent.department}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">السنة الدراسية</label>
                  <div className="font-medium">السنة {selectedStudent.academic_year}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">الفصل الدراسي</label>
                  <div className="font-medium">الفصل {selectedStudent.semester}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">تاريخ القبول</label>
                <div className="font-medium">{new Date(selectedStudent.admission_date).toLocaleDateString('ar-EG')}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsManagementComplete;
