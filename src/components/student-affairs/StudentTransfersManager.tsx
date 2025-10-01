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
  RefreshCw, 
  ArrowRight, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Edit
} from 'lucide-react';

const StudentTransfersManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);

  const transferRequests = [
    {
      id: '1',
      studentName: 'أحمد محمد علي',
      studentId: 'ST2024001',
      currentProgram: 'هندسة الحاسوب',
      requestedProgram: 'إدارة الأعمال',
      reason: 'رغبة في تغيير التخصص',
      submissionDate: '2024-01-15',
      status: 'pending',
      gpa: '3.85',
      semester: 'الفصل الرابع'
    },
    {
      id: '2',
      studentName: 'فاطمة سالم أحمد',
      studentId: 'ST2024002',
      currentProgram: 'الطب',
      requestedProgram: 'طب الأسنان',
      reason: 'ظروف صحية',
      submissionDate: '2024-01-14',
      status: 'approved',
      gpa: '3.92',
      semester: 'الفصل الثاني'
    },
    {
      id: '3',
      studentName: 'محمد عبدالله حسن',
      studentId: 'ST2024003',
      currentProgram: 'الهندسة المدنية',
      requestedProgram: 'الهندسة المعمارية',
      reason: 'اهتمام بالتصميم المعماري',
      submissionDate: '2024-01-13',
      status: 'rejected',
      gpa: '2.95',
      semester: 'الفصل السادس'
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
      approved: 'تم الموافقة',
      rejected: 'مرفوض',
      under_review: 'قيد المراجعة'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة النقل والتحويل</h2>
          <p className="text-muted-foreground">إدارة طلبات النقل والتحويل بين الأقسام والكليات</p>
        </div>
        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              طلب تحويل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>طلب تحويل جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">التخصص الحالي</label>
                  <Input readOnly value="هندسة الحاسوب" />
                </div>
                <div>
                  <label className="text-sm font-medium">التخصص المطلوب</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">إدارة الأعمال</SelectItem>
                      <SelectItem value="medicine">الطب</SelectItem>
                      <SelectItem value="engineering">الهندسة</SelectItem>
                      <SelectItem value="law">القانون</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">سبب التحويل</label>
                <Textarea placeholder="اكتب سبب طلب التحويل..." rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                  إلغاء
                </Button>
                <Button>تقديم الطلب</Button>
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
                <p className="text-2xl font-bold text-yellow-600">18</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلبات موافق عليها</p>
                <p className="text-2xl font-bold text-green-600">89</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلبات مرفوضة</p>
                <p className="text-2xl font-bold text-red-600">23</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي هذا العام</p>
                <p className="text-2xl font-bold text-blue-600">130</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="requests">طلبات التحويل</TabsTrigger>
          <TabsTrigger value="approved">المحولون</TabsTrigger>
          <TabsTrigger value="requirements">المتطلبات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="البحث في طلبات التحويل..." className="pr-10" />
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
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {transferRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{request.studentName}</h3>
                        <Badge variant="outline">{request.studentId}</Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">التخصص الحالي</p>
                          <p className="font-medium">{request.currentProgram}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">التخصص المطلوب</p>
                          <p className="font-medium text-blue-600">{request.requestedProgram}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">المعدل التراكمي</p>
                          <p className="font-bold text-green-600">{request.gpa}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">الفصل الدراسي</p>
                          <p>{request.semester}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-muted-foreground">سبب التحويل</p>
                        <p className="text-sm">{request.reason}</p>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        تاريخ التقديم: {new Date(request.submissionDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            موافقة
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-2" />
                            رفض
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

        <TabsContent value="approved" className="space-y-4">
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">الطلاب المحولون</h3>
            <p className="text-muted-foreground">قائمة الطلاب الذين تم تحويلهم بنجاح</p>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  متطلبات التحويل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• معدل تراكمي لا يقل عن 3.0</li>
                  <li>• عدم وجود مخالفات أكاديمية</li>
                  <li>• موافقة القسم الحالي</li>
                  <li>• موافقة القسم المطلوب</li>
                  <li>• استيفاء شروط القبول</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  إجراءات التحويل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>1. تقديم الطلب</li>
                  <li>2. مراجعة أولية</li>
                  <li>3. موافقة الأقسام</li>
                  <li>4. موافقة العمادة</li>
                  <li>5. إنهاء الإجراءات</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  مواعيد مهمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• فترة التقديم: 1-15 من كل شهر</li>
                  <li>• مراجعة الطلبات: أسبوعان</li>
                  <li>• الرد النهائي: 30 يوم</li>
                  <li>• بداية التطبيق: الفصل التالي</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">تقارير التحويل</h3>
            <p className="text-muted-foreground">تقارير إحصائية عن حركة التحويلات</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentTransfersManager;