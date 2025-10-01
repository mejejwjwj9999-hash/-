import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuickAddModal from "./QuickAddModal";
import AdminMobileQuickActions from "./AdminMobileQuickActions";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  FileText,
  Shield,
  BarChart3,
  UserCheck,
  Settings,
  MessageSquare,
  Database,
  Wrench,
  Plus,
  Edit,
  Trash2,
  Clock
} from "lucide-react";

interface AdminMobileDashboardProps {
  onTabChange: (tab: string) => void;
}

const AdminMobileDashboard = ({ onTabChange }: AdminMobileDashboardProps) => {
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
    queryKey: ["recent-notifications-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: teachersCount } = useQuery({
    queryKey: ["teachers-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("teacher_profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: pendingRequests } = useQuery({
    queryKey: ["pending-requests-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("service_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="space-y-6 pb-4">
      {/* Welcome Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-university-blue/10 to-university-blue/20 rounded-3xl flex items-center justify-center shadow-elegant">
          <Shield className="h-10 w-10 text-university-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-university-blue mb-1">لوحة التحكم الإدارية</h1>
          <p className="text-academic-gray font-medium">نظرة عامة شاملة على النظام</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-blue-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-university-blue via-university-blue-light to-university-blue"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-academic-gray font-semibold">إجمالي الطلاب</CardTitle>
              <div className="p-2 bg-gradient-to-br from-university-blue/10 to-university-blue/20 rounded-xl shadow-soft">
                <Users className="h-5 w-5 text-university-blue" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-university-blue mb-2">{studentsCount || 0}</div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="h-3 w-3 ml-1" />
              +12% هذا الشهر
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-academic-gray font-semibold">المعلمين النشطين</CardTitle>
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-soft">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-emerald-600 mb-2">{teachersCount || 0}</div>
            <div className="flex items-center text-xs text-emerald-600 font-medium">
              <Users className="h-3 w-3 ml-1" />
              جميعهم نشط
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-green-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-green-400 to-green-300"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-academic-gray font-semibold">المقررات المتاحة</CardTitle>
              <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-soft">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-green-600 mb-2">{coursesCount || 0}</div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <Calendar className="h-3 w-3 ml-1" />
              للفصل الحالي
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-purple-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-academic-gray font-semibold">إجمالي الإيرادات</CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-soft">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {(paymentsSum || 0).toLocaleString()} ر.ي
            </div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="h-3 w-3 ml-1" />
              +8% هذا الشهر
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-academic-gray font-semibold">طلبات معلقة</CardTitle>
              <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-soft">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-orange-600 mb-2">{pendingRequests || 0}</div>
            <div className="flex items-center text-xs text-orange-600 font-medium">
              <Clock className="h-3 w-3 ml-1" />
              تحتاج مراجعة
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-indigo-100/40 border-0 shadow-elegant hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-academic-gray font-semibold">الخريجين</CardTitle>
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl shadow-soft">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-indigo-600 mb-2">156</div>
            <div className="flex items-center text-xs text-indigo-600 font-medium">
              <Calendar className="h-3 w-3 ml-1" />
              العام الأكاديمي الحالي
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - All Admin Sections */}
      <Card className="border-0 shadow-elegant bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-university-blue/5 via-university-blue/8 to-university-blue/10 rounded-t-xl">
          <CardTitle className="flex items-center gap-3 text-university-blue">
            <div className="p-2 bg-university-blue/10 rounded-xl">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">الإجراءات السريعة</h3>
              <p className="text-xs text-academic-gray font-normal">الوصول المباشر للأقسام الرئيسية</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Core Management */}
            <button 
              onClick={() => onTabChange('students')}
              className="group p-4 rounded-2xl border-2 border-university-blue/20 hover:border-university-blue/50 hover:bg-gradient-to-br hover:from-university-blue/5 hover:to-university-blue/10 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-university-blue/10 to-university-blue/20 rounded-2xl w-fit mx-auto mb-3 group-hover:from-university-blue/20 group-hover:to-university-blue/30 transition-all duration-300 shadow-soft">
                <Users className="h-6 w-6 text-university-blue" />
              </div>
              <div className="text-sm font-bold text-university-blue">الطلاب</div>
            </button>
            
            <button 
              onClick={() => onTabChange('teachers')}
              className="group p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300 shadow-soft">
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-emerald-600">المعلمين</div>
            </button>
            
            <button 
              onClick={() => onTabChange('courses')}
              className="group p-4 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-soft">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm font-bold text-green-600">المقررات</div>
            </button>
            
            <button 
              onClick={() => onTabChange('enrollment')}
              className="group p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-soft">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm font-bold text-blue-600">التسجيل</div>
            </button>
            
            <button 
              onClick={() => onTabChange('schedules')}
              className="group p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300 shadow-soft">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-sm font-bold text-indigo-600">الجداول</div>
            </button>
            
            <button 
              onClick={() => onTabChange('grades')}
              className="group p-4 rounded-2xl border-2 border-cyan-200 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-cyan-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-cyan-200 group-hover:to-cyan-300 transition-all duration-300 shadow-soft">
                <GraduationCap className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="text-sm font-bold text-cyan-600">الدرجات</div>
            </button>
            
            <button 
              onClick={() => onTabChange('payments')}
              className="group p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 shadow-soft">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm font-bold text-purple-600">المدفوعات</div>
            </button>
            
            <button 
              onClick={() => onTabChange('notifications')}
              className="group p-4 rounded-2xl border-2 border-yellow-200 hover:border-yellow-400 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300 shadow-soft">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-sm font-bold text-yellow-600">الإشعارات</div>
            </button>
            
            <button 
              onClick={() => onTabChange('reports')}
              className="group p-4 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 transition-all duration-300 text-center hover:shadow-soft"
            >
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl w-fit mx-auto mb-3 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300 shadow-soft">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-sm font-bold text-orange-600">التقارير</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
          <CardTitle className="flex items-center gap-2 text-green-600 text-sm">
            <Plus className="h-4 w-4" />
            إضافة سريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <QuickAddModal 
              type="student"
              trigger={
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-12 border-green-200 text-green-600 hover:bg-green-50 w-full"
                >
                  <Plus className="h-4 w-4" />
                  طالب جديد
                </Button>
              }
            />
            
            <QuickAddModal 
              type="teacher"
              trigger={
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-12 border-blue-200 text-blue-600 hover:bg-blue-50 w-full"
                >
                  <Plus className="h-4 w-4" />
                  معلم جديد
                </Button>
              }
            />
            
            <QuickAddModal 
              type="course"
              trigger={
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-12 border-purple-200 text-purple-600 hover:bg-purple-50 w-full"
                >
                  <Plus className="h-4 w-4" />
                  مقرر جديد
                </Button>
              }
            />
            
            <QuickAddModal 
              type="notification"
              trigger={
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-12 border-orange-200 text-orange-600 hover:bg-orange-50 w-full"
                >
                  <Plus className="h-4 w-4" />
                  إشعار جديد
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Quick Actions */}
      <AdminMobileQuickActions onTabChange={onTabChange} />

      {/* Recent Notifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
          <CardTitle className="flex items-center gap-2 text-orange-600 text-sm">
            <Bell className="h-4 w-4" />
            الإشعارات الحديثة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {recentNotifications?.map((notification) => (
              <div key={notification.id} className="p-3 bg-university-blue/5 rounded-lg border-r-4 border-r-university-blue">
                <div className="text-sm font-medium text-university-blue mb-1">{notification.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleDateString('ar')}
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-2">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-sm text-muted-foreground">لا توجد إشعارات حديثة</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMobileDashboard;