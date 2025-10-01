import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles, Brain, Edit, Languages, CheckCircle, AlertCircle,
  Lightbulb, Zap, RefreshCw, Copy, Download, BookOpen,
  Target, TrendingUp, Search, Filter, Clock, Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIContentAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onContentUpdate: (newContent: string) => void;
  language: 'ar' | 'en';
}

interface AITask {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'writing' | 'editing' | 'seo' | 'translation' | 'analysis';
}

interface ContentSuggestion {
  id: string;
  title: string;
  content: string;
  type: 'improvement' | 'addition' | 'correction' | 'optimization';
  confidence: number;
  reason: string;
}

const AIContentAssistant: React.FC<AIContentAssistantProps> = ({
  isOpen,
  onClose,
  currentContent,
  onContentUpdate,
  language
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [generatedContent, setGeneratedContent] = useState('');

  const aiTasks: AITask[] = [
    {
      id: 'improve-text',
      name: 'تحسين النص',
      description: 'تحسين وضوح وجودة النص',
      icon: <Edit className="h-4 w-4" />,
      category: 'editing'
    },
    {
      id: 'generate-content',
      name: 'إنشاء محتوى',
      description: 'إنشاء محتوى جديد بناءً على موضوع معين',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'writing'
    },
    {
      id: 'translate',
      name: 'ترجمة',
      description: 'ترجمة النص بين العربية والإنجليزية',
      icon: <Languages className="h-4 w-4" />,
      category: 'translation'
    },
    {
      id: 'seo-optimize',
      name: 'تحسين SEO',
      description: 'تحسين النص لمحركات البحث',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'seo'
    },
    {
      id: 'summarize',
      name: 'تلخيص',
      description: 'إنشاء ملخص مختصر للنص',
      icon: <Target className="h-4 w-4" />,
      category: 'editing'
    },
    {
      id: 'expand',
      name: 'توسيع النص',
      description: 'إضافة تفاصيل وتوسيع المحتوى',
      icon: <Lightbulb className="h-4 w-4" />,
      category: 'writing'
    },
    {
      id: 'check-grammar',
      name: 'تدقيق إملائي ونحوي',
      description: 'فحص وتصحيح الأخطاء اللغوية',
      icon: <CheckCircle className="h-4 w-4" />,
      category: 'editing'
    },
    {
      id: 'analyze-content',
      name: 'تحليل المحتوى',
      description: 'تحليل مفصل لجودة وفعالية المحتوى',
      icon: <Brain className="h-4 w-4" />,
      category: 'analysis'
    }
  ];

  const processWithAI = async () => {
    if (!selectedTask || (!currentContent && selectedTask !== 'generate-content' && !prompt)) {
      toast({ 
        title: "خطأ", 
        description: "يرجى اختيار مهمة وإدخال المحتوى المطلوب", 
        variant: "destructive" 
      });
      return;
    }

    setIsProcessing(true);
    try {
      // محاكاة استدعاء AI API
      await new Promise(resolve => setTimeout(resolve, 2000));

      switch (selectedTask) {
        case 'improve-text':
          await improveText();
          break;
        case 'generate-content':
          await generateContent();
          break;
        case 'translate':
          await translateContent();
          break;
        case 'seo-optimize':
          await optimizeForSEO();
          break;
        case 'summarize':
          await summarizeContent();
          break;
        case 'expand':
          await expandContent();
          break;
        case 'check-grammar':
          await checkGrammar();
          break;
        case 'analyze-content':
          await analyzeContent();
          break;
        default:
          break;
      }

      toast({ title: "تم بنجاح", description: "تم معالجة المحتوى بالذكاء الاصطناعي" });
    } catch (error) {
      toast({ 
        title: "خطأ", 
        description: "فشل في معالجة المحتوى", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const improveText = async () => {
    // محاكاة تحسين النص
    const improved = currentContent
      .replace(/\b(جيد|حسن|مقبول)\b/g, 'ممتاز')
      .replace(/\.\s+/g, '. ')
      .replace(/،\s+/g, '، ');
    
    setGeneratedContent(improved);
    setSuggestions([
      {
        id: '1',
        title: 'تحسين اختيار الكلمات',
        content: 'تم تحسين بعض الكلمات لتكون أكثر دقة وتأثيراً',
        type: 'improvement',
        confidence: 85,
        reason: 'استخدام مفردات أكثر قوة وتأثيراً'
      },
      {
        id: '2',
        title: 'تحسين التنسيق',
        content: 'تم تحسين المسافات وعلامات الترقيم',
        type: 'correction',
        confidence: 95,
        reason: 'تحسين قابلية القراءة'
      }
    ]);
  };

  const generateContent = async () => {
    if (!prompt) return;
    
    // محاكاة إنشاء محتوى
    const generated = `
      <h2>${prompt}</h2>
      <p>هذا محتوى تم إنشاؤه بالذكاء الاصطناعي حول موضوع "${prompt}". يتضمن هذا المحتوى معلومات شاملة ومفيدة حول الموضوع.</p>
      
      <h3>النقاط الرئيسية:</h3>
      <ul>
        <li>نقطة مهمة حول ${prompt}</li>
        <li>معلومة إضافية ذات صلة</li>
        <li>خلاصة وتوصيات</li>
      </ul>
      
      <p>في الختام، يمكن القول أن ${prompt} موضوع مهم يستحق الاهتمام والدراسة المعمقة.</p>
    `;
    
    setGeneratedContent(generated);
  };

  const translateContent = async () => {
    // محاكاة الترجمة
    const translated = language === 'ar' 
      ? "This is a simulated translation of the Arabic content to English. The AI would normally provide an accurate translation while maintaining the meaning and context."
      : "هذه ترجمة محاكاة للمحتوى الإنجليزي إلى العربية. عادة ما يقدم الذكاء الاصطناعي ترجمة دقيقة مع الحفاظ على المعنى والسياق.";
    
    setGeneratedContent(translated);
  };

  const optimizeForSEO = async () => {
    // محاكاة تحسين SEO
    const optimized = currentContent.replace(
      /<h1>/g, '<h1>كلمة مفتاحية مهمة - '
    ).replace(
      /<p>/g, '<p>بعد تحسين SEO: '
    );
    
    setGeneratedContent(optimized);
    setSuggestions([
      {
        id: '1',
        title: 'إضافة كلمات مفتاحية',
        content: 'تم إضافة كلمات مفتاحية مهمة لتحسين الترتيب في محركات البحث',
        type: 'optimization',
        confidence: 90,
        reason: 'تحسين SEO'
      },
      {
        id: '2',
        title: 'تحسين العناوين',
        content: 'تم تحسين هيكل العناوين لتكون أكثر ملاءمة لمحركات البحث',
        type: 'optimization',
        confidence: 85,
        reason: 'هيكلة أفضل للمحتوى'
      }
    ]);
  };

  const summarizeContent = async () => {
    // محاكاة التلخيص
    const summary = `
      <h3>ملخص المحتوى:</h3>
      <p>هذا ملخص مختصر للمحتوى الأصلي يتضمن النقاط الرئيسية والأفكار المهمة. تم إنشاء هذا الملخص بواسطة الذكاء الاصطناعي لتوفير نظرة سريعة على المحتوى.</p>
      
      <h4>النقاط الرئيسية:</h4>
      <ul>
        <li>النقطة الأولى المهمة</li>
        <li>النقطة الثانية الأساسية</li>
        <li>الخلاصة والنتائج</li>
      </ul>
    `;
    
    setGeneratedContent(summary);
  };

  const expandContent = async () => {
    // محاكاة توسيع المحتوى
    const expanded = currentContent + `
      
      <h3>تفاصيل إضافية:</h3>
      <p>تم إضافة هذا المحتوى الإضافي بواسطة الذكاء الاصطناعي لتوسيع النص الأصلي وإضافة المزيد من التفاصيل والمعلومات المفيدة.</p>
      
      <h4>أمثلة وتطبيقات:</h4>
      <ul>
        <li>مثال عملي على الموضوع</li>
        <li>تطبيق في الحياة العملية</li>
        <li>دراسة حالة ذات صلة</li>
      </ul>
      
      <h4>خلاصة موسعة:</h4>
      <p>في ضوء ما تم عرضه، يمكن الاستنتاج أن هذا الموضوع له أهمية كبيرة ويتطلب المزيد من الدراسة والتحليل.</p>
    `;
    
    setGeneratedContent(expanded);
  };

  const checkGrammar = async () => {
    // محاكاة التدقيق الإملائي والنحوي
    setSuggestions([
      {
        id: '1',
        title: 'خطأ إملائي',
        content: 'تم العثور على خطأ في كلمة "المدرسه" - الصحيح "المدرسة"',
        type: 'correction',
        confidence: 100,
        reason: 'خطأ في استخدام التاء المربوطة'
      },
      {
        id: '2',
        title: 'خطأ نحوي',
        content: 'تحتاج الجملة إلى إعادة ترتيب لتكون أكثر وضوحاً',
        type: 'correction',
        confidence: 85,
        reason: 'تحسين التركيب النحوي'
      },
      {
        id: '3',
        title: 'اقتراح تحسين',
        content: 'يمكن استخدام كلمة أكثر دقة بدلاً من "شيء"',
        type: 'improvement',
        confidence: 75,
        reason: 'تحسين دقة التعبير'
      }
    ]);
  };

  const analyzeContent = async () => {
    // محاكاة تحليل المحتوى
    setAnalysis({
      readability: 85,
      seoScore: 72,
      engagement: 90,
      wordCount: currentContent.split(' ').length,
      readingTime: Math.ceil(currentContent.split(' ').length / 200),
      keywords: ['التعليم', 'الطلاب', 'الجامعة', 'المعرفة'],
      sentiment: 'إيجابي',
      suggestions: [
        'إضافة المزيد من الأمثلة العملية',
        'تحسين استخدام الكلمات المفتاحية',
        'إضافة روابط داخلية مفيدة'
      ]
    });
  };

  const applySuggestion = (suggestion: ContentSuggestion) => {
    // تطبيق الاقتراح على المحتوى
    toast({ title: "تم التطبيق", description: `تم تطبيق: ${suggestion.title}` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "تم النسخ", description: "تم نسخ المحتوى إلى الحافظة" });
  };

  const applyGeneratedContent = () => {
    onContentUpdate(generatedContent);
    toast({ title: "تم التطبيق", description: "تم تطبيق المحتوى الجديد" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            مساعد المحتوى الذكي
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* قائمة المهام */}
          <div className="w-80 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">المهام المتاحة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {aiTasks.map((task) => (
                  <Button
                    key={task.id}
                    variant={selectedTask === task.id ? "default" : "outline"}
                    className="w-full justify-start gap-2 h-auto p-3"
                    onClick={() => setSelectedTask(task.id)}
                  >
                    {task.icon}
                    <div className="text-left">
                      <div className="font-medium">{task.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {selectedTask === 'generate-content' && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">موضوع المحتوى</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="اكتب موضوع المحتوى المطلوب إنشاؤه..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={processWithAI} 
              disabled={isProcessing || !selectedTask}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 ml-2" />
                  تشغيل المساعد الذكي
                </>
              )}
            </Button>
          </div>

          {/* منطقة النتائج */}
          <div className="flex-1">
            <Tabs defaultValue="result" className="h-full">
              <TabsList>
                <TabsTrigger value="result">النتيجة</TabsTrigger>
                <TabsTrigger value="suggestions">الاقتراحات</TabsTrigger>
                <TabsTrigger value="analysis">التحليل</TabsTrigger>
              </TabsList>

              <TabsContent value="result" className="h-full">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">المحتوى المُحسن</CardTitle>
                      {generatedContent && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedContent)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={applyGeneratedContent}
                          >
                            تطبيق المحتوى
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      {generatedContent ? (
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: generatedContent }}
                        />
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Brain className="h-12 w-12 mx-auto mb-4" />
                          <p>اختر مهمة واضغط "تشغيل المساعد الذكي" لرؤية النتائج</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions" className="h-full">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">اقتراحات التحسين</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      {suggestions.length > 0 ? (
                        <div className="space-y-3">
                          {suggestions.map((suggestion) => (
                            <Card key={suggestion.id} className="border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium">{suggestion.title}</h4>
                                  <Badge 
                                    variant={
                                      suggestion.type === 'improvement' ? 'default' :
                                      suggestion.type === 'correction' ? 'destructive' :
                                      suggestion.type === 'optimization' ? 'secondary' : 'outline'
                                    }
                                  >
                                    {suggestion.confidence}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {suggestion.content}
                                </p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  السبب: {suggestion.reason}
                                </p>
                                <Button
                                  size="sm"
                                  onClick={() => applySuggestion(suggestion)}
                                >
                                  تطبيق الاقتراح
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Lightbulb className="h-12 w-12 mx-auto mb-4" />
                          <p>لا توجد اقتراحات متاحة حالياً</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="h-full">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">تحليل المحتوى</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      {analysis ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {analysis.readability}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  سهولة القراءة
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {analysis.seoScore}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  نقاط SEO
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {analysis.engagement}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  درجة التفاعل
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {analysis.readingTime}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  دقائق القراءة
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">الكلمات المفتاحية</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {analysis.keywords.map((keyword: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-base font-semibold">اقتراحات التحسين</Label>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                              {analysis.suggestions.map((suggestion: string, index: number) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Search className="h-12 w-12 mx-auto mb-4" />
                          <p>لا يوجد تحليل متاح حالياً</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIContentAssistant;