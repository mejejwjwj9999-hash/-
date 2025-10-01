
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  FileText
} from "lucide-react";

const Overview = () => {
  const { data: studentsCount } = useQuery({
    queryKey: ["students-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("student_profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: coursesCount } = useQuery({
    queryKey: ["courses-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: paymentsSum } = useQuery({
    queryKey: ["payments-sum"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount")
        .eq("payment_status", "completed");
      if (error) throw error;
      return data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    },
  });

  const { data: recentNotifications } = useQuery({
    queryKey: ["recent-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="text-center lg:text-right">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-university-blue to-university-blue-light bg-clip-text text-transparent mb-2">
          لوحة التحكم الرئيسية
        </h1>
        <p className="text-muted-foreground text-lg">نظرة عامة شاملة على النظام الأكاديمي</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 border-0 shadow-university hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-university-blue to-university-blue-light"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium">إجمالي الطلاب</CardTitle>
              <div className="p-2 bg-university-blue/10 rounded-lg">
                <Users className="h-6 w-6 text-university-blue" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-university-blue mb-1">{studentsCount || 0}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 ml-1" />
              زيادة 12% عن الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 border-0 shadow-university hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-400"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium">المقررات الدراسية</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">{coursesCount || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 ml-1" />
              للعام الدراسي الحالي
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 border-0 shadow-university hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-400"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium">إجمالي الإيرادات</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">
              {(paymentsSum || 0).toLocaleString()} ر.ي
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 ml-1" />
              الرسوم المحصلة
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50 border-0 shadow-university hover:shadow-lg transition-all hover:scale-105">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-400"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground font-medium">التخرج المتوقع</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">45</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 ml-1" />
              هذا العام
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="xl:col-span-2 border-0 shadow-university">
          <CardHeader className="bg-gradient-to-r from-university-blue/5 to-university-blue-light/5">
            <CardTitle className="flex items-center gap-2 text-university-blue">
              <FileText className="h-5 w-5" />
              الإجراءات السريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="group p-4 rounded-xl border border-university-blue/20 hover:border-university-blue/40 hover:bg-university-blue/5 transition-all text-center">
                <div className="p-3 bg-university-blue/10 rounded-lg w-fit mx-auto mb-3 group-hover:bg-university-blue/20 transition-colors">
                  <Users className="h-6 w-6 text-university-blue" />
                </div>
                <div className="text-sm font-medium text-university-blue">إدارة الطلاب</div>
              </button>
              <button className="group p-4 rounded-xl border border-green-200 hover:border-green-400 hover:bg-green-50 transition-all text-center">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-sm font-medium text-green-600">إدارة المقررات</div>
              </button>
              <button className="group p-4 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-center">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-purple-600">إدارة المدفوعات</div>
              </button>
              <button className="group p-4 rounded-xl border border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-center">
                <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-sm font-medium text-orange-600">الإشعارات</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border-0 shadow-university">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Bell className="h-5 w-5" />
              الإشعارات الحديثة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentNotifications?.map((notification) => (
                <div key={notification.id} className="relative p-3 bg-university-blue/5 rounded-lg border-r-4 border-r-university-blue">
                  <div className="text-sm font-medium text-university-blue mb-1">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString('ar')}
                  </div>
                </div>
              )) || (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-sm text-muted-foreground">لا توجد إشعارات حديثة</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-0 shadow-university">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <div className="p-2 bg-green-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-green-800 mb-1">خادم قاعدة البيانات</div>
                  <div className="text-sm text-green-600">يعمل بشكل طبيعي</div>
                </div>
                <div className="relative">
                  <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 h-4 w-4 bg-green-300 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            
            <div className="relative p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-green-800 mb-1">نظام المصادقة</div>
                  <div className="text-sm text-green-600">يعمل بشكل طبيعي</div>
                </div>
                <div className="relative">
                  <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 h-4 w-4 bg-green-300 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            
            <div className="relative p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-green-800 mb-1">النسخ الاحتياطي</div>
                  <div className="text-sm text-green-600">آخر نسخة: اليوم</div>
                </div>
                <div className="relative">
                  <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 h-4 w-4 bg-green-300 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
