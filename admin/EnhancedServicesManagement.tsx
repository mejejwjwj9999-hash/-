import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  Clock, 
  FileText, 
  AlertCircle,
  Filter,
  Users,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DepartmentId, 
  ProgramId, 
  getAllDepartments, 
  getAllPrograms, 
  getDepartmentName, 
  getProgramName 
} from "@/domain/academics";

type ServiceRequest = {
  id: string;
  student_id: string;
  title: string;
  description?: string;
  service_type: string;
  status: string;
  priority: string;
  assigned_to?: string;
  response?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  documents?: any;
  student_profiles?: {
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    department_id?: DepartmentId;
    program_id?: ProgramId;
    academic_year: number;
    semester: number;
  };
};

const ITEMS_PER_PAGE = 10;

const EnhancedServicesManagement: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'created_at' | 'priority' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load departments and programs for filters
  const departments = getAllDepartments();
  const programs = getAllPrograms();

  const { data: serviceRequests, isLoading } = useQuery({
    queryKey: ["enhanced-admin-services", sortBy, sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          student_profiles!inner (
            id,
            student_id,
            first_name,
            last_name,
            email,
            department,
            department_id,
            program_id,
            academic_year,
            semester
          )
        `)
        .order(sortBy, { ascending: sortOrder === 'asc' });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 30,
  });

  const updateServiceStatus = useMutation({
    mutationFn: async ({ id, status, response }: { id: string; status: string; response?: string }) => {
      const updateData: any = { status };
      if (response) updateData.response = response;
      if (status === "completed") updateData.completed_at = new Date().toISOString();
      
      const { error } = await supabase
        .from("service_requests")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enhanced-admin-services"] });
      toast({ title: "تم التحديث", description: "تم تحديث حالة الطلب بنجاح." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في تحديث حالة الطلب.", variant: "destructive" });
    },
  });

  const filteredRequests = (serviceRequests as any[])?.filter((request: any) => {
    const student = request.student_profiles;
    if (!student) return false;

    const matchesSearch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || student.department_id === departmentFilter;
    const matchesProgram = programFilter === "all" || student.program_id === programFilter;
    const matchesServiceType = serviceTypeFilter === "all" || request.service_type === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesProgram && matchesServiceType;
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "معلق", variant: "secondary" as const, icon: Clock },
      in_progress: { label: "قيد المعالجة", variant: "default" as const, icon: Clock },
      completed: { label: "مكتمل", variant: "default" as const, icon: Check },
      cancelled: { label: "ملغى", variant: "destructive" as const, icon: X }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "منخفض", variant: "outline" as const },
      normal: { label: "عادي", variant: "secondary" as const },
      high: { label: "مرتفع", variant: "destructive" as const },
      urgent: { label: "عاجل", variant: "destructive" as const }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    updateServiceStatus.mutate({ id: requestId, status: newStatus });
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  const handleSort = (column: 'created_at' | 'priority' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const serviceTypeLabels: { [key: string]: string } = {
    transcript: "كشف درجات",
    certificate: "شهادة تخرج",
    enrollment: "إفادة قيد",
    payment_receipt: "إيصال دفع",
    schedule_change: "تعديل الجدول",
    library_access: "الوصول للمكتبة",
    student_council: "مجلس الطلبة",
    campus_map: "خريطة الحرم",
    technical_support: "الدعم التقني",
    contact_admin: "التواصل مع الإدارة",
    other: "أخرى"
  };

  // Statistics
  const stats = {
    total: serviceRequests?.length || 0,
    pending: serviceRequests?.filter(r => r.status === 'pending').length || 0,
    in_progress: serviceRequests?.filter(r => r.status === 'in_progress').length || 0,
    completed: serviceRequests?.filter(r => r.status === 'completed').length || 0,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
              إدارة طلبات الخدمات المحسنة
            </h1>
            <p className="text-gray-600">متابعة ومعالجة طلبات الخدمات الطلابية مع الفلترة المتقدمة</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-gray-600">إجمالي الطلبات</p>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-yellow-800">طلبات معلقة</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
            <p className="text-xs text-yellow-600 mt-1">تحتاج مراجعة</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-800">قيد المعالجة</CardTitle>
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{stats.in_progress}</div>
            <p className="text-xs text-blue-600 mt-1">جاري العمل عليها</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-green-800">طلبات مكتملة</CardTitle>
              <Check className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.completed}</div>
            <p className="text-xs text-green-600 mt-1">تم إنجازها</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-800">إجمالي الطلبات</CardTitle>
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">جميع الطلبات</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Search and Filter */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة المتقدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو رقم الطالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 rounded-xl border-2 focus:border-primary/50"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name.ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="البرنامج" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع البرامج</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name.ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="نوع الخدمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الخدمات</SelectItem>
                {Object.entries(serviceTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDepartmentFilter("all");
                setProgramFilter("all");
                setServiceTypeFilter("all");
                setCurrentPage(1);
              }}
              className="rounded-xl border-2"
            >
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Services Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              طلبات الخدمات ({filteredRequests.length})
            </CardTitle>
            <div className="text-sm text-gray-500">
              الصفحة {currentPage} من {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead 
                        className="text-right font-semibold cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('created_at')}
                      >
                        معلومات الطالب {sortBy === 'created_at' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </TableHead>
                      <TableHead className="text-center font-semibold">البرنامج/القسم</TableHead>
                      <TableHead className="text-right font-semibold">طلب الخدمة</TableHead>
                      <TableHead className="text-center font-semibold">نوع الخدمة</TableHead>
                      <TableHead 
                        className="text-center font-semibold cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('priority')}
                      >
                        الأولوية {sortBy === 'priority' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </TableHead>
                      <TableHead 
                        className="text-center font-semibold cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        الحالة {sortBy === 'status' && (sortOrder === 'desc' ? '↓' : '↑')}
                      </TableHead>
                      <TableHead className="text-center font-semibold">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-center font-semibold">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests?.map((request: any) => {
                      const student = request.student_profiles!;
                      return (
                        <TableRow key={request.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                                <span className="font-bold text-primary text-sm">
                                  {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {student.first_name} {student.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{student.student_id}</div>
                                <div className="text-xs text-gray-400">
                                  س{student.academic_year} - ف{student.semester}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div>
                              <Badge variant="outline" className="mb-1">
                                {student.program_id ? getProgramName(student.program_id as ProgramId) : 'غير محدد'}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                {student.department_id ? getDepartmentName(student.department_id as DepartmentId) : student.department}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-48">
                            <div className="font-medium truncate" title={request.title}>
                              {request.title}
                            </div>
                            {request.description && (
                              <div className="text-xs text-gray-500 truncate mt-1" title={request.description}>
                                {request.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {serviceTypeLabels[request.service_type] || request.service_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{getPriorityBadge(request.priority)}</TableCell>
                          <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-center text-sm text-gray-600">
                            {new Date(request.created_at).toLocaleDateString('ar-EG')}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-1 justify-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(request)}
                                className="rounded-lg p-1"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {request.status === 'pending' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(request.id, 'in_progress')}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg p-1"
                                  title="بدء المعالجة"
                                >
                                  <Clock className="h-3 w-3" />
                                </Button>
                              )}
                              {request.status === 'in_progress' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(request.id, 'completed')}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg p-1"
                                  title="إكمال الطلب"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    عرض {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredRequests.length)} إلى {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} من {filteredRequests.length} نتيجة
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                      السابق
                    </Button>
                    
                    <div className="flex gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Service Request Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              تفاصيل طلب الخدمة
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  معلومات الطالب
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">الاسم الكامل</p>
                    <p className="font-medium">
                      {selectedRequest.student_profiles?.first_name} {selectedRequest.student_profiles?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم الطالب</p>
                    <p className="font-medium">{selectedRequest.student_profiles?.student_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">البرنامج الأكاديمي</p>
                    <p className="font-medium">
                      {selectedRequest.student_profiles?.program_id 
                        ? getProgramName(selectedRequest.student_profiles.program_id as ProgramId)
                        : 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">القسم</p>
                    <p className="font-medium">
                      {selectedRequest.student_profiles?.department_id 
                        ? getDepartmentName(selectedRequest.student_profiles.department_id as DepartmentId)
                        : selectedRequest.student_profiles?.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">السنة الدراسية</p>
                    <p className="font-medium">السنة {selectedRequest.student_profiles?.academic_year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الفصل الدراسي</p>
                    <p className="font-medium">الفصل {selectedRequest.student_profiles?.semester}</p>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  تفاصيل الطلب
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-600">عنوان الطلب</p>
                    <p className="font-medium text-blue-800">{selectedRequest.title}</p>
                  </div>
                  {selectedRequest.description && (
                    <div>
                      <p className="text-sm text-blue-600">الوصف</p>
                      <p className="text-blue-800">{selectedRequest.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-blue-600">نوع الخدمة</p>
                      <Badge variant="outline" className="bg-white">
                        {serviceTypeLabels[selectedRequest.service_type] || selectedRequest.service_type}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">الأولوية</p>
                      {getPriorityBadge(selectedRequest.priority)}
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">الحالة</p>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="flex gap-2 justify-end">
                {selectedRequest.status === 'pending' && (
                  <Button 
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, 'in_progress');
                      setIsDetailDialogOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    بدء المعالجة
                  </Button>
                )}
                {selectedRequest.status === 'in_progress' && (
                  <Button 
                    onClick={() => {
                      handleUpdateStatus(selectedRequest.id, 'completed');
                      setIsDetailDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    إكمال الطلب
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedServicesManagement;