import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DepartmentData {
  department_key: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon_name: string;
  icon_color: string;
  background_color: string;
  head_of_department_ar?: string;
  head_of_department_en?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  metadata?: any;
}

const departmentsData: DepartmentData[] = [
  {
    department_key: 'tech_science',
    name_ar: 'قسم العلوم التقنية والحاسوب',
    name_en: 'Technical & Computer Sciences Department',
    description_ar: 'يضم القسم برامج متخصصة في علوم الحاسوب والتكنولوجيا المتقدمة لإعداد كوادر تقنية مؤهلة لسوق العمل.',
    description_en: 'The department includes specialized programs in computer science and advanced technology to prepare qualified technical cadres for the labor market.',
    icon_name: 'Laptop',
    icon_color: '#3B82F6',
    background_color: '#EFF6FF',
    head_of_department_ar: 'د. أحمد محمد الشيباني',
    head_of_department_en: 'Dr. Ahmed Mohammed Al-Shaibani',
    contact_email: 'tech@eylul.edu.ye',
    contact_phone: '+967 1 234 567',
    website_url: 'https://eylul.edu.ye/departments/tech-science',
    display_order: 1,
    is_active: true,
    metadata: {
      programs: ['تكنولوجيا المعلومات'],
      features: [
        'برامج معتمدة دولياً',
        'مختبرات حديثة ومجهزة',
        'هيئة تدريسية متخصصة',
        'تدريب عملي متقدم'
      ],
      programsCount: 1,
      href: '/departments/tech-science',
      vision_ar: 'أن نكون قسماً رائداً في مجال العلوم التقنية والحاسوب على المستوى المحلي والإقليمي، ونساهم في تطوير المجتمع من خلال تقديم تعليم متميز وبحث علمي مبتكر.',
      vision_en: 'To be a leading department in technical and computer sciences at the local and regional levels, contributing to community development through excellent education and innovative research.',
      mission_ar: 'تقديم برامج أكاديمية متميزة في مجال التقنية والحاسوب، وإعداد خريجين مؤهلين قادرين على المنافسة في سوق العمل، والمساهمة في البحث العلمي والتطوير التقني.',
      mission_en: 'To provide distinguished academic programs in technology and computer science, prepare qualified graduates capable of competing in the job market, and contribute to scientific research and technical development.',
      objectives: [
        {
          id: '1',
          text_ar: 'إعداد كوادر تقنية مؤهلة في مجال علوم الحاسوب وتكنولوجيا المعلومات',
          text_en: 'Prepare qualified technical cadres in computer science and information technology'
        },
        {
          id: '2',
          text_ar: 'تطوير مهارات الطلاب في البرمجة وتطوير البرمجيات',
          text_en: 'Develop students\' skills in programming and software development'
        },
        {
          id: '3',
          text_ar: 'تعزيز البحث العلمي والابتكار في المجالات التقنية',
          text_en: 'Enhance scientific research and innovation in technical fields'
        },
        {
          id: '4',
          text_ar: 'بناء شراكات مع القطاع الخاص والمؤسسات التقنية',
          text_en: 'Build partnerships with the private sector and technical institutions'
        }
      ],
      statistics: [
        {
          id: '1',
          label_ar: 'عدد الطلاب',
          label_en: 'Number of Students',
          value: '250+',
          icon: 'Users'
        },
        {
          id: '2',
          label_ar: 'أعضاء هيئة التدريس',
          label_en: 'Faculty Members',
          value: '15',
          icon: 'GraduationCap'
        },
        {
          id: '3',
          label_ar: 'المختبرات',
          label_en: 'Laboratories',
          value: '8',
          icon: 'Monitor'
        },
        {
          id: '4',
          label_ar: 'معدل التوظيف',
          label_en: 'Employment Rate',
          value: '85%',
          icon: 'TrendingUp'
        }
      ]
    }
  },
  {
    department_key: 'admin_humanities',
    name_ar: 'قسم العلوم الإدارية والإنسانية',
    name_en: 'Administrative & Humanities Department',
    description_ar: 'يقدم القسم برامج في الإدارة والأعمال والعلوم الإنسانية لإعداد قادة المستقبل في مختلف المجالات.',
    description_en: 'The department offers programs in management, business, and humanities to prepare future leaders in various fields.',
    icon_name: 'Briefcase',
    icon_color: '#F59E0B',
    background_color: '#FEF3C7',
    head_of_department_ar: 'د. فاطمة عبدالله الحداد',
    head_of_department_en: 'Dr. Fatima Abdullah Al-Haddad',
    contact_email: 'admin@eylul.edu.ye',
    contact_phone: '+967 1 234 568',
    website_url: 'https://eylul.edu.ye/departments/admin-humanities',
    display_order: 2,
    is_active: true,
    metadata: {
      programs: ['إدارة الأعمال'],
      features: [
        'منهج شامل ومتطور',
        'تطبيق عملي للنظريات',
        'ربط مع سوق العمل',
        'تطوير المهارات القيادية'
      ],
      programsCount: 1,
      href: '/departments/admin-humanities',
      vision_ar: 'أن نكون قسماً متميزاً في مجال العلوم الإدارية والإنسانية، نساهم في إعداد قادة المستقبل وتطوير المجتمع من خلال التعليم المتميز والبحث العلمي.',
      vision_en: 'To be a distinguished department in administrative and human sciences, contributing to preparing future leaders and developing society through excellent education and scientific research.',
      mission_ar: 'تقديم برامج أكاديمية متميزة في مجالات الإدارة والأعمال، وتزويد الطلاب بالمعارف والمهارات اللازمة للنجاح في بيئة العمل المتغيرة.',
      mission_en: 'To provide distinguished academic programs in management and business, equipping students with the knowledge and skills necessary for success in a changing work environment.',
      objectives: [
        {
          id: '1',
          text_ar: 'إعداد كوادر إدارية مؤهلة قادرة على قيادة المؤسسات',
          text_en: 'Prepare qualified administrative cadres capable of leading institutions'
        },
        {
          id: '2',
          text_ar: 'تطوير مهارات التفكير النقدي واتخاذ القرارات',
          text_en: 'Develop critical thinking and decision-making skills'
        },
        {
          id: '3',
          text_ar: 'تعزيز الربط بين النظرية والتطبيق العملي',
          text_en: 'Strengthen the link between theory and practical application'
        },
        {
          id: '4',
          text_ar: 'بناء شراكات استراتيجية مع المؤسسات المحلية والإقليمية',
          text_en: 'Build strategic partnerships with local and regional institutions'
        }
      ],
      statistics: [
        {
          id: '1',
          label_ar: 'عدد الطلاب',
          label_en: 'Number of Students',
          value: '180+',
          icon: 'Users'
        },
        {
          id: '2',
          label_ar: 'أعضاء هيئة التدريس',
          label_en: 'Faculty Members',
          value: '12',
          icon: 'GraduationCap'
        },
        {
          id: '3',
          label_ar: 'الشراكات',
          label_en: 'Partnerships',
          value: '25+',
          icon: 'Briefcase'
        },
        {
          id: '4',
          label_ar: 'معدل النجاح',
          label_en: 'Success Rate',
          value: '92%',
          icon: 'Award'
        }
      ]
    }
  },
  {
    department_key: 'medical',
    name_ar: 'قسم العلوم الطبية',
    name_en: 'Medical Sciences Department',
    description_ar: 'يضم القسم برامج طبية متخصصة في الرعاية الصحية لإعداد كوادر صحية مؤهلة لخدمة المجتمع.',
    description_en: 'The department includes specialized medical programs in healthcare to prepare qualified health cadres to serve the community.',
    icon_name: 'Heart',
    icon_color: '#EF4444',
    background_color: '#FEE2E2',
    head_of_department_ar: 'د. خالد يحيى المقطري',
    head_of_department_en: 'Dr. Khaled Yahya Al-Maqtari',
    contact_email: 'medical@eylul.edu.ye',
    contact_phone: '+967 1 234 569',
    website_url: 'https://eylul.edu.ye/departments/medical',
    display_order: 3,
    is_active: true,
    metadata: {
      programs: ['التمريض', 'الصيدلة', 'القبالة'],
      features: [
        'برامج طبية معتمدة',
        'تدريب سريري متقدم',
        'مستشفيات تدريبية',
        'كوادر طبية متخصصة'
      ],
      programsCount: 3,
      href: '/departments/medical',
      vision_ar: 'أن نكون قسماً رائداً في العلوم الطبية والصحية، نساهم في تحسين مستوى الرعاية الصحية في المجتمع من خلال التعليم والتدريب المتميز.',
      vision_en: 'To be a leading department in medical and health sciences, contributing to improving the level of healthcare in society through distinguished education and training.',
      mission_ar: 'إعداد كوادر طبية وصحية مؤهلة ومتخصصة، قادرة على تقديم خدمات صحية متميزة، والمساهمة في البحث العلمي والتطوير المستمر في المجال الصحي.',
      mission_en: 'To prepare qualified and specialized medical and health cadres capable of providing distinguished health services and contributing to scientific research and continuous development in the health field.',
      objectives: [
        {
          id: '1',
          text_ar: 'إعداد كوادر صحية متخصصة في مجالات التمريض والصيدلة والقبالة',
          text_en: 'Prepare specialized health cadres in nursing, pharmacy, and midwifery'
        },
        {
          id: '2',
          text_ar: 'توفير تدريب سريري متقدم في مستشفيات معتمدة',
          text_en: 'Provide advanced clinical training in accredited hospitals'
        },
        {
          id: '3',
          text_ar: 'تعزيز البحث العلمي في المجالات الطبية والصحية',
          text_en: 'Promote scientific research in medical and health fields'
        },
        {
          id: '4',
          text_ar: 'المساهمة في تطوير الخدمات الصحية في المجتمع',
          text_en: 'Contribute to developing health services in the community'
        }
      ],
      statistics: [
        {
          id: '1',
          label_ar: 'عدد الطلاب',
          label_en: 'Number of Students',
          value: '420+',
          icon: 'Users'
        },
        {
          id: '2',
          label_ar: 'أعضاء هيئة التدريس',
          label_en: 'Faculty Members',
          value: '28',
          icon: 'GraduationCap'
        },
        {
          id: '3',
          label_ar: 'المستشفيات التدريبية',
          label_en: 'Training Hospitals',
          value: '12',
          icon: 'Heart'
        },
        {
          id: '4',
          label_ar: 'معدل النجاح السريري',
          label_en: 'Clinical Success Rate',
          value: '95%',
          icon: 'Award'
        }
      ]
    }
  }
];

export const seedAcademicDepartments = async () => {
  try {
    console.log('بدء رفع بيانات الأقسام الأكاديمية...');
    
    // التحقق من وجود الأقسام أولاً
    const { data: existingDepartments } = await supabase
      .from('academic_departments')
      .select('department_key, id');
    
    const existingKeys = new Set(existingDepartments?.map(d => d.department_key) || []);
    
    // رفع الأقسام الجديدة فقط
    const newDepartments = departmentsData.filter(d => !existingKeys.has(d.department_key));
    
    if (newDepartments.length === 0) {
      console.log('جميع الأقسام موجودة مسبقاً - التحقق من تحديث البيانات...');
      
      // تحديث البيانات الموجودة بالبيانات الكاملة
      for (const dept of departmentsData) {
        const existing = existingDepartments?.find(d => d.department_key === dept.department_key);
        if (existing) {
          const { error: updateError } = await supabase
            .from('academic_departments')
            .update(dept)
            .eq('id', existing.id);
          
          if (updateError) {
            console.error(`خطأ في تحديث القسم ${dept.department_key}:`, updateError);
          }
        }
      }
      
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث بيانات الأقسام الأكاديمية بنجاح",
      });
      return { success: true, inserted: 0, existing: departmentsData.length, updated: departmentsData.length };
    }
    
    // إدراج الأقسام الجديدة
    const { data, error } = await supabase
      .from('academic_departments')
      .insert(newDepartments)
      .select();
    
    if (error) {
      console.error('خطأ في رفع بيانات الأقسام:', error);
      toast({
        title: "خطأ في رفع البيانات",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    console.log(`تم رفع ${newDepartments.length} قسم أكاديمي بنجاح`);
    toast({
      title: "تم رفع البيانات بنجاح",
      description: `تم إضافة ${newDepartments.length} قسم أكاديمي إلى قاعدة البيانات`,
    });
    
    return { 
      success: true, 
      inserted: newDepartments.length, 
      existing: existingKeys.size,
      data 
    };
  } catch (error) {
    console.error('خطأ في عملية رفع البيانات:', error);
    toast({
      title: "خطأ في العملية",
      description: "حدث خطأ أثناء رفع بيانات الأقسام الأكاديمية",
      variant: "destructive"
    });
    throw error;
  }
};
