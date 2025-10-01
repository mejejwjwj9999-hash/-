-- تحديث جدول الإشعارات لدعم التصنيف المحسن فقط
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('academic', 'financial', 'administrative', 'general')),
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'medium', 'normal')),
  ADD COLUMN IF NOT EXISTS action_url TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- إنشاء فهارس محسنة للإشعارات
CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON public.notifications(expires_at);

-- تأكد من أن المستخدمين يمكنهم رؤية الإشعارات المصنفة
DROP POLICY IF EXISTS "Students can view their own notifications" ON public.notifications;
CREATE POLICY "Students can view their own notifications" ON public.notifications
  FOR SELECT USING (
    student_id IN (
      SELECT sp.id 
      FROM student_profiles sp 
      WHERE sp.user_id = auth.uid()
    )
  );