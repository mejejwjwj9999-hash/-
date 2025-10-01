import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';
import EditableAcademicPrograms from '@/components/inline-editor/EditableAcademicPrograms';
import EditableHeroSection from '@/components/inline-editor/EditableHeroSection';
import EditableNewsEvents from '@/components/inline-editor/EditableNewsEvents';
import EditableQuickServices from '@/components/inline-editor/EditableQuickServices';

const EditableHomepage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <EditableHeroSection />
      
      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="about_title" 
                  elementType="text"
                  fallback="عن كلية إيلول"
                  as="span"
                />
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                <EditableContent 
                  pageKey="homepage" 
                  elementKey="about_description" 
                  elementType="rich_text"
                  fallback="تأسست كلية إيلول الجامعية بهدف تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية، وتتميز الكلية بكادرها التدريسي المتميز وبرامجها الأكاديمية المعتمدة"
                  as="span"
                />
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-card px-6 py-3 rounded-full border border-border">
                  <span className="text-sm font-medium text-foreground">تعليم معتمد</span>
                </div>
                <div className="bg-card px-6 py-3 rounded-full border border-border">
                  <span className="text-sm font-medium text-foreground">كادر متميز</span>
                </div>
                <div className="bg-card px-6 py-3 rounded-full border border-border">
                  <span className="text-sm font-medium text-foreground">مرافق حديثة</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-card p-8 rounded-3xl border border-border shadow-lg">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">14+</div>
                    <div className="text-sm text-muted-foreground">سنة من التميز</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary mb-2">5</div>
                    <div className="text-sm text-muted-foreground">تخصصات أكاديمية</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">اعتماد أكاديمي</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                    <div className="text-sm text-muted-foreground">خريج متميز</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <EditableAcademicPrograms />

      {/* News and Events */}
      <EditableNewsEvents />

      {/* Quick Services */}
      <EditableQuickServices />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <EditableContent 
              pageKey="homepage" 
              elementKey="cta_title" 
              elementType="text"
              fallback="ابدأ رحلتك التعليمية معنا اليوم"
              as="span"
            />
          </h2>
          <p className="text-xl mb-8 opacity-90">
            <EditableContent 
              pageKey="homepage" 
              elementKey="cta_description" 
              elementType="rich_text"
              fallback="انضم إلى مجتمع تعليمي متميز واحصل على تعليم عالي الجودة يؤهلك لسوق العمل"
              as="span"
            />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/admissions" 
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
            >
              <EditableContent 
                pageKey="homepage" 
                elementKey="cta_button_primary" 
                elementType="text"
                fallback="تقدم للالتحاق الآن"
                as="span"
              />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a 
              href="/academics" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              <EditableContent 
                pageKey="homepage" 
                elementKey="cta_button_secondary" 
                elementType="text"
                fallback="استكشف برامجنا"
                as="span"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableHomepage;