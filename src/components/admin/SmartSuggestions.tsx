import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, Wand2, Languages, CheckCircle, 
  XCircle, RefreshCw, Copy, Sparkles,
  BookOpen, PenTool, Zap, Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartSuggestionsProps {
  content: string;
  language: 'ar' | 'en';
  onApplySuggestion: (suggestion: string) => void;
  onTranslate: (translatedContent: string) => void;
  elementType?: 'title' | 'content' | 'description';
  isVisible: boolean;
}

interface Suggestion {
  id: string;
  type: 'improvement' | 'translation' | 'seo' | 'style';
  title: string;
  content: string;
  confidence: number;
  reasoning: string;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  content,
  language,
  onApplySuggestion,
  onTranslate,
  elementType = 'content',
  isVisible
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  // محاكاة توليد الاقتراحات الذكية
  const generateSuggestions = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    
    // محاكاة استدعاء API للذكاء الاصطناعي
    setTimeout(() => {
      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          type: 'improvement',
          title: 'تحسين الوضوح والقراءة',
          content: content.replace(/الطلاب/g, 'الطلبة والطالبات').replace(/وقال/g, 'وأوضح'),
          confidence: 85,
          reasoning: 'استبدال بعض الكلمات بمرادفات أكثر وضوحاً ودقة في التعبير'
        },
        {
          id: '2',
          type: 'seo',
          title: 'تحسين محركات البحث',
          content: content + '\n\nكلمات مفتاحية: كلية أيلول، التعليم العالي، اليمن، الجامعة',
          confidence: 78,
          reasoning: 'إضافة كلمات مفتاحية مناسبة لتحسين ظهور المحتوى في محركات البحث'
        },
        {
          id: '3',
          type: 'style',
          title: 'تحسين الأسلوب الأكاديمي',
          content: content.replace(/جداً/g, 'للغاية').replace(/كثير/g, 'عديد'),
          confidence: 70,
          reasoning: 'استخدام أسلوب أكاديمي أكثر رسمية مناسب للمؤسسة التعليمية'
        }
      ];
      
      if (language === 'ar') {
        mockSuggestions.push({
          id: '4',
          type: 'translation',
          title: 'ترجمة للإنجليزية',
          content: 'This is a translated version of the Arabic content...',
          confidence: 88,
          reasoning: 'ترجمة احترافية للمحتوى العربي إلى الإنجليزية مع مراعاة السياق الأكاديمي'
        });
      }
      
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 2000);
  };

  // توليد محتوى بناءً على prompt مخصص
  const generateCustomContent = async () => {
    if (!customPrompt.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const customSuggestion: Suggestion = {
        id: `custom-${Date.now()}`,
        type: 'improvement',
        title: 'محتوى مخصص',
        content: `محتوى محسن بناءً على طلبك: "${customPrompt}"\n\n${content}`,
        confidence: 80,
        reasoning: `تم إنشاء المحتوى بناءً على التوجيه: ${customPrompt}`
      };
      
      setSuggestions(prev => [customSuggestion, ...prev]);
      setIsGenerating(false);
      setCustomPrompt('');
      
      toast({
        title: 'تم إنشاء المحتوى',
        description: 'تم إنشاء محتوى جديد بناءً على طلبك'
      });
    }, 1500);
  };

  const applySuggestion = (suggestion: Suggestion) => {
    if (suggestion.type === 'translation') {
      onTranslate(suggestion.content);
    } else {
      onApplySuggestion(suggestion.content);
    }
    
    toast({
      title: 'تم تطبيق الاقتراح',
      description: suggestion.title
    });
  };

  const copySuggestion = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ المحتوى إلى الحافظة'
    });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <PenTool className="h-4 w-4" />;
      case 'translation': return <Languages className="h-4 w-4" />;
      case 'seo': return <Target className="h-4 w-4" />;
      case 'style': return <Sparkles className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'bg-aylol-blue';
      case 'translation': return 'bg-university-gold';
      case 'seo': return 'bg-aylol-gold';
      case 'style': return 'bg-university-blue';
      default: return 'bg-muted';
    }
  };

  useEffect(() => {
    if (isVisible && content.trim()) {
      generateSuggestions();
    }
  }, [isVisible, content]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-br from-aylol-blue/5 to-university-gold/5 border-aylol-blue/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-aylol-blue">
            <Sparkles className="h-5 w-5" />
            الاقتراحات الذكية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggestions">الاقتراحات</TabsTrigger>
              <TabsTrigger value="custom">طلب مخصص</TabsTrigger>
            </TabsList>
            
            <TabsContent value="suggestions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  الاقتراحات المتاحة ({suggestions.length})
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateSuggestions}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  تحديث
                </Button>
              </div>

              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-8 text-muted-foreground"
                  >
                    <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                    جاري إنشاء الاقتراحات...
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card p-4 rounded-lg border border-border/50 hover:shadow-soft transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getSuggestionColor(suggestion.type)} text-white gap-1`}>
                          {getSuggestionIcon(suggestion.type)}
                          {suggestion.title}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.confidence}% ثقة
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copySuggestion(suggestion.content)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="h-8 px-2 text-xs bg-aylol-blue hover:bg-aylol-blue-dark"
                        >
                          تطبيق
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {suggestion.reasoning}
                    </p>
                    
                    <div 
                      className="text-sm bg-muted/30 p-3 rounded border-r-4 border-aylol-blue/50 max-h-32 overflow-y-auto cursor-pointer"
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      {suggestion.content.substring(0, 200)}
                      {suggestion.content.length > 200 && '...'}
                    </div>
                  </motion.div>
                ))}
              </div>

              {suggestions.length === 0 && !isGenerating && (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد اقتراحات متاحة حالياً</p>
                  <p className="text-xs mt-1">أضف محتوى واضغط على تحديث للحصول على اقتراحات</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  اطلب تحسيناً مخصصاً للمحتوى
                </label>
                <Textarea
                  placeholder="مثال: اجعل النص أكثر رسمية، أضف أمثلة عملية، حسن الأسلوب الأكاديمي..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={generateCustomContent}
                  disabled={!customPrompt.trim() || isGenerating}
                  className="w-full bg-university-gold hover:bg-university-gold-light text-aylol-blue gap-2"
                >
                  <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                  {isGenerating ? 'جاري الإنشاء...' : 'إنشاء محتوى مخصص'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* معاينة الاقتراح المحدد */}
      {selectedSuggestion && (
        <Card className="bg-card-gradient">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">معاينة الاقتراح</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedSuggestion(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded border-r-4 border-aylol-blue/50 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
              {selectedSuggestion.content}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => applySuggestion(selectedSuggestion)}
                className="bg-aylol-blue hover:bg-aylol-blue-dark gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                تطبيق هذا الاقتراح
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copySuggestion(selectedSuggestion.content)}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                نسخ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};