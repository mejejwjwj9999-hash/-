import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DigitalLibraryResource } from '@/hooks/useDigitalLibrary';
import { 
  Eye, 
  Download, 
  ExternalLink, 
  FileText, 
  Image, 
  Video, 
  Volume2,
  Calendar,
  User,
  Tag,
  BookOpen,
  Star,
  Globe,
  Clock,
  Hash,
  Building
} from 'lucide-react';
import { useIncrementCounter } from '@/hooks/useDigitalLibrary';
import { toast } from 'sonner';

interface ResourcePreviewProps {
  resource: DigitalLibraryResource;
  isOpen: boolean;
  onClose: () => void;
}

export const ResourcePreview: React.FC<ResourcePreviewProps> = ({ 
  resource, 
  isOpen, 
  onClose 
}) => {
  const [imageError, setImageError] = useState(false);
  const incrementCounter = useIncrementCounter();

  const handleDownload = () => {
    if (resource.file_url) {
      incrementCounter.mutate({ 
        resourceId: resource.id, 
        counterType: 'downloads' 
      });
      window.open(resource.file_url, '_blank');
      toast.success('بدء التحميل...');
    }
  };

  const handleView = () => {
    incrementCounter.mutate({ 
      resourceId: resource.id, 
      counterType: 'views' 
    });
    
    if (resource.file_url) {
      if (resource.file_type === 'external' || resource.file_url.startsWith('http')) {
        window.open(resource.file_url, '_blank');
      } else {
        // For internal files, we can implement PDF viewer or other previews
        window.open(resource.file_url, '_blank');
      }
    }
  };

  const getResourceIcon = () => {
    switch (resource.resource_type) {
      case 'book': return BookOpen;
      case 'journal': return FileText;
      case 'thesis': return FileText;
      case 'database': return Globe;
      case 'article': return FileText;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const getFileTypeIcon = () => {
    if (!resource.file_type) return FileText;
    
    if (resource.file_type.startsWith('image/')) return Image;
    if (resource.file_type.startsWith('video/')) return Video;
    if (resource.file_type.startsWith('audio/')) return Volume2;
    if (resource.file_type === 'external') return ExternalLink;
    return FileText;
  };

  const formatFileSize = (size?: number) => {
    if (!size) return 'غير محدد';
    const mb = size / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${(size / 1024).toFixed(2)} KB`;
  };

  const getCategoryName = (category: string) => {
    const categories = {
      pharmacy: 'الصيدلة',
      nursing: 'التمريض',
      it: 'تكنولوجيا المعلومات',
      business: 'إدارة الأعمال',
      midwifery: 'القبالة',
      general: 'عام'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getResourceTypeName = (type: string) => {
    const types = {
      book: 'كتاب',
      journal: 'مجلة علمية',
      thesis: 'رسالة جامعية',
      database: 'قاعدة بيانات',
      article: 'مقال',
      document: 'وثيقة'
    };
    return types[type as keyof typeof types] || type;
  };

  const getLanguageName = (lang: string) => {
    const languages = {
      ar: 'العربية',
      en: 'الإنجليزية',
      both: 'ثنائي اللغة'
    };
    return languages[lang as keyof typeof languages] || lang;
  };

  const getAccessLevelName = (level: string) => {
    const levels = {
      public: 'عام',
      students: 'طلاب',
      faculty: 'أعضاء هيئة التدريس',
      admin: 'إداريين'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const ResourceIcon = getResourceIcon();
  const FileIcon = getFileTypeIcon();
  const metadata = resource.metadata as any || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            <ResourceIcon className="w-6 h-6 text-primary" />
            <span className="text-xl">معاينة المصدر</span>
            {resource.is_featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex gap-6">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                {resource.thumbnail_url && !imageError ? (
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.title_ar}
                    className="w-40 h-56 object-cover rounded-lg shadow-md"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-40 h-56 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                    <ResourceIcon className="w-16 h-16 text-primary/60" />
                  </div>
                )}
              </div>

              {/* Title and Basic Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {resource.title_ar}
                  </h1>
                  {resource.title_en && (
                    <h2 className="text-lg text-gray-600 mb-3">
                      {resource.title_en}
                    </h2>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="default">
                      {getResourceTypeName(resource.resource_type)}
                    </Badge>
                    <Badge variant="secondary">
                      {getCategoryName(resource.category)}
                    </Badge>
                    <Badge 
                      variant={resource.status === 'published' ? 'default' : 
                               resource.status === 'draft' ? 'secondary' : 'destructive'}
                    >
                      {resource.status === 'published' ? 'منشور' : 
                       resource.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                    </Badge>
                    <Badge variant="outline">
                      {getLanguageName(resource.language)}
                    </Badge>
                  </div>
                </div>

                {/* Author and Stats */}
                <div className="space-y-2">
                  {(resource.author_ar || resource.author_en) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4" />
                      <span>
                        {resource.author_ar}
                        {resource.author_ar && resource.author_en && ' / '}
                        {resource.author_en}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{resource.views_count || 0} مشاهدة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads_count || 0} تحميل</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {resource.file_url && (
                    <>
                      <Button onClick={handleView} className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {resource.file_type?.includes('video') ? 'مشاهدة' : 'عرض'}
                      </Button>
                      <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        تحميل
                      </Button>
                    </>
                  )}
                  {metadata?.external_url && (
                    <Button variant="outline" asChild>
                      <a href={metadata.external_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 ml-2" />
                        رابط خارجي
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {(resource.description_ar || resource.description_en) && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">الوصف</h3>
                {resource.description_ar && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">الوصف بالعربية:</h4>
                    <p className="text-gray-600 leading-relaxed">{resource.description_ar}</p>
                  </div>
                )}
                {resource.description_en && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">الوصف بالإنجليزية:</h4>
                    <p className="text-gray-600 leading-relaxed">{resource.description_en}</p>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">تفاصيل المصدر</h3>
                
                <div className="space-y-3">
                  {resource.subject_area && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">المجال الموضوعي:</span>
                      <span className="font-medium">{resource.subject_area}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">مستوى الوصول:</span>
                    <span className="font-medium">{getAccessLevelName(resource.access_level)}</span>
                  </div>

                  {resource.publication_year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">سنة النشر:</span>
                      <span className="font-medium">{resource.publication_year}</span>
                    </div>
                  )}

                  {metadata?.page_count && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">عدد الصفحات:</span>
                      <span className="font-medium">{metadata.page_count}</span>
                    </div>
                  )}

                  {metadata?.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">المدة:</span>
                      <span className="font-medium">{metadata.duration}</span>
                    </div>
                  )}

                  {metadata?.publisher && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">الناشر:</span>
                      <span className="font-medium">{metadata.publisher}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">معلومات الملف</h3>
                
                <div className="space-y-3">
                  {resource.file_url && (
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">نوع الملف:</span>
                      <span className="font-medium">
                        {resource.file_type === 'external' ? 'رابط خارجي' : resource.file_type || 'غير محدد'}
                      </span>
                    </div>
                  )}

                  {resource.file_size && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">حجم الملف:</span>
                      <span className="font-medium">{formatFileSize(resource.file_size)}</span>
                    </div>
                  )}

                  {resource.isbn && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">ISBN:</span>
                      <span className="font-medium font-mono">{resource.isbn}</span>
                    </div>
                  )}

                  {resource.doi && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">DOI:</span>
                      <span className="font-medium font-mono">{resource.doi}</span>
                    </div>
                  )}

                  {resource.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">تاريخ الإضافة:</span>
                      <span className="font-medium">
                        {new Date(resource.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">الكلمات المفتاحية</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};