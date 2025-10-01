import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';
import { InlineEditorProvider } from '@/contexts/InlineEditorContext';
import { Heart, Users, Clock, BookOpen, Stethoscope, Award } from 'lucide-react';

const EditableNursing = () => {
  return (
    <InlineEditorProvider>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="hero-section py-20">
          <div className="hero-content container-custom text-center">
            <h1 className="text-page-title text-white mb-6">
              <EditableContent 
                pageKey="nursing" 
                elementKey="page_title" 
                elementType="text"
                fallback="كلية التمريض"
                as="span"
              />
            </h1>
            <p className="text-subtitle text-gray-200 max-w-4xl mx-auto">
              <EditableContent 
                pageKey="nursing" 
                elementKey="hero_description" 
                elementType="rich_text"
                fallback="برنامج شامل ومتطور لإعداد ممرضين مؤهلين قادرين على تقديم رعاية تمريضية متميزة في مختلف المجالات الصحية"
                as="span"
              />
            </p>
          </div>
        </section>

        {/* Program Overview */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-section-title mb-6">
                  <EditableContent 
                    pageKey="nursing" 
                    elementKey="overview_title" 
                    elementType="text"
                    fallback="نظرة عامة على البرنامج"
                    as="span"
                  />
                </h2>
                <div className="text-body space-y-4 text-right">
                  <p>
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="overview_paragraph_1" 
                      elementType="rich_text"
                      fallback="يهدف برنامج بكالوريوس التمريض في كلية أيلول الجامعية إلى إعداد ممرضين مؤهلين ومتخصصين قادرين على تقديم رعاية تمريضية شاملة وآمنة للمرضى في مختلف البيئات الصحية."
                      as="span"
                    />
                  </p>
                  <p>
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="overview_paragraph_2" 
                      elementType="rich_text"
                      fallback="يركز البرنامج على الجمع بين المعرفة النظرية والمهارات العملية، مع التأكيد على أهمية الأخلاقيات المهنية والتطوير المستمر للكفاءات التمريضية."
                      as="span"
                    />
                  </p>
                  <p>
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="overview_paragraph_3" 
                      elementType="rich_text"
                      fallback="يتميز البرنامج بمناهج حديثة تواكب التطورات العالمية في مجال التمريض، ومختبرات مجهزة بأحدث المعدات الطبية والتمريضية."
                      as="span"
                    />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="card-elevated text-center">
                  <Clock className="w-12 h-12 text-university-blue mx-auto mb-4" />
                  <h3 className="text-card-title mb-2">مدة الدراسة</h3>
                  <p className="text-2xl font-bold text-university-blue">
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="duration_years" 
                      elementType="text"
                      fallback="4"
                      as="span"
                    />
                  </p>
                  <p className="text-body">سنوات</p>
                </div>
                <div className="card-elevated text-center">
                  <BookOpen className="w-12 h-12 text-university-red mx-auto mb-4" />
                  <h3 className="text-card-title mb-2">الساعات المعتمدة</h3>
                  <p className="text-2xl font-bold text-university-red">
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="credit_hours" 
                      elementType="text"
                      fallback="132"
                      as="span"
                    />
                  </p>
                  <p className="text-body">ساعة معتمدة</p>
                </div>
                <div className="card-elevated text-center">
                  <Users className="w-12 h-12 text-university-gold mx-auto mb-4" />
                  <h3 className="text-card-title mb-2">عدد الطلاب</h3>
                  <p className="text-2xl font-bold text-university-gold">
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="student_count" 
                      elementType="text"
                      fallback="95"
                      as="span"
                    />
                  </p>
                  <p className="text-body">طالب وطالبة</p>
                </div>
                <div className="card-elevated text-center">
                  <Award className="w-12 h-12 text-university-blue mx-auto mb-4" />
                  <h3 className="text-card-title mb-2">الشهادة</h3>
                  <p className="text-sm font-bold text-university-blue">بكالوريوس</p>
                  <p className="text-body">التمريض</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admission Requirements */}
        <section className="section-padding bg-academic-gray-light">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">
                <EditableContent 
                  pageKey="nursing" 
                  elementKey="admission_title" 
                  elementType="text"
                  fallback="شروط القبول"
                  as="span"
                />
              </h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-elevated">
                  <h3 className="text-card-title mb-6 text-university-blue">الشروط الأكاديمية</h3>
                  <div className="text-body space-y-3 text-right">
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="academic_requirements" 
                      elementType="rich_text"
                      fallback="<ul><li>شهادة الثانوية العامة (القسم العلمي) بنسبة لا تقل عن 70%</li><li>درجات جيدة في مواد الكيمياء والفيزياء والأحياء</li><li>اجتياز امتحان القبول في المواد العلمية</li></ul>"
                    />
                  </div>
                </div>

                <div className="card-elevated">
                  <h3 className="text-card-title mb-6 text-university-red">الشروط العامة</h3>
                  <div className="text-body space-y-3 text-right">
                    <EditableContent 
                      pageKey="nursing" 
                      elementKey="general_requirements" 
                      elementType="rich_text"
                      fallback="<ul><li>اجتياز المقابلة الشخصية</li><li>الفحص الطبي والنفسي الشامل</li><li>إجادة اللغة الإنجليزية (مستوى متوسط)</li></ul>"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Career Opportunities */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">
                <EditableContent 
                  pageKey="nursing" 
                  elementKey="careers_title" 
                  elementType="text"
                  fallback="الفرص المهنية"
                  as="span"
                />
              </h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
              <p className="text-subtitle max-w-3xl mx-auto">
                <EditableContent 
                  pageKey="nursing" 
                  elementKey="careers_description" 
                  elementType="rich_text"
                  fallback="مجالات عمل متنوعة ومتطورة تنتظر خريجي برنامج التمريض"
                  as="span"
                />
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <EditableContent 
                  pageKey="nursing" 
                  elementKey="career_opportunities" 
                  elementType="rich_text"
                  fallback="<div class='card-elevated hover:shadow-university transition-all duration-300'><div class='flex items-center'><div class='w-12 h-12 bg-university-gold rounded-full flex items-center justify-center ml-4 flex-shrink-0'><span class='text-white'>🩺</span></div><span class='text-body font-medium'>ممرض في المستشفيات الحكومية والخاصة</span></div></div>"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Application CTA */}
        <section className="section-padding bg-university-blue text-white">
          <div className="container-custom text-center">
            <h2 className="text-section-title text-white mb-6">
              <EditableContent 
                pageKey="nursing" 
                elementKey="cta_title" 
                elementType="text"
                fallback="ابدأ رحلتك المهنية معنا"
                as="span"
              />
            </h2>
            <p className="text-subtitle text-gray-200 mb-8 max-w-3xl mx-auto">
              <EditableContent 
                pageKey="nursing" 
                elementKey="cta_description" 
                elementType="rich_text"
                fallback="انضم إلى كلية التمريض في أيلول الجامعية واحصل على تعليم متميز يؤهلك لمستقبل مهني ناجح"
                as="span"
              />
            </p>
            <button className="btn-secondary text-lg px-8 py-4">
              <EditableContent 
                pageKey="nursing" 
                elementKey="cta_button" 
                elementType="text"
                fallback="قدم طلبك الآن"
                as="span"
              />
            </button>
          </div>
        </section>
      </div>
    </InlineEditorProvider>
  );
};

export default EditableNursing;