import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable-panels';
import { SmartElementSearch } from './SmartElementSearch';
import { NavigationTree } from './NavigationTree';
import { UnifiedEditorPanel } from './UnifiedEditorPanel';
import { QuickActionsPanel } from './QuickActionsPanel';
import { useContentPages, useContentElements } from '@/hooks/useContentEditor';
import { useAdvancedContentSearch, useContentStatistics } from '@/hooks/useAdvancedContentSearch';
import { 
  Search,
  FileText,
  Settings,
  BarChart3,
  Users,
  Zap,
  Layout,
  Monitor,
  Sidebar,
  Grid,
  List,
  RefreshCw,
  Filter,
  Plus,
  HelpCircle
} from 'lucide-react';

export const AdvancedContentDashboard: React.FC = () => {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [selectedElements, setSelectedElements] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('workspace');

  const { data: pages, isLoading: pagesLoading } = useContentPages();
  const { data: elements, isLoading: elementsLoading } = useContentElements(selectedPageId || undefined);
  const { data: statistics } = useContentStatistics();

  // تحديد الصفحة الأولى تلقائياً
  useEffect(() => {
    if (pages && pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedElement(null);
    setSelectedElements([]);
  };

  const handleElementSelect = (element: any) => {
    setSelectedElement(element);
    if (!selectedElements.some(e => e.id === element.id)) {
      setSelectedElements([element]);
    }
  };

  const handleElementUpdate = (updatedElement: any) => {
    // تحديث العنصر في القائمة
    if (selectedElement && selectedElement.id === updatedElement.id) {
      setSelectedElement(updatedElement);
    }
  };

  const dashboardStats = [
    {
      title: 'إجمالي الصفحات',
      value: statistics?.totalPages || 0,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'إجمالي العناصر',
      value: statistics?.totalElements || 0,
      icon: Grid,
      color: 'text-green-600'
    },
    {
      title: 'العناصر المنشورة',
      value: statistics?.statusCounts.published || 0,
      icon: Monitor,
      color: 'text-purple-600'
    },
    {
      title: 'المسودات',
      value: statistics?.statusCounts.draft || 0,
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* شريط العنوان */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">المحرر المتقدم</h1>
          <Badge variant="secondary" className="text-xs">
            نسخة متطورة
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Sidebar className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>

          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            إضافة عنصر
          </Button>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-4 gap-4">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-4 mt-2 grid w-fit grid-cols-5">
            <TabsTrigger value="workspace" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              مساحة العمل
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              البحث المتقدم
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              الإجراءات السريعة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="flex-1 mt-2 mx-4 mb-4">
            <div className="h-full flex gap-4">
              {/* الشريط الجانبي */}
              {showSidebar && (
                <div className="w-1/4 min-w-0">
                  <NavigationTree
                    onPageSelect={handlePageSelect}
                    onElementSelect={handleElementSelect}
                    selectedPageId={selectedPageId || undefined}
                    selectedElementId={selectedElement?.id}
                  />
                </div>
              )}

              {/* المحرر الرئيسي */}
              <div className={showSidebar ? "w-3/4" : "w-full"}>
                <UnifiedEditorPanel 
                  element={selectedElement}
                  onSave={handleElementUpdate}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="flex-1 mt-2 mx-4 mb-4">
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <SmartElementSearch
                  onElementSelect={handleElementSelect}
                  selectedPageId={selectedPageId || undefined}
                />
              </div>
              <div>
                <Card className="p-4 h-fit">
                  <h3 className="font-semibold mb-3">نصائح البحث</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• استخدم الكلمات المفتاحية للبحث في المحتوى</p>
                    <p>• اختر نوع العنصر للتصفية</p>
                    <p>• استخدم فلتر التاريخ للعناصر الحديثة</p>
                    <p>• احفظ عمليات البحث المفضلة</p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="flex-1 mt-2 mx-4 mb-4">
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <QuickActionsPanel
                  selectedElements={selectedElements}
                  onSelectionChange={setSelectedElements}
                  onElementUpdate={handleElementUpdate}
                  allElements={elements || []}
                />
              </div>
              <div>
                <Card className="p-4 h-fit">
                  <h3 className="font-semibold mb-3">الإجراءات المتاحة</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• نشر/إخفاء العناصر بشكل مجمع</p>
                    <p>• نسخ العناصر بين الصفحات</p>
                    <p>• إنشاء قوالب من العناصر</p>
                    <p>• تصدير البيانات</p>
                    <p>• حذف متعدد</p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 mt-2 mx-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {/* إحصائيات الحالة */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">إحصائيات الحالة</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">منشور</span>
                    <Badge className="bg-green-100 text-green-800">
                      {statistics?.statusCounts.published || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">مسودة</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {statistics?.statusCounts.draft || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">مؤرشف</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {statistics?.statusCounts.archived || 0}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* إحصائيات الأنواع */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">أنواع العناصر</h3>
                <div className="space-y-3">
                  {Object.entries(statistics?.typeCounts || {}).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm">
                        {type === 'text' ? 'نص بسيط' :
                         type === 'rich_text' ? 'نص منسق' :
                         type === 'image' ? 'صورة' :
                         type === 'link' ? 'رابط' :
                         type === 'button' ? 'زر' : type}
                      </span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* إحصائيات الصفحات */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">توزيع العناصر</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {statistics?.pageElementCounts.map(page => (
                    <div key={page.page_id} className="flex justify-between items-center">
                      <span className="text-sm truncate">{page.page_name}</span>
                      <Badge variant="outline">{page.element_count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 mt-2 mx-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">إعدادات المحرر</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الحفظ التلقائي</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">المعاينة المباشرة</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">التدقيق الإملائي</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">إعدادات العرض</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الوضع المظلم</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الشريط الجانبي</span>
                    <input type="checkbox" className="rounded" checked={showSidebar} onChange={() => setShowSidebar(!showSidebar)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الإحصائيات العلوية</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};