import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, Clock, Eye, Target, TrendingUp, 
  FileText, AlertCircle, CheckCircle, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';

interface ContentAnalyzerProps {
  content: string;
  language: 'ar' | 'en';
  isVisible: boolean;
}

export const ContentAnalyzer: React.FC<ContentAnalyzerProps> = ({
  content,
  language,
  isVisible
}) => {
  const [analysis, setAnalysis] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  React.useEffect(() => {
    if (content.trim()) {
      setIsAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        const mockAnalysis = {
          wordCount: content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length,
          characterCount: content.replace(/<[^>]*>/g, '').length,
          paragraphCount: content.split(/\n\s*\n/).length,
          readingTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200),
          readabilityScore: 75,
          keywordDensity: { 'كلمة': 2.5, 'مثال': 1.8 },
          seoSuggestions: ['أضف عناوين فرعية', 'حسّن الكلمات المفتاحية'],
          grammarIssues: [],
          sentiment: 'positive' as const
        };
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
      }, 1000);
    }
  }, [content]);

  if (!isVisible || !analysis) return null;

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadabilityLabel = (score: number) => {
    if (score >= 70) return 'سهل القراءة';
    if (score >= 50) return 'متوسط الصعوبة';
    return 'صعب القراءة';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'إيجابي';
      case 'negative': return 'سلبي';
      default: return 'محايد';
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
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            تحليل المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="mr-3">جاري التحليل...</span>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="keywords">الكلمات المفتاحية</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="quality">جودة المحتوى</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{analysis.wordCount}</div>
                    <div className="text-sm text-muted-foreground">كلمة</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{analysis.characterCount}</div>
                    <div className="text-sm text-muted-foreground">حرف</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{analysis.readingTime}</div>
                    <div className="text-sm text-muted-foreground">دقيقة قراءة</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{analysis.paragraphCount}</div>
                    <div className="text-sm text-muted-foreground">فقرة</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">سهولة القراءة</span>
                      <Badge className={getReadabilityColor(analysis.readabilityScore)}>
                        {getReadabilityLabel(analysis.readabilityScore)}
                      </Badge>
                    </div>
                    <Progress value={analysis.readabilityScore} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      النتيجة: {analysis.readabilityScore}/100
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">الطابع العام للمحتوى</span>
                    <Badge className={getSentimentColor(analysis.sentiment)}>
                      {getSentimentLabel(analysis.sentiment)}
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <h4 className="font-medium">الكلمات الأكثر تكراراً</h4>
                <div className="space-y-2">
                  {Object.entries(analysis.keywordDensity).map(([keyword, density]) => (
                    <div key={keyword} className="flex items-center justify-between">
                      <span className="text-sm">{keyword}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={Number(density)} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">
                          {Number(density).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {Object.keys(analysis.keywordDensity).length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    لا توجد كلمات مفتاحية كافية للتحليل
                  </div>
                )}
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  اقتراحات تحسين محركات البحث
                </h4>
                <div className="space-y-2">
                  {analysis.seoSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-amber-800">{suggestion}</span>
                    </div>
                  ))}
                </div>
                {analysis.seoSuggestions.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">المحتوى محسن بشكل جيد لمحركات البحث</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  مشاكل الجودة والقواعد
                </h4>
                <div className="space-y-2">
                  {analysis.grammarIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800">{issue}</span>
                    </div>
                  ))}
                </div>
                {analysis.grammarIssues.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">لم يتم العثور على مشاكل واضحة في القواعد</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};