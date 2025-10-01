import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star,
  Eye,
  Download,
  Book,
  User,
  Tag,
  Clock,
  FileText,
  MoreVertical,
  Share,
  BookmarkPlus
} from 'lucide-react';
import { DigitalLibraryResource } from '@/hooks/useDigitalLibrary';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileOptimizedCardProps {
  resource: DigitalLibraryResource;
  onView: (resource: DigitalLibraryResource) => void;
  onDownload: (resource: DigitalLibraryResource) => void;
  onShare?: (resource: DigitalLibraryResource) => void;
  onBookmark?: (resource: DigitalLibraryResource) => void;
  averageRating?: number;
  totalRatings?: number;
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  resource,
  onView,
  onDownload,
  onShare,
  onBookmark,
  averageRating = 0,
  totalRatings = 0
}) => {
  const getCategoryLabel = (category: string) => {
    const labels = {
      pharmacy: 'صيدلة',
      nursing: 'تمريض',
      it: 'تكنولوجيا المعلومات',
      business: 'إدارة أعمال',
      midwifery: 'قبالة',
      general: 'عام'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getResourceTypeLabel = (type: string) => {
    const labels = {
      book: 'كتاب',
      journal: 'مجلة',
      thesis: 'رسالة',
      database: 'قاعدة بيانات',
      article: 'مقال',
      document: 'وثيقة'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-gradient-to-br from-background via-background to-muted/20">
      <CardHeader className="pb-3 space-y-3">
        {/* Header with badges and actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <Badge variant={
              resource.status === 'published' ? 'default' : 
              resource.status === 'draft' ? 'secondary' : 'destructive'
            } className="text-xs">
              {resource.status === 'published' ? 'منشور' : 
               resource.status === 'draft' ? 'مسودة' : 'مؤرشف'}
            </Badge>
            
            {resource.is_featured && (
              <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600 bg-yellow-50 dark:bg-yellow-950">
                <Star className="h-3 w-3 ml-1" />
                مميز
              </Badge>
            )}
            
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(resource.category)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(resource)}>
                <Eye className="h-4 w-4 ml-2" />
                عرض
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(resource)}>
                <Download className="h-4 w-4 ml-2" />
                تحميل
              </DropdownMenuItem>
              {onShare && (
                <DropdownMenuItem onClick={() => onShare(resource)}>
                  <Share className="h-4 w-4 ml-2" />
                  مشاركة
                </DropdownMenuItem>
              )}
              {onBookmark && (
                <DropdownMenuItem onClick={() => onBookmark(resource)}>
                  <BookmarkPlus className="h-4 w-4 ml-2" />
                  إضافة للمفضلة
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1">
            {resource.title_ar}
          </h3>
          {resource.title_en && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {resource.title_en}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {resource.description_ar && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {resource.description_ar}
          </p>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{getResourceTypeLabel(resource.resource_type)}</span>
          </div>
          
          {resource.author_ar && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{resource.author_ar}</span>
            </div>
          )}
          
          {resource.publication_year && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
              <span>{resource.publication_year}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              {resource.language === 'ar' ? 'عربي' : 
               resource.language === 'en' ? 'إنجليزي' : 'متعدد اللغات'}
            </span>
          </div>
        </div>

        {/* Rating */}
        {totalRatings > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= averageRating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({totalRatings} تقييم)</span>
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{resource.views_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{resource.downloads_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(resource.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView(resource)}
              className="h-8 px-3 text-xs"
            >
              <FileText className="h-3 w-3 ml-1" />
              عرض
            </Button>
            <Button 
              size="sm"
              onClick={() => onDownload(resource)}
              className="h-8 px-3 text-xs"
            >
              <Download className="h-3 w-3 ml-1" />
              تحميل
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};