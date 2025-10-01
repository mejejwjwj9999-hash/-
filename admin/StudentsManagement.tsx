
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Download,
  UserCheck,
  UserX,
  GraduationCap,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import StudentDetailsModal from "./StudentDetailsModal";

type StudentProfile = {
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
};

const StudentsManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [collegeFilter, setCollegeFilter] = useState("all");

  const { data: students = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async (): Promise<StudentProfile[]> => {
      console.log('جاري تحميل بيانات الطلاب...');
      
      try {
        const { data, error } = await supabase
          .from("student_profiles")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error('خطأ في تحميل بيانات الطلاب:', error);
          throw new Error(`فشل في تحميل بيانات الطلاب: ${error.message}`);
        }
        
        console.log('تم تحميل بيانات الطلاب بنجاح:', data?.length || 0, 'طالب');
        return (data as StudentProfile[]) || [];
      } catch (err) {
        console.error('خطأ غير متوقع في تحميل بيانات الطلاب:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const updateStudentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('تحديث حالة الطالب:', id, 'إلى:', status);
      
      const { error } = await supabase
        .from("student_profiles")
        .update({ status, account_status: status, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) {
        console.error('خطأ في تحديث حالة الطالب:', error);
        throw new Error(`فشل في تحديث حالة الطالب: ${error.message}`);
      }
      
      console.log('تم تحديث حالة الطالب بنجاح');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطالب بنجاح.",
      });
    },
    onError: (error: any) => {
      console.error('فشل في تحديث حالة الطالب:', error);
      toast({
        title: "خطأ في التحديث",
        description: error.message || "فشل في تحديث حالة الطالب.",
        variant: "destructive",
      });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      console.log('حذف الطالب:', id);
      
      const { error } = await supabase
        .from("student_profiles")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error('خطأ في حذف الطالب:', error);
        throw new Error(`فشل في حذف الطالب: ${error.message}`);
      }
      
      console.log('تم حذف الطالب بنجاح');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الطالب بنجاح.",
      });
    },
    onError: (error: any) => {
      console.error('فشل في حذف الطالب:', error);
      toast({
        title: "خطأ في الحذف",
        description: error.message || "فشل في حذف الطالب.",
        variant: "destructive",
      });
    },
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesCollege = collegeFilter === "all" || student.college === collegeFilter;
    
    return matchesSearch && matchesStatus && matchesCollege;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "نشط", variant: "default" as const },
      inactive: { label: "غير نشط", variant: "secondary" as const },
      suspended: { label: "معلق", variant: "destructive" as const },
      graduated: { label: "متخرج", variant: "outline" as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const colleges = Array.from(new Set(students.map(s => s.college).filter(Boolean)));

  const handleViewStudent = (student: StudentProfile) => {
    console.log('عرض تفاصيل الطالب:', student.id);
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleEditStudent = (student: StudentProfile) => {
    console.log('تعديل الطالب:', student.id);
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleDeleteStudent = (student: StudentProfile) => {
    const confirmMessage = `هل أنت متأكد من حذف الطالب "${student.first_name} ${student.last_name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`;
    if (confirm(confirmMessage)) {
      console.log('تأكيد حذف الطالب:', student.id);
      deleteStudent.mutate(student.id);
    }
  };

  const handleStatusChange = (student: StudentProfile, newStatus: string) => {
    const statusText = newStatus === 'active' ? 'تفعيل' : 
                      newStatus === 'suspended' ? 'إيقاف' : 'إلغاء تفعيل';
    const confirmMessage = `هل أنت متأكد من ${statusText} الطالب "${student.first_name} ${student.last_name}"؟`;
    
    if (confirm(confirmMessage)) {
      console.log('تحديث حالة الطالب:', student.id, newStatus);
      updateStudentStatus.mutate({ id: student.id, status: newStatus });
    }
  };

  const exportStudents = () => {
    if (!filteredStudents.length) return;
    
    const csvContent = [
      ['رقم الطالب', 'الاسم الأول', 'الاسم الأخير', 'البريد الإلكتروني', 'الكلية', 'القسم', 'السنة الدراسية', 'الفصل', 'الحالة'],
      ...filteredStudents.map(student => [
        student.student_id,
        student.first_name,
        student.last_name,
        student.email,
        student.college,
        student.department,
        student.academic_year.toString(),
        student.semester.toString(),
        student.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // إحصائيات سريعة
  const stats = {
    total: filteredStudents.length,
    totalAll: students.length,
    active: students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length,
    suspended: students.filter(s => s.status === 'suspended').length,
    graduated: students.filter(s => s.status === 'graduated').length,
  };

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-red-800">خطأ في تحميل البيانات</h3>
              <p className="text-red-600 max-w-md">
                {error instanceof Error ? error.message : 'حدث خطأ غير متوقع في تحميل بيانات الطلاب'}
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* العنوان والأزرار */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة الطلاب</h1>
                <p className="text-muted-foreground">إدارة وتتبع جميع الطلاب المسجلين</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button 
                onClick={exportStudents}
                variant="outline" 
                size="sm"
                disabled={!filteredStudents.length}
              >
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
              <Button 
                onClick={() => setShowAddModal(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة طالب
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الطلاب</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalAll}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلاب نشطون</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">غير نشطين</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معلقون</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متخرجون</p>
                <p className="text-2xl font-bold text-purple-600">{stats.graduated}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، رقم الطالب، أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      {/* جدول الطلاب */}
      <Card>
        <CardHeader>
          <CardTitle>
            قائمة الطلاب ({filteredStudents.length} من أصل {stats.totalAll})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="flex justify-center items-center space-y-4">
                <RefreshCw className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">جاري تحميل بيانات الطلاب</h3>
                  <p className="text-muted-foreground">يرجى الانتظار بينما نحضر البيانات...</p>
                </div>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <GraduationCap className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {students.length === 0 ? 'لا يوجد طلاب مسجلين' : 'لا توجد نتائج'}
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    {students.length === 0 
                      ? 'لم يتم تسجيل أي طالب في النظام بعد. ابدأ بإضافة الطلاب للنظام.' 
                      : 'لا توجد نتائج تطابق معايير البحث المحددة. جرب تغيير الفلاتر.'
                    }
                  </p>
                </div>
                {students.length === 0 && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة أول طالب
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطالب</TableHead>
                    <TableHead className="text-right">الاسم الكامل</TableHead>
                    <TableHead className="hidden md:table-cell text-right">التواصل</TableHead>
                    <TableHead className="hidden lg:table-cell text-right">الكلية/القسم</TableHead>
                    <TableHead className="text-right">السنة/الفصل</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {student.student_id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{student.first_name} {student.last_name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {student.college} - {student.department}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{student.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{student.college}</div>
                          <div className="text-muted-foreground">{student.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>السنة {student.academic_year}</div>
                          <div className="text-muted-foreground">الفصل {student.semester}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="عرض التفاصيل"
                            onClick={() => handleViewStudent(student)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            title="تعديل"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {student.status === 'active' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(student, 'inactive')}
                              className="text-orange-600 hover:text-orange-700"
                              title="إلغاء التفعيل"
                              disabled={updateStudentStatus.isPending}
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(student, 'active')}
                              className="text-green-600 hover:text-green-700"
                              title="تفعيل"
                              disabled={updateStudentStatus.isPending}
                            >
                              <UserCheck className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteStudent(student)}
                            className="text-destructive hover:text-destructive"
                            title="حذف"
                            disabled={deleteStudent.isPending}
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

      {/* نوافذ التفاعل */}
      <AddStudentModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      {editingStudent && (
        <EditStudentModal 
          student={editingStudent}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingStudent(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingStudent(null);
            refetch();
          }}
        />
      )}

      <StudentDetailsModal 
        student={selectedStudent}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default StudentsManagement;
