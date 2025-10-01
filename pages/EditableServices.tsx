import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';
import { InlineEditorProvider } from '@/contexts/InlineEditorContext';
import { UserCheck, FileText, GraduationCap, Heart, Users, BookOpen } from 'lucide-react';

const EditableServices = () => {
  return (
    <InlineEditorProvider>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="hero-section py-20">
          <div className="hero-content container-custom text-center">
            <h1 className="text-page-title text-white mb-6">
              <EditableContent 
                pageKey="services" 
                elementKey="page_title" 
                elementType="text"
                fallback="الخدمات الطلابية"
                as="span"
              />
            </h1>
            <p className="text-subtitle text-gray-200 max-w-4xl mx-auto">
              <EditableContent 
                pageKey="services" 
                elementKey="hero_description" 
                elementType="rich_text"
                fallback="مجموعة شاملة من الخدمات المصممة لدعم الطلاب في رحلتهم الأكاديمية والشخصية"
                as="span"
              />
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">
                <EditableContent 
                  pageKey="services" 
                  elementKey="services_title" 
                  elementType="text"
                  fallback="خدماتنا المتميزة"
                  as="span"
                />
              </h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
              <p className="text-subtitle max-w-3xl mx-auto">
                <EditableContent 
                  pageKey="services" 
                  elementKey="services_description" 
                  elementType="rich_text"
                  fallback="نقدم مجموعة متنوعة من الخدمات لضمان تجربة تعليمية متكاملة ومميزة"
                  as="span"
                />
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <UserCheck className="w-16 h-16 text-university-blue mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="admission_service_title" 
                    elementType="text"
                    fallback="خدمات القبول والتسجيل"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="admission_service_description" 
                    elementType="rich_text"
                    fallback="إرشاد ومساعدة الطلاب في عملية التقديم والقبول والتسجيل في البرامج الأكاديمية"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <FileText className="w-16 h-16 text-university-red mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="documents_service_title" 
                    elementType="text"
                    fallback="إصدار الوثائق"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="documents_service_description" 
                    elementType="rich_text"
                    fallback="إصدار الشهادات الأكاديمية، كشوف الدرجات، وجميع الوثائق الرسمية للطلاب"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <GraduationCap className="w-16 h-16 text-university-gold mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="academic_service_title" 
                    elementType="text"
                    fallback="الإرشاد الأكاديمي"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="academic_service_description" 
                    elementType="rich_text"
                    fallback="توجيه الطلاب في اختيار التخصصات والمقررات وتخطيط مسارهم الأكاديمي"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Heart className="w-16 h-16 text-university-blue mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="health_service_title" 
                    elementType="text"
                    fallback="الخدمات الصحية"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="health_service_description" 
                    elementType="rich_text"
                    fallback="رعاية صحية شاملة للطلاب مع عيادة طبية مجهزة وكادر طبي متخصص"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Users className="w-16 h-16 text-university-red mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="counseling_service_title" 
                    elementType="text"
                    fallback="الإرشاد النفسي"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="counseling_service_description" 
                    elementType="rich_text"
                    fallback="دعم نفسي واجتماعي للطلاب مع جلسات إرشادية فردية وجماعية"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <BookOpen className="w-16 h-16 text-university-gold mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="library_service_title" 
                    elementType="text"
                    fallback="المكتبة الرقمية"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="services" 
                    elementKey="library_service_description" 
                    elementType="rich_text"
                    fallback="مكتبة شاملة بمصادر متنوعة وقواعد بيانات إلكترونية لدعم البحث العلمي"
                    as="span"
                  />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Apply */}
        <section className="section-padding bg-academic-gray-light">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">
                <EditableContent 
                  pageKey="services" 
                  elementKey="application_title" 
                  elementType="text"
                  fallback="كيفية الحصول على الخدمات"
                  as="span"
                />
              </h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-elevated">
                  <h3 className="text-card-title mb-6 text-university-blue">الخدمات الإلكترونية</h3>
                  <div className="text-body space-y-3 text-right">
                    <EditableContent 
                      pageKey="services" 
                      elementKey="online_services" 
                      elementType="rich_text"
                      fallback="<ul><li>تقديم طلبات الخدمات عبر البوابة الإلكترونية</li><li>متابعة حالة الطلبات أونلاين</li><li>تحميل الوثائق والشهادات إلكترونياً</li></ul>"
                    />
                  </div>
                </div>

                <div className="card-elevated">
                  <h3 className="text-card-title mb-6 text-university-red">المراجعة المباشرة</h3>
                  <div className="text-body space-y-3 text-right">
                    <EditableContent 
                      pageKey="services" 
                      elementKey="direct_services" 
                      elementType="rich_text"
                      fallback="<ul><li>زيارة مكتب شؤون الطلاب</li><li>مواعيد العمل: الأحد - الخميس من 8 صباحاً إلى 4 عصراً</li><li>خدمة عملاء متخصصة للمساعدة</li></ul>"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section-padding bg-university-blue text-white">
          <div className="container-custom text-center">
            <h2 className="text-section-title text-white mb-6">
              <EditableContent 
                pageKey="services" 
                elementKey="contact_title" 
                elementType="text"
                fallback="هل تحتاج مساعدة؟"
                as="span"
              />
            </h2>
            <p className="text-subtitle text-gray-200 mb-8 max-w-3xl mx-auto">
              <EditableContent 
                pageKey="services" 
                elementKey="contact_description" 
                elementType="rich_text"
                fallback="فريقنا جاهز لمساعدتك في الحصول على جميع الخدمات التي تحتاجها"
                as="span"
              />
            </p>
            <button className="btn-secondary text-lg px-8 py-4">
              <EditableContent 
                pageKey="services" 
                elementKey="contact_button" 
                elementType="text"
                fallback="اتصل بنا الآن"
                as="span"
              />
            </button>
          </div>
        </section>
      </div>
    </InlineEditorProvider>
  );
};

export default EditableServices;