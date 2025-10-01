import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AboutSection } from '@/types/aboutSections';
import { Users, Crown, User, Mail, Phone, MapPin, Home } from 'lucide-react';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

interface BoardMembersContentProps {
  section: AboutSection;
}

export const BoardMembersContent: React.FC<BoardMembersContentProps> = ({ section }) => {
  const getElementContent = (key: string, fallback = '') => {
    const element = section.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  // Mock board members data - in real implementation, this would come from the CMS
  const boardMembers = [
    {
      id: 1,
      name: 'د. أحمد محمد الأحمد',
      position: 'رئيس مجلس الإدارة',
      bio: 'خبرة واسعة في مجال التعليم العالي والإدارة الأكاديمية لأكثر من 20 عاماً',
      image: null,
      category: 'leadership'
    },
    {
      id: 2,
      name: 'د. فاطمة علي السعيد',
      position: 'نائب رئيس المجلس',
      bio: 'متخصصة في الإدارة التربوية وتطوير المناهج الأكاديمية',
      image: null,
      category: 'leadership'
    },
    {
      id: 3,
      name: 'أ. محمد يوسف حسن',
      position: 'عضو مجلس إدارة',
      bio: 'خبير في الشؤون المالية والإدارية للمؤسسات التعليمية',
      image: null,
      category: 'member'
    },
    {
      id: 4,
      name: 'د. سارة أحمد الخطيب',
      position: 'عضو مجلس إدارة',
      bio: 'أستاذة في كلية التربية وخبيرة في تكنولوجيا التعليم',
      image: null,
      category: 'member'
    },
    {
      id: 5,
      name: 'أ. عمر محمود النجار',
      position: 'عضو مجلس إدارة',
      bio: 'مختص في الشؤون القانونية والتنظيمية للمؤسسات الأكاديمية',
      image: null,
      category: 'member'
    },
    {
      id: 6,
      name: 'د. نور الدين عبد الرحمن',
      position: 'عضو مجلس إدارة',
      bio: 'أستاذ في الهندسة وخبير في التطوير التكنولوجي',
      image: null,
      category: 'member'
    }
  ];

  const leadershipMembers = boardMembers.filter(m => m.category === 'leadership');
  const regularMembers = boardMembers.filter(m => m.category === 'member');

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={Users}
        title={getElementContent('page-title', 'مجلس إدارة الكلية')}
        subtitle={getElementContent('page-subtitle', 'القيادات الأكاديمية والإدارية التي توجه مسيرة الكلية نحو التميز')}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'عن الكلية', href: '/about/college' },
          { label: 'مجلس الإدارة' }
        ]}
      />

      {/* Introduction */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="p-8 border border-border shadow-sm mb-12">
            <div 
              className="prose prose-lg max-w-none text-lg leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: getElementContent('introduction', 
                  '<p>يتكون مجلس إدارة كلية إيلول الجامعية من نخبة من الأكاديميين والخبراء المتميزين في مختلف المجالات، والذين يجمعون بين الخبرة العملية والرؤية الاستراتيجية لقيادة الكلية نحو مستقبل أكاديمي مشرق.</p><p>يعمل المجلس على وضع السياسات العامة للكلية ومتابعة تنفيذ الخطط الاستراتيجية لضمان تحقيق أهداف الكلية في التعليم والبحث العلمي وخدمة المجتمع.</p>'
                )
              }}
            />
          </Card>
        </div>
      </section>

      {/* Leadership Members */}
      <section className="pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">القيادة التنفيذية</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {leadershipMembers.map((member) => (
              <Card key={member.id} className="p-8 hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <Badge variant="default" className="mb-4">
                      {member.position}
                    </Badge>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>board@eylul.edu.ps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>مبنى الإدارة - الطابق الثاني</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Members */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-secondary/20 rounded-xl">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold">أعضاء المجلس</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularMembers.map((member) => (
              <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-10 h-10 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{member.name}</h3>
                  <Badge variant="outline" className="mb-3">
                    {member.position}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Board Responsibilities */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">مسؤوليات مجلس الإدارة</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-bold mb-3">وضع السياسات</h3>
              <p className="text-sm text-muted-foreground">وضع السياسات العامة والاستراتيجيات طويلة المدى للكلية</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-bold mb-3">الإشراف الأكاديمي</h3>
              <p className="text-sm text-muted-foreground">متابعة جودة البرامج الأكاديمية ومعايير التعليم</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="font-bold mb-3">الإدارة المالية</h3>
              <p className="text-sm text-muted-foreground">الإشراف على الميزانية والموارد المالية للكلية</p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold mb-3">التطوير المؤسسي</h3>
              <p className="text-sm text-muted-foreground">قيادة عمليات التطوير والتحديث المؤسسي</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};