-- 1) الامتدادات الضرورية
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- 2) الجدول الأساسي
create table if not exists public.dynamic_academic_programs (
  id uuid primary key default gen_random_uuid(),
  program_key text unique not null,
  title_ar text not null,
  title_en text,
  description_ar text,
  description_en text,
  summary_ar text,
  summary_en text,
  icon_name text not null,
  icon_color text not null,
  background_color text not null,
  featured_image text,
  gallery jsonb not null default '[]',
  duration_years int not null,
  credit_hours int not null,
  degree_type text not null,
  department_ar text,
  department_en text,
  college_ar text,
  college_en text,
  admission_requirements_ar text,
  admission_requirements_en text,
  career_opportunities_ar text,
  career_opportunities_en text,
  curriculum jsonb not null default '[]',
  contact_info jsonb not null default '{}'::jsonb,
  seo_settings jsonb not null default '{}'::jsonb,
  display_order int not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  has_page boolean not null default true,
  page_template text not null default 'default',
  metadata jsonb not null default '{}'::jsonb,
  -- الحقول الجديدة المتوقعه من الواجهة:
  faculty_members jsonb not null default '[]',
  yearly_curriculum jsonb not null default '[]',
  academic_requirements jsonb not null default '[]',
  general_requirements jsonb not null default '[]',
  program_statistics jsonb not null default '[]',
  career_opportunities_list jsonb not null default '[]',
  program_overview_ar text,
  program_overview_en text,
  student_count int not null default 0,
  published_at timestamptz,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) الفهارس
create index if not exists idx_dynamic_programs_display_order on public.dynamic_academic_programs(display_order asc);
create index if not exists idx_dynamic_programs_published_active on public.dynamic_academic_programs(is_active, published_at);
create unique index if not exists uq_dynamic_programs_key on public.dynamic_academic_programs(program_key);

-- 4) محدث تلقائي لحقل updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_dynamic_programs_set_updated_at on public.dynamic_academic_programs;
create trigger trg_dynamic_programs_set_updated_at
before update on public.dynamic_academic_programs
for each row execute function public.set_updated_at();

-- 5) تفعيل RLS وسياسات الوصول
alter table public.dynamic_academic_programs enable row level security;

-- قراءة عامة: يظهر فقط المنشور والنشط (لقسم الزوار)
drop policy if exists "public can read published active programs" on public.dynamic_academic_programs;
create policy "public can read published active programs"
on public.dynamic_academic_programs
for select
to anon, authenticated
using (is_active = true and published_at is not null);

-- قراءة كاملة في لوحة الإدارة: تمكين القراءة لكل المصادقين (يمكن تضييقها لاحقاً)
drop policy if exists "authenticated can read all programs (admin)" on public.dynamic_academic_programs;
create policy "authenticated can read all programs (admin)"
on public.dynamic_academic_programs
for select
to authenticated
using (true);

-- إنشاء/تعديل/حذف في لوحة الإدارة للمصادقين (يمكن ربطها بجدول admins لاحقاً)
drop policy if exists "authenticated can insert programs" on public.dynamic_academic_programs;
create policy "authenticated can insert programs"
on public.dynamic_academic_programs
for insert
to authenticated
with check (true);

drop policy if exists "authenticated can update programs" on public.dynamic_academic_programs;
create policy "authenticated can update programs"
on public.dynamic_academic_programs
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can delete programs" on public.dynamic_academic_programs;
create policy "authenticated can delete programs"
on public.dynamic_academic_programs
for delete
to authenticated
using (true);

