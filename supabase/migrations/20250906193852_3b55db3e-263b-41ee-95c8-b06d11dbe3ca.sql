-- إضافة المحتوى لكل الصفحات
DO $$
DECLARE
    page_id_var uuid;
BEGIN
    -- محتوى الصفحة الرئيسية
    SELECT id INTO page_id_var FROM admin_content_pages WHERE page_key = 'homepage';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (page_id_var, 'hero_title', 'text', 'أهلاً بكم في كلية إيلول الجامعية', 'Welcome to Eylul University College', 'published', true, 1),
    (page_id_var, 'hero_subtitle', 'rich_text', 'كلية رائدة في التعليم العالي والبحث العلمي، نسعى لإعداد كوادر مؤهلة تواكب متطلبات سوق العمل المحلي والإقليمي', 'A leading college in higher education and scientific research', 'published', true, 2),
    (page_id_var, 'hero_cta', 'text', 'ابدأ رحلتك التعليمية معنا', 'Start Your Educational Journey With Us', 'published', true, 3)
    ON CONFLICT (page_id, element_key) DO UPDATE SET
      content_ar = EXCLUDED.content_ar,
      content_en = EXCLUDED.content_en;

    -- محتوى صفحة الرؤية والرسالة
    SELECT id INTO page_id_var FROM admin_content_pages WHERE page_key = 'vision-mission';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (page_id_var, 'page_title', 'text', 'رؤيتنا ورسالتنا', 'Our Vision & Mission', 'published', true, 1),
    (page_id_var, 'vision_title', 'text', 'رؤيتنا', 'Our Vision', 'published', true, 2),
    (page_id_var, 'vision_content', 'rich_text', 'أن نكون كلية رائدة في التعليم العالي والبحث العلمي على المستوى المحلي والإقليمي، ونسعى لتحقيق التميز في إعداد الخريجين المؤهلين والمبدعين القادرين على المنافسة في سوق العمل', 'To be a leading college in higher education and scientific research at the local and regional levels', 'published', true, 3),
    (page_id_var, 'mission_title', 'text', 'رسالتنا', 'Our Mission', 'published', true, 4),
    (page_id_var, 'mission_content', 'rich_text', 'تقديم برامج تعليمية متميزة ومعتمدة في مختلف التخصصات، وإجراء البحوث العلمية التطبيقية التي تخدم المجتمع، وتنمية قدرات الطلاب العلمية والعملية والإبداعية', 'Providing distinguished and accredited educational programs in various disciplines', 'published', true, 5)
    ON CONFLICT (page_id, element_key) DO UPDATE SET
      content_ar = EXCLUDED.content_ar,
      content_en = EXCLUDED.content_en;

    -- محتوى صفحة التاريخ
    SELECT id INTO page_id_var FROM admin_content_pages WHERE page_key = 'history';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (page_id_var, 'page_title', 'text', 'تاريخ كلية إيلول', 'History of Eylul College', 'published', true, 1),
    (page_id_var, 'founding_title', 'text', 'التأسيس والنشأة', 'Foundation & Establishment', 'published', true, 2),
    (page_id_var, 'founding_content', 'rich_text', 'تأسست كلية إيلول الجامعية في عام 2010 كمؤسسة تعليمية رائدة تهدف إلى تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية', 'Eylul University College was established in 2010 as a leading educational institution', 'published', true, 3),
    (page_id_var, 'development_title', 'text', 'التطور والإنجازات', 'Development & Achievements', 'published', true, 4),
    (page_id_var, 'development_content', 'rich_text', 'منذ تأسيسها، شهدت الكلية تطوراً مستمراً في برامجها الأكاديمية ومرافقها التعليمية، وحصلت على الاعتماد الأكاديمي من وزارة التعليم العالي', 'Since its establishment, the college has witnessed continuous development', 'published', true, 5)
    ON CONFLICT (page_id, element_key) DO UPDATE SET
      content_ar = EXCLUDED.content_ar,
      content_en = EXCLUDED.content_en;

    -- محتوى باقي الصفحات
    SELECT id INTO page_id_var FROM admin_content_pages WHERE page_key = 'accreditation';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order) VALUES
    (page_id_var, 'page_title', 'text', 'الاعتماد الأكاديمي', 'Academic Accreditation', 'published', true, 1),
    (page_id_var, 'content', 'rich_text', 'حصلت كلية إيلول على الاعتماد الأكاديمي من وزارة التعليم العالي والبحث العلمي، وتخضع جميع برامجها الأكاديمية للمراجعة والتقييم المستمر لضمان جودة التعليم', 'Eylul College has obtained academic accreditation from the Ministry of Higher Education', 'published', true, 2)
    ON CONFLICT (page_id, element_key) DO UPDATE SET
      content_ar = EXCLUDED.content_ar,
      content_en = EXCLUDED.content_en;

END $$;