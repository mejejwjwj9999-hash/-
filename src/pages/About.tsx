
import React from 'react';
import { Award, Target, History, Shield, Users, BookOpen, Home, ChevronLeft } from 'lucide-react';
import { DynamicContent } from '@/components/DynamicContent';
import { useNavigate } from 'react-router-dom';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <UnifiedPageHeader
        icon={BookOpen}
        title="عن كلية أيلول الجامعية"
        subtitle="كلية حديثة في التعليم العالي تسعى لإعداد جيل متميز من الكوادر المؤهلة في مختلف التخصصات الطبية والتقنية والإدارية"
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'عن الكلية', icon: BookOpen }
        ]}
      />

      {/* Dean's Message */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="card-elevated max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-university-blue/5 p-8 rounded-2xl border border-university-blue/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-university-blue rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-card-title mb-0">كلمة عميد الكلية</h2>
                </div>
                <div className="text-body space-y-4 max-h-96 overflow-y-auto pr-2">
                  <p className="font-medium text-university-blue">
                    الحمد لله والصـــلاة والســـلام علـــى معلـــم البشـــرية محمـــد بـــن عبداللـــه وعلـــى آلـــه
                  </p>
                  <p>
                    كلية أيلول هـــي أول كليـــة جامعيـــة أهليـــة فـــي مديرية يريم والمديريات المجاورة لها. غايتها منذ تأسيسها ان تكون نواة جامعة تظم عدة كليات متخصصة.
                  </p>
                  <p>
                    تدرك كلية أيلول الجامعية الأدوار التي ينبغي للكلية أن تقوم بها، وتستشرف كل ما يطرأ على هذه الأدوار، وتعمل على تهيئة البيئة الجامعية لتساعد الطلبة على تحقيق أقصى استفادة ممكنة.
                  </p>
                  <p>
                    ان كليتنا تسعى وبشكل مستمر الى تطبيق معايير الاعتماد الأكاديمي في مختلف المجالات العملية التعليمية والإدارية أخذة بالحسبان تعزيز واستمرار التواصل الحضاري والعلمي.
                  </p>
                  <p className="font-medium text-university-gold">
                    في الختام أتمنى لجميع طلابنا دوام التوفيق والنجاح في دراستهم وان يكونوا سفراء مخلصين لكليتهم بعد تخرجهم وان يسهموا في إعادة بناء هذا الوطن.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-university-blue/10 rounded-3xl transform rotate-3"></div>
                <div className="relative card-elevated">
                  <div className="w-full h-80 bg-university-blue/5 rounded-2xl overflow-hidden mb-6">
                    <img 
                      src="/lovable-uploads/3b66f222-08f7-4d05-b5b1-4ddb5a1651b2.png"
                      alt="د/ مراد المجاهد - عميد كلية أيلول الجامعية"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-card-title mb-2">د/ مراد المجاهد</h3>
                    <p className="text-academic-gray font-medium">عميد كلية أيلول الجامعية</p>
                    <div className="mt-4 p-4 bg-university-blue/5 rounded-xl">
                      <p className="text-small text-academic-gray italic">
                        "نسعى لتحقيق التميز في التعليم العالي وإعداد جيل قادر على مواجهة تحديات المستقبل"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Goals */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Vision */}
            <div className="card-elevated text-center hover:shadow-university transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-university-blue rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-card-title mb-4">الرؤية</h3>
              <p className="text-body leading-relaxed text-center">
                أن نكون كلية رائدة ومتميزة في التعليم العالي والبحث العلمي على المستوى المحلي والإقليمي، نساهم في إعداد كوادر مؤهلة قادرة على خدمة المجتمع والتنمية المستدامة.
              </p>
            </div>

            {/* Mission */}
            <div className="card-elevated text-center hover:shadow-university transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-university-gold rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-card-title mb-4">الرسالة</h3>
              <p className="text-body leading-relaxed text-center">
                تقديم تعليم عالي الجودة في التخصصات الطبية والتقنية والإدارية وفق أحدث المعايير الأكاديمية، وإجراء البحوث العلمية التطبيقية، وخدمة المجتمع من خلال برامج التدريب والتطوير المهني.
              </p>
            </div>

            {/* Goals */}
            <div className="card-elevated text-center hover:shadow-university transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-university-blue rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-card-title mb-4">الأهداف</h3>
              <ul className="text-body text-right space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-university-blue rounded-full ml-3"></div>
                  إعداد خريجين مؤهلين علمياً ومهنياً
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-university-gold rounded-full ml-3"></div>
                  تطوير البرامج الأكاديمية باستمرار
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-university-blue rounded-full ml-3"></div>
                  تعزيز البحث العلمي والابتكار
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-university-gold rounded-full ml-3"></div>
                  خدمة المجتمع المحلي
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-university-blue rounded-full ml-3"></div>
                  بناء شراكات استراتيجية
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">تاريخ الكلية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated">
              <History className="w-12 h-12 text-university-blue mb-6" />
              <h3 className="text-card-title mb-4">نشأة كلية أيلول الجامعية</h3>
              <div className="text-body space-y-4">
                <p>
                  تأسست كلية أيلول الجامعية في عام 2023م بمحافظة إب، كمؤسسة تعليمية حديثة متخصصة في العلوم الطبية والتقنية والإدارية. جاءت فكرة تأسيس الكلية من الحاجة الماسة لمؤسسة تعليمية متطورة تواكب التطورات العلمية والتكنولوجية الحديثة.
                </p>
                <p>
                  بدأت الكلية مسيرتها التعليمية بخمسة تخصصات رئيسية: الصيدلة، التمريض، القبالة، تكنولوجيا المعلومات، وإدارة الأعمال. وقد حرصت إدارة الكلية منذ البداية على توفير بيئة تعليمية متطورة تشمل المختبرات الحديثة والقاعات المجهزة بأحدث التقنيات.
                </p>
                <p>
                  خلال عامها الأول، تمكنت الكلية من استقطاب نخبة من أعضاء هيئة التدريس المتخصصين وتطوير برامجها الأكاديمية لتتماشى مع معايير الجودة العالمية، مما جعلها تحظى بثقة الطلاب وأولياء الأمور في المنطقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">الاعتماد والترخيص</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-elevated">
              <Shield className="w-12 h-12 text-university-blue mb-4" />
              <h3 className="text-card-title mb-4">الاعتماد الأكاديمي</h3>
              <p className="text-body">
                حصلت كلية أيلول الجامعية على الترخيص والاعتماد الأكاديمي من وزارة التعليم العالي والبحث العلمي في الجمهورية اليمنية، مما يضمن جودة التعليم ومعادلة الشهادات محلياً وإقليمياً.
              </p>
            </div>
            
            <div className="card-elevated">
              <Award className="w-12 h-12 text-university-gold mb-4" />
              <h3 className="text-card-title mb-4">ضمان الجودة</h3>
              <p className="text-body">
                تلتزم الكلية بمعايير ضمان الجودة الأكاديمية في جميع برامجها التعليمية، وتسعى للحصول على الاعتمادات الدولية المتخصصة في كل مجال من مجالات التخصص.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Facilities */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-section-title mb-4">مرافق الكلية</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'المكتبة الرقمية', icon: BookOpen },
              { name: 'المختبرات العلمية', icon: Award },
              { name: 'القاعات الذكية', icon: Target },
              { name: 'مختبرات الحاسوب', icon: BookOpen },
              { name: 'العيادة الطبية', icon: Shield },
              { name: 'المدرجات الحديثة', icon: Users }
            ].map((facility, index) => (
              <div key={index} className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <facility.icon className="w-16 h-16 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title">{facility.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