-- 6) بيانات تجريبية كاملة (تتوافق مع ما تتوقعه الواجهة والتحرير)
insert into public.dynamic_academic_programs (
  program_key, title_ar, title_en, description_ar, description_en,
  summary_ar, summary_en, icon_name, icon_color, background_color,
  featured_image, gallery, duration_years, credit_hours, degree_type,
  department_ar, department_en, college_ar, college_en,
  admission_requirements_ar, admission_requirements_en,
  career_opportunities_ar, career_opportunities_en,
  curriculum, contact_info, seo_settings,
  display_order, is_active, is_featured, has_page, page_template, metadata,
  faculty_members, yearly_curriculum, academic_requirements, general_requirements,
  program_statistics, career_opportunities_list, program_overview_ar, program_overview_en,
  student_count, published_at
) values (
  'pharmacy',
  'كلية الصيدلة',
  'College of Pharmacy',
  'برنامج شامل لإعداد صيادلة مؤهلين.',
  'Comprehensive program for pharmacists.',
  'إعداد صيادلة قادرين على تقديم رعاية دوائية آمنة.',
  'Preparing pharmacists for safe pharmaceutical care.',
  'Pill', '#3b82f6', '#f0f9ff',
  null,
  '[]'::jsonb,
  5, 168, 'bachelor',
  'قسم الصيدلة', 'Pharmacy Department',
  'كلية الصيدلة', 'College of Pharmacy',
  'شروط أكاديمية عامة...', 'General academic requirements...',
  'فرص عمل متعددة...', 'Multiple career opportunities...',
  '[]'::jsonb,
  jsonb_build_object('email','pharmacy@univ.edu','phone','+970-2-1234567'),
  jsonb_build_object('title','Pharmacy Program','description','SEO desc','keywords',jsonb_build_array('pharmacy','health')),
  1, true, true, true, 'default',
  jsonb_build_object('student_count',85),
  -- faculty_members (مثال عضوين)
  jsonb_build_array(
    jsonb_build_object('id','fm-1','name_ar','د. أحمد','position_ar','أستاذ','qualification_ar','دكتوراه','specialization_ar','صيدلة سريرية','order',1),
    jsonb_build_object('id','fm-2','name_ar','د. ليلى','position_ar','أستاذ مشارك','qualification_ar','ماجستير','specialization_ar','علم الأدوية','order',2)
  ),
  -- yearly_curriculum (سنتين نموذجيًا)
  jsonb_build_array(
    jsonb_build_object('year_number',1,'year_name_ar','السنة الأولى','total_credit_hours',36,'subjects', jsonb_build_array(
      jsonb_build_object('id','c-101','code','PHAR101','name_ar','مقدمة في الصيدلة','credit_hours',3,'theory_hours',2,'practical_hours',1,'order',1)
    )),
    jsonb_build_object('year_number',2,'year_name_ar','السنة الثانية','total_credit_hours',34,'subjects', jsonb_build_array(
      jsonb_build_object('id','c-201','code','PHAR201','name_ar','الكيمياء الدوائية','credit_hours',3,'theory_hours',2,'practical_hours',1,'order',1)
    ))
  ),
  -- academic_requirements
  jsonb_build_array(
    jsonb_build_object('id','ar-1','type','academic','requirement_ar','معدل ثانوية ≥ 85%','is_mandatory',true,'order',1)
  ),
  -- general_requirements
  jsonb_build_array(
    jsonb_build_object('id','gr-1','type','general','requirement_ar','مقابلة شخصية','is_mandatory',true,'order',1)
  ),
  -- program_statistics
  jsonb_build_array(
    jsonb_build_object('label_ar','عدد الطلبة','value',85,'order',1),
    jsonb_build_object('label_ar','الساعات المعتمدة','value',168,'order',2)
  ),
  -- career_opportunities_list
  jsonb_build_array(
    jsonb_build_object('id','co-1','title_ar','صيدلي سريري','order',1),
    jsonb_build_object('id','co-2','title_ar','صيدلي صناعي','order',2)
  ),
  -- overview
  'نظرة عامة عربية للبرنامج...',
  'English program overview...',
  85,
  now()  -- اجعله منشورًا فورًا ليظهر للعامة أيضاً
);