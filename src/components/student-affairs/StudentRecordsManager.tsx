import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileUser, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Download, 
  Upload,
  User,
  GraduationCap,
  Phone,
  Mail
} from 'lucide-react';

const StudentRecordsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    {
      id: '1',
      name: 'أحمد محمد علي',
      studentId: 'ST2024001',
      program: 'هندسة الحاسوب',
      level: 'السنة الثالثة',
      gpa: '3.85',
      status: 'active',
      phone: '0501234567',
      email: 'ahmed@university.edu'
    },
    {
      id: '2',
      name: 'فاطمة سالم أحمد',
      studentId: 'ST2024002',
      program: 'إدارة الأعمال',
      level: 'السنة الثانية',
      gpa: '3.92',
      status: 'active',
      phone: '0509876543',
      email: 'fatima@university.edu'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة ملفات الطلاب</h2>
          <p className="text-muted-foreground">إدارة الملفات الشخصية والأكاديمية للطلاب</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة طالب جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الطلاب</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلاب نشطون</p>
                <p className="text-2xl font-bold text-green-600">1,156</p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">خريجون هذا العام</p>
                <p className="text-2xl font-bold text-purple-600">234</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط المعدل</p>
                <p className="text-2xl font-bold text-orange-600">3.67</p>
              </div>
              <FileUser className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="students">الطلاب</TabsTrigger>
          <TabsTrigger value="documents">الوثائق</TabsTrigger>
          <TabsTrigger value="academic">السجل الأكاديمي</TabsTrigger>
          <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Upload className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      نشط
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">البرنامج</p>
                    <p className="text-sm">{student.program}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">المستوى</p>
                    <p className="text-sm">{student.level}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">المعدل التراكمي</p>
                    <p className="text-sm font-bold text-green-600">{student.gpa}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
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

        <TabsContent value="documents" className="space-y-4">
          <div className="text-center py-12">
            <FileUser className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">إدارة الوثائق</h3>
            <p className="text-muted-foreground">إدارة وثائق الطلاب والشهادات</p>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">السجل الأكاديمي</h3>
            <p className="text-muted-foreground">السجلات الأكاديمية والدرجات</p>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <div className="text-center py-12">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">البيانات الشخصية</h3>
            <p className="text-muted-foreground">معلومات الاتصال والبيانات الشخصية</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentRecordsManager;