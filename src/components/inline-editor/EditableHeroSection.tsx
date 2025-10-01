import React from 'react';
import { EditableContent } from './EditableContent';
import { Link } from 'react-router-dom';

const EditableHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              <EditableContent 
                pageKey="homepage" 
                elementKey="hero_title" 
                elementType="text"
                fallback="أهلاً بكم في كلية إيلول الجامعية"
                as="span"
              />
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            <EditableContent 
              pageKey="homepage" 
              elementKey="hero_subtitle" 
              elementType="rich_text"
              fallback="كلية رائدة في التعليم العالي والبحث العلمي، نسعى لإعداد كوادر مؤهلة تواكب متطلبات سوق العمل المحلي والإقليمي"
              as="span"
            />
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/admissions"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <EditableContent 
                pageKey="homepage" 
                elementKey="hero_cta" 
                elementType="text"
                fallback="ابدأ رحلتك التعليمية معنا"
                as="span"
              />
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              to="/academics"
              className="inline-flex items-center gap-3 border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300"
            >
              <EditableContent 
                pageKey="homepage" 
                elementKey="hero_secondary_cta" 
                elementType="text"
                fallback="استكشف برامجنا"
                as="span"
              />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditableHeroSection;