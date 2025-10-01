
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, Eye, Trash2, Bell, RefreshCw, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  student_id?: string;
  action_url?: string;
  is_read: boolean;
  expires_at?: string;
  created_at: string;
};

const NotificationsManagementFixed: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 30,
  });

  const { data: students } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("id, student_id, first_name, last_name")
        .eq("status", "active")
        .order("student_id");
      if (error) throw error;
      return data || [];
    },
  });

  const createNotification = useMutation({
    mutationFn: async (notificationData: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
      const { error } = await supabase
        .from("notifications")
        .insert({
          ...notificationData,
          is_read: false
        });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast({ title: "تم الإرسال", description: "تم إرسال الإشعار بنجاح." });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ في الإرسال", 
        description: error.message || "فشل في إرسال الإشعار.", 
        variant: "destructive" 
      });
    },
  });

  const sendBroadcast = useMutation({
    mutationFn: async (notificationData: Omit<Notification, 'id' | 'created_at' | 'is_read' | 'student_id'>) => {
      if (!students || students.length === 0) {
        throw new Error("لا يوجد طلاب نشطون لإرسال الإشعار إليهم");
      }

      const notifications = students.map(student => ({
        ...notificationData,
        student_id: student.id,
        is_read: false
      }));
      
      const { error } = await supabase
        .from("notifications")
        .insert(notifications);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast({ 
        title: "تم الإرسال للجميع", 
        description: `تم إرسال الإشعار لـ ${students?.length || 0} طالب بنجاح.` 
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ في الإرسال الجماعي", 
        description: error.message || "فشل في إرسال الإشعار للجميع.", 
        variant: "destructive" 
      });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast({ title: "تم الحذف", description: "تم حذف الإشعار بنجاح." });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ في الحذف", 
        description: error.message || "فشل في حذف الإشعار.", 
        variant: "destructive" 
      });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast({ title: "تم التحديث", description: "تم تحديث حالة الإشعار." });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ في التحديث", 
        description: error.message || "فشل في تحديث الإشعار.", 
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const notificationData = {
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      type: formData.get("type") as string,
      priority: formData.get("priority") as string,
      action_url: (formData.get("action_url") as string) || undefined,
      expires_at: (formData.get("expires_at") as string) || undefined,
    };

    const recipientType = formData.get("recipient_type") as string;
    const studentId = formData.get("student_id") as string;

    if (recipientType === "all") {
      sendBroadcast.mutate(notificationData);
    } else if (recipientType === "specific" && studentId) {
      createNotification.mutate({
        ...notificationData,
        student_id: studentId
      });
    } else {
      toast({ 
        title: "خطأ في البيانات", 
        description: "يرجى تحديد المستلمين بشكل صحيح.", 
        variant: "destructive" 
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      low: { label: "منخفضة", variant: "secondary" as const },
      normal: { label: "عادية", variant: "default" as const },
      high: { label: "عالية", variant: "destructive" as const },
      urgent: { label: "عاجلة", variant: "destructive" as const }
    };
    const priorityConfig = config[priority as keyof typeof config] || config.normal;
    return <Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const config = {
      general: { label: "عام", variant: "default" as const },
      academic: { label: "أكاديمي", variant: "secondary" as const },
      financial: { label: "مالي", variant: "outline" as const },
      urgent: { label: "عاجل", variant: "destructive" as const }
    };
    const typeConfig = config[type as keyof typeof config] || config.general;
    return <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>;
  };

  const filteredNotifications = notifications?.filter(notification => {
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    return matchesType && matchesPriority;
  }) || [];

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإشعار؟")) {
      deleteNotification.mutate(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">إدارة الإشعارات</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إنشاء إشعار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إنشاء إشعار جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان الإشعار</Label>
                  <Input id="title" name="title" required maxLength={100} />
                </div>
                
                <div>
                  <Label htmlFor="message">محتوى الإشعار</Label>
                  <Textarea id="message" name="message" rows={4} required maxLength={500} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">نوع الإشعار</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الإشعار" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">عام</SelectItem>
                        <SelectItem value="academic">أكاديمي</SelectItem>
                        <SelectItem value="financial">مالي</SelectItem>
                        <SelectItem value="urgent">عاجل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">الأولوية</Label>
                    <Select name="priority" defaultValue="normal" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">منخفضة</SelectItem>
                        <SelectItem value="normal">عادية</SelectItem>
                        <SelectItem value="high">عالية</SelectItem>
                        <SelectItem value="urgent">عاجلة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="recipient_type">المستلمون</Label>
                  <Select name="recipient_type" defaultValue="all" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الطلاب النشطين ({students?.length || 0})</SelectItem>
                      <SelectItem value="specific">طالب محدد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="student_id">الطالب (للإرسال المحدد)</Label>
                  <Select name="student_id">
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طالب محدد (اختياري)" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.student_id} - {student.first_name} {student.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="action_url">رابط الإجراء (اختياري)</Label>
                    <Input id="action_url" name="action_url" type="url" placeholder="https://..." />
                  </div>
                  <div>
                    <Label htmlFor="expires_at">تاريخ انتهاء الصلاحية (اختياري)</Label>
                    <Input id="expires_at" name="expires_at" type="datetime-local" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button 
                    type="submit" 
                    className="gap-2"
                    disabled={createNotification.isPending || sendBroadcast.isPending}
                  >
                    <Send className="h-4 w-4" />
                    {createNotification.isPending || sendBroadcast.isPending ? "جاري الإرسال..." : "إرسال الإشعار"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* إحصائيات الإشعارات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              إجمالي الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">الإشعارات المقروءة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {notifications?.filter(n => n.is_read).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">غير المقروءة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {notifications?.filter(n => !n.is_read).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">العاجلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {notifications?.filter(n => n.priority === 'urgent' || n.priority === 'high').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر الإشعارات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلترة الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="general">عام</SelectItem>
                <SelectItem value="academic">أكاديمي</SelectItem>
                <SelectItem value="financial">مالي</SelectItem>
                <SelectItem value="urgent">عاجل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة بالأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="low">منخفضة</SelectItem>
                <SelectItem value="normal">عادية</SelectItem>
                <SelectItem value="high">عالية</SelectItem>
                <SelectItem value="urgent">عاجلة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الإشعارات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الإشعارات ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد إشعارات بعد.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.is_read && (
                          <Badge variant="secondary" className="text-xs">جديد</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getTypeBadge(notification.type)}
                        {getPriorityBadge(notification.priority)}
                        {notification.expires_at && (
                          <Badge variant="outline" className="text-xs">
                            ينتهي: {new Date(notification.expires_at).toLocaleDateString('ar-EG')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        تاريخ الإنشاء: {new Date(notification.created_at).toLocaleString('ar-EG')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.is_read && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsRead.mutate(notification.id)}
                          disabled={markAsRead.isPending}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={deleteNotification.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsManagementFixed;
