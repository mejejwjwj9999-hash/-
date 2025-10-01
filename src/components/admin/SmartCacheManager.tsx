import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  Database,
  Clock,
  HardDrive,
  Trash2,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Timer,
  Zap,
  Archive,
  BarChart3
} from 'lucide-react';

interface CacheEntry {
  key: string;
  category: 'content' | 'images' | 'api' | 'assets' | 'user-data';
  size: number;
  hitCount: number;
  lastAccessed: Date;
  createdAt: Date;
  expiresAt?: Date;
  priority: 'high' | 'medium' | 'low';
  isStale: boolean;
  compressed: boolean;
  metadata?: any;
}

interface CacheStats {
  totalSize: number;
  totalEntries: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  compressionRatio: number;
  categories: Record<string, { size: number; count: number; hitRate: number }>;
}

interface SmartCacheManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_CACHE_ENTRIES: CacheEntry[] = [
  {
    key: 'content-page-home-ar',
    category: 'content',
    size: 2.4,
    hitCount: 156,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22),
    priority: 'high',
    isStale: false,
    compressed: true,
    metadata: { pageKey: 'home', language: 'ar' }
  },
  {
    key: 'image-hero-banner.webp',
    category: 'images',
    size: 145.7,
    hitCount: 89,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 15),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    priority: 'medium',
    isStale: false,
    compressed: true,
    metadata: { format: 'webp', optimized: true }
  },
  {
    key: 'api-students-list',
    category: 'api',
    size: 12.3,
    hitCount: 234,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    priority: 'high',
    isStale: false,
    compressed: true,
    metadata: { endpoint: '/api/students', version: 'v2' }
  },
  {
    key: 'user-preferences-theme',
    category: 'user-data',
    size: 0.8,
    hitCount: 445,
    lastAccessed: new Date(Date.now() - 1000 * 60),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    priority: 'high',
    isStale: false,
    compressed: false,
    metadata: { persistent: true }
  },
  {
    key: 'assets-old-script.js',
    category: 'assets',
    size: 67.2,
    hitCount: 12,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    priority: 'low',
    isStale: true,
    compressed: false,
    metadata: { version: '1.0.0', deprecated: true }
  }
];

