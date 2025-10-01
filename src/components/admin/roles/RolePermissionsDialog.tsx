import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, CheckCircle2 } from "lucide-react";

interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: any;
}

const RolePermissionsDialog = ({ open, onOpenChange, role }: RolePermissionsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("module", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const { data: rolePermissions } = useQuery({
    queryKey: ["role-permissions", role.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", role.id);
      
      if (error) throw error;
      return data.map(rp => rp.permission_id);
    },
    enabled: open && !!role,
  });

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(new Set(rolePermissions));
    }
  }, [rolePermissions]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // حذف جميع الصلاحيات الحالية
      await supabase
        .from("role_permissions")
        .delete()
        .eq("role_id", role.id);

      // إضافة الصلاحيات المحددة
      if (selectedPermissions.size > 0) {
        const newPermissions = Array.from(selectedPermissions).map(permissionId => ({
          role_id: role.id,
          permission_id: permissionId,
        }));

        const { error } = await supabase
          .from("role_permissions")
          .insert(newPermissions);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      toast({
        title: "تم الحفظ",
        description: "تم تحديث صلاحيات الدور بنجاح",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const togglePermission = (permissionId: string) => {
    const newSet = new Set(selectedPermissions);
    if (newSet.has(permissionId)) {
      newSet.delete(permissionId);
    } else {
      newSet.add(permissionId);
    }
    setSelectedPermissions(newSet);
  };

  // تجميع الصلاحيات حسب الوحدة
  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, any[]>);

  const toggleAllInModule = (module: string, enable: boolean) => {
    const newSet = new Set(selectedPermissions);
    const modulePerms = groupedPermissions?.[module] || [];
    
    modulePerms.forEach((permission) => {
      if (enable) {
        newSet.add(permission.id);
      } else {
        newSet.delete(permission.id);
      }
    });
    
    setSelectedPermissions(newSet);
  };

  const isModuleFullySelected = (module: string) => {
    const modulePerms = groupedPermissions?.[module] || [];
    return modulePerms.length > 0 && modulePerms.every(p => selectedPermissions.has(p.id));
  };

  const getModuleSelectedCount = (module: string) => {
    const modulePerms = groupedPermissions?.[module] || [];
    return modulePerms.filter(p => selectedPermissions.has(p.id)).length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh]" dir="rtl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div>صلاحيات: {role?.display_name_ar}</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                {selectedPermissions.size} من {permissions?.length || 0} صلاحية محددة
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[550px] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedPermissions || {}).map(([module, perms]) => {
              const selectedCount = getModuleSelectedCount(module);
              const isFullySelected = isModuleFullySelected(module);
              
              return (
                <div key={module} className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border-r-4 border-r-primary">
                    <div className="flex items-center gap-3">
                      <Badge variant="default" className="text-sm px-3 py-1">
                        {module}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedCount} / {perms.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAllInModule(module, !isFullySelected)}
                        className="h-8"
                      >
                        {isFullySelected ? "إلغاء الكل" : "تحديد الكل"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pr-4">
                    {perms.map((permission) => (
                      <div
                        key={permission.id}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                          selectedPermissions.has(permission.id)
                            ? 'bg-primary/5 border-primary/30 shadow-sm'
                            : 'hover:bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-semibold text-base">{permission.display_name_ar}</div>
                            {selectedPermissions.has(permission.id) && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {permission.description_ar}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-mono">
                              {permission.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {permission.action}
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={selectedPermissions.has(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                          className="ml-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RolePermissionsDialog;
