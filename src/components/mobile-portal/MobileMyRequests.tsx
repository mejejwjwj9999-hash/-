
import React, { useState } from 'react';
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
  Plus,
  ChevronLeft,
  User,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const MobileMyRequests = () => {
  const { profile } = useAuth();
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    service_type: 'transcript',
    priority: 'normal'
  });

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

  const submitRequest = async () => {
    if (!profile?.id || !newRequest.title.trim()) return;

    const { error } = await supabase
      .from('service_requests')
      .insert({
        student_id: profile.id,
        title: newRequest.title,
        description: newRequest.description,
        service_type: newRequest.service_type,
        priority: newRequest.priority,
        status: 'pending'
      });

    if (!error) {
      setNewRequest({
        title: '',
        description: '',
        service_type: 'transcript',
        priority: 'normal'
      });
      setShowNewRequestForm(false);
      refetch();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'قيد المراجعة', variant: 'outline' as const, icon: Clock, className: 'border-academic-gray text-academic-gray' },
      in_progress: { label: 'قيد المعالجة', variant: 'outline' as const, icon: AlertCircle, className: 'border-university-blue text-university-blue bg-university-blue/10' },
      completed: { label: 'مكتمل', variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-700 border border-green-300' },
      cancelled: { label: 'ملغى', variant: 'destructive' as const, icon: X, className: '' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`gap-1 text-xs ${config.className}`}>
        <Icon className="w-3 h-3" />
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
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-sm">جاري تحميل طلباتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-gray-light" dir="rtl">
      {/* رأس الصفحة بتدرج العلامة التجارية */}
      <div className="bg-hero-gradient text-white p-6 shadow-university">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7" />
            <h1 className="text-2xl font-bold">طلباتي</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => refetch()}
              variant="outline" 
              size="sm"
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              onClick={() => setShowNewRequestForm(true)}
              size="sm"
              className="gap-2 btn-secondary"
            >
              <Plus className="w-4 h-4" />
              طلب جديد
            </Button>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-6 space-y-6">

        {/* نموذج طلب جديد */}
        {showNewRequestForm && (
          <div className="card-elevated border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between text-university-blue">
                طلب خدمة جديد
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowNewRequestForm(false)}
                  className="text-academic-gray hover:text-university-blue"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-university-blue mb-2">نوع الخدمة</label>
                <select 
                  value={newRequest.service_type}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, service_type: e.target.value }))}
                  className="w-full p-3 border border-academic-gray/30 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-university-blue bg-white"
                >
                {Object.entries(serviceTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
              
              <div>
                <label className="block text-sm font-medium text-university-blue mb-2">عنوان الطلب</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان الطلب"
                  className="w-full p-3 border border-academic-gray/30 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-university-blue bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-university-blue mb-2">تفاصيل الطلب</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل تفاصيل إضافية للطلب"
                  rows={3}
                  className="w-full p-3 border border-academic-gray/30 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-university-blue bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-university-blue mb-2">الأولوية</label>
                <select 
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-3 border border-academic-gray/30 rounded-lg focus:ring-2 focus:ring-university-blue focus:border-university-blue bg-white"
                >
                <option value="low">منخفض</option>
                <option value="normal">عادي</option>
                <option value="high">مرتفع</option>
                <option value="urgent">عاجل</option>
              </select>
            </div>
            
              <div className="flex gap-3">
                <Button 
                  onClick={submitRequest}
                  disabled={!newRequest.title.trim()}
                  className="flex-1 btn-primary"
                >
                  إرسال الطلب
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewRequestForm(false)}
                  className="flex-1 border-academic-gray text-academic-gray hover:bg-academic-gray hover:text-white"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </div>
        )}

        {/* قائمة الطلبات */}
        {!requests || requests.length === 0 ? (
          <div className="text-center py-12 card-elevated border-dashed border-2 border-academic-gray/30">
            <CardContent>
              <FileText className="w-16 h-16 text-academic-gray/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-university-blue mb-2">لا توجد طلبات</h3>
              <p className="text-academic-gray mb-4">لم تقم بتقديم أي طلبات خدمة بعد</p>
              <Button onClick={() => setShowNewRequestForm(true)} className="gap-2 btn-primary">
                <Plus className="w-4 h-4" />
                أضف طلبك الأول
              </Button>
            </CardContent>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="card-elevated border-0 hover:shadow-university transition-all duration-300">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-university-blue mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-university-gold font-medium">
                          {serviceTypeLabels[request.service_type] || request.service_type}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    {request.description && (
                      <p className="text-academic-gray text-sm bg-academic-gray-light rounded-lg p-3 border-r-4 border-university-blue/30">
                        {request.description}
                      </p>
                    )}
                    
                    {request.response && (
                      <div className="bg-university-gold-light border-r-4 border-university-gold rounded-lg p-3">
                        <p className="text-sm font-medium text-university-blue mb-1">الرد من الإدارة:</p>
                        <p className="text-sm text-academic-gray">{request.response}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-academic-gray pt-3 border-t border-academic-gray/20">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-university-blue" />
                        <span>{format(new Date(request.created_at), 'dd MMM yyyy', { locale: ar })}</span>
                      </div>
                      {request.completed_at && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-university-gold" />
                          <span>مكتمل: {format(new Date(request.completed_at), 'dd MMM yyyy', { locale: ar })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMyRequests;
