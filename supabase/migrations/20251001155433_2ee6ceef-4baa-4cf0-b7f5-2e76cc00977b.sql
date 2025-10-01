-- إنشاء جدول الأدوار (Roles)
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name_ar TEXT NOT NULL,
  display_name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  parent_role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  is_system BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- إنشاء جدول الصلاحيات (Permissions)
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name_ar TEXT NOT NULL,
  display_name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT,
  is_system BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء جدول ربط الأدوار بالصلاحيات
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT now(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(role_id, permission_id)
);

-- إنشاء جدول ربط المستخدمين بالأدوار المحسّن
CREATE TABLE IF NOT EXISTS public.user_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- إنشاء جدول سجل التدقيق للصلاحيات
CREATE TABLE IF NOT EXISTS public.roles_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء indexes للأداء
CREATE INDEX IF NOT EXISTS idx_roles_parent ON public.roles(parent_role_id);
CREATE INDEX IF NOT EXISTS idx_roles_active ON public.roles(is_active);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user ON public.user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role ON public.user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.roles_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.roles_audit_log(user_id);

-- تفعيل RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles_audit_log ENABLE ROW LEVEL SECURITY;

-- إنشاء دالة للتحقق من صلاحيات الإدارة
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_role_assignments ura
    JOIN role_permissions rp ON ura.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ura.user_id = _user_id
      AND p.name = _permission_name
      AND ura.is_active = true
      AND (ura.expires_at IS NULL OR ura.expires_at > now())
  )
$$;

-- إنشاء دالة لجلب جميع صلاحيات المستخدم (مع الوراثة)
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS TABLE(permission_name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE role_hierarchy AS (
    -- الأدوار المباشرة للمستخدم
    SELECT r.id, r.parent_role_id
    FROM roles r
    JOIN user_role_assignments ura ON r.id = ura.role_id
    WHERE ura.user_id = _user_id
      AND ura.is_active = true
      AND (ura.expires_at IS NULL OR ura.expires_at > now())
    
    UNION
    
    -- الأدوار الموروثة
    SELECT r.id, r.parent_role_id
    FROM roles r
    JOIN role_hierarchy rh ON r.id = rh.parent_role_id
  )
  SELECT DISTINCT p.name
  FROM role_hierarchy rh
  JOIN role_permissions rp ON rh.id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
$$;

-- سياسات RLS للأدوار
CREATE POLICY "Admins can manage roles"
ON public.roles
FOR ALL
TO authenticated
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

CREATE POLICY "All users can view active roles"
ON public.roles
FOR SELECT
TO authenticated
USING (is_active = true);

-- سياسات RLS للصلاحيات
CREATE POLICY "Admins can manage permissions"
ON public.permissions
FOR ALL
TO authenticated
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

CREATE POLICY "All users can view permissions"
ON public.permissions
FOR SELECT
TO authenticated
USING (true);

-- سياسات RLS لربط الأدوار بالصلاحيات
CREATE POLICY "Admins can manage role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

CREATE POLICY "All users can view role permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

-- سياسات RLS لتعيين الأدوار للمستخدمين
CREATE POLICY "Admins can manage user role assignments"
ON public.user_role_assignments
FOR ALL
TO authenticated
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

CREATE POLICY "Users can view their own role assignments"
ON public.user_role_assignments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- سياسات RLS لسجل التدقيق
CREATE POLICY "Admins can view audit log"
ON public.roles_audit_log
FOR SELECT
TO authenticated
USING (has_admin_access(auth.uid()));

CREATE POLICY "System can insert audit log"
ON public.roles_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Trigger لسجل التدقيق على الأدوار
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.roles_audit_log (
    action,
    entity_type,
    entity_id,
    user_id,
    old_data,
    new_data
  ) VALUES (
    TG_OP,
    'role',
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER roles_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.roles
FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

-- Trigger لسجل التدقيق على تعيين الأدوار
CREATE OR REPLACE FUNCTION public.log_user_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.roles_audit_log (
    action,
    entity_type,
    entity_id,
    user_id,
    old_data,
    new_data
  ) VALUES (
    TG_OP,
    'user_role_assignment',
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER user_role_assignments_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.user_role_assignments
FOR EACH ROW EXECUTE FUNCTION public.log_user_role_changes();

-- Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION public.update_roles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER roles_updated_at_trigger
BEFORE UPDATE ON public.roles
FOR EACH ROW EXECUTE FUNCTION public.update_roles_updated_at();

-- إدراج بيانات أولية - الصلاحيات الأساسية
INSERT INTO public.permissions (name, display_name_ar, display_name_en, description_ar, module, action) VALUES
  ('roles.view', 'عرض الأدوار', 'View Roles', 'عرض جميع الأدوار في النظام', 'roles', 'view'),
  ('roles.create', 'إنشاء دور', 'Create Role', 'إنشاء أدوار جديدة', 'roles', 'create'),
  ('roles.update', 'تعديل دور', 'Update Role', 'تعديل الأدوار الموجودة', 'roles', 'update'),
  ('roles.delete', 'حذف دور', 'Delete Role', 'حذف الأدوار', 'roles', 'delete'),
  ('permissions.view', 'عرض الصلاحيات', 'View Permissions', 'عرض جميع الصلاحيات', 'permissions', 'view'),
  ('permissions.manage', 'إدارة الصلاحيات', 'Manage Permissions', 'إدارة وتعديل الصلاحيات', 'permissions', 'manage'),
  ('users.view', 'عرض المستخدمين', 'View Users', 'عرض قائمة المستخدمين', 'users', 'view'),
  ('users.assign_roles', 'تعيين الأدوار', 'Assign Roles', 'تعيين الأدوار للمستخدمين', 'users', 'assign_roles'),
  ('audit.view', 'عرض سجل التدقيق', 'View Audit Log', 'عرض سجل التدقيق والتغييرات', 'audit', 'view')
ON CONFLICT (name) DO NOTHING;

-- إدراج دور المدير الرئيسي
INSERT INTO public.roles (name, display_name_ar, display_name_en, description_ar, is_system) VALUES
  ('super_admin', 'المدير الرئيسي', 'Super Admin', 'صلاحيات كاملة على النظام', true),
  ('admin', 'مدير', 'Admin', 'صلاحيات إدارية متقدمة', true),
  ('manager', 'مشرف', 'Manager', 'صلاحيات إشرافية محدودة', false)
ON CONFLICT (name) DO NOTHING;

-- ربط جميع الصلاحيات بدور المدير الرئيسي
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;