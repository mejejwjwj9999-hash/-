import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap, Palette, Target, Eye, Award, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: any;
  onSave: (data: any) => void;
}

const DepartmentFormDialog = ({
  open,
  onOpenChange,
  department,
  onSave,
}: DepartmentFormDialogProps) => {
  const [formData, setFormData] = useState({
    department_key: department?.department_key || '',
    name_ar: department?.name_ar || '',
    name_en: department?.name_en || '',
    description_ar: department?.description_ar || '',
    description_en: department?.description_en || '',
    icon_name: department?.icon_name || 'GraduationCap',
    icon_color: department?.icon_color || '#3B82F6',
    background_color: department?.background_color || '#EFF6FF',
    head_of_department_ar: department?.head_of_department_ar || '',
    head_of_department_en: department?.head_of_department_en || '',
    contact_email: department?.contact_email || '',
    contact_phone: department?.contact_phone || '',
    website_url: department?.website_url || '',
    display_order: department?.display_order || 0,
    is_active: department?.is_active ?? true,
    metadata: department?.metadata || {},
  });

  const [objectives, setObjectives] = useState<Array<{id: string, text_ar: string, text_en: string}>>([]);
  const [statistics, setStatistics] = useState<Array<{id: string, label_ar: string, label_en: string, value: string, icon: string}>>([]);

  useEffect(() => {
    if (department?.metadata) {
      setObjectives(department.metadata.objectives || []);
      setStatistics(department.metadata.statistics || []);
    }
  }, [department]);

  const addObjective = () => {
    setObjectives([...objectives, { id: Date.now().toString(), text_ar: '', text_en: '' }]);
  };

  const removeObjective = (id: string) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  const updateObjective = (id: string, field: string, value: string) => {
    setObjectives(objectives.map(obj => obj.id === id ? { ...obj, [field]: value } : obj));
  };

  const addStatistic = () => {
    setStatistics([...statistics, { id: Date.now().toString(), label_ar: '', label_en: '', value: '', icon: 'Award' }]);
  };

  const removeStatistic = (id: string) => {
    setStatistics(statistics.filter(stat => stat.id !== id));
  };

  const updateStatistic = (id: string, field: string, value: string) => {
    setStatistics(statistics.map(stat => stat.id === id ? { ...stat, [field]: value } : stat));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      metadata: {
        ...formData.metadata,
        vision_ar: formData.metadata.vision_ar || '',
        vision_en: formData.metadata.vision_en || '',
        mission_ar: formData.metadata.mission_ar || '',
        mission_en: formData.metadata.mission_en || '',
        objectives,
        statistics,
      }
    };
    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {department ? 'تعديل القسم الأكاديمي' : 'إضافة قسم أكاديمي جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">معلومات أساسية</TabsTrigger>
              <TabsTrigger value="vision">الرؤية والرسالة</TabsTrigger>
              <TabsTrigger value="objectives">الأهداف</TabsTrigger>
              <TabsTrigger value="statistics">الإحصائيات</TabsTrigger>
            </TabsList>

            {/* المعلومات الأساسية */}
            <TabsContent value="basic" className="space-y-4 mt-4">
          {/* المعلومات الأساسية */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department_key">مفتاح القسم (بالإنجليزية)</Label>
                <Input
                  id="department_key"
                  value={formData.department_key}
                  onChange={(e) => setFormData({ ...formData, department_key: e.target.value })}
                  placeholder="pharmacy"
                  required
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">ترتيب العرض</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_ar">اسم القسم (عربي)</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="كلية الصيدلة"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_en">اسم القسم (إنجليزي)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="College of Pharmacy"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description_ar">الوصف (عربي)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف القسم الأكاديمي..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_en">الوصف (إنجليزي)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Department description..."
                  rows={3}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* معلومات الاتصال */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              معلومات الاتصال
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="head_of_department_ar">رئيس القسم (عربي)</Label>
                <Input
                  id="head_of_department_ar"
                  value={formData.head_of_department_ar}
                  onChange={(e) => setFormData({ ...formData, head_of_department_ar: e.target.value })}
                  placeholder="د. محمد أحمد"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="head_of_department_en">رئيس القسم (إنجليزي)</Label>
                <Input
                  id="head_of_department_en"
                  value={formData.head_of_department_en}
                  onChange={(e) => setFormData({ ...formData, head_of_department_en: e.target.value })}
                  placeholder="Dr. Mohammed Ahmed"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">البريد الإلكتروني</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="pharmacy@university.edu"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">رقم الهاتف</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+966 XX XXX XXXX"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">رابط الموقع</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* الألوان والأيقونة */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">الألوان والأيقونة</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon_color">لون الأيقونة</Label>
                <div className="flex gap-2">
                  <Input
                    id="icon_color"
                    type="color"
                    value={formData.icon_color}
                    onChange={(e) => setFormData({ ...formData, icon_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.icon_color}
                    onChange={(e) => setFormData({ ...formData, icon_color: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background_color">لون الخلفية</Label>
                <div className="flex gap-2">
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon_name">اسم الأيقونة</Label>
                <Input
                  id="icon_name"
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  placeholder="GraduationCap"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
            </TabsContent>

            {/* الرؤية والرسالة */}
            <TabsContent value="vision" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  الرؤية والرسالة
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vision_ar">رؤية القسم (عربي)</Label>
                    <Textarea
                      id="vision_ar"
                      value={formData.metadata.vision_ar || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        metadata: { ...formData.metadata, vision_ar: e.target.value }
                      })}
                      placeholder="أن نكون قسماً رائداً في..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision_en">رؤية القسم (إنجليزي)</Label>
                    <Textarea
                      id="vision_en"
                      value={formData.metadata.vision_en || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        metadata: { ...formData.metadata, vision_en: e.target.value }
                      })}
                      placeholder="To be a leading department in..."
                      rows={3}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mission_ar">رسالة القسم (عربي)</Label>
                    <Textarea
                      id="mission_ar"
                      value={formData.metadata.mission_ar || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        metadata: { ...formData.metadata, mission_ar: e.target.value }
                      })}
                      placeholder="تقديم تعليم متميز في..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mission_en">رسالة القسم (إنجليزي)</Label>
                    <Textarea
                      id="mission_en"
                      value={formData.metadata.mission_en || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        metadata: { ...formData.metadata, mission_en: e.target.value }
                      })}
                      placeholder="To provide excellent education in..."
                      rows={3}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* الأهداف */}
            <TabsContent value="objectives" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    أهداف القسم
                  </h3>
                  <Button type="button" onClick={addObjective} size="sm">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة هدف
                  </Button>
                </div>

                <div className="space-y-3">
                  {objectives.map((objective, index) => (
                    <div key={objective.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">الهدف {index + 1}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeObjective(objective.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>النص (عربي)</Label>
                          <Textarea
                            value={objective.text_ar}
                            onChange={(e) => updateObjective(objective.id, 'text_ar', e.target.value)}
                            placeholder="إعداد كوادر متخصصة..."
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>النص (إنجليزي)</Label>
                          <Textarea
                            value={objective.text_en}
                            onChange={(e) => updateObjective(objective.id, 'text_en', e.target.value)}
                            placeholder="Preparing specialized personnel..."
                            rows={2}
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {objectives.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد أهداف. اضغط "إضافة هدف" لإضافة هدف جديد
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* الإحصائيات */}
            <TabsContent value="statistics" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    إحصائيات القسم
                  </h3>
                  <Button type="button" onClick={addStatistic} size="sm">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة إحصائية
                  </Button>
                </div>

                <div className="space-y-3">
                  {statistics.map((statistic, index) => (
                    <div key={statistic.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">إحصائية {index + 1}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeStatistic(statistic.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>العنوان (عربي)</Label>
                          <Input
                            value={statistic.label_ar}
                            onChange={(e) => updateStatistic(statistic.id, 'label_ar', e.target.value)}
                            placeholder="معدل التوظيف"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>العنوان (إنجليزي)</Label>
                          <Input
                            value={statistic.label_en}
                            onChange={(e) => updateStatistic(statistic.id, 'label_en', e.target.value)}
                            placeholder="Employment Rate"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>القيمة</Label>
                          <Input
                            value={statistic.value}
                            onChange={(e) => updateStatistic(statistic.id, 'value', e.target.value)}
                            placeholder="95%"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الأيقونة</Label>
                          <Input
                            value={statistic.icon}
                            onChange={(e) => updateStatistic(statistic.id, 'icon', e.target.value)}
                            placeholder="Award"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {statistics.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      لا توجد إحصائيات. اضغط "إضافة إحصائية" لإضافة إحصائية جديدة
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {department ? 'حفظ التعديلات' : 'إضافة القسم'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentFormDialog;
