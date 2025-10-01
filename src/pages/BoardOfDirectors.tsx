import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Crown, Building, Award, User, Loader2, Home } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';

const BoardOfDirectors = () => {
  const { data: section, isLoading, error } = usePublicAboutSection('about-board-members');

  const getElementContent = (key: string, fallback = '') => {
    const element = section?.elements?.find(el => el.element_key === key);
    return element?.content_ar || fallback;
  };

  const getBoardMembers = () => {
    const element = section?.elements?.find(el => el.element_key === 'board_members');
    return element?.metadata?.members || [
      {
        id: 1,
        name: 'الأستاذ الدكتور أحمد محمد الشامي',
        position: 'رئيس مجلس الإدارة',
        qualification: 'دكتوراه في إدارة الأعمال',
        experience: '25 عاماً في الإدارة التعليمية',
        icon: 'Crown',
        category: 'leadership'
      },
      {
        id: 2,
        name: 'الدكتور محمد عبدالله الحوثي',
        position: 'عميد الكلية',
        qualification: 'دكتوراه في الطب',
        experience: '20 عاماً في التعليم الطبي',
        icon: 'Users',
        category: 'leadership'
      },
      {
        id: 3,
        name: 'الأستاذ علي أحمد المؤيد',
        position: 'نائب رئيس المجلس',
        qualification: 'ماجستير في الإدارة العامة',
        experience: '18 عاماً في الإدارة الأكاديمية',
        icon: 'Building',
        category: 'member'
      },
      {
        id: 4,
        name: 'الدكتورة فاطمة محمد الزبيري',
        position: 'عضو مجلس إدارة',
        qualification: 'دكتوراه في التمريض',
        experience: '15 عاماً في التعليم التمريضي',
        icon: 'Award',
        category: 'member'
      },
      {
        id: 5,
        name: 'الأستاذ يحيى عبدالرحمن الحداد',
        position: 'عضو مجلس إدارة',
        qualification: 'ماجستير في المالية',
        experience: '20 عاماً في الإدارة المالية',
        icon: 'Building',
        category: 'member'
      },
      {
        id: 6,
        name: 'الدكتور صالح أحمد العماد',
        position: 'عضو مجلس إدارة',
        qualification: 'دكتوراه في الصيدلة',
        experience: '12 عاماً في التعليم الصيدلاني',
        icon: 'Award',
        category: 'member'
      }
    ];
  };

  const getResponsibilities = () => {
    const element = section?.elements?.find(el => el.element_key === 'responsibilities');
    return element?.metadata?.responsibilities || [
      {
        title: 'وضع السياسات العامة',
        description: 'وضع السياسات العامة والاستراتيجيات طويلة المدى للكلية'
      },
      {
        title: 'الإشراف الأكاديمي',
        description: 'متابعة جودة البرامج الأكاديمية ومعايير التعليم'
      },
      {
        title: 'الإدارة المالية',
        description: 'الإشراف على الميزانية والموارد المالية للكلية'
      },
      {
        title: 'التطوير المؤسسي',
        description: 'قيادة عمليات التطوير والتحديث المؤسسي'
      }
    ];
  };

  const getMeetings = () => {
    const element = section?.elements?.find(el => el.element_key === 'meetings');
    return element?.metadata?.meetings || [
      {
        type: 'الاجتماع الاعتيادي',
        frequency: 'كل شهر',
        color: 'bg-university-blue-light'
      },
      {
        type: 'الاجتماع الطارئ',
        frequency: 'عند الحاجة',
        color: 'bg-university-red-light'
      },
      {
        type: 'الاجتماع السنوي',
        frequency: 'مرة في السنة',
        color: 'bg-university-gold-light'
      }
    ];
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Crown, Users, Building, Award, User
    };
    return icons[iconName] || User;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل مجلس الإدارة...</p>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">حدث خطأ في تحميل المحتوى</p>
          <p className="text-muted-foreground">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      </div>
    );
  }

  const boardMembers = getBoardMembers();
  const responsibilities = getResponsibilities();
  const meetings = getMeetings();
  const leadershipMembers = boardMembers.filter((m: any) => m.category === 'leadership');
  const regularMembers = boardMembers.filter((m: any) => m.category === 'member');

  return (
    <>
      <Helmet>
        <title>مجلس الإدارة - كلية إيلول الجامعية</title>
        <meta name="description" content="تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية والقيادات الأكاديمية والإدارية" />
        <meta name="keywords" content="مجلس الإدارة، القيادة، أعضاء المجلس، كلية إيلول، الإدارة الأكاديمية" />
        <link rel="canonical" href={`${window.location.origin}/board-of-directors`} />
        <meta property="og:title" content="مجلس الإدارة - كلية إيلول الجامعية" />
        <meta property="og:description" content="تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية والقيادات الأكاديمية والإدارية" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/board-of-directors`} />
      </Helmet>
      
      <div className="min-h-screen bg-background" dir="rtl">
        <UnifiedHeroSection
          icon={Users}
          title={getElementContent('page_title', 'مجلس الإدارة')}
          subtitle={getElementContent('page_subtitle', 'تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية ومسؤولياتهم')}
          breadcrumb={
            <UnifiedBackButton 
              breadcrumbs={[
                { label: 'الرئيسية', href: '/', icon: Home },
                { label: 'مجلس الإدارة', icon: Users }
              ]}
            />
          }
        />

        {/* Introduction */}
        {getElementContent('introduction') && (
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="p-8 bg-card rounded-xl border shadow-sm mb-12">
                <div 
                  className="prose prose-lg max-w-none text-lg leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: getElementContent('introduction', 
                      'يتكون مجلس إدارة كلية إيلول الجامعية من نخبة من الأكاديميين والخبراء المتميزين في مختلف المجالات، والذين يجمعون بين الخبرة العملية والرؤية الاستراتيجية لقيادة الكلية نحو مستقبل أكاديمي مشرق.'
                    )
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Leadership Members */}
        {leadershipMembers.length > 0 && (
          <section className="pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">القيادة التنفيذية</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {leadershipMembers.map((member: any, index: number) => {
                  const IconComponent = getIconComponent(member.icon);
                  return (
                    <div key={member.id || index} className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-12 h-12 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                          <div className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium mb-4">
                            {member.position}
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">المؤهل العلمي:</span>
                              <p className="text-foreground">{member.qualification}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">الخبرة:</span>
                              <p className="text-foreground">{member.experience}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Regular Members */}
        {regularMembers.length > 0 && (
          <section className="pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold">أعضاء المجلس</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularMembers.map((member: any, index: number) => {
                  const IconComponent = getIconComponent(member.icon);
                  return (
                    <div key={member.id || index} className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-lg transition-shadow">
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <IconComponent className="w-10 h-10 text-secondary" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">{member.name}</h3>
                        <div className="inline-block px-3 py-1 border rounded-full text-sm text-muted-foreground mb-3">
                          {member.position}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-center">
                        <div>
                          <span className="font-medium text-muted-foreground">المؤهل:</span>
                          <p className="text-foreground">{member.qualification}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">الخبرة:</span>
                          <p className="text-foreground">{member.experience}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Board Responsibilities */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">مسؤوليات مجلس الإدارة</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {responsibilities.map((responsibility: any, index: number) => (
                <div key={index} className="p-6 bg-card rounded-xl border shadow-sm text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">
                      {index === 0 ? '📋' : index === 1 ? '👥' : index === 2 ? '💼' : '🎯'}
                    </span>
                  </div>
                  <h3 className="font-bold mb-3">{responsibility.title}</h3>
                  <p className="text-sm text-muted-foreground">{responsibility.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meeting Schedule */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-4xl mx-auto">
              <div className="p-8 bg-card rounded-xl border shadow-sm">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">جدولة الاجتماعات</h2>
                  <div className="w-24 h-1 bg-primary mx-auto"></div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  {meetings.map((meeting: any, index: number) => (
                    <div key={index} className={`p-6 ${meeting.color || 'bg-muted'} rounded-lg`}>
                      <h3 className="text-lg font-bold mb-2">{meeting.type}</h3>
                      <p className="text-muted-foreground">{meeting.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BoardOfDirectors;