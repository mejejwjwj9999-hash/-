-- إضافة البيانات المفقودة لصفحة الرؤية والرسالة
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT id, 'page_subtitle', 'rich_text', 'نحن في كلية أيلول الجامعية نؤمن برؤية واضحة ورسالة نبيلة تقودنا نحو التميز الأكاديمي وخدمة المجتمع', 'We at Eylul University College believe in a clear vision and noble mission that leads us towards academic excellence and community service', 'published', true, 0
FROM admin_content_pages WHERE page_key = 'vision-mission'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now();

-- إضافة عناصر القيم الأساسية
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT p.id, e.element_key, e.element_type, e.content_ar, e.content_en, 'published', true, e.display_order
FROM admin_content_pages p,
(VALUES 
  ('values_title', 'text', 'قيمنا الأساسية', 'Our Core Values', 6),
  ('values_subtitle', 'rich_text', 'تستند كلية أيلول الجامعية في عملها على مجموعة من القيم الراسخة التي تحدد هويتها وتوجه مسيرتها', 'Eylul University College is based on a set of solid values that define its identity and guide its journey', 7),
  ('value_1_title', 'text', 'التميز الأكاديمي', 'Academic Excellence', 8),
  ('value_1_content', 'rich_text', 'نسعى للوصول إلى أعلى معايير الجودة في التعليم والبحث العلمي', 'We strive to reach the highest standards of quality in education and scientific research', 9),
  ('value_2_title', 'text', 'النزاهة والشفافية', 'Integrity and Transparency', 10),
  ('value_2_content', 'rich_text', 'نلتزم بأعلى معايير النزاهة والشفافية في جميع أعمالنا وعلاقاتنا', 'We are committed to the highest standards of integrity and transparency in all our work and relationships', 11),
  ('value_3_title', 'text', 'خدمة المجتمع', 'Community Service', 12),
  ('value_3_content', 'rich_text', 'نركز على تلبية احتياجات المجتمع وتقديم الحلول للتحديات المحلية', 'We focus on meeting community needs and providing solutions to local challenges', 13),
  ('value_4_title', 'text', 'التعلم المستمر', 'Continuous Learning', 14),
  ('value_4_content', 'rich_text', 'نشجع ثقافة التعلم مدى الحياة والتطوير المستمر للقدرات', 'We encourage a culture of lifelong learning and continuous capacity development', 15),
  ('value_5_title', 'text', 'الابتكار والإبداع', 'Innovation and Creativity', 16),
  ('value_5_content', 'rich_text', 'نحفز الابتكار والإبداع في المناهج وطرق التدريس والبحث العلمي', 'We stimulate innovation and creativity in curricula, teaching methods and scientific research', 17),
  ('value_6_title', 'text', 'المسؤولية المجتمعية', 'Social Responsibility', 18),
  ('value_6_content', 'rich_text', 'نؤمن بدورنا في التنمية المستدامة والمسؤولية تجاه البيئة والمجتمع', 'We believe in our role in sustainable development and responsibility towards the environment and society', 19)
) AS e(element_key, element_type, content_ar, content_en, display_order)
WHERE p.page_key = 'vision-mission'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now();

-- إضافة عناصر الأهداف الاستراتيجية
INSERT INTO admin_content_elements (page_id, element_key, element_type, content_ar, content_en, status, is_active, display_order)
SELECT p.id, e.element_key, e.element_type, e.content_ar, e.content_en, 'published', true, e.display_order
FROM admin_content_pages p,
(VALUES 
  ('goals_title', 'text', 'أهدافنا الاستراتيجية', 'Our Strategic Goals', 20),
  ('goals_subtitle', 'rich_text', 'نعمل على تحقيق مجموعة من الأهداف الاستراتيجية التي تضمن تطوير الكلية وتميزها', 'We work to achieve a set of strategic goals that ensure the development and excellence of the college', 21),
  ('goal_education_title', 'text', 'التعليم والتعلم', 'Education and Learning', 22),
  ('goal_education_content', 'rich_text', '• تطوير برامج أكاديمية متميزة تواكب التطورات العلمية<br>• تحسين جودة التعليم وطرق التدريس الحديثة<br>• رفع معدلات نجاح الطلاب وتخرجهم في الوقت المحدد<br>• تعزيز التعلم الإلكتروني والتكنولوجيا التعليمية', 'Developing distinguished academic programs that keep pace with scientific developments and improving the quality of education', 23),
  ('goal_research_title', 'text', 'البحث العلمي', 'Scientific Research', 24),
  ('goal_research_content', 'rich_text', '• تشجيع أعضاء هيئة التدريس على البحث العلمي<br>• إقامة شراكات مع مؤسسات بحثية محلية وإقليمية<br>• نشر البحوث في مجلات علمية محكمة<br>• تطوير مراكز بحثية متخصصة', 'Encouraging faculty members to conduct scientific research and establishing partnerships with local and regional research institutions', 25),
  ('goal_community_title', 'text', 'خدمة المجتمع', 'Community Service', 26),
  ('goal_community_content', 'rich_text', '• تقديم برامج التدريب والتطوير المهني<br>• إجراء الاستشارات التخصصية للمؤسسات<br>• تنظيم فعاليات توعوية وثقافية<br>• المساهمة في حل مشكلات المجتمع المحلي', 'Providing training and professional development programs and conducting specialized consultations for institutions', 27),
  ('goal_infrastructure_title', 'text', 'البنية التحتية', 'Infrastructure', 28),
  ('goal_infrastructure_content', 'rich_text', '• تطوير المرافق والمختبرات العلمية<br>• توسيع المكتبة الأكاديمية والرقمية<br>• تحديث الأنظمة الإدارية والأكاديمية<br>• توفير بيئة تعليمية محفزة ومريحة', 'Developing facilities and scientific laboratories and expanding the academic and digital library', 29)
) AS e(element_key, element_type, content_ar, content_en, display_order)
WHERE p.page_key = 'vision-mission'
ON CONFLICT (page_id, element_key) DO UPDATE SET 
  content_ar = EXCLUDED.content_ar,
  content_en = EXCLUDED.content_en,
  updated_at = now();