import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ContentElement, useUpdateContentElement } from '@/hooks/useContentEditor';
import { WysiwygEditor } from '@/components/admin/WysiwygEditor';
import EnhancedImageUpload from '@/components/editors/EnhancedImageUpload';
import IconPicker from '@/components/editors/IconPicker';
import { 
  Settings, Eye, Code, Palette, Layout, Image, 
  Type, MousePointer, BarChart, Save, X, 
  RefreshCw, Copy, Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ElementPropertiesPanelProps {
  element: ContentElement | null;
  onElementUpdate: (element: ContentElement) => void;
  onElementDelete: (elementId: string) => void;
  onElementDuplicate: (element: ContentElement) => void;
  onClose: () => void;
}

export const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({
  element,
  onElementUpdate,
  onElementDelete,
  onElementDuplicate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [localElement, setLocalElement] = useState<ContentElement | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const updateElementMutation = useUpdateContentElement();

  // Sync local element with prop changes
  useEffect(() => {
    if (element) {
      setLocalElement({ ...element });
      setHasChanges(false);
    }
  }, [element]);

  if (!element || !localElement) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg border">
        <div className="text-center text-muted-foreground">
          <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium mb-2">لا توجد عناصر محددة</h4>
          <p className="text-sm">اختر عنصراً من المحرر لتحرير خصائصه</p>
        </div>
      </div>
    );
  }

  const updateLocalElement = (updates: Partial<ContentElement>) => {
    setLocalElement(prev => prev ? { ...prev, ...updates } : null);
    setHasChanges(true);
  };

  const updateMetadata = (key: string, value: any) => {
    const newMetadata = { ...localElement.metadata, [key]: value };
    updateLocalElement({ metadata: newMetadata });
  };

  const handleSave = async () => {
    if (!localElement || !hasChanges) return;

    try {
      await updateElementMutation.mutateAsync({
        pageKey: 'homepage', // This should come from context
        elementKey: localElement.element_key,
        elementType: localElement.element_type,
        contentAr: localElement.content_ar,
        contentEn: localElement.content_en,
        metadata: localElement.metadata,
        status: localElement.status
      });

      onElementUpdate(localElement);
      setHasChanges(false);
      
      toast({
        title: 'تم حفظ التغييرات',
        description: 'تم تحديث العنصر بنجاح'
      });
    } catch (error) {
      console.error('Error saving element:', error);
    }
  };

  const handleReset = () => {
    if (element) {
      setLocalElement({ ...element });
      setHasChanges(false);
    }
  };

  const renderContentTab = () => {
    switch (localElement.element_type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content-ar">المحتوى (عربي)</Label>
              <Textarea
                id="content-ar"
                value={localElement.content_ar || ''}
                onChange={(e) => updateLocalElement({ content_ar: e.target.value })}
                placeholder="اكتب المحتوى بالعربية..."
                className="text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="content-en">المحتوى (إنجليزي)</Label>
              <Textarea
                id="content-en"
                value={localElement.content_en || ''}
                onChange={(e) => updateLocalElement({ content_en: e.target.value })}
                placeholder="Enter content in English..."
              />
            </div>
          </div>
        );

      case 'rich_text':
        return (
          <div className="space-y-4">
            <div>
              <Label>المحتوى المنسق (عربي)</Label>
              <WysiwygEditor
                value={localElement.content_ar || ''}
                onChange={(value) => updateLocalElement({ content_ar: value })}
                language="ar"
                height="200px"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>الصورة</Label>
              <EnhancedImageUpload
                onImageSelect={(url, altText) => {
                  updateMetadata('src', url);
                  updateMetadata('alt', altText);
                }}
                trigger={
                  <Button variant="outline" className="w-full">
                    <Image className="w-4 h-4 mr-2" />
                    {localElement.metadata?.src ? 'تغيير الصورة' : 'اختيار صورة'}
                  </Button>
                }
                allowEdit={true}
              />
              
              {localElement.metadata?.src && (
                <div className="mt-2">
                  <img 
                    src={localElement.metadata.src} 
                    alt={localElement.metadata?.alt || 'معاينة الصورة'}
                    className="max-w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="alt-text">النص البديل</Label>
              <Input
                id="alt-text"
                value={localElement.metadata?.alt || ''}
                onChange={(e) => updateMetadata('alt', e.target.value)}
                placeholder="وصف الصورة للمساعدة في الوصول"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text-ar">نص الزر (عربي)</Label>
              <Input
                id="button-text-ar"
                value={localElement.content_ar || ''}
                onChange={(e) => updateLocalElement({ content_ar: e.target.value })}
                placeholder="اكتب نص الزر"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="button-url">رابط الزر</Label>
              <Input
                id="button-url"
                type="url"
                value={localElement.metadata?.href || ''}
                onChange={(e) => updateMetadata('href', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 'stat':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="stat-number">الرقم/القيمة</Label>
              <Input
                id="stat-number"
                value={localElement.metadata?.number || localElement.content_ar || ''}
                onChange={(e) => {
                  updateMetadata('number', e.target.value);
                  updateLocalElement({ content_ar: e.target.value });
                }}
                placeholder="100"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="stat-label-ar">التسمية (عربي)</Label>
              <Input
                id="stat-label-ar"
                value={localElement.metadata?.label || ''}
                onChange={(e) => updateMetadata('label', e.target.value)}
                placeholder="عدد المستخدمين"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label>الأيقونة</Label>
              <IconPicker
                onIconSelect={(iconName, iconData) => {
                  updateMetadata('iconName', iconName);
                  updateMetadata('iconColor', iconData.color);
                  updateMetadata('iconSize', iconData.size);
                }}
                trigger={
                  <Button variant="outline" className="w-full">
                    {localElement.metadata?.iconName ? (
                      <>
                        <i className={`lucide-${localElement.metadata.iconName} w-4 h-4 mr-2`} />
                        {localElement.metadata.iconName}
                      </>
                    ) : (
                      'اختيار أيقونة'
                    )}
                  </Button>
                }
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="element-content-ar">المحتوى (عربي)</Label>
              <Textarea
                id="element-content-ar"
                value={localElement.content_ar || ''}
                onChange={(e) => updateLocalElement({ content_ar: e.target.value })}
                placeholder="المحتوى..."
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            خصائص العنصر
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{localElement.element_type}</Badge>
          <span>•</span>
          <span>{localElement.element_key}</span>
        </div>
      </CardHeader>

      {/* Action Buttons */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || updateElementMutation.isPending}
            size="sm"
          >
            {updateElementMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            حفظ
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset} 
            disabled={!hasChanges}
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            إعادة تعيين
          </Button>
        </div>
        
        {hasChanges && (
          <p className="text-xs text-amber-600 mt-2">
            توجد تغييرات لم يتم حفظها
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-6">
            <TabsTrigger value="content" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              المحتوى
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              التنسيق
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="content" className="p-6 pt-4 h-full">
              {renderContentTab()}
            </TabsContent>

            <TabsContent value="style" className="p-6 pt-4 h-full">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="element-order">ترتيب العرض</Label>
                  <Input
                    id="element-order"
                    type="number"
                    value={localElement.display_order}
                    onChange={(e) => updateLocalElement({ display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="element-active">مرئي في الموقع</Label>
                  <Switch
                    id="element-active"
                    checked={localElement.is_active}
                    onCheckedChange={(checked) => updateLocalElement({ is_active: checked })}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="element-status">حالة النشر</Label>
                  <Select 
                    value={localElement.status}
                    onValueChange={(value: ContentElement['status']) => updateLocalElement({ status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};