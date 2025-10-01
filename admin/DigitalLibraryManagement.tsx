import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Book, 
  Library,
  Star,
  User,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useDigitalLibraryResources, useDeleteResource, useToggleResourceStatus } from '@/hooks/useDigitalLibrary';
import type { DigitalLibraryResource, ResourceFilters } from '@/hooks/useDigitalLibrary';
import { ResourceForm } from './digital-library/ResourceForm';
import { ResourcePreview } from './digital-library/ResourcePreview';
import { MobileOptimizedCard } from '@/components/digital-library/MobileOptimizedCard';

const DigitalLibraryManagement: React.FC = () => {
  const [filters, setFilters] = useState<ResourceFilters>({});
  const [selectedResource, setSelectedResource] = useState<DigitalLibraryResource | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { data: resources = [], isLoading } = useDigitalLibraryResources(filters);
  const deleteResource = useDeleteResource();
  const toggleStatus = useToggleResourceStatus();

  const handleFilterChange = (key: keyof ResourceFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value || undefined }));
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المصدر؟')) {
      deleteResource.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    toggleStatus.mutate({ id, status: newStatus as 'draft' | 'published' | 'archived' });
  };

  const handlePreview = (resource: DigitalLibraryResource) => {
    setSelectedResource(resource);
    setIsPreviewModalOpen(true);
  };

  const handleEdit = (resource: DigitalLibraryResource) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const ResourceCard = ({ resource }: { resource: DigitalLibraryResource }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{resource.title_ar}</CardTitle>
            {resource.title_en && (
              <CardDescription className="mt-1 text-sm">{resource.title_en}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3">
            {resource.is_featured && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
            <Badge variant={
              resource.status === 'published' ? 'default' : 
              resource.status === 'draft' ? 'secondary' : 'destructive'
            }>
              {resource.status === 'published' ? 'منشور' : 
               resource.status === 'draft' ? 'مسودة' : 'مؤرشف'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            <span>{resource.resource_type === 'book' ? 'كتاب' : 
                   resource.resource_type === 'journal' ? 'مجلة' :
                   resource.resource_type === 'thesis' ? 'رسالة' :
                   resource.resource_type === 'database' ? 'قاعدة بيانات' :
                   resource.resource_type === 'article' ? 'مقال' : 'وثيقة'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>{resource.category === 'pharmacy' ? 'صيدلة' :
                   resource.category === 'nursing' ? 'تمريض' :
                   resource.category === 'it' ? 'تكنولوجيا المعلومات' :
                   resource.category === 'business' ? 'إدارة أعمال' :
                   resource.category === 'midwifery' ? 'قبالة' : 'عام'}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{resource.author_ar || resource.author_en || 'غير محدد'}</span>
          </div>
        </div>

        {resource.description_ar && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {resource.description_ar}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>{resource.views_count || 0} مشاهدة</span>
            <Download className="h-3 w-3 ml-2" />
            <span>{resource.downloads_count || 0} تحميل</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePreview(resource)}
              title="معاينة"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(resource)}
              title="تعديل"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleToggleStatus(resource.id, resource.status)}
              title={resource.status === 'published' ? 'إخفاء' : 'نشر'}
            >
              {resource.status === 'published' ? 
                <ToggleRight className="h-3 w-3 text-green-600" /> : 
                <ToggleLeft className="h-3 w-3 text-gray-400" />
              }
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(resource.id)}
              title="حذف"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">جاري تحميل المكتبة الرقمية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة المكتبة الرقمية</h1>
          <p className="text-muted-foreground">إدارة مصادر المكتبة الرقمية والمحتوى الأكاديمي</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مصدر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة مصدر جديد</DialogTitle>
            <DialogDescription>
              أضف مصدر جديد إلى المكتبة الرقمية
            </DialogDescription>
          </DialogHeader>
          <ResourceForm 
            onSuccess={() => setIsAddModalOpen(false)} 
            onCancel={() => setIsAddModalOpen(false)} 
          />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>الفلاتر والبحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في العناوين والمؤلفين..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select value={filters.category || ''} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع التصنيفات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  <SelectItem value="pharmacy">صيدلة</SelectItem>
                  <SelectItem value="nursing">تمريض</SelectItem>
                  <SelectItem value="it">تكنولوجيا المعلومات</SelectItem>
                  <SelectItem value="business">إدارة أعمال</SelectItem>
                  <SelectItem value="midwifery">قبالة</SelectItem>
                  <SelectItem value="general">عام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نوع المصدر</Label>
              <Select value={filters.resource_type || ''} onValueChange={(value) => handleFilterChange('resource_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="book">كتاب</SelectItem>
                  <SelectItem value="journal">مجلة</SelectItem>
                  <SelectItem value="thesis">رسالة</SelectItem>
                  <SelectItem value="database">قاعدة بيانات</SelectItem>
                  <SelectItem value="article">مقال</SelectItem>
                  <SelectItem value="document">وثيقة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="md:hidden">
            <MobileOptimizedCard 
              resource={resource}
              onView={() => handlePreview(resource)}
              onDownload={() => window.open(resource.file_url, '_blank')}
            />
          </div>
        ))}
        {resources.map((resource) => (
          <div key={resource.id} className="hidden md:block">
            <ResourceCard resource={resource} />
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-12">
          <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد مصادر</h3>
          <p className="text-muted-foreground mb-4">
            {Object.keys(filters).some(key => filters[key as keyof ResourceFilters]) 
              ? 'لم يتم العثور على مصادر تطابق الفلاتر المحددة'
              : 'لم يتم إضافة أي مصادر بعد'
            }
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة أول مصدر
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل المصدر</DialogTitle>
            <DialogDescription>
              تعديل معلومات المصدر في المكتبة الرقمية
            </DialogDescription>
          </DialogHeader>
          <ResourceForm 
            resource={selectedResource} 
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedResource(null);
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedResource(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {selectedResource && (
        <ResourcePreview
          resource={selectedResource}
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedResource(null);
          }}
        />
      )}
    </div>
  );
};

export default DigitalLibraryManagement;