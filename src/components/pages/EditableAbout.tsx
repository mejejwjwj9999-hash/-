import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';

const EditableAbout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <EditableContent 
                pageKey="about" 
                elementKey="page_title" 
                elementType="text"
                fallback="حول الكلية"
                as="span"
              />
            </h1>
            <p className="text-xl text-muted-foreground">
              <EditableContent 
                pageKey="about" 
                elementKey="page_subtitle" 
                elementType="text"
                fallback="تميز أكاديمي وريادة في التعليم العالي"
                as="span"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm mb-12">
              <div className="text-lg leading-relaxed text-muted-foreground">
                <EditableContent 
                  pageKey="about" 
                  elementKey="main_content" 
                  elementType="rich_text"
                  fallback="<p>تأسست كلية إيلول الجامعية بهدف تقديم تعليم عالي الجودة في مختلف التخصصات العلمية والإنسانية. تتميز الكلية بكادرها التدريسي المتميز وبرامجها الأكاديمية المعتمدة، وتسعى لإعداد خريجين مؤهلين لسوق العمل ومساهمين في تنمية المجتمع.</p><p>منذ تأسيسها، تواصل الكلية تطوير برامجها ومرافقها لتواكب أحدث المعايير التعليمية والتطورات في مجال التعليم العالي.</p>"
                  as="div"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  <EditableContent 
                    pageKey="about" 
                    elementKey="stat_years" 
                    elementType="text"
                    fallback="14+"
                    as="span"
                  />
                </div>
                <div className="text-sm text-muted-foreground">سنة من التميز</div>
              </div>
              
              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-6 rounded-2xl border border-secondary/20 text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  <EditableContent 
                    pageKey="about" 
                    elementKey="stat_programs" 
                    elementType="text"
                    fallback="5"
                    as="span"
                  />
                </div>
                <div className="text-sm text-muted-foreground">برامج أكاديمية</div>
              </div>
              
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-6 rounded-2xl border border-accent/20 text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  <EditableContent 
                    pageKey="about" 
                    elementKey="stat_graduates" 
                    elementType="text"
                    fallback="1000+"
                    as="span"
                  />
                </div>
                <div className="text-sm text-muted-foreground">خريج متميز</div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-2xl border border-border text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  <EditableContent 
                    pageKey="about" 
                    elementKey="stat_accreditation" 
                    elementType="text"
                    fallback="100%"
                    as="span"
                  />
                </div>
                <div className="text-sm text-muted-foreground">اعتماد أكاديمي</div>
              </div>
            </div>

            {/* Additional Content */}
            <div className="bg-muted/30 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                <EditableContent 
                  pageKey="about" 
                  elementKey="values_title" 
                  elementType="text"
                  fallback="قيمنا ومبادئنا"
                  as="span"
                />
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <EditableContent 
                  pageKey="about" 
                  elementKey="values_content" 
                  elementType="rich_text"
                  fallback="<p>نؤمن في كلية إيلول بأهمية التعليم كركيزة أساسية لبناء المجتمعات ونهضتها. نسعى لتقديم تعليم متميز يواكب التطورات العالمية ويلبي احتياجات السوق المحلي والإقليمي.</p>"
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

export default EditableAbout;