
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  CreditCard, 
  FileText, 
  Bell,
  GraduationCap,
  Clock,
  TrendingUp,
  Users
} from "lucide-react";

type GradeWithCourse = {
  id: string;
  student_id: string;
  course_id: string;
  total_grade: number | null;
  letter_grade: string | null;
  gpa_points: number | null;
  status: string;
  created_at: string;
  courses: {
    course_name_ar: string;
    course_code: string;
    credit_hours: number;
  };
};

const StudentDashboard = () => {
  const { user, profile } = useAuth();

  // Fetch student's grades
  const { data: grades } = useQuery({
    queryKey: ["student-grades", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from("grades")
        .select(`
          *,
          courses!grades_course_id_fkey (
            course_name_ar,
            course_code,
            credit_hours
          )
        `)
        .eq("student_id", profile.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as GradeWithCourse[] || [];
    },
    enabled: !!profile?.id,
  });

  // Fetch student's payments
  const { data: payments } = useQuery({
    queryKey: ["student-payments", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("student_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Fetch student's notifications
  const { data: notifications } = useQuery({
    queryKey: ["student-notifications", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("student_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Calculate GPA
  const gpa = grades?.reduce((acc, grade) => {
    return acc + (grade.gpa_points || 0);
  }, 0) / (grades?.length || 1) || 0;

  const totalCredits = grades?.reduce((acc, grade) => {
    return acc + (grade.courses?.credit_hours || 0);
  }, 0) || 0;

  const completedCourses = grades?.filter(g => g.status === 'completed').length || 0;
  const totalDue = payments?.filter(p => p.payment_status === 'pending')
    .reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">
          أهلاً وسهلاً، {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="text-blue-100 mt-2">
          رقم الطالب: {profile?.student_id} | {profile?.college} - {profile?.department}
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            السنة {profile?.academic_year} - الفصل {profile?.semester}
          </span>
          <Badge variant="secondary" className="text-blue-800 bg-blue-100">
            {profile?.status === 'active' ? 'طالب نشط' : profile?.status}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">المعدل التراكمي</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {gpa.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">من 4.0</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">الساعات المكتسبة</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalCredits}</div>
            <div className="text-xs text-gray-500 mt-1">ساعة معتمدة</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">المقررات المكتملة</CardTitle>
              <GraduationCap className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{completedCourses}</div>
            <div className="text-xs text-gray-500 mt-1">مقرر مكتمل</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">المستحقات المالية</CardTitle>
              <CreditCard className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {totalDue.toLocaleString()} ر.ي
            </div>
            <div className="text-xs text-gray-500 mt-1">مطلوب سداد</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grades */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              الدرجات الحديثة
            </CardTitle>
            <Button variant="outline" size="sm">عرض الكل</Button>
          </CardHeader>
          <CardContent>
            {grades && grades.length > 0 ? (
              <div className="space-y-3">
                {grades.slice(0, 5).map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{grade.courses?.course_name_ar}</div>
                      <div className="text-sm text-gray-600">{grade.courses?.course_code}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {grade.total_grade ? `${grade.total_grade}/100` : 'غير محدد'}
                      </div>
                      <div className="text-sm text-gray-600">{grade.letter_grade}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <div>لا توجد درجات متاحة حالياً</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              الإشعارات
            </CardTitle>
            <Button variant="outline" size="sm">عرض الكل</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="border-l-4 border-l-blue-500 pl-3 py-2">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString('ar')}
                  </div>
                  {!notification.is_read && (
                    <Badge variant="default" className="mt-1 text-xs">جديد</Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <div className="text-sm">لا توجد إشعارات</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">الجدول الدراسي</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">الدرجات</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">المدفوعات</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">الوثائق</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      {payments && payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              آخر المعاملات المالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{payment.payment_type}</div>
                    <div className="text-sm text-gray-600">
                      {payment.due_date && new Date(payment.due_date).toLocaleDateString('ar')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{Number(payment.amount).toLocaleString()} ر.ي</div>
                    <Badge 
                      variant={payment.payment_status === 'completed' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {payment.payment_status === 'completed' ? 'مدفوع' : 'مستحق'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;
