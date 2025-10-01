import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';

const EditableHistory = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <EditableContent 
                pageKey="history" 
                elementKey="page_title" 
                elementType="text"
                fallback="تاريخ الكلية"
                as="span"
              />
            </h1>
            <p className="text-xl text-muted-foreground">
              <EditableContent 
                pageKey="history" 
                elementKey="page_subtitle" 
                elementType="text"
                fallback="رحلة من التأسيس إلى التميز"
                as="span"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Foundation Story */}
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                <EditableContent 
                  pageKey="history" 
                  elementKey="foundation_title" 
                  elementType="text"
                  fallback="التأسيس والبدايات"
                  as="span"
                />
              </h2>
              <div className="text-lg leading-relaxed text-muted-foreground">
                <EditableContent 
                  pageKey="history" 
                  elementKey="foundation_content" 
                  elementType="rich_text"
                  fallback="<p>تأسست كلية إيلول الجامعية في عام 2010 كمؤسسة تعليمية متخصصة في مجال العلوم الطبية والصحية. بدأت الكلية مسيرتها بطموح كبير لتكون منارة للتعليم العالي في اليمن والمنطقة.</p>"
                  as="div"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>
              
              <div className="space-y-8">
                {/* Timeline Item 1 */}
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10">
                    2010
                  </div>
                  <div className="flex-1 bg-card p-6 rounded-2xl border border-border">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2010_title" 
                        elementType="text"
                        fallback="التأسيس الرسمي"
                        as="span"
                      />
                    </h3>
                    <p className="text-muted-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2010_content" 
                        elementType="text"
                        fallback="تم تأسيس كلية إيلول الجامعية وحصولها على الترخيص الرسمي من وزارة التعليم العالي"
                        as="span"
                      />
                    </p>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10">
                    2012
                  </div>
                  <div className="flex-1 bg-card p-6 rounded-2xl border border-border">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2012_title" 
                        elementType="text"
                        fallback="إطلاق البرامج الأكاديمية"
                        as="span"
                      />
                    </h3>
                    <p className="text-muted-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2012_content" 
                        elementType="text"
                        fallback="بدء تدريس البرامج الأكاديمية في كلية الصيدلة وكلية التمريض"
                        as="span"
                      />
                    </p>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10">
                    2015
                  </div>
                  <div className="flex-1 bg-card p-6 rounded-2xl border border-border">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2015_title" 
                        elementType="text"
                        fallback="التوسع والنمو"
                        as="span"
                      />
                    </h3>
                    <p className="text-muted-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2015_content" 
                        elementType="text"
                        fallback="إضافة كلية القبالة والتوليد وتوسيع المرافق التعليمية"
                        as="span"
                      />
                    </p>
                  </div>
                </div>

                {/* Timeline Item 4 */}
                <div className="relative flex items-start gap-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10">
                    2020
                  </div>
                  <div className="flex-1 bg-card p-6 rounded-2xl border border-border">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2020_title" 
                        elementType="text"
                        fallback="العصر الرقمي"
                        as="span"
                      />
                    </h3>
                    <p className="text-muted-foreground">
                      <EditableContent 
                        pageKey="history" 
                        elementKey="timeline_2020_content" 
                        elementType="text"
                        fallback="إطلاق كلية تكنولوجيا المعلومات وإدارة الأعمال لمواكبة التطور التكنولوجي"
                        as="span"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
                <EditableContent 
                  pageKey="history" 
                  elementKey="achievements_title" 
                  elementType="text"
                  fallback="إنجازاتنا عبر السنين"
                  as="span"
                />
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <EditableContent 
                  pageKey="history" 
                  elementKey="achievements_content" 
                  elementType="rich_text"
                  fallback="<p>على مدار أكثر من عقد من الزمن، حققت كلية إيلول العديد من الإنجازات المهمة في مجال التعليم والبحث العلمي، وساهمت في إعداد كوادر مؤهلة تخدم المجتمع في مختلف القطاعات الصحية والتكنولوجية.</p>"
                  as="div"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableHistory;