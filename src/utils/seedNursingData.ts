import { supabase } from '@/integrations/supabase/client';
import type { DynamicAcademicProgram } from '@/hooks/useDynamicPrograms';

export const seedNursingData = async () => {
  try {
    // التحقق من وجود بيانات التمريض
    const { data: existingData } = await supabase
      .from('dynamic_academic_programs')
      .select('id')
      .eq('program_key', 'nursing')
      .maybeSingle();

    if (existingData) {
      console.log('بيانات التمريض موجودة بالفعل');
      return existingData;
    }

    const nursingProgramData: Omit<DynamicAcademicProgram, 'id' | 'created_at' | 'updated_at' | 'published_at'> = {
      program_key: 'nursing',
      title_ar: 'التمريض',
      title_en: 'Nursing',
      description_ar: 'برنامج التمريض هو برنامج أكاديمي متخصص يهدف إلى إعداد ممرضين وممرضات مؤهلين علمياً وعملياً لتقديم الرعاية الصحية الشاملة والمتميزة في مختلف المرافق الصحية، مع التركيز على الجوانب الإنسانية والأخلاقية في المهنة.',
      description_en: 'The Nursing program is a specialized academic program aimed at preparing scientifically and practically qualified nurses to provide comprehensive and excellent healthcare in various health facilities, with a focus on the humanitarian and ethical aspects of the profession.',
      summary_ar: 'برنامج متخصص في التمريض يؤهل الطلاب للعمل في المستشفيات، العيادات، ومراكز الرعاية الصحية.',
      summary_en: 'A specialized nursing program that qualifies students to work in hospitals, clinics, and healthcare centers.',
      icon_name: 'Heart',
      icon_color: '#dc2626',
      background_color: '#fef2f2',
      featured_image: null,
      gallery: [],
      duration_years: 4,
      credit_hours: 140,
      degree_type: 'بكالوريوس',
      department_ar: 'قسم العلوم الطبية',
      department_en: 'Department of Medical Sciences',
      college_ar: 'كلية إيلول الجامعية',
      college_en: 'Eylul University College',
      admission_requirements_ar: 'الحصول على شهادة الثانوية العامة الفرع العلمي بمعدل لا يقل عن 70%، اجتياز امتحان القبول، الفحص الطبي الشامل.',
      admission_requirements_en: 'Obtaining a scientific branch high school diploma with a minimum average of 70%, passing the entrance exam, comprehensive medical examination.',
      career_opportunities_ar: 'ممرض/ة مسجل/ة، ممرض/ة العناية المركزة، ممرض/ة طوارئ، ممرض/ة أطفال، مشرف/ة تمريض، مدرب/ة تمريض.',
      career_opportunities_en: 'Registered Nurse, ICU Nurse, Emergency Nurse, Pediatric Nurse, Nursing Supervisor, Nursing Instructor.',
      curriculum: [],
      contact_info: {
        phone: '+964 750 123 6789',
        email: 'nursing@eylul.edu.iq',
        office: 'مبنى العلوم الطبية - الطابق الثالث'
      },
      seo_settings: {
        meta_title_ar: 'برنامج التمريض - كلية إيلول الجامعية',
        meta_title_en: 'Nursing Program - Eylul University College',
        meta_description_ar: 'ادرس التمريض في كلية إيلول الجامعية. برنامج متخصص معتمد يؤهلك للعمل في المجال الصحي والطبي.',
        meta_description_en: 'Study Nursing at Eylul University College. A specialized accredited program that qualifies you to work in the health and medical field.',
        keywords_ar: ['التمريض', 'الرعاية الصحية', 'الطب', 'المستشفيات', 'العناية الطبية'],
        keywords_en: ['Nursing', 'Healthcare', 'Medicine', 'Hospitals', 'Medical Care']
      },
      display_order: 3,
      is_active: true,
      is_featured: true,
      has_page: true,
      page_template: 'standard',
      metadata: {
        accreditation: 'معتمد من وزارة التعليم العالي والبحث العلمي ونقابة التمريض',
        established_year: '2018',
        program_language: 'العربية والإنجليزية'
      },
      
      // أعضاء هيئة التدريس
      faculty_members: [
        {
          id: 'nurs-faculty-1',
          name_ar: 'د. مريم أحمد السامرائي',
          name_en: 'Dr. Maryam Ahmed Al-Samarrai',
          position_ar: 'رئيسة قسم التمريض',
          position_en: 'Head of Nursing Department',
          qualification_ar: 'دكتوراه في التمريض',
          qualification_en: 'PhD in Nursing',
          specialization_ar: 'تمريض العناية المركزة',
          specialization_en: 'Critical Care Nursing',
          university_ar: 'جامعة بغداد',
          university_en: 'University of Baghdad',
          email: 'm.samarrai@eylul.edu.iq',
          phone: '+964 750 333 1122',
          profile_image: null,
          bio_ar: 'خبرة أكثر من 20 عاماً في التمريض والتدريس، عملت في عدة مستشفيات متخصصة.',
          bio_en: 'Over 20 years of experience in nursing and teaching, worked in several specialized hospitals.',
          research_interests: ['تمريض العناية المركزة', 'إدارة التمريض', 'جودة الرعاية الصحية'],
          publications: ['معايير جودة التمريض', 'تطوير مهارات التمريض المتقدمة'],
          order: 1
        },
        {
          id: 'nurs-faculty-2',
          name_ar: 'أ.م. سارة عبد الله الكربلائي',
          name_en: 'Asst. Prof. Sarah Abdullah Al-Karbalaei',
          position_ar: 'أستاذ مساعد - تمريض الأطفال',
          position_en: 'Assistant Professor - Pediatric Nursing',
          qualification_ar: 'ماجستير في تمريض الأطفال',
          qualification_en: 'MSc in Pediatric Nursing',
          specialization_ar: 'تمريض الأطفال والخدج',
          specialization_en: 'Pediatric and Neonatal Nursing',
          university_ar: 'جامعة الكوفة',
          university_en: 'University of Kufa',
          email: 's.karbalaei@eylul.edu.iq',
          phone: '+964 750 333 2233',
          profile_image: null,
          bio_ar: 'متخصصة في تمريض الأطفال مع خبرة 15 عاماً في وحدات العناية المركزة للأطفال.',
          bio_en: 'Specialist in pediatric nursing with 15 years of experience in pediatric intensive care units.',
          research_interests: ['تمريض الأطفال', 'العناية بالخدج', 'صحة الطفل'],
          publications: ['رعاية الأطفال في المستشفيات', 'تطوير مهارات تمريض الأطفال'],
          order: 2
        },
        {
          id: 'nurs-faculty-3',
          name_ar: 'أ. فاطمة علي النجفي',
          name_en: 'Ms. Fatima Ali Al-Najafi',
          position_ar: 'مدرس - التمريض الأساسي',
          position_en: 'Lecturer - Fundamental Nursing',
          qualification_ar: 'ماجستير في التمريض',
          qualification_en: 'MSc in Nursing',
          specialization_ar: 'أساسيات التمريض والمهارات السريرية',
          specialization_en: 'Nursing Fundamentals and Clinical Skills',
          university_ar: 'جامعة الكوفة',
          university_en: 'University of Kufa',
          email: 'f.najafi@eylul.edu.iq',
          phone: '+964 750 333 3344',
          profile_image: null,
          bio_ar: 'ممرضة سريرية متخصصة مع خبرة 18 عاماً في التدريب السريري.',
          bio_en: 'Specialized clinical nurse with 18 years of experience in clinical training.',
          research_interests: ['أساسيات التمريض', 'التدريب السريري', 'المهارات العملية'],
          publications: ['دليل المهارات السريرية للتمريض', 'التدريب العملي في التمريض'],
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
              id: 'nurs-101',
              code: 'NURS101',
              name_ar: 'أساسيات التمريض',
              name_en: 'Fundamentals of Nursing',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'المبادئ الأساسية لمهنة التمريض',
              description_en: 'Basic principles of nursing profession',
              order: 1
            },
            {
              id: 'nurs-102',
              code: 'NURS102',
              name_ar: 'التشريح وعلم وظائف الأعضاء 1',
              name_en: 'Anatomy and Physiology I',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'دراسة تركيب ووظائف أجهزة الجسم',
              description_en: 'Study of body systems structure and functions',
              order: 2
            },
            {
              id: 'nurs-103',
              code: 'NURS103',
              name_ar: 'الكيمياء الحيوية',
              name_en: 'Biochemistry',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'العمليات الكيميائية في الجسم',
              description_en: 'Chemical processes in the body',
              order: 3
            },
            {
              id: 'nurs-104',
              code: 'NURS104',
              name_ar: 'علم الأحياء الدقيقة',
              name_en: 'Microbiology',
              credit_hours: 3,
              theory_hours: 2,
              practical_hours: 2,
              prerequisites: [],
              description_ar: 'دراسة الكائنات الدقيقة ومكافحة العدوى',
              description_en: 'Study of microorganisms and infection control',
              order: 4
            }
          ]
        },
        {
          year_number: 2,
          year_name_ar: 'السنة الثانية',
          year_name_en: 'Second Year',
          total_credit_hours: 38,
          subjects: [
            {
              id: 'nurs-201',
              code: 'NURS201',
              name_ar: 'تمريض البالغين 1',
              name_en: 'Adult Nursing I',
              credit_hours: 5,
              theory_hours: 3,
              practical_hours: 4,
              prerequisites: ['NURS101'],
              description_ar: 'رعاية المرضى البالغين في الحالات الطبية',
              description_en: 'Care of adult patients in medical conditions',
              order: 1
            },
            {
              id: 'nurs-202',
              code: 'NURS202',
              name_ar: 'علم الأدوية للتمريض',
              name_en: 'Pharmacology for Nursing',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['NURS102'],
              description_ar: 'الأدوية وتأثيرها ودور الممرضة',
              description_en: 'Medications, their effects, and nurse\'s role',
              order: 2
            },
            {
              id: 'nurs-203',
              code: 'NURS203',
              name_ar: 'علم الأمراض',
              name_en: 'Pathophysiology',
              credit_hours: 4,
              theory_hours: 4,
              practical_hours: 0,
              prerequisites: ['NURS102'],
              description_ar: 'دراسة الأمراض وتأثيرها على الجسم',
              description_en: 'Study of diseases and their effects on the body',
              order: 3
            },
            {
              id: 'nurs-204',
              code: 'NURS204',
              name_ar: 'التقييم الصحي',
              name_en: 'Health Assessment',
              credit_hours: 4,
              theory_hours: 2,
              practical_hours: 4,
              prerequisites: ['NURS101'],
              description_ar: 'تقييم الحالة الصحية للمرضى',
              description_en: 'Assessment of patients\' health condition',
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
              id: 'nurs-301',
              code: 'NURS301',
              name_ar: 'تمريض البالغين 2',
              name_en: 'Adult Nursing II',
              credit_hours: 5,
              theory_hours: 3,
              practical_hours: 4,
              prerequisites: ['NURS201'],
              description_ar: 'رعاية المرضى البالغين في الحالات الجراحية',
              description_en: 'Care of adult patients in surgical conditions',
              order: 1
            },
            {
              id: 'nurs-302',
              code: 'NURS302',
              name_ar: 'تمريض الأطفال',
              name_en: 'Pediatric Nursing',
              credit_hours: 5,
              theory_hours: 3,
              practical_hours: 4,
              prerequisites: ['NURS201'],
              description_ar: 'رعاية الأطفال والمراهقين',
              description_en: 'Care of children and adolescents',
              order: 2
            },
            {
              id: 'nurs-303',
              code: 'NURS303',
              name_ar: 'تمريض الصحة النفسية',
              name_en: 'Mental Health Nursing',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['NURS201'],
              description_ar: 'رعاية المرضى النفسيين',
              description_en: 'Care of psychiatric patients',
              order: 3
            },
            {
              id: 'nurs-304',
              code: 'NURS304',
              name_ar: 'بحوث التمريض',
              name_en: 'Nursing Research',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['NURS202'],
              description_ar: 'مناهج البحث في التمريض',
              description_en: 'Research methods in nursing',
              order: 4
            }
          ]
        },
        {
          year_number: 4,
          year_name_ar: 'السنة الرابعة',
          year_name_en: 'Fourth Year',
          total_credit_hours: 31,
          subjects: [
            {
              id: 'nurs-401',
              code: 'NURS401',
              name_ar: 'تمريض العناية المركزة',
              name_en: 'Critical Care Nursing',
              credit_hours: 4,
              theory_hours: 3,
              practical_hours: 2,
              prerequisites: ['NURS301'],
              description_ar: 'رعاية المرضى في حالة حرجة',
              description_en: 'Care of critically ill patients',
              order: 1
            },
            {
              id: 'nurs-402',
              code: 'NURS402',
              name_ar: 'إدارة التمريض',
              name_en: 'Nursing Management',
              credit_hours: 3,
              theory_hours: 3,
              practical_hours: 0,
              prerequisites: ['NURS304'],
              description_ar: 'إدارة أقسام التمريض والموارد',
              description_en: 'Management of nursing departments and resources',
              order: 2
            },
            {
              id: 'nurs-403',
              code: 'NURS403',
              name_ar: 'التدريب السريري المتقدم',
              name_en: 'Advanced Clinical Training',
              credit_hours: 8,
              theory_hours: 2,
              practical_hours: 12,
              prerequisites: ['NURS301', 'NURS302'],
              description_ar: 'تدريب سريري شامل في المستشفيات',
              description_en: 'Comprehensive clinical training in hospitals',
              order: 3
            },
            {
              id: 'nurs-404',
              code: 'NURS404',
              name_ar: 'مشروع التخرج',
              name_en: 'Graduation Project',
              credit_hours: 4,
              theory_hours: 2,
              practical_hours: 4,
              prerequisites: ['NURS402'],
              description_ar: 'مشروع بحثي في التمريض',
              description_en: 'Research project in nursing',
              order: 4
            }
          ]
        }
      ],

      // شروط القبول الأكاديمية
      academic_requirements: [
        {
          id: 'nurs-acad-1',
          type: 'academic',
          requirement_ar: 'الحصول على شهادة الثانوية العامة الفرع العلمي بمعدل لا يقل عن 70%',
          requirement_en: 'Obtaining a scientific branch high school diploma with a minimum average of 70%',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'nurs-acad-2',
          type: 'academic',
          requirement_ar: 'اجتياز امتحان القبول في علوم الأحياء والكيمياء',
          requirement_en: 'Passing the entrance exam in biology and chemistry',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'nurs-acad-3',
          type: 'academic',
          requirement_ar: 'إجادة اللغة الإنجليزية الطبية (مستوى متوسط على الأقل)',
          requirement_en: 'Proficiency in medical English (at least intermediate level)',
          is_mandatory: true,
          order: 3
        }
      ],

      // الشروط العامة
      general_requirements: [
        {
          id: 'nurs-gen-1',
          type: 'general',
          requirement_ar: 'إجراء فحص طبي شامل والحصول على شهادة لياقة صحية',
          requirement_en: 'Comprehensive medical examination and obtaining a health fitness certificate',
          is_mandatory: true,
          order: 1
        },
        {
          id: 'nurs-gen-2',
          type: 'general',
          requirement_ar: 'تقديم شهادة عدم محكومية',
          requirement_en: 'Submitting a certificate of good conduct',
          is_mandatory: true,
          order: 2
        },
        {
          id: 'nurs-gen-3',
          type: 'general',
          requirement_ar: 'التوقيع على تعهد بالالتزام بأخلاقيات مهنة التمريض',
          requirement_en: 'Signing a commitment to nursing ethics',
          is_mandatory: true,
          order: 3
        }
      ],

      // إحصائيات البرنامج
      program_statistics: [
        {
          label_ar: 'عدد الطلاب المسجلين',
          label_en: 'Enrolled Students',
          value: 189,
          icon: 'users',
          order: 1
        },
        {
          label_ar: 'عدد الخريجين',
          label_en: 'Graduates',
          value: 78,
          icon: 'graduation-cap',
          order: 2
        },
        {
          label_ar: 'معدل التوظيف',
          label_en: 'Employment Rate',
          value: '96%',
          icon: 'briefcase',
          order: 3
        },
        {
          label_ar: 'متوسط الراتب',
          label_en: 'Average Salary',
          value: '950,000 د.ع',
          icon: 'dollar-sign',
          order: 4
        }
      ],

      // الفرص المهنية
      career_opportunities_list: [
        {
          id: 'nurs-career-1',
          title_ar: 'ممرض/ة مسجل/ة',
          title_en: 'Registered Nurse',
          description_ar: 'تقديم الرعاية التمريضية الشاملة في المستشفيات والعيادات',
          description_en: 'Providing comprehensive nursing care in hospitals and clinics',
          sector: 'المستشفيات',
          order: 1
        },
        {
          id: 'nurs-career-2',
          title_ar: 'ممرض/ة العناية المركزة',
          title_en: 'ICU Nurse',
          description_ar: 'رعاية المرضى في حالة حرجة في وحدات العناية المركزة',
          description_en: 'Caring for critically ill patients in intensive care units',
          sector: 'العناية المركزة',
          order: 2
        },
        {
          id: 'nurs-career-3',
          title_ar: 'ممرض/ة طوارئ',
          title_en: 'Emergency Nurse',
          description_ar: 'تقديم الرعاية الفورية في أقسام الطوارئ',
          description_en: 'Providing immediate care in emergency departments',
          sector: 'الطوارئ',
          order: 3
        },
        {
          id: 'nurs-career-4',
          title_ar: 'ممرض/ة أطفال',
          title_en: 'Pediatric Nurse',
          description_ar: 'رعاية الأطفال والرضع في المستشفيات المتخصصة',
          description_en: 'Caring for children and infants in specialized hospitals',
          sector: 'طب الأطفال',
          order: 4
        },
        {
          id: 'nurs-career-5',
          title_ar: 'مشرف/ة تمريض',
          title_en: 'Nursing Supervisor',
          description_ar: 'إشراف وإدارة فرق التمريض في المؤسسات الصحية',
          description_en: 'Supervising and managing nursing teams in health institutions',
          sector: 'إدارة',
          order: 5
        }
      ],

      program_overview_ar: 'برنامج التمريض في كلية إيلول الجامعية هو برنامج أكاديمي متخصص ومعتمد يهدف إلى إعداد ممرضين وممرضات مؤهلين للعمل في مختلف المؤسسات الصحية. يتميز البرنامج بالتوازن بين التعليم النظري والتدريب العملي المكثف، مما يضمن تخريج كوادر تمريضية قادرة على تقديم أفضل مستويات الرعاية الصحية.',
      program_overview_en: 'The Nursing program at Eylul University College is a specialized and accredited academic program aimed at preparing qualified nurses to work in various health institutions. The program is characterized by a balance between theoretical education and intensive practical training, ensuring the graduation of nursing personnel capable of providing the best levels of healthcare.',
      student_count: 189
    };

    const { data, error } = await supabase
      .from('dynamic_academic_programs')
      .insert(nursingProgramData as any)
      .select()
      .single();

    if (error) {
      console.error('خطأ في إدراج بيانات التمريض:', error);
      throw error;
    }

    console.log('تم إدراج بيانات التمريض بنجاح');
    return data;
  } catch (error) {
    console.error('خطأ في seedNursingData:', error);
    throw error;
  }
};