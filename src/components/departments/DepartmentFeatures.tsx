import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface DepartmentFeaturesProps {
  language?: 'ar' | 'en';
}

export const DepartmentFeatures: React.FC<DepartmentFeaturesProps> = ({ 
  language = 'ar' 
}) => {
  const features = [
    {
      icon: Award,
      title: language === 'ar' ? 'اعتماد أكاديمي' : 'Academic Accreditation',
      description: language === 'ar' 
        ? 'جميع برامجنا معتمدة من الهيئات الأكاديمية المحلية والدولية'
        : 'All our programs are accredited by local and international academic bodies'
    },
    {
      icon: BookOpen,
      title: language === 'ar' ? 'منهج متطور' : 'Advanced Curriculum',
      description: language === 'ar' 
        ? 'مناهج حديثة تواكب أحدث التطورات العلمية والتكنولوجية'
        : 'Modern curricula that keep pace with the latest scientific and technological developments'
    },
    {
      icon: Users,
      title: language === 'ar' ? 'هيئة تدريسية متميزة' : 'Distinguished Faculty',
      description: language === 'ar' 
        ? 'أساتذة مؤهلون وذوو خبرة عالية في تخصصاتهم'
        : 'Qualified professors with high experience in their specializations'
    },
    {
      icon: Globe,
      title: language === 'ar' ? 'فرص عالمية' : 'Global Opportunities',
      description: language === 'ar' 
        ? 'شراكات دولية وفرص تبادل طلابي مع جامعات عالمية'
        : 'International partnerships and student exchange opportunities with global universities'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      className="py-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ar' ? 'لماذا تختار أقسامنا الأكاديمية؟' : 'Why Choose Our Academic Departments?'}
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'تتميز أقسامنا الأكاديمية بالجودة والتميز في التعليم، مع توفير بيئة تعليمية محفزة للإبداع والابتكار'
              : 'Our academic departments are distinguished by quality and excellence in education, providing an educational environment that stimulates creativity and innovation'
            }
          </p>
        </div>

        {/* شبكة المميزات */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full text-center bg-card border-border/50 hover:border-primary/20 hover:shadow-university transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* معلومات إضافية */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-muted/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {language === 'ar' ? 'ابدأ رحلتك الأكاديمية معنا' : 'Start Your Academic Journey With Us'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'انضم إلى مجتمع أكاديمي متميز واحصل على تعليم عالي الجودة يؤهلك لسوق العمل. تقدم الآن واكتشف الفرص اللامحدودة التي تنتظرك'
                : 'Join a distinguished academic community and get high-quality education that qualifies you for the job market. Apply now and discover the unlimited opportunities that await you'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/admissions">
                  {language === 'ar' ? 'شروط القبول' : 'Admission Requirements'}
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};