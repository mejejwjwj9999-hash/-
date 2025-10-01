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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface UserRoleAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

interface AssignFormData {
  role_id: string;
  expires_at: string;
  is_active: boolean;
}

const UserRoleAssignDialog = ({ open, onOpenChange, userId }: UserRoleAssignDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch } = useForm<AssignFormData>({
    defaultValues: {
      is_active: true,
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["active-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("id, display_name_ar, name")
        .eq("is_active", true)
        .order("display_name_ar");
      
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const assignMutation = useMutation({
    mutationFn: async (data: AssignFormData) => {
      const assignmentData = {
        user_id: userId,
        role_id: data.role_id,
        expires_at: data.expires_at || null,
        is_active: data.is_active,
      };

      const { error } = await supabase
        .from("user_role_assignments")
        .insert(assignmentData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "تم التعيين",
        description: "تم تعيين الدور للمستخدم بنجاح",
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

  const onSubmit = (data: AssignFormData) => {
    if (!data.role_id) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار دور",
        variant: "destructive",
      });
      return;
    }
    assignMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعيين دور للمستخدم</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role_id">الدور *</Label>
            <Select
              value={watch("role_id")}
              onValueChange={(value) => setValue("role_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                {roles?.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.display_name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">تاريخ انتهاء الصلاحية (اختياري)</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              {...register("expires_at")}
            />
            <p className="text-xs text-muted-foreground">
              اترك فارغاً للدور الدائم
            </p>
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
            <Button type="submit" disabled={assignMutation.isPending}>
              {assignMutation.isPending ? "جاري التعيين..." : "تعيين الدور"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleAssignDialog;
