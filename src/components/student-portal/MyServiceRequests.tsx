
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X, 
  FileText,
  RefreshCw,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const MyServiceRequests = () => {
  const { profile } = useAuth();

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['my-service-requests', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'قيد المراجعة', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      in_progress: { label: 'قيد المعالجة', variant: 'default' as const, icon: AlertCircle, color: 'text-blue-600' },
      completed: { label: 'مكتمل', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      cancelled: { label: 'ملغى', variant: 'destructive' as const, icon: X, color: 'text-red-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'منخفض', className: 'bg-gray-100 text-gray-700' },
      normal: { label: 'عادي', className: 'bg-blue-100 text-blue-700' },
      high: { label: 'مرتفع', className: 'bg-orange-100 text-orange-700' },
      urgent: { label: 'عاجل', className: 'bg-red-100 text-red-700' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;
    
    return (
      <Badge variant="outline" className={`${config.className} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const serviceTypeLabels: { [key: string]: string } = {
    transcript: 'كشف الدرجات',
    certificate: 'شهادة التخرج',
    enrollment: 'إفادة قيد',
    payment_receipt: 'إيصال دفع',
    schedule_change: 'تعديل الجدول',
    technical_support: 'الدعم التقني',
    contact_admin: 'التواصل مع الإدارة',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">جاري تحميل طلباتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-800">طلباتي</h2>
        </div>
        <Button 
          onClick={() => refetch()}
          variant="outline" 
          size="sm"
          className="gap-2 rounded-xl"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث
        </Button>
      </div>

      {!requests || requests.length === 0 ? (
        <Card className="text-center py-12 border-dashed border-2">
          <CardContent>
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-500">لم تقم بتقديم أي طلبات خدمة بعد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-primary font-medium">
                          {serviceTypeLabels[request.service_type] || request.service_type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getPriorityBadge(request.priority)}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    
                    {request.description && (
                      <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                        {request.description}
                      </p>
                    )}
                    
                    {request.response && (
                      <div className="bg-green-50 border-r-4 border-green-400 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800 mb-1">الرد من الإدارة:</p>
                        <p className="text-sm text-green-700">{request.response}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>تاريخ التقديم: {format(new Date(request.created_at), 'dd MMMM yyyy - hh:mm a', { locale: ar })}</span>
                      {request.completed_at && (
                        <span>تاريخ الإنجاز: {format(new Date(request.completed_at), 'dd MMMM yyyy', { locale: ar })}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServiceRequests;
