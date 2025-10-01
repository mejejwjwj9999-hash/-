import React, { useState, useMemo, useCallback } from 'react';
import { Search, Grid3X3, List, Star, Heart, Settings, ArrowRight, Plus, Download, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react';

// تصنيفات الأيقونات
const ICON_CATEGORIES = {
  all: 'جميع الأيقونات',
  interface: 'واجهة المستخدم',
  navigation: 'التنقل',
  media: 'الوسائط',
  communication: 'التواصل',
  business: 'الأعمال',
  education: 'التعليم',
  social: 'وسائل التواصل',
  weather: 'الطقس',
  transport: 'النقل',
  medical: 'طبي',
  food: 'طعام وشراب',
  sport: 'رياضة',
  technology: 'تكنولوجيا',
  security: 'الأمان',
  favorites: 'المفضلة'
};

// قائمة الأيقونات مع التصنيفات
const ICON_DATA = [
  // واجهة المستخدم
  { name: 'Home', category: 'interface', tags: ['منزل', 'بداية', 'رئيسية'] },
  { name: 'Settings', category: 'interface', tags: ['إعدادات', 'تكوين'] },
  { name: 'Search', category: 'interface', tags: ['بحث', 'العثور'] },
  { name: 'User', category: 'interface', tags: ['مستخدم', 'شخص'] },
  { name: 'Bell', category: 'interface', tags: ['إشعار', 'تنبيه'] },
  { name: 'Menu', category: 'interface', tags: ['قائمة', 'خيارات'] },
  
  // التنقل
  { name: 'ArrowRight', category: 'navigation', tags: ['سهم', 'التالي'] },
  { name: 'ArrowLeft', category: 'navigation', tags: ['سهم', 'السابق'] },
  { name: 'ChevronUp', category: 'navigation', tags: ['أعلى', 'فوق'] },
  { name: 'ChevronDown', category: 'navigation', tags: ['أسفل', 'تحت'] },
  { name: 'Navigation', category: 'navigation', tags: ['بوصلة', 'اتجاه'] },
  
  // الوسائط
  { name: 'Image', category: 'media', tags: ['صورة', 'صور'] },
  { name: 'Video', category: 'media', tags: ['فيديو', 'مقطع'] },
  { name: 'Music', category: 'media', tags: ['موسيقى', 'صوت'] },
  { name: 'Camera', category: 'media', tags: ['كاميرا', 'تصوير'] },
  { name: 'Play', category: 'media', tags: ['تشغيل', 'بدء'] },
  { name: 'Pause', category: 'media', tags: ['إيقاف مؤقت'] },
  
  // التواصل
  { name: 'Mail', category: 'communication', tags: ['بريد', 'إيميل'] },
  { name: 'Phone', category: 'communication', tags: ['هاتف', 'اتصال'] },
  { name: 'MessageCircle', category: 'communication', tags: ['رسالة', 'دردشة'] },
  { name: 'Send', category: 'communication', tags: ['إرسال', 'بريد'] },
  
  // الأعمال
  { name: 'Building', category: 'business', tags: ['مبنى', 'مكتب', 'شركة'] },
  { name: 'Calendar', category: 'business', tags: ['تقويم', 'تاريخ'] },
  { name: 'Clock', category: 'business', tags: ['ساعة', 'وقت'] },
  { name: 'DollarSign', category: 'business', tags: ['دولار', 'مال', 'سعر'] },
  { name: 'TrendingUp', category: 'business', tags: ['ارتفاع', 'نمو'] },
  
  // إضافة المزيد من الأيقونات...
];

interface IconLibraryProps {
  onIconSelect?: (iconName: string) => void;
  selectedIcon?: string;
  size?: 'small' | 'medium' | 'large';
  showSearch?: boolean;
  showCategories?: boolean;
  className?: string;
}

export const IconLibrary = ({
  onIconSelect,
  selectedIcon,
  size = 'medium',
  showSearch = true,
  showCategories = true,
  className = ''
}: IconLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  // تصفية الأيقونات
  const filteredIcons = useMemo(() => {
    let icons = ICON_DATA;

    // تصفية حسب الفئة
    if (activeCategory !== 'all') {
      if (activeCategory === 'favorites') {
        icons = icons.filter(icon => favorites.includes(icon.name));
      } else {
        icons = icons.filter(icon => icon.category === activeCategory);
      }
    }

    // تصفية حسب البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      icons = icons.filter(icon => 
        icon.name.toLowerCase().includes(term) ||
        icon.tags.some(tag => tag.includes(term))
      );
    }

    return icons;
  }, [activeCategory, searchTerm, favorites]);

  // تبديل المفضلة
  const toggleFavorite = useCallback((iconName: string) => {
    setFavorites(prev => 
      prev.includes(iconName)
        ? prev.filter(name => name !== iconName)
        : [...prev, iconName]
    );
  }, []);

  // نسخ رمز الأيقونة
  const copyIconCode = useCallback((iconName: string) => {
    const code = `<${iconName} />`;
    navigator.clipboard.writeText(code);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
    toast({
      title: 'تم النسخ',
      description: `تم نسخ رمز الأيقونة ${iconName}`
    });
  }, []);

  // تحديد حجم الأيقونة
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32
  }[size];

  // رندر الأيقونة
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={iconSize} /> : null;
  };

  return (
    <div className={`w-full h-full bg-background ${className}`}>
      {/* شريط البحث والفلاتر */}
      {showSearch && (
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن الأيقونات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Badge variant="secondary">
              {filteredIcons.length} أيقونة
            </Badge>
          </div>
        </div>
      )}

      <div className="flex h-full">
        {/* التصنيفات */}
        {showCategories && (
          <div className="w-48 border-l bg-muted/30">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-1">
                {Object.entries(ICON_CATEGORIES).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={activeCategory === key ? 'default' : 'ghost'}
                    className="w-full justify-start text-right"
                    onClick={() => setActiveCategory(key)}
                  >
                    {label}
                    {key === 'favorites' && favorites.length > 0 && (
                      <Badge variant="secondary" className="mr-auto">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* شبكة الأيقونات */}
        <div className="flex-1">
          <ScrollArea className="h-full">
            <div className="p-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {filteredIcons.map((icon) => (
                    <TooltipProvider key={icon.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card 
                            className={`
                              group cursor-pointer transition-all hover:scale-105 hover:shadow-md
                              ${selectedIcon === icon.name ? 'ring-2 ring-primary' : ''}
                            `}
                            onClick={() => onIconSelect?.(icon.name)}
                          >
                            <CardContent className="p-3 flex flex-col items-center space-y-2">
                              <div className="relative">
                                {renderIcon(icon.name)}
                                
                                {/* أزرار التحكم */}
                                <div className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex space-x-1 space-x-reverse">
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-5 w-5 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(icon.name);
                                      }}
                                    >
                                      <Heart 
                                        className={`h-3 w-3 ${
                                          favorites.includes(icon.name) 
                                            ? 'fill-current text-red-500' 
                                            : ''
                                        }`} 
                                      />
                                    </Button>
                                    
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-5 w-5 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyIconCode(icon.name);
                                      }}
                                    >
                                      {copiedIcon === icon.name ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-center text-muted-foreground truncate w-full">
                                {icon.name}
                              </div>
                            </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <div className="font-medium">{icon.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {icon.tags.join('، ')}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredIcons.map((icon) => (
                    <Card 
                      key={icon.name}
                      className={`
                        cursor-pointer transition-colors hover:bg-muted/50
                        ${selectedIcon === icon.name ? 'bg-primary/10 border-primary' : ''}
                      `}
                      onClick={() => onIconSelect?.(icon.name)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          {renderIcon(icon.name)}
                          <div className="flex-1">
                            <div className="font-medium">{icon.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {icon.tags.join('، ')}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(icon.name);
                              }}
                            >
                              <Heart 
                                className={`h-4 w-4 ${
                                  favorites.includes(icon.name) 
                                    ? 'fill-current text-red-500' 
                                    : ''
                                }`} 
                              />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyIconCode(icon.name);
                              }}
                            >
                              {copiedIcon === icon.name ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredIcons.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد أيقونات</h3>
                  <p className="text-muted-foreground">
                    لم يتم العثور على أيقونات تطابق معايير البحث
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

// مكون منتقي الأيقونات في نافذة منبثقة
interface IconPickerProps {
  value?: string;
  onChange?: (iconName: string) => void;
  children?: React.ReactNode;
}

export const IconPicker = ({ value, onChange, children }: IconPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            {value ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                {React.createElement((LucideIcons as any)[value], { size: 16 })}
                <span>{value}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Plus className="h-4 w-4" />
                <span>اختر أيقونة</span>
              </div>
            )}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>مكتبة الأيقونات</DialogTitle>
        </DialogHeader>
        
        <IconLibrary
          selectedIcon={value}
          onIconSelect={(iconName) => {
            onChange?.(iconName);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default IconLibrary;