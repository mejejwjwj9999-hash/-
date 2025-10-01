import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Search,
  Eye,
  Edit,
  FileText,
  User,
  Calendar
} from 'lucide-react';

const StudentBehaviorManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('violations');
  const [showNewViolationDialog, setShowNewViolationDialog] = useState(false);

  const violations = [
    {
      id: '1',
      studentName: 'أحمد محمد علي',
      studentId: 'ST2024001',
      type: 'غياب بدون عذر',
      severity: 'medium',
      description: 'غياب لمدة 3 أيام متتالية بدون عذر مقبول',
      date: '2024-01-15',
      status: 'pending',
      reportedBy: 'د. سارة أحمد'
    },
    {
      id: '2',
      studentName: 'فاطمة سالم أحمد',
      studentId: 'ST2024002',
      type: 'سوء سلوك',
      severity: 'high',
      description: 'إزعاج أثناء المحاضرة وعدم احترام المدرس',
      date: '2024-01-14',
      status: 'resolved',
      reportedBy: 'د. محمد عبدالله'
    },
    {
      id: '3',
      studentName: 'محمد عبدالله حسن',
      studentId: 'ST2024003',
      type: 'تأخر متكرر',
      severity: 'low',
      description: 'التأخر عن المحاضرات لأكثر من أسبوع',
      date: '2024-01-13',
      status: 'under_review',
      reportedBy: 'د. أميرة سالم'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityText = (severity: string) => {
    const severityMap: Record<string, string> = {
      low: 'بسيط',
      medium: 'متوسط',
      high: 'خطير'
    };
    return severityMap[severity] || severity;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'في الانتظار',
      under_review: 'قيد المراجعة',
      resolved: 'تم الحل',
      dismissed: 'تم الرفض'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة السلوك الطلابي</h2>
          <p className="text-muted-foreground">إدارة المخالفات والسلوك الطلابي</p>
        </div>
        <Dialog open={showNewViolationDialog} onOpenChange={setShowNewViolationDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              تسجيل مخالفة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>تسجيل مخالفة جديدة</DialogTitle>
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
                      <SelectItem value="st001">أحمد محمد علي</SelectItem>
                      <SelectItem value="st002">فاطمة سالم أحمد</SelectItem>
                      <SelectItem value="st003">محمد عبدالله حسن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">نوع المخالفة</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="absence">غياب بدون عذر</SelectItem>
                      <SelectItem value="misbehavior">سوء سلوك</SelectItem>
                      <SelectItem value="late">تأخر متكرر</SelectItem>
                      <SelectItem value="cheating">غش</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">درجة الخطورة</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر درجة الخطورة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">بسيط</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">خطير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">وصف المخالفة</label>
                <Textarea placeholder="اكتب وصف تفصيلي للمخالفة..." rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewViolationDialog(false)}>
                  إلغاء
                </Button>
                <Button>حفظ المخالفة</Button>
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
                <p className="text-sm font-medium text-muted-foreground">مخالفات نشطة</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">تم حلها</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">قيد المراجعة</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي هذا الشهر</p>
                <p className="text-2xl font-bold text-purple-600">34</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="violations">المخالفات</TabsTrigger>
          <TabsTrigger value="warnings">الإنذارات</TabsTrigger>
          <TabsTrigger value="rewards">المكافآت</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث في المخالفات..." className="pr-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="under_review">قيد المراجعة</SelectItem>
                <SelectItem value="resolved">تم الحل</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الخطورة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="low">بسيط</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">خطير</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {violations.map((violation) => (
              <Card key={violation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{violation.studentName}</h3>
                        <Badge variant="outline">{violation.studentId}</Badge>
                        <Badge className={getSeverityColor(violation.severity)}>
                          {getSeverityText(violation.severity)}
                        </Badge>
                        <Badge className={getStatusColor(violation.status)}>
                          {getStatusText(violation.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{violation.type}</p>
                        <p className="text-sm text-muted-foreground">{violation.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(violation.date).toLocaleDateString('ar-SA')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>بلغ بواسطة: {violation.reportedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {violation.status === 'pending' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          حل
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="warnings" className="space-y-4">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">إدارة الإنذارات</h3>
            <p className="text-muted-foreground">إنذارات أكاديمية وسلوكية للطلاب</p>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">المكافآت والتقدير</h3>
            <p className="text-muted-foreground">تسجيل المكافآت والسلوك الإيجابي</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">تقارير السلوك</h3>
            <p className="text-muted-foreground">تقارير شاملة عن السلوك الطلابي</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">إعدادات السلوك</h3>
            <p className="text-muted-foreground">إعدادات أنواع المخالفات والعقوبات</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBehaviorManager;