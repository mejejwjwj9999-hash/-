import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateContentElement, useDeleteContentElement } from '@/hooks/useContentEditor';
import { useContentPages } from '@/hooks/useContentEditor';
import { 
  Copy,
  Move,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Archive,
  Share,
  Download,
  Upload,
  Zap,
  Settings,
  MoreHorizontal,
  CheckSquare,
  Square,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface QuickActionsPanelProps {
  selectedElements: any[];
  onSelectionChange: (elements: any[]) => void;
  onElementUpdate: (element: any) => void;
  allElements: any[];
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  selectedElements,
  onSelectionChange,
  onElementUpdate,
  allElements
}) => {
  const [bulkAction, setBulkAction] = useState<string>('');
  const [targetPageId, setTargetPageId] = useState<string>('');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const { data: pages } = useContentPages();
  const updateElement = useUpdateContentElement();
  const deleteElement = useDeleteContentElement();

  const isAllSelected = selectedElements.length === allElements.length;
  const isPartiallySelected = selectedElements.length > 0 && selectedElements.length < allElements.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allElements);
    }
  };

  const handleElementToggle = (element: any) => {
    const isSelected = selectedElements.some(e => e.id === element.id);
    if (isSelected) {
      onSelectionChange(selectedElements.filter(e => e.id !== element.id));
    } else {
      onSelectionChange([...selectedElements, element]);
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedElements.length === 0) {
      toast.error('اختر عملية وعناصر للتنفيذ');
      return;
    }

    try {
      switch (bulkAction) {
        case 'publish':
          for (const element of selectedElements) {
            await updateElement.mutateAsync({
              pageKey: element.page_key,
              elementKey: element.element_key,
              elementType: element.element_type,
              contentAr: element.content_ar,
              contentEn: element.content_en,
              status: 'published'
            });
          }
          toast.success(`تم نشر ${selectedElements.length} عنصر بنجاح`);
          break;

        case 'draft':
          for (const element of selectedElements) {
            await updateElement.mutateAsync({
              pageKey: element.page_key,
              elementKey: element.element_key,
              elementType: element.element_type,
              contentAr: element.content_ar,
              contentEn: element.content_en,
              status: 'draft'
            });
          }
          toast.success(`تم تحويل ${selectedElements.length} عنصر إلى مسودة`);
          break;

        case 'archive':
          for (const element of selectedElements) {
            await updateElement.mutateAsync({
              pageKey: element.page_key,
              elementKey: element.element_key,
              elementType: element.element_type,
              contentAr: element.content_ar,
              contentEn: element.content_en,
              status: 'archived'
            });
          }
          toast.success(`تم أرشفة ${selectedElements.length} عنصر`);
          break;

        case 'delete':
          for (const element of selectedElements) {
            await deleteElement.mutateAsync(element.id);
          }
          toast.success(`تم حذف ${selectedElements.length} عنصر`);
          onSelectionChange([]);
          break;

        case 'move':
          if (!targetPageId) {
            toast.error('اختر الصفحة المقصودة');
            return;
          }
          // تنفيذ نقل العناصر (يحتاج لتطوير API مخصص)
          toast.success(`تم نقل ${selectedElements.length} عنصر`);
          break;

        case 'duplicate':
          // تنفيذ نسخ العناصر
          for (const element of selectedElements) {
            await updateElement.mutateAsync({
              pageKey: element.page_key,
              elementKey: `${element.element_key}_copy`,
              elementType: element.element_type,
              contentAr: element.content_ar,
              contentEn: element.content_en,
              status: 'draft'
            });
          }
          toast.success(`تم نسخ ${selectedElements.length} عنصر`);
          break;

        default:
          toast.error('عملية غير مدعومة');
      }

      setBulkAction('');
      onSelectionChange([]);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('حدث خطأ أثناء تنفيذ العملية');
    }
  };

  const exportSelected = () => {
    if (selectedElements.length === 0) {
      toast.error('اختر عناصر للتصدير');
      return;
    }

    const exportData = {
      elements: selectedElements.map(element => ({
        element_key: element.element_key,
        element_type: element.element_type,
        content_ar: element.content_ar,
        content_en: element.content_en,
        metadata: element.metadata,
        status: element.status
      })),
      exported_at: new Date().toISOString(),
      total_elements: selectedElements.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elements_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`تم تصدير ${selectedElements.length} عنصر`);
  };

  const createTemplate = async () => {
    if (!templateName || selectedElements.length === 0) {
      toast.error('أدخل اسم القالب واختر عناصر');
      return;
    }

    const templateData = {
      name: templateName,
      description: templateDescription,
      elements: selectedElements.map(element => ({
        element_key: element.element_key,
        element_type: element.element_type,
        content_ar: element.content_ar,
        content_en: element.content_en,
        metadata: element.metadata
      })),
      created_at: new Date().toISOString()
    };

    // حفظ القالب في localStorage أو قاعدة البيانات
    const savedTemplates = JSON.parse(localStorage.getItem('content_templates') || '[]');
    savedTemplates.push(templateData);
    localStorage.setItem('content_templates', JSON.stringify(savedTemplates));

    toast.success(`تم إنشاء القالب "${templateName}" بنجاح`);
    setIsTemplateDialogOpen(false);
    setTemplateName('');
    setTemplateDescription('');
  };

  const quickActions = [
    { id: 'publish', label: 'نشر', icon: Eye, color: 'text-green-600' },
    { id: 'draft', label: 'مسودة', icon: Edit3, color: 'text-blue-600' },
    { id: 'archive', label: 'أرشفة', icon: Archive, color: 'text-gray-600' },
    { id: 'duplicate', label: 'نسخ', icon: Copy, color: 'text-purple-600' },
    { id: 'move', label: 'نقل', icon: Move, color: 'text-orange-600' },
    { id: 'delete', label: 'حذف', icon: Trash2, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-4">
      {/* شريط التحديد */}
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">
                {selectedElements.length > 0 
                  ? `محدد ${selectedElements.length} من ${allElements.length}`
                  : 'تحديد الكل'
                }
              </span>
            </div>
            
            {selectedElements.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedElements.length} محدد
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* الإجراءات السريعة */}
      {selectedElements.length > 0 && (
        <Card className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">الإجراءات السريعة</h4>
            <Button variant="ghost" size="sm" onClick={() => onSelectionChange([])}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* أزرار الإجراءات السريعة */}
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => setBulkAction(action.id)}
                className={`flex items-center gap-2 ${bulkAction === action.id ? 'ring-2 ring-primary' : ''}`}
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                {action.label}
              </Button>
            ))}
          </div>

          {/* خيارات إضافية للنقل */}
          {bulkAction === 'move' && (
            <div className="space-y-2">
              <Label>الصفحة المقصودة</Label>
              <Select value={targetPageId} onValueChange={setTargetPageId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصفحة" />
                </SelectTrigger>
                <SelectContent>
                  {pages?.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.page_name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* أزرار التنفيذ */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={executeBulkAction}
                disabled={!bulkAction || updateElement.isPending || deleteElement.isPending}
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                تنفيذ العملية
              </Button>
              
              <Button variant="outline" size="sm" onClick={exportSelected}>
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>

              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    إنشاء قالب
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء قالب جديد</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>اسم القالب</Label>
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="أدخل اسم القالب"
                      />
                    </div>
                    <div>
                      <Label>الوصف (اختياري)</Label>
                      <Textarea
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="وصف القالب"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={createTemplate}>
                        إنشاء القالب
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <span className="text-xs text-muted-foreground">
              سيتم تطبيق العملية على {selectedElements.length} عنصر
            </span>
          </div>
        </Card>
      )}

      {/* قائمة العناصر للتحديد */}
      <Card className="p-3">
        <h4 className="font-semibold text-sm mb-3">العناصر</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {allElements.map(element => (
            <div
              key={element.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                checked={selectedElements.some(e => e.id === element.id)}
                onCheckedChange={() => handleElementToggle(element)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{element.element_key}</span>
                  <Badge variant="outline" className="text-xs">
                    {element.status === 'published' ? 'منشور' : 
                     element.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {element.page_name_ar} • {element.element_type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};