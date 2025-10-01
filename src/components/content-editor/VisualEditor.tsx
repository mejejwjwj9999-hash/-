import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentElement } from '@/hooks/useContentEditor';
import { 
  GripVertical, Eye, EyeOff, Edit, Copy, Trash2, 
  Plus, Image, Type, MousePointer, Layout, Settings
} from 'lucide-react';

interface SortableElementProps {
  element: ContentElement;
  isSelected: boolean;
  onSelect: (element: ContentElement) => void;
  onEdit: (element: ContentElement) => void;
  onDuplicate: (element: ContentElement) => void;
  onDelete: (elementId: string) => void;
  onToggleVisibility: (elementId: string, currentVisibility: boolean) => void;
}

const SortableElement: React.FC<SortableElementProps> = ({
  element,
  isSelected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleVisibility
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
      case 'rich_text':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'button':
        return <MousePointer className="w-4 h-4" />;
      case 'layout':
        return <Layout className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card 
        className={`
          mb-4 transition-all hover:shadow-md cursor-pointer
          ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
          ${!element.is_active ? 'opacity-50' : ''}
        `}
        onClick={() => onSelect(element)}
      >
        <CardContent className="p-4">
          {/* Element Header */}
          <div className="flex items-center justify-between mb-3" dir="rtl">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(element.status)} variant="outline">
                {element.status === 'published' ? 'منشور' : 
                 element.status === 'draft' ? 'مسودة' : 'مؤرشف'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {element.element_type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                {...listeners}
                {...attributes}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(element.id, element.is_active);
                  }}
                >
                  {element.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(element);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(element);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(element.id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Element Info */}
          <div className="flex items-center gap-3 mb-3" dir="rtl">
            <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
              {getElementIcon(element.element_type)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-foreground text-right">
                {element.element_key}
              </h4>
              <p className="text-xs text-muted-foreground text-right">
                ترتيب العرض: {element.display_order}
              </p>
            </div>
          </div>

          {/* Element Preview */}
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="text-right" dir="rtl">
              {element.element_type === 'text' && (
                <p className="text-sm">{element.content_ar || element.content_en || 'نص فارغ'}</p>
              )}
              {element.element_type === 'rich_text' && (
                <div 
                  className="text-sm prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: element.content_ar || element.content_en || 'محتوى فارغ'
                  }}
                />
              )}
              {element.element_type === 'image' && element.metadata?.src && (
                <div className="flex justify-center">
                  <img 
                    src={element.metadata.src} 
                    alt={element.metadata.alt || 'صورة'}
                    className="max-w-full h-20 object-cover rounded"
                  />
                </div>
              )}
              {element.element_type === 'button' && (
                <Button variant="outline" size="sm" disabled>
                  {element.content_ar || element.content_en || 'زر'}
                </Button>
              )}
              {element.element_type === 'stat' && (
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {element.metadata?.number || element.content_ar || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {element.metadata?.label || 'إحصائية'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface VisualEditorProps {
  elements: ContentElement[];
  selectedElement: ContentElement | null;
  selectedPageKey: string | null;
  onElementSelect: (element: ContentElement) => void;
  onElementEdit: (element: ContentElement) => void;
  onElementDuplicate: (element: ContentElement) => void;
  onElementDelete: (elementId: string) => void;
  onElementToggleVisibility: (elementId: string, currentVisibility: boolean) => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  elements,
  selectedElement,
  selectedPageKey,
  onElementSelect,
  onElementEdit,
  onElementDuplicate,
  onElementDelete,
  onElementToggleVisibility
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'visual-editor-dropzone'
  });

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg mb-2 text-right" dir="rtl">المحرر المرئي</h3>
        {selectedPageKey ? (
          <p className="text-sm text-muted-foreground text-right" dir="rtl">
            تحرير عناصر صفحة: {selectedPageKey}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground text-right" dir="rtl">
            اختر صفحة لبدء التحرير
          </p>
        )}
      </div>

      {/* Editor Area */}
      <div 
        ref={setNodeRef}
        className={`
          flex-1 overflow-auto p-4 transition-colors
          ${isOver ? 'bg-primary/5 border-primary border-dashed' : ''}
        `}
      >
        {!selectedPageKey ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium mb-2">اختر صفحة للبدء</h4>
              <p className="text-sm">انتقل إلى تبويب "الصفحات" واختر صفحة لتحرير محتواها</p>
            </div>
          </div>
        ) : elements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium mb-2">صفحة فارغة</h4>
              <p className="text-sm mb-4">اسحب عناصر من المكتبة لإضافتها إلى الصفحة</p>
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-primary/20 border border-primary border-dashed rounded"></div>
                  <span>منطقة الإفلات</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SortableContext items={elements.map(el => el.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-0">
              {elements.map(element => (
                <SortableElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElement?.id === element.id}
                  onSelect={onElementSelect}
                  onEdit={onElementEdit}
                  onDuplicate={onElementDuplicate}
                  onDelete={onElementDelete}
                  onToggleVisibility={onElementToggleVisibility}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground" dir="rtl">
          <span>{elements.length} عنصر في الصفحة</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>منشور</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>مسودة</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>مؤرشف</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};