import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import {
  Zap,
  Clock,
  Database,
  Image,
  FileText,
  Gauge,
  TrendingUp,
  Settings,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Upload,
  HardDrive,
  Wifi,
  Monitor
} from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  cacheSize: number;
  imageOptimization: number;
  bundleSize: number;
  networkRequests: number;
  renderTime: number;
  interactivity: number;
}

interface OptimizationSuggestion {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'images' | 'cache' | 'bundle' | 'network' | 'rendering';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  autoFixable: boolean;
  implemented: boolean;
}

interface CacheStats {
  totalSize: number;
  itemCount: number;
  hitRate: number;
  categories: {
    images: { size: number; count: number };
    content: { size: number; count: number };
    api: { size: number; count: number };
    assets: { size: number; count: number };
  };
}

interface PerformanceOptimizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_METRICS: PerformanceMetrics = {
  loadTime: 2.3,
  memoryUsage: 45.7,
  cacheSize: 12.4,
  imageOptimization: 78,
  bundleSize: 1.2,
  networkRequests: 24,
  renderTime: 890,
  interactivity: 92
};

const SAMPLE_SUGGESTIONS: OptimizationSuggestion[] = [
  {
    id: 'img-compression',
    type: 'critical',
    category: 'images',
    title: 'ضغط الصور غير المُحسّنة',
    description: 'يوجد 12 صورة يمكن ضغطها لتوفير 2.3MB من حجم التحميل',
    impact: 'high',
    effort: 'easy',
    autoFixable: true,
    implemented: false
  },
  {
    id: 'cache-strategy',
    type: 'warning',
    category: 'cache',
    title: 'تحسين استراتيجية التخزين المؤقت',
    description: 'بعض العناصر المهمة غير مخزنة مؤقتاً بكفاءة',
    impact: 'medium',
    effort: 'medium',
    autoFixable: true,
    implemented: false
  },
  {
    id: 'bundle-splitting',
    type: 'info',
    category: 'bundle',
    title: 'تقسيم حزم JavaScript',
    description: 'يمكن تقسيم الحزم لتحسين التحميل الأولي',
    impact: 'medium',
    effort: 'hard',
    autoFixable: false,
    implemented: false
  },
  {
    id: 'preload-critical',
    type: 'warning',
    category: 'network',
    title: 'تحميل الموارد الحرجة مسبقاً',
    description: 'تحديد وتحميل الموارد المهمة مسبقاً لتحسين الأداء',
    impact: 'high',
    effort: 'easy',
    autoFixable: true,
    implemented: false
  }
];

