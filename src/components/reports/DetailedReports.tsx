
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Users, 
  DollarSign,
  GraduationCap,
  Calendar,
  Award,
  AlertTriangle
} from 'lucide-react';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
import { supabase } from '@/integrations/supabase/client';

const DetailedReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_semester');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // جلب تقارير الأداء
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['detailed-reports', selectedPeriod, selectedDepartment, startDate, endDate],
    queryFn: async () => {
      // محاكاة استعلامات قاعدة البيانات المعقدة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        studentPerformance: [
          { department: 'الصيدلة', avgGrade: 3.4, passRate: 89, totalStudents: 120 },
          { department: 'التمريض', avgGrade: 3.6, passRate: 92, totalStudents: 85 },
          { department: 'تقنية المعلومات', avgGrade: 3.2, passRate: 85, totalStudents: 95 },
          { department: 'إدارة الأعمال', avgGrade: 3.5, passRate: 88, totalStudents: 75 },
          { department: 'القبالة', avgGrade: 3.7, passRate: 94, totalStudents: 45 }
        ],
        financialSummary: {
          totalRevenue: 450000,
          collectedPayments: 380000,
          pendingPayments: 70000,
          scholarships: 25000,
          expenses: 320000,
          netProfit: 60000,
          paymentMethods: [
            { method: 'نقدي', amount: 150000, percentage: 39.5 },
            { method: 'تحويل بنكي', amount: 180000, percentage: 47.4 },
            { method: 'بطاقة ائتمان', amount: 50000, percentage: 13.1 }
          ]
        },
        enrollmentTrends: [
          { semester: 'خريف 2023', enrollments: 420, graduates: 85, dropout: 12 },
          { semester: 'ربيع 2024', enrollments: 450, graduates: 92, dropout: 8 },
          { semester: 'صيف 2024', enrollments: 380, graduates: 78, dropout: 15 },
          { semester: 'خريف 2024', enrollments: 485, graduates: 98, dropout: 6 }
        ],
        coursePerformance: [
          { course: 'كيمياء صيدلانية', avgScore: 78, passRate: 85, difficulty: 'صعب' },
          { course: 'التمريض الأساسي', avgScore: 82, passRate: 90, difficulty: 'متوسط' },
          { course: 'برمجة المواقع', avgScore: 75, passRate: 82, difficulty: 'صعب' },
          { course: 'إدارة المشاريع', avgScore: 80, passRate: 88, difficulty: 'متوسط' },
          { course: 'علم الأجنة', avgScore: 85, passRate: 92, difficulty: 'سهل' }
        ]
      };
    }
  });

  const exportReport = (reportType: string) => {
    console.log(`تصدير تقرير: ${reportType}`);
    // في التطبيق الحقيقي، سيتم إنشاء وتحميل ملف PDF أو Excel
  };

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  const { studentPerformance, financialSummary, enrollmentTrends, coursePerformance } = performanceData || {};

  return (
    <div className="space-y-6">
      {/* أدوات التحكم في التقارير */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            مُولد التقارير التفصيلية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">الفترة الزمنية</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_semester">الفصل الحالي</SelectItem>
                  <SelectItem value="last_semester">الفصل السابق</SelectItem>
                  <SelectItem value="current_year">السنة الحالية</SelectItem>
                  <SelectItem value="last_year">السنة السابقة</SelectItem>
                  <SelectItem value="custom">فترة مخصصة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">القسم</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  <SelectItem value="pharmacy">الصيدلة</SelectItem>
                  <SelectItem value="nursing">التمريض</SelectItem>
                  <SelectItem value="it">تقنية المعلومات</SelectItem>
                  <SelectItem value="business">إدارة الأعمال</SelectItem>
                  <SelectItem value="midwifery">القبالة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === 'custom' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">تاريخ البداية</label>
                  <DatePicker selected={startDate} onSelect={setStartDate} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">تاريخ النهاية</label>
                  <DatePicker selected={endDate} onSelect={setEndDate} />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={() => exportReport('comprehensive')} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير تقرير شامل
            </Button>
            <Button variant="outline" onClick={() => exportReport('financial')}>
              تقرير مالي
            </Button>
            <Button variant="outline" onClick={() => exportReport('academic')}>
              تقرير أكاديمي
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* التقارير التفصيلية */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">أداء الطلاب</TabsTrigger>
          <TabsTrigger value="financial">التحليل المالي</TabsTrigger>
          <TabsTrigger value="enrollment">اتجاهات التسجيل</TabsTrigger>
          <TabsTrigger value="courses">أداء المقررات</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  متوسط الدرجات حسب القسم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <Bar dataKey="avgGrade" fill="hsl(var(--university-blue))" name="متوسط الدرجة" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  معدل النجاح
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="passRate" fill="hsl(var(--university-gold))" name="معدل النجاح %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>إحصائيات تفصيلية للأقسام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">القسم</th>
                      <th className="text-right p-2">عدد الطلاب</th>
                      <th className="text-right p-2">متوسط الدرجة</th>
                      <th className="text-right p-2">معدل النجاح</th>
                      <th className="text-right p-2">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPerformance?.map((dept, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{dept.department}</td>
                        <td className="p-2">{dept.totalStudents}</td>
                        <td className="p-2">{dept.avgGrade.toFixed(2)}</td>
                        <td className="p-2">{dept.passRate}%</td>
                        <td className="p-2">
                          <Badge variant={dept.passRate >= 90 ? "default" : dept.passRate >= 85 ? "secondary" : "destructive"}>
                            {dept.passRate >= 90 ? "ممتاز" : dept.passRate >= 85 ? "جيد" : "يحتاج تحسين"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${financialSummary?.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">المدفوعات المحصلة</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${financialSummary?.collectedPayments?.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">مدفوعات معلقة</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${financialSummary?.pendingPayments?.toLocaleString()}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>توزيع طرق الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={financialSummary?.paymentMethods}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="amount"
                    label={({ method, percentage }) => `${method}: ${percentage}%`}
                  >
                    {financialSummary?.paymentMethods?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={['hsl(var(--university-blue))', 'hsl(var(--university-gold))', 'hsl(var(--university-red))'][index]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                اتجاهات التسجيل والتخرج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={enrollmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="enrollments" 
                    stroke="hsl(var(--university-blue))" 
                    strokeWidth={3}
                    name="التسجيلات الجديدة"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="graduates" 
                    stroke="hsl(var(--university-gold))" 
                    strokeWidth={3}
                    name="الخريجون"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dropout" 
                    stroke="hsl(var(--university-red))" 
                    strokeWidth={3}
                    name="المنقطعون"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                تحليل أداء المقررات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3">المقرر</th>
                      <th className="text-right p-3">متوسط النقاط</th>
                      <th className="text-right p-3">معدل النجاح</th>
                      <th className="text-right p-3">مستوى الصعوبة</th>
                      <th className="text-right p-3">التقييم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursePerformance?.map((course, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{course.course}</td>
                        <td className="p-3">{course.avgScore}</td>
                        <td className="p-3">{course.passRate}%</td>
                        <td className="p-3">
                          <Badge 
                            variant={
                              course.difficulty === 'سهل' ? "default" :
                              course.difficulty === 'متوسط' ? "secondary" : "destructive"
                            }
                          >
                            {course.difficulty}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={course.passRate >= 90 ? "default" : course.passRate >= 80 ? "secondary" : "destructive"}>
                            {course.passRate >= 90 ? "ممتاز" : course.passRate >= 80 ? "جيد" : "يحتاج تحسين"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedReports;
