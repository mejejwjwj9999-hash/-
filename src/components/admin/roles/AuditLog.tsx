import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { History, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
}

const AuditLog = () => {
  const [filterType, setFilterType] = useState<string>("all");

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["audit-logs", filterType],
    queryFn: async () => {
      let query = supabase
        .from("roles_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (filterType !== "all") {
        query = query.eq("entity_type", filterType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });

  const getActionBadge = (action: string) => {
    const variants: Record<string, any> = {
      INSERT: { variant: "default", label: "إضافة" },
      UPDATE: { variant: "secondary", label: "تعديل" },
      DELETE: { variant: "destructive", label: "حذف" },
    };
    const config = variants[action] || { variant: "outline", label: action };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getEntityTypeName = (type: string) => {
    const names: Record<string, string> = {
      role: "دور",
      user_role_assignment: "تعيين دور",
      permission: "صلاحية",
    };
    return names[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6" />
          سجل التدقيق
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع العمليات</SelectItem>
              <SelectItem value="role">الأدوار</SelectItem>
              <SelectItem value="user_role_assignment">تعيينات الأدوار</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">جاري التحميل...</div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>سجل العمليات ({auditLogs?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-3">
                {auditLogs?.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border rounded-lg space-y-2 hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getActionBadge(log.action)}
                        <Badge variant="outline">
                          {getEntityTypeName(log.entity_type)}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "PPp", { locale: ar })}
                      </span>
                    </div>
                    
                    {log.action === "UPDATE" && log.old_data && log.new_data && (
                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">التغييرات:</div>
                        <div className="bg-muted/30 p-2 rounded text-xs font-mono">
                          {JSON.stringify({
                            قبل: log.old_data,
                            بعد: log.new_data,
                          }, null, 2)}
                        </div>
                      </div>
                    )}

                    {log.action === "INSERT" && log.new_data && (
                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">البيانات الجديدة:</div>
                        <div className="bg-muted/30 p-2 rounded text-xs font-mono">
                          {JSON.stringify(log.new_data, null, 2)}
                        </div>
                      </div>
                    )}

                    {log.action === "DELETE" && log.old_data && (
                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">البيانات المحذوفة:</div>
                        <div className="bg-muted/30 p-2 rounded text-xs font-mono">
                          {JSON.stringify(log.old_data, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {auditLogs?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد سجلات
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditLog;
