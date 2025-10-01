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
import { Search, Eye, Check, X, Clock, FileText, AlertCircle } from "lucide-react";
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
};

const ServicesManagement: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: serviceRequests, isLoading } = useQuery({
    queryKey: ["admin-services"],
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
            email
          )
        `)
        .order("created_at", { ascending: false });
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
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: "تم التحديث", description: "تم تحديث حالة الطلب بنجاح." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في تحديث حالة الطلب.", variant: "destructive" });
    },
  });

  const filteredRequests = serviceRequests?.filter((request: any) => {
    const student = request.student_profiles;
    const matchesSearch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

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

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
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

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
              إدارة طلبات الخدمات
            </h1>
            <p className="text-gray-600">متابعة ومعالجة طلبات الخدمات الطلابية</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{serviceRequests?.length || 0}</div>
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
            <div className="text-3xl font-bold text-yellow-700">
              {serviceRequests?.filter(r => r.status === 'pending').length || 0}
            </div>
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
            <div className="text-3xl font-bold text-blue-700">
              {serviceRequests?.filter(r => r.status === 'in_progress').length || 0}
            </div>
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
            <div className="text-3xl font-bold text-green-700">
              {serviceRequests?.filter(r => r.status === 'completed').length || 0}
            </div>
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
            <div className="text-3xl font-bold text-gray-700">
              {serviceRequests?.length || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">جميع الطلبات</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filter */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، رقم الطالب، أو عنوان الطلب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 rounded-xl border-2 focus:border-primary/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-xl border-2">
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Services Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            طلبات الخدمات ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-right font-semibold">اسم الطالب</TableHead>
                    <TableHead className="text-right font-semibold">عنوان الطلب</TableHead>
                    <TableHead className="text-center font-semibold">نوع الخدمة</TableHead>
                    <TableHead className="text-center font-semibold">الأولوية</TableHead>
                    <TableHead className="text-center font-semibold">الحالة</TableHead>
                    <TableHead className="text-center font-semibold">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-center font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests?.map((request: any) => {
                    const student = request.student_profiles;
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
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-48">
                          <div className="truncate" title={request.title}>
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
                          <div className="flex gap-2 justify-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                              className="rounded-lg"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {request.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(request.id, 'in_progress')}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                              >
                                بدء المعالجة
                              </Button>
                            )}
                            {request.status === 'in_progress' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(request.id, 'completed')}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
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
          )}
        </CardContent>
      </Card>

      {/* Enhanced Service Request Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              تفاصيل طلب الخدمة
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">معلومات الطالب</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">الاسم الكامل</p>
                    <p className="font-medium">
                      {(selectedRequest as any).student_profiles?.first_name} {(selectedRequest as any).student_profiles?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم الطالب</p>
                    <p className="font-medium">{(selectedRequest as any).student_profiles?.student_id}</p>
                  </div>
                </div>
              </div>
              
              {/* Request Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">تفاصيل الطلب</h4>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-medium text-blue-900 mb-2">{selectedRequest.title}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        {serviceTypeLabels[selectedRequest.service_type] || selectedRequest.service_type}
                      </Badge>
                      {getPriorityBadge(selectedRequest.priority)}
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    {selectedRequest.description && (
                      <p className="text-blue-800 text-sm">{selectedRequest.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedRequest.response && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2">الرد الحالي</h4>
                  <p className="text-green-700">{selectedRequest.response}</p>
                </div>
              )}
              
              {/* Response Form */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">إضافة أو تعديل الرد</h4>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const response = formData.get("response") as string;
                    updateServiceStatus.mutate({ 
                      id: selectedRequest.id, 
                      status: selectedRequest.status, 
                      response 
                    });
                    setIsDetailDialogOpen(false);
                  }}
                  className="space-y-4"
                >
                  <Textarea
                    name="response"
                    placeholder="اكتب ردك هنا..."
                    defaultValue={selectedRequest.response || ""}
                    className="rounded-xl border-2 focus:border-primary/50 min-h-[120px]"
                  />
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-primary to-primary/90">
                      حفظ الرد
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;
