
import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Setting = {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string | null;
  category: string;
};

const Settings: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async (): Promise<Setting[]> => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .order("setting_key");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 30,
  });

  const map = useMemo(() => {
    const m = new Map<string, Setting>();
    (settings ?? []).forEach((s) => m.set(s.setting_key, s));
    return m;
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (payload: Array<{ setting_key: string; setting_value: any }>) => {
      const rows = payload.map((p) => ({
        setting_key: p.setting_key,
        setting_value: p.setting_value,
      }));
      const { error } = await supabase
        .from("system_settings")
        .upsert(rows, { onConflict: "setting_key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["system-settings"] });
      toast({ title: "تم الحفظ", description: "تم تحديث إعدادات النظام بنجاح." });
    },
    meta: {
      onError: (_: unknown) => {
        toast({ title: "خطأ", description: "تعذر حفظ الإعدادات.", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = [
      { setting_key: "site_name", setting_value: String(form.get("site_name") || "") },
      { setting_key: "site_description", setting_value: String(form.get("site_description") || "") },
      { setting_key: "contact_email", setting_value: String(form.get("contact_email") || "") },
      { setting_key: "contact_phone", setting_value: String(form.get("contact_phone") || "") },
      { setting_key: "current_academic_year", setting_value: String(form.get("current_academic_year") || "") },
      { setting_key: "current_semester", setting_value: String(form.get("current_semester") || "") },
      { setting_key: "registration_open", setting_value: form.get("registration_open") ? true : false },
    ];
    mutation.mutate(payload);
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">جاري التحميل...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>معلومات الموقع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="site_name">اسم الموقع</Label>
            <Input id="site_name" name="site_name" defaultValue={map.get("site_name")?.setting_value ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="site_description">وصف الموقع</Label>
            <Input id="site_description" name="site_description" defaultValue={map.get("site_description")?.setting_value ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_email">البريد الإلكتروني</Label>
            <Input id="contact_email" name="contact_email" type="email" defaultValue={map.get("contact_email")?.setting_value ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_phone">رقم الهاتف</Label>
            <Input id="contact_phone" name="contact_phone" defaultValue={map.get("contact_phone")?.setting_value ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الإعدادات الأكاديمية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current_academic_year">العام الدراسي الحالي</Label>
            <Input id="current_academic_year" name="current_academic_year" defaultValue={map.get("current_academic_year")?.setting_value ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="current_semester">الفصل الدراسي الحالي</Label>
            <Input id="current_semester" name="current_semester" defaultValue={map.get("current_semester")?.setting_value ?? ""} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="registration_open">فتح التسجيل</Label>
              <p className="text-sm text-muted-foreground">تفعيل أو تعطيل التسجيل للطلاب</p>
            </div>
            <Switch id="registration_open" name="registration_open" defaultChecked={Boolean(map.get("registration_open")?.setting_value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>حفظ</Button>
      </div>
    </form>
  );
};

export default Settings;
