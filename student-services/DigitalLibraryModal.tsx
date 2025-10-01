
import React, { useState } from 'react';
import { Book, Search, Download, Eye, Filter, X, BookOpen, FileText, Video, Headphones } from 'lucide-react';
import { useDigitalLibraryResources, useIncrementCounter } from '@/hooks/useDigitalLibrary';
import { useIsMobile } from '@/hooks/use-mobile';
import { PDFViewer } from '@/components/digital-library/PDFViewer';
import type { DigitalLibraryResource } from '@/hooks/useDigitalLibrary';

interface DigitalLibraryModalProps {
  onClose: () => void;
}

const DigitalLibraryModal = ({ onClose }: DigitalLibraryModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [selectedResource, setSelectedResource] = useState<DigitalLibraryResource | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfViewerFile, setPdfViewerFile] = useState<{ url: string; name: string } | null>(null);
  const isMobile = useIsMobile();

  // جلب المصادر من قاعدة البيانات
  const { data: resources = [], isLoading } = useDigitalLibraryResources({
    status: 'published',
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
    resource_type: selectedResourceType || undefined,
  });

  const incrementCounter = useIncrementCounter();

  const categories = [
    { id: '', name: 'جميع التصنيفات', icon: BookOpen },
    { id: 'pharmacy', name: 'الصيدلة', icon: Book },
    { id: 'nursing', name: 'التمريض', icon: FileText },
    { id: 'it', name: 'تكنولوجيا المعلومات', icon: Video },
    { id: 'business', name: 'إدارة الأعمال', icon: FileText },
    { id: 'midwifery', name: 'القبالة', icon: Book },
    { id: 'general', name: 'عام', icon: BookOpen }
  ];

  const resourceTypes = [
    { id: '', name: 'جميع الأنواع', icon: BookOpen },
    { id: 'book', name: 'الكتب', icon: Book },
    { id: 'journal', name: 'المجلات العلمية', icon: FileText },
    { id: 'thesis', name: 'الرسائل الجامعية', icon: FileText },
    { id: 'database', name: 'قواعد البيانات', icon: Video },
    { id: 'article', name: 'المقالات', icon: FileText },
    { id: 'document', name: 'الوثائق', icon: FileText }
  ];


  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return Book;
      case 'journal': return FileText;
      case 'thesis': return FileText;
      case 'database': return Video;
      case 'article': return FileText;
      case 'document': return FileText;
      default: return BookOpen;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'pharmacy': return 'الصيدلة';
      case 'nursing': return 'التمريض';
      case 'it': return 'تكنولوجيا المعلومات';
      case 'business': return 'إدارة الأعمال';
      case 'midwifery': return 'القبالة';
      case 'general': return 'عام';
      default: return category;
    }
  };

  const getResourceTypeName = (type: string) => {
    switch (type) {
      case 'book': return 'كتاب';
      case 'journal': return 'مجلة علمية';
      case 'thesis': return 'رسالة جامعية';
      case 'database': return 'قاعدة بيانات';
      case 'article': return 'مقال';
      case 'document': return 'وثيقة';
      default: return type;
    }
  };

  const handleViewResource = (resourceId: string, resource?: DigitalLibraryResource) => {
    console.log('handleViewResource called:', { resourceId, resource });
    incrementCounter.mutate({ resourceId, counterType: 'views' });
    
    // إذا كان المصدر له ملف PDF أو كان نوعه كتاب/مقال/وثيقة مع ملف متوفر
    if (resource && resource.file_url) {
      console.log('Resource has file_url:', resource.file_url);
      const fileExtension = resource.file_url.split('.').pop()?.toLowerCase();
      console.log('File extension:', fileExtension);
      const canViewInPDF = fileExtension === 'pdf' || 
                          ['book', 'article', 'document', 'thesis'].includes(resource.resource_type);
      console.log('Can view in PDF:', canViewInPDF);
      
      if (canViewInPDF) {
        console.log('Opening PDF viewer with:', {
          url: resource.file_url,
          name: resource.title_ar || resource.title_en || 'مستند'
        });
        setPdfViewerFile({
          url: resource.file_url,
          name: resource.title_ar || resource.title_en || 'مستند'
        });
        setShowPDFViewer(true);
        return;
      }
    }
    
    // إذا لم يكن PDF، افتح في نافذة جديدة
    if (resource?.file_url) {
      console.log('Opening file in new tab:', resource.file_url);
      window.open(resource.file_url, '_blank');
    } else {
      console.log('No file_url found for resource');
    }
  };

  const closePDFViewer = () => {
    setShowPDFViewer(false);
    setPdfViewerFile(null);
  };

  const handleDownloadResource = (resourceId: string, fileUrl?: string) => {
    if (fileUrl) {
      incrementCounter.mutate({ resourceId, counterType: 'downloads' });
      window.open(fileUrl, '_blank');
    }
  };

  if (selectedResource) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-university-blue">عرض المصدر</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedResource(null)}
                className="text-gray-500 hover:text-gray-700 text-sm sm:text-base"
              >
                العودة
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-full sm:w-32 h-32 sm:h-40 bg-university-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                {React.createElement(getResourceIcon(selectedResource.resource_type), { 
                  className: "w-12 h-12 sm:w-16 sm:h-16 text-white" 
                })}
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{selectedResource.title_ar}</h3>
                <p className="text-university-blue mb-4 text-sm sm:text-base">المؤلف: {selectedResource.author_ar || selectedResource.author_en || 'غير محدد'}</p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{selectedResource.description_ar || selectedResource.description_en || 'لا يوجد وصف متاح'}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="font-medium">النوع: </span>
                    {getResourceTypeName(selectedResource.resource_type)}
                  </div>
                  <div>
                    <span className="font-medium">التصنيف: </span>
                    {getCategoryName(selectedResource.category)}
                  </div>
                  <div>
                    <span className="font-medium">اللغة: </span>
                    {selectedResource.language === 'ar' ? 'العربية' :
                     selectedResource.language === 'en' ? 'الإنجليزية' : 'ثنائي اللغة'}
                  </div>
                  {selectedResource.publication_year && (
                    <div>
                      <span className="font-medium">سنة النشر: </span>
                      {selectedResource.publication_year}
                    </div>
                  )}
                  {selectedResource.metadata?.page_count && (
                    <div>
                      <span className="font-medium">عدد الصفحات: </span>
                      {selectedResource.metadata.page_count}
                    </div>
                  )}
                  {selectedResource.metadata?.duration && (
                    <div>
                      <span className="font-medium">المدة: </span>
                      {selectedResource.metadata.duration}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">المشاهدات: </span>
                    {selectedResource.views_count || 0}
                  </div>
                  <div>
                    <span className="font-medium">التحميلات: </span>
                    {selectedResource.downloads_count || 0}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button 
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => handleViewResource(selectedResource.id, selectedResource)}
              >
                <Eye className="w-4 h-4" />
                {selectedResource.resource_type === 'database' ? 'فتح' : 'قراءة'}
              </button>
              {selectedResource.file_url && (
                <button 
                  className="btn-ghost flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={() => handleDownloadResource(selectedResource.id, selectedResource.file_url)}
                >
                  <Download className="w-4 h-4" />
                  تحميل
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-university-blue flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            المكتبة الرقمية
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-3 sm:p-6">
          {/* شريط البحث والتصفية */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="البحث في المكتبة الرقمية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue text-sm sm:text-base"
              />
            </div>
            
            {/* فلاتر التصنيفات */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">التصنيفات:</h4>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-xs sm:text-sm ${
                      selectedCategory === category.id
                        ? 'bg-university-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* فلاتر أنواع المصادر */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">نوع المصدر:</h4>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {resourceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedResourceType(type.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-xs sm:text-sm ${
                      selectedResourceType === type.id
                        ? 'bg-university-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <type.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* قائمة المصادر */}
          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-university-blue"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">جاري تحميل المصادر...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">لا توجد مصادر متاحة</h3>
              <p className="text-gray-500 text-sm sm:text-base">لم يتم العثور على مصادر مطابقة للبحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {resources.map((resource) => {
                const ResourceIcon = getResourceIcon(resource.resource_type);
                return (
                  <div
                    key={resource.id}
                    className="card-elevated hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="p-3 sm:p-4">
                      {resource.thumbnail_url && (
                        <img 
                          src={resource.thumbnail_url} 
                          alt={resource.title_ar}
                          className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3 sm:mb-4"
                        />
                      )}
                      
                      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-university-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                          <ResourceIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-lg mb-1 line-clamp-2">{resource.title_ar}</h3>
                          <p className="text-university-blue text-xs sm:text-sm">{resource.author_ar || resource.author_en || 'غير محدد'}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                        {resource.description_ar || resource.description_en || 'لا يوجد وصف متاح'}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {getCategoryName(resource.category)}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {getResourceTypeName(resource.resource_type)}
                        </span>
                        {resource.publication_year && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {resource.publication_year}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span className="hidden sm:inline">{resource.views_count || 0} مشاهدة</span>
                          <span className="sm:hidden">{resource.views_count || 0}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span className="hidden sm:inline">{resource.downloads_count || 0} تحميل</span>
                          <span className="sm:hidden">{resource.downloads_count || 0}</span>
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          resource.file_url ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isMobile ? (resource.file_url ? '✓' : '✗') : (resource.file_url ? 'متوفر' : 'غير متوفر')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      {showPDFViewer && pdfViewerFile && (
        <PDFViewer
          fileUrl={pdfViewerFile.url}
          fileName={pdfViewerFile.name}
          isFullscreen={true}
          onClose={closePDFViewer}
        />
      )}
    </div>
  );
};

export default DigitalLibraryModal;
