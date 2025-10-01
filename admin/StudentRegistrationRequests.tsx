import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  GraduationCap,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { useRegistrationRequests, useApproveRegistrationRequest, useRejectRegistrationRequest, RegistrationRequest } from '@/hooks/useRegistrationRequests';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const StudentRegistrationRequests = () => {
  const { user } = useAuth();
  const { data: requests, isLoading, error } = useRegistrationRequests();
  const approveRequest = useApproveRegistrationRequest();
  const rejectRequest = useRejectRegistrationRequest();

  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const filteredRequests = requests?.filter(request => {
    const matchesSearch = 
      request.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (requestId: string) => {
    if (!user?.id) return;
    await approveRequest.mutateAsync({ requestId, adminId: user.id });
  };

  const handleReject = async () => {
    if (!user?.id || !selectedRequest) return;
    await rejectRequest.mutateAsync({ 
      requestId: selectedRequest.id, 
      adminId: user.id, 
      reason: rejectionReason 
    });
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />في الانتظار</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />مقبول</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPendingCount = () => requests?.filter(r => r.status === 'pending').length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-university-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          حدث خطأ في تحميل طلبات التسجيل. يرجى المحاولة مرة أخرى.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-university-blue">طلبات التسجيل</h1>
          <p className="text-muted-foreground">إدارة طلبات التسجيل الجديدة للطلاب</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-university-blue">{getPendingCount()}</div>
          <div className="text-sm text-muted-foreground">طلب في الانتظار</div>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو البريد الإلكتروني أو رقم الطالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="pending">في الانتظار</TabsTrigger>
                <TabsTrigger value="approved">مقبول</TabsTrigger>
                <TabsTrigger value="rejected">مرفوض</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الطلبات */}
      <div className="grid gap-4">
        {filteredRequests?.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-university-blue/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-university-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.first_name} {request.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">رقم الطالب: {request.student_id}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {request.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {request.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {request.college}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(request.created_at), 'dd/MM/yyyy', { locale: ar })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                        <Eye className="w-4 h-4 mr-2" />
                        عرض التفاصيل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
                      <DialogHeader>
                        <DialogTitle>تفاصيل طلب التسجيل</DialogTitle>
                        <DialogDescription>
                          مراجعة بيانات الطالب ومعلومات التسجيل
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedRequest && (
                        <div className="space-y-6">
                          {/* معلومات شخصية */}
                          <div>
                            <h4 className="font-semibold mb-3 text-university-blue">المعلومات الشخصية</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <label className="font-medium">الاسم الأول:</label>
                                <p className="text-muted-foreground">{selectedRequest.first_name}</p>
                              </div>
                              <div>
                                <label className="font-medium">الاسم الأخير:</label>
                                <p className="text-muted-foreground">{selectedRequest.last_name}</p>
                              </div>
                              <div>
                                <label className="font-medium">البريد الإلكتروني:</label>
                                <p className="text-muted-foreground">{selectedRequest.email}</p>
                              </div>
                              <div>
                                <label className="font-medium">رقم الهاتف:</label>
                                <p className="text-muted-foreground">{selectedRequest.phone}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="font-medium">عنوان السكن:</label>
                                <p className="text-muted-foreground">{selectedRequest.address}</p>
                              </div>
                            </div>
                          </div>

                          {/* معلومات أكاديمية */}
                          <div>
                            <h4 className="font-semibold mb-3 text-university-blue">المعلومات الأكاديمية</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <label className="font-medium">رقم الطالب:</label>
                                <p className="text-muted-foreground">{selectedRequest.student_id}</p>
                              </div>
                              <div>
                                <label className="font-medium">الكلية:</label>
                                <p className="text-muted-foreground">{selectedRequest.college}</p>
                              </div>
                              <div>
                                <label className="font-medium">القسم:</label>
                                <p className="text-muted-foreground">{selectedRequest.department}</p>
                              </div>
                              <div>
                                <label className="font-medium">التخصص:</label>
                                <p className="text-muted-foreground">{selectedRequest.specialization}</p>
                              </div>
                              <div>
                                <label className="font-medium">السنة الأكاديمية:</label>
                                <p className="text-muted-foreground">{selectedRequest.academic_year}</p>
                              </div>
                              <div>
                                <label className="font-medium">الفصل الدراسي:</label>
                                <p className="text-muted-foreground">{selectedRequest.semester}</p>
                              </div>
                            </div>
                          </div>

                          {/* معلومات الطلب */}
                          <div>
                            <h4 className="font-semibold mb-3 text-university-blue">معلومات الطلب</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <label className="font-medium">تاريخ الطلب:</label>
                                <p className="text-muted-foreground">
                                  {format(new Date(selectedRequest.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                                </p>
                              </div>
                              <div>
                                <label className="font-medium">الحالة:</label>
                                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                              </div>
                              {selectedRequest.rejection_reason && (
                                <div className="col-span-2">
                                  <label className="font-medium">سبب الرفض:</label>
                                  <p className="text-red-600">{selectedRequest.rejection_reason}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* أزرار العمل */}
                          {selectedRequest.status === 'pending' && (
                            <div className="flex gap-3 pt-4 border-t">
                              <Button 
                                onClick={() => handleApprove(selectedRequest.id)}
                                disabled={approveRequest.isPending}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                قبول الطلب
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={() => setShowRejectDialog(true)}
                                disabled={rejectRequest.isPending}
                                className="flex-1"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                رفض الطلب
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {request.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(request.id)}
                        disabled={approveRequest.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        قبول
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectDialog(true);
                        }}
                        disabled={rejectRequest.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        رفض
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">لا توجد طلبات تسجيل</h3>
              <p className="text-muted-foreground">لم يتم العثور على أي طلبات تسجيل تطابق معايير البحث.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* نافذة رفض الطلب */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>رفض طلب التسجيل</DialogTitle>
            <DialogDescription>
              يرجى إدخال سبب رفض طلب التسجيل. سيتم إرسال هذا السبب للطالب.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="اكتب سبب رفض الطلب..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim() || rejectRequest.isPending}
            >
              رفض الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentRegistrationRequests;