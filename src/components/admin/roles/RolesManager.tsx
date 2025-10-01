import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RoleDialog from "./RoleDialog";
import RolePermissionsDialog from "./RolePermissionsDialog";
import { Badge } from "@/components/ui/badge";

interface Role {
  id: string;
  name: string;
  display_name_ar: string;
  display_name_en: string | null;
  description_ar: string | null;
  parent_role_id: string | null;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
}

const RolesManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Role[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("roles")
        .delete()
        .eq("id", roleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الدور بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setPermissionsDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    if (role.is_system) {
      toast({
        title: "غير مسموح",
        description: "لا يمكن حذف الأدوار النظامية",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`هل أنت متأكد من حذف الدور "${role.display_name_ar}"؟`)) {
      deleteMutation.mutate(role.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">إدارة الأدوار</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  إنشاء وتعديل وحذف الأدوار في النظام
                </p>
              </div>
            </div>
            <Button onClick={() => { setSelectedRole(null); setDialogOpen(true); }} className="gap-2 shadow-md">
              <Plus className="h-4 w-4" />
              إضافة دور جديد
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">جاري التحميل...</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles?.map((role) => (
            <Card key={role.id} className="group hover:shadow-xl transition-all duration-300 border-r-4 border-r-primary/20 hover:border-r-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg">{role.display_name_ar}</div>
                      {role.display_name_en && (
                        <div className="text-xs text-muted-foreground font-normal">{role.display_name_en}</div>
                      )}
                    </div>
                  </span>
                  <div className="flex gap-1 flex-col">
                    {role.is_system && (
                      <Badge variant="secondary" className="text-xs">نظامي</Badge>
                    )}
                    {!role.is_active && (
                      <Badge variant="outline" className="text-xs">معطل</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[60px]">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {role.description_ar || "لا يوجد وصف لهذا الدور"}
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(role)}
                    className="flex-1 gap-2 hover:bg-primary/5"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManagePermissions(role)}
                    className="flex-1 gap-2 hover:bg-primary/5"
                  >
                    <Shield className="h-4 w-4" />
                    الصلاحيات
                  </Button>
                  {!role.is_system && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(role)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
      />

      {selectedRole && (
        <RolePermissionsDialog
          open={permissionsDialogOpen}
          onOpenChange={setPermissionsDialogOpen}
          role={selectedRole}
        />
      )}
    </div>
  );
};

export default RolesManager;
