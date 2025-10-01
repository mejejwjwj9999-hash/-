import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AboutSection } from '@/types/aboutSections';
import { User, Quote, Mail, Phone, MapPin, Home } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

interface DeanMessageContentProps {
  section: AboutSection;
}

export const DeanMessageContent: React.FC<DeanMessageContentProps> = ({ section }) => {
  const getElementContent = (key: string, fallback = '') => {
    const element = section.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={User}
        title={getElementContent('page-title', 'كلمة عميد الكلية')}
        subtitle={getElementContent('page-subtitle', 'رسالة من القيادة الأكاديمية للكلية')}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'عن الكلية', href: '/about/college' },
          { label: 'كلمة العميد' }
        ]}
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Dean Profile */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {getElementContent('dean-name', 'د. [اسم العميد]')}
                  </h3>
                  <Badge variant="outline" className="mb-4">
                    {getElementContent('dean-title', 'عميد الكلية')}
                  </Badge>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>dean@eylul.edu.ps</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>+970 x xxx xxxx</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>مكتب العمادة</span>
                  </div>
                </div>

                {/* Quick Bio */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">نبذة مختصرة</h4>
                  <div 
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: getElementContent('dean-bio', 
                        '<p>خبرة واسعة في مجال التعليم العالي والإدارة الأكاديمية.</p>'
                      )
                    }}
                  />
                </div>
              </Card>
            </div>

            {/* Dean Message */}
            <div className="lg:col-span-3">
              <Card className="p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Quote className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">رسالة العميد</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-lg leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: getElementContent('dean-message', 
                        `<p>أهلاً وسهلاً بكم في كلية إيلول الجامعية، منارة العلم والمعرفة التي تسعى لإعداد جيل من المتعلمين والمبدعين القادرين على مواجهة تحديات المستقبل.</p>
                        
                        <p>إن كليتنا تتميز بكوادرها الأكاديمية المتخصصة وبرامجها التعليمية المتطورة التي تواكب أحدث التطورات في مجالات المعرفة المختلفة. نحن ملتزمون بتقديم تعليم عالي الجودة يجمع بين النظرية والتطبيق، ويهدف إلى إكساب طلابنا المهارات والمعارف اللازمة للنجاح في حياتهم المهنية.</p>
                        
                        <p>كما نؤكد على أهمية البحث العلمي والابتكار كركائز أساسية في رسالتنا التعليمية، ونشجع طلابنا وأعضاء هيئة التدريس على المشاركة في الأنشطة البحثية والإبداعية.</p>
                        
                        <p>نحن نفخر بكوننا جزءًا من المجتمع الفلسطيني، ونسعى لخدمة مجتمعنا من خلال إعداد كوادر مؤهلة تساهم في التنمية المستدامة وبناء المستقبل.</p>`
                      )
                    }}
                  />
                </div>

                {/* Signature */}
                <div className="mt-8 pt-6 border-t">
                  <div className="text-right">
                    <p className="font-semibold text-lg mb-1">
                      {getElementContent('dean-name', 'د. [اسم العميد]')}
                    </p>
                    <p className="text-muted-foreground">عميد كلية إيلول الجامعية</p>
                  </div>
                </div>
              </Card>

              {/* Additional Info */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">التخصصات والخبرات</h3>
                  <div 
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: getElementContent('dean-expertise', 
                        '<ul class="space-y-2"><li>• الإدارة التربوية</li><li>• القيادة الأكاديمية</li><li>• تطوير المناهج</li></ul>'
                      )
                    }}
                  />
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">الإنجازات والأهداف</h3>
                  <div 
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: getElementContent('dean-achievements', 
                        '<ul class="space-y-2"><li>• تطوير البرامج الأكاديمية</li><li>• تعزيز جودة التعليم</li><li>• بناء شراكات محلية ودولية</li></ul>'
                      )
                    }}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};