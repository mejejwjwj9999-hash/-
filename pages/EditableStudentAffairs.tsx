import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';
import { InlineEditorProvider } from '@/contexts/InlineEditorContext';
import { Users, Calendar, Trophy, Heart, Music, Lightbulb } from 'lucide-react';

const EditableStudentAffairs = () => {
  return (
    <InlineEditorProvider>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="hero-section py-20">
          <div className="hero-content container-custom text-center">
            <h1 className="text-page-title text-white mb-6">
              <EditableContent 
                pageKey="student-affairs"
                elementKey="page_title" 
                elementType="text"
                fallback="شؤون الطلاب"
                as="span"
              />
            </h1>
            <p className="text-subtitle text-gray-200 max-w-4xl mx-auto">
              <EditableContent 
                pageKey="student-affairs"
                elementKey="hero_description" 
                elementType="rich_text"
                fallback="رعاية شاملة للطلاب وتطوير قدراتهم الشخصية والاجتماعية لضمان تجربة جامعية متميزة"
                as="span"
              />
            </p>
          </div>
        </section>

        {/* Student Affairs Overview */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">
                <EditableContent 
                  pageKey="student-affairs"
                  elementKey="affairs_title" 
                  elementType="text"
                  fallback="برامج وأنشطة شؤون الطلاب"
                  as="span"
                />
              </h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
              <p className="text-subtitle max-w-3xl mx-auto">
                <EditableContent 
                  pageKey="student-affairs"
                  elementKey="affairs_description" 
                  elementType="rich_text"
                  fallback="نعمل على تطوير شخصية الطالب من جميع الجوانب وإعداده لسوق العمل والحياة المهنية"
                  as="span"
                />
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Users className="w-16 h-16 text-university-blue mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="clubs_title" 
                    elementType="text"
                    fallback="الأندية الطلابية"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="clubs_description" 
                    elementType="rich_text"
                    fallback="أندية متنوعة في مختلف المجالات العلمية والثقافية والاجتماعية لتنمية المواهب والاهتمامات"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Calendar className="w-16 h-16 text-university-red mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="events_title" 
                    elementType="text"
                    fallback="الفعاليات والأنشطة"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="events_description" 
                    elementType="rich_text"
                    fallback="برنامج غني بالفعاليات والأنشطة التعليمية والترفيهية طوال العام الدراسي"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Trophy className="w-16 h-16 text-university-gold mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="competitions_title" 
                    elementType="text"
                    fallback="المسابقات والجوائز"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="competitions_description" 
                    elementType="rich_text"
                    fallback="مسابقات أكاديمية وثقافية وإبداعية مع جوائز قيمة لتحفيز الطلاب المتميزين"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Heart className="w-16 h-16 text-university-blue mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="volunteer_title" 
                    elementType="text"
                    fallback="العمل التطوعي"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="volunteer_description" 
                    elementType="rich_text"
                    fallback="برامج تطوعية متنوعة لخدمة المجتمع وتنمية روح المسؤولية الاجتماعية لدى الطلاب"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Music className="w-16 h-16 text-university-red mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="arts_title" 
                    elementType="text"
                    fallback="الفنون والثقافة"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="arts_description" 
                    elementType="rich_text"
                    fallback="أنشطة فنية وثقافية متنوعة تشمل المسرح، الموسيقى، الشعر، والفنون التشكيلية"
                    as="span"
                  />
                </p>
              </div>

              <div className="card-elevated text-center hover:shadow-university transition-all duration-300">
                <Lightbulb className="w-16 h-16 text-university-gold mx-auto mb-6" />
                <h3 className="text-card-title mb-4">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="innovation_title" 
                    elementType="text"
                    fallback="الابتكار وريادة الأعمال"
                    as="span"
                  />
                </h3>
                <p className="text-body">
                  <EditableContent 
                    pageKey="student-affairs"
                    elementKey="innovation_description" 
                    elementType="rich_text"
                    fallback="دعم الأفكار الإبداعية والمشاريع الريادية للطلاب مع برامج تدريبية متخصصة"
                    as="span"
                  />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Development */}
        <section className="section-padding bg-academic-gray-light">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-section-title mb-4">
                <EditableContent 
                  pageKey="student-affairs"
                  elementKey="leadership_title" 
                  elementType="text"
                  fallback="تطوير القيادة والمهارات"
                  as="span"
                />
              </h2>
              <div className="w-24 h-1 bg-university-blue mx-auto mb-6"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-elevated">
                  <h3 className="text-card-title mb-6 text-university-blue">البرامج التدريبية</h3>
                  <div className="text-body space-y-3 text-right">
                    <EditableContent 
                      pageKey="student-affairs"
                      elementKey="training_programs" 
                      elementType="rich_text"
                      fallback="<ul><li>دورات في القيادة والإدارة</li><li>تطوير مهارات التواصل والعرض</li><li>ورش عمل في حل المشكلات والتفكير النقدي</li></ul>"
                    />
                  </div>
                </div>

                <div className="card-elevated">
                  <h3 className="text-card-title mb-6 text-university-red">الأنشطة العملية</h3>
                  <div className="text-body space-y-3 text-right">
                    <EditableContent 
                      pageKey="student-affairs"
                      elementKey="practical_activities" 
                      elementType="rich_text"
                      fallback="<ul><li>مشاريع جماعية ومبادرات طلابية</li><li>تنظيم الفعاليات والمؤتمرات</li><li>المشاركة في المسؤوليات الإدارية</li></ul>"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="section-padding bg-university-blue text-white">
          <div className="container-custom text-center">
            <h2 className="text-section-title text-white mb-6">
              <EditableContent 
                pageKey="student-affairs"
                elementKey="join_title" 
                elementType="text"
                fallback="انضم إلى مجتمعنا الطلابي"
                as="span"
              />
            </h2>
            <p className="text-subtitle text-gray-200 mb-8 max-w-3xl mx-auto">
              <EditableContent 
                pageKey="student-affairs"
                elementKey="join_description" 
                elementType="rich_text"
                fallback="كن جزءاً من تجربة جامعية متميزة واستفد من جميع الأنشطة والبرامج المتاحة"
                as="span"
              />
            </p>
            <button className="btn-secondary text-lg px-8 py-4">
              <EditableContent 
                pageKey="student-affairs" 
                elementKey="join_button" 
                elementType="text"
                fallback="اعرف المزيد"
                as="span"
              />
            </button>
          </div>
        </section>
      </div>
    </InlineEditorProvider>
  );
};

export default EditableStudentAffairs;