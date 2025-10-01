import { useState, useCallback, useMemo } from 'react';

export interface SpellCheckResult {
  word: string;
  position: number;
  suggestions: string[];
  context: string;
  type: 'spelling' | 'grammar' | 'style';
}

export const useSpellCheck = (content: string, language: 'ar' | 'en' = 'ar') => {
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<SpellCheckResult[]>([]);

  // Common spelling errors in Arabic
  const arabicSpellingRules = [
    { wrong: /اللة/g, correct: 'الله', type: 'spelling' as const },
    { wrong: /احد/g, correct: 'أحد', type: 'spelling' as const },
    { wrong: /ان شاء/g, correct: 'إن شاء', type: 'spelling' as const },
    { wrong: /الى/g, correct: 'إلى', type: 'spelling' as const },
    { wrong: /على/g, correct: 'على', type: 'spelling' as const },
    { wrong: /هذة/g, correct: 'هذه', type: 'spelling' as const },
    { wrong: /هاذة/g, correct: 'هذه', type: 'spelling' as const },
    { wrong: /التى/g, correct: 'التي', type: 'spelling' as const },
    { wrong: /اللذى/g, correct: 'الذي', type: 'spelling' as const },
  ];

  // Common grammar patterns
  const arabicGrammarRules = [
    { 
      pattern: /\b(في|من|إلى|على)\s+(ال[أ-ي]+)\b/g, 
      suggestion: 'تحقق من صحة استخدام حرف الجر مع أل التعريف',
      type: 'grammar' as const 
    },
    { 
      pattern: /\b[أ-ي]+ة\s+[أ-ي]+ة\s+[أ-ي]+ة\b/g, 
      suggestion: 'تجنب تكرار التاء المربوطة في الجملة الواحدة',
      type: 'style' as const 
    },
  ];

  // English spelling rules (simplified)
  const englishSpellingRules = [
    { wrong: /recieve/g, correct: 'receive', type: 'spelling' as const },
    { wrong: /seperate/g, correct: 'separate', type: 'spelling' as const },
    { wrong: /definately/g, correct: 'definitely', type: 'spelling' as const },
    { wrong: /occured/g, correct: 'occurred', type: 'spelling' as const },
    { wrong: /neccessary/g, correct: 'necessary', type: 'spelling' as const },
  ];

  const checkSpelling = useCallback(async (text: string): Promise<SpellCheckResult[]> => {
    setIsChecking(true);
    
    // Simulate checking delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundErrors: SpellCheckResult[] = [];
    const cleanText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
    
    const rules = language === 'ar' ? 
      [...arabicSpellingRules, ...arabicGrammarRules] : 
      englishSpellingRules;

    rules.forEach(rule => {
      let match;
      const regex = 'pattern' in rule ? rule.pattern : rule.wrong;
      
      while ((match = regex.exec(cleanText)) !== null) {
        const word = match[0];
        const position = match.index;
        
        // Get context (20 characters before and after)
        const contextStart = Math.max(0, position - 20);
        const contextEnd = Math.min(cleanText.length, position + word.length + 20);
        const context = cleanText.substring(contextStart, contextEnd);
        
        let suggestions: string[] = [];
        
        if ('correct' in rule) {
          suggestions = [rule.correct];
        } else if ('suggestion' in rule) {
          suggestions = [rule.suggestion];
        }
        
        foundErrors.push({
          word,
          position,
          suggestions,
          context: `...${context}...`,
          type: rule.type
        });
      }
    });

    // Additional checks for Arabic
    if (language === 'ar') {
      // Check for mixed Arabic/English without proper separation
      const mixedText = cleanText.match(/[a-zA-Z]+[أ-ي]+|[أ-ي]+[a-zA-Z]+/g);
      if (mixedText) {
        mixedText.forEach(match => {
          const position = cleanText.indexOf(match);
          foundErrors.push({
            word: match,
            position,
            suggestions: ['فصل النص العربي عن الإنجليزي بمسافات'],
            context: '...',
            type: 'style'
          });
        });
      }

      // Check for repeated words
      const words = cleanText.split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i] === words[i + 1] && words[i].length > 2) {
          const position = cleanText.indexOf(`${words[i]} ${words[i + 1]}`);
          foundErrors.push({
            word: `${words[i]} ${words[i + 1]}`,
            position,
            suggestions: ['إزالة التكرار'],
            context: '...',
            type: 'grammar'
          });
        }
      }
    }

    setErrors(foundErrors);
    setIsChecking(false);
    
    return foundErrors;
  }, [language]);

  const applyCorrection = useCallback((error: SpellCheckResult, correction: string) => {
    const newErrors = errors.filter(e => e !== error);
    setErrors(newErrors);
    return content.replace(error.word, correction);
  }, [errors, content]);

  const ignoreError = useCallback((error: SpellCheckResult) => {
    const newErrors = errors.filter(e => e !== error);
    setErrors(newErrors);
  }, [errors]);

  const checkResults = useMemo(() => {
    if (!content.trim()) return null;
    return checkSpelling(content);
  }, [content, checkSpelling]);

  return {
    errors,
    isChecking,
    checkSpelling,
    applyCorrection,
    ignoreError,
    errorCount: errors.length,
    spellingErrors: errors.filter(e => e.type === 'spelling').length,
    grammarErrors: errors.filter(e => e.type === 'grammar').length,
    styleIssues: errors.filter(e => e.type === 'style').length
  };
};