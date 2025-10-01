-- إنشاء البيانات الأساسية للأقسام في admin_content_pages
INSERT INTO admin_content_pages (page_key, page_name_ar, page_name_en, description_ar, description_en, is_active, display_order)
VALUES 
  ('about-college', 'عن الكلية', 'About College', 'الصفحة الرئيسية لمعلومات الكلية', 'Main page for college information', true, 1),
  ('about-dean-word', 'كلمة العميد', 'Dean Word', 'كلمة العميد ورؤيته للكلية', 'Dean message and vision for college', true, 2),
  ('about-vision-mission', 'الرؤية والرسالة', 'Vision & Mission', 'رؤية ورسالة وأهداف الكلية', 'College vision, mission and objectives', true, 3),
  ('about-board-members', 'أعضاء مجلس الإدارة', 'Board Members', 'أعضاء مجلس إدارة الكلية', 'College board of directors members', true, 4),
  ('about-quality-assurance', 'وحدة ضمان الجودة', 'Quality Assurance', 'معلومات وحدة ضمان الجودة', 'Quality assurance unit information', true, 5),
  ('about-scientific-research', 'البحث العلمي', 'Scientific Research', 'أنشطة ومشاريع البحث العلمي', 'Scientific research activities and projects', true, 6)
ON CONFLICT (page_key) DO UPDATE SET
  page_name_ar = EXCLUDED.page_name_ar,
  page_name_en = EXCLUDED.page_name_en,
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;

-- إنشاء المحتوى الأساسي لكل قسم
DO $$
DECLARE
    page_rec RECORD;
BEGIN
    -- عن الكلية
    SELECT id INTO page_rec FROM admin_content_pages WHERE page_key = 'about-college';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
    VALUES 
        (page_rec.id, 'hero-title', 'text', 'كلية أيلول الجامعية', 'Aeloul University College', 'published', true, 1),
        (page_rec.id, 'hero-description', 'rich_text', 'كلية رائدة في التعليم العالي والبحث العلمي، تهدف إلى إعداد خريجين مؤهلين لسوق العمل', 'A leading college in higher education and scientific research, aiming to prepare qualified graduates for the job market', 'published', true, 2),
        (page_rec.id, 'history-section', 'rich_text', 'تأسست كلية أيلول عام 2010 لتكون منارة للعلم والمعرفة في المنطقة', 'Aeloul College was established in 2010 to be a beacon of science and knowledge in the region', 'published', true, 3);

    -- كلمة العميد  
    SELECT id INTO page_rec FROM admin_content_pages WHERE page_key = 'about-dean-word';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order, metadata)
    VALUES 
        (page_rec.id, 'dean-name', 'text', 'د. محمد أحمد العميد', 'Dr. Mohammed Ahmed Al-Ameed', 'published', true, 1, '{"position": "عميد الكلية"}'),
        (page_rec.id, 'dean-image', 'image', '', '', 'draft', true, 2, '{"alt_text": "صورة عميد الكلية"}'),
        (page_rec.id, 'dean-message', 'rich_text', 'أهلاً وسهلاً بكم في كلية أيلول، حيث نسعى لتقديم تعليم متميز', 'Welcome to Aeloul College, where we strive to provide excellent education', 'published', true, 3, '{}');

    -- الرؤية والرسالة
    SELECT id INTO page_rec FROM admin_content_pages WHERE page_key = 'about-vision-mission';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
    VALUES 
        (page_rec.id, 'vision-text', 'rich_text', 'أن نكون كلية رائدة في التعليم العالي والبحث العلمي على المستوى الإقليمي', 'To be a leading college in higher education and scientific research at the regional level', 'published', true, 1),
        (page_rec.id, 'mission-text', 'rich_text', 'تقديم تعليم عالي الجودة وإجراء بحوث علمية متميزة لخدمة المجتمع', 'Providing high-quality education and conducting distinguished scientific research to serve society', 'published', true, 2),
        (page_rec.id, 'objectives-list', 'rich_text', '• إعداد خريجين مؤهلين\n• تطوير البحث العلمي\n• خدمة المجتمع', '• Preparing qualified graduates\n• Developing scientific research\n• Serving the community', 'published', true, 3);

    -- أعضاء مجلس الإدارة
    SELECT id INTO page_rec FROM admin_content_pages WHERE page_key = 'about-board-members';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order, metadata)
    VALUES 
        (page_rec.id, 'board-members-list', 'rich_text', '', '', 'draft', true, 1, '{
            "members": [
                {
                    "name_ar": "د. أحمد محمد الرئيس", 
                    "name_en": "Dr. Ahmed Mohammed Al-Raees",
                    "position_ar": "رئيس مجلس الإدارة",
                    "position_en": "Chairman of the Board",
                    "image": "",
                    "bio_ar": "خبرة 20 عام في التعليم العالي",
                    "bio_en": "20 years of experience in higher education"
                }
            ]
        }');

    -- وحدة ضمان الجودة
    SELECT id INTO page_rec FROM admin_content_pages WHERE page_key = 'about-quality-assurance';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order, metadata)
    VALUES 
        (page_rec.id, 'quality-overview', 'rich_text', 'وحدة ضمان الجودة تعمل على تطوير وتحسين جودة التعليم', 'Quality assurance unit works to develop and improve education quality', 'published', true, 1, '{}'),
        (page_rec.id, 'quality-statistics', 'rich_text', '', '', 'draft', true, 2, '{
            "stats": [
                {"label_ar": "معدل رضا الطلاب", "label_en": "Student Satisfaction Rate", "value": "95%"},
                {"label_ar": "معدل التوظيف", "label_en": "Employment Rate", "value": "88%"}
            ]
        }');

    -- البحث العلمي
    SELECT id INTO page_rec FROM admin_content_pages WHERE page_key = 'about-scientific-research';
    INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order, metadata)
    VALUES 
        (page_rec.id, 'research-overview', 'rich_text', 'البحث العلمي ركيزة أساسية في رؤية الكلية', 'Scientific research is a fundamental pillar in the college vision', 'published', true, 1, '{}'),
        (page_rec.id, 'research-projects', 'rich_text', '', '', 'draft', true, 2, '{
            "projects": [
                {
                    "title_ar": "مشروع تطوير التعليم الإلكتروني",
                    "title_en": "E-learning Development Project", 
                    "status": "active",
                    "year": "2024"
                }
            ]
        }');
END $$;