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
USING (has_admin_access(auth.uid()));

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
-- Trigger لتحديث التاريخ تلقائياً
-- =====================================================

DROP TRIGGER IF EXISTS set_updated_at ON public.academic_departments;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.academic_departments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- إدراج بيانات تجريبية
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

-- إضافة عمود department_id إلى جدول البرامج الأكاديمية
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