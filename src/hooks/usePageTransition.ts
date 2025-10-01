import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UsePageTransitionOptions {
  minLoadingTime?: number;
  enablePageTransitions?: boolean;
  loadingTexts?: string[];
}

export const usePageTransition = (options: UsePageTransitionOptions = {}) => {
  const {
    minLoadingTime = 2000, // تقليل وقت التحميل إلى ثانيتين
    enablePageTransitions = true,
    loadingTexts = [
      'جاري تحميل المحتوى...',
      'تحضير الصفحة...',
      'جاري التحديث...'
    ]
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  const location = useLocation();

  useEffect(() => {
    if (!enablePageTransitions) return;

    setIsLoading(true);
    
    // تغيير نص التحميل عشوائياً
    const randomText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
    setLoadingText(randomText);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [location.pathname, enablePageTransitions, minLoadingTime]);

  return {
    isLoading,
    loadingText,
    setIsLoading
  };
};