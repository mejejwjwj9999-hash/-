import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  Calendar,
  BarChart3,
  Activity,
  Target,
  Award,
  FileText,
  MousePointer,
  Share2,
  Download
} from 'lucide-react';

export const ContentAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedSection, setSelectedSection] = useState('all');

  // Mock data - replace with real data from your analytics service
  const viewsData = [
    { name: 'من نحن', views: 1250, uniqueViews: 980, bounceRate: 15 },
    { name: 'كلمة العميد', views: 890, uniqueViews: 720, bounceRate: 22 },
    { name: 'الرؤية والرسالة', views: 1100, uniqueViews: 850, bounceRate: 18 },
    { name: 'مجلس الإدارة', views: 650, uniqueViews: 520, bounceRate: 25 },
    { name: 'ضمان الجودة', views: 430, uniqueViews: 350, bounceRate: 28 },
    { name: 'البحث العلمي', views: 780, uniqueViews: 620, bounceRate: 20 }
  ];

  const timeSeriesData = [
    { date: '2024-01-01', views: 120, engagement: 85 },
    { date: '2024-01-02', views: 140, engagement: 88 },
    { date: '2024-01-03', views: 100, engagement: 82 },
    { date: '2024-01-04', views: 160, engagement: 90 },
    { date: '2024-01-05', views: 180, engagement: 95 },
    { date: '2024-01-06', views: 150, engagement: 87 },
    { date: '2024-01-07', views: 200, engagement: 92 }
  ];

  const deviceData = [
    { name: 'الهاتف المحمول', value: 65, color: '#3b82f6' },
    { name: 'سطح المكتب', value: 28, color: '#10b981' },
    { name: 'الجهاز اللوحي', value: 7, color: '#f59e0b' }
  ];

  const topPages = [
    { 
      page: 'من نحن - الصفحة الرئيسية', 
      views: 1250, 
      avgTime: '2:45', 
      bounceRate: 15,
      trend: 'up'
    },
    { 
      page: 'الرؤية والرسالة', 
      views: 1100, 
      avgTime: '3:20', 
      bounceRate: 18,
      trend: 'up'
    },
    { 
      page: 'كلمة العميد', 
      views: 890, 
      avgTime: '2:10', 
      bounceRate: 22,
      trend: 'down'
    },
    { 
      page: 'البحث العلمي', 
      views: 780, 
      avgTime: '4:15', 
      bounceRate: 20,
      trend: 'up'
    }
  ];

  const contentPerformance = [
    { 
      type: 'النصوص', 
      count: 45, 
      avgEngagement: 78, 
      lastUpdated: '2024-01-20',
      status: 'good'
    },
    { 
      type: 'الصور', 
      count: 28, 
      avgEngagement: 85, 
      lastUpdated: '2024-01-18',
      status: 'excellent'
    },
    { 
      type: 'الفيديوهات', 
      count: 12, 
      avgEngagement: 92, 
      lastUpdated: '2024-01-15',
      status: 'excellent'
    },
    { 
      type: 'المستندات', 
      count: 18, 
      avgEngagement: 65, 
      lastUpdated: '2024-01-10',
      status: 'needs-improvement'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs-improvement': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'ممتاز';
      case 'good': return 'جيد';
      case 'needs-improvement': return 'يحتاج تحسين';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">تحليلات المحتوى</h1>
          <p className="text-muted-foreground">إحصائيات وتحليلات مفصلة لأداء المحتوى</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">آخر 7 أيام</SelectItem>
              <SelectItem value="30days">آخر 30 يوم</SelectItem>
              <SelectItem value="90days">آخر 3 أشهر</SelectItem>
              <SelectItem value="1year">آخر سنة</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold">15,240</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">زوار فريدون</p>
                <p className="text-2xl font-bold">8,940</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+8.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">متوسط الوقت</p>
                <p className="text-2xl font-bold">3:24</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span className="text-red-500">-2.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MousePointer className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">معدل التفاعل</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+5.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="content">أداء المحتوى</TabsTrigger>
          <TabsTrigger value="audience">الجمهور</TabsTrigger>
          <TabsTrigger value="engagement">التفاعل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Views Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>اتجاه المشاهدات والتفاعل</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performing Pages */}
          <Card>
            <CardHeader>
              <CardTitle>الصفحات الأكثر أداءً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{page.page}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>المشاهدات: {page.views.toLocaleString()}</span>
                          <span>متوسط الوقت: {page.avgTime}</span>
                          <span>معدل الارتداد: {page.bounceRate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {page.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أداء المحتوى حسب النوع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentPerformance.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(content.status)}`} />
                        <div>
                          <p className="font-medium">{content.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {content.count} عنصر • تفاعل {content.avgEngagement}%
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant="outline">
                        {getStatusText(content.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المشاهدات حسب القسم</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          {/* Device Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الأجهزة المستخدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الجمهور</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>الزوار الجدد</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div className="w-16 h-2 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-sm">78%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>الزوار المتكررون</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div className="w-6 h-2 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-sm">22%</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">4.2</p>
                      <p className="text-sm text-muted-foreground">صفحات/جلسة</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">68%</p>
                      <p className="text-sm text-muted-foreground">زوار جدد</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>التفاعل الاجتماعي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span>مشاركات</span>
                    </div>
                    <span className="font-bold">1,240</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span>تفاعلات</span>
                    </div>
                    <span className="font-bold">3,580</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-600" />
                      <span>تحميلات</span>
                    </div>
                    <span className="font-bold">890</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>وقت القراءة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">3:24</p>
                    <p className="text-sm text-muted-foreground">متوسط وقت القراءة</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>أقل من دقيقة</span>
                      <span>15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>1-3 دقائق</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>أكثر من 3 دقائق</span>
                      <span>40%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>نقاط تحسين المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>تحديث صور قديمة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>تحسين SEO للنصوص</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span>إضافة وصف للصور</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>تحديث المحتوى القديم</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};