export const SmartCacheManager: React.FC<SmartCacheManagerProps> = ({
  isOpen,
  onClose
}) => {
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>(SAMPLE_CACHE_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'size' | 'hitCount' | 'lastAccessed' | 'priority'>('lastAccessed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('entries');

  // Calculate cache statistics
  const cacheStats: CacheStats = React.useMemo(() => {
    const totalSize = cacheEntries.reduce((sum, entry) => sum + entry.size, 0);
    const totalEntries = cacheEntries.length;
    const totalHits = cacheEntries.reduce((sum, entry) => sum + entry.hitCount, 0);
    const totalAccesses = totalHits + 100; // Assuming some misses
    const hitRate = (totalHits / totalAccesses) * 100;
    const missRate = 100 - hitRate;
    const compressedEntries = cacheEntries.filter(entry => entry.compressed);
    const compressionRatio = compressedEntries.length / totalEntries * 100;

    const categories = cacheEntries.reduce((acc, entry) => {
      if (!acc[entry.category]) {
        acc[entry.category] = { size: 0, count: 0, hitRate: 0 };
      }
      acc[entry.category].size += entry.size;
      acc[entry.category].count += 1;
      acc[entry.category].hitRate += entry.hitCount;
      return acc;
    }, {} as Record<string, { size: number; count: number; hitRate: number }>);

    // Calculate hit rates for categories
    Object.keys(categories).forEach(category => {
      const categoryEntries = cacheEntries.filter(entry => entry.category === category);
      const categoryHits = categoryEntries.reduce((sum, entry) => sum + entry.hitCount, 0);
      const categoryAccesses = categoryHits + categoryEntries.length * 10; // Estimate
      categories[category].hitRate = (categoryHits / categoryAccesses) * 100;
    });

    return {
      totalSize,
      totalEntries,
      hitRate,
      missRate,
      evictionCount: 23,
      compressionRatio,
      categories
    };
  }, [cacheEntries]);

  // Filter and sort entries
  const filteredEntries = React.useMemo(() => {
    let filtered = cacheEntries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'lastAccessed' || sortBy === 'priority') {
        if (sortBy === 'lastAccessed') {
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        } else if (sortBy === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[aValue as keyof typeof priorityOrder];
          bValue = priorityOrder[bValue as keyof typeof priorityOrder];
        }
      }

      if (sortOrder === 'desc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    });

    return filtered;
  }, [cacheEntries, searchQuery, selectedCategory, sortBy, sortOrder]);

  const handleSelectEntry = useCallback((key: string) => {
    setSelectedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedEntries.size === filteredEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredEntries.map(entry => entry.key)));
    }
  }, [selectedEntries.size, filteredEntries]);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedEntries.size === 0) return;

    setCacheEntries(prev => prev.filter(entry => !selectedEntries.has(entry.key)));
    setSelectedEntries(new Set());

    toast({
      title: 'تم حذف العناصر المحددة',
      description: `تم حذف ${selectedEntries.size} عنصر من التخزين المؤقت`
    });
  }, [selectedEntries]);

  const handleOptimizeCache = useCallback(async () => {
    setIsOptimizing(true);

    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Remove stale entries and compress uncompressed ones
    setCacheEntries(prev => prev
      .filter(entry => !entry.isStale)
      .map(entry => ({
        ...entry,
        compressed: true,
        size: entry.compressed ? entry.size : entry.size * 0.7 // Simulate compression
      }))
    );

    setIsOptimizing(false);

    toast({
      title: 'تم تحسين التخزين المؤقت',
      description: 'تم ضغط البيانات وإزالة العناصر القديمة'
    });
  }, []);

  const handleRefreshEntry = useCallback((key: string) => {
    setCacheEntries(prev => prev.map(entry => 
      entry.key === key
        ? { ...entry, lastAccessed: new Date(), isStale: false }
        : entry
    ));

    toast({
      title: 'تم تحديث العنصر',
      description: 'تم تحديث العنصر من المصدر الأصلي'
    });
  }, []);

  const formatSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB.toFixed(1)} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعة`;
    return `${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content': return <Archive className="h-4 w-4" />;
      case 'images': return <Eye className="h-4 w-4" />;
      case 'api': return <Database className="h-4 w-4" />;
      case 'assets': return <Download className="h-4 w-4" />;
      case 'user-data': return <Settings className="h-4 w-4" />;
      default: return <HardDrive className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      content: 'المحتوى',
      images: 'الصور',
      api: 'API',
      assets: 'الأصول',
      'user-data': 'بيانات المستخدم'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            مدير التخزين المؤقت الذكي
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entries">العناصر المخزنة</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في العناصر المخزنة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">جميع الفئات</option>
                <option value="content">المحتوى</option>
                <option value="images">الصور</option>
                <option value="api">API</option>
                <option value="assets">الأصول</option>
                <option value="user-data">بيانات المستخدم</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-3 py-2 border rounded-md"
              >
                <option value="lastAccessed-desc">آخر وصول (الأحدث)</option>
                <option value="lastAccessed-asc">آخر وصول (الأقدم)</option>
                <option value="size-desc">الحجم (الأكبر)</option>
                <option value="size-asc">الحجم (الأصغر)</option>
                <option value="hitCount-desc">مرات الوصول (الأكثر)</option>
                <option value="hitCount-asc">مرات الوصول (الأقل)</option>
                <option value="priority-desc">الأولوية (عالية)</option>
                <option value="priority-asc">الأولوية (منخفضة)</option>
              </select>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedEntries.size === filteredEntries.length ? 'إلغاء التحديد' : 'تحديد الكل'}
                </Button>

                {selectedEntries.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    حذف المحدد ({selectedEntries.size})
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={handleOptimizeCache}
                  disabled={isOptimizing}
                  className="gap-2"
                >
                  {isOptimizing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  تحسين التخزين المؤقت
                </Button>
              </div>
            </div>

            {/* Cache Entries Table */}
            <ScrollArea className="h-96 border rounded-lg">
              <div className="space-y-1 p-2">
                {filteredEntries.map(entry => (
                  <Card 
                    key={entry.key} 
                    className={`cursor-pointer transition-colors ${
                      selectedEntries.has(entry.key) ? 'bg-blue-50 border-blue-200' : ''
                    } ${entry.isStale ? 'opacity-60' : ''}`}
                    onClick={() => handleSelectEntry(entry.key)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedEntries.has(entry.key)}
                            onChange={() => handleSelectEntry(entry.key)}
                            className="rounded"
                            onClick={(e) => e.stopPropagation()}
                          />

                          <div className="flex items-center gap-2">
                            {getCategoryIcon(entry.category)}
                            <div>
                              <div className="font-medium text-sm">{entry.key}</div>
                              <div className="text-xs text-muted-foreground">
                                {getCategoryLabel(entry.category)} • {formatSize(entry.size)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{entry.hitCount}</div>
                            <div className="text-xs text-muted-foreground">مرة وصول</div>
                          </div>

                          <div className="text-center">
                            <div className="font-medium">{formatTimeAgo(entry.lastAccessed)}</div>
                            <div className="text-xs text-muted-foreground">آخر وصول</div>
                          </div>

                          <Badge className={getPriorityColor(entry.priority)}>
                            {entry.priority === 'high' ? 'عالية' : 
                             entry.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </Badge>

                          <div className="flex gap-1">
                            {entry.compressed && (
                              <Badge variant="secondary" className="text-xs">مضغوط</Badge>
                            )}
                            {entry.isStale && (
                              <Badge variant="destructive" className="text-xs">قديم</Badge>
                            )}
                            {entry.expiresAt && new Date() > entry.expiresAt && (
                              <Badge variant="outline" className="text-xs">منتهي الصلاحية</Badge>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefreshEntry(entry.key);
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    إجمالي الحجم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatSize(cacheStats.totalSize)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cacheStats.totalEntries} عنصر
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    معدل النجاح
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheStats.hitRate.toFixed(1)}%</div>
                  <Progress value={cacheStats.hitRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    نسبة الضغط
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheStats.compressionRatio.toFixed(1)}%</div>
                  <Progress value={cacheStats.compressionRatio} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    عمليات الإخلاء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheStats.evictionCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    آخر 24 ساعة
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  توزيع الفئات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(cacheStats.categories).map(([category, stats]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span className="font-medium">{getCategoryLabel(category)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatSize(stats.size)} • {stats.count} عنصر • {stats.hitRate.toFixed(1)}% نجاح
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(stats.size / cacheStats.totalSize) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>الحجم: {((stats.size / cacheStats.totalSize) * 100).toFixed(1)}%</span>
                          <span>العدد: {((stats.count / cacheStats.totalEntries) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات التخزين المؤقت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="max-cache-size">الحد الأقصى لحجم التخزين المؤقت (MB)</Label>
                      <Input
                        id="max-cache-size"
                        type="number"
                        defaultValue="200"
                        min="50"
                        max="2000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="default-ttl">مدة انتهاء الصلاحية الافتراضية (دقيقة)</Label>
                      <Input
                        id="default-ttl"
                        type="number"
                        defaultValue="1440"
                        min="5"
                        max="10080"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cleanup-interval">فترة التنظيف التلقائي (دقيقة)</Label>
                      <Input
                        id="cleanup-interval"
                        type="number"
                        defaultValue="60"
                        min="10"
                        max="1440"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="compression-threshold">حد ضغط البيانات (KB)</Label>
                      <Input
                        id="compression-threshold"
                        type="number"
                        defaultValue="10"
                        min="1"
                        max="1000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="eviction-policy">سياسة الإخلاء</Label>
                      <select id="eviction-policy" className="w-full p-2 border rounded">
                        <option value="lru">الأقل استخداماً مؤخراً (LRU)</option>
                        <option value="lfu">الأقل استخداماً (LFU)</option>
                        <option value="fifo">الداخل أولاً خارج أولاً (FIFO)</option>
                        <option value="random">عشوائي</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="priority-weights">أوزان الأولوية</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input placeholder="عالية" defaultValue="3" />
                        <Input placeholder="متوسطة" defaultValue="2" />
                        <Input placeholder="منخفضة" defaultValue="1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">إعدادات الفئات</h4>
                  
                  {Object.keys(cacheStats.categories).map(category => (
                    <div key={category} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="font-medium">{getCategoryLabel(category)}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>الحد الأقصى للحجم (MB)</Label>
                          <Input
                            type="number"
                            defaultValue={Math.ceil(cacheStats.categories[category].size * 2)}
                            min="5"
                            max="500"
                          />
                        </div>
                        
                        <div>
                          <Label>مدة انتهاء الصلاحية (دقيقة)</Label>
                          <Input
                            type="number"
                            defaultValue={category === 'api' ? 15 : category === 'images' ? 1440 : 720}
                            min="5"
                            max="10080"
                          />
                        </div>
                        
                        <div>
                          <Label>الأولوية الافتراضية</Label>
                          <select className="w-full p-2 border rounded">
                            <option value="high">عالية</option>
                            <option value="medium">متوسطة</option>
                            <option value="low">منخفضة</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked={category !== 'user-data'}
                              className="rounded"
                            />
                            <span className="text-sm">تمكين الضغط</span>
                          </label>
                          
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked={category === 'content' || category === 'api'}
                              className="rounded"
                            />
                            <span className="text-sm">التحديث التلقائي</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="gap-2">
                    <Settings className="h-4 w-4" />
                    حفظ الإعدادات
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    تصدير الإعدادات
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    استيراد الإعدادات
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