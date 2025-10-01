# إعداد قاعدة بيانات الأقسام الأكاديمية

## الخطوة 1: تنفيذ SQL Script في Supabase

قم بفتح لوحة تحكم Lovable Cloud ← SQL Editor ثم نفذ الكود التالي:

```sql
-- =====================================================
-- إنشاء جدول الأقسام الأكاديمية
-- =====================================================

CREATE TABLE IF NOT EXISTS public.academic_departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    department_key TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    icon_name TEXT NOT NULL DEFAULT 'GraduationCap',
    icon_color TEXT NOT NULL DEFAULT '#3B82F6',
    background_color TEXT NOT NULL DEFAULT '#EFF6FF',
    featured_image TEXT,
    head_of_department_ar TEXT,
    head_of_department_en TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- تفعيل Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.academic_departments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- سياسات الأمان (RLS Policies)
-- =====================================================

-- السماح بالقراءة العامة للأقسام النشطة فقط
CREATE POLICY "Allow public read access for active departments"
ON public.academic_departments
FOR SELECT
TO public
USING (is_active = true);

-- السماح للمستخدمين المسجلين بقراءة جميع الأقسام
CREATE POLICY "Allow authenticated read access"
ON public.academic_departments
FOR SELECT
TO authenticated
USING (true);

-- السماح للمشرفين (admins) بجميع العمليات
CREATE POLICY "Allow admin full access"
ON public.academic_departments
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

-- =====================================================
-- الفهارس لتحسين الأداء
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_academic_departments_display_order 
ON public.academic_departments(display_order);

CREATE INDEX IF NOT EXISTS idx_academic_departments_is_active 
ON public.academic_departments(is_active);

CREATE INDEX IF NOT EXISTS idx_academic_departments_department_key 
ON public.academic_departments(department_key);

-- =====================================================
-- دالة لتحديث updated_at تلقائياً
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Trigger لتحديث التاريخ تلقائياً
-- =====================================================

DROP TRIGGER IF EXISTS set_updated_at ON public.academic_departments;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.academic_departments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- إدراج بيانات تجريبية (اختياري)
-- =====================================================

INSERT INTO public.academic_departments (
    department_key,
    name_ar,
    name_en,
    description_ar,
    description_en,
    icon_name,
    icon_color,
    background_color,
    head_of_department_ar,
    head_of_department_en,
    contact_email,
    contact_phone,
    display_order,
    is_active
) VALUES 
(
    'pharmacy',
    'كلية الصيدلة',
    'College of Pharmacy',
    'كلية الصيدلة تقدم برامج متميزة في العلوم الصيدلانية والرعاية الصحية',
    'College of Pharmacy offers distinguished programs in pharmaceutical sciences and healthcare',
    'GraduationCap',
    '#3B82F6',
    '#EFF6FF',
    'د. محمد أحمد السعيد',
    'Dr. Mohammed Ahmed Al-Saeed',
    'pharmacy@university.edu.sa',
    '+966 11 123 4567',
    1,
    true
),
(
    'medicine',
    'كلية الطب',
    'College of Medicine',
    'كلية الطب تقدم تعليماً طبياً متقدماً وتدريباً عملياً متميزاً',
    'College of Medicine provides advanced medical education and distinguished practical training',
    'GraduationCap',
    '#EF4444',
    '#FEE2E2',
    'د. سارة علي محمود',
    'Dr. Sarah Ali Mahmoud',
    'medicine@university.edu.sa',
    '+966 11 123 4568',
    2,
    true
),
(
    'engineering',
    'كلية الهندسة',
    'College of Engineering',
    'كلية الهندسة تقدم برامج هندسية متنوعة في مختلف التخصصات',
    'College of Engineering offers diverse engineering programs in various specializations',
    'GraduationCap',
    '#10B981',
    '#D1FAE5',
    'د. أحمد خالد',
    'Dr. Ahmed Khaled',
    'engineering@university.edu.sa',
    '+966 11 123 4569',
    3,
    true
),
(
    'business',
    'كلية إدارة الأعمال',
    'College of Business Administration',
    'كلية إدارة الأعمال تقدم برامج في الإدارة والمحاسبة والتسويق',
    'College of Business Administration offers programs in management, accounting, and marketing',
    'GraduationCap',
    '#F59E0B',
    '#FEF3C7',
    'د. فاطمة حسن',
    'Dr. Fatima Hassan',
    'business@university.edu.sa',
    '+966 11 123 4570',
    4,
    true
)
ON CONFLICT (department_key) DO NOTHING;

-- =====================================================
-- ربط البرامج الأكاديمية الموجودة بالأقسام
-- =====================================================

-- إضافة عمود department_id إلى جدول البرامج الأكاديمية (إذا لم يكن موجوداً)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'dynamic_academic_programs' 
        AND column_name = 'department_id'
    ) THEN
        ALTER TABLE public.dynamic_academic_programs
        ADD COLUMN department_id UUID REFERENCES public.academic_departments(id) ON DELETE SET NULL;
        
        CREATE INDEX IF NOT EXISTS idx_programs_department_id 
        ON public.dynamic_academic_programs(department_id);
    END IF;
END $$;

-- تحديث البرامج الموجودة وربطها بالأقسام بناءً على department_ar
UPDATE public.dynamic_academic_programs AS p
SET department_id = d.id
FROM public.academic_departments AS d
WHERE p.department_ar = d.name_ar
AND p.department_id IS NULL;
```

