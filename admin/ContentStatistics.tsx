import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, Clock, BarChart3, Target, 
  TrendingUp, Users, Eye, BookOpen 
} from 'lucide-react';

interface ContentStatisticsProps {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  seoScore?: number;
  readabilityScore?: number;
  language: 'ar' | 'en';
  lastSaved?: Date;
  viewCount?: number;
  engagementRate?: number;
}

export const ContentStatistics: React.FC<ContentStatisticsProps> = ({
  wordCount,
  characterCount,
  readingTime,
  seoScore = 0,
  readabilityScore = 0,
  language,
  lastSaved,
  viewCount = 0,
  engagementRate = 0
}) => {
  const getReadabilityLevel = (score: number) => {
    if (score >= 80) return { text: 'ممتاز', color: 'bg-aylol-blue' };
    if (score >= 60) return { text: 'جيد', color: 'bg-university-gold' };
    if (score >= 40) return { text: 'متوسط', color: 'bg-amber-500' };
    return { text: 'يحتاج تحسين', color: 'bg-destructive' };
  };

  const getSEOLevel = (score: number) => {
    if (score >= 90) return { text: 'محسن للغاية', color: 'bg-aylol-blue' };
    if (score >= 70) return { text: 'محسن جيد', color: 'bg-university-gold' };
    if (score >= 50) return { text: 'يحتاج تحسين', color: 'bg-amber-500' };
    return { text: 'غير محسن', color: 'bg-destructive' };
  };

  const readability = getReadabilityLevel(readabilityScore);
  const seo = getSEOLevel(seoScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* إحصائيات أساسية */}
      <Card className="bg-card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            إحصائيات المحتوى
          </CardTitle>
          <FileText className="h-4 w-4 text-aylol-blue" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">عدد الكلمات</span>
              <Badge variant="secondary" className="font-mono">
                {wordCount.toLocaleString('ar-SA')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">عدد الأحرف</span>
              <Badge variant="secondary" className="font-mono">
                {characterCount.toLocaleString('ar-SA')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">وقت القراءة</span>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} دقيقة
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تحليل جودة المحتوى */}
      <Card className="bg-card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            جودة المحتوى
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-university-gold" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">سهولة القراءة</span>
                <Badge className={readability.color}>
                  {readability.text}
                </Badge>
              </div>
              <Progress value={readabilityScore} className="h-2" />
              <span className="text-xs text-muted-foreground">
                {readabilityScore}%
              </span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">تحسين محركات البحث</span>
                <Badge className={seo.color}>
                  {seo.text}
                </Badge>
              </div>
              <Progress value={seoScore} className="h-2" />
              <span className="text-xs text-muted-foreground">
                {seoScore}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات الأداء */}
      <Card className="bg-card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            أداء المحتوى
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-aylol-gold" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">عدد المشاهدات</span>
              <Badge variant="outline" className="gap-1">
                <Eye className="h-3 w-3" />
                {viewCount.toLocaleString('ar-SA')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">معدل التفاعل</span>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {engagementRate}%
              </Badge>
            </div>
            {lastSaved && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">آخر حفظ</span>
                <Badge variant="secondary" className="text-xs">
                  {lastSaved.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* توصيات التحسين */}
      <Card className="bg-card-gradient md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            توصيات التحسين
          </CardTitle>
          <Target className="h-4 w-4 text-university-blue" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* توصيات طول المحتوى */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-aylol-blue">طول المحتوى</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {wordCount < 300 && (
                  <p className="text-amber-600">• المحتوى قصير، يُفضل إضافة المزيد</p>
                )}
                {wordCount > 2000 && (
                  <p className="text-amber-600">• المحتوى طويل، فكر في التقسيم</p>
                )}
                {wordCount >= 300 && wordCount <= 2000 && (
                  <p className="text-aylol-blue">• طول المحتوى مناسب</p>
                )}
              </div>
            </div>

            {/* توصيات SEO */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-university-gold">تحسين SEO</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {seoScore < 70 && (
                  <>
                    <p className="text-amber-600">• أضف كلمات مفتاحية مناسبة</p>
                    <p className="text-amber-600">• حسن العناوين والوصف</p>
                  </>
                )}
                {seoScore >= 70 && (
                  <p className="text-aylol-blue">• المحتوى محسن جيداً لمحركات البحث</p>
                )}
              </div>
            </div>

            {/* توصيات سهولة القراءة */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-aylol-gold">سهولة القراءة</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {readabilityScore < 60 && (
                  <>
                    <p className="text-amber-600">• استخدم جمل أقصر</p>
                    <p className="text-amber-600">• قسم النص إلى فقرات</p>
                  </>
                )}
                {readabilityScore >= 60 && (
                  <p className="text-aylol-blue">• المحتوى سهل القراءة</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};