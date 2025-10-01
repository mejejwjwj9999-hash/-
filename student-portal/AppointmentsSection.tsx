import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Plus, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AppointmentsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    appointment_type: '',
    title: '',
    description: '',
    appointment_date: '',
    appointment_time: '',
    staff_member: '',
    location: '',
    notes: ''
  });

  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', studentProfile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', studentProfile?.id)
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentProfile?.id,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      try {
        if (!studentProfile?.id) {
          throw new Error('معرف الطالب غير متاح');
        }

        const appointmentDateTime = `${appointmentData.appointment_date}T${appointmentData.appointment_time}:00`;
        
        const { data, error } = await supabase
          .from('appointments')
          .insert([{
            student_id: studentProfile.id,
            appointment_type: appointmentData.appointment_type,
            title: appointmentData.title,
            description: appointmentData.description || '',
            appointment_date: appointmentDateTime,
            staff_member: appointmentData.staff_member || '',
            location: appointmentData.location || '',
            notes: appointmentData.notes || '',
            status: 'scheduled'
          }])
          .select()
          .single();
        
        if (error) {
          console.error('Database error:', error);
          throw new Error('خطأ في قاعدة البيانات: ' + error.message);
        }
        
        return data;
      } catch (error) {
        console.error('Appointment creation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsBookingDialogOpen(false);
      setBookingForm({
        appointment_type: '',
        title: '',
        description: '',
        appointment_date: '',
        appointment_time: '',
        staff_member: '',
        location: '',
        notes: ''
      });
      toast({
        title: "تم حجز الموعد بنجاح",
        description: "سيتم التواصل معك لتأكيد الموعد",
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "خطأ في حجز الموعد",
        description: error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مجدول';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      case 'rescheduled': return 'معاد الجدولة';
      default: return 'غير محدد';
    }
  };

  const getAppointmentTypeText = (type: string) => {
    const types: Record<string, string> = {
      'academic_advising': 'إرشاد أكاديمي',
      'financial_aid': 'مساعدة مالية',
      'career_counseling': 'استشارة مهنية',
      'health_services': 'خدمات صحية',
      'student_affairs': 'شؤون الطلاب',
      'it_support': 'دعم تقني',
      'library': 'مكتبة',
      'registration': 'تسجيل'
    };
    return types[type] || type;
  };

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getAppointmentTypeText(appointment.appointment_type).includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!bookingForm.appointment_type || !bookingForm.title || !bookingForm.appointment_date || !bookingForm.appointment_time) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    createAppointmentMutation.mutate(bookingForm);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">المواعيد</h2>
          <p className="text-gray-600 mt-1">إدارة وحجز المواعيد مع الموظفين</p>
        </div>
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              حجز موعد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>حجز موعد جديد</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">نوع الموعد *</label>
                  <Select value={bookingForm.appointment_type} onValueChange={(value) => handleInputChange('appointment_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الموعد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic_advising">إرشاد أكاديمي</SelectItem>
                      <SelectItem value="financial_aid">مساعدة مالية</SelectItem>
                      <SelectItem value="career_counseling">استشارة مهنية</SelectItem>
                      <SelectItem value="health_services">خدمات صحية</SelectItem>
                      <SelectItem value="student_affairs">شؤون الطلاب</SelectItem>
                      <SelectItem value="it_support">دعم تقني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">الموظف المسؤول</label>
                  <Input
                    placeholder="اسم الموظف"
                    value={bookingForm.staff_member}
                    onChange={(e) => handleInputChange('staff_member', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">عنوان الموعد *</label>
                <Input
                  placeholder="عنوان الموعد"
                  value={bookingForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف</label>
                <Textarea
                  placeholder="تفاصيل الموعد..."
                  value={bookingForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">التاريخ *</label>
                  <Input
                    type="date"
                    value={bookingForm.appointment_date}
                    onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">الوقت *</label>
                  <Input
                    type="time"
                    value={bookingForm.appointment_time}
                    onChange={(e) => handleInputChange('appointment_time', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">المكان</label>
                  <Input
                    placeholder="مكان الموعد"
                    value={bookingForm.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">ملاحظات</label>
                  <Input
                    placeholder="ملاحظات إضافية"
                    value={bookingForm.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmit} disabled={createAppointmentMutation.isPending}>
                {createAppointmentMutation.isPending ? 'جاري الحجز...' : 'حجز الموعد'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في المواعيد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 ml-2" />
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="scheduled">مجدول</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
            <SelectItem value="rescheduled">معاد الجدولة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments && filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.title}
                      </h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getAppointmentTypeText(appointment.appointment_type)}
                      </Badge>
                    </div>
                    
                    {appointment.description && (
                      <p className="text-gray-600 mb-3">{appointment.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(appointment.appointment_date).toLocaleDateString('ar-SA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(appointment.appointment_date).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {appointment.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {appointment.location}
                        </span>
                      )}
                      {appointment.staff_member && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {appointment.staff_member}
                        </span>
                      )}
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>ملاحظات:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button size="sm" variant="outline">
                          تعديل
                        </Button>
                        <Button size="sm" variant="outline">
                          إلغاء
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد مواعيد
              </h3>
              <p className="text-gray-600 mb-4">
                لم يتم العثور على مواعيد مطابقة للبحث المحدد
              </p>
              <Button onClick={() => setIsBookingDialogOpen(true)}>
                حجز موعد جديد
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      {appointments && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {appointments.length}
              </div>
              <div className="text-sm text-gray-600">إجمالي المواعيد</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600">مجدول</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">مكتمل</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {appointments.filter(a => a.status === 'cancelled').length}
              </div>
              <div className="text-sm text-gray-600">ملغي</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;