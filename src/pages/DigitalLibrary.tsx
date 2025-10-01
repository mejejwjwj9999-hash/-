
import React, { useState } from 'react';
import { BookOpen, Search, Download, Database, Globe, FileText, Users, Clock, Filter, Home, Eye } from 'lucide-react';
import { useDigitalLibraryResources, useIncrementCounter } from '@/hooks/useDigitalLibrary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import UnifiedPageHeader from '@/components/ui/unified-page-header';

const DigitalLibrary = () => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    resource_type: 'all',
    language: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 8 : 12;

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const { data: resources = [], isLoading, error } = useDigitalLibraryResources({ 
    search: filters.search || undefined,
    category: filters.category === 'all' ? undefined : filters.category,
    resource_type: filters.resource_type === 'all' ? undefined : filters.resource_type,
    language: filters.language === 'all' ? undefined : filters.language,
    status: 'published' 
  });

  const incrementCounter = useIncrementCounter();

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResources = resources.slice(startIndex, endIndex);
  const totalPages = Math.ceil(resources.length / itemsPerPage);

  const handleViewResource = (resourceId: string) => {
    incrementCounter.mutate({ resourceId, counterType: 'views' });
  };

  const handleDownloadResource = (resourceId: string, fileUrl?: string) => {
    if (fileUrl) {
      incrementCounter.mutate({ resourceId, counterType: 'downloads' });
      window.open(fileUrl, '_blank');
    }
  };

  const resourceTypeIcons = {
    book: BookOpen,
    journal: FileText,
    thesis: FileText,
    database: Database,
    article: FileText,
    document: FileText,
  };

  const getCategoryName = (category: string) => {
    const categoryNames = {
      'pharmacy': 'الصيدلة',
      'nursing': 'التمريض', 
      'it': 'تكنولوجيا المعلومات',
      'business': 'إدارة الأعمال',
      'midwifery': 'القبالة',
      'general': 'عام'
    };
    return categoryNames[category] || category;
  };

  const getResourceTypeName = (type: string) => {
    const typeNames = {
      'book': 'كتاب',
      'journal': 'مجلة علمية',
      'thesis': 'رسالة جامعية',
      'database': 'قاعدة بيانات',
      'article': 'مقال',
      'document': 'وثيقة'
    };
    return typeNames[type] || type;
  };

  return (
    <div className="min-h-screen">
      <UnifiedPageHeader
        icon={BookOpen}
        title="المكتبة الرقمية"
        subtitle="بوابتك إلى عالم المعرفة والمصادر العلمية الرقمية المتطورة"
        breadcrumbs={[
          { label: 'الرئيسية', href: '/', icon: Home },
          { label: 'المكتبة الرقمية', icon: BookOpen }
        ]}
      />

      {/* Main Content Section */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          <div className="card-elevated max-w-6xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              
              {/* Search and Filters Section */}
              <section>
                <div className="text-center mb-6">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-university-blue mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-university-blue mb-2">البحث في المكتبة</h2>
                  <p className="text-sm sm:text-base text-academic-gray">ابحث في آلاف المصادر العلمية والأكاديمية</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Input 
                      type="text" 
                      className="flex-1 text-sm sm:text-base"
                      placeholder="ابحث في الكتب والمقالات والرسائل..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    <Button className="btn-primary px-4 sm:px-6 whitespace-nowrap">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      بحث
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="جميع التخصصات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع التخصصات</SelectItem>
                        <SelectItem value="pharmacy">الصيدلة</SelectItem>
                        <SelectItem value="nursing">التمريض</SelectItem>
                        <SelectItem value="it">تكنولوجيا المعلومات</SelectItem>
                        <SelectItem value="business">إدارة الأعمال</SelectItem>
                        <SelectItem value="midwifery">القبالة</SelectItem>
                        <SelectItem value="general">عام</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.resource_type} onValueChange={(value) => handleFilterChange('resource_type', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="نوع المصدر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        <SelectItem value="book">كتب</SelectItem>
                        <SelectItem value="journal">مجلات علمية</SelectItem>
                        <SelectItem value="thesis">رسائل جامعية</SelectItem>
                        <SelectItem value="database">قواعد بيانات</SelectItem>
                        <SelectItem value="article">مقالات</SelectItem>
                        <SelectItem value="document">وثائق</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="اللغة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع اللغات</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">الإنجليزية</SelectItem>
                        <SelectItem value="both">ثنائي اللغة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Search Results Section */}
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-university-blue">
                      نتائج البحث ({resources.length})
                    </h3>
                    <p className="text-sm text-academic-gray">
                      {filters.search && `البحث عن: "${filters.search}"`}
                      {filters.category !== 'all' && ` • ${getCategoryName(filters.category)}`}
                      {filters.resource_type !== 'all' && ` • ${getResourceTypeName(filters.resource_type)}`}
                    </p>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-university-blue"></div>
                    <p className="mt-4 text-gray-600 text-sm sm:text-base">جاري تحميل المصادر...</p>
                  </div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">لا توجد مصادر متاحة</h3>
                    <p className="text-sm sm:text-base text-gray-500">لم يتم العثور على مصادر مطابقة لمعايير البحث</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {paginatedResources.map((resource) => {
                        const IconComponent = resourceTypeIcons[resource.resource_type];
                        return (
                          <div key={resource.id} className="card-elevated hover:shadow-lg transition-all cursor-pointer" onClick={() => handleViewResource(resource.id)}>
                            <div className="p-3 sm:p-4">
                              <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-university-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                                  <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                </div>
                                {resource.is_featured && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">مميز</Badge>
                                )}
                              </div>
                              
                              {resource.thumbnail_url && (
                                <img 
                                  src={resource.thumbnail_url} 
                                  alt={resource.title_ar}
                                  className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3 sm:mb-4"
                                />
                              )}
                              
                              <h3 className="text-sm sm:text-lg font-bold text-university-blue mb-1 sm:mb-2 line-clamp-2">{resource.title_ar}</h3>
                              
                              {resource.author_ar && (
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">المؤلف: {resource.author_ar}</p>
                              )}
                              
                              <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryName(resource.category)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {getResourceTypeName(resource.resource_type)}
                                </Badge>
                                {resource.publication_year && (
                                  <Badge variant="outline" className="text-xs">
                                    {resource.publication_year}
                                  </Badge>
                                )}
                              </div>
                              
                              {resource.description_ar && (
                                <p className="text-xs sm:text-sm text-academic-gray mb-3 sm:mb-4 line-clamp-2">
                                  {resource.description_ar}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3 sm:mb-4">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {resource.views_count || 0} {isMobile ? '' : 'مشاهدة'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {resource.downloads_count || 0} {isMobile ? '' : 'تحميل'}
                                </span>
                              </div>
                              
                              {resource.file_url && (
                                <Button 
                                  className="w-full btn-primary text-xs sm:text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadResource(resource.id, resource.file_url);
                                  }}
                                >
                                  <Download className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                                  {isMobile ? 'تحميل' : 'تحميل المصدر'}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
                        <Button
                          variant="outline"
                          size={isMobile ? "sm" : "default"}
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className="text-xs sm:text-sm"
                        >
                          السابق
                        </Button>
                        
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                              page = i + 1;
                            } else if (currentPage <= 3) {
                              page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              page = totalPages - 4 + i;
                            } else {
                              page = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="text-xs"
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size={isMobile ? "sm" : "default"}
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className="text-xs sm:text-sm"
                        >
                          التالي
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </section>

              <Separator />

              {/* Quick Stats */}
              <section className="text-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-university-blue mx-auto" />
                    <div className="text-lg sm:text-2xl font-bold text-university-blue">
                      {resources.filter(r => r.resource_type === 'book').length}
                    </div>
                    <div className="text-xs sm:text-sm text-academic-gray">كتب إلكترونية</div>
                  </div>
                  
                  <div className="space-y-2">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-university-blue mx-auto" />
                    <div className="text-lg sm:text-2xl font-bold text-university-blue">
                      {resources.filter(r => r.resource_type === 'journal').length}
                    </div>
                    <div className="text-xs sm:text-sm text-academic-gray">دوريات علمية</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Database className="w-6 h-6 sm:w-8 sm:h-8 text-university-blue mx-auto" />
                    <div className="text-lg sm:text-2xl font-bold text-university-blue">
                      {resources.filter(r => r.resource_type === 'database').length}
                    </div>
                    <div className="text-xs sm:text-sm text-academic-gray">قواعد بيانات</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-university-blue mx-auto" />
                    <div className="text-lg sm:text-2xl font-bold text-university-blue">
                      {resources.filter(r => r.resource_type === 'thesis').length}
                    </div>
                    <div className="text-xs sm:text-sm text-academic-gray">رسائل جامعية</div>
                  </div>
                </div>
                
                <div className="text-center pt-6 sm:pt-8 border-t border-university-blue/20 mt-6 sm:mt-8">
                  <div className="bg-university-gold/10 p-3 sm:p-4 rounded-lg mb-4">
                    <p className="text-xs sm:text-sm text-university-blue font-medium">
                      مكتبة رقمية شاملة لخدمة التعليم والبحث العلمي
                    </p>
                  </div>
                  <p className="text-xs text-academic-gray">
                    المجموع الكلي: {resources.length} مصدر علمي متاح • آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DigitalLibrary;
