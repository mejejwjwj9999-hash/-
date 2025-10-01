
import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type RoleRow = {
  user_id: string;
  role: "admin" | "student" | "staff";
};

type Profile = {
  user_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
};

const Roles: React.FC = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async (): Promise<RoleRow[]> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .order("role");
      if (error) throw error;
      return (data ?? []) as RoleRow[];
    },
    staleTime: 1000 * 30,
  });

  const userIds = useMemo(() => (roles ?? []).map((r) => r.user_id), [roles]);

  const { data: profiles } = useQuery({
    queryKey: ["admin-roles-profiles", userIds],
    queryFn: async (): Promise<Profile[]> => {
      if (!userIds.length) return [];
      const { data, error } = await supabase
        .from("student_profiles")
        .select("user_id, email, first_name, last_name")
        .in("user_id", userIds);
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
    enabled: userIds.length > 0,
    staleTime: 1000 * 60,
  });

  const profilesMap = useMemo(() => {
    const m = new Map<string, Profile>();
    (profiles ?? []).forEach((p) => {
      if (p.user_id) m.set(p.user_id, p);
    });
    return m;
  }, [profiles]);

  const addAdmin = useMutation({
    mutationFn: async (email: string) => {
      // ابحث عن المستخدم في student_profiles عبر البريد
      const { data: prof, error: pErr } = await supabase
        .from("student_profiles")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();
      if (pErr) throw pErr;
      if (!prof?.user_id) {
        throw new Error("لم يتم العثور على مستخدم بهذا البريد ضمن ملفات الطلاب.");
      }
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: prof.user_id, role: "admin" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-roles"] });
      toast({ title: "تمت الإضافة", description: "تم منح صلاحية الإدمن بنجاح." });
    },
    meta: {
      onError: (e: any) => {
        toast({ title: "خطأ", description: e?.message ?? "تعذر إضافة الدور.", variant: "destructive" });
      },
    },
  });

  const removeAdmin = useMutation({
    mutationFn: async (user_id: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", user_id)
        .eq("role", "admin");
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-roles"] });
      toast({ title: "تم الحذف", description: "تم إزالة صلاحية الإدمن." });
    },
    meta: {
      onError: (_: unknown) => {
        toast({ title: "خطأ", description: "تعذر إزالة الصلاحية.", variant: "destructive" });
      },
    },
  });

  const handleAddAdmin: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    if (!email) return;
    addAdmin.mutate(email);
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إضافة إدمن</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="flex gap-2 max-w-md">
            <Input type="email" name="email" placeholder="example@domain.com" required />
            <Button type="submit" disabled={addAdmin.isPending}>إضافة</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            ملاحظة: البحث يتم ضمن ملفات الطلاب student_profiles. إن لم يكن المستخدم طالبًا قد تحتاج لإضافته يدويًا بربطه بملف طالب.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>جميع الأدوار</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">جاري التحميل...</div>
          ) : (
            <div className="space-y-3">
              {(roles ?? []).map((r) => {
                const prof = r.user_id ? profilesMap.get(r.user_id) : undefined;
                return (
                  <div key={`${r.user_id}-${r.role}`} className="flex items-center justify-between border rounded p-3">
                    <div className="space-y-0.5">
                      <div className="font-medium">{r.role === "admin" ? "إدمن" : r.role === "staff" ? "موظف" : "طالب"}</div>
                      <div className="text-xs text-muted-foreground break-all">
                        {r.user_id} {prof ? `— ${prof.first_name} ${prof.last_name} (${prof.email})` : ""}
                      </div>
                    </div>
                    {r.role === "admin" && (
                      <Button variant="destructive" size="sm" onClick={() => removeAdmin.mutate(r.user_id)}>
                        إزالة إدمن
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Roles;
