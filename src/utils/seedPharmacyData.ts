import { supabase } from '@/integrations/supabase/client';
import type { DynamicAcademicProgram } from '@/hooks/useDynamicPrograms';

export const seedPharmacyData = async () => {
  try {
    // التحقق من وجود بيانات الصيدلة
    const { data: existingData } = await supabase
      .from('dynamic_academic_programs')
      .select('id')
      .eq('program_key', 'pharmacy')
      .maybeSingle();

    if (existingData) {
      console.log('بيانات الصيدلة موجودة مسبقاً');
      return existingData;
    }

    // إدراج بيانات الصيدلة
    const pharmacyData: Omit<DynamicAcademicProgram, 'id' | 'created_at' | 'updated_at'> = {
      program_key: 'pharmacy',
      title_ar: 'كلية الصيدلة',
      title_en: 'College of Pharmacy',
      description_ar: `
        <p>يهدف برنامج دكتور الصيدلة في كلية أيلول الجامعية إلى إعداد صيادلة مؤهلين ومتخصصين قادرين على تقديم خدمات صيدلانية شاملة وآمنة للمجتمع في مختلف البيئات الصحية.</p>
        <p>يركز البرنامج على الجمع بين المعرفة النظرية والمهارات العملية، مع التأكيد على أهمية الأخلاقيات المهنية والتطوير المستمر للكفاءات الصيدلانية.</p>
        <p>يتميز البرنامج بمناهج حديثة تواكب التطورات العالمية في مجال الصيدلة، ومختبرات مجهزة بأحدث المعدات والتقنيات الصيدلانية.</p>
      `,
      description_en: 'A comprehensive program to prepare qualified pharmacists capable of providing comprehensive and safe pharmaceutical services to the community.',
      summary_ar: 'برنامج شامل ومتطور لإعداد صيادلة مؤهلين قادرين على تقديم خدمات صيدلانية متميزة في مختلف المجالات الصحية',
      summary_en: 'A comprehensive and advanced program to prepare qualified pharmacists',
      icon_name: 'pill',
      icon_color: '#10B981',
      background_color: '#F0FDF4',
      featured_image: '',
      gallery: [],
      duration_years: 6,
      credit_hours: 180,
      degree_type: 'دكتور الصيدلة',
      department_ar: 'قسم الصيدلة',
      department_en: 'Pharmacy Department',
      college_ar: 'كلية الصيدلة',
      college_en: 'College of Pharmacy',
      admission_requirements_ar: '',
      admission_requirements_en: '',
      career_opportunities_ar: '',
      career_opportunities_en: '',
      curriculum: [],
      contact_info: {
        email: 'pharmacy@ayloul.edu.ye',
        phone: '+967 1 234567',
        address: 'صنعاء، اليمن'
      },
      seo_settings: {
        meta_title: 'كلية الصيدلة - جامعة أيلول',
        meta_description: 'برنامج دكتور الصيدلة في جامعة أيلول - تعليم صيدلاني متميز',
        keywords: ['صيدلة', 'دكتور صيدلة', 'جامعة أيلول', 'تعليم صيدلاني']
      },
      display_order: 2,
      is_active: true,
      is_featured: true,
      has_page: true,
      page_template: 'detailed',
      metadata: {},
      published_at: new Date().toISOString(),
      
      // البيانات المفصلة
      faculty_members: [
        {
          id: 'faculty-1',
          name_ar: 'د. أحمد محمد الحكيمي',
          name_en: 'Dr. Ahmed Mohammed Al-Hakimi',
          position_ar: 'رئيس القسم - أستاذ الصيدلة السريرية',
          position_en: 'Department Head - Professor of Clinical Pharmacy',
          qualification_ar: 'دكتوراه في الصيدلة السريرية',
          qualification_en: 'PhD in Clinical Pharmacy',
          specialization_ar: 'الصيدلة السريرية وعلم الأدوية',
          specialization_en: 'Clinical Pharmacy and Pharmacology',
          university_ar: 'جامعة القاهرة',
          university_en: 'Cairo University',
          email: 'ahmed.hakimi@ayloul.edu.ye',
          phone: '+967 1 234567',
          profile_image: '',
          bio_ar: 'خبرة واسعة في مجال الصيدلة السريرية والبحث العلمي',
          bio_en: 'Extensive experience in clinical pharmacy and scientific research',
          research_interests: ['الصيدلة السريرية', 'علم الأدوية', 'البحث الدوائي'],
          publications: [],
          order: 1
        },
        {
          id: 'faculty-2',
          name_ar: 'د. فاطمة عبدالله النجار',
          name_en: 'Dr. Fatima Abdullah Al-Najjar',
          position_ar: 'أستاذ مساعد الكيمياء الدوائية',
          position_en: 'Assistant Professor of Pharmaceutical Chemistry',
          qualification_ar: 'دكتوراه في الكيمياء الدوائية',
          qualification_en: 'PhD in Pharmaceutical Chemistry',
          specialization_ar: 'الكيمياء الدوائية وتطوير الأدوية',
          specialization_en: 'Pharmaceutical Chemistry and Drug Development',
          university_ar: 'الجامعة الأردنية',
          university_en: 'University of Jordan',
          email: 'fatima.najjar@ayloul.edu.ye',
          phone: '+967 1 234568',
          profile_image: '',
          bio_ar: 'متخصصة في تطوير وتحليل الأدوية',
          bio_en: 'Specialist in drug development and analysis',
          research_interests: ['الكيمياء الدوائية', 'تطوير الأدوية', 'التحليل الدوائي'],
          publications: [],
          order: 2
        },
        {
          id: 'faculty-3',
          name_ar: 'د. محمد صالح الشرعبي',
          name_en: 'Dr. Mohammed Saleh Al-Sharabi',
          position_ar: 'أستاذ مشارك علم الأدوية',
          position_en: 'Associate Professor of Pharmacology',
          qualification_ar: 'دكتوراه في علم الأدوية',
          qualification_en: 'PhD in Pharmacology',
          specialization_ar: 'علم الأدوية والسموم',
          specialization_en: 'Pharmacology and Toxicology',
          university_ar: 'جامعة الإسكندرية',
          university_en: 'Alexandria University',
          email: 'mohammed.sharabi@ayloul.edu.ye',
          phone: '+967 1 234569',
          profile_image: '',
          bio_ar: 'خبير في علم الأدوية والتفاعلات الدوائية',
          bio_en: 'Expert in pharmacology and drug interactions',
          research_interests: ['علم الأدوية', 'السموم', 'التفاعلات الدوائية'],
          publications: [],
          order: 3
        },
        {
          id: 'faculty-4',
          name_ar: 'د. زينب أحمد العولقي',
          name_en: 'Dr. Zeinab Ahmed Al-Awlaqi',
          position_ar: 'أستاذ مساعد الصيدلانيات',
          position_en: 'Assistant Professor of Pharmaceutics',
          qualification_ar: 'دكتوراه في الصيدلانيات',
          qualification_en: 'PhD in Pharmaceutics',
          specialization_ar: 'تقنيات الأدوية وأنظمة التوصيل الدوائي',
          specialization_en: 'Drug Technology and Drug Delivery Systems',
          university_ar: 'جامعة دمشق',
          university_en: 'Damascus University',
          email: 'zeinab.awlaqi@ayloul.edu.ye',
          phone: '+967 1 234570',
          profile_image: '',
          bio_ar: 'متخصصة في تطوير أشكال الأدوية الحديثة',
          bio_en: 'Specialist in developing modern drug formulations',
          research_interests: ['الصيدلانيات', 'أنظمة التوصيل الدوائي', 'النانو تكنولوجي'],
          publications: [],
          order: 4
        }
      ],
      
      yearly_curriculum: [
        {
          year_number: 1,
          year_name_ar: 'السنة الأولى',
          year_name_en: 'First Year',
          total_credit_hours: 30,
          subjects: [
            {
              id: 'pharm-101',
              code: 'CHEM-101',
              name_ar: 'الكيمياء العامة',
              name_en: 'General Chemistry',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 1,
              prerequisites: [],
              description_ar: 'مبادئ الكيمياء العامة والتفاعلات الكيميائية',
              description_en: 'Principles of general chemistry and chemical reactions',
              order: 1
            },
            {
              id: 'pharm-102',
              code: 'BIO-101',
              name_ar: 'الأحياء العامة',
              name_en: 'General Biology',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 1,
              prerequisites: [],
              description_ar: 'مبادئ علم الأحياء والخلايا',
              description_en: 'Principles of biology and cell science',
              order: 2
            },
            {
              id: 'pharm-103',
              code: 'PHYS-101',
              name_ar: 'الفيزياء العامة',
              name_en: 'General Physics',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 1,
              prerequisites: [],
              description_ar: 'مبادئ الفيزياء وتطبيقاتها في الصيدلة',
              description_en: 'Principles of physics and their applications in pharmacy',
              order: 3
            },
            {
              id: 'pharm-104',
              code: 'MATH-101',
              name_ar: 'الرياضيات',
              name_en: 'Mathematics',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'الرياضيات الأساسية والإحصاء',
              description_en: 'Basic mathematics and statistics',
              order: 4
            },
            {
              id: 'pharm-105',
              code: 'ENG-101',
              name_ar: 'اللغة الإنجليزية',
              name_en: 'English Language',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'اللغة الإنجليزية العامة والطبية',
              description_en: 'General and medical English',
              order: 5
            }
          ]
        },
        {
          year_number: 2,
          year_name_ar: 'السنة الثانية',
          year_name_en: 'Second Year',
          total_credit_hours: 30,
          subjects: [
            {
              id: 'pharm-201',
              code: 'CHEM-201',
              name_ar: 'الكيمياء العضوية',
              name_en: 'Organic Chemistry',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['CHEM-101'],
              description_ar: 'مبادئ الكيمياء العضوية والمركبات العضوية',
              description_en: 'Principles of organic chemistry and organic compounds',
              order: 1
            },
            {
              id: 'pharm-202',
              code: 'ANAT-201',
              name_ar: 'علم التشريح',
              name_en: 'Anatomy',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['BIO-101'],
              description_ar: 'تشريح جسم الإنسان والأجهزة الحيوية',
              description_en: 'Human anatomy and vital systems',
              order: 2
            },
            {
              id: 'pharm-203',
              code: 'PHYS-201',
              name_ar: 'علم وظائف الأعضاء',
              name_en: 'Physiology',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['BIO-101'],
              description_ar: 'وظائف أعضاء الجسم والعمليات الحيوية',
              description_en: 'Body organ functions and biological processes',
              order: 3
            },
            {
              id: 'pharm-204',
              code: 'MICRO-201',
              name_ar: 'علم الأحياء الدقيقة',
              name_en: 'Microbiology',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 1,
              prerequisites: ['BIO-101'],
              description_ar: 'دراسة الكائنات الدقيقة ودورها في الأمراض',
              description_en: 'Study of microorganisms and their role in diseases',
              order: 4
            }
          ]
        },
        {
          year_number: 3,
          year_name_ar: 'السنة الثالثة',
          year_name_en: 'Third Year',
          total_credit_hours: 30,
          subjects: [
            {
              id: 'pharm-301',
              code: 'PCHEM-301',
              name_ar: 'الكيمياء الدوائية',
              name_en: 'Pharmaceutical Chemistry',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['CHEM-201'],
              description_ar: 'كيمياء الأدوية وتركيبها الجزيئي',
              description_en: 'Drug chemistry and molecular structure',
              order: 1
            },
            {
              id: 'pharm-302',
              code: 'PHARM-301',
              name_ar: 'علم الأدوية',
              name_en: 'Pharmacology',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['PHYS-201'],
              description_ar: 'تأثير الأدوية على الجسم وآليات عملها',
              description_en: 'Drug effects on the body and mechanisms of action',
              order: 2
            },
            {
              id: 'pharm-303',
              code: 'PHARM-302',
              name_ar: 'الصيدلانيات',
              name_en: 'Pharmaceutics',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['CHEM-201'],
              description_ar: 'تحضير وتطوير الأشكال الدوائية',
              description_en: 'Preparation and development of dosage forms',
              order: 3
            },
            {
              id: 'pharm-304',
              code: 'PATH-301',
              name_ar: 'علم الأمراض',
              name_en: 'Pathology',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 1,
              prerequisites: ['PHYS-201'],
              description_ar: 'دراسة الأمراض وأسبابها',
              description_en: 'Study of diseases and their causes',
              order: 4
            }
          ]
        },
        {
          year_number: 4,
          year_name_ar: 'السنة الرابعة',
          year_name_en: 'Fourth Year',
          total_credit_hours: 30,
          subjects: [
            {
              id: 'pharm-401',
              code: 'CPHARM-401',
              name_ar: 'الصيدلة السريرية',
              name_en: 'Clinical Pharmacy',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['PHARM-301'],
              description_ar: 'تطبيق المعرفة الصيدلانية في الممارسة السريرية',
              description_en: 'Application of pharmaceutical knowledge in clinical practice',
              order: 1
            },
            {
              id: 'pharm-402',
              code: 'TOXC-401',
              name_ar: 'علم السموم',
              name_en: 'Toxicology',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 1,
              prerequisites: ['PHARM-301'],
              description_ar: 'دراسة المواد السامة وتأثيراتها',
              description_en: 'Study of toxic substances and their effects',
              order: 2
            },
            {
              id: 'pharm-403',
              code: 'PHER-401',
              name_ar: 'العقاقير',
              name_en: 'Pharmacognosy',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['CHEM-201'],
              description_ar: 'دراسة الأدوية من المصادر الطبيعية',
              description_en: 'Study of drugs from natural sources',
              order: 3
            },
            {
              id: 'pharm-404',
              code: 'BIOC-401',
              name_ar: 'الكيمياء الحيوية',
              name_en: 'Biochemistry',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['CHEM-201'],
              description_ar: 'العمليات الكيميائية في الكائنات الحية',
              description_en: 'Chemical processes in living organisms',
              order: 4
            }
          ]
        },
        {
          year_number: 5,
          year_name_ar: 'السنة الخامسة',
          year_name_en: 'Fifth Year',
          total_credit_hours: 30,
          subjects: [
            {
              id: 'pharm-501',
              code: 'THER-501',
              name_ar: 'العلاج الدوائي',
              name_en: 'Pharmacotherapy',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['CPHARM-401'],
              description_ar: 'استخدام الأدوية في علاج الأمراض',
              description_en: 'Use of drugs in disease treatment',
              order: 1
            },
            {
              id: 'pharm-502',
              code: 'HOSP-501',
              name_ar: 'صيدلة المستشفيات',
              name_en: 'Hospital Pharmacy',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 1,
              prerequisites: ['CPHARM-401'],
              description_ar: 'إدارة الصيدلية في المستشفيات',
              description_en: 'Pharmacy management in hospitals',
              order: 2
            },
            {
              id: 'pharm-503',
              code: 'COMM-501',
              name_ar: 'صيدلة المجتمع',
              name_en: 'Community Pharmacy',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 1,
              prerequisites: ['CPHARM-401'],
              description_ar: 'الخدمات الصيدلانية في المجتمع',
              description_en: 'Pharmaceutical services in the community',
              order: 3
            },
            {
              id: 'pharm-504',
              code: 'REGU-501',
              name_ar: 'الشؤون التنظيمية',
              name_en: 'Regulatory Affairs',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['PHARM-302'],
              description_ar: 'القوانين واللوائح الدوائية',
              description_en: 'Drug laws and regulations',
              order: 4
            }
          ]
        },
        {
          year_number: 6,
          year_name_ar: 'السنة السادسة',
          year_name_en: 'Sixth Year',
          total_credit_hours: 30,
          subjects: [
            {
              id: 'pharm-601',
              code: 'CLIN-601',
              name_ar: 'التدريب السريري',
              name_en: 'Clinical Training',
              credit_hours: 12,
              theory_hours: 0,
              practical_hours: 12,
              prerequisites: ['THER-501'],
              description_ar: 'التدريب العملي في المستشفيات والصيدليات',
              description_en: 'Practical training in hospitals and pharmacies',
              order: 1
            },
            {
              id: 'pharm-602',
              code: 'PROJ-601',
              name_ar: 'مشروع التخرج',
              name_en: 'Graduation Project',
              credit_hours: 6,
              theory_hours: 0,
              practical_hours: 6,
              prerequisites: ['THER-501'],
              description_ar: 'بحث علمي في مجال الصيدلة',
              description_en: 'Scientific research in pharmacy field',
              order: 2
            },
            {
              id: 'pharm-603',
              code: 'ECON-601',
              name_ar: 'اقتصاديات الصيدلة',
              name_en: 'Pharmacoeconomics',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['THER-501'],
              description_ar: 'الاقتصاد الصحي والتكلفة الدوائية',
              description_en: 'Health economics and drug cost',
              order: 3
            }
          ]
        }
      ],
      
      academic_requirements: [
        {
          id: 'req-1',
          type: 'academic',
          requirement_ar: 'شهادة الثانوية العامة (القسم العلمي) بنسبة لا تقل عن 85%',
          requirement_en: 'High school certificate (Science track) with minimum 85%',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'req-2',
          type: 'academic',
          requirement_ar: 'درجات عالية في مواد الكيمياء والفيزياء والأحياء والرياضيات',
          requirement_en: 'High grades in Chemistry, Physics, Biology, and Mathematics',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'req-3',
          type: 'academic',
          requirement_ar: 'اجتياز امتحان القبول في المواد العلمية',
          requirement_en: 'Pass the entrance exam in scientific subjects',
          is_mandatory: true,
          order: 3
        },
        {
          id: 'req-4',
          type: 'academic',
          requirement_ar: 'إجادة اللغة الإنجليزية (مستوى متقدم)',
          requirement_en: 'Proficiency in English (Advanced level)',
          is_mandatory: true,
          order: 4
        }
      ],
      
      general_requirements: [
        {
          id: 'gen-1',
          type: 'general',
          requirement_ar: 'اجتياز المقابلة الشخصية',
          requirement_en: 'Pass the personal interview',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'gen-2',
          type: 'general',
          requirement_ar: 'الفحص الطبي الشامل واللياقة البدنية',
          requirement_en: 'Complete medical examination and physical fitness',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'gen-3',
          type: 'general',
          requirement_ar: 'تقديم شهادة حسن السيرة والسلوك',
          requirement_en: 'Submit good conduct certificate',
          is_mandatory: true,
          order: 3
        },
        {
          id: 'gen-4',
          type: 'general',
          requirement_ar: 'اجتياز اختبار الذكاء والقدرات الذهنية',
          requirement_en: 'Pass intelligence and mental abilities test',
          is_mandatory: false,
          order: 4
        }
      ],
      
      program_statistics: [
        {
          label_ar: 'عدد الطلاب المسجلين',
          label_en: 'Enrolled Students',
          value: 120,
          icon: 'users',
          order: 1
        },
        {
          label_ar: 'عدد الخريجين',
          label_en: 'Graduates',
          value: 450,
          icon: 'graduation-cap',
          order: 2
        },
        {
          label_ar: 'معدل التوظيف',
          label_en: 'Employment Rate',
          value: '95%',
          icon: 'briefcase',
          order: 3
        },
        {
          label_ar: 'رضا أرباب العمل',
          label_en: 'Employer Satisfaction',
          value: '92%',
          icon: 'star',
          order: 4
        }
      ],
      
      career_opportunities_list: [
        {
          id: 'career-1',
          title_ar: 'صيدلي في المستشفيات الحكومية والخاصة',
          title_en: 'Pharmacist in public and private hospitals',
          description_ar: 'العمل في الصيدليات السريرية وتقديم الاستشارات الدوائية',
          description_en: 'Working in clinical pharmacies and providing drug consultations',
          sector: 'healthcare',
          order: 1
        },
        {
          id: 'career-2',
          title_ar: 'صيدلي في صيدليات المجتمع',
          title_en: 'Community pharmacist',
          description_ar: 'إدارة الصيدليات وتقديم الخدمات الصيدلانية للمواطنين',
          description_en: 'Managing pharmacies and providing pharmaceutical services to citizens',
          sector: 'retail',
          order: 2
        },
        {
          id: 'career-3',
          title_ar: 'أخصائي في شركات الأدوية',
          title_en: 'Pharmaceutical industry specialist',
          description_ar: 'العمل في تطوير وتسويق الأدوية',
          description_en: 'Working in drug development and marketing',
          sector: 'industry',
          order: 3
        },
        {
          id: 'career-4',
          title_ar: 'مراقب جودة الأدوية',
          title_en: 'Drug quality control specialist',
          description_ar: 'ضمان جودة وسلامة الأدوية المنتجة',
          description_en: 'Ensuring quality and safety of manufactured drugs',
          sector: 'quality',
          order: 4
        },
        {
          id: 'career-5',
          title_ar: 'باحث في مجال الأدوية',
          title_en: 'Pharmaceutical researcher',
          description_ar: 'إجراء البحوث العلمية لتطوير أدوية جديدة',
          description_en: 'Conducting research to develop new drugs',
          sector: 'research',
          order: 5
        },
        {
          id: 'career-6',
          title_ar: 'مسؤول الشؤون التنظيمية',
          title_en: 'Regulatory affairs officer',
          description_ar: 'ضمان الامتثال للقوانين واللوائح الدوائية',
          description_en: 'Ensuring compliance with drug laws and regulations',
          sector: 'regulatory',
          order: 6
        }
      ],
      
      program_overview_ar: 'برنامج متميز يجمع بين التعليم النظري والتدريب العملي المكثف',
      program_overview_en: 'An outstanding program combining theoretical education with intensive practical training',
      student_count: 120
    };

    const { data, error } = await supabase
      .from('dynamic_academic_programs')
      .insert(pharmacyData as any)
      .select()
      .single();

    if (error) {
      console.error('خطأ في إدراج بيانات الصيدلة:', error);
      throw error;
    }

    console.log('تم إدراج بيانات الصيدلة بنجاح');
    return data;
  } catch (error) {
    console.error('خطأ في seedPharmacyData:', error);
    throw error;
  }
};