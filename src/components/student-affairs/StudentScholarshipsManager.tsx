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
  Award, 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';

const StudentScholarshipsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scholarships');
  const [showNewScholarshipDialog, setShowNewScholarshipDialog] = useState(false);

  const scholarships = [
    {
      id: '1',
      name: 'منحة التفوق الأكاديمي',
      type: 'academic',
      amount: 5000,
      currency: 'ريال',
      duration: 'فصل دراسي',
      criteria: 'معدل تراكمي أعلى من 3.8',
      totalRecipients: 45,
      availableSlots: 5,
      status: 'active',
      applicationDeadline: '2024-02-15'
    },
    {
      id: '2',
      name: 'منحة الحاجة المالية',
      type: 'need_based',
      amount: 3000,
      currency: 'ريال',
      duration: 'عام دراسي',
      criteria: 'إثبات الحاجة المالية',
      totalRecipients: 78,
      availableSlots: 12,
      status: 'active',
      applicationDeadline: '2024-03-01'
    },
    {
      id: '3',
      name: 'منحة الأنشطة الطلابية',
      type: 'activity',
      amount: 2000,
      currency: 'ريال',
      duration: 'فصل دراسي',
      criteria: 'المشاركة الفعالة في الأنشطة',
      totalRecipients: 23,
      availableSlots: 8,
      status: 'active',
      applicationDeadline: '2024-02-28'
    }
  ];

  const applications = [
    {
      id: '1',
      studentName: 'أحمد محمد علي',
      studentId: 'ST2024001',
      scholarshipName: 'منحة التفوق الأكاديمي',
      gpa: '3.85',
      applicationDate: '2024-01-15',
      status: 'pending',
      documents: ['كشف الدرجات', 'إثبات التسجيل']
    },
    {
      id: '2',
      studentName: 'فاطمة سالم أحمد',
      studentId: 'ST2024002',
      scholarshipName: 'منحة الحاجة المالية',
      gpa: '3.62',
      applicationDate: '2024-01-14',
      status: 'approved',
      documents: ['إثبات الدخل', 'كشف الدرجات']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'need_based': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      case 'sports': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      academic: 'أكاديمية',
      need_based: 'حاجة مالية',
      activity: 'أنشطة',
      sports: 'رياضية'
    };
    return typeMap[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'نشطة',
      inactive: 'غير نشطة',
      pending: 'في الانتظار',
      approved: 'موافق عليها',
      rejected: 'مرفوضة'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة المنح الدراسية</h2>
          <p className="text-muted-foreground">إدارة المنح والمساعدات المالية للطلاب</p>
        </div>
        <Dialog open={showNewScholarshipDialog} onOpenChange={setShowNewScholarshipDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              منحة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة منحة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">اسم المنحة</label>
                <Input placeholder="مثال: منحة التفوق الأكاديمي" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">نوع المنحة</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">أكاديمية</SelectItem>
                      <SelectItem value="need_based">حاجة مالية</SelectItem>
                      <SelectItem value="activity">أنشطة طلابية</SelectItem>
                      <SelectItem value="sports">رياضية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">المبلغ (ريال)</label>
                  <Input type="number" placeholder="5000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">المدة</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semester">فصل دراسي</SelectItem>
                      <SelectItem value="year">عام دراسي</SelectItem>
                      <SelectItem value="program">كامل البرنامج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">عدد المقاعد المتاحة</label>
                  <Input type="number" placeholder="10" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">معايير الاستحقاق</label>
                <Textarea placeholder="اكتب معايير الاستحقاق..." rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">آخر موعد للتقديم</label>
                <Input type="date" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewScholarshipDialog(false)}>
                  إلغاء
                </Button>
                <Button>حفظ المنحة</Button>
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
                <p className="text-sm font-medium text-muted-foreground">إجمالي المنح</p>
                <p className="text-2xl font-bold text-blue-600">18</p>
              </div>
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المستفيدين</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المبالغ</p>
                <p className="text-2xl font-bold text-yellow-600">742,000</p>
                <p className="text-xs text-muted-foreground">ريال سعودي</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلبات معلقة</p>
                <p className="text-2xl font-bold text-orange-600">24</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="scholarships">المنح المتاحة</TabsTrigger>
          <TabsTrigger value="applications">طلبات المنح</TabsTrigger>
          <TabsTrigger value="recipients">المستفيدون</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="scholarships" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث في المنح..." className="pr-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="academic">أكاديمية</SelectItem>
                <SelectItem value="need_based">حاجة مالية</SelectItem>
                <SelectItem value="activity">أنشطة</SelectItem>
                <SelectItem value="sports">رياضية</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{scholarship.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(scholarship.type)}>
                          {getTypeText(scholarship.type)}
                        </Badge>
                        <Badge className={getStatusColor(scholarship.status)}>
                          {getStatusText(scholarship.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المبلغ</span>
                    <span className="font-bold text-green-600">
                      {scholarship.amount.toLocaleString()} {scholarship.currency}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المدة</span>
                    <span className="text-sm">{scholarship.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">المستفيدون</span>
                    <span className="text-sm font-medium">{scholarship.totalRecipients}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">مقاعد متاحة</span>
                    <span className="text-sm font-medium text-blue-600">{scholarship.availableSlots}</span>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">معايير الاستحقاق</p>
                    <p className="text-sm">{scholarship.criteria}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>آخر موعد للتقديم</span>
                    <span>{new Date(scholarship.applicationDeadline).toLocaleDateString('ar-SA')}</span>
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

        <TabsContent value="applications" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث في طلبات المنح..." className="pr-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="approved">موافق عليها</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-4 font-medium">اسم الطالب</th>
                      <th className="text-right p-4 font-medium">الرقم الجامعي</th>
                      <th className="text-right p-4 font-medium">المنحة</th>
                      <th className="text-right p-4 font-medium">المعدل</th>
                      <th className="text-right p-4 font-medium">تاريخ التقديم</th>
                      <th className="text-right p-4 font-medium">الحالة</th>
                      <th className="text-right p-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{application.studentName}</td>
                        <td className="p-4 text-muted-foreground">{application.studentId}</td>
                        <td className="p-4">{application.scholarshipName}</td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800">{application.gpa}</Badge>
                        </td>
                        <td className="p-4">{new Date(application.applicationDate).toLocaleDateString('ar-SA')}</td>
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
                            {application.status === 'pending' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="w-4 h-4" />
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

        <TabsContent value="recipients" className="space-y-4">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">المستفيدون من المنح</h3>
            <p className="text-muted-foreground">قائمة الطلاب المستفيدين من المنح الدراسية</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">تقرير المنح</h3>
                <p className="text-sm text-muted-foreground">إحصائيات شاملة عن المنح</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">التقرير المالي</h3>
                <p className="text-sm text-muted-foreground">المبالغ المدفوعة والمتبقية</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">تحليل الأداء</h3>
                <p className="text-sm text-muted-foreground">تحليل أداء برامج المنح</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentScholarshipsManager;