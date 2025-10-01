import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserCheck, 
  FileText, 
  ClipboardList, 
  MessageSquare, 
  GraduationCap, 
  Calendar,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  Award,
  Heart,
  BookOpen,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentAffairsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('enrollment');
  const [searchTerm, setSearchTerm] = useState('');

  const affairsStats = [
    { 
      title: 'الطلاب المسجلين', 
      value: '1,247', 
      change: '+12%', 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'الطلاب المنتظمين', 
      value: '1,189', 
      change: '+8%', 
      icon: UserCheck, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'طلبات النقل', 
      value: '23', 
      change: '-5%', 
      icon: MessageSquare, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'المنح الفعالة', 
      value: '87', 
      change: '+15%', 
      icon: Award, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const enrollmentData = [
    { id: 1, name: 'أحمد محمود علي', studentId: 'S2024001', program: 'هندسة حاسوب', year: 'السنة الأولى', status: 'مكتمل', date: '2024-01-15' },
    { id: 2, name: 'فاطمة أحمد حسن', studentId: 'S2024002', program: 'إدارة أعمال', year: 'السنة الثانية', status: 'قيد المراجعة', date: '2024-01-16' },
    { id: 3, name: 'محمد عبدالله سالم', studentId: 'S2024003', program: 'الطب', year: 'السنة الأولى', status: 'مكتمل', date: '2024-01-17' }
  ];

  const scholarshipData = [
    { id: 1, name: 'سارة عبدالرحمن', studentId: 'S2023045', type: 'منحة تفوق أكاديمي', amount: '5000 ر.س', status: 'فعالة', duration: '2024-2025' },
    { id: 2, name: 'خالد أحمد محمد', studentId: 'S2023067', type: 'منحة دعم اجتماعي', amount: '3000 ر.س', status: 'قيد المراجعة', duration: '2024-2025' },
    { id: 3, name: 'نور فاطمة علي', studentId: 'S2023089', type: 'منحة رياضية', amount: '4000 ر.س', status: 'فعالة', duration: '2024-2025' }
  ];

  const activitiesData = [
    { id: 1, name: 'معرض العلوم والتكنولوجيا', date: '2024-03-15', participants: 45, type: 'أكاديمي', status: 'مقبل' },
    { id: 2, name: 'دوري كرة القدم الداخلي', date: '2024-02-20', participants: 120, type: 'رياضي', status: 'جاري' },
    { id: 3, name: 'ندوة ريادة الأعمال', date: '2024-02-10', participants: 80, type: 'ثقافي', status: 'مكتمل' }
  ];

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'مكتمل': 'bg-green-100 text-green-800',
      'قيد المراجعة': 'bg-yellow-100 text-yellow-800',
      'فعالة': 'bg-green-100 text-green-800',
      'مقبل': 'bg-blue-100 text-blue-800',
      'جاري': 'bg-orange-100 text-orange-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-admin-header to-admin-accent bg-clip-text text-transparent">
            إدارة شؤون الطلاب
          </h1>
          <p className="text-muted-foreground mt-2">
            نظام شامل لإدارة جميع شؤون وخدمات الطلاب
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            استيراد البيانات
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {affairsStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-admin-accent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            إدارة شؤون الطلاب
          </CardTitle>
          <CardDescription>
            إدارة متكاملة لجميع خدمات وشؤون الطلاب
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
              <TabsTrigger value="enrollment" className="text-sm">تسجيل الطلاب</TabsTrigger>
              <TabsTrigger value="records" className="text-sm">ملفات الطلاب</TabsTrigger>
              <TabsTrigger value="attendance" className="text-sm">الحضور والغياب</TabsTrigger>
              <TabsTrigger value="behavior" className="text-sm">السلوك</TabsTrigger>
              <TabsTrigger value="transfers" className="text-sm">النقل والتحويل</TabsTrigger>
              <TabsTrigger value="scholarships" className="text-sm">المنح الدراسية</TabsTrigger>
              <TabsTrigger value="counseling" className="text-sm">الإرشاد</TabsTrigger>
              <TabsTrigger value="activities" className="text-sm">الأنشطة</TabsTrigger>
            </TabsList>

            {/* Student Enrollment Tab */}
            <TabsContent value="enrollment" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث عن طالب..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  تسجيل طالب جديد
                </Button>
              </div>

              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-right p-4 font-semibold">اسم الطالب</th>
                        <th className="text-right p-4 font-semibold">رقم الطالب</th>
                        <th className="text-right p-4 font-semibold">البرنامج</th>
                        <th className="text-right p-4 font-semibold">السنة الدراسية</th>
                        <th className="text-right p-4 font-semibold">حالة التسجيل</th>
                        <th className="text-right p-4 font-semibold">تاريخ التسجيل</th>
                        <th className="text-right p-4 font-semibold">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollmentData.map((student) => (
                        <tr key={student.id} className="border-t hover:bg-muted/25">
                          <td className="p-4 font-medium">{student.name}</td>
                          <td className="p-4 text-muted-foreground">{student.studentId}</td>
                          <td className="p-4">{student.program}</td>
                          <td className="p-4">{student.year}</td>
                          <td className="p-4">
                            <Badge className={getStatusBadge(student.status)}>
                              {student.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{student.date}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Scholarships Tab */}
            <TabsContent value="scholarships" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في المنح..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة منحة جديدة
                </Button>
              </div>

              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-right p-4 font-semibold">اسم الطالب</th>
                        <th className="text-right p-4 font-semibold">رقم الطالب</th>
                        <th className="text-right p-4 font-semibold">نوع المنحة</th>
                        <th className="text-right p-4 font-semibold">المبلغ</th>
                        <th className="text-right p-4 font-semibold">حالة المنحة</th>
                        <th className="text-right p-4 font-semibold">فترة المنحة</th>
                        <th className="text-right p-4 font-semibold">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scholarshipData.map((scholarship) => (
                        <tr key={scholarship.id} className="border-t hover:bg-muted/25">
                          <td className="p-4 font-medium">{scholarship.name}</td>
                          <td className="p-4 text-muted-foreground">{scholarship.studentId}</td>
                          <td className="p-4">{scholarship.type}</td>
                          <td className="p-4 font-semibold text-green-600">{scholarship.amount}</td>
                          <td className="p-4">
                            <Badge className={getStatusBadge(scholarship.status)}>
                              {scholarship.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{scholarship.duration}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الأنشطة..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة نشاط جديد
                </Button>
              </div>

              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-right p-4 font-semibold">اسم النشاط</th>
                        <th className="text-right p-4 font-semibold">التاريخ</th>
                        <th className="text-right p-4 font-semibold">عدد المشاركين</th>
                        <th className="text-right p-4 font-semibold">نوع النشاط</th>
                        <th className="text-right p-4 font-semibold">الحالة</th>
                        <th className="text-right p-4 font-semibold">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activitiesData.map((activity) => (
                        <tr key={activity.id} className="border-t hover:bg-muted/25">
                          <td className="p-4 font-medium">{activity.name}</td>
                          <td className="p-4 text-muted-foreground">{activity.date}</td>
                          <td className="p-4">{activity.participants}</td>
                          <td className="p-4">{activity.type}</td>
                          <td className="p-4">
                            <Badge className={getStatusBadge(activity.status)}>
                              {activity.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Users className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Other tabs placeholder */}
            <TabsContent value="records" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">ملفات الطلاب</h3>
                    <p className="text-muted-foreground">إدارة وأرشفة ملفات الطلاب الشخصية والأكاديمية</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">الحضور والغياب</h3>
                    <p className="text-muted-foreground">متابعة حضور الطلاب وإدارة سجلات الغياب</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">السلوك الطلابي</h3>
                    <p className="text-muted-foreground">متابعة وتقييم السلوك الطلابي والإجراءات التأديبية</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transfers" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">النقل والتحويل</h3>
                    <p className="text-muted-foreground">إدارة طلبات نقل الطلاب والتحويل بين التخصصات</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="counseling" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">الإرشاد الطلابي</h3>
                    <p className="text-muted-foreground">خدمات الإرشاد الأكاديمي والنفسي للطلاب</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAffairsManagement;
