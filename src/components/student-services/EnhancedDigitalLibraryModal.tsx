import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Search, 
  Download, 
  Eye, 
  Filter, 
  X, 
  FileText, 
  Image, 
  Star,
  User,
  Calendar,
  Globe,
  Tag,
  Heart,
  ExternalLink
} from 'lucide-react';
import { useDigitalLibraryResources, useIncrementCounter } from '@/hooks/useDigitalLibrary';
import type { DigitalLibraryResource } from '@/hooks/useDigitalLibrary';
import { toast } from 'sonner';

interface EnhancedDigitalLibraryModalProps {
  onClose: () => void;
}

const EnhancedDigitalLibraryModal: React.FC<EnhancedDigitalLibraryModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedResource, setSelectedResource] = useState<DigitalLibraryResource | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filters = {
    search: searchTerm,
    category: selectedCategory || undefined,
    resource_type: selectedResourceType || undefined,
    language: selectedLanguage || undefined,
    status: 'published' as const,
  };

  const { data: resources = [], isLoading } = useDigitalLibraryResources(filters);
  const incrementCounter = useIncrementCounter();

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResources = resources.slice(startIndex, endIndex);
  const totalPages = Math.ceil(resources.length / itemsPerPage);

  const categories = [
    { id: '', name: 'جميع التخصصات' },
    { id: 'pharmacy', name: 'الصيدلة' },
    { id: 'nursing', name: 'التمريض' },
    { id: 'it', name: 'تكنولوجيا المعلومات' },
    { id: 'business', name: 'إدارة الأعمال' },
    { id: 'midwifery', name: 'القبالة' },
    { id: 'general', name: 'عام' }
  ];

  const resourceTypes = [
    { id: '', name: 'جميع الأنواع' },
    { id: 'book', name: 'كتب' },
    { id: 'journal', name: 'مجلات علمية' },
    { id: 'thesis', name: 'رسائل جامعية' },
    { id: 'database', name: 'قواعد بيانات' },
    { id: 'article', name: 'مقالات' },
    { id: 'document', name: 'وثائق' }
  ];

  const languages = [
    { id: '', name: 'جميع اللغات' },
    { id: 'ar', name: 'العربية' },
    { id: 'en', name: 'الإنجليزية' },
    { id: 'both', name: 'ثنائي اللغة' }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'journal': return FileText;
      case 'thesis': return FileText;
      case 'database': return Globe;
      case 'article': return FileText;
      case 'document': return FileText;
      default: return BookOpen;
    }
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.name || category;
  };

  const getResourceTypeName = (type: string) => {
    const rt = resourceTypes.find(t => t.id === type);
    return rt?.name || type;
  };

  const getLanguageName = (lang: string) => {
    const language = languages.find(l => l.id === lang);
    return language?.name || lang;
  };

  const handleView = (resource: DigitalLibraryResource) => {
    incrementCounter.mutate({ resourceId: resource.id, counterType: 'views' });
    setSelectedResource(resource);
  };

  const handleDownload = (resource: DigitalLibraryResource, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resource.file_url) {
      incrementCounter.mutate({ resourceId: resource.id, counterType: 'downloads' });
      window.open(resource.file_url, '_blank');
      toast.success('بدء التحميل...');
    } else {
      toast.error('الملف غير متوفر للتحميل');
    }
  };

  const toggleFavorite = (resourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(resourceId)) {
      newFavorites.delete(resourceId);
      toast.success('تم إزالة المصدر من المفضلة');
    } else {
      newFavorites.add(resourceId);
      toast.success('تم إضافة المصدر إلى المفضلة');
    }
    setFavorites(newFavorites);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedResourceType('');
    setSelectedLanguage('');
    setCurrentPage(1);
  };

  // Resource Detail View
  if (selectedResource) {
    return (
      <Dialog open={true} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3">
              {React.createElement(getResourceIcon(selectedResource.resource_type), { className: "w-6 h-6 text-primary" })}
              <span>عرض المصدر</span>
              {selectedResource.is_featured && (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              )}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  {selectedResource.thumbnail_url ? (
                    <img
                      src={selectedResource.thumbnail_url}
                      alt={selectedResource.title_ar}
                      className="w-40 h-56 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-40 h-56 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                      {React.createElement(getResourceIcon(selectedResource.resource_type), { className: "w-16 h-16 text-primary/60" })}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedResource.title_ar}
                    </h1>
                    {selectedResource.title_en && (
                      <h2 className="text-lg text-gray-600 mb-3">
                        {selectedResource.title_en}
                      </h2>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="default">
                        {getResourceTypeName(selectedResource.resource_type)}
                      </Badge>
                      <Badge variant="secondary">
                        {getCategoryName(selectedResource.category)}
                      </Badge>
                      <Badge variant="outline">
                        {getLanguageName(selectedResource.language)}
                      </Badge>
                    </div>
                  </div>

                  {(selectedResource.author_ar || selectedResource.author_en) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4" />
                      <span>
                        {selectedResource.author_ar}
                        {selectedResource.author_ar && selectedResource.author_en && ' / '}
                        {selectedResource.author_en}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedResource.views_count || 0} مشاهدة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{selectedResource.downloads_count || 0} تحميل</span>
                    </div>
                    {selectedResource.publication_year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedResource.publication_year}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    {selectedResource.file_url && (
                      <Button
                        onClick={() => {
                          window.open(selectedResource.file_url, '_blank');
                          incrementCounter.mutate({ resourceId: selectedResource.id, counterType: 'downloads' });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        تحميل
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={(e) => toggleFavorite(selectedResource.id, e)}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(selectedResource.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      {favorites.has(selectedResource.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedResource(null)}>
                      العودة
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              {(selectedResource.description_ar || selectedResource.description_en) && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">الوصف</h3>
                  {selectedResource.description_ar && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">الوصف بالعربية:</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedResource.description_ar}</p>
                    </div>
                  )}
                  {selectedResource.description_en && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">الوصف بالإنجليزية:</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedResource.description_en}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {selectedResource.tags && selectedResource.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">الكلمات المفتاحية</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          <Tag className="w-3 h-3 ml-1" />
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
  }

  // Main Library View
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>المكتبة الرقمية</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ابحث في العناوين، المؤلفين، الوصف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="نوع المصدر" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  مسح الفلاتر
                </Button>
              </div>

              {/* Results Info */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>تم العثور على {resources.length} مصدر</span>
                {(searchTerm || selectedCategory || selectedResourceType || selectedLanguage) && (
                  <span className="text-primary">البحث نشط</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600">جاري تحميل المصادر...</p>
                </div>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory || selectedResourceType || selectedLanguage
                    ? 'جرب تغيير معايير البحث أو الفلاتر'
                    : 'لا توجد مصادر متاحة حالياً'
                  }
                </p>
                {(searchTerm || selectedCategory || selectedResourceType || selectedLanguage) && (
                  <Button variant="outline" onClick={resetFilters}>
                    مسح الفلاتر
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedResources.map((resource) => {
                    const ResourceIcon = getResourceIcon(resource.resource_type);
                    const isFavorited = favorites.has(resource.id);
                    
                    return (
                      <Card
                        key={resource.id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                        onClick={() => handleView(resource)}
                      >
                        <CardContent className="p-4">
                          <div className="relative mb-4">
                            {resource.thumbnail_url ? (
                              <img
                                src={resource.thumbnail_url}
                                alt={resource.title_ar}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                                <ResourceIcon className="w-12 h-12 text-primary/60" />
                              </div>
                            )}
                            
                            {/* Favorite Button */}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => toggleFavorite(resource.id, e)}
                            >
                              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>

                            {/* Featured Badge */}
                            {resource.is_featured && (
                              <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 ml-1 fill-current" />
                                مميز
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                                {resource.title_ar}
                              </h3>
                              
                              {resource.author_ar && (
                                <p className="text-xs text-gray-600 mb-2">
                                  {resource.author_ar}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {getResourceTypeName(resource.resource_type)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryName(resource.category)}
                              </Badge>
                            </div>

                            {resource.description_ar && (
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {resource.description_ar}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {resource.views_count || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {resource.downloads_count || 0}
                                </span>
                              </div>
                              
                              {resource.publication_year && (
                                <span>{resource.publication_year}</span>
                              )}
                            </div>

                            {resource.file_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => handleDownload(resource, e)}
                              >
                                <Download className="w-4 h-4 ml-2" />
                                تحميل
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      السابق
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (page > totalPages) return null;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    >
                      التالي
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDigitalLibraryModal;