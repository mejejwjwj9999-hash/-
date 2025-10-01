import React from 'react';
import { Monitor, Users, Clock, BookOpen, Code, Award, ChevronLeft, Home, GraduationCap, CheckCircle } from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const InformationTechnology = () => {
  const curriculum = [
    { year: 'السنة الأولى', subjects: ['أساسيات الحاسوب', 'الرياضيات المتقطعة', 'مبادئ البرمجة', 'الفيزياء العامة', 'اللغة الإنجليزية'] },
    { year: 'السنة الثانية', subjects: ['هياكل البيانات', 'قواعد البيانات', 'البرمجة الكائنية', 'الشبكات الأساسية'] },
    { year: 'السنة الثالثة', subjects: ['تطوير الويب', 'أمن المعلومات', 'نظم التشغيل', 'هندسة البرمجيات'] },
    { year: 'السنة الرابعة', subjects: ['الذكاء الاصطناعي', 'تطوير التطبيقات المحمولة', 'مشروع التخرج', 'التدريب الميداني'] }
  ];

  const faculty = [
    { name: 'د. ياسر عبدالله المقطري', title: 'رئيس القسم - أستاذ علوم الحاسوب', degree: 'دكتوراه في علوم الحاسوب - جامعة القاهرة' },
    { name: 'د. منى محمد الشرعبي', title: 'أستاذ مساعد هندسة البرمجيات', degree: 'دكتوراه في هندسة البرمجيات - الجامعة الأردنية' },
    { name: 'د. عبدالرحمن أحمد الحوثي', title: 'أستاذ مشارك أمن المعلومات', degree: 'دكتوراه في أمن المعلومات - جامعة الإسكندرية' },
    { name: 'د. هدى صالح المحطوري', title: 'أستاذ مساعد الذكاء الاصطناعي', degree: 'دكتوراه في الذكاء الاصطناعي - جامعة دمشق' }
  ];

  const careers = [
    'مطور برمجيات ومبرمج',
    'مختص أمن المعلومات السيبراني',
    'مدير قواعد البيانات',
    'مطور مواقع الويب والتطبيقات',
    'محلل أنظمة ومستشار تقني',
    'ريادي أعمال في التكنولوجيا'
  ];

  const graduateSpecs = [
    'قاعدة معرفية متينة في الخوارزميات وهياكل البيانات وقواعد البيانات والشبكات ونظم التشغيل.',
    'قدرة على تحليل المشكلات وتصميم حلول برمجية فعّالة وقابلة للصيانة والاختبار.',
    'إتقان تطوير الويب والتطبيقات واستخدام أطر العمل وأدوات التحكم في الإصدارات (Git).',
    'التزام بأمن المعلومات والخصوصية وتطبيق أفضل ممارسات الحماية والاختبار.',
    'التفكير المنظومي والعمل ضمن فرق رشيقة (Agile) والتواصل التقني بوضوح.',
    'الابتكار وريادة الأعمال وتقييم البدائل التقنية واتخاذ قرارات مبنية على البيانات.',
    'إجادة استخدام السحابة والحوسبة الموزعة وخدمات DevOps الأساسية حيث يلزم.',
    'التعلم المستمر ومتابعة المستجدات التقنية والمشاركة في البحث والتطوير.'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Header */}
      <UnifiedHeroSection
        icon={Monitor}
        title="كلية تكنولوجيا المعلومات"
        subtitle="برنامج شامل ومتطور لإعداد متخصصين في تكنولوجيا المعلومات قادرين على المساهمة في التحول الرقمي"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[{ label: 'الرئيسية', href: '/', icon: Home }, { label: 'البرامج الأكاديمية', href: '/departments', icon: GraduationCap }, { label: 'تكنولوجيا المعلومات' }]}
          />
        }
      />

      {/* Program Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-section-title mb-6">نظرة عامة على البرنامج</h2>
              <div className="text-body space-y-4 text-right">
                <p>
                  يهدف برنامج بكالوريوس تكنولوجيا المعلومات في كلية أيلول الجامعية إلى إعداد متخصصين مؤهلين 
                  في مجال التكنولوجيا قادرين على تطوير الحلول التقنية المبتكرة والمساهمة في التحول الرقمي.
                </p>
                <p>
                  يركز البرنامج على الجمع بين النظرية والتطبيق العملي، مع التأكيد على أهمية الإبداع والابتكار 
                  في حل المشكلات التقنية والتطوير المستمر للمهارات البرمجية.
                </p>
                <p>
                  يتميز البرنامج بمناهج حديثة تواكب التطورات السريعة في عالم التكنولوجيا، 
                  ومختبرات مجهزة بأحدث الأجهزة والبرمجيات المتطورة.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="card-elevated text-center">
                <Clock className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-2">مدة الدراسة</h3>
                <p className="text-2xl font-bold text-university-blue">4</p>
                <p className="text-body">سنوات</p>
              </div>
              <div className="card-elevated text-center">
                <BookOpen className="w-12 h-12 text-university-red mx-auto mb-4" />
                <h3 className="text-card-title mb-2">الساعات المعتمدة</h3>
                <p className="text-2xl font-bold text-university-red">124</p>
                <p className="text-body">ساعة معتمدة</p>
              </div>
              <div className="card-elevated text-center">
                <Users className="w-12 h-12 text-university-gold mx-auto mb-4" />
                <h3 className="text-card-title mb-2">عدد الطلاب</h3>
                <p className="text-2xl font-bold text-university-gold">75</p>
                <p className="text-body">طالب وطالبة</p>
              </div>
              <div className="card-elevated text-center">
                <Award className="w-12 h-12 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-2">الشهادة</h3>
                <p className="text-sm font-bold text-university-blue">بكالوريوس</p>
                <p className="text-body">تكنولوجيا المعلومات</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Requirements */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">شروط القبول</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-elevated">
                <h3 className="text-card-title mb-6 text-university-blue">الشروط الأكاديمية</h3>
                <ul className="text-lg leading-relaxed space-y-3 text-right">
                  <li className="flex items-center">
                    <Monitor className="w-5 h-5 text-university-blue ml-3 flex-shrink-0" />
                    شهادة الثانوية العامة (أي قسم) بنسبة لا تقل عن 65%
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="w-5 h-5 text-university-blue ml-3 flex-shrink-0" />
                    درجات جيدة في مواد الرياضيات واللغة الإنجليزية
                  </li>
                  <li className="flex items-center">
                    <Award className="w-5 h-5 text-university-blue ml-3 flex-shrink-0" />
                    اجتياز امتحان القبول في المنطق والرياضيات
                  </li>
                </ul>
              </div>

              <div className="card-elevated">
                <h3 className="text-card-title mb-6 text-university-red">الشروط العامة</h3>
                <ul className="text-lg leading-relaxed space-y-3 text-right">
                  <li className="flex items-center">
                    <Users className="w-5 h-5 text-university-red ml-3 flex-shrink-0" />
                    اجتياز المقابلة الشخصية
                  </li>
                  <li className="flex items-center">
                    <Code className="w-5 h-5 text-university-red ml-3 flex-shrink-0" />
                    الاهتمام بالتكنولوجيا والبرمجة
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="w-5 h-5 text-university-red ml-3 flex-shrink-0" />
                    إجادة اللغة الإنجليزية (مستوى متوسط)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">الخطة الدراسية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              خطة دراسية شاملة ومتوازنة تجمع بين العلوم التقنية والتطبيقية
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {curriculum.map((year, index) => (
              <div key={index} className="card-elevated">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-card-title text-university-blue">{year.year}</h3>
                  <div className="w-8 h-8 bg-university-blue rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {year.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="bg-academic-gray-light rounded-lg p-3 text-center">
                      <span className="text-body font-medium">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">أعضاء هيئة التدريس</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              نخبة من الأساتذة المتخصصين والخبراء في مجال تكنولوجيا المعلومات
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {faculty.map((member, index) => (
              <div key={index} className="card-elevated">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-university-blue-light rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-card-title mb-2">{member.name}</h3>
                    <p className="text-body font-medium text-university-blue mb-2">{member.title}</p>
                    <p className="text-small">{member.degree}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graduate Specifications */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">مواصفات خريج البرنامج</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="card-elevated">
              <div className="space-y-4">
                {graduateSpecs.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-university-green mt-0.5 flex-shrink-0" />
                    <span className="text-body">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-section-title mb-4">الفرص المهنية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            <p className="text-subtitle max-w-3xl mx-auto">
              مجالات عمل متنوعة ومتطورة تنتظر خريجي برنامج تكنولوجيا المعلومات
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {careers.map((career, index) => (
                <div key={index} className="card-elevated hover:shadow-university transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-university-gold rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-body font-medium">{career}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="section-padding bg-university-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-section-title text-white mb-6">ابدأ رحلتك التقنية معنا</h2>
          <p className="text-subtitle text-gray-200 mb-8 max-w-3xl mx-auto">
            انضم إلى كلية تكنولوجيا المعلومات في أيلول الجامعية واحصل على تعليم متميز يؤهلك لمستقبل تقني ناجح
          </p>
          <button className="btn-secondary text-lg px-8 py-4">
            قدم طلبك الآن
            <ChevronLeft className="w-5 h-5 mr-2 rtl-flip" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default InformationTechnology;
