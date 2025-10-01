import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AboutSection } from '@/types/aboutSections';
import { Award, CheckCircle, Target, TrendingUp, FileText, Users, BarChart3, Settings, Home } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

interface QualityAssuranceContentProps {
  section: AboutSection;
}

export const QualityAssuranceContent: React.FC<QualityAssuranceContentProps> = ({ section }) => {
  const getElementContent = (key: string, fallback = '') => {
    const element = section.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={Award}
        title={getElementContent('page-title', 'وحدة التطوير وضمان الجودة')}
        subtitle={getElementContent('page-subtitle', 'نحو تعليم عالي الجودة ومعايير أكاديمية متميزة')}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'عن الكلية', href: '/about/college' },
          { label: 'ضمان الجودة' }
        ]}
      />

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="p-8 border border-border shadow-sm mb-12">
            <div 
              className="prose prose-lg max-w-none text-lg leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: getElementContent('introduction', 
                  '<p>تلعب وحدة التطوير وضمان الجودة في كلية إيلول الجامعية دوراً محورياً في ضمان جودة التعليم والعمليات الأكاديمية. تعمل الوحدة على تطبيق أفضل الممارسات العالمية في مجال ضمان الجودة الأكاديمية وتطوير البرامج التعليمية بما يتماشى مع المعايير الدولية.</p><p>نسعى من خلال هذه الوحدة إلى بناء ثقافة الجودة الشاملة في جميع أنحاء الكلية، والعمل على التحسين المستمر لجميع العمليات الأكاديمية والإدارية.</p>'
                )
              }}
            />
          </Card>

          {/* Main Functions Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Functions */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">أهداف الوحدة</h2>
              </div>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">ضمان جودة التعليم</h3>
                    <p className="text-muted-foreground">تطبيق معايير الجودة الأكاديمية في جميع البرامج والمقررات الدراسية</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">التطوير المستمر</h3>
                    <p className="text-muted-foreground">مراجعة وتطوير البرامج الأكاديمية بناءً على التغذية الراجعة والمعايير الحديثة</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">الاعتماد الأكاديمي</h3>
                    <p className="text-muted-foreground">العمل على الحصول على الاعتمادات الأكاديمية المحلية والدولية</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Statistics */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold">إحصائيات الجودة</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">البرامج المعتمدة</div>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
                  <div className="text-2xl font-bold text-secondary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">رضا الطلاب</div>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                  <div className="text-2xl font-bold text-accent mb-1">12</div>
                  <div className="text-sm text-muted-foreground">مؤشر جودة</div>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">A+</div>
                  <div className="text-sm text-muted-foreground">تقييم الجودة</div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  آخر التطورات
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 pb-2 border-b">
                    <Badge variant="default" className="text-xs">2024</Badge>
                    <span>تحديث معايير تقييم البرامج</span>
                  </div>
                  <div className="flex items-center gap-3 pb-2 border-b">
                    <Badge variant="outline" className="text-xs">2023</Badge>
                    <span>حصول على اعتماد ISO 9001</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">2023</Badge>
                    <span>إطلاق نظام إدارة الجودة الرقمي</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Services and Activities */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-accent/20 rounded-xl">
                <Settings className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">خدمات وأنشطة الوحدة</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <FileText className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-3">تقييم البرامج</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  مراجعة وتقييم دوري للبرامج الأكاديمية لضمان جودتها وفعاليتها في تحقيق الأهداف التعليمية
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Users className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-lg font-bold mb-3">تدريب الكوادر</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  تنظيم برامج تدريبية لأعضاء هيئة التدريس والموظفين حول معايير الجودة والتطوير المهني
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <BarChart3 className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-bold mb-3">المراقبة والتقييم</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  تطوير أنظمة مراقبة وتقييم فعالة لمتابعة الأداء الأكاديمي وضمان الالتزام بمعايير الجودة
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-bold mb-3">الاعتماد الأكاديمي</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  إعداد الكلية للحصول على الاعتمادات الأكاديمية المحلية والدولية والمحافظة عليها
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-3">التحسين المستمر</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  تطبيق منهجية التحسين المستمر في جميع العمليات الأكاديمية والإدارية بالكلية
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Award className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-lg font-bold mb-3">المعايير الدولية</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  تطبيق المعايير الدولية لضمان الجودة والتوافق مع أفضل الممارسات العالمية
                </p>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="p-8 bg-gradient-to-br from-muted/30 to-muted/10">
            <h3 className="text-2xl font-bold mb-6 text-center">تواصل مع وحدة ضمان الجودة</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <h4 className="font-semibold mb-2">البريد الإلكتروني</h4>
                <p className="text-sm text-muted-foreground">quality@eylul.edu.ps</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-secondary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl">📞</span>
                </div>
                <h4 className="font-semibold mb-2">الهاتف</h4>
                <p className="text-sm text-muted-foreground">+970 x xxx xxxx</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-accent/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl">📍</span>
                </div>
                <h4 className="font-semibold mb-2">المكتب</h4>
                <p className="text-sm text-muted-foreground">مبنى الإدارة - الطابق الأول</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};