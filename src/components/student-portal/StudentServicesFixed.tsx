import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  UserX,
  GraduationCap,
  Home,
  Car,
  Building
} from 'lucide-react';
import ServiceModal from './ServiceModal';
import AbsenceRequestModal from './AbsenceRequestModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface StudentServicesFixedProps {
  onTabChange?: (tab: string) => void;
}

const StudentServicesFixed: React.FC<StudentServicesFixedProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);

  const { data: serviceRequests, isLoading } = useQuery({
    queryKey: ['student-service-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!studentProfile) return [];

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('student_id', studentProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const services = [
    {
      id: 'transcript',
      title: 'كشف درجات',
      description: 'طلب كشف درجات رسمي',
      icon: FileText,
      color: 'bg-blue-500',
      category: 'documents',
    },
    {
      id: 'certificate',
      title: 'شهادة تخرج',
      description: 'طلب شهادة تخرج مصدقة',
      icon: GraduationCap,
      color: 'bg-green-500',
      category: 'documents',
    },
    {
      id: 'enrollment',
      title: 'إفادة قيد',
      description: 'طلب إفادة قيد للطالب',
      icon: User,
      color: 'bg-purple-500',
      category: 'documents',
    },
    {
      id: 'accommodation',
      title: 'طلب سكن',
      description: 'تقديم طلب للحصول على سكن جامعي',
      icon: Home,
      color: 'bg-orange-500',
      category: 'services',
    },
    {
      id: 'transport',
      title: 'مواصلات',
      description: 'طلب خدمة المواصلات الجامعية',
      icon: Car,
      color: 'bg-indigo-500',
      category: 'services',
    },
    {
      id: 'absence_request',
      title: 'طلب غياب',
      description: 'تقديم طلب غياب مع المبررات',
      icon: UserX,
      color: 'bg-red-500',
      category: 'academic',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in_progress':
        return 'قيد المعالجة';
      case 'pending':
        return 'في الانتظار';
      case 'cancelled':
        return 'ملغى';
      default:
        return 'غير معروف';
    }
  };

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'absence_request') {
      setIsAbsenceModalOpen(true);
    } else {
      setSelectedService(serviceId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">الخدمات الطلابية</h1>
          <p className="text-muted-foreground">اختر الخدمة المطلوبة وقدم طلبك بسهولة</p>
        </div>

        {/* خدمات متاحة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              الخدمات المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={service.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 border-2 hover:border-primary/20"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`${service.color} text-white p-2 rounded-lg shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* طلباتي */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              طلباتي ({serviceRequests?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                جاري التحميل...
              </div>
            ) : serviceRequests?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لم تقم بتقديم أي طلبات بعد
              </div>
            ) : (
              <div className="space-y-4">
                {serviceRequests?.map((request) => (
                  <Card key={request.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{request.title}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(request.status)}
                                {getStatusText(request.status)}
                              </div>
                            </Badge>
                          </div>
                          {request.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {request.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(request.created_at).toLocaleDateString('ar-EG')}
                          </div>
                        </div>
                        {request.response && (
                          <div className="sm:w-64">
                            <div className="text-xs font-medium text-gray-700 mb-1">الرد:</div>
                            <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded text-right">
                              {request.response}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* إرشادات */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">إرشادات مهمة</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• تأكد من صحة البيانات المدخلة قبل تقديم الطلب</li>
              <li>• قد يستغرق معالجة الطلب من 3-7 أيام عمل</li>
              <li>• سيتم إشعارك عبر الإشعارات عند تحديث حالة طلبك</li>
              <li>• يمكنك متابعة حالة طلباتك من هذه الصفحة</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Service Modal */}
      {selectedService && (
        <ServiceModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={services.find(s => s.id === selectedService)}
        />
      )}

      {/* Absence Request Modal */}
      <AbsenceRequestModal
        isOpen={isAbsenceModalOpen}
        onClose={() => setIsAbsenceModalOpen(false)}
      />
    </div>
  );
};

export default StudentServicesFixed;
