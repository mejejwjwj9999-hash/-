import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  student_id: string;
  service_type: string;
  status: string;
  description: string;
  title: string;
  documents: any;
  created_at: string;
  updated_at: string;
  response?: string;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  priority: string;
  student_profile?: {
    first_name: string;
    last_name: string;
    email: string;
    student_id: string;
  } | null;
}

const StudentRequestsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['student-requests', searchTerm, statusFilter],
    queryFn: async () => {
      console.log('Fetching service requests...');
      
      // First, get all service requests
      let query = supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(
          `service_type.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      const { data: serviceRequests, error: requestsError } = await query;
      if (requestsError) {
        console.error('Error fetching service requests:', requestsError);
        throw requestsError;
      }

      console.log('Service requests fetched:', serviceRequests);

      // Then get all student profiles
      const { data: studentProfiles, error: profilesError } = await supabase
        .from('student_profiles')
        .select('id, first_name, last_name, email, student_id');

      if (profilesError) {
        console.error('Error fetching student profiles:', profilesError);
        throw profilesError;
      }

      console.log('Student profiles fetched:', studentProfiles);

      // Manually join the data
      const requestsWithProfiles: ServiceRequest[] = serviceRequests.map(request => {
        const studentProfile = studentProfiles.find(profile => profile.id === request.student_id);
        return {
          ...request,
          student_profile: studentProfile ? {
            first_name: studentProfile.first_name,
            last_name: studentProfile.last_name,
            email: studentProfile.email,
            student_id: studentProfile.student_id
          } : null
        };
      });

      console.log('Final requests with profiles:', requestsWithProfiles);
      return requestsWithProfiles;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status, response }: { requestId: string; status: string; response?: string }) => {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (response) {
        updateData.response = response;
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('service_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-requests'] });
      toast.success('تم تحديث حالة الطلب بنجاح');
      setIsResponseModalOpen(false);
      setAdminResponse('');
      setSelectedRequest(null);
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث حالة الطلب');
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'معلق', variant: 'secondary' as const, icon: Clock },
      in_progress: { label: 'قيد المعالجة', variant: 'default' as const, icon: AlertTriangle },
      completed: { label: 'مكتمل', variant: 'secondary' as const, icon: CheckCircle },
      cancelled: { label: 'ملغى', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const serviceTypes: Record<string, string> = {
      transcript: 'كشف الدرجات',
      graduation_certificate: 'شهادة التخرج',
      enrollment_certificate: 'إفادة القيد',
      payment_receipt: 'إيصال الدفع',
      schedule_modification: 'تعديل الجدول',
      leave_request: 'طلب إجازة',
      course_withdrawal: 'انسحاب من مقرر',
      grade_appeal: 'اعتراض على الدرجة',
      other: 'أخرى'
    };
    
    return serviceTypes[serviceType] || serviceType;
  };

  const handleUpdateStatus = (request: ServiceRequest, status: string) => {
    if (status === 'completed' || status === 'cancelled') {
      setSelectedRequest({ ...request, status }); // Set the intended status
      setIsResponseModalOpen(true);
    } else {
      updateStatusMutation.mutate({ requestId: request.id, status });
    }
  };

  const handleSubmitResponse = () => {
    if (selectedRequest) {
      updateStatusMutation.mutate({
        requestId: selectedRequest.id,
        status: selectedRequest.status, // Use the status we set in handleUpdateStatus
        response: adminResponse
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">طلبات الخدمات الطلابية</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue placeholder="حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الطلبات</SelectItem>
              <SelectItem value="pending">معلق</SelectItem>
              <SelectItem value="in_progress">قيد المعالجة</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="cancelled">ملغى</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {requests?.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        {getServiceTypeLabel(request.service_type)}
                      </h3>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {request.student_profile 
                          ? `${request.student_profile.first_name} ${request.student_profile.last_name}`
                          : 'غير محدد'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">رقم الطالب:</span>
                      <span>{request.student_profile?.student_id || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>

                  {request.description && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>تفاصيل الطلب:</strong>
                      </p>
                      <p className="text-sm mt-1">{request.description}</p>
                    </div>
                  )}

                  {request.response && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium text-blue-800">رد الإدارة:</p>
                      </div>
                      <p className="text-sm text-blue-700">{request.response}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {request.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(request, 'in_progress')}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        بدء المعالجة
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(request, 'completed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        إنجاز
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(request, 'cancelled')}
                      >
                        إلغاء
                      </Button>
                    </>
                  )}
                  
                  {request.status === 'in_progress' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(request, 'completed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        إنجاز
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(request, 'cancelled')}
                      >
                        إلغاء
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {requests?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-500">لا توجد طلبات خدمات مطابقة للبحث الحالي</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة رد الإدارة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="اكتب رد الإدارة على الطلب..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsResponseModalOpen(false);
                  setAdminResponse('');
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSubmitResponse}
                disabled={!adminResponse.trim()}
              >
                إرسال الرد
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentRequestsManagement;