const SAMPLE_CACHE_STATS: CacheStats = {
  totalSize: 45.7,
  itemCount: 234,
  hitRate: 87.5,
  categories: {
    images: { size: 23.4, count: 89 },
    content: { size: 12.8, count: 67 },
    api: { size: 6.3, count: 45 },
    assets: { size: 3.2, count: 33 }
  }
};

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  isOpen,
  onClose
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(SAMPLE_METRICS);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>(SAMPLE_SUGGESTIONS);
  const [cacheStats, setCacheStats] = useState<CacheStats>(SAMPLE_CACHE_STATS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate performance score
  const performanceScore = useMemo(() => {
    const weights = {
      loadTime: 0.25,
      memoryUsage: 0.15,
      imageOptimization: 0.20,
      bundleSize: 0.15,
      networkRequests: 0.10,
      interactivity: 0.15
    };

    const scores = {
      loadTime: Math.max(0, 100 - (metrics.loadTime - 1) * 20),
      memoryUsage: Math.max(0, 100 - metrics.memoryUsage),
      imageOptimization: metrics.imageOptimization,
      bundleSize: Math.max(0, 100 - (metrics.bundleSize - 0.8) * 40),
      networkRequests: Math.max(0, 100 - (metrics.networkRequests - 10) * 3),
      interactivity: metrics.interactivity
    };

    return Math.round(
      Object.entries(weights).reduce((total, [key, weight]) => {
        return total + (scores[key as keyof typeof scores] * weight);
      }, 0)
    );
  }, [metrics]);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update metrics with slight variations
    setMetrics(prev => ({
      ...prev,
      loadTime: prev.loadTime + (Math.random() - 0.5) * 0.2,
      memoryUsage: Math.max(0, prev.memoryUsage + (Math.random() - 0.5) * 10),
      networkRequests: Math.max(0, prev.networkRequests + Math.floor((Math.random() - 0.5) * 6))
    }));
    
    setIsAnalyzing(false);
    
    toast({
      title: 'تم تحليل الأداء',
      description: 'تم إكمال تحليل شامل للأداء'
    });
  }, []);

  const applyOptimization = useCallback(async (suggestionId: string) => {
    setIsOptimizing(true);
    
    // Simulate optimization
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuggestions(prev => prev.map(suggestion => 
      suggestion.id === suggestionId
        ? { ...suggestion, implemented: true }
        : suggestion
    ));
    
    setIsOptimizing(false);
    
    toast({
      title: 'تم تطبيق التحسين',
      description: 'تم تطبيق التحسين بنجاح'
    });
  }, []);

  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Clear localStorage and sessionStorage selectively
    const keysToKeep = ['theme', 'language', 'user-preferences'];
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    setCacheStats(prev => ({
      ...prev,
      totalSize: 0,
      itemCount: 0,
      categories: {
        images: { size: 0, count: 0 },
        content: { size: 0, count: 0 },
        api: { size: 0, count: 0 },
        assets: { size: 0, count: 0 }
      }
    }));
    
    toast({
      title: 'تم مسح التخزين المؤقت',
      description: 'تم مسح جميع البيانات المؤقتة بنجاح'
    });
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            مُحسِّن الأداء
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">النظرة العامة</TabsTrigger>
            <TabsTrigger value="suggestions">التوصيات</TabsTrigger>
            <TabsTrigger value="cache">التخزين المؤقت</TabsTrigger>
            <TabsTrigger value="advanced">متقدم</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  نقاط الأداء الإجمالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className={`text-6xl font-bold ${getScoreColor(performanceScore)} bg-gradient-to-br ${getScoreBgColor(performanceScore)} rounded-full w-32 h-32 flex items-center justify-center`}>
                    {performanceScore}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    {performanceScore >= 90 ? 'أداء ممتاز' : 
                     performanceScore >= 70 ? 'أداء جيد' : 
                     'يحتاج تحسين'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    وقت التحميل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.loadTime.toFixed(1)}s</div>
                  <Progress value={Math.max(0, 100 - (metrics.loadTime - 1) * 20)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    استخدام الذاكرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.memoryUsage.toFixed(1)}MB</div>
                  <Progress value={Math.max(0, 100 - metrics.memoryUsage)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    تحسين الصور
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.imageOptimization}%</div>
                  <Progress value={metrics.imageOptimization} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    طلبات الشبكة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.networkRequests}</div>
                  <Progress value={Math.max(0, 100 - (metrics.networkRequests - 10) * 3)} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="gap-2"
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    تحليل الأداء
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={clearCache}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    مسح التخزين المؤقت
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    إعادة تحميل الصفحة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">توصيات التحسين</h3>
              <Badge variant="secondary">
                {suggestions.filter(s => !s.implemented).length} توصية متاحة
              </Badge>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-4">
                {suggestions.map(suggestion => (
                  <Card key={suggestion.id} className={suggestion.implemented ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {suggestion.type === 'critical' && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            {suggestion.type === 'warning' && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            {suggestion.type === 'info' && (
                              <Info className="h-4 w-4 text-blue-500" />
                            )}
                            
                            <h4 className="font-medium">{suggestion.title}</h4>
                            
                            {suggestion.implemented && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {suggestion.description}
                          </p>
                          
                          <div className="flex gap-2">
                            <Badge variant={
                              suggestion.impact === 'high' ? 'destructive' :
                              suggestion.impact === 'medium' ? 'default' : 'secondary'
                            }>
                              تأثير {suggestion.impact === 'high' ? 'عالي' : suggestion.impact === 'medium' ? 'متوسط' : 'منخفض'}
                            </Badge>
                            
                            <Badge variant="outline">
                              {suggestion.effort === 'easy' ? 'سهل' : suggestion.effort === 'medium' ? 'متوسط' : 'صعب'}
                            </Badge>
                            
                            {suggestion.autoFixable && (
                              <Badge variant="secondary">قابل للإصلاح التلقائي</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {!suggestion.implemented && suggestion.autoFixable && (
                            <Button
                              size="sm"
                              onClick={() => applyOptimization(suggestion.id)}
                              disabled={isOptimizing}
                            >
                              {isOptimizing ? 'جارٍ التطبيق...' : 'تطبيق'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="cache" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">الحجم الإجمالي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheStats.totalSize.toFixed(1)}MB</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">عدد العناصر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheStats.itemCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">معدل النجاح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheStats.hitRate}%</div>
                  <Progress value={cacheStats.hitRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">الفئات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>تفاصيل التخزين المؤقت حسب الفئة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(cacheStats.categories).map(([category, stats]) => (
                    <div key={category} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {category === 'images' && <Image className="h-5 w-5" />}
                        {category === 'content' && <FileText className="h-5 w-5" />}
                        {category === 'api' && <Database className="h-5 w-5" />}
                        {category === 'assets' && <Download className="h-5 w-5" />}
                        
                        <div>
                          <div className="font-medium">
                            {category === 'images' && 'الصور'}
                            {category === 'content' && 'المحتوى'}
                            {category === 'api' && 'API'}
                            {category === 'assets' && 'الأصول'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stats.count} عنصر - {stats.size.toFixed(1)}MB
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات المتقدمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">حجم التخزين المؤقت الأقصى (MB)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      defaultValue="100"
                      min="10"
                      max="1000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">مدة انتهاء صلاحية التخزين المؤقت (ساعات)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      defaultValue="24"
                      min="1"
                      max="168"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">تحسين الصور تلقائياً</label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">ضغط الاستجابات</label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">تحميل الموارد مسبقاً</label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">تمكين Service Worker</label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="gap-2">
                    <Settings className="h-4 w-4" />
                    حفظ الإعدادات
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    تصدير التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};