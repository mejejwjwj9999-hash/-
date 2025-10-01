import { useState, useCallback, useMemo } from 'react';

export interface ContentAnalysis {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  readingTime: number;
  readabilityScore: number;
  keywordDensity: { [key: string]: number };
  seoSuggestions: string[];
  grammarIssues: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export const useContentAnalysis = (content: string, language: 'ar' | 'en' = 'ar') => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = useCallback(async (text: string): Promise<ContentAnalysis> => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clean HTML tags for analysis
    const cleanText = text.replace(/<[^>]*>/g, '');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // Calculate basic metrics
    const wordCount = words.length;
    const characterCount = cleanText.length;
    const paragraphCount = paragraphs.length;
    
    // Reading time (Arabic: ~200 WPM, English: ~250 WPM)
    const wordsPerMinute = language === 'ar' ? 200 : 250;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Simple readability score (Flesch-like)
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
    const avgSyllablesPerWord = words.reduce((acc, word) => acc + estimateSyllables(word), 0) / wordCount;
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    ));

    // Keyword density
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      const normalizedWord = word.toLowerCase().replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z]/g, '');
      if (normalizedWord.length > 2) {
        wordFreq[normalizedWord] = (wordFreq[normalizedWord] || 0) + 1;
      }
    });

    const keywordDensity: { [key: string]: number } = {};
    Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([word, count]) => {
        keywordDensity[word] = (count / wordCount) * 100;
      });

    // SEO suggestions
    const seoSuggestions: string[] = [];
    if (wordCount < 300) seoSuggestions.push('المحتوى قصير جداً، يفضل أن يكون أكثر من 300 كلمة');
    if (wordCount > 2000) seoSuggestions.push('المحتوى طويل جداً، قد يؤثر على تجربة القراءة');
    if (paragraphCount < 3) seoSuggestions.push('استخدم فقرات أكثر لتحسين القراءة');
    if (readabilityScore < 30) seoSuggestions.push('النص معقد، حاول تبسيط الجمل');
    if (readabilityScore > 90) seoSuggestions.push('النص بسيط جداً، يمكن إضافة مزيد من التفاصيل');

    // Grammar issues (simplified)
    const grammarIssues: string[] = [];
    if (text.includes('  ')) grammarIssues.push('يوجد مسافات مضاعفة');
    if (/[.!?]\s*[a-z\u0600-\u06FF]/.test(text)) grammarIssues.push('بعض الجمل لا تبدأ بحرف كبير');
    if (!/[.!?]$/.test(cleanText.trim())) grammarIssues.push('النص لا ينتهي بعلامة ترقيم');

    // Simple sentiment analysis
    const positiveWords = language === 'ar' 
      ? ['جيد', 'ممتاز', 'رائع', 'مفيد', 'إيجابي', 'نجح', 'تطور', 'تقدم']
      : ['good', 'excellent', 'great', 'positive', 'success', 'improve', 'benefit'];
    
    const negativeWords = language === 'ar'
      ? ['سيء', 'فشل', 'مشكلة', 'خطأ', 'صعب', 'مستحيل', 'سلبي']
      : ['bad', 'fail', 'problem', 'error', 'difficult', 'impossible', 'negative'];

    let sentimentScore = 0;
    words.forEach(word => {
      if (positiveWords.includes(word.toLowerCase())) sentimentScore++;
      if (negativeWords.includes(word.toLowerCase())) sentimentScore--;
    });

    const sentiment: 'positive' | 'neutral' | 'negative' = 
      sentimentScore > 2 ? 'positive' : 
      sentimentScore < -2 ? 'negative' : 'neutral';

    setIsAnalyzing(false);

    return {
      wordCount,
      characterCount,
      paragraphCount,
      readingTime,
      readabilityScore: Math.round(readabilityScore),
      keywordDensity,
      seoSuggestions,
      grammarIssues,
      sentiment
    };
  }, [language]);

  const analysis = useMemo(() => {
    if (!content.trim()) return null;
    return analyzeContent(content);
  }, [content, analyzeContent]);

  return {
    analysis,
    isAnalyzing,
    analyzeContent
  };
};

function estimateSyllables(word: string): number {
  // Simple syllable estimation for Arabic and English
  if (/[\u0600-\u06FF]/.test(word)) {
    // Arabic: rough estimate based on vowel diacritics and word length
    return Math.max(1, Math.ceil(word.length / 3));
  } else {
    // English: count vowel groups
    const vowels = word.toLowerCase().match(/[aeiouy]+/g);
    const syllableCount = vowels ? vowels.length : 1;
    return Math.max(1, syllableCount);
  }
}