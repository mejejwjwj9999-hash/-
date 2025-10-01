import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Eye, 
  Share, 
  BookmarkPlus,
  FileText,
  Info,
  MessageSquare,
  ExternalLink,
  Maximize
} from 'lucide-react';
import { DigitalLibraryResource } from '@/hooks/useDigitalLibrary';
import { PDFViewer } from './PDFViewer';
import { RatingSystem } from './RatingSystem';
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
  const [activeTab, setActiveTab] = useState('preview');
  const [isPDFFullscreen, setIsPDFFullscreen] = useState(false);

  const handleDownload = () => {
    if (resource.file_url) {
      window.open(resource.file_url, '_blank');
      toast.success('بدء التحميل...');
    } else {
      toast.error('رابط الملف غير متوفر');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title_ar,
          text: resource.description_ar,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ الرابط');
    }
  };

  const handleBookmark = () => {
    // This would integrate with a bookmarking system
    toast.success('تم إضافة المصدر للمفضلة');
  };

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

  const isPDFFile = resource.file_type?.toLowerCase().includes('pdf') || 
                    resource.file_url?.toLowerCase().includes('.pdf');

  return (
    <>
      <Dialog open={isOpen && !isPDFFullscreen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold line-clamp-2 mb-2">
                  {resource.title_ar}
                </DialogTitle>
                {resource.title_en && (
                  <p className="text-muted-foreground">{resource.title_en}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="outline">
                    {getCategoryLabel(resource.category)}
                  </Badge>
                  <Badge variant="outline">
                    {getResourceTypeLabel(resource.resource_type)}
                  </Badge>
                  {resource.language && (
                    <Badge variant="outline">
                      {resource.language === 'ar' ? 'عربي' : 
                       resource.language === 'en' ? 'إنجليزي' : 'متعدد اللغات'}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleBookmark}>
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  معاينة
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  التفاصيل
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  التقييمات
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto p-6">
                <TabsContent value="preview" className="h-full m-0">
                  {isPDFFile && resource.file_url ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">معاينة المستند</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPDFFullscreen(true)}
                        >
                          <Maximize className="h-4 w-4 ml-2" />
                          عرض كامل
                        </Button>
                      </div>
                      <div className="flex-1">
                        <PDFViewer 
                          fileUrl={resource.file_url} 
                          fileName={resource.title_ar}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold mb-2">معاينة غير متوفرة</h3>
                        <p className="text-muted-foreground mb-4">
                          {resource.file_url ? 
                            'نوع الملف لا يدعم المعاينة المباشرة' : 
                            'رابط الملف غير متوفر'
                          }
                        </p>
                        {resource.file_url && (
                          <div className="flex gap-2 justify-center">
                            <Button onClick={handleDownload}>
                              <Download className="h-4 w-4 ml-2" />
                              تحميل الملف
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => window.open(resource.file_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 ml-2" />
                              فتح في نافذة جديدة
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">معلومات المصدر</h3>
                      
                      {resource.author_ar && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">المؤلف</label>
                          <p className="mt-1">{resource.author_ar}</p>
                          {resource.author_en && (
                            <p className="text-sm text-muted-foreground">{resource.author_en}</p>
                          )}
                        </div>
                      )}

                      {resource.publication_year && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">سنة النشر</label>
                          <p className="mt-1">{resource.publication_year}</p>
                        </div>
                      )}

                      {resource.isbn && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">ISBN</label>
                          <p className="mt-1 font-mono text-sm">{resource.isbn}</p>
                        </div>
                      )}

                      {resource.doi && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">DOI</label>
                          <p className="mt-1 font-mono text-sm">{resource.doi}</p>
                        </div>
                      )}

                      {resource.subject_area && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">المجال الموضوعي</label>
                          <p className="mt-1">{resource.subject_area}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">معلومات تقنية</h3>
                      
                      {resource.file_size && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">حجم الملف</label>
                          <p className="mt-1">{(resource.file_size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      )}

                      {resource.file_type && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">نوع الملف</label>
                          <p className="mt-1">{resource.file_type}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">الإحصائيات</label>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm">{resource.views_count || 0} مشاهدة</p>
                          <p className="text-sm">{resource.downloads_count || 0} تحميل</p>
                        </div>
                      </div>

                      {resource.tags && resource.tags.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">العلامات</label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {resource.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {resource.description_ar && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">الوصف</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {resource.description_ar}
                      </p>
                      {resource.description_en && (
                        <p className="text-muted-foreground leading-relaxed mt-2 text-sm">
                          {resource.description_en}
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews">
                  <RatingSystem
                    resourceId={resource.id}
                    ratings={[]} // This would come from an API call
                    averageRating={0}
                    totalRatings={0}
                    canRate={true}
                    onRatingSubmit={(rating, comment) => {
                      // Handle rating submission
                      console.log('Rating submitted:', rating, comment);
                    }}
                    onHelpfulClick={(ratingId) => {
                      // Handle helpful click
                      console.log('Helpful clicked:', ratingId);
                    }}
                    onFlagClick={(ratingId) => {
                      // Handle flag click
                      console.log('Flag clicked:', ratingId);
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen PDF Viewer */}
      {isPDFFile && resource.file_url && (
        <PDFViewer
          fileUrl={resource.file_url}
          fileName={resource.title_ar}
          isFullscreen={isPDFFullscreen}
          onClose={() => setIsPDFFullscreen(false)}
        />
      )}
    </>
  );
};