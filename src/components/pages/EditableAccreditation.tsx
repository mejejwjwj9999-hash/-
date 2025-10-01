import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';

const EditableAccreditation = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <EditableContent 
                pageKey="accreditation" 
                elementKey="page_title" 
                elementType="text"
                fallback="الاعتماد الأكاديمي"
                as="span"
              />
            </h1>
            <p className="text-xl text-muted-foreground">جودة معتمدة وتميز أكاديمي مضمون</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm mb-12">
              <p className="text-lg leading-relaxed text-muted-foreground">
                <EditableContent 
                  pageKey="accreditation" 
                  elementKey="content" 
                  elementType="rich_text"
                  fallback="حصلت كلية إيلول على الاعتماد الأكاديمي من وزارة التعليم العالي والبحث العلمي، وتخضع جميع برامجها الأكاديمية للمراجعة والتقييم المستمر لضمان جودة التعليم"
                  as="span"
                />
              </p>
            </div>

            {/* Accreditation Features */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl border border-primary/20">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">اعتماد رسمي</h3>
                <p className="text-muted-foreground">
                  جميع برامجنا الأكاديمية معتمدة رسمياً من وزارة التعليم العالي والبحث العلمي في الجمهورية اليمنية
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-8 rounded-2xl border border-secondary/20">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">تقييم مستمر</h3>
                <p className="text-muted-foreground">
                  نخضع لمراجعة دورية شاملة لضمان استمرارية الجودة والتحسين المستمر في جميع البرامج الأكاديمية
                </p>
              </div>
            </div>

            {/* Accreditation Benefits */}
            <div className="bg-muted/30 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground text-center">مميزات الاعتماد الأكاديمي</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">شهادات معترف بها</h4>
                  <p className="text-sm text-muted-foreground">جميع شهاداتنا معتمدة ومعترف بها محلياً وإقليمياً</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">جودة التعليم</h4>
                  <p className="text-sm text-muted-foreground">معايير عالية في التدريس والمناهج والمرافق التعليمية</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">فرص وظيفية</h4>
                  <p className="text-sm text-muted-foreground">خريجونا مؤهلون للعمل في القطاعين العام والخاص</p>
                </div>
              </div>
            </div>

            {/* Quality Assurance Process */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-8 text-foreground text-center">عملية ضمان الجودة</h2>
              <div className="relative">
                <div className="absolute top-6 right-0 left-0 h-0.5 bg-gradient-to-l from-primary via-secondary to-accent"></div>
                <div className="grid md:grid-cols-4 gap-8 relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-foreground">التخطيط</h4>
                    <p className="text-sm text-muted-foreground">وضع معايير الجودة والأهداف التعليمية</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-foreground">التنفيذ</h4>
                    <p className="text-sm text-muted-foreground">تطبيق البرامج الأكاديمية وفق المعايير المحددة</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-foreground">المراقبة</h4>
                    <p className="text-sm text-muted-foreground">متابعة مستمرة لأداء البرامج والطلاب</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center relative z-10">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-foreground">التحسين</h4>
                    <p className="text-sm text-muted-foreground">تطوير مستمر بناءً على التقييم والمراجعة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableAccreditation;