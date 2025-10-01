import React from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import { usePageTransition } from '@/hooks/usePageTransition';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  loadingVariant?: 'default' | 'minimal' | 'splash' | 'animated-logo';
  enableTransitions?: boolean;
  minLoadingTime?: number;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  loadingVariant = 'default',
  enableTransitions = true,
  minLoadingTime,
  className = ''
}) => {
const { isLoading, loadingText } = usePageTransition({
  enablePageTransitions: enableTransitions,
  minLoadingTime: minLoadingTime ?? 4500,
  loadingTexts: [
    'جاري تحميل المحتوى...',
    'تحضير الصفحة...',
    'جاري التحديث...',
    'تحميل البيانات...'
  ]
});

  // إعداد عنوان الصفحة
  React.useEffect(() => {
    if (title) {
      document.title = `${title} - كلية أيلول الجامعية`;
    }
  }, [title]);

  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    in: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as any,
        staggerChildren: 0.1
      }
    },
    out: { 
      opacity: 0, 
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99] as any
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    in: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99] as any
      }
    }
  };

  return (
    <LoadingScreen 
      isLoading={isLoading} 
      loadingText={loadingText}
      variant={loadingVariant}
    >
      <motion.div
        className={`min-h-screen ${className}`}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
      >
        <motion.div variants={contentVariants}>
          {children}
        </motion.div>
      </motion.div>
    </LoadingScreen>
  );
};

export default PageWrapper;