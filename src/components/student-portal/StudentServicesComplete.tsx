import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  BookOpen,
  Users,
  Heart,
  Bus,
  Utensils,
  Wifi,
  Library,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const StudentServicesComplete = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<any>(null);

  // Fetch service requests
  const { data: serviceRequests, isLoading } = useQuery({
    queryKey: ['service-requests', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Fetch appointments
  const { data: appointments } = useQuery({
    queryKey: ['appointments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', profile.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!profile?.id,
  });

  const services = [
    {
      id: 'academic_counseling',
      name: 'الإرشاد الأكاديمي',
      description: 'استشارة أكاديمية وتخطيط المسار الدراسي',
      icon: BookOpen,
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'health_services',
      name: 'الخدمات الصحية',
      description: 'العيادة الطبية والإسعافات الأولية',
      icon: Heart,
      color: 'bg-red-500',
      available: true
    },
    {
      id: 'transportation',
      name: 'خدمة النقل',
      description: 'حجز المواصلات الجامعية',
      icon: Bus,
      color: 'bg-green-500',
      available: true
    },
    {
      id: 'library_services',
      name: 'خدمات المكتبة',
      description: 'إعارة الكتب والمراجع العلمية',
      icon: Library,
      color: 'bg-purple-500',
      available: true
    },
    {
      id: 'cafeteria',
      name: 'خدمات التغذية',
      description: 'وجبات الكافيتيريا والمطعم الجامعي',
      icon: Utensils,
      color: 'bg-orange-500',
      available: true
    },
    {
      id: 'wifi_support',
      name: 'الدعم التقني',
      description: 'دعم الشبكة والأنظمة التقنية',
      icon: Wifi,
      color: 'bg-indigo-500',
      available: true
    },
    {
      id: 'student_clubs',
      name: 'الأنشطة الطلابية',
      description: 'النوادي والأنشطة الطلابية',
      icon: Users,
      color: 'bg-pink-500',
      available: true
    },
    {
      id: 'counseling',
      name: 'الإرشاد النفسي',
      description: 'الاستشارة النفسية والاجتماعية',
      icon: MessageCircle,
      color: 'bg-cyan-500',
      available: true
    }
  ];

  const handleServiceRequest = (service: any) => {
    toast({
      title: "طلب الخدمة",
      description: `تم إرسال طلب ${service.name} بنجاح`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': case 'in_progress': return Clock;
      default: return Clock;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-academic-gray-light rounded w-48"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-academic-gray-light rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-section-title">الخدمات الطلابية</h2>
        <Badge variant="outline" className="text-sm">
          خدمات متاحة 24/7
        </Badge>
      </div>

      {/* Services Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-university-blue" />
            <div className="text-2xl font-bold text-university-blue">
              {services.length}
            </div>
            <div className="text-sm text-academic-gray">الخدمات المتاحة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-university-blue">
              {serviceRequests?.filter((r: any) => r.status === 'completed').length || 0}
            </div>
            <div className="text-sm text-academic-gray">طلبات مكتملة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-university-blue">
              {serviceRequests?.filter((r: any) => 
                r.status === 'pending' || r.status === 'in_progress'
              ).length || 0}
            </div>
            <div className="text-sm text-academic-gray">طلبات معلقة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-university-blue">
              {appointments?.filter((a: any) => a.status === 'scheduled').length || 0}
            </div>
            <div className="text-sm text-academic-gray">مواعيد مقررة</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-university-blue" />
            الخدمات المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="hover:shadow-medium transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${service.color} text-white mb-3`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-university-blue mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-academic-gray mb-3">
                    {service.description}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceRequest(service);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    طلب الخدمة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Requests History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-university-blue" />
            سجل طلبات الخدمات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceRequests?.map((request: any) => {
            const StatusIcon = getStatusIcon(request.status);
            
            return (
              <Card key={request.id} className="border-r-4 border-r-university-blue">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <StatusIcon className={`h-6 w-6 mt-1 ${
                          request.status === 'completed' ? 'text-green-600' :
                          request.status === 'pending' || request.status === 'in_progress' ? 'text-yellow-600' :
                          'text-red-600'
                        }`} />
                        <div>
                          <h3 className="text-lg font-semibold text-university-blue">
                            {request.title}
                          </h3>
                          <p className="text-sm text-academic-gray">
                            {request.description}
                          </p>
                          {request.response && (
                            <p className="text-xs text-green-600 mt-1">
                              الرد: {request.response}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      {/* Request Info */}
                      <div className="text-right text-sm">
                        <div className="text-academic-gray">
                          تاريخ الطلب: {new Date(request.created_at).toLocaleDateString('ar-YE')}
                        </div>
                        {request.due_date && (
                          <div className="text-academic-gray">
                            الموعد المتوقع: {new Date(request.due_date).toLocaleDateString('ar-YE')}
                          </div>
                        )}
                        {request.assigned_to && (
                          <div className="text-xs text-academic-gray">
                            المسؤول: {request.assigned_to}
                          </div>
                        )}
                      </div>
                      
                      {/* Status & Priority */}
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          className={`${getStatusColor(request.status)} border text-xs`}
                        >
                          {request.status === 'completed' ? 'مكتمل' :
                           request.status === 'pending' ? 'قيد الانتظار' :
                           request.status === 'in_progress' ? 'قيد التنفيذ' :
                           request.status === 'rejected' ? 'مرفوض' : 'غير محدد'}
                        </Badge>
                        
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            request.priority === 'high' ? 'border-red-300 text-red-600' :
                            request.priority === 'normal' ? 'border-yellow-300 text-yellow-600' :
                            'border-green-300 text-green-600'
                          }`}
                        >
                          {request.priority === 'high' ? 'عاجل' :
                           request.priority === 'normal' ? 'عادي' : 'منخفض'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {(!serviceRequests || serviceRequests.length === 0) && (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-academic-gray mx-auto mb-4" />
              <p className="text-lg text-academic-gray">لا توجد طلبات خدمات</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      {appointments && appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-university-blue" />
              المواعيد القادمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.slice(0, 3).map((appointment: any) => (
              <Card key={appointment.id} className="bg-academic-gray-light">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-university-blue">
                        {appointment.title}
                      </h4>
                      <p className="text-sm text-academic-gray">
                        {appointment.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-academic-gray">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {appointment.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {appointment.staff_member}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-university-blue">
                        {new Date(appointment.appointment_date).toLocaleDateString('ar-YE')}
                      </div>
                      <div className="text-sm text-academic-gray">
                        {new Date(appointment.appointment_date).toLocaleTimeString('ar-YE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-university-blue" />
            معلومات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-academic-gray-light rounded-lg">
              <Phone className="h-8 w-8 mx-auto mb-2 text-university-blue" />
              <h4 className="font-semibold text-university-blue mb-1">الدعم الفني</h4>
              <p className="text-sm text-academic-gray">+967-1-123456</p>
              <p className="text-xs text-academic-gray">24/7</p>
            </div>
            <div className="text-center p-4 bg-academic-gray-light rounded-lg">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-university-blue" />
              <h4 className="font-semibold text-university-blue mb-1">الاستفسارات</h4>
              <p className="text-sm text-academic-gray">info@aylol.edu.ye</p>
              <p className="text-xs text-academic-gray">رد خلال 24 ساعة</p>
            </div>
            <div className="text-center p-4 bg-academic-gray-light rounded-lg">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-university-blue" />
              <h4 className="font-semibold text-university-blue mb-1">مكتب الخدمات</h4>
              <p className="text-sm text-academic-gray">الطابق الأرضي</p>
              <p className="text-xs text-academic-gray">8:00 ص - 4:00 م</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentServicesComplete;