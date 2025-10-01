import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Target, Globe, TrendingUp, CheckCircle, 
  AlertTriangle, Info, Copy, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface SEOToolboxProps {
  content: string;
  language: 'ar' | 'en';
  isVisible: boolean;
  onUpdateContent: (content: string) => void;
}

interface SEOMetrics {
  titleLength: number;
  metaDescriptionLength: number;
  keywordDensity: number;
  headingsStructure: string[];
  imageAltTexts: number;
  internalLinks: number;
  externalLinks: number;
}

export const SEOToolbox: React.FC<SEOToolboxProps> = ({
  content,
  language,
  isVisible,
  onUpdateContent
}) => {
  const [seoData, setSeoData] = useState({
    title: '',
    metaDescription: '',
    focusKeyword: '',
    slug: '',
    canonicalUrl: ''
  });

  const [generatedSuggestions, setGeneratedSuggestions] = useState<string[]>([]);

  if (!isVisible) return null;

  // Calculate SEO metrics
  const calculateSEOMetrics = (): SEOMetrics => {
    const cleanContent = content.replace(/<[^>]*>/g, '');
    const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
    
    // Extract headings
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || [];
    const headingsStructure = headings.map(h => {
      const level = h.match(/<h([1-6])/)?.[1] || '1';
      const text = h.replace(/<[^>]*>/g, '');
      return `H${level}: ${text}`;
    });

    // Count images with alt text
    const images = content.match(/<img[^>]*>/gi) || [];
    const imageAltTexts = images.filter(img => img.includes('alt=')).length;

    // Count links
    const allLinks = content.match(/<a[^>]*href="[^"]*"[^>]*>/gi) || [];
    const internalLinks = allLinks.filter(link => 
      !link.includes('http://') && !link.includes('https://')
    ).length;
    const externalLinks = allLinks.length - internalLinks;

    // Calculate keyword density
    const keywordCount = seoData.focusKeyword ? 
      (content.toLowerCase().split(seoData.focusKeyword.toLowerCase()).length - 1) : 0;
    const keywordDensity = words.length > 0 ? (keywordCount / words.length) * 100 : 0;

    return {
      titleLength: seoData.title.length,
      metaDescriptionLength: seoData.metaDescription.length,
      keywordDensity,
      headingsStructure,
      imageAltTexts,
      internalLinks,
      externalLinks
    };
  };

  const metrics = calculateSEOMetrics();

  const generateSEOSuggestions = () => {
    const suggestions: string[] = [];
    
    // Title suggestions
    if (metrics.titleLength < 30) {
      suggestions.push('العنوان قصير جداً، يفضل أن يكون بين 50-60 حرف');
    } else if (metrics.titleLength > 60) {
      suggestions.push('العنوان طويل جداً، قد يتم قطعه في نتائج البحث');
    }

    // Meta description
    if (metrics.metaDescriptionLength < 120) {
      suggestions.push('الوصف التعريفي قصير، يفضل أن يكون بين 150-160 حرف');
    } else if (metrics.metaDescriptionLength > 160) {
      suggestions.push('الوصف التعريفي طويل، قد يتم قطعه في نتائج البحث');
    }

    // Keyword density
    if (metrics.keywordDensity < 0.5) {
      suggestions.push('كثافة الكلمة المفتاحية منخفضة، حاول استخدامها أكثر');
    } else if (metrics.keywordDensity > 3) {
      suggestions.push('كثافة الكلمة المفتاحية عالية، قد يعتبر حشو كلمات');
    }

    // Headings structure
    if (metrics.headingsStructure.length === 0) {
      suggestions.push('لا توجد عناوين فرعية، أضف عناوين H1, H2, H3 لتحسين التنظيم');
    }

    // Images
    if (metrics.imageAltTexts === 0 && content.includes('<img')) {
      suggestions.push('الصور لا تحتوي على نص بديل (alt text)');
    }

    setGeneratedSuggestions(suggestions);
  };

  const generateTitle = () => {
    if (!seoData.focusKeyword) {
      toast({
        title: 'خطأ',
        description: 'أدخل الكلمة المفتاحية أولاً',
        variant: 'destructive'
      });
      return;
    }

    const titleSuggestions = [
      `دليل شامل عن ${seoData.focusKeyword} - كلية أيلول الجامعية`,
      `كل ما تحتاج معرفته عن ${seoData.focusKeyword}`,
      `${seoData.focusKeyword}: المفاهيم والتطبيقات العملية`,
      `تعلم ${seoData.focusKeyword} خطوة بخطوة`
    ];

    const randomTitle = titleSuggestions[Math.floor(Math.random() * titleSuggestions.length)];
    setSeoData(prev => ({ ...prev, title: randomTitle }));
  };

  const generateMetaDescription = () => {
    if (!seoData.focusKeyword) {
      toast({
        title: 'خطأ',
        description: 'أدخل الكلمة المفتاحية أولاً',
        variant: 'destructive'
      });
      return;
    }

    const cleanContent = content.replace(/<[^>]*>/g, '').substring(0, 150);
    const description = `اكتشف كل ما يتعلق بـ ${seoData.focusKeyword} من خلال ${cleanContent}... تعرف على المزيد في كلية أيلول الجامعية.`;
    
    setSeoData(prev => ({ ...prev, metaDescription: description }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'تم النسخ',
      description: `تم نسخ ${label} إلى الحافظة`
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateOverallScore = () => {
    let score = 0;
    let maxScore = 0;

    // Title score
    maxScore += 20;
    if (metrics.titleLength >= 50 && metrics.titleLength <= 60) score += 20;
    else if (metrics.titleLength >= 30 && metrics.titleLength <= 70) score += 15;
    else if (metrics.titleLength > 0) score += 10;

    // Meta description score
    maxScore += 20;
    if (metrics.metaDescriptionLength >= 150 && metrics.metaDescriptionLength <= 160) score += 20;
    else if (metrics.metaDescriptionLength >= 120 && metrics.metaDescriptionLength <= 180) score += 15;
    else if (metrics.metaDescriptionLength > 0) score += 10;

    // Keyword density score
    maxScore += 20;
    if (metrics.keywordDensity >= 0.5 && metrics.keywordDensity <= 3) score += 20;
    else if (metrics.keywordDensity > 0) score += 10;

    // Headings score
    maxScore += 20;
    if (metrics.headingsStructure.length >= 3) score += 20;
    else if (metrics.headingsStructure.length >= 1) score += 15;

    // Content length score
    maxScore += 20;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    if (wordCount >= 300) score += 20;
    else if (wordCount >= 150) score += 15;
    else if (wordCount >= 50) score += 10;

    return Math.round((score / maxScore) * 100);
  };

  const overallScore = calculateOverallScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              أدوات تحسين محركات البحث
            </div>
            <Badge className={getScoreColor(overallScore)}>
              نتيجة SEO: {overallScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">الأساسيات</TabsTrigger>
              <TabsTrigger value="analysis">التحليل</TabsTrigger>
              <TabsTrigger value="suggestions">الاقتراحات</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="focus-keyword">الكلمة المفتاحية الرئيسية</Label>
                  <Input
                    id="focus-keyword"
                    value={seoData.focusKeyword}
                    onChange={(e) => setSeoData(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="أدخل الكلمة المفتاحية الرئيسية"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seo-title">عنوان الصفحة (Title Tag)</Label>
                    <div className="flex gap-2">
                      <Badge variant={metrics.titleLength >= 50 && metrics.titleLength <= 60 ? "default" : "secondary"}>
                        {metrics.titleLength}/60
                      </Badge>
                      <Button size="sm" variant="outline" onClick={generateTitle}>
                        <Zap className="h-4 w-4 mr-1" />
                        توليد
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      id="seo-title"
                      value={seoData.title}
                      onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="أدخل عنوان الصفحة"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(seoData.title, 'العنوان')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <Progress value={(metrics.titleLength / 60) * 100} className="h-1" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meta-description">الوصف التعريفي (Meta Description)</Label>
                    <div className="flex gap-2">
                      <Badge variant={metrics.metaDescriptionLength >= 150 && metrics.metaDescriptionLength <= 160 ? "default" : "secondary"}>
                        {metrics.metaDescriptionLength}/160
                      </Badge>
                      <Button size="sm" variant="outline" onClick={generateMetaDescription}>
                        <Zap className="h-4 w-4 mr-1" />
                        توليد
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Textarea
                      id="meta-description"
                      value={seoData.metaDescription}
                      onChange={(e) => setSeoData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="أدخل الوصف التعريفي للصفحة"
                      rows={3}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute left-2 top-2 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(seoData.metaDescription, 'الوصف التعريفي')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <Progress value={(metrics.metaDescriptionLength / 160) * 100} className="h-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">الرابط المختصر (Slug)</Label>
                    <Input
                      id="slug"
                      value={seoData.slug}
                      onChange={(e) => setSeoData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="page-url-slug"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canonical-url">الرابط المعياري</Label>
                    <Input
                      id="canonical-url"
                      value={seoData.canonicalUrl}
                      onChange={(e) => setSeoData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                      placeholder="https://example.com/page"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">كثافة الكلمة المفتاحية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {metrics.keywordDensity.toFixed(1)}%
                    </div>
                    <Progress value={Math.min(metrics.keywordDensity * 10, 100)} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      النطاق المثالي: 0.5% - 3%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">هيكل العناوين</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {metrics.headingsStructure.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      عناوين فرعية
                    </div>
                    {metrics.headingsStructure.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {metrics.headingsStructure.slice(0, 3).map((heading, index) => (
                          <div key={index} className="text-xs bg-muted p-1 rounded truncate">
                            {heading}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">الروابط</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">داخلية</span>
                        <Badge variant="outline">{metrics.internalLinks}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">خارجية</span>
                        <Badge variant="outline">{metrics.externalLinks}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">الصور</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">
                      {metrics.imageAltTexts}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      صور بنص بديل
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">اقتراحات التحسين</h4>
                <Button size="sm" onClick={generateSEOSuggestions}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  تحديث الاقتراحات
                </Button>
              </div>

              <div className="space-y-3">
                {generatedSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-800">{suggestion}</span>
                  </div>
                ))}
                {generatedSuggestions.length === 0 && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      المحتوى محسن بشكل جيد! اضغط على "تحديث الاقتراحات" للحصول على تحليل مفصل.
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};