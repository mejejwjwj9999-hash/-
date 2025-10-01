import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, Settings, Plus, Edit, Trash2, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: Permission[];
  is_active: boolean;
  created_at: string;
}

export const AdminPermissions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'admin',
    permissions: [] as string[]
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // قائمة الصلاحيات المتاحة
  const availablePermissions: Permission[] = [
    { id: 'grades.view', name: 'عرض الدرجات', description: 'عرض جميع درجات الطلاب', module: 'grades', action: 'view' },
    { id: 'grades.create', name: 'إضافة الدرجات', description: 'إضافة درجات جديدة للطلاب', module: 'grades', action: 'create' },
    { id: 'grades.edit', name: 'تعديل الدرجات', description: 'تعديل الدرجات الموجودة', module: 'grades', action: 'edit' },
    { id: 'grades.delete', name: 'حذف الدرجات', description: 'حذف الدرجات', module: 'grades', action: 'delete' },
    { id: 'grades.export', name: 'تصدير الدرجات', description: 'تصدير التقارير والدرجات', module: 'grades', action: 'export' },
    { id: 'grades.import', name: 'استيراد الدرجات', description: 'استيراد الدرجات الجماعي', module: 'grades', action: 'import' },
    { id: 'students.manage', name: 'إدارة الطلاب', description: 'إدارة بيانات الطلاب', module: 'students', action: 'manage' },
    { id: 'courses.manage', name: 'إدارة المقررات', description: 'إدارة المقررات الدراسية', module: 'courses', action: 'manage' },
    { id: 'reports.view', name: 'عرض التقارير', description: 'عرض التقارير والإحصائيات', module: 'reports', action: 'view' },
    { id: 'admin.manage', name: 'إدارة المسؤولين', description: 'إدارة المسؤولين والصلاحيات', module: 'admin', action: 'manage' }
  ];

  // جلب قائمة المسؤولين (محاكاة - يجب ربطها بقاعدة البيانات الفعلية)
  const { data: adminUsers = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // محاكاة بيانات المسؤولين
      // في التطبيق الفعلي، يجب إنشاء جدول admin_users في قاعدة البيانات
      return [
        {
          id: '1',
          email: 'admin@university.edu',
          name: 'مدير النظام',
          role: 'super_admin',
          permissions: availablePermissions,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          email: 'registrar@university.edu',
          name: 'مسجل الجامعة',
          role: 'registrar',
          permissions: availablePermissions.filter(p => p.module === 'grades' || p.module === 'students'),
          is_active: true,
          created_at: new Date().toISOString()
        }
      ] as AdminUser[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // إضافة/تعديل مسؤول
  const saveAdminMutation = useMutation({
    mutationFn: async (userData: any) => {
      // في التطبيق الفعلي، يجب حفظ البيانات في قاعدة البيانات
      // const { data, error } = await supabase.from('admin_users').insert(userData);
      // if (error) throw error;
      // return data;
      
      // محاكاة العملية
      await new Promise(resolve => setTimeout(resolve, 1000));
      return userData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ بيانات المسؤول بنجاح",
      });
      setOpen(false);
      setEditingUser(null);
      setFormData({ email: '', name: '', role: 'admin', permissions: [] });
    },
    onError: (error) => {
      console.error('خطأ في حفظ المسؤول:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ بيانات المسؤول",
        variant: "destructive",
      });
    }
  });

  // تغيير حالة المسؤول (تفعيل/إلغاء تفعيل)
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      // في التطبيق الفعلي
      // const { error } = await supabase.from('admin_users').update({ is_active: isActive }).eq('id', userId);
      // if (error) throw error;
      
      // محاكاة العملية
      await new Promise(resolve => setTimeout(resolve, 500));
      return { userId, isActive };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة المسؤول بنجاح",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      ...formData,
      id: editingUser?.id || Date.now().toString(),
      permissions: availablePermissions.filter(p => formData.permissions.includes(p.id)),
      is_active: true,
      created_at: editingUser?.created_at || new Date().toISOString()
    };

    saveAdminMutation.mutate(userData);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions.map(p => p.id)
    });
    setOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getRoleDisplayName = (role: string) => {
    const roles: Record<string, string> = {
      'super_admin': 'مدير عام',
      'admin': 'مسؤول',
      'registrar': 'مسجل',
      'dean': 'عميد',
      'department_head': 'رئيس قسم'
    };
    return roles[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-university-blue flex items-center gap-2">
            <Shield className="h-6 w-6" />
            إدارة الصلاحيات
          </h2>
          <p className="text-academic-gray">إدارة المسؤولين وصلاحياتهم في النظام</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة مسؤول
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-university-blue" />
                {editingUser ? 'تعديل المسؤول' : 'إضافة مسؤول جديد'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* البيانات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="admin@university.edu"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم المسؤول"
                    required
                  />
                </div>
              </div>

              {/* الدور */}
              <div className="space-y-2">
                <Label htmlFor="role">الدور</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">مسؤول</SelectItem>
                    <SelectItem value="registrar">مسجل</SelectItem>
                    <SelectItem value="dean">عميد</SelectItem>
                    <SelectItem value="department_head">رئيس قسم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* الصلاحيات */}
              <div className="space-y-4">
                <Label>الصلاحيات</Label>
                <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-sm text-gray-600">{permission.description}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {permission.module}
                        </Badge>
                      </div>
                      <Switch
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={saveAdminMutation.isPending}
                >
                  <Key className="h-4 w-4 mr-2" />
                  {saveAdminMutation.isPending ? 'جاري الحفظ...' : (editingUser ? 'تحديث' : 'إضافة')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={saveAdminMutation.isPending}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* قائمة المسؤولين */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-university-blue mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">جاري التحميل...</p>
            </CardContent>
          </Card>
        ) : (
          adminUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-university-blue">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{getRoleDisplayName(user.role)}</Badge>
                      <Badge variant={user.is_active ? "default" : "destructive"}>
                        {user.is_active ? 'نشط' : 'معطل'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={(checked) => 
                        toggleUserStatusMutation.mutate({ userId: user.id, isActive: checked })
                      }
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">الصلاحيات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((permission) => (
                      <Badge key={permission.id} variant="outline" className="text-xs">
                        {permission.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};