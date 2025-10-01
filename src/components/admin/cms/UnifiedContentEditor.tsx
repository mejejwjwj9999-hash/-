import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Type, 
  Image as ImageIcon, 
  Link, 
  Palette, 
  Layout, 
  Code2,
  Upload,
  Trash2,
  Plus,
  Move,
  Copy
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentElement {
  id: string;
  type: 'text' | 'rich_text' | 'image' | 'button' | 'divider' | 'icon';
  content: {
    ar?: string;
    en?: string;
  };
  metadata?: {
    style?: string;
    color?: string;
    icon?: string;
    size?: string;
    alignment?: 'right' | 'center' | 'left';
  };
}

interface SortableElementProps {
  element: ContentElement;
  onUpdate: (id: string, updates: Partial<ContentElement>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const SortableElement: React.FC<SortableElementProps> = ({ element, onUpdate, onDelete, onDuplicate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderEditor = () => {
    switch (element.type) {
      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <Label>النص العربي</Label>
              <Input
                value={element.content.ar || ''}
                onChange={(e) => onUpdate(element.id, {
                  content: { ...element.content, ar: e.target.value }
                })}
                placeholder="أدخل النص العربي..."
                className="text-right"
              />
            </div>
            <div>
              <Label>النص الإنجليزي</Label>
              <Input
                value={element.content.en || ''}
                onChange={(e) => onUpdate(element.id, {
                  content: { ...element.content, en: e.target.value }
                })}
                placeholder="Enter English text..."
              />
            </div>
          </div>
        );
      
      case 'rich_text':
        return (
          <div className="space-y-3">
            <div>
              <Label>المحتوى العربي</Label>
              <Textarea
                value={element.content.ar || ''}
                onChange={(e) => onUpdate(element.id, {
                  content: { ...element.content, ar: e.target.value }
                })}
                placeholder="أدخل المحتوى العربي..."
                rows={4}
                className="text-right"
              />
            </div>
            <div>
              <Label>المحتوى الإنجليزي</Label>
              <Textarea
                value={element.content.en || ''}
                onChange={(e) => onUpdate(element.id, {
                  content: { ...element.content, en: e.target.value }
                })}
                placeholder="Enter English content..."
                rows={4}
              />
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <Label>رابط الصورة</Label>
              <div className="flex gap-2">
                <Input
                  value={element.content.ar || ''}
                  onChange={(e) => onUpdate(element.id, {
                    content: { ...element.content, ar: e.target.value }
                  })}
                  placeholder="https://example.com/image.jpg"
                />
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {element.content.ar && (
              <div className="border rounded-lg p-4 text-center">
                <img 
                  src={element.content.ar} 
                  alt="معاينة الصورة"
                  className="max-w-full h-32 object-cover mx-auto rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
        );
      
      default:
        return <div>نوع غير مدعوم</div>;
    }
  };

  const getElementIcon = () => {
    const iconProps = { className: "w-4 h-4" };
    switch (element.type) {
      case 'text': return <Type {...iconProps} />;
      case 'rich_text': return <Code2 {...iconProps} />;
      case 'image': return <ImageIcon {...iconProps} />;
      case 'button': return <Link {...iconProps} />;
      default: return <Type {...iconProps} />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                <Move className="w-4 h-4" />
              </Button>
              {getElementIcon()}
              <Badge variant="outline">{element.type}</Badge>
            </div>
            
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onDuplicate(element.id)}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(element.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {renderEditor()}
        </CardContent>
      </Card>
    </div>
  );
};

interface UnifiedContentEditorProps {
  pageKey: string;
  initialElements?: ContentElement[];
  onSave?: (elements: ContentElement[], status: 'draft' | 'published') => void;
}

export const UnifiedContentEditor: React.FC<UnifiedContentEditorProps> = ({ 
  pageKey, 
  initialElements = [], 
  onSave 
}) => {
  const [elements, setElements] = useState<ContentElement[]>(initialElements);
  const [history, setHistory] = useState<ContentElement[][]>([initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('editor');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addToHistory = (newElements: ContentElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const addElement = (type: ContentElement['type']) => {
    const newElement: ContentElement = {
      id: `element-${Date.now()}`,
      type,
      content: { ar: '', en: '' },
      metadata: {}
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
  };

  const updateElement = (id: string, updates: Partial<ContentElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
  };

  const duplicateElement = (id: string) => {
    const elementToDuplicate = elements.find(el => el.id === id);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: `element-${Date.now()}`
      };
      const elementIndex = elements.findIndex(el => el.id === id);
      const newElements = [
        ...elements.slice(0, elementIndex + 1),
        newElement,
        ...elements.slice(elementIndex + 1)
      ];
      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = elements.findIndex(el => el.id === active.id);
      const newIndex = elements.findIndex(el => el.id === over.id);
      
      const newElements = arrayMove(elements, oldIndex, newIndex);
      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const handleSave = (status: 'draft' | 'published') => {
    onSave?.(elements, status);
  };

  const renderPreview = () => {
    return (
      <div className="space-y-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
        <h3 className="text-xl font-bold mb-4">معاينة المحتوى</h3>
        {elements.map(element => (
          <div key={element.id} className="mb-4">
            {element.type === 'text' && (
              <h2 className="text-lg font-semibold">{element.content.ar}</h2>
            )}
            {element.type === 'rich_text' && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {element.content.ar}
                </p>
              </div>
            )}
            {element.type === 'image' && element.content.ar && (
              <div className="text-center">
                <img 
                  src={element.content.ar} 
                  alt="صورة"
                  className="max-w-full h-48 object-cover mx-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">محرر المحتوى الموحد</h2>
          <p className="text-muted-foreground">إنشاء وتحرير المحتوى بسهولة</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => handleSave('draft')}>
            <Save className="w-4 h-4 ml-2" />
            حفظ مسودة
          </Button>
          <Button onClick={() => handleSave('published')}>
            <Eye className="w-4 h-4 ml-2" />
            نشر
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">المحرر</TabsTrigger>
          <TabsTrigger value="preview">المعاينة</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Element Tools */}
          <Card>
            <CardHeader>
              <CardTitle>إضافة عناصر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => addElement('text')}>
                  <Type className="w-4 h-4 ml-2" />
                  نص
                </Button>
                <Button variant="outline" onClick={() => addElement('rich_text')}>
                  <Code2 className="w-4 h-4 ml-2" />
                  نص منسق
                </Button>
                <Button variant="outline" onClick={() => addElement('image')}>
                  <ImageIcon className="w-4 h-4 ml-2" />
                  صورة
                </Button>
                <Button variant="outline" onClick={() => addElement('button')}>
                  <Link className="w-4 h-4 ml-2" />
                  زر
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Elements */}
          <div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={elements.map(el => el.id)} strategy={verticalListSortingStrategy}>
                {elements.map(element => (
                  <SortableElement
                    key={element.id}
                    element={element}
                    onUpdate={updateElement}
                    onDelete={deleteElement}
                    onDuplicate={duplicateElement}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {elements.length === 0 && (
              <Card className="border-dashed border-2 p-8 text-center">
                <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">لا توجد عناصر بعد. ابدأ بإضافة عنصر جديد.</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {renderPreview()}
        </TabsContent>
      </Tabs>
    </div>
  );
};