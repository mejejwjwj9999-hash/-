import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';

const EditableAdmissions = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <EditableContent 
                pageKey="admissions" 
                elementKey="page_title" 
                elementType="text"
                fallback="القبول والتسجيل"
                as="span"
              />
            </h1>
            <p className="text-xl text-muted-foreground">
              <EditableContent 
                pageKey="admissions" 
                elementKey="page_subtitle" 
                elementType="text"
                fallback="ابدأ رحلتك التعليمية معنا"
                as="span"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Admission Requirements */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-foreground text-center">
              <EditableContent 
                pageKey="admissions" 
                elementKey="requirements_title" 
                elementType="text"
                fallback="شروط القبول"
                as="span"
              />
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <EditableContent 
                    pageKey="admissions" 
                    elementKey="general_requirements_title" 
                    elementType="text"
                    fallback="الشروط العامة"
                    as="span"
                  />
                </h3>
                <div className="text-muted-foreground">
                  <EditableContent 
                    pageKey="admissions" 
                    elementKey="general_requirements_content" 
                    elementType="rich_text"
                    fallback="<ul><li>شهادة الثانوية العامة أو ما يعادلها</li><li>اجتياز المقابلة الشخصية</li><li>تقديم المستندات المطلوبة كاملة</li><li>دفع رسوم التسجيل</li></ul>"
                    as="div"
                  />
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <EditableContent 
                    pageKey="admissions" 
                    elementKey="special_requirements_title" 
                    elementType="text"
                    fallback="شروط خاصة"
                    as="span"
                  />
                </h3>
                <div className="text-muted-foreground">
                  <EditableContent 
                    pageKey="admissions" 
                    elementKey="special_requirements_content" 
                    elementType="rich_text"
                    fallback="<ul><li>معدل لا يقل عن 70% للكليات الطبية</li><li>اجتياز امتحان القدرات لبعض التخصصات</li><li>فحص طبي شامل للكليات الصحية</li><li>إتقان أساسيات الحاسوب</li></ul>"
                    as="div"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-foreground text-center">
              <EditableContent 
                pageKey="admissions" 
                elementKey="process_title" 
                elementType="text"
                fallback="خطوات التقديم"
                as="span"
              />
            </h2>
            
            <div className="relative">
              <div className="absolute top-6 right-0 left-0 h-0.5 bg-gradient-to-l from-primary via-secondary to-accent"></div>
              <div className="grid md:grid-cols-4 gap-8 relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_1_title" 
                      elementType="text"
                      fallback="تقديم الطلب"
                      as="span"
                    />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_1_description" 
                      elementType="text"
                      fallback="املأ استمارة التقديم وارفق المستندات"
                      as="span"
                    />
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_2_title" 
                      elementType="text"
                      fallback="المراجعة"
                      as="span"
                    />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_2_description" 
                      elementType="text"
                      fallback="مراجعة الطلب والتحقق من الوثائق"
                      as="span"
                    />
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_3_title" 
                      elementType="text"
                      fallback="المقابلة"
                      as="span"
                    />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_3_description" 
                      elementType="text"
                      fallback="اجراء المقابلة الشخصية والاختبارات"
                      as="span"
                    />
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_4_title" 
                      elementType="text"
                      fallback="القبول"
                      as="span"
                    />
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <EditableContent 
                      pageKey="admissions" 
                      elementKey="step_4_description" 
                      elementType="text"
                      fallback="الحصول على قرار القبول والتسجيل"
                      as="span"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-foreground text-center">
              <EditableContent 
                pageKey="admissions" 
                elementKey="documents_title" 
                elementType="text"
                fallback="المستندات المطلوبة"
                as="span"
              />
            </h2>
            
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="text-muted-foreground">
                <EditableContent 
                  pageKey="admissions" 
                  elementKey="documents_content" 
                  elementType="rich_text"
                  fallback="<ul><li>أصل شهادة الثانوية العامة + صورة مصدقة</li><li>صورة شخصية حديثة (4×6)</li><li>صورة الهوية الشخصية أو جواز السفر</li><li>شهادة حسن السيرة والسلوك</li><li>تقرير طبي شامل</li><li>استمارة طلب الالتحاق مكتملة</li></ul>"
                  as="div"
                />
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-2xl border border-border">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                <EditableContent 
                  pageKey="admissions" 
                  elementKey="apply_now_title" 
                  elementType="text"
                  fallback="قدم طلبك الآن"
                  as="span"
                />
              </h2>
              <p className="text-muted-foreground mb-6">
                <EditableContent 
                  pageKey="admissions" 
                  elementKey="apply_now_description" 
                  elementType="text"
                  fallback="ابدأ رحلتك التعليمية معنا اليوم"
                  as="span"
                />
              </p>
              <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
                <EditableContent 
                  pageKey="admissions" 
                  elementKey="apply_button_text" 
                  elementType="text"
                  fallback="تقديم الطلب"
                  as="span"
                />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableAdmissions;