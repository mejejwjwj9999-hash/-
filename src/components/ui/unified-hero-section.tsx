import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface UnifiedHeroSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badges?: Array<{
    icon: LucideIcon;
    text: string;
  }>;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  breadcrumb?: React.ReactNode;
}

const UnifiedHeroSection: React.FC<UnifiedHeroSectionProps> = ({
  icon: Icon,
  title,
  subtitle,
  badges = [],
  primaryCta,
  secondaryCta,
  breadcrumb
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <section className="relative bg-hero-gradient text-white py-20 overflow-hidden">
      {/* خلفية تفاعلية متطورة */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48 animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 -translate-y-16 animate-float"></div>
      </div>
      
      {/* نمط هندسي */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="unified-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#unified-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="mb-8">
            {breadcrumb}
          </div>
        )}

        <motion.div 
          className="text-center max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-university"
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-14 h-14 text-university-gold" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-tajawal"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-4xl mx-auto font-tajawal"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
          
          {badges.length > 0 && (
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              variants={itemVariants}
            >
              {badges.map((badge, index) => (
                <Badge key={index} className="bg-white/20 text-white border-white/30 px-6 py-3 text-base hover:bg-white/30 transition-colors font-tajawal">
                  <badge.icon className="w-5 h-5 ml-2" />
                  {badge.text}
                </Badge>
              ))}
            </motion.div>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              {primaryCta && (
                <Button asChild variant="hero" size="lg" className="font-tajawal font-semibold">
                  <Link to={primaryCta.href}>
                    {primaryCta.text}
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button asChild variant="hero-outline" size="lg" className="font-tajawal font-semibold">
                  <Link to={secondaryCta.href}>
                    {secondaryCta.text}
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default UnifiedHeroSection;