import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AboutSection } from '@/types/aboutSections';
import { Microscope, BookOpen, Users, TrendingUp, FileText, Award, Lightbulb, Database, Home } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

interface ScientificResearchContentProps {
  section: AboutSection;
}

export const ScientificResearchContent: React.FC<ScientificResearchContentProps> = ({ section }) => {
  const getElementContent = (key: string, fallback = '') => {
    const element = section.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  // Mock research data - in real implementation, this would come from the CMS
  const researchStats = {
    projects: 25,
    publications: 45,
    researchers: 18,
    funding: '500K'
  };

  const researchFields = [
    {
      name: 'تكنولوجيا المعلومات',
      description: 'أبحاث في الذكاء الاصطناعي وعلوم البيانات',
      projectCount: 8,
      color: 'primary'
    },
    {
      name: 'العلوم التربوية',
      description: 'دراسات في طرق التدريس والمناهج',
      projectCount: 6,
      color: 'secondary'
    },
    {
      name: 'إدارة الأعمال',
      description: 'بحوث في ريادة الأعمال والتسويق الرقمي',
      projectCount: 5,
      color: 'accent'
    },
    {
      name: 'العلوم الاجتماعية',
      description: 'دراسات مجتمعية وسلوكية',
      projectCount: 6,
      color: 'green'
    }
  ];

  const recentPublications = [
    {
      title: 'تطبيق الذكاء الاصطناعي في التعليم العالي',
      authors: 'د. أحمد السعيد، د. فاطمة النجار',
      journal: 'مجلة التقنيات التعليمية',
      year: '2024'
    },
    {
      title: 'استراتيجيات التعلم الرقمي في ظل التحولات التكنولوجية',
      authors: 'د. محمد الأحمد، أ. سارة حسن',
      journal: 'المجلة العربية للتعليم الإلكتروني',
      year: '2024'
    },
    {
      title: 'دور ريادة الأعمال في التنمية الاقتصادية المحلية',
      authors: 'د. عمر يوسف، د. نور الخطيب',
      journal: 'مجلة دراسات الأعمال',
      year: '2023'
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={Microscope}
        title={getElementContent('page-title', 'مركز البحث العلمي والدراسات')}
        subtitle={getElementContent('page-subtitle', 'الإبداع والابتكار في خدمة المعرفة والمجتمع')}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'عن الكلية', href: '/about/college' },
          { label: 'البحث العلمي' }
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
                  '<p>يُعتبر مركز البحث العلمي والدراسات في كلية إيلول الجامعية نواة الإبداع والابتكار، حيث يضم نخبة من الباحثين المتميزين الذين يعملون على إنتاج المعرفة العلمية وتطوير الحلول المبتكرة للتحديات المعاصرة.</p><p>يهدف المركز إلى تعزيز ثقافة البحث العلمي بين الطلاب وأعضاء هيئة التدريس، وإجراء بحوث تطبيقية تخدم المجتمع المحلي والإقليمي، بالإضافة إلى بناء شراكات بحثية مع مؤسسات أكاديمية ومراكز بحثية متقدمة.</p>'
                )
              }}
            />
          </Card>

          {/* Statistics Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{researchStats.projects}</div>
              <div className="text-muted-foreground">مشروع بحثي نشط</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
              <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">{researchStats.publications}</div>
              <div className="text-muted-foreground">بحث منشور</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
              <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">{researchStats.researchers}</div>
              <div className="text-muted-foreground">باحث متخصص</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">${researchStats.funding}</div>
              <div className="text-muted-foreground">تمويل بحثي</div>
            </Card>
          </div>

          {/* Research Fields */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">مجالات البحث</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {researchFields.map((field, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${field.color}/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Microscope className={`w-6 h-6 text-${field.color === 'green' ? 'green-600' : field.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{field.name}</h3>
                      <p className="text-muted-foreground mb-3">{field.description}</p>
                      <Badge variant="outline">
                        {field.projectCount} مشاريع نشطة
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Publications */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-secondary/20 rounded-xl">
                <FileText className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold">أحدث المنشورات البحثية</h2>
            </div>

            <div className="space-y-4">
              {recentPublications.map((pub, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-primary">{pub.title}</h3>
                      <p className="text-muted-foreground mb-2">
                        <strong>المؤلفون:</strong> {pub.authors}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        نُشر في: <em>{pub.journal}</em>
                      </p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {pub.year}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Research Services */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-accent/20 rounded-xl">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">خدمات المركز</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="font-bold mb-3">الدعم البحثي</h3>
                <p className="text-sm text-muted-foreground">
                  تقديم الدعم الفني والأكاديمي للباحثين في جميع مراحل البحث
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-bold mb-3">الاستشارات البحثية</h3>
                <p className="text-sm text-muted-foreground">
                  تقديم استشارات متخصصة في منهجية البحث والتحليل الإحصائي
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-bold mb-3">النشر الأكاديمي</h3>
                <p className="text-sm text-muted-foreground">
                  مساعدة الباحثين في نشر أبحاثهم في المجلات العلمية المحكمة
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-bold mb-3">الشراكات البحثية</h3>
                <p className="text-sm text-muted-foreground">
                  تسهيل التعاون البحثي مع مؤسسات أكاديمية محلية ودولية
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-bold mb-3">التمويل البحثي</h3>
                <p className="text-sm text-muted-foreground">
                  المساعدة في الحصول على منح بحثية من مصادر محلية ودولية
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-bold mb-3">تحليل البيانات</h3>
                <p className="text-sm text-muted-foreground">
                  خدمات تحليل البيانات البحثية باستخدام أحدث الأدوات والتقنيات
                </p>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <Card className="p-8 bg-gradient-to-br from-muted/30 to-muted/10">
            <h3 className="text-2xl font-bold mb-6 text-center">تواصل مع مركز البحث العلمي</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <h4 className="font-semibold mb-2">البريد الإلكتروني</h4>
                <p className="text-sm text-muted-foreground">research@eylul.edu.ps</p>
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
                <p className="text-sm text-muted-foreground">مبنى البحث العلمي - الطابق الثاني</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};