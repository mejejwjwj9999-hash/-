
-- إصلاح قيد التحقق للمستندات للسماح بحالات إضافية
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_status_check;
ALTER TABLE public.documents ADD CONSTRAINT documents_status_check 
CHECK (status IN ('active', 'inactive', 'pending', 'approved', 'rejected', 'expired', 'processing'));

-- إصلاح قيد التحقق لملفات الطلاب للسماح بحالات إضافية  
ALTER TABLE public.student_profiles DROP CONSTRAINT IF EXISTS student_profiles_status_check;
ALTER TABLE public.student_profiles ADD CONSTRAINT student_profiles_status_check 
CHECK (status IN ('active', 'inactive', 'suspended', 'graduated', 'pending', 'enrolled'));

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_documents_student_status ON public.documents(student_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_student_read ON public.notifications(student_id, is_read);
CREATE INDEX IF NOT EXISTS idx_payments_student_status ON public.payments(student_id, payment_status);

-- إضافة جدول للخدمات المتاحة إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.available_services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id text NOT NULL UNIQUE,
  service_name text NOT NULL,
  service_description text,
  is_active boolean DEFAULT true,
  category text DEFAULT 'general',
  icon_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- تفعيل RLS للخدمات المتاحة
ALTER TABLE public.available_services ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح للجميع بقراءة الخدمات المتاحة
CREATE POLICY IF NOT EXISTS "Everyone can view available services" 
ON public.available_services 
FOR SELECT 
USING (is_active = true);

-- سياسة للسماح للإداريين بإدارة الخدمات
CREATE POLICY IF NOT EXISTS "Admins can manage available services" 
ON public.available_services 
FOR ALL 
USING (is_admin(auth.uid()));

-- إدراج الخدمات الأساسية
INSERT INTO public.available_services (service_id, service_name, service_description, category, icon_name) 
VALUES 
  ('grades', 'كشف الدرجات', 'عرض وطباعة كشف الدرجات الأكاديمي', 'academic', 'FileText'),
  ('schedule', 'الجدول الدراسي', 'عرض الجدول الزمني للمحاضرات', 'academic', 'Calendar'),
  ('attendance', 'تقرير الحضور', 'مراجعة سجل الحضور والغياب', 'academic', 'Clock'),
  ('payment', 'الدفع الإلكتروني', 'دفع الرسوم الدراسية إلكترونياً', 'financial', 'CreditCard'),
  ('financial_statement', 'البيان المالي', 'عرض الحالة المالية والمستحقات', 'financial', 'DollarSign'),
  ('certificate_request', 'طلب شهادات', 'طلب شهادة تخرج أو إثبات قيد', 'documents', 'Award'),
  ('transcript_request', 'طلب كشف درجات رسمي', 'طلب نسخة رسمية من كشف الدرجات', 'documents', 'FileText'),
  ('library', 'المكتبة الرقمية', 'الوصول إلى الكتب والمراجع الإلكترونية', 'academic', 'BookOpen'),
  ('technical_support', 'الدعم التقني', 'حل المشاكل التقنية والدعم الفني', 'support', 'HelpCircle')
ON CONFLICT (service_id) DO UPDATE SET
  service_name = EXCLUDED.service_name,
  service_description = EXCLUDED.service_description,
  category = EXCLUDED.category,
  icon_name = EXCLUDED.icon_name,
  updated_at = now();

-- تحديث الإشعارات لإظهار المزيد من البيانات للطلاب والإداريين
CREATE OR REPLACE FUNCTION public.get_student_notifications(_student_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  title text,
  message text,
  type text,
  priority text,
  is_read boolean,
  created_at timestamp with time zone,
  action_url text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT n.id, n.title, n.message, n.type, n.priority, n.is_read, n.created_at, n.action_url
  FROM public.notifications n
  WHERE 
    (COALESCE(_student_id, auth.uid()) IS NOT NULL) AND
    (n.student_id IN (
      SELECT sp.id 
      FROM public.student_profiles sp 
      WHERE sp.user_id = COALESCE(_student_id, auth.uid())
    ) OR is_admin(auth.uid()))
    AND (n.expires_at IS NULL OR n.expires_at > now())
  ORDER BY n.created_at DESC;
$$;
