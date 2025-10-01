import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Type, Image, Link, MousePointer, Star, Layout, 
  Palette, Film, BarChart, Calendar, Mail, Phone,
  MapPin, Users, Settings, ShoppingCart, Play,
  FileText, Edit3, Layers
} from 'lucide-react';

interface ElementType {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  defaultProps: any;
}

const elementTypes: ElementType[] = [
  // Text Elements
  {
    id: 'text',
    name: 'نص بسيط',
    type: 'text',
    icon: <Type className="w-5 h-5" />,
    category: 'text',
    description: 'عنصر نص بسيط',
    defaultProps: { fontSize: 'base', textAlign: 'right' }
  },
  {
    id: 'rich-text',
    name: 'نص منسق',
    type: 'rich_text',
    icon: <Edit3 className="w-5 h-5" />,
    category: 'text',
    description: 'نص مع تنسيق متقدم',
    defaultProps: { fontSize: 'base', textAlign: 'right' }
  },
  {
    id: 'heading',
    name: 'عنوان رئيسي',
    type: 'text',
    icon: <FileText className="w-5 h-5" />,
    category: 'text',
    description: 'عنوان كبير ومميز',
    defaultProps: { fontSize: '2xl', fontWeight: 'bold' }
  },

  // Media Elements
  {
    id: 'image',
    name: 'صورة',
    type: 'image',
    icon: <Image className="w-5 h-5" />,
    category: 'media',
    description: 'صورة قابلة للتخصيص',
    defaultProps: { width: 'auto', height: 'auto', rounded: true }
  },
  {
    id: 'video',
    name: 'فيديو',
    type: 'video',
    icon: <Play className="w-5 h-5" />,
    category: 'media',
    description: 'مشغل فيديو مدمج',
    defaultProps: { autoplay: false, controls: true }
  },

  // Interactive Elements
  {
    id: 'button',
    name: 'زر',
    type: 'button',
    icon: <MousePointer className="w-5 h-5" />,
    category: 'interactive',
    description: 'زر تفاعلي',
    defaultProps: { variant: 'primary', size: 'md' }
  },
  {
    id: 'link',
    name: 'رابط',
    type: 'link',
    icon: <Link className="w-5 h-5" />,
    category: 'interactive',
    description: 'رابط نصي',
    defaultProps: { target: '_self', underline: true }
  },

  // Layout Elements
  {
    id: 'container',
    name: 'حاوي',
    type: 'layout',
    icon: <Layout className="w-5 h-5" />,
    category: 'layout',
    description: 'حاوي للعناصر الأخرى',
    defaultProps: { padding: 'md', background: 'transparent' }
  },

  // Data Elements
  {
    id: 'stat',
    name: 'إحصائية',
    type: 'stat',
    icon: <BarChart className="w-5 h-5" />,
    category: 'data',
    description: 'عرض رقم أو إحصائية',
    defaultProps: { size: 'lg', showIcon: true }
  }
];

const categories = [
  { id: 'all', name: 'الكل', count: elementTypes.length },
  { id: 'text', name: 'النصوص', count: elementTypes.filter(e => e.category === 'text').length },
  { id: 'media', name: 'الوسائط', count: elementTypes.filter(e => e.category === 'media').length },
  { id: 'interactive', name: 'تفاعلية', count: elementTypes.filter(e => e.category === 'interactive').length },
  { id: 'layout', name: 'التخطيط', count: elementTypes.filter(e => e.category === 'layout').length },
  { id: 'data', name: 'البيانات', count: elementTypes.filter(e => e.category === 'data').length }
];

interface DraggableElementProps {
  element: ElementType;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `element-${element.id}`,
    data: {
      type: 'element-type',
      elementType: element.type,
      name: element.name,
      defaultProps: element.defaultProps
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        cursor-grab active:cursor-grabbing transition-all hover:shadow-md
        ${isDragging ? 'ring-2 ring-primary shadow-lg' : ''}
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 text-right" dir="rtl">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
            {element.icon}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm text-foreground">{element.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{element.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ElementLibraryProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const ElementLibrary: React.FC<ElementLibraryProps> = ({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange
}) => {
  const filteredElements = elementTypes.filter(element => {
    const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg mb-2 text-right" dir="rtl">مكتبة العناصر</h3>
        <p className="text-sm text-muted-foreground text-right" dir="rtl">
          اسحب العناصر إلى المحرر لإضافتها
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <Input
          placeholder="البحث في العناصر..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-right"
          dir="rtl"
        />
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="text-xs"
            >
              {category.name}
              <Badge variant="secondary" className="mr-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {filteredElements.map(element => (
            <DraggableElement key={element.id} element={element} />
          ))}
          
          {filteredElements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Layout className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">لا توجد عناصر تطابق البحث</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          {filteredElements.length} من {elementTypes.length} عنصر
        </p>
      </div>
    </div>
  );
};