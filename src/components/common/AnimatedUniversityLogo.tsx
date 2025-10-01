import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedUniversityLogoProps {
  size?: number;
  onAnimationComplete?: () => void;
  className?: string;
}

export const AnimatedUniversityLogo: React.FC<AnimatedUniversityLogoProps> = ({
  size = 120,
  onAnimationComplete,
  className = ''
}) => {
  // Animation timing configuration
  const appearDuration = 1.2;
  const scaleDuration = 0.8;
  const glowDuration = 1.5;
  const totalDuration = appearDuration + scaleDuration + glowDuration;

  // Image reveal animation with elegant entrance
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      rotate: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: appearDuration,
        ease: [0.23, 1, 0.32, 1] as any
      }
    }
  };

  // Enhanced glow effect variants
  const glowVariants = {
    hidden: {
      filter: 'drop-shadow(0 0 0px rgba(59, 130, 246, 0)) drop-shadow(0 0 0px rgba(217, 119, 6, 0))'
    },
    visible: {
      filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 15px rgba(217, 119, 6, 0.4))',
      transition: {
        delay: appearDuration,
        duration: glowDuration,
        ease: [0.25, 0.46, 0.45, 0.94] as any
      }
    }
  };

  // Ring animation around the logo
  const ringVariants = {
    hidden: {
      scale: 0,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 0.6,
      transition: {
        delay: appearDuration + 0.3,
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1] as any
      }
    }
  };

  // Shine effect that sweeps across the logo
  const shineVariants = {
    hidden: {
      x: '-100%',
      opacity: 0
    },
    visible: {
      x: '100%',
      opacity: [0, 1, 0],
      transition: {
        delay: totalDuration,
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => {
        setTimeout(() => {
          onAnimationComplete?.();
        }, 500);
      }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(217, 119, 6, 0.1) 40%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          delay: totalDuration - 0.5,
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated ring around the logo */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-university-blue/30"
        variants={ringVariants}
        style={{
          borderImage: 'linear-gradient(45deg, hsl(var(--university-blue)), hsl(var(--university-gold)), hsl(var(--university-blue))) 1'
        }}
      />

      {/* Secondary pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-university-gold/20"
        variants={ringVariants}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          delay: totalDuration,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main logo container with all effects */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          y: [-2, 2, -2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* University Logo Image */}
        <motion.img
          src="/lovable-uploads/5e9ee7d7-2b53-4648-84ec-e60ff38e0348.png"
          alt="شعار كلية أيلول الجامعية"
          className="w-full h-full object-contain rounded-full"
          variants={imageVariants}
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
          }}
          animate={{
            filter: [
              'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
              'drop-shadow(0 6px 20px rgba(59, 130, 246, 0.3))',
              'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Shine overlay effect */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          variants={glowVariants}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              width: '30%',
              height: '100%',
              transform: 'skewX(-20deg)'
            }}
            variants={shineVariants}
          />
        </motion.div>
      </motion.div>

      {/* Particle effects around the logo */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-university-gold rounded-full"
            style={{
              top: `${15 + Math.sin((i * Math.PI) / 3) * 35}%`,
              left: `${15 + Math.cos((i * Math.PI) / 3) * 35}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: totalDuration + i * 0.2,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Corner accent elements */}
      <motion.div
        className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-university-blue/40 rounded-tr-lg"
        variants={ringVariants}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-university-gold/40 rounded-bl-lg"
        variants={ringVariants}
      />
    </motion.div>
  );
};

export default AnimatedUniversityLogo;