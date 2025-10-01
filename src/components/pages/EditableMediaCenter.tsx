import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';

const EditableMediaCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <EditableContent 
                pageKey="media-center" 
                elementKey="page_title" 
                elementType="text"
                fallback="المركز الإعلامي"
                as="span"
              />
            </h1>
            <p className="text-xl text-muted-foreground">
              <EditableContent 
                pageKey="media-center" 
                elementKey="page_subtitle" 
                elementType="text"
                fallback="آخر الأخبار والفعاليات من كلية إيلول"
                as="span"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Latest News */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground text-center">
              <EditableContent 
                pageKey="media-center" 
                elementKey="news_title" 
                elementType="text"
                fallback="آخر الأخبار"
                as="span"
              />
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* News Item 1 */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                <div className="p-6">
                  <div className="text-sm text-primary font-medium mb-2">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_1_date" 
                      elementType="text"
                      fallback="15 ديسمبر 2024"
                      as="span"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-foreground">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_1_title" 
                      elementType="text"
                      fallback="افتتاح المختبر الجديد لكلية الصيدلة"
                      as="span"
                    />
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_1_excerpt" 
                      elementType="text"
                      fallback="تم افتتاح مختبر جديد مجهز بأحدث التقنيات لخدمة طلاب كلية الصيدلة..."
                      as="span"
                    />
                  </p>
                </div>
              </div>

              {/* News Item 2 */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20"></div>
                <div className="p-6">
                  <div className="text-sm text-secondary font-medium mb-2">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_2_date" 
                      elementType="text"
                      fallback="10 ديسمبر 2024"
                      as="span"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-foreground">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_2_title" 
                      elementType="text"
                      fallback="ندوة علمية حول التمريض الحديث"
                      as="span"
                    />
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_2_excerpt" 
                      elementType="text"
                      fallback="نظمت كلية التمريض ندوة علمية حول أحدث التطورات في مجال التمريض..."
                      as="span"
                    />
                  </p>
                </div>
              </div>

              {/* News Item 3 */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20"></div>
                <div className="p-6">
                  <div className="text-sm text-accent font-medium mb-2">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_3_date" 
                      elementType="text"
                      fallback="5 ديسمبر 2024"
                      as="span"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-foreground">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_3_title" 
                      elementType="text"
                      fallback="فتح باب التسجيل للفصل الدراسي الجديد"
                      as="span"
                    />
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="news_3_excerpt" 
                      elementType="text"
                      fallback="تعلن كلية إيلول عن فتح باب التسجيل للطلاب الجدد للفصل الدراسي..."
                      as="span"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-foreground text-center">
              <EditableContent 
                pageKey="media-center" 
                elementKey="events_title" 
                elementType="text"
                fallback="الفعاليات القادمة"
                as="span"
              />
            </h2>
            
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="event_1_title" 
                      elementType="text"
                      fallback="معرض الوظائف السنوي"
                      as="span"
                    />
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="event_1_description" 
                      elementType="text"
                      fallback="معرض سنوي يجمع الطلاب وأصحاب العمل لتوفير فرص وظيفية متميزة"
                      as="span"
                    />
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="event_1_date" 
                      elementType="text"
                      fallback="25 ديسمبر 2024"
                      as="span"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="event_2_title" 
                      elementType="text"
                      fallback="مؤتمر العلوم الطبية"
                      as="span"
                    />
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="event_2_description" 
                      elementType="text"
                      fallback="مؤتمر علمي دولي يناقش أحدث التطورات في مجال العلوم الطبية والصحية"
                      as="span"
                    />
                  </p>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <EditableContent 
                      pageKey="media-center" 
                      elementKey="event_2_date" 
                      elementType="text"
                      fallback="15 يناير 2025"
                      as="span"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Press Releases */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-foreground text-center">
              <EditableContent 
                pageKey="media-center" 
                elementKey="press_title" 
                elementType="text"
                fallback="البيانات الصحفية"
                as="span"
              />
            </h2>
            
            <div className="bg-muted/30 p-8 rounded-2xl">
              <div className="text-muted-foreground leading-relaxed">
                <EditableContent 
                  pageKey="media-center" 
                  elementKey="press_content" 
                  elementType="rich_text"
                  fallback="<p>نشر آخر البيانات والمستجدات الرسمية من إدارة كلية إيلول الجامعية. للاستفسارات الإعلامية أو طلب المقابلات، يرجى التواصل مع المكتب الإعلامي للكلية.</p>"
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

export default EditableMediaCenter;