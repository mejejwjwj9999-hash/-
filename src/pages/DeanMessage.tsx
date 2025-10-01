import React from 'react';
import { Quote, User, Mail, Phone, Home } from 'lucide-react';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const DeanMessage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Unified Hero Section */}
      <UnifiedHeroSection
        icon={User}
        title="كلمة عميد الكلية"
        subtitle="رسالة من عميد كلية أيلول الجامعية إلى الطلاب والمجتمع"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'كلمة عميد الكلية', icon: User }
            ]}
          />
        }
      />

      {/* Dean's Message */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Dean's Photo and Info */}
              <div className="card-elevated text-center">
                <div className="w-48 h-48 bg-university-blue-light rounded-full mx-auto mb-6 overflow-hidden">
                  <img 
                    src="/lovable-uploads/3b66f222-08f7-4d05-b5b1-4ddb5a1651b2.png"
                    alt="د/ مراد المجاهد - عميد كلية أيلول الجامعية"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-card-title mb-2">الدكتور</h3>
                <p className="text-university-blue font-bold text-lg mb-4">مراد المجاهد</p>
                <p className="text-small text-academic-gray mb-6">عميد كلية أيلول الجامعية</p>
                
                <div className="space-y-3 text-right">
                  <div className="flex items-center justify-center gap-3">
                    <Mail className="w-4 h-4 text-university-blue" />
                    <span className="text-small">dean@eylool.edu.ye</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Phone className="w-4 h-4 text-university-blue" />
                    <span className="text-small">+967 4 123456</span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-2">
                <div className="card-elevated">
                  <Quote className="w-12 h-12 text-university-gold mb-6" />
                  
                  <div className="text-body space-y-6 text-right leading-relaxed">
                    <p className="text-lg font-medium text-university-blue">
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
                    
                    <p className="text-lg font-medium text-university-gold">
                      في الختام أتمنى لجميع طلابنا دوام التوفيق والنجاح في دراستهم وان يكونوا سفراء مخلصين لكليتهم بعد تخرجهم وان يسهموا في إعادة بناء هذا الوطن.
                    </p>
                    
                    <p className="text-lg font-medium text-university-blue italic text-center mt-6">
                      "نسعى لتحقيق التميز في التعليم العالي وإعداد جيل قادر على مواجهة تحديات المستقبل"
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-academic-gray-light text-center">
                    <p className="text-card-title">الدكتور مراد المجاهد</p>
                    <p className="text-body text-university-blue">عميد كلية أيلول الجامعية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dean's Achievements */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-section-title mb-4">السيرة العلمية للعميد</h2>
              <div className="w-24 h-1 bg-university-blue mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-elevated">
                <h3 className="text-card-title mb-4">المؤهلات العلمية</h3>
                <ul className="text-body space-y-2">
                  <li>• دكتوراه في الطب من جامعة القاهرة</li>
                  <li>• ماجستير في الطب الباطني</li>
                  <li>• بكالوريوس طب وجراحة بدرجة امتياز</li>
                  <li>• زمالة في أمراض القلب</li>
                </ul>
              </div>
              
              <div className="card-elevated">
                <h3 className="text-card-title mb-4">الخبرات العملية</h3>
                <ul className="text-body space-y-2">
                  <li>• 15 عاماً في التدريس الجامعي</li>
                  <li>• 20 عاماً في الممارسة الطبية</li>
                  <li>• عضو في عدة جمعيات طبية دولية</li>
                  <li>• مؤلف لأكثر من 30 بحثاً علمياً</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeanMessage;