import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, AlertCircle, AlertTriangle, Info,
  RefreshCw, X, Check, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpellCheck } from '@/hooks/useSpellCheck';
import { toast } from '@/hooks/use-toast';

interface SpellCheckerProps {
  content: string;
  language: 'ar' | 'en';
  isVisible: boolean;
  onContentChange: (content: string) => void;
}

export const SpellChecker: React.FC<SpellCheckerProps> = ({
  content,
  language,
  isVisible,
  onContentChange
}) => {
  const { 
    errors, 
    isChecking, 
    checkSpelling, 
    applyCorrection, 
    ignoreError,
    errorCount,
    spellingErrors,
    grammarErrors,
    styleIssues
  } = useSpellCheck(content, language);

  if (!isVisible) return null;

  const handleApplyCorrection = (error: any, correction: string) => {
    const correctedContent = applyCorrection(error, correction);
    onContentChange(correctedContent);
    
    toast({
      title: 'تم التصحيح',
      description: `تم استبدال "${error.word}" بـ "${correction}"`
    });
  };

  const handleIgnoreError = (error: any) => {
    ignoreError(error);
    toast({
      title: 'تم التجاهل',
      description: 'تم تجاهل هذا الخطأ'
    });
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'spelling': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'grammar': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'style': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getErrorTypeLabel = (type: string) => {
    switch (type) {
      case 'spelling': return 'إملائي';
      case 'grammar': return 'نحوي';
      case 'style': return 'أسلوبي';
      default: return 'عام';
    }
  };

  const getErrorColor = (type: string) => {
    switch (type) {
      case 'spelling': return 'bg-red-50 border-red-200';
      case 'grammar': return 'bg-orange-50 border-orange-200';
      case 'style': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              المدقق الإملائي والنحوي
            </CardTitle>
            <Button
              size="sm"
              onClick={() => checkSpelling(content)}
              disabled={isChecking}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'جاري الفحص...' : 'فحص جديد'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{errorCount}</div>
              <div className="text-xs text-muted-foreground">إجمالي الأخطاء</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{spellingErrors}</div>
              <div className="text-xs text-red-700">إملائية</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{grammarErrors}</div>
              <div className="text-xs text-orange-700">نحوية</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{styleIssues}</div>
              <div className="text-xs text-blue-700">أسلوبية</div>
            </div>
          </div>

          {isChecking ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-3" />
              <span>جاري فحص المحتوى...</span>
            </div>
          ) : errorCount > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">الكل ({errorCount})</TabsTrigger>
                <TabsTrigger value="spelling">إملائي ({spellingErrors})</TabsTrigger>
                <TabsTrigger value="grammar">نحوي ({grammarErrors})</TabsTrigger>
                <TabsTrigger value="style">أسلوبي ({styleIssues})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {errors.map((error, index) => (
                        <motion.div
                          key={`${error.word}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 rounded-lg border ${getErrorColor(error.type)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getErrorIcon(error.type)}
                              <Badge variant="outline">
                                {getErrorTypeLabel(error.type)}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleIgnoreError(error)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <span className="font-medium text-sm">الخطأ: </span>
                            <span className="bg-red-100 px-1 rounded text-sm">{error.word}</span>
                          </div>
                          
                          {error.context && (
                            <div className="mb-3 text-xs text-muted-foreground bg-white/50 p-2 rounded">
                              <strong>السياق:</strong> {error.context}
                            </div>
                          )}
                          
                          {error.suggestions.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-sm font-medium">الاقتراحات:</span>
                              <div className="flex flex-wrap gap-2">
                                {error.suggestions.map((suggestion, suggestionIndex) => (
                                  <Button
                                    key={suggestionIndex}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleApplyCorrection(error, suggestion)}
                                    className="h-7 text-xs gap-1"
                                  >
                                    <Check className="h-3 w-3" />
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </TabsContent>

              {['spelling', 'grammar', 'style'].map(type => (
                <TabsContent key={type} value={type} className="mt-4">
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {errors
                        .filter(error => error.type === type)
                        .map((error, index) => (
                          <motion.div
                            key={`${error.word}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-lg border ${getErrorColor(error.type)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getErrorIcon(error.type)}
                                <Badge variant="outline">
                                  {getErrorTypeLabel(error.type)}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleIgnoreError(error)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="mb-3">
                              <span className="font-medium text-sm">الخطأ: </span>
                              <span className="bg-red-100 px-1 rounded text-sm">{error.word}</span>
                            </div>
                            
                            {error.suggestions.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-sm font-medium">الاقتراحات:</span>
                                <div className="flex flex-wrap gap-2">
                                  {error.suggestions.map((suggestion, suggestionIndex) => (
                                    <Button
                                      key={suggestionIndex}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleApplyCorrection(error, suggestion)}
                                      className="h-7 text-xs gap-1"
                                    >
                                      <Check className="h-3 w-3" />
                                      {suggestion}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                ممتاز! لا توجد أخطاء
              </h3>
              <p className="text-sm text-muted-foreground">
                المحتوى خالٍ من الأخطاء الإملائية والنحوية
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};