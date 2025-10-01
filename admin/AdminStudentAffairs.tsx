import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  BarChart3, 
  CalendarDays, 
  FileText, 
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { IconPicker } from '@/components/ui/icon-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Service {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  icon: string;
  category: string;
  status: string;
  is_featured: boolean;
  processing_time?: string;
  fee_amount: number;
  required_documents: any;
}

interface Club {
  id: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  category: string;
  supervisor_name?: string;
  location?: string;
  max_members?: number;
  current_members: number;
  status: string;
  is_featured: boolean;
}

interface Activity {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  type: string;
  category: string;
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  location?: string;
  max_participants?: number;
  current_participants: number;
  organizer_name?: string;
  status: string;
  is_featured: boolean;
  fee_amount: number;
}

export default function AdminStudentAffairs() {
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState<Service[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showClubDialog, setShowClubDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form states
  const [serviceForm, setServiceForm] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    icon: 'FileText',
    category: 'academic',
    status: 'active',
    is_featured: false,
    processing_time: '',
    fee_amount: 0,
    required_documents: [''],
    services_benefits: ['']
  });

  const [clubForm, setClubForm] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    category: 'academic',
    supervisor_name: '',
    location: '',
    max_members: 50,
    status: 'active',
    is_featured: false
  });

  const [activityForm, setActivityForm] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    type: 'event',
    category: 'academic',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    location: '',
    max_participants: 50,
    organizer_name: '',
    status: 'planned',
    is_featured: false,
    fee_amount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesData, clubsData, activitiesData] = await Promise.all([
        supabase.from('student_affairs_services').select('*').order('created_at', { ascending: false }),
        supabase.from('student_clubs').select('*').order('created_at', { ascending: false }),
        supabase.from('student_activities').select('*').order('created_at', { ascending: false })
      ]);

      if (servicesData.data) setServices(servicesData.data);
      if (clubsData.data) setClubs(clubsData.data);
      if (activitiesData.data) setActivities(activitiesData.data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setServiceForm({
      title_ar: '', title_en: '', description_ar: '', description_en: '',
      icon: 'FileText', category: 'academic', status: 'active', is_featured: false,
      processing_time: '', fee_amount: 0, required_documents: [''], services_benefits: ['']
    });
    setClubForm({
      name_ar: '', name_en: '', description_ar: '', description_en: '',
      category: 'academic', supervisor_name: '', location: '', max_members: 50,
      status: 'active', is_featured: false
    });
    setActivityForm({
      title_ar: '', title_en: '', description_ar: '', description_en: '',
      type: 'event', category: 'academic', start_date: '', end_date: '',
      registration_deadline: '', location: '', max_participants: 50,
      organizer_name: '', status: 'planned', is_featured: false, fee_amount: 0
    });
    setEditingItem(null);
  };

  const handleSaveService = async () => {
    try {
      const data = {
        ...serviceForm,
        required_documents: serviceForm.required_documents.filter(doc => doc.trim() !== ''),
        services_benefits: serviceForm.services_benefits.filter(benefit => benefit.trim() !== '')
      };

      if (editingItem) {
        const { error } = await supabase
          .from('student_affairs_services')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('student_affairs_services')
          .insert([data]);
        if (error) throw error;
      }

      toast({
        title: "تم بنجاح",
        description: editingItem ? "تم تحديث الخدمة" : "تم إضافة الخدمة"
      });
      
      setShowServiceDialog(false);
      resetForms();
      fetchData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الخدمة",
        variant: "destructive"
      });
    }
  };

  const handleSaveClub = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('student_clubs')
          .update(clubForm)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('student_clubs')
          .insert([clubForm]);
        if (error) throw error;
      }

      toast({
        title: "تم بنجاح",
        description: editingItem ? "تم تحديث النادي" : "تم إضافة النادي"
      });
      
      setShowClubDialog(false);
      resetForms();
      fetchData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ النادي",
        variant: "destructive"
      });
    }
  };

  const handleSaveActivity = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('student_activities')
          .update(activityForm)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('student_activities')
          .insert([activityForm]);
        if (error) throw error;
      }

      toast({
        title: "تم بنجاح",
        description: editingItem ? "تم تحديث النشاط" : "تم إضافة النشاط"
      });
      
      setShowActivityDialog(false);
      resetForms();
      fetchData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ النشاط",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (type: 'service' | 'club' | 'activity', id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      const tableName = type === 'service' ? 'student_affairs_services' : 
                       type === 'club' ? 'student_clubs' : 'student_activities';
      
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;

      toast({ title: "تم الحذف بنجاح" });
      fetchData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الحذف",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (type: 'service' | 'club' | 'activity', item: any) => {
    setEditingItem(item);
    if (type === 'service') {
      setServiceForm({
        title_ar: item.title_ar || '',
        title_en: item.title_en || '',
        description_ar: item.description_ar || '',
        description_en: item.description_en || '',
        icon: item.icon || 'FileText',
        category: item.category || 'academic',
        status: item.status || 'active',
        is_featured: item.is_featured || false,
        processing_time: item.processing_time || '',
        fee_amount: item.fee_amount || 0,
        required_documents: item.required_documents || [''],
        services_benefits: item.services_benefits || ['']
      });
      setShowServiceDialog(true);
    } else if (type === 'club') {
      setClubForm({
        name_ar: item.name_ar || '',
        name_en: item.name_en || '',
        description_ar: item.description_ar || '',
        description_en: item.description_en || '',
        category: item.category || 'academic',
        supervisor_name: item.supervisor_name || '',
        location: item.location || '',
        max_members: item.max_members || 50,
        status: item.status || 'active',
        is_featured: item.is_featured || false
      });
      setShowClubDialog(true);
    } else if (type === 'activity') {
      setActivityForm({
        title_ar: item.title_ar || '',
        title_en: item.title_en || '',
        description_ar: item.description_ar || '',
        description_en: item.description_en || '',
        type: item.type || 'event',
        category: item.category || 'academic',
        start_date: item.start_date?.slice(0, 16) || '',
        end_date: item.end_date?.slice(0, 16) || '',
        registration_deadline: item.registration_deadline?.slice(0, 16) || '',
        location: item.location || '',
        max_participants: item.max_participants || 50,
        organizer_name: item.organizer_name || '',
        status: item.status || 'planned',
        is_featured: item.is_featured || false,
        fee_amount: item.fee_amount || 0
      });
      setShowActivityDialog(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-red-600 bg-red-50';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50';
      case 'planned': return 'text-blue-600 bg-blue-50';
      case 'open': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      case 'ongoing': return 'text-orange-600 bg-orange-50';
      case 'completed': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'نشط',
      inactive: 'غير نشط',
      maintenance: 'صيانة',
      planned: 'مخطط',
      open: 'مفتوح',
      closed: 'مغلق',
      ongoing: 'جاري',
      completed: 'مكتمل',
      recruiting: 'يستقبل أعضاء'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">إدارة شؤون الطلاب</h1>
        <p className="text-muted-foreground">إدارة شاملة للخدمات والنوادي والأنشطة الطلابية</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-6 text-right">
          <TabsTrigger value="overview" className="flex items-center justify-center gap-2 text-right">
            <span>نظرة عامة</span>
            <BarChart3 className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center justify-center gap-2 text-right">
            <span>الخدمات</span>
            <FileText className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="clubs" className="flex items-center justify-center gap-2 text-right">
            <span>النوادي</span>
            <Users className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center justify-center gap-2 text-right">
            <span>الأنشطة</span>
            <CalendarDays className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center justify-center gap-2 text-right">
            <span>الطلبات</span>
            <Clock className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center justify-center gap-2 text-right">
            <span>الإعدادات</span>
            <Settings className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الخدمات</p>
                  <p className="text-2xl font-bold text-foreground">{services.length}</p>
                </div>
                <FileText className="w-8 h-8 text-university-blue" />
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">النوادي النشطة</p>
                  <p className="text-2xl font-bold text-foreground">{clubs.filter(c => c.status === 'active').length}</p>
                </div>
                <Users className="w-8 h-8 text-university-red" />
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الأنشطة القادمة</p>
                  <p className="text-2xl font-bold text-foreground">{activities.filter(a => a.status === 'open').length}</p>
                </div>
                <CalendarDays className="w-8 h-8 text-university-gold" />
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الأعضاء</p>
                  <p className="text-2xl font-bold text-foreground">{clubs.reduce((sum, club) => sum + club.current_members, 0)}</p>
                </div>
                <Star className="w-8 h-8 text-university-blue" />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center" dir="rtl">
            <h2 className="text-2xl font-bold">الخدمات الطلابية</h2>
            <Button onClick={() => {resetForms(); setShowServiceDialog(true)}}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة خدمة جديدة
            </Button>
          </div>

          <div className="flex gap-4 mb-6" dir="rtl">
            <div className="flex-1">
              <Input
                placeholder="البحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-right"
                dir="rtl"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48" dir="rtl">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="maintenance">صيانة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {services
              .filter(service => 
                filterStatus === 'all' || service.status === filterStatus
              )
              .filter(service =>
                service.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (service.description_ar && service.description_ar.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((service) => (
              <div key={service.id} className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{service.title_ar}</h3>
                      {service.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {getStatusText(service.status)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{service.description_ar}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>الفئة: {service.category}</span>
                      {service.processing_time && <span>مدة المعالجة: {service.processing_time}</span>}
                      {service.fee_amount > 0 && <span>الرسوم: {service.fee_amount} ريال</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('service', service)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete('service', service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Clubs Tab */}
        <TabsContent value="clubs" className="space-y-6">
          <div className="flex justify-between items-center" dir="rtl">
            <h2 className="text-2xl font-bold">النوادي الطلابية</h2>
            <Button onClick={() => {resetForms(); setShowClubDialog(true)}}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة نادي جديد
            </Button>
          </div>

          <div className="grid gap-4">
            {clubs.map((club) => (
              <div key={club.id} className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{club.name_ar}</h3>
                      {club.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(club.status)}`}>
                        {getStatusText(club.status)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{club.description_ar}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>الفئة: {club.category}</span>
                      <span>الأعضاء: {club.current_members}/{club.max_members}</span>
                      {club.supervisor_name && <span>المشرف: {club.supervisor_name}</span>}
                      {club.location && <span>المكان: {club.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('club', club)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete('club', club.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <div className="flex justify-between items-center" dir="rtl">
            <h2 className="text-2xl font-bold">الأنشطة الطلابية</h2>
            <Button onClick={() => {resetForms(); setShowActivityDialog(true)}}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة نشاط جديد
            </Button>
          </div>

          <div className="grid gap-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{activity.title_ar}</h3>
                      {activity.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{activity.description_ar}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>النوع: {activity.type}</span>
                      <span>المشاركون: {activity.current_participants}/{activity.max_participants}</span>
                      {activity.organizer_name && <span>المنظم: {activity.organizer_name}</span>}
                      {activity.location && <span>المكان: {activity.location}</span>}
                      {activity.fee_amount > 0 && <span>الرسوم: {activity.fee_amount} ريال</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit('activity', activity)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete('activity', activity.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Other tabs content */}
        <TabsContent value="requests">
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">إدارة الطلبات</h3>
            <p className="text-muted-foreground">ستتم إضافة إدارة الطلبات قريباً</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الإعدادات</h3>
            <p className="text-muted-foreground">ستتم إضافة الإعدادات قريباً</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">العنوان بالعربية *</label>
                <Input
                  value={serviceForm.title_ar}
                  onChange={(e) => setServiceForm(prev => ({...prev, title_ar: e.target.value}))}
                  placeholder="اسم الخدمة"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">العنوان بالإنجليزية</label>
                <Input
                  value={serviceForm.title_en}
                  onChange={(e) => setServiceForm(prev => ({...prev, title_en: e.target.value}))}
                  placeholder="Service Name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف بالعربية</label>
                <Textarea
                  value={serviceForm.description_ar}
                  onChange={(e) => setServiceForm(prev => ({...prev, description_ar: e.target.value}))}
                  placeholder="وصف مفصل للخدمة"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف بالإنجليزية</label>
                <Textarea
                  value={serviceForm.description_en}
                  onChange={(e) => setServiceForm(prev => ({...prev, description_en: e.target.value}))}
                  placeholder="Service Description"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الأيقونة</label>
                <IconPicker
                  value={serviceForm.icon}
                  onChange={(icon) => setServiceForm(prev => ({...prev, icon}))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الفئة</label>
                <Select value={serviceForm.category} onValueChange={(value) => setServiceForm(prev => ({...prev, category: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">أكاديمية</SelectItem>
                    <SelectItem value="certificates">شهادات</SelectItem>
                    <SelectItem value="technical">تقنية</SelectItem>
                    <SelectItem value="administrative">إدارية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الحالة</label>
                <Select value={serviceForm.status} onValueChange={(value) => setServiceForm(prev => ({...prev, status: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="maintenance">صيانة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">مدة المعالجة</label>
                <Input
                  value={serviceForm.processing_time}
                  onChange={(e) => setServiceForm(prev => ({...prev, processing_time: e.target.value}))}
                  placeholder="مثال: 3-5 أيام عمل"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الرسوم (ريال)</label>
                <Input
                  type="number"
                  value={serviceForm.fee_amount}
                  onChange={(e) => setServiceForm(prev => ({...prev, fee_amount: Number(e.target.value)}))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* ما ستحصل عليه - البنود */}
            <div>
              <label className="text-sm font-medium mb-2 block">ما ستحصل عليه (البنود)</label>
              <div className="space-y-2">
                {serviceForm.services_benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...serviceForm.services_benefits];
                        newBenefits[index] = e.target.value;
                        setServiceForm(prev => ({...prev, services_benefits: newBenefits}));
                      }}
                      placeholder={`البند ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newBenefits = serviceForm.services_benefits.filter((_, i) => i !== index);
                        setServiceForm(prev => ({...prev, services_benefits: newBenefits}));
                      }}
                      disabled={serviceForm.services_benefits.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setServiceForm(prev => ({...prev, services_benefits: [...prev.services_benefits, '']}))}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة بند جديد
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured_service"
                checked={serviceForm.is_featured}
                onChange={(e) => setServiceForm(prev => ({...prev, is_featured: e.target.checked}))}
              />
              <label htmlFor="is_featured_service" className="text-sm font-medium">خدمة مميزة</label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveService}>
              {editingItem ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Club Dialog */}
      <Dialog open={showClubDialog} onOpenChange={setShowClubDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل النادي' : 'إضافة نادي جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الاسم بالعربية *</label>
                <Input
                  value={clubForm.name_ar}
                  onChange={(e) => setClubForm(prev => ({...prev, name_ar: e.target.value}))}
                  placeholder="اسم النادي"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الاسم بالإنجليزية</label>
                <Input
                  value={clubForm.name_en}
                  onChange={(e) => setClubForm(prev => ({...prev, name_en: e.target.value}))}
                  placeholder="Club Name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف بالعربية</label>
                <Textarea
                  value={clubForm.description_ar}
                  onChange={(e) => setClubForm(prev => ({...prev, description_ar: e.target.value}))}
                  placeholder="وصف النادي وأنشطته"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف بالإنجليزية</label>
                <Textarea
                  value={clubForm.description_en}
                  onChange={(e) => setClubForm(prev => ({...prev, description_en: e.target.value}))}
                  placeholder="Club Description"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الفئة</label>
                <Select value={clubForm.category} onValueChange={(value) => setClubForm(prev => ({...prev, category: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">أكاديمي</SelectItem>
                    <SelectItem value="technical">تقني</SelectItem>
                    <SelectItem value="cultural">ثقافي</SelectItem>
                    <SelectItem value="scientific">علمي</SelectItem>
                    <SelectItem value="sports">رياضي</SelectItem>
                    <SelectItem value="artistic">فني</SelectItem>
                    <SelectItem value="social">اجتماعي</SelectItem>
                    <SelectItem value="business">ريادي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الحالة</label>
                <Select value={clubForm.status} onValueChange={(value) => setClubForm(prev => ({...prev, status: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="recruiting">يستقبل أعضاء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الحد الأقصى للأعضاء</label>
                <Input
                  type="number"
                  value={clubForm.max_members}
                  onChange={(e) => setClubForm(prev => ({...prev, max_members: Number(e.target.value)}))}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">المشرف</label>
                <Input
                  value={clubForm.supervisor_name}
                  onChange={(e) => setClubForm(prev => ({...prev, supervisor_name: e.target.value}))}
                  placeholder="اسم المشرف"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">المكان</label>
                <Input
                  value={clubForm.location}
                  onChange={(e) => setClubForm(prev => ({...prev, location: e.target.value}))}
                  placeholder="مكان الاجتماعات"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured_club"
                checked={clubForm.is_featured}
                onChange={(e) => setClubForm(prev => ({...prev, is_featured: e.target.checked}))}
              />
              <label htmlFor="is_featured_club" className="text-sm font-medium">نادي مميز</label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveClub}>
              {editingItem ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل النشاط' : 'إضافة نشاط جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">العنوان بالعربية *</label>
                <Input
                  value={activityForm.title_ar}
                  onChange={(e) => setActivityForm(prev => ({...prev, title_ar: e.target.value}))}
                  placeholder="عنوان النشاط"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">العنوان بالإنجليزية</label>
                <Input
                  value={activityForm.title_en}
                  onChange={(e) => setActivityForm(prev => ({...prev, title_en: e.target.value}))}
                  placeholder="Activity Title"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف بالعربية</label>
                <Textarea
                  value={activityForm.description_ar}
                  onChange={(e) => setActivityForm(prev => ({...prev, description_ar: e.target.value}))}
                  placeholder="وصف النشاط"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الوصف بالإنجليزية</label>
                <Textarea
                  value={activityForm.description_en}
                  onChange={(e) => setActivityForm(prev => ({...prev, description_en: e.target.value}))}
                  placeholder="Activity Description"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">النوع</label>
                <Select value={activityForm.type} onValueChange={(value) => setActivityForm(prev => ({...prev, type: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">فعالية</SelectItem>
                    <SelectItem value="workshop">ورشة</SelectItem>
                    <SelectItem value="competition">مسابقة</SelectItem>
                    <SelectItem value="seminar">ندوة</SelectItem>
                    <SelectItem value="trip">رحلة</SelectItem>
                    <SelectItem value="cultural">ثقافي</SelectItem>
                    <SelectItem value="sports">رياضي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الفئة</label>
                <Select value={activityForm.category} onValueChange={(value) => setActivityForm(prev => ({...prev, category: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">أكاديمي</SelectItem>
                    <SelectItem value="technical">تقني</SelectItem>
                    <SelectItem value="cultural">ثقافي</SelectItem>
                    <SelectItem value="scientific">علمي</SelectItem>
                    <SelectItem value="sports">رياضي</SelectItem>
                    <SelectItem value="artistic">فني</SelectItem>
                    <SelectItem value="social">اجتماعي</SelectItem>
                    <SelectItem value="business">ريادي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الحالة</label>
                <Select value={activityForm.status} onValueChange={(value) => setActivityForm(prev => ({...prev, status: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">مخطط</SelectItem>
                    <SelectItem value="open">مفتوح للتسجيل</SelectItem>
                    <SelectItem value="closed">مغلق</SelectItem>
                    <SelectItem value="ongoing">جاري</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الحد الأقصى للمشاركين</label>
                <Input
                  type="number"
                  value={activityForm.max_participants}
                  onChange={(e) => setActivityForm(prev => ({...prev, max_participants: Number(e.target.value)}))}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">تاريخ البداية</label>
                <Input
                  type="datetime-local"
                  value={activityForm.start_date}
                  onChange={(e) => setActivityForm(prev => ({...prev, start_date: e.target.value}))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">تاريخ النهاية</label>
                <Input
                  type="datetime-local"
                  value={activityForm.end_date}
                  onChange={(e) => setActivityForm(prev => ({...prev, end_date: e.target.value}))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">آخر موعد للتسجيل</label>
                <Input
                  type="datetime-local"
                  value={activityForm.registration_deadline}
                  onChange={(e) => setActivityForm(prev => ({...prev, registration_deadline: e.target.value}))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">المكان</label>
                <Input
                  value={activityForm.location}
                  onChange={(e) => setActivityForm(prev => ({...prev, location: e.target.value}))}
                  placeholder="مكان النشاط"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">المنظم</label>
                <Input
                  value={activityForm.organizer_name}
                  onChange={(e) => setActivityForm(prev => ({...prev, organizer_name: e.target.value}))}
                  placeholder="اسم المنظم"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">الرسوم (ريال)</label>
                <Input
                  type="number"
                  value={activityForm.fee_amount}
                  onChange={(e) => setActivityForm(prev => ({...prev, fee_amount: Number(e.target.value)}))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured_activity"
                checked={activityForm.is_featured}
                onChange={(e) => setActivityForm(prev => ({...prev, is_featured: e.target.checked}))}
              />
              <label htmlFor="is_featured_activity" className="text-sm font-medium">نشاط مميز</label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveActivity}>
              {editingItem ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
