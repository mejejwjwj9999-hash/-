import React from 'react';
import { EditableContent } from './EditableContent';

const EditableNewsEvents = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-8 mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              <EditableContent 
                pageKey="homepage" 
                elementKey="news_title" 
                elementType="text"
                fallback="آخر الأخبار"
                as="span"
              />
            </h2>
            <h2 className="text-3xl font-bold text-foreground">
              <EditableContent 
                pageKey="homepage" 
                elementKey="events_title" 
                elementType="text"
                fallback="الفعاليات القادمة"
                as="span"
              />
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <EditableContent 
              pageKey="homepage" 
              elementKey="news_subtitle" 
              elementType="rich_text"
              fallback="تابع أحدث الأخبار والفعاليات والإعلانات الهامة من كلية إيلول الجامعية"
              as="span"
            />
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <article className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="relative overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="خبر 1"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  إعلانات
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                15 يناير 2024
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                بدء التسجيل للفصل الدراسي الجديد
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                تعلن الكلية عن فتح باب التسجيل للطلاب الجدد للفصل الدراسي القادم
              </p>
            </div>
          </article>

          <article className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="relative overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="خبر 2"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                  فعاليات
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                20 يناير 2024
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                ورشة عمل حول تطوير المهارات المهنية
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                تنظم الكلية ورشة عمل تهدف إلى تطوير مهارات الطلاب المهنية
              </p>
            </div>
          </article>

          <article className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="relative overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="خبر 3"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                  أخبار
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                25 يناير 2024
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                توقيع اتفاقية شراكة مع مستشفى الثورة
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                وقعت الكلية اتفاقية شراكة مع مستشفى الثورة لتدريب طلاب التمريض والقبالة
              </p>
            </div>
          </article>
        </div>

        {/* View All Buttons */}
        <div className="text-center flex flex-wrap justify-center gap-4">
          <a 
            href="/academic-calendar" 
            className="inline-flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary/90 transition-colors"
          >
            <EditableContent 
              pageKey="homepage" 
              elementKey="view_academic_calendar" 
              elementType="text"
              fallback="عرض التقويم الأكاديمي"
              as="span"
            />
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </a>
          <a 
            href="/news" 
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <EditableContent 
              pageKey="homepage" 
              elementKey="news_view_all" 
              elementType="text"
              fallback="عرض جميع الأخبار"
              as="span"
            />
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default EditableNewsEvents;