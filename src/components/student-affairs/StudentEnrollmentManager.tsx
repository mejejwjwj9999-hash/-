import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Check, 
  X,
  UserPlus,
  FileText,
  Calendar
} from 'lucide-react';

const StudentEnrollmentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewApplicationDialog, setShowNewApplicationDialog] = useState(false);

  // بيانات وهمية للطلبات
  const applications = [
    {
      id: '1',
      studentName: 'أحمد محمد علي',
      nationalId: '1234567890',
      phone: '0501234567',
      email: 'ahmed@example.com',
      program: 'هندسة الحاسوب',
      status: 'pending',
      submissionDate: '2024-01-15',
      documents: ['شهادة الثانوية', 'صورة الهوية', 'صورة شخصية']
    },
    {
      id: '2',
      studentName: 'فاطمة سالم أحمد',
      nationalId: '9876543210',
      phone: '0509876543',
      email: 'fatima@example.com',
      program: 'إدارة الأعمال',
      status: 'approved',
      submissionDate: '2024-01-14',
      documents: ['شهادة الثانوية', 'صورة الهوية', 'صورة شخصية']
    },
    {
      id: '3',
      studentName: 'محمد عبدالله حسن',
      nationalId: '5678901234',
      phone: '0505678901',
      email: 'mohammed@example.com',
      program: 'الطب',
      status: 'rejected',
      submissionDate: '2024-01-13',
      documents: ['شهادة الثانوية', 'صورة الهوية']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'في الانتظار',
      approved: 'تم القبول',
      rejected: 'مرفوض',
      under_review: 'قيد المراجعة'
    };
    return statusMap[status] || status;
  };

  const handleApprove = (id: string) => {
    console.log('تم قبول الطلب:', id);
  };

  const handleReject = (id: string) => {
    console.log('تم رفض الطلب:', id);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة تسجيل الطلاب</h2>
          <p className="text-muted-foreground">إدارة طلبات التسجيل والقبول</p>
        </div>
        <Dialog open={showNewApplicationDialog} onOpenChange={setShowNewApplicationDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              طلب تسجيل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>طلب تسجيل جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName">اسم الطالب</Label>
                  <Input id="studentName" placeholder="الاسم الكامل" />
                </div>
                <div>
                  <Label htmlFor="nationalId">رقم الهوية</Label>
                  <Input id="nationalId" placeholder="رقم الهوية الوطنية" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" placeholder="05xxxxxxxx" />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="program">البرنامج الأكاديمي</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البرنامج" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-engineering">هندسة الحاسوب</SelectItem>
                    <SelectItem value="business-admin">إدارة الأعمال</SelectItem>
                    <SelectItem value="medicine">الطب</SelectItem>
                    <SelectItem value="law">القانون</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewApplicationDialog(false)}>
                  إلغاء
                </Button>
                <Button>حفظ الطلب</Button>
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
                <p className="text-sm font-medium text-muted-foreground">طلبات في الانتظار</p>
                <p className="text-2xl font-bold text-yellow-600">23</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلبات مقبولة</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلبات مرفوضة</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-blue-600">191</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="applications">طلبات التسجيل</TabsTrigger>
          <TabsTrigger value="approved">الطلاب المقبولين</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {/* أدوات البحث والفلترة */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="approved">مقبول</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
                <SelectItem value="under_review">قيد المراجعة</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>

          {/* جدول الطلبات */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-4 font-medium">اسم الطالب</th>
                      <th className="text-right p-4 font-medium">رقم الهوية</th>
                      <th className="text-right p-4 font-medium">البرنامج</th>
                      <th className="text-right p-4 font-medium">تاريخ التقديم</th>
                      <th className="text-right p-4 font-medium">الحالة</th>
                      <th className="text-right p-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{application.studentName}</div>
                            <div className="text-sm text-muted-foreground">{application.email}</div>
                          </div>
                        </td>
                        <td className="p-4">{application.nationalId}</td>
                        <td className="p-4">{application.program}</td>
                        <td className="p-4">{new Date(application.submissionDate).toLocaleDateString('ar-SA')}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusText(application.status)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {application.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleApprove(application.id)}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReject(application.id)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="text-center py-12">
            <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">الطلاب المقبولين</h3>
            <p className="text-muted-foreground">قائمة الطلاب الذين تم قبولهم وتسجيلهم</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">تقارير التسجيل</h3>
            <p className="text-muted-foreground">تقارير شاملة عن عمليات التسجيل والقبول</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">إعدادات التسجيل</h3>
            <p className="text-muted-foreground">إعدادات فترات التسجيل والمتطلبات</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentEnrollmentManager;