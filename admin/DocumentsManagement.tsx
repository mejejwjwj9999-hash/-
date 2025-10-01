import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Download, Eye, Check, X, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Document = {
  id: string;
  student_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  status: string;
  is_official: boolean;
  verification_code?: string;
  issued_date?: string;
  expiry_date?: string;
  created_at: string;
};

const DocumentsManagement: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: documents, isLoading } = useQuery({
    queryKey: ["admin-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
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

  const updateDocumentStatus = useMutation({
    mutationFn: async ({ id, status, isOfficial }: { id: string; status: string; isOfficial?: boolean }) => {
      const updateData: any = { status };
      if (isOfficial !== undefined) {
        updateData.is_official = isOfficial;
        if (isOfficial && status === 'active') {
          updateData.verification_code = generateVerificationCode();
          updateData.issued_date = new Date().toISOString();
        }
      }
      
      const { error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-documents"] });
      toast({ title: "تم التحديث", description: "تم تحديث حالة الوثيقة بنجاح." });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في تحديث حالة الوثيقة.", variant: "destructive" });
    },
  });

  const generateVerificationCode = () => {
    return 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const filteredDocuments = documents?.filter((document: any) => {
    const student = document.student_profiles;
    const matchesSearch = !searchTerm || 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || document.status === statusFilter;
    const matchesType = typeFilter === "all" || document.document_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "نشط", variant: "default" as const },
      pending: { label: "قيد المراجعة", variant: "secondary" as const },
      expired: { label: "منتهي الصلاحية", variant: "destructive" as const },
      revoked: { label: "ملغى", variant: "outline" as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const documentTypeLabels: { [key: string]: string } = {
    transcript: "كشف درجات",
    certificate: "شهادة تخرج",
    enrollment: "إفادة قيد",
    id_card: "بطاقة طالب",
    recommendation: "خطاب توصية",
    other: "أخرى"
  };

  const handleApprove = (documentId: string) => {
    updateDocumentStatus.mutate({ id: documentId, status: 'active', isOfficial: true });
  };

  const handleReject = (documentId: string) => {
    updateDocumentStatus.mutate({ id: documentId, status: 'revoked' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الوثائق</h1>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">إجمالي الوثائق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">قيد المراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {documents?.filter(d => d.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">وثائق معتمدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documents?.filter(d => d.status === 'active' && d.is_official).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">منتهية الصلاحية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {documents?.filter(d => d.status === 'expired').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، رقم الطالب، أو اسم الوثيقة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                <SelectItem value="revoked">ملغى</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="transcript">كشف درجات</SelectItem>
                <SelectItem value="certificate">شهادة تخرج</SelectItem>
                <SelectItem value="enrollment">إفادة قيد</SelectItem>
                <SelectItem value="id_card">بطاقة طالب</SelectItem>
                <SelectItem value="recommendation">خطاب توصية</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول الوثائق */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            الوثائق ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الطالب</TableHead>
                    <TableHead>اسم الوثيقة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحجم</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>معتمدة</TableHead>
                    <TableHead>رمز التحقق</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments?.map((document: any) => {
                    const student = document.student_profiles;
                    return (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.first_name} {student.last_name}</div>
                            <div className="text-sm text-muted-foreground">{student.student_id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{document.document_name}</TableCell>
                        <TableCell>
                          {documentTypeLabels[document.document_type] || document.document_type}
                        </TableCell>
                        <TableCell>{formatFileSize(document.file_size)}</TableCell>
                        <TableCell>{getStatusBadge(document.status)}</TableCell>
                        <TableCell>
                          <Badge variant={document.is_official ? "default" : "outline"}>
                            {document.is_official ? "معتمدة" : "غير معتمدة"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {document.verification_code || '-'}
                          </code>
                        </TableCell>
                        <TableCell>
                          {new Date(document.created_at).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                            {document.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleApprove(document.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReject(document.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
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
    </div>
  );
};

export default DocumentsManagement;