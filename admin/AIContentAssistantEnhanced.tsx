import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, Brain, Wand2, Languages, TrendingUp, 
  FileText, Lightbulb, CheckCircle, Target, Zap, 
  RefreshCw, Copy, Clock, BarChart3 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIContentAssistantEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onContentUpdate: (newContent: string) => void;
  language: 'ar' | 'en';
  elementKey?: string;
  pageKey?: string;
}

export const AIContentAssistantEnhanced: React.FC<AIContentAssistantEnhancedProps> = ({
  isOpen,
  onClose,
  currentContent, 
  onContentUpdate,
  language,
  elementKey,
  pageKey
}) => {
  const [selectedTask, setSelectedTask] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [prompt, setPrompt] = useState('');

  const aiTasks = [
    { id: 'enhance', name: 'تحسين المحتوى', icon: <Wand2 className="h-4 w-4" /> },
    { id: 'translate', name: 'ترجمة', icon: <Languages className="h-4 w-4" /> },
    { id: 'seo', name: 'تحسين SEO', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'summarize', name: 'تلخيص', icon: <Target className="h-4 w-4" /> },
    { id: 'expand', name: 'توسيع', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'generate', name: 'إنشاء محتوى', icon: <Sparkles className="h-4 w-4" /> }
  ];

  const processContent = async () => {
    setIsProcessing(true);
    // محاكاة معالجة AI
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (selectedTask) {
      case 'enhance':
        setResult(currentContent.replace(/\./g, '. تم تحسين هذا النص بواسطة الذكاء الاصطناعي.'));
        break;
      case 'translate':
        setResult(language === 'ar' ? 'This is the translated content.' : 'هذا هو المحتوى المترجم.');
        break;
      case 'generate':
        setResult(`<h2>${prompt}</h2><p>محتوى تم إنشاؤه بالذكاء الاصطناعي حول: ${prompt}</p>`);
        break;
      default:
        setResult('تم معالجة المحتوى بنجاح.');
    }
    
    setIsProcessing(false);
    toast({ title: 'تم المعالجة', description: 'تم معالجة المحتوى بالذكاء الاصطناعي' });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            مساعد المحتوى الذكي المحسّن
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4">
          <div className="w-64 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">المهام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {aiTasks.map((task) => (
                  <Button
                    key={task.id}
                    variant={selectedTask === task.id ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setSelectedTask(task.id)}
                  >
                    {task.icon}
                    {task.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {selectedTask === 'generate' && (
              <Card>
                <CardContent className="pt-4">
                  <Textarea
                    placeholder="اكتب موضوع المحتوى..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={processContent} 
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
                  تشغيل الذكاء الاصطناعي
                </>
              )}
            </Button>
          </div>

          <div className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  النتيجة
                  {result && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(result)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => { onContentUpdate(result); onClose(); }}>
                        تطبيق
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: result }}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4" />
                    <p>اختر مهمة واضغط "تشغيل الذكاء الاصطناعي"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};