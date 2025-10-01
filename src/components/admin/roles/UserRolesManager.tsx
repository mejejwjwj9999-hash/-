import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserRoleAssignDialog from "./UserRoleAssignDialog";

interface UserWithRoles {
  user_id: string;
  email: string;
  roles: Array<{
    id: string;
    role_id: string;
    role_name: string;
    role_display_name: string;
    assigned_at: string;
    expires_at: string | null;
    is_active: boolean;
  }>;
}

const UserRolesManager = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ["users-with-roles", searchEmail],
    queryFn: async () => {
      // جلب المستخدمين من student_profiles
      let query = supabase
        .from("student_profiles")
        .select("user_id, email");

      if (searchEmail) {
        query = query.ilike("email", `%${searchEmail}%`);
      }

      const { data: users, error: usersError } = await query.limit(50);
      
      if (usersError) throw usersError;

      // جلب الأدوار لكل مستخدم
      const usersWithRolesData = await Promise.all(
        users.map(async (user) => {
          const { data: assignments } = await supabase
            .from("user_role_assignments")
            .select(`
              id,
              role_id,
              assigned_at,
              expires_at,
              is_active,
              roles (
                name,
                display_name_ar
              )
            `)
            .eq("user_id", user.user_id);

          return {
            user_id: user.user_id,
            email: user.email,
            roles: (assignments || []).map((a: any) => ({
              id: a.id,
              role_id: a.role_id,
              role_name: a.roles?.name,
              role_display_name: a.roles?.display_name_ar,
              assigned_at: a.assigned_at,
              expires_at: a.expires_at,
              is_active: a.is_active,
            })),
          };
        })
      );

      return usersWithRolesData as UserWithRoles[];
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from("user_role_assignments")
        .delete()
        .eq("id", assignmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "تم الإزالة",
        description: "تم إزالة الدور من المستخدم بنجاح",
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

  const handleAssignRole = (userId: string) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-500/20">
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <CardTitle className="text-2xl">إدارة أدوار المستخدمين</CardTitle>
            <div className="flex gap-2 flex-1 max-w-md">
              <Input
                placeholder="البحث بالبريد الإلكتروني..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
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
        <div className="space-y-4">
          {usersWithRoles?.map((user) => (
            <Card key={user.user_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-base">{user.email}</div>
                    <div className="text-xs text-muted-foreground font-normal mt-1">
                      {user.user_id}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAssignRole(user.user_id)}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    تعيين دور
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    لا توجد أدوار معينة لهذا المستخدم
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <Badge
                        key={role.id}
                        variant={role.is_active ? "default" : "outline"}
                        className="gap-2"
                      >
                        {role.role_display_name}
                        <button
                          onClick={() => removeRoleMutation.mutate(role.id)}
                          className="hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {usersWithRoles?.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">لا توجد نتائج</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {selectedUserId && (
        <UserRoleAssignDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userId={selectedUserId}
        />
      )}
    </div>
  );
};

export default UserRolesManager;
