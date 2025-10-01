import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PermissionDialog from "./PermissionDialog";
import { Badge } from "@/components/ui/badge";

interface Permission {
  id: string;
  name: string;
  display_name_ar: string;
  display_name_en: string | null;
  description_ar: string | null;
  module: string;
  action: string;
  is_system: boolean;
}

const PermissionsManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("module", { ascending: true });
      
      if (error) throw error;
      return data as Permission[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const { error } = await supabase
        .from("permissions")
        .delete()
        .eq("id", permissionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الصلاحية بنجاح",
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

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setDialogOpen(true);
  };

  const handleDelete = (permission: Permission) => {
    if (permission.is_system) {
      toast({
        title: "غير مسموح",
        description: "لا يمكن حذف الصلاحيات النظامية",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`هل أنت متأكد من حذف الصلاحية "${permission.display_name_ar}"؟`)) {
      deleteMutation.mutate(permission.id);
    }
  };

  // تجميع الصلاحيات حسب الوحدة
  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <Card className="border-blue-500/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">إدارة الصلاحيات</CardTitle>
            <Button onClick={() => { setSelectedPermission(null); setDialogOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة صلاحية جديدة
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
        <div className="space-y-6">
          {Object.entries(groupedPermissions || {}).map(([module, perms]) => (
            <Card key={module}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <Badge variant="outline">{module}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {perms.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{permission.display_name_ar}</div>
                        <div className="text-sm text-muted-foreground">
                          {permission.description_ar}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {permission.name} • {permission.action}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {permission.is_system && (
                          <Badge variant="secondary">نظامي</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(permission)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!permission.is_system && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(permission)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permission={selectedPermission}
      />
    </div>
  );
};

export default PermissionsManager;
