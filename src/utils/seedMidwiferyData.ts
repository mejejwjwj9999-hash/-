import { supabase } from '@/integrations/supabase/client';
import type { DynamicAcademicProgram } from '@/hooks/useDynamicPrograms';

export const seedMidwiferyData = async () => {
  try {
    // التحقق من وجود بيانات القبالة
    const { data: existingData } = await supabase
      .from('dynamic_academic_programs')
      .select('id')
      .eq('program_key', 'midwifery')
      .maybeSingle();

    if (existingData) {
      console.log('بيانات القبالة موجودة بالفعل');
      return existingData;
    }

    const midwiferyProgramData: Omit<DynamicAcademicProgram, 'id' | 'created_at' | 'updated_at' | 'published_at'> = {
      program_key: 'midwifery',
      title_ar: 'تقنيات القبالة',
      title_en: 'Midwifery Techniques',
      description_ar: 'برنامج تقنيات القبالة هو برنامج أكاديمي متخصص يهدف إلى إعداد قابلات مؤهلات علمياً وعملياً لتقديم الرعاية الصحية للأمهات والأطفال حديثي الولادة، مع التركيز على الولادة الآمنة والرعاية الشاملة للمرأة في مراحل الحمل والولادة والنفاس.',
      description_en: 'The Midwifery Techniques program is a specialized academic program aimed at preparing scientifically and practically qualified midwives to provide healthcare for mothers and newborns, focusing on safe delivery and comprehensive care for women during pregnancy, childbirth, and postpartum periods.',
      summary_ar: 'برنامج متخصص في تقنيات القبالة يؤهل الطالبات للعمل في المستشفيات، مراكز الولادة، والعيادات النسائية.',
      summary_en: 'A specialized program in midwifery techniques that qualifies students to work in hospitals, birthing centers, and gynecological clinics.',
      icon_name: 'Baby',
      icon_color: '#c2410c',
      background_color: '#fff7ed',
      featured_image: null,
      gallery: [],
      duration_years: 4,
      credit_hours: 138,
      degree_type: 'بكالوريوس',
      department_ar: 'قسم العلوم الطبية',
      department_en: 'Department of Medical Sciences',
      college_ar: 'كلية إيلول الجامعية',
      college_en: 'Eylul University College',
      admission_requirements_ar: 'الحصول على شهادة الثانوية العامة الفرع العلمي بمعدل لا يقل عن 70%، اجتياز امتحان القبول، الفحص الطبي الشامل، قبول الإناث فقط.',
      admission_requirements_en: 'Obtaining a scientific branch high school diploma with a minimum average of 70%, passing the entrance exam, comprehensive medical examination, females only.',
      career_opportunities_ar: 'قابلة مسجلة، قابلة استشارية، مشرفة قبالة، مدربة قبالة، أخصائية صحة الأم والطفل.',
      career_opportunities_en: 'Registered Midwife, Consultant Midwife, Midwifery Supervisor, Midwifery Instructor, Maternal and Child Health Specialist.',
      curriculum: [],
      contact_info: {
        phone: '+964 750 123 7890',
        email: 'midwifery@eylul.edu.iq',
        office: 'مبنى العلوم الطبية - الطابق الثاني'
      },
      seo_settings: {
        meta_title_ar: 'برنامج تقنيات القبالة - كلية إيلول الجامعية',
        meta_title_en: 'Midwifery Techniques Program - Eylul University College',
        meta_description_ar: 'ادرسي تقنيات القبالة في كلية إيلول الجامعية. برنامج متخصص معتمد يؤهلك للعمل في مجال صحة الأم والطفل.',
        meta_description_en: 'Study Midwifery Techniques at Eylul University College. A specialized accredited program that qualifies you to work in maternal and child health.',
        keywords_ar: ['القبالة', 'صحة الأم', 'الولادة', 'الحمل', 'صحة الطفل'],
        keywords_en: ['Midwifery', 'Maternal Health', 'Childbirth', 'Pregnancy', 'Child Health']
      },
      display_order: 5,
      is_active: true,
      is_featured: true,
      has_page: true,
      page_template: 'standard',
      metadata: {
        accreditation: 'معتمد من وزارة التعليم العالي والبحث العلمي ونقابة القابلات',
        established_year: '2019',
        program_language: 'العربية والإنجليزية',
        gender_restriction: 'إناث فقط'
      },
      
      // أعضاء هيئة التدريس
      faculty_members: [
        {
          id: 'mid-faculty-1',
          name_ar: 'د. نجلاء حسن البغدادي',
          name_en: 'Dr. Najla Hassan Al-Baghdadi',
          position_ar: 'رئيسة قسم تقنيات القبالة',
          position_en: 'Head of Midwifery Techniques Department',
          qualification_ar: 'دكتوراه في القبالة وصحة الأم',
          qualification_en: 'PhD in Midwifery and Maternal Health',
          specialization_ar: 'صحة الأم والطفل',
          specialization_en: 'Maternal and Child Health',
          university_ar: 'جامعة بغداد',
          university_en: 'University of Baghdad',
          email: 'n.baghdadi@eylul.edu.iq',
          phone: '+964 750 444 1122',
          profile_image: null,
          bio_ar: 'خبرة أكثر من 22 عاماً في مجال القبالة وصحة الأم، عملت في عدة مستشفيات متخصصة.',
          bio_en: 'Over 22 years of experience in midwifery and maternal health, worked in several specialized hospitals.',
          research_interests: ['صحة الأم والطفل', 'الولادة الطبيعية', 'رعاية ما بعد الولادة'],
          publications: ['تطوير ممارسات القبالة الحديثة', 'صحة الأم في العراق'],
          order: 1
        },
        {
          id: 'mid-faculty-2',
          name_ar: 'أ.م. إيمان محمد الحكيم',
          name_en: 'Asst. Prof. Eman Mohammed Al-Hakeem',
          position_ar: 'أستاذ مساعد - القبالة السريرية',
          position_en: 'Assistant Professor - Clinical Midwifery',
          qualification_ar: 'ماجستير في القبالة السريرية',
          qualification_en: 'MSc in Clinical Midwifery',
          specialization_ar: 'القبالة السريرية والولادة المعقدة',
          specialization_en: 'Clinical Midwifery and Complicated Delivery',
          university_ar: 'جامعة الكوفة',
          university_en: 'University of Kufa',
          email: 'e.hakeem@eylul.edu.iq',
          phone: '+964 750 444 2233',
          profile_image: null,
          bio_ar: 'متخصصة في القبالة السريرية مع خبرة 16 عاماً في أقسام الولادة.',
          bio_en: 'Specialist in clinical midwifery with 16 years of experience in delivery departments.',
          research_interests: ['القبالة السريرية', 'الولادة المعقدة', 'تدريب القابلات'],
          publications: ['إدارة مضاعفات الولادة', 'تطوير مهارات القبالة السريرية'],
          order: 2
        },
        {
          id: 'mid-faculty-3',
          name_ar: 'أ. زهراء علي الموسوي',
          name_en: 'Ms. Zahra Ali Al-Mousawi',
          position_ar: 'مدرس - أساسيات القبالة',
          position_en: 'Lecturer - Midwifery Fundamentals',
          qualification_ar: 'ماجستير في القبالة',
          qualification_en: 'MSc in Midwifery',
          specialization_ar: 'أساسيات القبالة والرعاية الأولية',
          specialization_en: 'Midwifery Fundamentals and Primary Care',
          university_ar: 'جامعة البصرة',
          university_en: 'University of Basrah',
          email: 'z.mousawi@eylul.edu.iq',
          phone: '+964 750 444 3344',
          profile_image: null,
          bio_ar: 'قابلة سريرية متخصصة مع خبرة 14 عاماً في التدريب العملي.',
          bio_en: 'Specialized clinical midwife with 14 years of experience in practical training.',
          research_interests: ['أساسيات القبالة', 'التدريب العملي', 'الرعاية الأولية'],
          publications: ['دليل المهارات الأساسية للقبالة', 'التدريب العملي في القبالة'],
          order: 3
        }
      ],

      // الخطة الدراسية
      yearly_curriculum: [
        {
          year_number: 1,
          year_name_ar: 'السنة الأولى',
          year_name_en: 'First Year',
          total_credit_hours: 35,
          subjects: [
            {
              id: 'mid-101',
              code: 'MID101',
              name_ar: 'أساسيات القبالة',
              name_en: 'Fundamentals of Midwifery',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'المبادئ الأساسية لمهنة القبالة',
              description_en: 'Basic principles of midwifery profession',
              order: 1
            },
            {
              id: 'mid-102',
              code: 'MID102',
              name_ar: 'التشريح النسائي',
              name_en: 'Female Anatomy',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'دراسة تشريح الجهاز التناسلي الأنثوي',
              description_en: 'Study of female reproductive system anatomy',
              order: 2
            },
            {
              id: 'mid-103',
              code: 'MID103',
              name_ar: 'علم وظائف الأعضاء للنساء',
              name_en: 'Female Physiology',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: [],
              description_ar: 'وظائف الجهاز التناسلي الأنثوي',
              description_en: 'Functions of the female reproductive system',
              order: 3
            },
            {
              id: 'mid-104',
              code: 'MID104',
              name_ar: 'علم الأجنة',
              name_en: 'Embryology',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'تطور الجنين من الإخصاب إلى الولادة',
              description_en: 'Fetal development from fertilization to birth',
              order: 4
            }
          ]
        },
        {
          year_number: 2,
          year_name_ar: 'السنة الثانية',
          year_name_en: 'Second Year',
          total_credit_hours: 37,
          subjects: [
            {
              id: 'mid-201',
              code: 'MID201',
              name_ar: 'رعاية الحمل',
              name_en: 'Prenatal Care',
              credit_hours: 5,
              theory_hours: 3,
              practical_hours: 4,
              prerequisites: ['MID101'],
              description_ar: 'رعاية المرأة الحامل طوال فترة الحمل',
              description_en: 'Care of pregnant women throughout pregnancy',
              order: 1
            },
            {
              id: 'mid-202',
              code: 'MID202',
              name_ar: 'علم الأدوية للقبالة',
              name_en: 'Pharmacology for Midwifery',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['MID103'],
              description_ar: 'الأدوية المستخدمة في القبالة',
              description_en: 'Medications used in midwifery',
              order: 2
            },
            {
              id: 'mid-203',
              code: 'MID203',
              name_ar: 'التغذية للحامل والمرضع',
              name_en: 'Nutrition for Pregnant and Lactating Women',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: ['MID101'],
              description_ar: 'التغذية الصحية أثناء الحمل والرضاعة',
              description_en: 'Healthy nutrition during pregnancy and lactation',
              order: 3
            },
            {
              id: 'mid-204',
              code: 'MID204',
              name_ar: 'علم الأمراض النسائية',
              name_en: 'Gynecological Pathology',
              credit_hours: 4,
              theory_hours: 4,
              practical_hours: 0,
              prerequisites: ['MID102'],
              description_ar: 'أمراض الجهاز التناسلي الأنثوي',
              description_en: 'Diseases of the female reproductive system',
              order: 4
            }
          ]
        },
        {
          year_number: 3,
          year_name_ar: 'السنة الثالثة',
          year_name_en: 'Third Year',
          total_credit_hours: 36,
          subjects: [
            {
              id: 'mid-301',
              code: 'MID301',
              name_ar: 'تقنيات الولادة الطبيعية',
              name_en: 'Natural Birth Techniques',
              credit_hours: 6,
              theory_hours: 3,
              practical_hours: 6,
              prerequisites: ['MID201'],
              description_ar: 'تقنيات إجراء الولادة الطبيعية الآمنة',
              description_en: 'Techniques for safe natural delivery',
              order: 1
            },
            {
              id: 'mid-302',
              code: 'MID302',
              name_ar: 'رعاية الأطفال حديثي الولادة',
              name_en: 'Newborn Care',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['MID104'],
              description_ar: 'رعاية الطفل منذ الولادة حتى الشهر الأول',
              description_en: 'Care of the child from birth to the first month',
              order: 2
            },
            {
              id: 'mid-303',
              code: 'MID303',
              name_ar: 'مضاعفات الحمل والولادة',
              name_en: 'Pregnancy and Birth Complications',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['MID201'],
              description_ar: 'التعامل مع مضاعفات الحمل والولادة',
              description_en: 'Dealing with pregnancy and birth complications',
              order: 3
            },
            {
              id: 'mid-304',
              code: 'MID304',
              name_ar: 'بحوث القبالة',
              name_en: 'Midwifery Research',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['MID202'],
              description_ar: 'مناهج البحث في القبالة',
              description_en: 'Research methods in midwifery',
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
              id: 'mid-401',
              code: 'MID401',
              name_ar: 'القبالة المتقدمة',
              name_en: 'Advanced Midwifery',
              credit_hours: 5,
              theory_hours: 3,
              practical_hours: 4,
              prerequisites: ['MID301'],
              description_ar: 'تقنيات القبالة المتقدمة والحالات المعقدة',
              description_en: 'Advanced midwifery techniques and complex cases',
              order: 1
            },
            {
              id: 'mid-402',
              code: 'MID402',
              name_ar: 'إدارة خدمات القبالة',
              name_en: 'Midwifery Services Management',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['MID304'],
              description_ar: 'إدارة أقسام القبالة والخدمات',
              description_en: 'Management of midwifery departments and services',
              order: 2
            },
            {
              id: 'mid-403',
              code: 'MID403',
              name_ar: 'التدريب السريري المتخصص',
              name_en: 'Specialized Clinical Training',
              credit_hours: 8,
              theory_hours: 2,
              practical_hours: 12,
              prerequisites: ['MID301', 'MID302'],
              description_ar: 'تدريب سريري متخصص في أقسام الولادة',
              description_en: 'Specialized clinical training in delivery departments',
              order: 3
            },
            {
              id: 'mid-404',
              code: 'MID404',
              name_ar: 'مشروع التخرج',
              name_en: 'Graduation Project',
              credit_hours: 4,
              theory_hours: 2,
              practical_hours: 4,
              prerequisites: ['MID402'],
              description_ar: 'مشروع بحثي في مجال القبالة',
              description_en: 'Research project in midwifery field',
              order: 4
            }
          ]
        }
      ],

      // شروط القبول الأكاديمية
      academic_requirements: [
        {
          id: 'mid-acad-1',
          type: 'academic',
          requirement_ar: 'الحصول على شهادة الثانوية العامة الفرع العلمي بمعدل لا يقل عن 70%',
          requirement_en: 'Obtaining a scientific branch high school diploma with a minimum average of 70%',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'mid-acad-2',
          type: 'academic',
          requirement_ar: 'اجتياز امتحان القبول في علوم الأحياء والكيمياء',
          requirement_en: 'Passing the entrance exam in biology and chemistry',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'mid-acad-3',
          type: 'academic',
          requirement_ar: 'القبول للإناث فقط',
          requirement_en: 'Admission for females only',
          is_mandatory: true,
          order: 3
        }
      ],

      // الشروط العامة
      general_requirements: [
        {
          id: 'mid-gen-1',
          type: 'general',
          requirement_ar: 'إجراء فحص طبي شامل والحصول على شهادة لياقة صحية',
          requirement_en: 'Comprehensive medical examination and obtaining a health fitness certificate',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'mid-gen-2',
          type: 'general',
          requirement_ar: 'تقديم شهادة عدم محكومية',
          requirement_en: 'Submitting a certificate of good conduct',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'mid-gen-3',
          type: 'general',
          requirement_ar: 'التوقيع على تعهد بالالتزام بأخلاقيات مهنة القبالة',
          requirement_en: 'Signing a commitment to midwifery ethics',
          is_mandatory: true,
          order: 3
        }
      ],

      // إحصائيات البرنامج
      program_statistics: [
        {
          label_ar: 'عدد الطالبات المسجلات',
          label_en: 'Enrolled Students',
          value: 156,
          icon: 'users',
          order: 1
        },
        {
          label_ar: 'عدد الخريجات',
          label_en: 'Graduates',
          value: 67,
          icon: 'graduation-cap',
          order: 2
        },
        {
          label_ar: 'معدل التوظيف',
          label_en: 'Employment Rate',
          value: '94%',
          icon: 'briefcase',
          order: 3
        },
        {
          label_ar: 'متوسط الراتب',
          label_en: 'Average Salary',
          value: '900,000 د.ع',
          icon: 'dollar-sign',
          order: 4
        }
      ],

      // الفرص المهنية
      career_opportunities_list: [
        {
          id: 'mid-career-1',
          title_ar: 'قابلة مسجلة',
          title_en: 'Registered Midwife',
          description_ar: 'تقديم خدمات القبالة في المستشفيات ومراكز الولادة',
          description_en: 'Providing midwifery services in hospitals and birthing centers',
          sector: 'المستشفيات',
          order: 1
        },
        {
          id: 'mid-career-2',
          title_ar: 'قابلة استشارية',
          title_en: 'Consultant Midwife',
          description_ar: 'تقديم الاستشارات المتخصصة في مجال القبالة',
          description_en: 'Providing specialized consultations in midwifery',
          sector: 'استشارات',
          order: 2
        },
        {
          id: 'mid-career-3',
          title_ar: 'مشرفة قبالة',
          title_en: 'Midwifery Supervisor',
          description_ar: 'إشراف وإدارة أقسام القبالة في المؤسسات الصحية',
          description_en: 'Supervising and managing midwifery departments in health institutions',
          sector: 'إدارة',
          order: 3
        },
        {
          id: 'mid-career-4',
          title_ar: 'أخصائية صحة الأم والطفل',
          title_en: 'Maternal and Child Health Specialist',
          description_ar: 'العمل في برامج صحة الأم والطفل',
          description_en: 'Working in maternal and child health programs',
          sector: 'صحة عامة',
          order: 4
        },
        {
          id: 'mid-career-5',
          title_ar: 'مدربة قبالة',
          title_en: 'Midwifery Instructor',
          description_ar: 'تدريب وتعليم القابلات الجدد',
          description_en: 'Training and educating new midwives',
          sector: 'تعليم',
          order: 5
        }
      ],

      program_overview_ar: 'برنامج تقنيات القبالة في كلية إيلول الجامعية هو برنامج أكاديمي متخصص ومعتمد يهدف إلى إعداد قابلات مؤهلات للعمل في مجال صحة الأم والطفل. يتميز البرنامج بالتركيز على الجوانب النظرية والعملية لمهنة القبالة، مما يضمن تخريج كوادر قادرة على تقديم أفضل مستويات الرعاية للأمهات والأطفال حديثي الولادة.',
      program_overview_en: 'The Midwifery Techniques program at Eylul University College is a specialized and accredited academic program aimed at preparing qualified midwives to work in the field of maternal and child health. The program is characterized by focusing on the theoretical and practical aspects of the midwifery profession, ensuring the graduation of personnel capable of providing the best levels of care for mothers and newborns.',
      student_count: 156
    };

    const { data, error } = await supabase
      .from('dynamic_academic_programs')
      .insert(midwiferyProgramData as any)
      .select()
      .single();

    if (error) {
      console.error('خطأ في إدراج بيانات القبالة:', error);
      throw error;
    }

    console.log('تم إدراج بيانات القبالة بنجاح');
    return data;
  } catch (error) {
    console.error('خطأ في seedMidwiferyData:', error);
    throw error;
  }
};