-- Fix missing content elements for homepage hero section
DO $$
DECLARE
  page_uuid uuid;
BEGIN
  -- Get homepage page ID
  SELECT id INTO page_uuid FROM admin_content_pages WHERE page_key = 'homepage';
  
  -- Insert missing hero elements if they don't exist
  INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, created_by, updated_by)
  VALUES 
    (page_uuid, 'hero_badge', 'text', 'مرحباً بكم في كلية أيلول الجامعية', 'Welcome to Eylul University College', 'published', true, null, null),
    (page_uuid, 'hero_title', 'text', 'صرحك العلمي نحو المستقبل', 'Your Scientific Foundation Towards the Future', 'published', true, null, null),
    (page_uuid, 'hero_subtitle', 'rich_text', 'نقدم تعليماً عالي الجودة في مختلف التخصصات الأكاديمية والمهنية، مع التركيز على إعداد جيل من الخريجين المؤهلين لسوق العمل المحلي والإقليمي.', 'We provide high-quality education in various academic and professional specializations, focusing on preparing qualified graduates for the local and regional job market.', 'published', true, null, null),
    (page_uuid, 'hero_cta', 'text', 'ابدأ رحلتك معنا', 'Start Your Journey With Us', 'published', true, null, null),
    (page_uuid, 'hero_secondary_cta', 'text', 'تصفح البرامج الأكاديمية', 'Explore Academic Programs', 'published', true, null, null)
  ON CONFLICT (page_id, element_key) DO UPDATE SET
    status = 'published',
    is_active = true,
    updated_at = now();
END $$;