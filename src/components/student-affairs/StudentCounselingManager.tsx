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
  Heart, 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  User,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit
} from 'lucide-react';

const StudentCounselingManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);

  const counselingSessions = [
    {
      id: '1',
      studentName: 'أحمد محمد علي',
      studentId: 'ST2024001',
      counselorName: 'د. سارة أحمد',
      sessionType: 'academic',
      priority: 'medium',
      description: 'صعوبة في التكيف مع المناهج الجديدة',
      scheduledDate: '2024-01-20',
      scheduledTime: '10:00',
      status: 'scheduled',
      duration: 60
    },
    {
      id: '2',
      studentName: 'فاطمة سالم أحمد',
      studentId: 'ST2024002',
      counselorName: 'د. محمد عبدالله',
      sessionType: 'personal',
      priority: 'high',
      description: 'قلق من الامتحانات وضغط نفسي',
      scheduledDate: '2024-01-19',
      scheduledTime: '14:00',
      status: 'completed',
      duration: 45
    },
    {
      id: '3',
      studentName: 'محمد عبدالله حسن',
      studentId: 'ST2024003',
      counselorName: 'د. أميرة سالم',
      sessionType: 'career',
      priority: 'low',
      description: 'استشارة حول الخيارات المهنية المستقبلية',
      scheduledDate: '2024-01-21',
      scheduledTime: '11:30',
      status: 'scheduled',
      duration: 90
    }
  ];

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'career': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      academic: 'أكاديمي',
      personal: 'شخصي',
      career: 'مهني',
      social: 'اجتماعي'
    };
    return typeMap[type] || type;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة'
    };
    return priorityMap[priority] || priority;
  };

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
    const statusMap: Record<string, string> = {
      scheduled: 'مجدولة',
      completed: 'مكتملة',
      cancelled: 'ملغية',
      rescheduled: 'معاد جدولتها'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة الإرشاد الطلابي</h2>
          <p className="text-muted-foreground">الخدمات الإرشادية والدعم النفسي للطلاب</p>
        </div>
        <Dialog open={showNewSessionDialog} onOpenChange={setShowNewSessionDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              جلسة إرشادية جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>حجز جلسة إرشادية جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الطالب</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الطالب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="st001">أحمد محمد علي - ST2024001</SelectItem>
                      <SelectItem value="st002">فاطمة سالم أحمد - ST2024002</SelectItem>
                      <SelectItem value="st003">محمد عبدالله حسن - ST2024003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">المرشد</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المرشد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr_sara">د. سارة أحمد</SelectItem>
                      <SelectItem value="dr_mohammed">د. محمد عبدالله</SelectItem>
                      <SelectItem value="dr_amira">د. أميرة سالم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">نوع الجلسة</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">أكاديمي</SelectItem>
                      <SelectItem value="personal">شخصي</SelectItem>
                      <SelectItem value="career">مهني</SelectItem>
                      <SelectItem value="social">اجتماعي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">الأولوية</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">عالية</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="low">منخفضة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">التاريخ</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium">الوقت</label>
                  <Input type="time" />
                </div>
                <div>
                  <label className="text-sm font-medium">المدة (دقيقة)</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="المدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="45">45 دقيقة</SelectItem>
                      <SelectItem value="60">60 دقيقة</SelectItem>
                      <SelectItem value="90">90 دقيقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">وصف الحالة</label>
                <Textarea placeholder="اكتب وصف للحالة أو المشكلة..." rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewSessionDialog(false)}>
                  إلغاء
                </Button>
                <Button>حجز الجلسة</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">جلسات اليوم</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلاب متابعون</p>
                <p className="text-2xl font-bold text-green-600">67</p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">حالات عاجلة</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">جلسات هذا الشهر</p>
                <p className="text-2xl font-bold text-purple-600">142</p>
              </div>
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="sessions">الجلسات الإرشادية</TabsTrigger>
          <TabsTrigger value="appointments">المواعيد</TabsTrigger>
          <TabsTrigger value="cases">الحالات النشطة</TabsTrigger>
          <TabsTrigger value="counselors">المرشدين</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث في الجلسات..." className="pr-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="academic">أكاديمي</SelectItem>
                <SelectItem value="personal">شخصي</SelectItem>
                <SelectItem value="career">مهني</SelectItem>
                <SelectItem value="social">اجتماعي</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="scheduled">مجدولة</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {counselingSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{session.studentName}</h3>
                        <Badge variant="outline">{session.studentId}</Badge>
                        <Badge className={getSessionTypeColor(session.sessionType)}>
                          {getSessionTypeText(session.sessionType)}
                        </Badge>
                        <Badge className={getPriorityColor(session.priority)}>
                          {getPriorityText(session.priority)}
                        </Badge>
                        <Badge className={getStatusColor(session.status)}>
                          {getStatusText(session.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">المرشد</p>
                          <p className="font-medium">{session.counselorName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">الموعد</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(session.scheduledDate).toLocaleDateString('ar-SA')}
                            </span>
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{session.scheduledTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-muted-foreground">وصف الحالة</p>
                        <p className="text-sm">{session.description}</p>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        مدة الجلسة: {session.duration} دقيقة
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {session.status === 'scheduled' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            إكمال
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            إعادة جدولة
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">إدارة المواعيد</h3>
            <p className="text-muted-foreground">جدولة وإدارة مواعيد الجلسات الإرشادية</p>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <div className="text-center py-12">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">الحالات النشطة</h3>
            <p className="text-muted-foreground">متابعة الحالات التي تتطلب إرشاد مستمر</p>
          </div>
        </TabsContent>

        <TabsContent value="counselors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  د. سارة أحمد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">متخصصة في الإرشاد الأكاديمي</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>0501234567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>sara.ahmed@university.edu</span>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-green-100 text-green-800">متاحة</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  د. محمد عبدالله
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">متخصص في الإرشاد النفسي</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>0509876543</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>mohammed.abdullah@university.edu</span>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-yellow-100 text-yellow-800">في جلسة</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  د. أميرة سالم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">متخصصة في الإرشاد المهني</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>0505555555</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>amira.salem@university.edu</span>
                  </div>
                  <div className="pt-2">
                    <Badge className="bg-green-100 text-green-800">متاحة</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">تقارير الإرشاد</h3>
            <p className="text-muted-foreground">تقارير شاملة عن الخدمات الإرشادية</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentCounselingManager;