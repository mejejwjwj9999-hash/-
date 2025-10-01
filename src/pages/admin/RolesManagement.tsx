import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Key, History, TrendingUp, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernAdminLayout } from "@/components/admin/ModernAdminLayout";
import RolesManager from "@/components/admin/roles/RolesManager";
import PermissionsManager from "@/components/admin/roles/PermissionsManager";
import UserRolesManager from "@/components/admin/roles/UserRolesManager";
import AuditLog from "@/components/admin/roles/AuditLog";

const RolesManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentSection] = useState("roles");

  // جلب إحصائيات النظام
  const { data: stats } = useQuery({
    queryKey: ["roles-stats"],
    queryFn: async () => {
      const [rolesRes, permsRes, usersRes, auditsRes] = await Promise.all([
        supabase.from("roles").select("id, is_active", { count: "exact" }),
        supabase.from("permissions").select("id", { count: "exact" }),
        supabase.from("user_role_assignments").select("id, is_active", { count: "exact" }),
        supabase.from("roles_audit_log").select("id", { count: "exact" }).limit(1)
      ]);

      const activeRoles = rolesRes.data?.filter(r => r.is_active).length || 0;
      const activeAssignments = usersRes.data?.filter(u => u.is_active).length || 0;

      return {
        totalRoles: rolesRes.count || 0,
        activeRoles,
        totalPermissions: permsRes.count || 0,
        totalAssignments: usersRes.count || 0,
        activeAssignments,
        totalAuditLogs: auditsRes.count || 0,
      };
    },
  });

  const handleExportData = async () => {
    try {
      const { data: roles } = await supabase.from("roles").select("*");
      const { data: permissions } = await supabase.from("permissions").select("*");
      
      const exportData = {
        roles,
        permissions,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `roles-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (error) {
      console.error("خطأ في تصدير البيانات:", error);
    }
  };

  return (
    <ModernAdminLayout currentSection={currentSection} onSectionChange={() => {}}>
      <div dir="rtl" className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3 mb-2">
                <Shield className="h-10 w-10 text-primary" />
                نظام إدارة الصلاحيات والأدوار
              </h1>
              <p className="text-muted-foreground text-lg">
                نظام متكامل لإدارة الأدوار والصلاحيات مع دعم الصلاحيات الهرمية وسجل التدقيق الشامل
              </p>
            </div>
            <Button onClick={handleExportData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              تصدير نسخة احتياطية
            </Button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card className="border-r-4 border-r-primary hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الأدوار</CardTitle>
                  <Shield className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalRoles}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <CheckCircle2 className="h-3 w-3 inline ml-1" />
                    {stats.activeRoles} نشط
                  </p>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">الصلاحيات</CardTitle>
                  <Key className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalPermissions}</div>
                  <p className="text-xs text-muted-foreground mt-1">صلاحية متاحة</p>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-green-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">تعيينات المستخدمين</CardTitle>
                  <Users className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalAssignments}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <CheckCircle2 className="h-3 w-3 inline ml-1" />
                    {stats.activeAssignments} نشط
                  </p>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-orange-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">سجلات التدقيق</CardTitle>
                  <History className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalAuditLogs}</div>
                  <p className="text-xs text-muted-foreground mt-1">إجراء مسجل</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="gap-2 py-3">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2 py-3">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">الأدوار</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2 py-3">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">الصلاحيات</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 py-3">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">المستخدمون</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 py-3">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">سجل التدقيق</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  نظرة عامة على النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      الأدوار المتاحة
                    </h3>
                    <p className="text-muted-foreground">
                      يحتوي النظام على {stats?.totalRoles} دور مختلف منها {stats?.activeRoles} دور نشط. 
                      يتيح نظام الأدوار تنظيم الصلاحيات بشكل هرمي مع إمكانية وراثة الصلاحيات من الأدوار الأب.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-500" />
                      الصلاحيات المتاحة
                    </h3>
                    <p className="text-muted-foreground">
                      يوفر النظام {stats?.totalPermissions} صلاحية مختلفة تغطي جميع وظائف النظام الأكاديمي،
                      مما يتيح تحكماً دقيقاً في الوصول إلى الموارد والعمليات.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      تعيينات المستخدمين
                    </h3>
                    <p className="text-muted-foreground">
                      تم تعيين {stats?.totalAssignments} دور للمستخدمين، منها {stats?.activeAssignments} تعيين نشط.
                      يمكن تعيين أدوار متعددة للمستخدم الواحد مع تحديد فترة صلاحية اختيارية.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <History className="h-5 w-5 text-orange-500" />
                      سجل التدقيق
                    </h3>
                    <p className="text-muted-foreground">
                      يحتفظ النظام بسجل شامل لجميع التغييرات ({stats?.totalAuditLogs} إجراء مسجل)،
                      مما يضمن الشفافية والمساءلة في إدارة الصلاحيات.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    ميزات النظام
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground mr-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>نظام صلاحيات هرمي مع وراثة الصلاحيات من الأدوار الأب</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>تعيين أدوار متعددة للمستخدم الواحد مع تحديد فترة صلاحية</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>سجل تدقيق شامل لجميع التغييرات والعمليات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>واجهة عربية احترافية سهلة الاستخدام</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>إمكانية تصدير واستيراد البيانات للنسخ الاحتياطي</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <RolesManager />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsManager />
          </TabsContent>

          <TabsContent value="users">
            <UserRolesManager />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAdminLayout>
  );
};

export default RolesManagement;
