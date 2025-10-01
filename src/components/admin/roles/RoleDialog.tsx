import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: any | null;
}

interface RoleFormData {
  name: string;
  display_name_ar: string;
  display_name_en: string;
  description_ar: string;
  description_en: string;
  parent_role_id: string;
  is_active: boolean;
}

const RoleDialog = ({ open, onOpenChange, role }: RoleDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, watch } = useForm<RoleFormData>();

  const { data: parentRoles } = useQuery({
    queryKey: ["parent-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("id, display_name_ar")
        .neq("id", role?.id || "");
      
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        display_name_ar: role.display_name_ar,
        display_name_en: role.display_name_en || "",
        description_ar: role.description_ar || "",
        description_en: role.description_en || "",
        parent_role_id: role.parent_role_id || "",
        is_active: role.is_active,
      });
    } else {
      reset({
        name: "",
        display_name_ar: "",
        display_name_en: "",
        description_ar: "",
        description_en: "",
        parent_role_id: "",
        is_active: true,
      });
    }
  }, [role, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: RoleFormData) => {
      const roleData = {
        ...data,
        parent_role_id: data.parent_role_id || null,
      };

      if (role) {
        const { error } = await supabase
          .from("roles")
          .update(roleData)
          .eq("id", role.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("roles")
          .insert(roleData);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "تم الحفظ",
        description: role ? "تم تحديث الدور بنجاح" : "تم إنشاء الدور بنجاح",
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

  const onSubmit = (data: RoleFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {role ? "تعديل الدور" : "إضافة دور جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">المعرّف (بالإنجليزية) *</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="admin"
                disabled={role?.is_system}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name_ar">الاسم بالعربية *</Label>
              <Input
                id="display_name_ar"
                {...register("display_name_ar", { required: true })}
                placeholder="مدير النظام"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name_en">الاسم بالإنجليزية</Label>
              <Input
                id="display_name_en"
                {...register("display_name_en")}
                placeholder="System Admin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_role_id">الدور الأب (للوراثة)</Label>
              <Select
                value={watch("parent_role_id")}
                onValueChange={(value) => setValue("parent_role_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="بدون دور أب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون دور أب</SelectItem>
                  {parentRoles?.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.display_name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_ar">الوصف بالعربية</Label>
            <Textarea
              id="description_ar"
              {...register("description_ar")}
              placeholder="وصف مختصر للدور..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
            <Textarea
              id="description_en"
              {...register("description_en")}
              placeholder="Brief role description..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">تفعيل الدور</Label>
            <Switch
              id="is_active"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", checked)}
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

export default RoleDialog;
