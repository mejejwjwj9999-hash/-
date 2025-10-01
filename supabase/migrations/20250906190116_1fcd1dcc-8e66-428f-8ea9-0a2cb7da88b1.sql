-- إنشاء جميع العناصر للصفحات مع المحتوى الحالي

-- صفحة Hero (القسم الرئيسي)
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'hero'),
    'welcome_badge',
    'text',
    'مرحباً بكم في كلية أيلول الجامعية',
    'Welcome to Aylol College',
    'published',
    true,
    1;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'hero'),
    'main_title',
    'text',
    'صرحك العلمي<br /><span class="text-university-gold">نحو المستقبل</span>',
    'Your Scientific Foundation<br /><span class="text-university-gold">Towards the Future</span>',
    'published',
    true,
    2;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'hero'),
    'description',
    'text',
    'نقدم تعليماً عالي الجودة في مختلف التخصصات الأكاديمية والمهنية، مع التركيز على إعداد جيل من الخريجين المؤهلين لسوق العمل المحلي والإقليمي.',
    'We provide high-quality education in various academic and professional disciplines, focusing on preparing qualified graduates for the local and regional job market.',
    'published',
    true,
    3;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'hero'),
    'primary_button',
    'button',
    'ابدأ رحلتك معنا',
    'Start Your Journey With Us',
    'published',
    true,
    4;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'hero'),
    'secondary_button',
    'button',
    'تصفح البرامج الأكاديمية',
    'Browse Academic Programs',
    'published',
    true,
    5;

-- صفحة About (حول الكلية)
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'about'),
    'page_title',
    'text',
    'عن كلية أيلول الجامعية',
    'About Aylol College',
    'published',
    true,
    1;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'about'),
    'page_subtitle',
    'text',
    'كلية حديثة في التعليم العالي تسعى لإعداد جيل متميز من الكوادر المؤهلة في مختلف التخصصات الطبية والتقنية والإدارية',
    'A modern institution in higher education that seeks to prepare a distinguished generation of qualified personnel in various medical, technical and administrative specialties',
    'published',
    true,
    2;

-- صفحة Programs (البرامج الأكاديمية)
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'programs'),
    'page_title',
    'text',
    'الأقسام الأكاديمية',
    'Academic Departments',
    'published',
    true,
    1;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'programs'),
    'page_subtitle',
    'text',
    'تقدم كلية أيلول الجامعية برامج أكاديمية متنوعة ومتطورة تواكب احتياجات سوق العمل',
    'Aylol College offers diverse and advanced academic programs that meet the needs of the job market',
    'published',
    true,
    2;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'programs'),
    'programs_title',
    'text',
    'برامجنا الأكاديمية',
    'Our Academic Programs',
    'published',
    true,
    3;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'programs'),
    'programs_description',
    'text',
    'نقدم برامج أكاديمية متنوعة ومعتمدة تلبي احتياجات سوق العمل المحلي والإقليمي، مع التركيز على الجودة والتميز في التعليم العالي',
    'We offer diverse and accredited academic programs that meet the needs of the local and regional job market, focusing on quality and excellence in higher education',
    'published',
    true,
    4;

-- صفحة Media Center (المركز الإعلامي)
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'media_center'),
    'page_title',
    'text',
    'المركز الإعلامي',
    'Media Center',
    'published',
    true,
    1;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'media_center'),
    'page_subtitle',
    'text',
    'تابع آخر أخبار الكلية والفعاليات والإنجازات الأكاديمية',
    'Follow the latest college news, events and academic achievements',
    'published',
    true,
    2;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'media_center'),
    'news_title',
    'text',
    'آخر الأخبار',
    'Latest News',
    'published',
    true,
    3;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'media_center'),
    'events_title',
    'text',
    'الفعاليات القادمة',
    'Upcoming Events',
    'published',
    true,
    4;

-- صفحة Contact (اتصل بنا)
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'contact'),
    'page_title',
    'text',
    'تواصل معنا',
    'Contact Us',
    'published',
    true,
    1;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'contact'),
    'page_subtitle',
    'text',
    'نحن هنا للإجابة على جميع استفساراتكم وتقديم المساعدة اللازمة',
    'We are here to answer all your inquiries and provide the necessary assistance',
    'published',
    true,
    2;

-- صفحة Navigation (القوائم) - عناصر القائمة الرئيسية
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'navigation'),
    'main_menu_home',
    'link',
    'الرئيسية',
    'Home',
    'published',
    true,
    1;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'navigation'),
    'main_menu_about',
    'text',
    'عن الكلية',
    'About College',
    'published',
    true,
    2;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'navigation'),
    'main_menu_programs',
    'text',
    'البرامج الأكاديمية',
    'Academic Programs',
    'published',
    true,
    3;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'navigation'),
    'main_menu_admissions',
    'link',
    'القبول والتسجيل',
    'Admissions',
    'published',
    true,
    4;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'navigation'),
    'main_menu_student_affairs',
    'text',
    'شؤون الطلاب',
    'Student Affairs',
    'published',
    true,
    5;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'navigation'),
    'main_menu_news',
    'text',
    'الأخبار والفعاليات',
    'News & Events',
    'published',
    true,
    6;

INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT 
    (SELECT id FROM admin_content_pages WHERE page_key = 'navigation'),
    'main_menu_contact',
    'link',
    'اتصل بنا',
    'Contact Us',
    'published',
    true,
    7;