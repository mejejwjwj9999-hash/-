import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAdvancedContentSearch, SearchFilters } from '@/hooks/useAdvancedContentSearch';
import { useContentPages } from '@/hooks/useContentEditor';
import { 
  Search, 
  Filter, 
  Save, 
  Calendar as CalendarIcon,
  FileText,
  Image,
  Link,
  MousePointer,
  Edit3,
  X,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SmartElementSearchProps {
  onElementSelect: (element: any) => void;
  selectedPageId?: string;
}

export const SmartElementSearch: React.FC<SmartElementSearchProps> = ({
  onElementSelect,
  selectedPageId
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    pageIds: selectedPageId ? [selectedPageId] : [],
    elementTypes: [],
    status: 'all',
    language: 'both'
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const { data: pages } = useContentPages();
  const { data: searchResults, isLoading } = useAdvancedContentSearch(filters);

  // تحديث الفلاتر عند تغيير الصفحة المحددة
  useEffect(() => {
    if (selectedPageId) {
      setFilters(prev => ({
        ...prev,
        pageIds: [selectedPageId]
      }));
    }
  }, [selectedPageId]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'searchTerm' && value === '' ? { dateRange: undefined } : {})
    }));
  };

  const handlePageToggle = (pageId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      pageIds: checked 
        ? [...(prev.pageIds || []), pageId]
        : (prev.pageIds || []).filter(id => id !== pageId)
    }));
  };

  const handleElementTypeToggle = (type: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      elementTypes: checked
        ? [...(prev.elementTypes || []), type]
        : (prev.elementTypes || []).filter(t => t !== type)
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      pageIds: selectedPageId ? [selectedPageId] : [],
      elementTypes: [],
      status: 'all',
      language: 'both'
    });
    setDateRange({});
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />;
      case 'rich_text': return <Edit3 className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      case 'button': return <MousePointer className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  const elementTypes = [
    { value: 'text', label: 'نص بسيط' },
    { value: 'rich_text', label: 'نص منسق' },
    { value: 'image', label: 'صورة' },
    { value: 'link', label: 'رابط' },
    { value: 'button', label: 'زر' }
  ];

  return (
    <div className="space-y-4">
      {/* شريط البحث الرئيسي */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث في العناصر والمحتوى..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="pr-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          فلاتر متقدمة
        </Button>
        {(filters.searchTerm || filters.pageIds?.length || filters.elementTypes?.length) && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* الفلاتر المتقدمة */}
      {showAdvancedFilters && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* فلتر الحالة */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الحالة</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* فلتر اللغة */}
            <div className="space-y-2">
              <label className="text-sm font-medium">اللغة</label>
              <Select
                value={filters.language || 'both'}
                onValueChange={(value) => handleFilterChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">العربية والإنجليزية</SelectItem>
                  <SelectItem value="ar">العربية فقط</SelectItem>
                  <SelectItem value="en">الإنجليزية فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* فلتر التاريخ */}
            <div className="space-y-2">
              <label className="text-sm font-medium">آخر تحديث</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 ml-2" />
                    {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy', { locale: ar }) : 'اختر التاريخ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      setDateRange(range || {});
                      handleFilterChange('dateRange', range);
                    }}
                    locale={ar}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* فلتر الصفحات */}
          {!selectedPageId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">الصفحات</label>
              <div className="flex flex-wrap gap-2">
                {pages?.map(page => (
                  <div key={page.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`page-${page.id}`}
                      checked={filters.pageIds?.includes(page.id) || false}
                      onCheckedChange={(checked) => handlePageToggle(page.id, checked as boolean)}
                    />
                    <label htmlFor={`page-${page.id}`} className="text-sm">
                      {page.page_name_ar}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* فلتر أنواع العناصر */}
          <div className="space-y-2">
            <label className="text-sm font-medium">أنواع العناصر</label>
            <div className="flex flex-wrap gap-2">
              {elementTypes.map(type => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.elementTypes?.includes(type.value) || false}
                    onCheckedChange={(checked) => handleElementTypeToggle(type.value, checked as boolean)}
                  />
                  <label htmlFor={`type-${type.value}`} className="text-sm flex items-center gap-1">
                    {getElementIcon(type.value)}
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* النتائج */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">جاري البحث...</p>
          </div>
        ) : searchResults?.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">لا توجد نتائج تطابق البحث</p>
          </Card>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults?.map(element => (
              <Card 
                key={element.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onElementSelect(element)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                      {getElementIcon(element.element_type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{element.element_key}</h4>
                        <Badge variant={getStatusColor(element.status)} className="text-xs">
                          {element.status === 'published' ? 'منشور' : 
                           element.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                        </Badge>
                        {element.relevance_score && element.relevance_score > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3" />
                            {element.relevance_score}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        الصفحة: {element.page_name_ar} • النوع: {
                          elementTypes.find(t => t.value === element.element_type)?.label
                        }
                      </p>
                      {element.content_ar && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {element.content_ar.length > 100 
                            ? element.content_ar.substring(0, 100) + '...' 
                            : element.content_ar}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};