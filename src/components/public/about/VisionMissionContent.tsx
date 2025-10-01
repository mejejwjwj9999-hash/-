import React from 'react';
import { Card } from '@/components/ui/card';
import { AboutSection } from '@/types/aboutSections';
import { Eye, Target, Compass, CheckCircle, Home } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

interface VisionMissionContentProps {
  section: AboutSection;
}

export const VisionMissionContent: React.FC<VisionMissionContentProps> = ({ section }) => {
  const getElementContent = (key: string, fallback = '') => {
    const element = section.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={Compass}
        title={getElementContent('page-title', 'الرؤية والرسالة والأهداف')}
        subtitle={getElementContent('page-subtitle', 'نحو مستقبل أكاديمي متميز ومجتمع معرفي رائد')}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'عن الكلية', href: '/about/college' },
          { label: 'الرؤية والرسالة' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          
          {/* Vision Section */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-primary">رؤيتنا</h2>
            </div>
            <div 
              className="prose prose-lg max-w-none text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: getElementContent('vision-content', 
                  '<p>أن نكون كلية رائدة في التعليم العالي والبحث العلمي، تساهم في بناء مجتمع معرفي متقدم وإعداد خريجين مؤهلين للمنافسة في سوق العمل المحلي والإقليمي والعالمي.</p>'
                )
              }}
            />
          </Card>

          {/* Mission Section */}
          <Card className="p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-secondary/20 rounded-xl">
                <Target className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-secondary">رسالتنا</h2>
            </div>
            <div 
              className="prose prose-lg max-w-none text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: getElementContent('mission-content', 
                  `<p>تقديم تعليم عالي الجودة في مختلف التخصصات الأكاديمية والمهنية، وتعزيز البحث العلمي والابتكار، وخدمة المجتمع من خلال:</p>
                  <ul class="space-y-2 mt-4">
                    <li>• توفير برامج أكاديمية معتمدة ومتطورة</li>
                    <li>• إعداد كوادر مؤهلة ومتخصصة</li>
                    <li>• تعزيز قيم البحث العلمي والإبداع</li>
                    <li>• بناء شراكات استراتيجية محلية ودولية</li>
                  </ul>`
                )
              }}
            />
          </Card>

          {/* Strategic Objectives */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-accent/20 rounded-xl">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">أهدافنا الاستراتيجية</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-primary">التميز الأكاديمي</h3>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getElementContent('academic-excellence', 
                      '<ul class="space-y-2"><li>• تطوير البرامج الأكاديمية بما يواكب التطورات العالمية</li><li>• ضمان جودة التعليم والتعلم</li><li>• تعزيز استخدام التكنولوجيا في التعليم</li></ul>'
                    )
                  }}
                />
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-secondary">البحث والابتكار</h3>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getElementContent('research-innovation', 
                      '<ul class="space-y-2"><li>• تشجيع البحث العلمي والنشر الأكاديمي</li><li>• دعم المشاريع البحثية التطبيقية</li><li>• بناء مراكز بحثية متخصصة</li></ul>'
                    )
                  }}
                />
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-accent">خدمة المجتمع</h3>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getElementContent('community-service', 
                      '<ul class="space-y-2"><li>• تقديم برامج التعليم المستمر</li><li>• المشاركة في حل قضايا المجتمع</li><li>• تعزيز الشراكة مع المؤسسات المحلية</li></ul>'
                    )
                  }}
                />
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-primary">التطوير المؤسسي</h3>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getElementContent('institutional-development', 
                      '<ul class="space-y-2"><li>• تطوير البنية التحتية والمرافق</li><li>• تنمية الموارد البشرية</li><li>• تحسين الأنظمة الإدارية والأكاديمية</li></ul>'
                    )
                  }}
                />
              </Card>
            </div>
          </div>

          {/* Values Section */}
          <Card className="p-8 bg-gradient-to-br from-muted/30 to-muted/10 border">
            <h2 className="text-2xl font-bold mb-6 text-center">قيمنا الأساسية</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-bold mb-2">الجودة والتميز</h3>
                <p className="text-sm text-muted-foreground">السعي المستمر لتحقيق أعلى معايير الجودة في جميع أنشطتنا</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="font-bold mb-2">الشفافية والمصداقية</h3>
                <p className="text-sm text-muted-foreground">العمل بوضوح وصدق في جميع التعاملات والقرارات</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="font-bold mb-2">الابتكار والإبداع</h3>
                <p className="text-sm text-muted-foreground">تشجيع التفكير النقدي والحلول الإبداعية</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};