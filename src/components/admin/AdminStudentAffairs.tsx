import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  FileUser, 
  UserCheck, 
  Shield, 
  RefreshCw, 
  Award, 
  Heart, 
  CalendarDays,
  GraduationCap,
  BookOpen,
  UserX,
  ClipboardList,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  BarChart3,
  Settings,
  Star,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminStudentAffairs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showClubDialog, setShowClubDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
    required_documents: ['']
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
    current_members: 0,
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
    current_participants: 0,
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
      processing_time: '', fee_amount: 0, required_documents: ['']
    });
    setClubForm({
      name_ar: '', name_en: '', description_ar: '', description_en: '',
      category: 'academic', supervisor_name: '', location: '', max_members: 50,
      current_members: 0, status: 'active', is_featured: false
    });
    setActivityForm({
      title_ar: '', title_en: '', description_ar: '', description_en: '',
      type: 'event', category: 'academic', start_date: '', end_date: '',
      registration_deadline: '', location: '', max_participants: 50,
      current_participants: 0, organizer_name: '', status: 'planned', is_featured: false, fee_amount: 0
    });
    setEditingItem(null);
  };

  const handleSaveService = async () => {
    try {
      const data = {
        ...serviceForm,
        required_documents: serviceForm.required_documents.filter(doc => doc.trim() !== '')
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
        required_documents: item.required_documents || ['']
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
        current_members: item.current_members || 0,
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
        current_participants: item.current_participants || 0,
        organizer_name: item.organizer_name || '',
        status: item.status || 'planned',
        is_featured: item.is_featured || false,
        fee_amount: item.fee_amount || 0
      });
      setShowActivityDialog(true);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-green-600 bg-green-50',
      inactive: 'text-red-600 bg-red-50',
      planned: 'text-blue-600 bg-blue-50',
      open: 'text-green-600 bg-green-50',
      ongoing: 'text-orange-600 bg-orange-50',
      completed: 'text-purple-600 bg-purple-50',
      recruiting: 'text-blue-600 bg-blue-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'نشط',
      inactive: 'غير نشط',
      planned: 'مخطط',
      open: 'مفتوح',
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
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-right">إدارة شؤون الطلاب</CardTitle>
          <p className="text-muted-foreground text-right">إدارة شاملة للخدمات والنوادي والأنشطة الطلابية</p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-4 text-right">
          <TabsTrigger value="overview" className="flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>نظرة عامة</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>الخدمات</span>
          </TabsTrigger>
          <TabsTrigger value="clubs" className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            <span>النوادي</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center justify-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>الأنشطة</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-right">
                  <BookOpen className="h-4 w-4" />
                  إجمالي الخدمات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-university-blue">{services.length}</div>
                <p className="text-xs text-muted-foreground mt-1">خدمة متاحة</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-right">
                  <Users className="h-4 w-4" />
                  النوادي النشطة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-university-red">{clubs.filter(c => c.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground mt-1">نادي نشط</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-right">
                  <CalendarDays className="h-4 w-4" />
                  الأنشطة القادمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-university-gold">{activities.filter(a => a.status === 'open').length}</div>
                <p className="text-xs text-muted-foreground mt-1">نشاط قادم</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-right">
                  <Star className="h-4 w-4" />
                  إجمالي الأعضاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-university-blue">{clubs.reduce((sum, club) => sum + (club.current_members || 0), 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">عضو في النوادي</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">الخدمات الطلابية</h2>
            <Button onClick={() => {resetForms(); setShowServiceDialog(true)}}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خدمة جديدة
            </Button>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-right">{service.title_ar}</CardTitle>
                      <p className="text-muted-foreground text-sm text-right mt-1">{service.description_ar}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(service.status)}>
                        {getStatusText(service.status)}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEdit('service', service)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete('service', service.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Clubs Tab */}
        <TabsContent value="clubs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">النوادي الطلابية</h2>
            <Button onClick={() => {resetForms(); setShowClubDialog(true)}}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة نادي جديد
            </Button>
          </div>

          <div className="grid gap-4">
            {clubs.map((club) => (
              <Card key={club.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-right">{club.name_ar}</CardTitle>
                      <p className="text-muted-foreground text-sm text-right mt-1">{club.description_ar}</p>
                      <p className="text-sm text-muted-foreground text-right mt-2">
                        الأعضاء: {club.current_members || 0} / {club.max_members || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(club.status)}>
                        {getStatusText(club.status)}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEdit('club', club)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete('club', club.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">الأنشطة الطلابية</h2>
            <Button onClick={() => {resetForms(); setShowActivityDialog(true)}}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة نشاط جديد
            </Button>
          </div>

          <div className="grid gap-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-right">{activity.title_ar}</CardTitle>
                      <p className="text-muted-foreground text-sm text-right mt-1">{activity.description_ar}</p>
                      <p className="text-sm text-muted-foreground text-right mt-2">
                        المشاركون: {activity.current_participants || 0} / {activity.max_participants || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(activity.status)}>
                        {getStatusText(activity.status)}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEdit('activity', activity)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete('activity', activity.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">
              {editingItem ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_ar">العنوان بالعربية</Label>
                <Input
                  id="title_ar"
                  value={serviceForm.title_ar}
                  onChange={(e) => setServiceForm({...serviceForm, title_ar: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="title_en">العنوان بالإنجليزية</Label>
                <Input
                  id="title_en"
                  value={serviceForm.title_en}
                  onChange={(e) => setServiceForm({...serviceForm, title_en: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description_ar">الوصف بالعربية</Label>
              <Textarea
                id="description_ar"
                value={serviceForm.description_ar}
                onChange={(e) => setServiceForm({...serviceForm, description_ar: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select value={serviceForm.category} onValueChange={(value) => setServiceForm({...serviceForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">أكاديمية</SelectItem>
                    <SelectItem value="health">صحية</SelectItem>
                    <SelectItem value="social">اجتماعية</SelectItem>
                    <SelectItem value="cultural">ثقافية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">الحالة</Label>
                <Select value={serviceForm.status} onValueChange={(value) => setServiceForm({...serviceForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowServiceDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveService}>
                {editingItem ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Club Dialog */}
      <Dialog open={showClubDialog} onOpenChange={setShowClubDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">
              {editingItem ? 'تعديل النادي' : 'إضافة نادي جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name_ar">اسم النادي بالعربية</Label>
                <Input
                  id="name_ar"
                  value={clubForm.name_ar}
                  onChange={(e) => setClubForm({...clubForm, name_ar: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supervisor_name">اسم المشرف</Label>
                <Input
                  id="supervisor_name"
                  value={clubForm.supervisor_name}
                  onChange={(e) => setClubForm({...clubForm, supervisor_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description_ar">وصف النادي</Label>
              <Textarea
                id="description_ar"
                value={clubForm.description_ar}
                onChange={(e) => setClubForm({...clubForm, description_ar: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="max_members">العدد الأقصى للأعضاء</Label>
                <Input
                  id="max_members"
                  type="number"
                  value={clubForm.max_members}
                  onChange={(e) => setClubForm({...clubForm, max_members: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="current_members">العدد الحالي للأعضاء</Label>
                <Input
                  id="current_members"
                  type="number"
                  value={clubForm.current_members}
                  onChange={(e) => setClubForm({...clubForm, current_members: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="status">الحالة</Label>
                <Select value={clubForm.status} onValueChange={(value) => setClubForm({...clubForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="recruiting">يستقبل أعضاء</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowClubDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveClub}>
                {editingItem ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">
              {editingItem ? 'تعديل النشاط' : 'إضافة نشاط جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_ar">عنوان النشاط بالعربية</Label>
                <Input
                  id="title_ar"
                  value={activityForm.title_ar}
                  onChange={(e) => setActivityForm({...activityForm, title_ar: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="organizer_name">اسم المنظم</Label>
                <Input
                  id="organizer_name"
                  value={activityForm.organizer_name}
                  onChange={(e) => setActivityForm({...activityForm, organizer_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description_ar">وصف النشاط</Label>
              <Textarea
                id="description_ar"
                value={activityForm.description_ar}
                onChange={(e) => setActivityForm({...activityForm, description_ar: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">تاريخ البداية</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={activityForm.start_date}
                  onChange={(e) => setActivityForm({...activityForm, start_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end_date">تاريخ النهاية</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={activityForm.end_date}
                  onChange={(e) => setActivityForm({...activityForm, end_date: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="max_participants">العدد الأقصى للمشاركين</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={activityForm.max_participants}
                  onChange={(e) => setActivityForm({...activityForm, max_participants: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="current_participants">العدد الحالي للمشاركين</Label>
                <Input
                  id="current_participants"
                  type="number"
                  value={activityForm.current_participants}
                  onChange={(e) => setActivityForm({...activityForm, current_participants: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="status">الحالة</Label>
                <Select value={activityForm.status} onValueChange={(value) => setActivityForm({...activityForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">مخطط</SelectItem>
                    <SelectItem value="open">مفتوح للتسجيل</SelectItem>
                    <SelectItem value="ongoing">جاري</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveActivity}>
                {editingItem ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudentAffairs;