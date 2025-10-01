import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, Award, Target, TrendingUp, Building, GraduationCap, FileText, Star, Home } from 'lucide-react';
import { useDynamicProgram } from '@/hooks/useDynamicPrograms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

const BusinessAdministration = () => {
  const { data: program, isLoading } = useDynamicProgram('business');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">البرنامج غير موجود</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Header */}
      <UnifiedPageHeader
        icon={Building}
        title={program.title_ar || 'إدارة الأعمال'}
        subtitle={program.description_ar || 'برنامج شامل لإعداد قادة أعمال المستقبل'}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'البرامج الأكاديمية', href: '/departments', icon: GraduationCap },
          { label: 'إدارة الأعمال' }
        ]}
      />

      {/* Quick Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">{program.duration_years}</h3>
                <p className="text-muted-foreground">سنوات دراسية</p>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <BookOpen className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-secondary mb-2">{program.credit_hours}</h3>
                <p className="text-muted-foreground">ساعة معتمدة</p>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-accent mb-2">{program.student_count || 120}</h3>
                <p className="text-muted-foreground">طالب وطالبة</p>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">100%</h3>
                <p className="text-muted-foreground">معدل التوظيف</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="objectives">الأهداف</TabsTrigger>
              <TabsTrigger value="outcomes">مخرجات التعلم</TabsTrigger>
              <TabsTrigger value="graduate">مواصفات الخريج</TabsTrigger>
              <TabsTrigger value="admission">شروط القبول</TabsTrigger>
              <TabsTrigger value="careers">الفرص المهنية</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <FileText className="w-6 h-6 ml-3" />
                    نظرة عامة على البرنامج
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-lg leading-relaxed space-y-4">
                  <p>{program.program_overview_ar}</p>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <Card className="bg-primary/5">
                      <CardHeader>
                        <CardTitle className="text-primary">رؤية البرنامج</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{program.program_vision_ar}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-secondary/5">
                      <CardHeader>
                        <CardTitle className="text-secondary">رسالة البرنامج</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{program.program_mission_ar}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="objectives" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Target className="w-6 h-6 ml-3" />
                    أهداف البرنامج
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {program.program_objectives?.map((objective: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-reverse space-x-4 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-lg">{objective.ar}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <TrendingUp className="w-6 h-6 ml-3" />
                    مخرجات التعلم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" defaultValue={["knowledge", "skills", "competencies"]}>
                    {program.learning_outcomes?.map((category: any, index: number) => (
                      <AccordionItem key={category.category} value={category.category}>
                        <AccordionTrigger className="text-xl">
                          {category.title_ar}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {category.outcomes?.map((outcome: any, outcomeIndex: number) => (
                              <div key={outcomeIndex} className="flex items-start space-x-reverse space-x-3 p-3 bg-muted/30 rounded-lg">
                                <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <p>{outcome.ar}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="graduate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <GraduationCap className="w-6 h-6 ml-3" />
                    مواصفات الخريج
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {program.graduate_specifications?.map((spec: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-r-4 border-primary"
                      >
                        <p className="text-lg">{spec.ar}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admission" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">الشروط الأكاديمية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p>شهادة الثانوية العامة (أي قسم) بنسبة لا تقل عن 65%</p>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p>درجات جيدة في مواد الرياضيات واللغة الإنجليزية</p>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p>اجتياز امتحان القبول في المواد الأساسية</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-secondary">الشروط العامة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <p>اجتياز المقابلة الشخصية</p>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <p>القدرة على التحليل والتفكير النقدي</p>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <p>إجادة اللغة الإنجليزية (مستوى متوسط)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="careers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Building className="w-6 h-6 ml-3" />
                    الفرص المهنية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {program.job_opportunities?.map((opportunity: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-primary rounded-full ml-2"></div>
                          <p className="font-medium">{opportunity.ar}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              ابدأ رحلتك المهنية معنا
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              انضم إلى برنامج إدارة الأعمال في كلية أيلول الجامعية واحصل على تعليم متميز يؤهلك لمستقبل مهني ناجح
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              قدم طلبك الآن
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BusinessAdministration;