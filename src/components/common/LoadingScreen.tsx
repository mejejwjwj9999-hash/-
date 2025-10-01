import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedUniversityLogo } from './AnimatedUniversityLogo';

interface LoadingScreenProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: 'default' | 'minimal' | 'splash' | 'animated-logo';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isLoading, 
  children, 
  loadingText = 'جاري التحميل...',
  variant = 'default'
}) => {
  if (!isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] as any }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1] as any
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.3, duration: 0.6 }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: [0, 0, 1, 1] as any
      }
    }
  };

  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="flex flex-col items-center space-y-4"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="w-8 h-8 border-3 border-university-blue border-t-transparent rounded-full"
            variants={spinnerVariants}
            animate="animate"
          />
          <p className="text-academic-gray text-sm">{loadingText}</p>
        </motion.div>
      </motion.div>
    );
  }

  if (variant === 'animated-logo') {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(210, 220, 255, 0.98) 100%)'
        }}
      >
        {/* Animated geometric background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-university-blue/5 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-university-gold/5 rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div 
          className="relative text-center"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          {/* Animated University Logo */}
          <div className="mb-8 flex justify-center">
            <AnimatedUniversityLogo 
              size={150}
              className="drop-shadow-lg"
            />
          </div>
          
          {/* University Name with elegant animation */}
          <motion.h1 
            className="text-4xl font-bold mb-3 font-cairo bg-gradient-to-r from-university-blue via-university-blue-light to-university-blue bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8, ease: "easeOut" }}
          >
            كلية أيلول الجامعية
          </motion.h1>
          
          <motion.p 
            className="text-xl mb-8 font-tajawal text-university-blue/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.6, ease: "easeOut" }}
          >
            للعلوم الطبية والتقنية
          </motion.p>

          {/* Elegant loading indicators */}
          <motion.div
            className="flex items-center justify-center space-x-3 space-x-reverse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.6, duration: 0.5 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-university-blue to-university-gold"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Subtle loading text */}
          <motion.p 
            className="text-sm text-university-blue/60 font-medium mt-6 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              delay: 4,
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            {loadingText}
          </motion.p>
        </motion.div>

        {/* Corner decorative elements */}
        <div className="absolute top-8 right-8 w-16 h-16 border-2 border-university-blue/20 rounded-full opacity-60"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 border-2 border-university-gold/20 rounded-full opacity-60"></div>
      </motion.div>
    );
  }

  if (variant === 'splash') {
    return (
      <motion.div
        className="fixed inset-0 bg-hero-gradient z-50 flex items-center justify-center"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div 
          className="text-center text-white"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="mb-8"
            variants={logoVariants}
            initial="initial"
            animate={["animate", "pulse"]}
          >
            <img 
              src="/lovable-uploads/692c0f32-2048-4fa2-a225-ab06ea746199.png" 
              alt="شعار كلية أيلول الجامعية" 
              className="w-24 h-24 mx-auto rounded-xl shadow-university object-cover ring-4 ring-white/20" 
            />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold mb-2 font-cairo"
            variants={textVariants}
          >
            كلية أيلول الجامعية
          </motion.h1>
          
          <motion.p 
            className="text-lg mb-8 font-tajawal opacity-90"
            variants={textVariants}
          >
            للعلوم الطبية والتقنية
          </motion.p>

          <motion.div
            className="flex items-center justify-center space-x-2 space-x-reverse"
            variants={textVariants}
          >
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2
              }}
            />
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        background: 'rgba(255, 255, 255, 0.02)'
      }}
    >
      {/* Professional academic grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="60" height="60" className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-university-blue"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Medical/academic subtle elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/3 left-1/4 w-1 h-1 bg-university-blue/20 rounded-full"
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-primary/20 rounded-full"
          animate={{
            y: [10, -10, 10],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
      
      <motion.div 
        className="relative text-center bg-white/[0.08] backdrop-blur-md rounded-2xl p-12 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        variants={textVariants}
        initial="initial"
        animate="animate"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Professional border accent */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-university-blue/10 via-transparent to-primary/10 p-[1px]">
          <div className="w-full h-full rounded-2xl bg-transparent"></div>
        </div>
        
        {/* College logo with refined animation */}
        <motion.div
          className="mb-6"
          variants={logoVariants}
          initial="initial"
          animate="animate"
        >
          <div className="relative">
            <motion.img 
              src="/lovable-uploads/692c0f32-2048-4fa2-a225-ab06ea746199.png" 
              alt="شعار كلية أيلول الجامعية" 
              className="relative w-16 h-16 mx-auto rounded-xl shadow-lg object-cover ring-1 ring-white/20"
              animate={{
                boxShadow: [
                  '0 4px 12px rgba(59, 130, 246, 0.3)',
                  '0 4px 16px rgba(59, 130, 246, 0.4)',
                  '0 4px 12px rgba(59, 130, 246, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
        
        {/* Professional typography hierarchy */}
        <motion.h2 
          className="text-2xl font-semibold bg-gradient-to-r from-university-blue to-primary bg-clip-text text-transparent mb-2 font-cairo tracking-wide"
          variants={textVariants}
        >
          كلية أيلول الجامعية
        </motion.h2>
        
        <motion.p 
          className="text-muted-foreground/80 mb-8 font-tajawal text-lg font-medium"
          variants={textVariants}
        >
          للعلوم الطبية والتقنية
        </motion.p>

        {/* Professional loading progress */}
        <motion.div
          className="flex items-center justify-center mb-6"
          variants={textVariants}
        >
          <div className="w-32 h-1 bg-gray-200/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-university-blue to-primary rounded-full"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '50%' }}
            />
          </div>
        </motion.div>

        {/* Refined loading text */}
        <motion.p 
          className="text-xs text-muted-foreground/70 font-medium tracking-wider uppercase"
          variants={textVariants}
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {loadingText}
        </motion.p>
        
        {/* Subtle corner accents for academic feel */}
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-university-blue/30 rounded-tr"></div>
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-primary/30 rounded-bl"></div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;