## الخطوة 2: التحقق من تطبيق التغييرات

بعد تنفيذ الـ SQL، تحقق من:

1. ✅ تم إنشاء جدول `academic_departments`
2. ✅ تم تفعيل RLS
3. ✅ تم إضافة البيانات التجريبية
4. ✅ تم ربط البرامج بالأقسام

## الخطوة 3: تحديث Types

بعد تنفيذ SQL، سيتم تحديث ملف `src/integrations/supabase/types.ts` تلقائياً.

## الخطوة 4: تفعيل الـ Hooks

بعد تحديث Types، قم بإعادة إنشاء ملف `src/hooks/useAcademicDepartments.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AcademicDepartment {
  id: string;
  department_key: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  icon_name: string;
  icon_color: string;
  background_color: string;
  featured_image?: string;
  head_of_department_ar?: string;
  head_of_department_en?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

// Hook لجلب جميع الأقسام
export const useAcademicDepartments = () => {
  return useQuery({
    queryKey: ['academic-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_departments')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AcademicDepartment[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لجلب الأقسام النشطة فقط
export const useActiveAcademicDepartments = () => {
  return useQuery({
    queryKey: ['active-academic-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_departments')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AcademicDepartment[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لجلب قسم واحد
export const useAcademicDepartment = (departmentKey: string) => {
  return useQuery({
    queryKey: ['academic-department', departmentKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_departments')
        .select('*')
        .eq('department_key', departmentKey)
        .maybeSingle();
      
      if (error) throw error;
      return data as AcademicDepartment | null;
    },
    enabled: !!departmentKey,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook لإنشاء قسم جديد
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (department: Omit<AcademicDepartment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('academic_departments')
        .insert(department as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-departments'] });
      queryClient.invalidateQueries({ queryKey: ['active-academic-departments'] });
      toast({
        title: "تم إنشاء القسم بنجاح",
        description: "تم إضافة القسم الأكاديمي الجديد",
      });
    },
    onError: (error) => {
      console.error('Error creating department:', error);
      toast({
        title: "خطأ في إنشاء القسم",
        description: "حدث خطأ أثناء إنشاء القسم الأكاديمي",
        variant: "destructive",
      });
    },
  });
};

// Hook لتحديث قسم
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AcademicDepartment> }) => {
      const { data, error } = await supabase
        .from('academic_departments')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-departments'] });
      queryClient.invalidateQueries({ queryKey: ['active-academic-departments'] });
      toast({
        title: "تم تحديث القسم بنجاح",
        description: "تم حفظ التغييرات على القسم الأكاديمي",
      });
    },
    onError: (error) => {
      console.error('Error updating department:', error);
      toast({
        title: "خطأ في تحديث القسم",
        description: "حدث خطأ أثناء تحديث القسم الأكاديمي",
        variant: "destructive",
      });
    },
  });
};

// Hook لحذف قسم
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academic_departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-departments'] });
      queryClient.invalidateQueries({ queryKey: ['active-academic-departments'] });
      toast({
        title: "تم حذف القسم بنجاح",
        description: "تم حذف القسم الأكاديمي نهائياً",
      });
    },
    onError: (error) => {
      console.error('Error deleting department:', error);
      toast({
        title: "خطأ في حذف القسم",
        description: "حدث خطأ أثناء حذف القسم الأكاديمي",
        variant: "destructive",
      });
    },
  });
};
```

## الخطوة 5: تحديث ProgramsManagement

قم بتحديث السطرين التاليين في `src/components/admin/ProgramsManagement.tsx`:

```typescript
// استبدل هذا السطر:
// Department management moved to separate component

// بهذا السطر:
import { useActiveAcademicDepartments } from '@/hooks/useAcademicDepartments';

// واستبدل هذا السطر:
const departments = []; // Will be connected to database later

// بهذا السطر:
const { data: departments } = useActiveAcademicDepartments();
```

## الخطوة 6: إضافة قسم الأقسام للشريط الجانبي

أضف رابط الأقسام في الشريط الجانبي للوحة التحكم (إذا لم يكن موجوداً).

## ملاحظات مهمة

1. **الأمان**: تم إعداد RLS بحيث يمكن للمشرفين فقط إضافة/تعديل/حذف الأقسام
2. **الأداء**: تم إضافة فهارس لتحسين سرعة الاستعلامات
3. **البيانات التجريبية**: يمكنك حذف أو تعديل البيانات التجريبية حسب حاجتك
4. **الربط التلقائي**: سيتم ربط البرامج الموجودة بالأقسام تلقائياً

## استكشاف الأخطاء

إذا واجهت مشاكل:

1. تأكد من وجود جدول `user_roles` وأن دورك `admin`
2. تحقق من تفعيل RLS بشكل صحيح
3. راجع console logs للأخطاء
4. تأكد من تحديث types.ts

---

**تم الإعداد بواسطة Lovable AI** 🚀
