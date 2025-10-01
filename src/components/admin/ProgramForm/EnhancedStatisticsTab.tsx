import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, BarChart3, Edit, Users, GraduationCap } from 'lucide-react';
import { ProgramFormData, ProgramStatistic } from './types';
import { IconSelector } from './IconSelector';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface StatisticsTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

const createEmptyStatistic = (): ProgramStatistic => ({
  id: Date.now().toString(),
  label_ar: '',
  label_en: '',
  value: '',
  icon_name: 'bar-chart-3',
  description_ar: '',
  description_en: '',
  unit_ar: '',
  unit_en: '',
  order: 0
});

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ formData, setFormData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<ProgramStatistic | null>(null);
  const [statisticData, setStatisticData] = useState<ProgramStatistic>(createEmptyStatistic());

  const handleAddStatistic = () => {
    setEditingStatistic(null);
    setStatisticData(createEmptyStatistic());
    setIsDialogOpen(true);
  };

  const handleEditStatistic = (statistic: ProgramStatistic) => {
    setEditingStatistic(statistic);
    setStatisticData({ ...statistic });
    setIsDialogOpen(true);
  };

  const handleSaveStatistic = () => {
    if (!statisticData.label_ar || !statisticData.value) return;

    setFormData(prev => {
      const newStatistics = [...prev.program_statistics];
      
      if (editingStatistic) {
        const index = newStatistics.findIndex(s => s.id === editingStatistic.id);
        if (index !== -1) {
          newStatistics[index] = statisticData;
        }
      } else {
        statisticData.order = newStatistics.length;
        newStatistics.push(statisticData);
      }

      return { ...prev, program_statistics: newStatistics };
    });

    setIsDialogOpen(false);
  };

  const handleDeleteStatistic = (statisticId: string) => {
    setFormData(prev => ({
      ...prev,
      program_statistics: prev.program_statistics.filter(s => s.id !== statisticId)
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(formData.program_statistics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setFormData(prev => ({ ...prev, program_statistics: updatedItems }));
  };

  // الإحصائيات الافتراضية المقترحة
  const defaultStatistics = [
    { label_ar: 'عدد الطلاب الحاليين', label_en: 'Current Students', icon_name: 'users', unit_ar: 'طالب' },
    { label_ar: 'عدد الخريجين', label_en: 'Graduates', icon_name: 'graduation-cap', unit_ar: 'خريج' },
    { label_ar: 'سنوات التأسيس', label_en: 'Years Established', icon_name: 'calendar', unit_ar: 'سنة' },
    { label_ar: 'معدل التوظف', label_en: 'Employment Rate', icon_name: 'briefcase', unit_ar: '%' },
    { label_ar: 'أعضاء هيئة التدريس', label_en: 'Faculty Members', icon_name: 'users', unit_ar: 'عضو' },
    { label_ar: 'الساعات المعتمدة', label_en: 'Credit Hours', icon_name: 'clock', unit_ar: 'ساعة' }
  ];

  const addDefaultStatistic = (defaultStat: any) => {
    const newStat = {
      ...createEmptyStatistic(),
      label_ar: defaultStat.label_ar,
      label_en: defaultStat.label_en,
      icon_name: defaultStat.icon_name,
      unit_ar: defaultStat.unit_ar,
      order: formData.program_statistics.length
    };

    setFormData(prev => ({
      ...prev,
      program_statistics: [...prev.program_statistics, newStat]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            إحصائيات البرنامج
          </h3>
          <p className="text-sm text-muted-foreground">إدارة الإحصائيات والأرقام المهمة للبرنامج</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddStatistic} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              إضافة إحصائية
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStatistic ? 'تحرير الإحصائية' : 'إضافة إحصائية جديدة'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التسمية بالعربية <span className="text-destructive">*</span></Label>
                  <Input
                    value={statisticData.label_ar}
                    onChange={(e) => setStatisticData(prev => ({ ...prev, label_ar: e.target.value }))}
                    placeholder="عدد الطلاب الحاليين"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>التسمية بالإنجليزية</Label>
                  <Input
                    value={statisticData.label_en}
                    onChange={(e) => setStatisticData(prev => ({ ...prev, label_en: e.target.value }))}
                    placeholder="Current Students"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>القيمة <span className="text-destructive">*</span></Label>
                  <Input
                    value={statisticData.value}
                    onChange={(e) => setStatisticData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="150"
                  />
                </div>
                
                <IconSelector
                  selectedIcon={statisticData.icon_name || 'bar-chart-3'}
                  onIconSelect={(icon) => setStatisticData(prev => ({ ...prev, icon_name: icon }))}
                  label="أيقونة الإحصائية"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الوحدة بالعربية</Label>
                  <Input
                    value={statisticData.unit_ar}
                    onChange={(e) => setStatisticData(prev => ({ ...prev, unit_ar: e.target.value }))}
                    placeholder="طالب"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>الوحدة بالإنجليزية</Label>
                  <Input
                    value={statisticData.unit_en}
                    onChange={(e) => setStatisticData(prev => ({ ...prev, unit_en: e.target.value }))}
                    placeholder="students"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الوصف بالعربية</Label>
                <Input
                  value={statisticData.description_ar}
                  onChange={(e) => setStatisticData(prev => ({ ...prev, description_ar: e.target.value }))}
                  placeholder="وصف مختصر للإحصائية"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف بالإنجليزية</Label>
                <Input
                  value={statisticData.description_en}
                  onChange={(e) => setStatisticData(prev => ({ ...prev, description_en: e.target.value }))}
                  placeholder="Brief description of the statistic"
                  dir="ltr"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveStatistic}>
                  {editingStatistic ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* الإحصائيات المقترحة */}
      {formData.program_statistics.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">إحصائيات مقترحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {defaultStatistics.map((stat, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  onClick={() => addDefaultStatistic(stat)}
                >
                  <div className="text-right">
                    <p className="font-medium">{stat.label_ar}</p>
                    <p className="text-xs text-muted-foreground">{stat.label_en}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* قائمة الإحصائيات */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="statistics">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formData.program_statistics.map((statistic, index) => (
                <Draggable key={statistic.id || index} draggableId={statistic.id || index.toString()} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {(() => {
                              const iconOptions = {
                                'users': Users,
                                'graduation-cap': GraduationCap,
                                'bar-chart-3': BarChart3
                              };
                              const IconComponent = iconOptions[statistic.icon_name as keyof typeof iconOptions] || BarChart3;
                              return <IconComponent className="w-5 h-5 text-primary" />;
                            })()}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStatistic(statistic)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف الإحصائية</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف "{statistic.label_ar}"؟
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteStatistic(statistic.id || '')}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary mb-1">
                            {statistic.value}
                            {statistic.unit_ar && (
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                {statistic.unit_ar}
                              </span>
                            )}
                          </p>
                          <p className="font-medium">{statistic.label_ar}</p>
                          {statistic.label_en && (
                            <p className="text-xs text-muted-foreground">{statistic.label_en}</p>
                          )}
                          {statistic.description_ar && (
                            <p className="text-xs text-muted-foreground mt-1">{statistic.description_ar}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {formData.program_statistics.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              لم يتم إضافة أي إحصائيات بعد.<br />
              اضغط على "إضافة إحصائية" لبدء الإضافة.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};