
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X,
  Search,
  Filter,
  MessageSquare,
  Calendar,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import ServiceRequestModal from './ServiceRequestModal';

const MobileServiceRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: requests, isLoading, refetch } = useServiceRequests();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'قيد المراجعة', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'قيد المعالجة', icon: AlertCircle, className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'مكتمل', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغى', icon: X, className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.className} border-0 gap-1`}>
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
      <Badge variant="outline" className={`${config.className} border-0 text-xs`}>
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

  const filteredRequests = requests?.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTypeLabels[request.service_type]?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  const statusCounts = {
    all: requests?.length || 0,
    pending: requests?.filter(r => r.status === 'pending').length || 0,
    in_progress: requests?.filter(r => r.status === 'in_progress').length || 0,
    completed: requests?.filter(r => r.status === 'completed').length || 0,
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">طلباتي</h1>
          <p className="text-sm text-gray-600">متابعة حالة الطلبات المرسلة</p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => refetch()}
          className="rounded-full"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 rounded-xl"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'الكل', count: statusCounts.all },
            { id: 'pending', label: 'قيد المراجعة', count: statusCounts.pending },
            { id: 'in_progress', label: 'قيد المعالجة', count: statusCounts.in_progress },
            { id: 'completed', label: 'مكتمل', count: statusCounts.completed }
          ].map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="whitespace-nowrap rounded-full gap-1"
            >
              {filter.label}
              <Badge variant="secondary" className="text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium text-gray-600 mb-1">لا توجد طلبات</h3>
              <p className="text-sm text-gray-500">
                {searchTerm || selectedFilter !== 'all' ? 
                  'لم يتم العثور على طلبات تطابق البحث' : 
                  'لم تقم بتقديم أي طلبات بعد'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">
                        {request.title}
                      </h3>
                      <p className="text-xs text-primary font-medium">
                        {serviceTypeLabels[request.service_type] || request.service_type}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                  </div>
                  
                  {/* Description */}
                  {request.description && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {request.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Response */}
                  {request.response && (
                    <div className="bg-green-50 border-r-4 border-green-400 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium text-green-700">الرد من الإدارة:</span>
                      </div>
                      <p className="text-xs text-green-700 leading-relaxed">{request.response}</p>
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(request.created_at), 'dd MMM yyyy - hh:mm a', { locale: ar })}</span>
                    </div>
                    {request.completed_at && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>مكتمل في {format(new Date(request.completed_at), 'dd MMM', { locale: ar })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Add Button */}
      <Button 
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg"
        size="lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-5 h-5 ml-2" />
        طلب خدمة جديدة
      </Button>

      {/* Service Request Modal */}
      <ServiceRequestModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        service={null}
      />
    </div>
  );
};

export default MobileServiceRequests;
