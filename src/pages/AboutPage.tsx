import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Award, Beaker, TrendingUp } from 'lucide-react';
import { usePublicAboutSection } from '@/hooks/useAboutSections';
import { BoardMember, QualityStatistic, ResearchProject } from '@/types/aboutSections';

const AboutPage: React.FC = () => {
  const { sectionKey } = useParams<{ sectionKey: string }>();
  const { data: section, isLoading, error } = usePublicAboutSection(sectionKey || '');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground">لم يتم العثور على المحتوى المطلوب</p>
      </div>
    );
  }

  const renderContent = () => {
    if (!section.elements || section.elements.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">لا يوجد محتوى</h2>
          <p className="text-muted-foreground">لم يتم إضافة محتوى لهذا القسم بعد</p>
        </div>
      );
    }

    switch (sectionKey) {
      case 'about-college':
        return renderAboutCollege();
      case 'about-dean-word':
        return renderDeanWord();
      case 'about-vision-mission':
        return renderVisionMission();
      case 'about-board-members':
        return renderBoardMembers();
      case 'about-quality-assurance':
        return renderQualityAssurance();
      case 'about-scientific-research':
        return renderScientificResearch();
      default:
        return renderGenericContent();
    }
  };

  const getElementContent = (elementKey: string) => {
    const element = section.elements?.find(el => el.element_key === elementKey);
    return element;
  };

  const renderAboutCollege = () => {
    const heroTitle = getElementContent('hero-title');
    const heroDescription = getElementContent('hero-description');
    const historySection = getElementContent('history-section');

    return (
      <div className="space-y-8">
        {heroTitle && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{heroTitle.content_ar}</h1>
            {heroDescription && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {heroDescription.content_ar}
              </p>
            )}
          </div>
        )}
        
        {historySection && (
          <Card>
            <CardHeader>
              <CardTitle>تاريخ الكلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: historySection.content_ar || '' }} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderDeanWord = () => {
    const deanName = getElementContent('dean-name');
    const deanImage = getElementContent('dean-image');
    const deanMessage = getElementContent('dean-message');

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">كلمة العميد</h1>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  {deanImage?.content_ar ? (
                    <img 
                      src={deanImage.content_ar} 
                      alt={deanName?.content_ar || 'عميد الكلية'}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-24 h-24 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-right">
                  {deanName && (
                    <h2 className="text-2xl font-bold mb-2">{deanName.content_ar}</h2>
                  )}
                  <p className="text-primary font-medium mb-6">عميد الكلية</p>
                  
                  {deanMessage && (
                    <div 
                      className="text-lg leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: deanMessage.content_ar || '' }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderVisionMission = () => {
    const visionText = getElementContent('vision-text');
    const missionText = getElementContent('mission-text');
    const objectivesList = getElementContent('objectives-list');

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">الرؤية والرسالة والأهداف</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {visionText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-primary">الرؤية</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-center text-lg"
                  dangerouslySetInnerHTML={{ __html: visionText.content_ar || '' }}
                />
              </CardContent>
            </Card>
          )}
          
          {missionText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-primary">الرسالة</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-center text-lg"
                  dangerouslySetInnerHTML={{ __html: missionText.content_ar || '' }}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        {objectivesList && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-primary">الأهداف</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-lg space-y-2"
                dangerouslySetInnerHTML={{ __html: objectivesList.content_ar || '' }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderBoardMembers = () => {
    const membersElement = getElementContent('board-members-list');
    const members = membersElement?.metadata?.members as BoardMember[] || [];

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">أعضاء مجلس الإدارة</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name_ar}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{member.name_ar}</h3>
                <p className="text-primary font-medium mb-3">{member.position_ar}</p>
                {member.bio_ar && (
                  <p className="text-sm text-muted-foreground">{member.bio_ar}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderQualityAssurance = () => {
    const overviewElement = getElementContent('quality-overview');
    const statsElement = getElementContent('quality-statistics');
    const statistics = statsElement?.metadata?.stats as QualityStatistic[] || [];

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">وحدة ضمان الجودة</h1>
        
        {overviewElement && (
          <Card>
            <CardContent className="p-8">
              <div 
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: overviewElement.content_ar || '' }}
              />
            </CardContent>
          </Card>
        )}
        
        {statistics.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">إحصائيات الجودة</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statistics.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <TrendingUp className="w-12 h-12 mx-auto text-primary" />
                    </div>
                    <div 
                      className="text-3xl font-bold mb-2"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label_ar}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderScientificResearch = () => {
    const overviewElement = getElementContent('research-overview');
    const projectsElement = getElementContent('research-projects');
    const projects = projectsElement?.metadata?.projects as ResearchProject[] || [];

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">البحث العلمي</h1>
        
        {overviewElement && (
          <Card>
            <CardContent className="p-8">
              <div 
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: overviewElement.content_ar || '' }}
              />
            </CardContent>
          </Card>
        )}
        
        {projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6">مشاريع البحث العلمي</h2>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{project.title_ar}</h3>
                      <Badge
                        variant={
                          project.status === 'active' ? 'default' :
                          project.status === 'completed' ? 'secondary' : 'outline'
                        }
                      >
                        {project.status === 'active' ? 'نشط' :
                         project.status === 'completed' ? 'مكتمل' : 'مخطط'}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">السنة: {project.year}</p>
                    
                    {project.description_ar && (
                      <p className="leading-relaxed mb-4">{project.description_ar}</p>
                    )}
                    
                    {project.researchers && project.researchers.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">الباحثون:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.researchers.filter(r => r).map((researcher, rIndex) => (
                            <Badge key={rIndex} variant="outline">
                              {researcher}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGenericContent = () => {
    return (
      <div className="space-y-6">
        {section.elements?.map((element, index) => (
          <Card key={element.id || index}>
            <CardContent className="p-6">
              <div dangerouslySetInnerHTML={{ __html: element.content_ar || '' }} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {renderContent()}
    </div>
  );
};

export default AboutPage;