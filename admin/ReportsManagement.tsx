import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, FileText, Users, GraduationCap, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReportsManagement: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedSemester, setSelectedSemester] = useState("الأول");

  // إحصائيات عامة
  const { data: overallStats } = useQuery({
    queryKey: ["reports-overall-stats"],
    queryFn: async () => {
      const [studentsCount, coursesCount, paymentsSum, gradesCount] = await Promise.all([
        supabase.from("student_profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("payment_status", "paid"),
        supabase.from("grades").select("id", { count: "exact", head: true })
      ]);

      const totalRevenue = paymentsSum.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

      return {
        totalStudents: studentsCount.count || 0,
        totalCourses: coursesCount.count || 0,
        totalRevenue,
        totalGrades: gradesCount.count || 0
      };
    },
  });

  // تقرير الطلاب
  const { data: studentsReport } = useQuery({
    queryKey: ["reports-students", selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("college, department, status, academic_year")
        .eq("academic_year", parseInt(selectedYear.split("-")[0]));
      
      if (error) throw error;

      // تجميع البيانات
      const byCollege = data?.reduce((acc: any, student) => {
        acc[student.college] = (acc[student.college] || 0) + 1;
        return acc;
      }, {}) || {};

      const byStatus = data?.reduce((acc: any, student) => {
        acc[student.status] = (acc[student.status] || 0) + 1;
        return acc;
      }, {}) || {};

      return { byCollege, byStatus, total: data?.length || 0 };
    },
  });

  // تقرير الدرجات
  const { data: gradesReport } = useQuery({
    queryKey: ["reports-grades", selectedYear, selectedSemester],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grades")
        .select(`
          letter_grade,
          gpa_points,
          status,
          courses!inner (course_name_ar, college)
        `)
        .eq("academic_year", selectedYear)
        .eq("semester", selectedSemester);
      
      if (error) throw error;

      const letterGradeStats = data?.reduce((acc: any, grade) => {
        const letter = grade.letter_grade || 'غير محدد';
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
      }, {}) || {};

      const averageGPA = data?.reduce((sum, grade) => sum + (grade.gpa_points || 0), 0) / (data?.length || 1);

      return { letterGradeStats, averageGPA: averageGPA?.toFixed(2), total: data?.length || 0 };
    },
  });

  // تقرير المدفوعات
  const { data: paymentsReport } = useQuery({
    queryKey: ["reports-payments", selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount, payment_status, payment_type, academic_year")
        .eq("academic_year", selectedYear);
      
      if (error) throw error;

      const totalAmount = data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const paidAmount = data?.filter(p => p.payment_status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const pendingAmount = data?.filter(p => p.payment_status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0) || 0;

      const byType = data?.reduce((acc: any, payment) => {
        acc[payment.payment_type] = (acc[payment.payment_type] || 0) + payment.amount;
        return acc;
      }, {}) || {};

      return { totalAmount, paidAmount, pendingAmount, byType };
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: 'YER',
    }).format(amount);
  };

  const exportReport = (reportType: string) => {
    // هنا يمكن إضافة منطق تصدير التقارير
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">التقارير والإحصائيات</h1>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
              <SelectItem value="2022-2023">2022-2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="الأول">الأول</SelectItem>
              <SelectItem value="الثاني">الثاني</SelectItem>
              <SelectItem value="الصيفي">الصيفي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              إجمالي الطلاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats?.totalStudents || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              إجمالي المقررات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats?.totalCourses || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              إجمالي الإيرادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(overallStats?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              إجمالي الدرجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats?.totalGrades || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">تقرير الطلاب</TabsTrigger>
          <TabsTrigger value="grades">تقرير الدرجات</TabsTrigger>
          <TabsTrigger value="payments">تقرير المدفوعات</TabsTrigger>
          <TabsTrigger value="academic">التقرير الأكاديمي</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>تقرير الطلاب</CardTitle>
                <Button onClick={() => exportReport('students')} className="gap-2">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">التوزيع حسب الكلية</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الكلية</TableHead>
                        <TableHead>عدد الطلاب</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(studentsReport?.byCollege || {}).map(([college, count]) => (
                        <TableRow key={college}>
                          <TableCell>{college}</TableCell>
                          <TableCell className="font-medium">{count as number}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h4 className="font-medium mb-3">التوزيع حسب الحالة</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الحالة</TableHead>
                        <TableHead>عدد الطلاب</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(studentsReport?.byStatus || {}).map(([status, count]) => (
                        <TableRow key={status}>
                          <TableCell>{status === 'active' ? 'نشط' : status === 'suspended' ? 'موقوف' : status}</TableCell>
                          <TableCell className="font-medium">{count as number}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>تقرير الدرجات - {selectedYear} - الفصل {selectedSemester}</CardTitle>
                <Button onClick={() => exportReport('grades')} className="gap-2">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">التوزيع حسب حرف التقدير</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التقدير</TableHead>
                        <TableHead>عدد الطلاب</TableHead>
                        <TableHead>النسبة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(gradesReport?.letterGradeStats || {}).map(([grade, count]) => (
                        <TableRow key={grade}>
                          <TableCell className="font-medium">{grade}</TableCell>
                          <TableCell>{count as number}</TableCell>
                          <TableCell>
                            {((count as number / (gradesReport?.total || 1)) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h4 className="font-medium mb-3">إحصائيات عامة</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">متوسط المعدل التراكمي</div>
                      <div className="text-2xl font-bold">{gradesReport?.averageGPA || '0.00'}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">إجمالي الدرجات المسجلة</div>
                      <div className="text-2xl font-bold">{gradesReport?.total || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>تقرير المدفوعات - {selectedYear}</CardTitle>
                <Button onClick={() => exportReport('payments')} className="gap-2">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">ملخص المدفوعات</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">إجمالي المدفوعات</div>
                      <div className="text-xl font-bold">
                        {formatCurrency(paymentsReport?.totalAmount || 0)}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">المدفوعات المكتملة</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(paymentsReport?.paidAmount || 0)}
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">المدفوعات المعلقة</div>
                      <div className="text-xl font-bold text-yellow-600">
                        {formatCurrency(paymentsReport?.pendingAmount || 0)}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">التوزيع حسب نوع الدفعة</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>نوع الدفعة</TableHead>
                        <TableHead>المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(paymentsReport?.byType || {}).map(([type, amount]) => (
                        <TableRow key={type}>
                          <TableCell>{type}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(amount as number)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>التقرير الأكاديمي الشامل</CardTitle>
                <Button onClick={() => exportReport('academic')} className="gap-2">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>التقرير الأكاديمي الشامل قيد التطوير</p>
                <p className="text-sm mt-2">سيتضمن تحليلات شاملة للأداء الأكاديمي والإحصائيات المتقدمة</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;