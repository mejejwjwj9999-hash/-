import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminNewsEvents, useDeleteNewsEvent } from '@/hooks/useAdminNewsEvents';
import { NewsEventModal } from './modals/NewsEventModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const NewsEventsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data: newsEvents = [], isLoading } = useAdminNewsEvents();
  const deleteNewsEvent = useDeleteNewsEvent();

  const filteredItems = newsEvents.filter(item => {
    const matchesSearch = item.title_ar?.includes(searchTerm) || 
                         item.summary_ar?.includes(searchTerm) ||
                         item.title_en?.includes(searchTerm);
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteNewsEvent.mutateAsync(id);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: 'default',
      draft: 'secondary',
      archived: 'destructive'
    };
    
    const labels: Record<string, string> = {
      published: 'منشور',
      draft: 'مسودة',
      archived: 'مؤرشف'
    };
    
    return <Badge variant={variants[status] || 'outline'}>{labels[status] || status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      news: 'خبر',
      event: 'فعالية'
    };
    
    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-academic-gray">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-university-blue">إدارة الأخبار والفعاليات</h2>
          <p className="text-academic-gray">إدارة محتوى المركز الإعلامي</p>
        </div>
        <Button onClick={handleAddNew} className="bg-university-blue hover:bg-university-blue-light">
          <Plus className="w-4 h-4 ml-2" />
          إضافة محتوى جديد
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray w-4 h-4" />
              <Input
                placeholder="البحث في المحتوى..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع المحتوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="news">أخبار</SelectItem>
                <SelectItem value="event">فعاليات</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="حالة النشر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="archived">مؤرشف</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-academic-gray flex items-center">
              <Filter className="w-4 h-4 ml-1" />
              {filteredItems.length} من {newsEvents.length} عنصر
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  {getTypeBadge(item.type)}
                  {getStatusBadge(item.status)}
                </div>
                <div className="flex gap-1">
                  {item.is_featured && (
                    <Badge className="bg-university-gold text-white text-xs">مميز</Badge>
                  )}
                  {item.is_breaking && (
                    <Badge className="bg-red-500 text-white text-xs">عاجل</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Image */}
              {item.featured_image ? (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img 
                    src={item.featured_image} 
                    alt={item.title_ar}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* Content */}
              <div>
                <h3 className="font-semibold text-university-blue line-clamp-2 text-right">
                  {item.title_ar}
                </h3>
                {item.summary_ar && (
                  <p className="text-sm text-academic-gray mt-2 line-clamp-3 text-right">
                    {item.summary_ar}
                  </p>
                )}
              </div>

              {/* Meta Info */}
              <div className="text-xs text-academic-gray space-y-1">
                <div className="flex items-center justify-between">
                  <span>{new Date(item.created_at).toLocaleDateString('ar-YE')}</span>
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 ml-1" />
                    {item.views_count || 0}
                  </div>
                </div>
                {item.event_date && item.type === 'event' && (
                  <div className="flex items-center text-university-blue">
                    <Calendar className="w-3 h-3 ml-1" />
                    موعد الفعالية: {new Date(item.event_date).toLocaleDateString('ar-YE')}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 ml-1" />
                  تعديل
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-3 h-3 ml-1" />
                      حذف
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف هذا المحتوى؟ لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-academic-gray">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">لا يوجد محتوى</h3>
            <p className="text-sm">لم يتم العثور على أي محتوى يطابق المعايير المحددة</p>
          </div>
        </div>
      )}

      {/* Modal */}
      <NewsEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />
    </div>
  );
};