import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  Shield, 
  HardDrive,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DatabaseManagement: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [selectedBackup, setSelectedBackup] = useState<any>(null);

  // محاكاة بيانات النسخ الاحتياطية - في التطبيق الحقيقي ستأتي من API
  const mockBackups = [
    {
      id: "1",
      name: "backup_2024_01_15_10_30",
      created_at: "2024-01-15T10:30:00Z",
      size_mb: 125.6,
      status: "completed"
    },
    {
      id: "2",
      name: "backup_2024_01_14_10_30",
      created_at: "2024-01-14T10:30:00Z",
      size_mb: 118.3,
      status: "completed"
    },
    {
      id: "3",
      name: "backup_2024_01_13_10_30",
      created_at: "2024-01-13T10:30:00Z",
      size_mb: 114.7,
      status: "completed"
    }
  ];

  // إحصائيات قاعدة البيانات
  const { data: dbStats } = useQuery({
    queryKey: ["database-stats"],
    queryFn: async () => {
      // محاكاة إحصائيات قاعدة البيانات
      return {
        connection_status: "connected",
        database_size_mb: 142.8,
        last_backup: "2024-01-15T10:30:00Z",
        total_tables: 12,
        total_records: 1248
      };
    },
    refetchInterval: 30000, // تحديث كل 30 ثانية
  });

  // إنشاء نسخة احتياطية
  const createBackup = useMutation({
    mutationFn: async () => {
      // محاكاة عملية النسخ الاحتياطي
      await new Promise(resolve => setTimeout(resolve, 3000));
      return { success: true };
    },
    onSuccess: () => {
      toast({ 
        title: "تم إنشاء النسخة الاحتياطية", 
        description: "تم إنشاء النسخة الاحتياطية بنجاح" 
      });
      qc.invalidateQueries({ queryKey: ["database-stats"] });
      setIsBackupModalOpen(false);
    },
    onError: () => {
      toast({ 
        title: "خطأ", 
        description: "فشل في إنشاء النسخة الاحتياطية", 
        variant: "destructive" 
      });
    }
  });

  // استعادة من نسخة احتياطية
  const restoreBackup = useMutation({
    mutationFn: async (backupId: string) => {
      if (confirmationText !== "أوافق على استعادة البيانات") {
        throw new Error("تأكيد غير صحيح");
      }
      // محاكاة عملية الاستعادة
      await new Promise(resolve => setTimeout(resolve, 5000));
      return { success: true };
    },
    onSuccess: () => {
      toast({ 
        title: "تم استعادة البيانات", 
        description: "تم استعادة قاعدة البيانات بنجاح" 
      });
      setIsRestoreDialogOpen(false);
      setConfirmationText("");
      setSelectedBackup(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في استعادة البيانات", 
        variant: "destructive" 
      });
    }
  });

  // مسح البيانات التجريبية
  const resetTestData = useMutation({
    mutationFn: async () => {
      if (confirmationText !== "أوافق على إعادة تعيين البيانات") {
        throw new Error("تأكيد غير صحيح");
      }
      // محاكاة عملية إعادة التعيين
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      toast({ 
        title: "تم إعادة تعيين البيانات", 
        description: "تم إعادة تعيين البيانات التجريبية بنجاح" 
      });
      setIsDangerZoneOpen(false);
      setConfirmationText("");
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في إعادة تعيين البيانات", 
        variant: "destructive" 
      });
    }
  });

  const formatFileSize = (sizeMb: number) => {
    return `${sizeMb.toFixed(1)} ميجابايت`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="text-center lg:text-right">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-destructive">
            إدارة قاعدة البيانات
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          إدارة آمنة ومتقدمة لقاعدة البيانات والنسخ الاحتياطية
        </p>
        <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              تحذير: هذا القسم مخصص لمدير النظام فقط
            </span>
          </div>
        </div>
      </div>

      {/* Database Status */}
      <Card className="border-0 shadow-university">
        <CardHeader className="bg-gradient-to-r from-university-blue/5 to-university-blue-light/5">
          <CardTitle className="flex items-center gap-2 text-university-blue">
            <Database className="h-5 w-5" />
            حالة قاعدة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm font-medium text-green-800">حالة الاتصال</div>
              <div className="text-lg font-bold text-green-600">متصل</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <HardDrive className="h-6 w-6 text-university-blue" />
              </div>
              <div className="text-sm font-medium text-university-blue">حجم قاعدة البيانات</div>
              <div className="text-lg font-bold text-university-blue">
                {formatFileSize(dbStats?.database_size_mb || 0)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-purple-800">إجمالي الجداول</div>
              <div className="text-lg font-bold text-purple-600">{dbStats?.total_tables || 0}</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-sm font-medium text-orange-800">آخر نسخة احتياطية</div>
              <div className="text-xs text-orange-600">
                {dbStats?.last_backup ? formatDate(dbStats.last_backup) : 'لا توجد'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Backup */}
        <Card className="border-0 shadow-university">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Upload className="h-5 w-5" />
              إنشاء نسخة احتياطية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-4">
              قم بإنشاء نسخة احتياطية كاملة من قاعدة البيانات الحالية
            </div>
            <Button 
              onClick={() => setIsBackupModalOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={createBackup.isPending}
            >
              {createBackup.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  جاري إنشاء النسخة...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 ml-2" />
                  إنشاء نسخة احتياطية الآن
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Available Backups */}
        <Card className="border-0 shadow-university">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
            <CardTitle className="flex items-center gap-2 text-university-blue">
              <HardDrive className="h-5 w-5" />
              النسخ الاحتياطية المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {mockBackups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-university-blue">
                      {backup.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(backup.created_at)} • {formatFileSize(backup.size_mb)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-university-blue hover:bg-university-blue hover:text-white"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedBackup(backup);
                        setIsRestoreDialogOpen(true);
                      }}
                      className="text-orange-600 hover:bg-orange-600 hover:text-white"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive/20 shadow-university">
        <CardHeader className="bg-gradient-to-r from-destructive/5 to-red-100/50">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            منطقة العمليات الخطيرة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="text-sm font-medium text-destructive mb-2">
                إعادة تعيين البيانات التجريبية
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                سيتم حذف جميع البيانات الحالية وإعادة إدخال البيانات التجريبية الأولية
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setIsDangerZoneOpen(true)}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                إعادة تعيين البيانات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Creation Modal */}
      <Dialog open={isBackupModalOpen} onOpenChange={setIsBackupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إنشاء نسخة احتياطية</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في إنشاء نسخة احتياطية جديدة من قاعدة البيانات؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackupModalOpen(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={() => createBackup.mutate()}
              disabled={createBackup.isPending}
            >
              {createBackup.isPending ? "جاري الإنشاء..." : "إنشاء النسخة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              تحذير: استعادة قاعدة البيانات
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div>
                سيتم حذف جميع البيانات الحالية واستبدالها ببيانات النسخة الاحتياطية المحددة. 
                هذا الإجراء غير قابل للتراجع.
              </div>
              <div>
                <Label htmlFor="confirm-restore">
                  يرجى كتابة العبارة التالية للتأكيد: "أوافق على استعادة البيانات"
                </Label>
                <Input
                  id="confirm-restore"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="أوافق على استعادة البيانات"
                  className="mt-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsRestoreDialogOpen(false);
              setConfirmationText("");
              setSelectedBackup(null);
            }}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedBackup && restoreBackup.mutate(selectedBackup.id)}
              disabled={confirmationText !== "أوافق على استعادة البيانات" || restoreBackup.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {restoreBackup.isPending ? "جاري الاستعادة..." : "استعادة البيانات"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Danger Zone Dialog */}
      <AlertDialog open={isDangerZoneOpen} onOpenChange={setIsDangerZoneOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              تحذير: إعادة تعيين البيانات التجريبية
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div>
                سيتم حذف جميع البيانات الحالية وإعادة إدخال البيانات التجريبية الأولية. 
                هذا الإجراء غير قابل للتراجع.
              </div>
              <div>
                <Label htmlFor="confirm-reset">
                  يرجى كتابة العبارة التالية للتأكيد: "أوافق على إعادة تعيين البيانات"
                </Label>
                <Input
                  id="confirm-reset"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="أوافق على إعادة تعيين البيانات"
                  className="mt-2"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDangerZoneOpen(false);
              setConfirmationText("");
            }}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetTestData.mutate()}
              disabled={confirmationText !== "أوافق على إعادة تعيين البيانات" || resetTestData.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {resetTestData.isPending ? "جاري إعادة التعيين..." : "إعادة تعيين البيانات"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DatabaseManagement;