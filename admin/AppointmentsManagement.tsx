
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin
} from 'lucide-react';

type Appointment = {
  id: string;
  student_id?: string;
  appointment_date: string;
  appointment_type: string;
  title: string;
  description?: string;
  status: string;
  duration_minutes?: number;
  location?: string;
  staff_member?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

const AppointmentsManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: async (): Promise<Appointment[]> => {
      console.log('جاري تحميل المواعيد...');
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('appointment_date', { ascending: true });
        
        if (error) {
          console.error('خطأ في تحميل المواعيد:', error);
          throw new Error(`فشل في تحميل المواعيد: ${error.message}`);
        }
        
        console.log('تم تحميل المواعيد بنجاح:', data?.length || 0);
        return (data as Appointment[]) || [];
      } catch (err) {
        console.error('خطأ غير متوقع في تحميل المواعيد:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const updateAppointmentStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      console.log('تحديث حالة الموعد:', id, 'إلى:', status);
      
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('خطأ في تحديث حالة الموعد:', error);
        throw new Error(`فشل في تحديث حالة الموعد: ${error.message}`);
      }
      
      console.log('تم تحديث حالة الموعد بنجاح');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة الموعد بنجاح.',
      });
    },
    onError: (error: any) => {
      console.error('فشل في تحديث حالة الموعد:', error);
      toast({
        title: 'خطأ في التحديث',
        description: error.message || 'فشل في تحديث حالة الموعد.',
        variant: 'destructive',
      });
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      console.log('حذف الموعد:', id);
      
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('خطأ في حذف الموعد:', error);
        throw new Error(`فشل في حذف الموعد: ${error.message}`);
      }
      
      console.log('تم حذف الموعد بنجاح');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الموعد بنجاح.',
      });
    },
    onError: (error: any) => {
      console.error('فشل في حذف الموعد:', error);
      toast({
        title: 'خطأ في الحذف',
        description: error.message || 'فشل في حذف الموعد.',
        variant: 'destructive',
      });
    },
  });

  const addAppointment = useMutation({
    mutationFn: async (appointmentData: any) => {
      console.log('إضافة موعد جديد:', appointmentData);
      
      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);
      
      if (error) {
        console.error('خطأ في إضافة الموعد:', error);
        throw new Error(`فشل في إضافة الموعد: ${error.message}`);
      }
      
      console.log('تم إضافة الموعد بنجاح');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      toast({
        title: 'تم الإضافة',
        description: 'تم إضافة الموعد بنجاح.',
      });
      setShowAddModal(false);
    },
    onError: (error: any) => {
      console.error('فشل في إضافة الموعد:', error);
      toast({
        title: 'خطأ في الإضافة',
        description: error.message || 'فشل في إضافة الموعد.',
        variant: 'destructive',
      });
    },
  });

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchTerm || 
      appointment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.staff_member?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.appointment_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'مجدول', className: 'bg-blue-100 text-blue-800', icon: Clock },
      confirmed: { label: 'مؤكد', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { label: 'مكتمل', className: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      cancelled: { label: 'ملغي', className: 'bg-red-100 text-red-800', icon: XCircle },
      rescheduled: { label: 'معاد جدولته', className: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.className}>
        <IconComponent className="w-3 h-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  const appointmentTypes = Array.from(new Set(appointments.map(a => a.appointment_type).filter(Boolean)));

  const handleStatusChange = (id: string, newStatus: string) => {
    updateAppointmentStatus.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الموعد "${title}"؟`)) {
      deleteAppointment.mutate(id);
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const appointmentData = {
      title: formData.get('title') as string,
      appointment_type: formData.get('appointment_type') as string,
      appointment_date: formData.get('appointment_date') as string,
      duration_minutes: parseInt(formData.get('duration_minutes') as string) || 30,
      location: formData.get('location') as string,
      staff_member: formData.get('staff_member') as string,
      description: formData.get('description') as string,
      status: 'scheduled'
    };

    addAppointment.mutate(appointmentData);
  };

  // إحصائيات سريعة
  const stats = {
    total: filteredAppointments.length,
    scheduled: filteredAppointments.filter(a => a.status === 'scheduled').length,
    confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
    cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length,
  };

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-6 space-y-6 bg-gray-50">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-red-800">خطأ في تحميل المواعيد</h3>
              <p className="text-red-600 max-w-md">
                {error instanceof Error ? error.message : 'حدث خطأ غير متوقع في تحميل المواعيد'}
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 bg-gray-50">
      {/* العنوان والأزرار */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة المواعيد</h1>
                <p className="text-muted-foreground">إدارة وتتبع جميع مواعيد الطلاب</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة موعد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>إضافة موعد جديد</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAppointment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">عنوان الموعد</label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="مثال: استشارة أكاديمية"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">نوع الموعد</label>
                      <input
                        type="text"
                        name="appointment_type"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="مثال: استشارة، مقابلة، اجتماع"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">تاريخ ووقت الموعد</label>
                      <input
                        type="datetime-local"
                        name="appointment_date"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">المدة (بالدقائق)</label>
                      <input
                        type="number"
                        name="duration_minutes"
                        defaultValue={30}
                        min={15}
                        max={180}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">الموقع</label>
                      <input
                        type="text"
                        name="location"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="مثال: مكتب الإرشاد الأكاديمي"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">المسؤول</label>
                      <input
                        type="text"
                        name="staff_member"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="اسم المسؤول"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">الوصف (اختياري)</label>
                      <textarea
                        name="description"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="تفاصيل إضافية..."
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={addAppointment.isPending} className="flex-1">
                        {addAppointment.isPending ? 'جاري الإضافة...' : 'إضافة الموعد'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المواعيد</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">مجدولة</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">مؤكدة</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">مكتملة</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ملغية</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المواعيد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="scheduled">مجدول</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
                <SelectItem value="rescheduled">معاد جدولته</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="فلترة بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول المواعيد */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المواعيد ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-2 text-muted-foreground">جاري التحميل...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {appointments.length === 0 ? 'لا توجد مواعيد مسجلة' : 'لا توجد مواعيد تطابق البحث'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">التاريخ والوقت</TableHead>
                    <TableHead className="text-right">المدة</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">المسؤول</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{appointment.title}</TableCell>
                      <TableCell>{appointment.appointment_type}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(appointment.appointment_date).toLocaleDateString('ar-SA')}
                          <br />
                          <span className="text-muted-foreground">
                            {new Date(appointment.appointment_date).toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.duration_minutes || 30} دقيقة</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{appointment.location || 'غير محدد'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{appointment.staff_member || 'غير محدد'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(appointment)}
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" title="تعديل">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {appointment.status === 'scheduled' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="text-green-600 hover:text-green-700"
                              title="تأكيد الموعد"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'completed')}
                              className="text-purple-600 hover:text-purple-700"
                              title="تمييز كمكتمل"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(appointment.id, appointment.title)}
                            className="text-destructive hover:text-destructive"
                            title="حذف"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نافذة تفاصيل الموعد */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الموعد</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-600">العنوان</label>
                <p className="text-sm mt-1">{selectedAppointment.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">النوع</label>
                <p className="text-sm mt-1">{selectedAppointment.appointment_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">التاريخ والوقت</label>
                <p className="text-sm mt-1">
                  {new Date(selectedAppointment.appointment_date).toLocaleString('ar-SA')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">المدة</label>
                <p className="text-sm mt-1">{selectedAppointment.duration_minutes || 30} دقيقة</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">الموقع</label>
                <p className="text-sm mt-1">{selectedAppointment.location || 'غير محدد'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">المسؤول</label>
                <p className="text-sm mt-1">{selectedAppointment.staff_member || 'غير محدد'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">الوصف</label>
                <p className="text-sm mt-1">{selectedAppointment.description || 'لا يوجد وصف'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">ملاحظات</label>
                <p className="text-sm mt-1">{selectedAppointment.notes || 'لا توجد ملاحظات'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">الحالة</label>
                <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
                <p className="text-sm mt-1">
                  {new Date(selectedAppointment.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsManagement;
