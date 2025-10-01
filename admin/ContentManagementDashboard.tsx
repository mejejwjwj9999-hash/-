import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContentPages, useContentElements } from '@/hooks/useContentEditor';
import { 
  Edit3, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User,
  FileText,
  Image,
  Link,
  MousePointer
} from 'lucide-react';

const ContentManagementDashboard = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const { data: pages, isLoading: pagesLoading } = useContentPages();
  const { data: elements, isLoading: elementsLoading } = useContentElements(selectedPage || undefined);

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'rich_text':
        return <Edit3 className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'link':
        return <Link className="w-4 h-4" />;
      case 'button':
        return <MousePointer className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredElements = elements?.filter(element => {
    const matchesSearch = searchTerm === '' || 
      element.element_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.content_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.content_en?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || element.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المحتوى</h1>
          <p className="text-muted-foreground">إدارة وتحرير محتوى جميع الصفحات</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          إضافة عنصر جديد
        </Button>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages">الصفحات</TabsTrigger>
          <TabsTrigger value="elements">العناصر</TabsTrigger>
          <TabsTrigger value="media">الوسائط</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          {/* Pages Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {pagesLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">جاري تحميل الصفحات...</p>
              </div>
            ) : (
              pages?.map((page) => (
                <Card key={page.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedPage(page.id)}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{page.page_name_ar}</h3>
                    <Badge variant={page.is_active ? 'default' : 'secondary'}>
                      {page.is_active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {page.description_ar || 'لا يوجد وصف'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>مفتاح الصفحة: {page.page_key}</span>
                    <span>ترتيب: {page.display_order}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="elements" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في العناصر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-3 py-2 border border-border rounded-md bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">جميع الحالات</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>

          {/* Selected Page Info */}
          {selectedPage && (
            <Card className="p-4 bg-primary/5">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="w-4 h-4" />
                <span className="font-medium">
                  الصفحة المحددة: {pages?.find(p => p.id === selectedPage)?.page_name_ar}
                </span>
              </div>
            </Card>
          )}

          {/* Elements List */}
          <div className="space-y-4">
            {!selectedPage ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>اختر صفحة من تبويب "الصفحات" لعرض عناصرها</p>
                </div>
              </Card>
            ) : elementsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">جاري تحميل العناصر...</p>
              </div>
            ) : filteredElements?.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد عناصر تطابق البحث</p>
                </div>
              </Card>
            ) : (
              filteredElements?.map((element) => (
                <Card key={element.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                        {getElementIcon(element.element_type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{element.element_key}</h4>
                          <Badge className={getStatusColor(element.status)}>
                            {element.status === 'published' ? 'منشور' : 
                             element.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          النوع: {element.element_type === 'text' ? 'نص بسيط' :
                                  element.element_type === 'rich_text' ? 'نص منسق' :
                                  element.element_type === 'image' ? 'صورة' :
                                  element.element_type === 'link' ? 'رابط' :
                                  element.element_type === 'button' ? 'زر' : element.element_type}
                        </p>
                        {element.content_ar && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {element.content_ar.length > 100 
                              ? element.content_ar.substring(0, 100) + '...' 
                              : element.content_ar}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            آخر تحديث: {new Date(element.updated_at).toLocaleDateString('ar')}
                          </span>
                          {element.published_at && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              نُشر: {new Date(element.published_at).toLocaleDateString('ar')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        تحرير
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="media">
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>إدارة الوسائط قيد التطوير</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagementDashboard;