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
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserPlus, 
  GraduationCap,
  Download,
  RefreshCw,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import { Progress } from "@/components/ui/progress";

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
  user_id?: string;
};

const StudentsManagementEnhanced: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Fetch students data
  const { data: students, isLoading, refetch } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async (): Promise<Student[]> => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 30,
  });

  // Mutations
  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("student_profiles")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast({ title: "تم الحذف", description: "تم حذف الطالب بنجاح." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في حذف الطالب.", variant: "destructive" });
    },
  });

  const updateStudentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("student_profiles")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast({ title: "تم التحديث", description: "تم تحديث حالة الطالب بنجاح." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في تحديث حالة الطالب.", variant: "destructive" });
    },
  });

  // Export students data
  const exportStudents = () => {
    if (!students) return;
    
    const csvContent = [
      ['رقم الطالب', 'الاسم الأول', 'الاسم الأخير', 'البريد الإلكتروني', 'الكلية', 'القسم', 'السنة الدراسية', 'الفصل', 'الحالة'],
      ...students.map(student => [
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

  // Filtering logic
  const filteredStudents = students?.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesCollege = collegeFilter === "all" || student.college === collegeFilter;
    
    return matchesSearch && matchesStatus && matchesCollege;
  }) || [];

  // Statistics
  const stats = {
    total: students?.length || 0,
    active: students?.filter(s => s.status === 'active').length || 0,
    inactive: students?.filter(s => s.status === 'inactive').length || 0,
    suspended: students?.filter(s => s.status === 'suspended').length || 0,
    graduated: students?.filter(s => s.status === 'graduated').length || 0
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "نشط", variant: "default" as const, color: "bg-green-500" },
      inactive: { label: "غير نشط", variant: "secondary" as const, color: "bg-gray-500" },
      suspended: { label: "موقوف", variant: "destructive" as const, color: "bg-red-500" },
      graduated: { label: "خريج", variant: "outline" as const, color: "bg-blue-500" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleDelete = (student: Student) => {
    if (confirm(`هل أنت متأكد من حذف الطالب ${student.first_name} ${student.last_name}؟`)) {
      deleteStudent.mutate(student.id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة الطلاب</h1>
          <p className="text-muted-foreground mt-1">إدارة بيانات الطلاب والمتابعة الأكاديمية المتقدمة</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            تحديث
          </Button>
          <Button 
            variant="outline"
            onClick={exportStudents}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            إضافة طالب
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">إجمالي الطلاب</CardTitle>
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <Progress value={100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">الطلاب النشطون</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <Progress value={stats.total > 0 ? (stats.active / stats.total) * 100 : 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">غير النشطين</CardTitle>
              <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{stats.inactive}</div>
            <Progress value={stats.total > 0 ? (stats.inactive / stats.total) * 100 : 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">الموقوفون</CardTitle>
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.suspended}</div>
            <Progress value={stats.total > 0 ? (stats.suspended / stats.total) * 100 : 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">الخريجون</CardTitle>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.graduated}</div>
            <Progress value={stats.total > 0 ? (stats.graduated / stats.total) * 100 : 0} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Advanced Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث والفلترة المتقدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، رقم الطالب، أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
                <SelectItem value="graduated">خريج</SelectItem>
              </SelectContent>
            </Select>

            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة حسب الكلية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الكليات</SelectItem>
                <SelectItem value="كلية الطب">كلية الطب</SelectItem>
                <SelectItem value="كلية الهندسة">كلية الهندسة</SelectItem>
                <SelectItem value="كلية الحاسوب">كلية الحاسوب</SelectItem>
                <SelectItem value="كلية إدارة الأعمال">كلية إدارة الأعمال</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              فلاتر متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الطلاب ({filteredStudents.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              عرض {filteredStudents.length} من أصل {stats.total} طالب
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="mr-2 text-muted-foreground">جاري التحميل...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد بيانات طلاب مطابقة للبحث</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطالب</TableHead>
                    <TableHead>الاسم الكامل</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الكلية</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>السنة/الفصل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{student.student_id}</TableCell>
                      <TableCell>{student.first_name} {student.last_name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.college}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>السنة {student.academic_year} - الفصل {student.semester}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                              <Eye className="h-4 w-4 ml-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(student)}>
                              <Edit className="h-4 w-4 ml-2" />
                              تحرير
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(student)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
      {showAddModal && (
        <AddStudentModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
          }}
        />
      )}

      {showEditModal && editingStudent && (
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
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
          }}
        />
      )}
    </div>
  );
};

export default StudentsManagementEnhanced;