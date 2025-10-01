
-- 1) جدول الخدمات المتاحة (حي 100%) ----------------------------

create table if not exists public.available_services (
  id uuid primary key default gen_random_uuid(),
  service_id text unique not null,
  service_name text not null,
  service_description text,
  is_active boolean not null default true,
  category text not null,          -- مثال: 'documents' | 'services' | 'academic' | 'financial' | 'support'
  icon_name text not null,         -- مثال: 'FileText' | 'Calendar' | 'Award' | 'BookOpen' ...
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- تفعيل RLS
alter table public.available_services enable row level security;

-- سياسة: الجميع يمكنه القراءة للخدمات المفعّلة فقط
create policy if not exists "Everyone can read active services"
  on public.available_services
  for select
  using (is_active = true);

-- سياسة: المدراء يمكنهم إدارة كل الخدمات
create policy if not exists "Admins can manage all available services"
  on public.available_services
  as restrictive
  for all
  using (is_admin(auth.uid()));

-- Trigger لتحديث updated_at تلقائياً (يعتمد وجود الدالة العامة في مشروعك)
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_available_services_updated_at'
  ) then
    create trigger trg_available_services_updated_at
      before update on public.available_services
      for each row
      execute function public.update_updated_at_column();
  end if;
end $$;

-- تعبئة أولية (بيانات إنتاجية داخل قاعدة البيانات – ليست ثابتة بالكود):
insert into public.available_services (service_id, service_name, service_description, category, icon_name)
values
  ('transcript', 'كشف درجات', 'طلب كشف درجات رسمي معتمد', 'documents', 'FileText'),
  ('certificate', 'شهادة تخرج', 'طلب شهادة تخرج مصدقة', 'documents', 'Award'),
  ('enrollment', 'إفادة قيد', 'طلب إفادة قيد للطالب', 'documents', 'User'),
  ('accommodation', 'طلب سكن', 'تقديم طلب للحصول على سكن جامعي', 'services', 'Home'),
  ('transport', 'مواصلات', 'طلب خدمة المواصلات الجامعية', 'services', 'Car'),
  ('absence_request', 'طلب غياب', 'تقديم طلب غياب مع المبررات', 'academic', 'UserX')
on conflict (service_id) do nothing;

-----------------------------------------------------------------
-- 2) إنشاء Bucket للتخزين وتهيئة السياسات لرفع المرفقات

-- إنشاء البكت (عام للقراءة)
insert into storage.buckets (id, name, public)
values ('student-documents', 'student-documents', true)
on conflict (id) do nothing;

-- سياسات Storage على storage.objects
-- ملاحظة: سياسات التخزين تعمل على مستوى السجلات في storage.objects

-- السماح بالقراءة العامة لهذا البكت
create policy if not exists "Public read access to student-documents"
  on storage.objects
  for select
  using (bucket_id = 'student-documents');

-- السماح للمستخدمين المصادقين برفع الملفات إلى هذا البكت
create policy if not exists "Authenticated users can upload to student-documents"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'student-documents' and auth.uid() = owner);

-- السماح لمالك الملف بتحديث ملفه
create policy if not exists "Owners can update their files in student-documents"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'student-documents' and auth.uid() = owner);

-- السماح لمالك الملف بحذف ملفه
create policy if not exists "Owners can delete their files in student-documents"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'student-documents' and auth.uid() = owner);
