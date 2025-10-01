-- المرحلة 1: إنشاء جداول إدارة المحتوى والمراجعات

-- جدول أقسام المحتوى مع تحسينات
CREATE TABLE IF NOT EXISTS admin_content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL, -- 'hero', 'about', 'media_center', 'navigation', etc.
  page_name_ar TEXT NOT NULL,
  page_name_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول عناصر المحتوى لكل صفحة
CREATE TABLE IF NOT EXISTS admin_content_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES admin_content_pages(id) ON DELETE CASCADE,
  element_key TEXT NOT NULL, -- 'title', 'subtitle', 'description', 'image', 'button_text', etc.
  element_type TEXT NOT NULL CHECK (element_type IN ('text', 'rich_text', 'image', 'link', 'button')),
  content_ar TEXT,
  content_en TEXT,
  metadata JSONB DEFAULT '{}', -- للصور: {url, alt, width, height}, للروابط: {href, target}
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(page_id, element_key)
);

-- جدول تاريخ المراجعات
CREATE TABLE IF NOT EXISTS admin_content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_id UUID REFERENCES admin_content_elements(id) ON DELETE CASCADE,
  content_ar TEXT,
  content_en TEXT,
  metadata JSONB DEFAULT '{}',
  revision_number INTEGER NOT NULL,
  change_summary TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_content_pages_key ON admin_content_pages(page_key);
CREATE INDEX IF NOT EXISTS idx_content_elements_page_key ON admin_content_elements(page_id, element_key);
CREATE INDEX IF NOT EXISTS idx_content_elements_status ON admin_content_elements(status, is_active);
CREATE INDEX IF NOT EXISTS idx_content_revisions_element ON admin_content_revisions(element_id, revision_number DESC);

-- تريجر لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON admin_content_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_content();

CREATE TRIGGER update_content_elements_updated_at
  BEFORE UPDATE ON admin_content_elements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_content();

-- تريجر لإنشاء مراجعة عند التحديث
CREATE OR REPLACE FUNCTION create_content_revision()
RETURNS TRIGGER AS $$
BEGIN
  -- إنشاء مراجعة جديدة عند تغيير المحتوى
  IF OLD.content_ar IS DISTINCT FROM NEW.content_ar OR 
     OLD.content_en IS DISTINCT FROM NEW.content_en OR 
     OLD.metadata IS DISTINCT FROM NEW.metadata THEN
    
    INSERT INTO admin_content_revisions (
      element_id,
      content_ar,
      content_en,
      metadata,
      revision_number,
      change_summary,
      created_by
    ) VALUES (
      NEW.id,
      OLD.content_ar,
      OLD.content_en,
      OLD.metadata,
      COALESCE((
        SELECT MAX(revision_number) + 1 
        FROM admin_content_revisions 
        WHERE element_id = NEW.id
      ), 1),
      'Content updated',
      NEW.updated_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_content_revision_trigger
  BEFORE UPDATE ON admin_content_elements
  FOR EACH ROW EXECUTE FUNCTION create_content_revision();

-- إنشاء RLS policies
ALTER TABLE admin_content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_content_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_content_revisions ENABLE ROW LEVEL SECURITY;

-- سياسات للمشرفين
CREATE POLICY "Admins can manage content pages" ON admin_content_pages
  FOR ALL USING (has_admin_access(auth.uid()));

CREATE POLICY "Admins can manage content elements" ON admin_content_elements
  FOR ALL USING (has_admin_access(auth.uid()));

CREATE POLICY "Admins can view content revisions" ON admin_content_revisions
  FOR SELECT USING (has_admin_access(auth.uid()));

-- سياسات للعامة (قراءة المحتوى المنشور فقط)
CREATE POLICY "Public can view published content pages" ON admin_content_pages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view published content elements" ON admin_content_elements
  FOR SELECT USING (status = 'published' AND is_active = true);

-- إدراج البيانات الأساسية للصفحات
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, description_en) VALUES
('hero', 'القسم الرئيسي', 'Hero Section', 'المحتوى الرئيسي للصفحة الأولى', 'Main content for homepage'),
('about', 'حول الكلية', 'About College', 'معلومات عن الكلية', 'Information about the college'),
('media_center', 'المركز الإعلامي', 'Media Center', 'الأخبار والفعاليات', 'News and events'),
('navigation', 'القوائم', 'Navigation', 'عناصر القوائم الرئيسية', 'Main navigation elements'),
('programs', 'البرامج الأكاديمية', 'Academic Programs', 'التخصصات والبرامج', 'Specializations and programs'),
('contact', 'اتصل بنا', 'Contact Us', 'معلومات التواصل', 'Contact information')
ON CONFLICT (page_key) DO NOTHING;