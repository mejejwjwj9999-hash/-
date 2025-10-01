import React, { useMemo, useState } from 'react';
import { useManageServices, useManageCategories, useCreateService, useUpdateService, useDeleteService, QuickService, ServiceCategory } from '@/hooks/useQuickServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, GripVertical } from 'lucide-react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ServiceFormData {
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  icon_name: string;
  icon_color: string;
  background_color: string;
  url?: string;
  category_id?: string;
  display_order: number;
  is_active: boolean;
  is_external: boolean;
  requires_auth: boolean;
  metadata: any;
}

const initialServiceForm: ServiceFormData = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  icon_name: 'link',
  icon_color: '#0ea5e9',
  background_color: '#ecfeff',
  url: '',
  category_id: undefined,
  display_order: 0,
  is_active: true,
  is_external: false,
  requires_auth: false,
  metadata: {},
};

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
      <button aria-label="drag-handle" className="cursor-grab p-1 text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const QuickServicesManagement: React.FC = () => {
  const { data: services, isLoading } = useManageServices();
  const { data: categories } = useManageCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QuickService | null>(null);
  const [form, setForm] = useState<ServiceFormData>(initialServiceForm);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (services || [])
      .filter(s => selectedCategory === 'all' || s.category_id === selectedCategory)
      .filter(s => !term || s.title_ar.toLowerCase().includes(term) || (s.title_en || '').toLowerCase().includes(term));
  }, [services, search, selectedCategory]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...initialServiceForm, display_order: (services?.length || 0) + 1 });
    setIsDialogOpen(true);
  };

  const openEdit = (service: QuickService) => {
    setEditing(service);
    setForm({
      title_ar: service.title_ar,
      title_en: service.title_en || '',
      description_ar: service.description_ar || '',
      description_en: service.description_en || '',
      icon_name: service.icon_name,
      icon_color: service.icon_color,
      background_color: service.background_color,
      url: service.url || '',
      category_id: service.category_id,
      display_order: service.display_order,
      is_active: service.is_active,
      is_external: service.is_external,
      requires_auth: service.requires_auth,
      metadata: service.metadata || {},
    });
    setIsDialogOpen(true);
  };

  const saveService = async () => {
    if (!form.title_ar) return;
    if (editing) {
      await updateService.mutateAsync({ id: editing.id, updates: form });
    } else {
      await createService.mutateAsync(form as any);
    }
    setIsDialogOpen(false);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id || active.id === over.id) return;
    const current = filtered;
    const oldIndex = current.findIndex(s => s.id === active.id);
    const newIndex = current.findIndex(s => s.id === over.id);
    const reordered = arrayMove(current, oldIndex, newIndex);
    // Persist new display_order sequentially
    for (let i = 0; i < reordered.length; i++) {
      const s = reordered[i];
      if (s.display_order !== i + 1) {
        await updateService.mutateAsync({ id: s.id, updates: { display_order: i + 1 } });
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الخدمات السريعة</h2>
          <p className="text-muted-foreground">إضافة وتعديل وحذف وترتيب الخدمات السريعة</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> إضافة خدمة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basic">الأساسي</TabsTrigger>
                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                <TabsTrigger value="display">العرض</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>العنوان بالعربية</Label>
                    <Input value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>العنوان بالإنجليزية</Label>
                    <Input value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>التصنيف</Label>
                    <Select value={form.category_id || ''} onValueChange={v => setForm({ ...form, category_id: v || undefined })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">بدون تصنيف</SelectItem>
                        {(categories || []).map((c: ServiceCategory) => (
                          <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الرابط</Label>
                    <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="/services" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>الوصف بالعربية</Label>
                  <Textarea rows={3} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>الوصف بالإنجليزية</Label>
                  <Textarea rows={3} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>لون الأيقونة</Label>
                    <Input type="color" value={form.icon_color} onChange={e => setForm({ ...form, icon_color: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>لون الخلفية</Label>
                    <Input type="color" value={form.background_color} onChange={e => setForm({ ...form, background_color: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الأيقونة</Label>
                    <Input value={form.icon_name} onChange={e => setForm({ ...form, icon_name: e.target.value })} placeholder="link" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="display" className="space-y-4 pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <Label className="block">نشط</Label>
                      <span className="text-xs text-muted-foreground">عرض في الواجهة</span>
                    </div>
                    <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <Label className="block">رابط خارجي</Label>
                      <span className="text-xs text-muted-foreground">فتح في تبويب جديد</span>
                    </div>
                    <Switch checked={form.is_external} onCheckedChange={v => setForm({ ...form, is_external: v })} />
                  </div>
                  <div className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <Label className="block">يتطلب تسجيل دخول</Label>
                      <span className="text-xs text-muted-foreground">المستخدمون المسجلون فقط</span>
                    </div>
                    <Switch checked={form.requires_auth} onCheckedChange={v => setForm({ ...form, requires_auth: v })} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" /> إلغاء
              </Button>
              <Button onClick={saveService} disabled={!form.title_ar || createService.isPending || updateService.isPending}>
                <Save className="h-4 w-4 mr-2" /> {createService.isPending || updateService.isPending ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Input placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48"><SelectValue placeholder="التصنيف" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التصنيفات</SelectItem>
                {(categories || []).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">جاري التحميل...</div>
          ) : (
            <DndContext onDragEnd={onDragEnd}>
              <SortableContext items={(filtered || []).map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {filtered.map(s => (
                    <SortableRow key={s.id} id={s.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{s.title_ar}</div>
                          <div className="text-xs text-muted-foreground">ترتيب: {s.display_order} • {s.is_active ? 'نشط' : 'غير نشط'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteService.mutateAsync(s.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </SortableRow>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickServicesManagement;

