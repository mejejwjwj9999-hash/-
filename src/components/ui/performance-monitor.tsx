import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Database, Wifi } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  dbResponseTime: number;
  networkLatency: number;
  memoryUsage: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    dbResponseTime: 0,
    networkLatency: 0,
    memoryUsage: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Monitor performance metrics
    const startTime = performance.now();
    
    // Simulate metrics collection
    const collectMetrics = () => {
      const loadTime = Math.round(performance.now() - startTime);
      const dbResponseTime = Math.round(Math.random() * 100 + 50);
      const networkLatency = Math.round(Math.random() * 50 + 20);
      
      // Safely check for memory API
      let memoryUsage = 0;
      if ('memory' in performance && (performance as any).memory) {
        memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
      }

      setMetrics({
        loadTime,
        dbResponseTime,
        networkLatency,
        memoryUsage
      });
    };

    const timer = setTimeout(collectMetrics, 1000);
    
    // Show monitor in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'bg-green-500';
    if (value <= thresholds.warning) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-64 shadow-lg bg-white/95 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-university-blue" />
          <span className="text-sm font-semibold">مراقب الأداء</span>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>وقت التحميل</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-white ${getPerformanceColor(metrics.loadTime, { good: 1000, warning: 3000 })}`}
            >
              {metrics.loadTime}ms
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>قاعدة البيانات</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-white ${getPerformanceColor(metrics.dbResponseTime, { good: 100, warning: 300 })}`}
            >
              {metrics.dbResponseTime}ms
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>الشبكة</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-white ${getPerformanceColor(metrics.networkLatency, { good: 50, warning: 100 })}`}
            >
              {metrics.networkLatency}ms
            </Badge>
          </div>

          {metrics.memoryUsage > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>الذاكرة</span>
              </div>
              <Badge 
                variant="outline" 
                className={`text-white ${getPerformanceColor(metrics.memoryUsage, { good: 50, warning: 100 })}`}
              >
                {metrics.memoryUsage}MB
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;