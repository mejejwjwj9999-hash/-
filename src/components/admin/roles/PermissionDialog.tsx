import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: any | null;
}

interface PermissionFormData {
  name: string;
  display_name_ar: string;
  display_name_en: string;
  description_ar: string;
  description_en: string;
  module: string;
  action: string;
  resource: string;
}

const PermissionDialog = ({ open, onOpenChange, permission }: PermissionDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<PermissionFormData>();

  useEffect(() => {
    if (permission) {
      reset({
        name: permission.name,
        display_name_ar: permission.display_name_ar,
        display_name_en: permission.display_name_en || "",
        description_ar: permission.description_ar || "",
        description_en: permission.description_en || "",
        module: permission.module,
        action: permission.action,
        resource: permission.resource || "",
      });
    } else {
      reset({
        name: "",
        display_name_ar: "",
        display_name_en: "",
        description_ar: "",
        description_en: "",
        module: "",
        action: "",
        resource: "",
      });
    }
  }, [permission, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: PermissionFormData) => {
      const permissionData = {
        ...data,
        resource: data.resource || null,
      };

      if (permission) {
        const { error } = await supabase
          .from("permissions")
          .update(permissionData)
          .eq("id", permission.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("permissions")
          .insert(permissionData);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast({
        title: "تم الحفظ",
        description: permission ? "تم تحديث الصلاحية بنجاح" : "تم إنشاء الصلاحية بنجاح",
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

  const onSubmit = (data: PermissionFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {permission ? "تعديل الصلاحية" : "إضافة صلاحية جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">المعرّف (بالإنجليزية) *</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="users.create"
                disabled={permission?.is_system}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name_ar">الاسم بالعربية *</Label>
              <Input
                id="display_name_ar"
                {...register("display_name_ar", { required: true })}
                placeholder="إنشاء مستخدم"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name_en">الاسم بالإنجليزية</Label>
              <Input
                id="display_name_en"
                {...register("display_name_en")}
                placeholder="Create User"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">الوحدة *</Label>
              <Input
                id="module"
                {...register("module", { required: true })}
                placeholder="users"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">الإجراء *</Label>
              <Input
                id="action"
                {...register("action", { required: true })}
                placeholder="create"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource">المورد (اختياري)</Label>
              <Input
                id="resource"
                {...register("resource")}
                placeholder="user"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_ar">الوصف بالعربية</Label>
            <Textarea
              id="description_ar"
              {...register("description_ar")}
              placeholder="وصف مختصر للصلاحية..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
            <Textarea
              id="description_en"
              {...register("description_en")}
              placeholder="Brief permission description..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionDialog;
