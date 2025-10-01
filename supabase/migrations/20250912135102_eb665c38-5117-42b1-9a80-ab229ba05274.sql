-- إنشاء جداول نظام إدارة المحتوى الديناميكي

-- جدول تصنيفات الخدمات
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3b82f6',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- جدول الخدمات السريعة
CREATE TABLE IF NOT EXISTS public.quick_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon_name TEXT NOT NULL DEFAULT 'service',
  icon_color TEXT DEFAULT '#3b82f6',
  background_color TEXT DEFAULT '#f8fafc',
  url TEXT,
  category_id UUID REFERENCES public.service_categories(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_external BOOLEAN DEFAULT false,
  requires_auth BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- جدول البرامج الأكاديمية المحسن
CREATE TABLE IF NOT EXISTS public.dynamic_academic_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_key TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  summary_ar TEXT,
  summary_en TEXT,
  icon_name TEXT DEFAULT 'graduation-cap',
  icon_color TEXT DEFAULT '#3b82f6',
  background_color TEXT DEFAULT '#f8fafc',
  featured_image TEXT,
  gallery JSONB DEFAULT '[]',
  duration_years INTEGER DEFAULT 4,
  credit_hours INTEGER DEFAULT 132,
  degree_type TEXT DEFAULT 'bachelor',
  department_ar TEXT,
  department_en TEXT,
  college_ar TEXT,
  college_en TEXT,
  admission_requirements_ar TEXT,
  admission_requirements_en TEXT,
  career_opportunities_ar TEXT,
  career_opportunities_en TEXT,
  curriculum JSONB DEFAULT '[]',
  contact_info JSONB DEFAULT '{}',
  seo_settings JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  has_page BOOLEAN DEFAULT true,
  page_template TEXT DEFAULT 'standard',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID
);

-- جدول صفحات البرامج الديناميكية
CREATE TABLE IF NOT EXISTS public.program_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.dynamic_academic_programs(id) ON DELETE CASCADE,
  page_key TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  template_name TEXT DEFAULT 'standard',
  custom_sections JSONB DEFAULT '[]',
  custom_css TEXT,
  custom_js TEXT,
  meta_title_ar TEXT,
  meta_title_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  og_image TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- جدول قوالب الصفحات
CREATE TABLE IF NOT EXISTS public.page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  template_config JSONB NOT NULL DEFAULT '{}',
  preview_image TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول تاريخ التغييرات
CREATE TABLE IF NOT EXISTS public.content_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'publish', 'unpublish'
  changes JSONB,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS على جميع الجداول
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_change_log ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمديرين
CREATE POLICY "Admins can manage service categories" ON public.service_categories
FOR ALL USING (has_admin_access(auth.uid()));

CREATE POLICY "Public can view active service categories" ON public.service_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage quick services" ON public.quick_services
FOR ALL USING (has_admin_access(auth.uid()));

CREATE POLICY "Public can view active quick services" ON public.quick_services
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage academic programs" ON public.dynamic_academic_programs
FOR ALL USING (has_admin_access(auth.uid()));

CREATE POLICY "Public can view published programs" ON public.dynamic_academic_programs
FOR SELECT USING (is_active = true AND published_at IS NOT NULL);

CREATE POLICY "Admins can manage program pages" ON public.program_pages
FOR ALL USING (has_admin_access(auth.uid()));

CREATE POLICY "Public can view published program pages" ON public.program_pages
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage page templates" ON public.page_templates
FOR ALL USING (has_admin_access(auth.uid()));

CREATE POLICY "Public can view active templates" ON public.page_templates
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view content change log" ON public.content_change_log
FOR SELECT USING (has_admin_access(auth.uid()));

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_service_categories_display_order ON public.service_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_quick_services_display_order ON public.quick_services(display_order);
CREATE INDEX IF NOT EXISTS idx_quick_services_category ON public.quick_services(category_id);
CREATE INDEX IF NOT EXISTS idx_academic_programs_display_order ON public.dynamic_academic_programs(display_order);
CREATE INDEX IF NOT EXISTS idx_academic_programs_key ON public.dynamic_academic_programs(program_key);
CREATE INDEX IF NOT EXISTS idx_program_pages_slug ON public.program_pages(slug);
CREATE INDEX IF NOT EXISTS idx_content_change_log_resource ON public.content_change_log(resource_type, resource_id);

-- تريجرز للـ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON public.service_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_services_updated_at BEFORE UPDATE ON public.quick_services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_programs_updated_at BEFORE UPDATE ON public.dynamic_academic_programs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_pages_updated_at BEFORE UPDATE ON public.program_pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- دالة لإنشاء صفحة برنامج تلقائياً
CREATE OR REPLACE FUNCTION create_program_page()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.has_page = true AND TG_OP = 'INSERT' THEN
    INSERT INTO public.program_pages (
      program_id,
      page_key,
      slug,
      template_name,
      meta_title_ar,
      meta_title_en,
      meta_description_ar,
      meta_description_en,
      created_by
    ) VALUES (
      NEW.id,
      NEW.program_key,
      NEW.program_key,
      NEW.page_template,
      NEW.title_ar,
      NEW.title_en,
      NEW.summary_ar,
      NEW.summary_en,
      NEW.created_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_program_page_trigger
AFTER INSERT ON public.dynamic_academic_programs
FOR EACH ROW EXECUTE FUNCTION create_program_page();

-- دالة لتسجيل التغييرات
CREATE OR REPLACE FUNCTION log_content_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.content_change_log (
    resource_type,
    resource_id,
    action,
    old_data,
    new_data,
    user_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_service_categories_changes
AFTER INSERT OR UPDATE OR DELETE ON public.service_categories
FOR EACH ROW EXECUTE FUNCTION log_content_changes();

CREATE TRIGGER log_quick_services_changes
AFTER INSERT OR UPDATE OR DELETE ON public.quick_services
FOR EACH ROW EXECUTE FUNCTION log_content_changes();

CREATE TRIGGER log_academic_programs_changes
AFTER INSERT OR UPDATE OR DELETE ON public.dynamic_academic_programs
FOR EACH ROW EXECUTE FUNCTION log_content_changes();

-- إدراج بيانات افتراضية
INSERT INTO public.page_templates (template_key, name_ar, name_en, description_ar, template_config, is_default) VALUES
('standard', 'قالب قياسي', 'Standard Template', 'قالب البرنامج الأكاديمي القياسي', '{"sections":["hero","overview","curriculum","requirements","opportunities","contact"],"layout":"default"}', true),
('detailed', 'قالب مفصل', 'Detailed Template', 'قالب مفصل للبرامج الأكاديمية', '{"sections":["hero","overview","curriculum","requirements","opportunities","faculty","facilities","contact"],"layout":"detailed"}', false),
('compact', 'قالب مدمج', 'Compact Template', 'قالب مدمج للبرامج الأكاديمية', '{"sections":["hero","overview","requirements","contact"],"layout":"compact"}', false);

INSERT INTO public.service_categories (name_ar, name_en, description_ar, icon, display_order) VALUES
('خدمات أكاديمية', 'Academic Services', 'خدمات متعلقة بالشؤون الأكاديمية', 'book-open', 1),
('خدمات طلابية', 'Student Services', 'خدمات الدعم الطلابي', 'users', 2),
('خدمات إدارية', 'Administrative Services', 'الخدمات الإدارية والمالية', 'file-text', 3),
('خدمات رقمية', 'Digital Services', 'الخدمات الإلكترونية والرقمية', 'monitor', 4);