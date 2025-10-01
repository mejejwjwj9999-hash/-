import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  CalendarDays, 
  Users, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  Star,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  Trophy,
  Activity
} from 'lucide-react';

const StudentActivitiesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activities');
  const [showNewActivityDialog, setShowNewActivityDialog] = useState(false);
  const [showNewClubDialog, setShowNewClubDialog] = useState(false);

  const activities = [
    {
      id: '1',
      title: 'معرض العلوم والتكنولوجيا',
      type: 'educational',
      category: 'أكاديمي',
      description: 'معرض سنوي لعرض مشاريع الطلاب في مجال العلوم والتكنولوجيا',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      location: 'قاعة المعارض الرئيسية',
      organizer: 'نادي العلوم',
      maxParticipants: 200,
      currentParticipants: 145,
      status: 'open',
      registrationDeadline: '2024-02-10',
      fee: 0
    },
    {
      id: '2',
      title: 'دوري كرة القدم الجامعي',
      type: 'sports',
      category: 'رياضي',
      description: 'بطولة كرة القدم السنوية بين كليات الجامعة',
      startDate: '2024-03-01',
      endDate: '2024-03-30',
      location: 'الملعب الرياضي',
      organizer: 'النادي الرياضي',
      maxParticipants: 16,
      currentParticipants: 12,
      status: 'open',
      registrationDeadline: '2024-02-25',
      fee: 50
    },
    {
      id: '3',
      title: 'ورشة الكتابة الإبداعية',
      type: 'cultural',
      category: 'ثقافي',
      description: 'ورشة تدريبية لتطوير مهارات الكتابة الإبداعية والأدبية',
      startDate: '2024-02-20',
      endDate: '2024-02-22',
      location: 'مركز الأنشطة الثقافية',
      organizer: 'النادي الأدبي',
      maxParticipants: 30,
      currentParticipants: 28,
      status: 'full',
      registrationDeadline: '2024-02-15',
      fee: 25
    }
  ];

  const clubs = [
    {
      id: '1',
      name: 'نادي العلوم والتكنولوجيا',
      type: 'academic',
      supervisor: 'د. أحمد محمد',
      description: 'نادي متخصص في الأنشطة العلمية والتكنولوجية',
      members: 87,
      maxMembers: 100,
      location: 'مبنى الهندسة - الطابق الثالث',
      status: 'active',
      established: '2020-09-01',
      activities: 12
    },
    {
      id: '2',
      name: 'النادي الثقافي',
      type: 'cultural',
      supervisor: 'د. فاطمة سالم',
      description: 'نادي يهتم بالأنشطة الثقافية والأدبية',
      members: 65,
      maxMembers: 80,
      location: 'مركز الأنشطة الطلابية',
      status: 'active',
      established: '2019-10-15',
      activities: 8
    }
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'educational': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      open: 'مفتوح للتسجيل',
      full: 'مكتمل',
      closed: 'مغلق',
      completed: 'مكتمل',
      active: 'نشط',
      inactive: 'غير نشط'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة الأنشطة الطلابية</h2>
          <p className="text-muted-foreground">إدارة الأنشطة والنوادي الطلابية</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewClubDialog} onOpenChange={setShowNewClubDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                نادي جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>إنشاء نادي طلابي جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">اسم النادي</label>
                  <Input placeholder="مثال: النادي العلمي" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">نوع النادي</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">أكاديمي</SelectItem>
                        <SelectItem value="cultural">ثقافي</SelectItem>
                        <SelectItem value="sports">رياضي</SelectItem>
                        <SelectItem value="social">اجتماعي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">المشرف</label>
                    <Input placeholder="اسم المشرف" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">وصف النادي</label>
                  <Textarea placeholder="اكتب وصف للنادي..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">الحد الأقصى للأعضاء</label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">المقر</label>
                    <Input placeholder="مبنى الأنشطة - الطابق الأول" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewClubDialog(false)}>
                    إلغاء
                  </Button>
                  <Button>إنشاء النادي</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewActivityDialog} onOpenChange={setShowNewActivityDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                نشاط جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>إنشاء نشاط جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">عنوان النشاط</label>
                  <Input placeholder="مثال: معرض العلوم السنوي" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">نوع النشاط</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educational">تعليمي</SelectItem>
                        <SelectItem value="cultural">ثقافي</SelectItem>
                        <SelectItem value="sports">رياضي</SelectItem>
                        <SelectItem value="social">اجتماعي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">الجهة المنظمة</label>
                    <Input placeholder="النادي المنظم" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">وصف النشاط</label>
                  <Textarea placeholder="اكتب وصف للنشاط..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">تاريخ البداية</label>
                    <Input type="datetime-local" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">تاريخ النهاية</label>
                    <Input type="datetime-local" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">المكان</label>
                    <Input placeholder="قاعة المحاضرات" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">عدد المشاركين</label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">رسوم الاشتراك</label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">آخر موعد للتسجيل</label>
                  <Input type="date" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewActivityDialog(false)}>
                    إلغاء
                  </Button>
                  <Button>إنشاء النشاط</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">أنشطة قادمة</p>
                <p className="text-2xl font-bold text-blue-600">15</p>
              </div>
              <CalendarDays className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">النوادي النشطة</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المشاركين</p>
                <p className="text-2xl font-bold text-purple-600">856</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">أنشطة هذا الشهر</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="activities">الأنشطة</TabsTrigger>
          <TabsTrigger value="clubs">النوادي</TabsTrigger>
          <TabsTrigger value="registrations">التسجيلات</TabsTrigger>
          <TabsTrigger value="calendar">التقويم</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث في الأنشطة..." className="pr-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="educational">تعليمي</SelectItem>
                <SelectItem value="cultural">ثقافي</SelectItem>
                <SelectItem value="sports">رياضي</SelectItem>
                <SelectItem value="social">اجتماعي</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="open">مفتوح</SelectItem>
                <SelectItem value="full">مكتمل</SelectItem>
                <SelectItem value="closed">مغلق</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{activity.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActivityTypeColor(activity.type)}>
                          {activity.category}
                        </Badge>
                        <Badge className={getStatusColor(activity.status)}>
                          {getStatusText(activity.status)}
                        </Badge>
                      </div>
                    </div>
                    {activity.status === 'open' && (
                      <Star className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(activity.startDate).toLocaleDateString('ar-SA')}</span>
                    <span>-</span>
                    <span>{new Date(activity.endDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{activity.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{activity.currentParticipants} / {activity.maxParticipants}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>الجهة المنظمة: {activity.organizer}</span>
                    {activity.fee > 0 && (
                      <span className="font-medium text-green-600">{activity.fee} ريال</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      تعديل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث في النوادي..." className="pr-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="academic">أكاديمي</SelectItem>
                <SelectItem value="cultural">ثقافي</SelectItem>
                <SelectItem value="sports">رياضي</SelectItem>
                <SelectItem value="social">اجتماعي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubs.map((club) => (
              <Card key={club.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{club.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getActivityTypeColor(club.type)}>
                          {club.type === 'academic' ? 'أكاديمي' : club.type === 'cultural' ? 'ثقافي' : club.type}
                        </Badge>
                        <Badge className={getStatusColor(club.status)}>
                          {getStatusText(club.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{club.description}</p>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">المشرف</p>
                    <p className="text-sm">{club.supervisor}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{club.members} / {club.maxMembers} عضو</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{club.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>تأسس: {new Date(club.established).getFullYear()}</span>
                    <span>{club.activities} نشاط</span>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      إدارة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">إدارة التسجيلات</h3>
            <p className="text-muted-foreground">متابعة تسجيلات الطلاب في الأنشطة والنوادي</p>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">تقويم الأنشطة</h3>
            <p className="text-muted-foreground">عرض الأنشطة والفعاليات في التقويم</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">تقارير الأنشطة</h3>
            <p className="text-muted-foreground">تقارير شاملة عن الأنشطة والمشاركة</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentActivitiesManager;