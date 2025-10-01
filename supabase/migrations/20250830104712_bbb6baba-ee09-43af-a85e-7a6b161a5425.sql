
-- إزالة القيود الموجودة وإعادة إنشائها بالقيم الصحيحة
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_priority_check;

-- إضافة القيود الجديدة مع القيم المطابقة للتطبيق
ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('general', 'academic', 'financial', 'urgent'));

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_priority_check 
CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- التأكد من وجود فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_notifications_student_id ON public.notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
