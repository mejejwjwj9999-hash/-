import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Minus, 
  BarChart3, 
  Users, 
  GraduationCap, 
  Award,
  Building,
  BookOpen,
  Calendar,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Statistic {
  id: string;
  key: string;
  valueAr: string;
  valueEn: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  color: string;
}

interface StatisticsEditorProps {
  statistics: Statistic[];
  onChange: (statistics: Statistic[]) => void;
}

const iconOptions = [
  { value: 'users', label: 'الطلاب', icon: Users },
  { value: 'graduation-cap', label: 'خريجين', icon: GraduationCap },
  { value: 'award', label: 'جوائز', icon: Award },
  { value: 'building', label: 'مباني', icon: Building },
  { value: 'book-open', label: 'برامج', icon: BookOpen },
  { value: 'calendar', label: 'سنوات', icon: Calendar },
  { value: 'trophy', label: 'إنجازات', icon: Trophy },
  { value: 'bar-chart-3', label: 'إحصائيات', icon: BarChart3 }
];

const colorOptions = [
  { value: 'primary', label: 'أساسي', class: 'bg-primary text-primary-foreground' },
  { value: 'secondary', label: 'ثانوي', class: 'bg-secondary text-secondary-foreground' },
  { value: 'accent', label: 'مميز', class: 'bg-accent text-accent-foreground' },
  { value: 'blue', label: 'أزرق', class: 'bg-blue-600 text-white' },
  { value: 'green', label: 'أخضر', class: 'bg-green-600 text-white' },
  { value: 'purple', label: 'بنفسجي', class: 'bg-purple-600 text-white' },
  { value: 'orange', label: 'برتقالي', class: 'bg-orange-600 text-white' },
  { value: 'red', label: 'أحمر', class: 'bg-red-600 text-white' }
];

export const StatisticsEditor: React.FC<StatisticsEditorProps> = ({ 
  statistics, 
  onChange 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const addStatistic = () => {
    const newStatistic: Statistic = {
      id: `stat-${Date.now()}`,
      key: `stat_${statistics.length + 1}`,
      valueAr: '',
      valueEn: '',
      labelAr: '',
      labelEn: '',
      icon: 'users',
      color: 'primary'
    };
    onChange([...statistics, newStatistic]);
    setExpandedItems(prev => new Set([...prev, newStatistic.id]));
  };

  const removeStatistic = (id: string) => {
    onChange(statistics.filter(stat => stat.id !== id));
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const updateStatistic = (id: string, field: keyof Statistic, value: string) => {
    onChange(statistics.map(stat => 
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption?.icon || Users;
  };

  const getColorClass = (colorName: string) => {
    const colorOption = colorOptions.find(opt => opt.value === colorName);
    return colorOption?.class || 'bg-primary text-primary-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          إدارة الإحصائيات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            عرض الإحصائيات الهامة للكلية مثل عدد الطلاب والخريجين والبرامج
          </p>
          <Button onClick={addStatistic} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة إحصائية
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {statistics.map((statistic, index) => {
              const IconComponent = getIconComponent(statistic.icon);
              const isExpanded = expandedItems.has(statistic.id);

              return (
                <motion.div
                  key={statistic.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleExpanded(statistic.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getColorClass(statistic.color)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {statistic.labelAr || `إحصائية ${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {statistic.valueAr || 'لم يتم تحديد القيمة'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{statistic.key}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStatistic(statistic.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 space-y-4 border-t"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${statistic.id}-key`}>مفتاح الإحصائية</Label>
                          <Input
                            id={`${statistic.id}-key`}
                            value={statistic.key}
                            onChange={(e) => updateStatistic(statistic.id, 'key', e.target.value)}
                            placeholder="مثال: student_count"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`${statistic.id}-icon`}>الأيقونة</Label>
                          <select
                            id={`${statistic.id}-icon`}
                            value={statistic.icon}
                            onChange={(e) => updateStatistic(statistic.id, 'icon', e.target.value)}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            {iconOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${statistic.id}-value-ar`}>القيمة (عربي)</Label>
                          <Input
                            id={`${statistic.id}-value-ar`}
                            value={statistic.valueAr}
                            onChange={(e) => updateStatistic(statistic.id, 'valueAr', e.target.value)}
                            placeholder="مثال: 1500+"
                            className="text-right"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`${statistic.id}-value-en`}>القيمة (إنجليزي)</Label>
                          <Input
                            id={`${statistic.id}-value-en`}
                            value={statistic.valueEn}
                            onChange={(e) => updateStatistic(statistic.id, 'valueEn', e.target.value)}
                            placeholder="Example: 1500+"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${statistic.id}-label-ar`}>التسمية (عربي)</Label>
                          <Input
                            id={`${statistic.id}-label-ar`}
                            value={statistic.labelAr}
                            onChange={(e) => updateStatistic(statistic.id, 'labelAr', e.target.value)}
                            placeholder="مثال: طالب وطالبة"
                            className="text-right"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`${statistic.id}-label-en`}>التسمية (إنجليزي)</Label>
                          <Input
                            id={`${statistic.id}-label-en`}
                            value={statistic.labelEn}
                            onChange={(e) => updateStatistic(statistic.id, 'labelEn', e.target.value)}
                            placeholder="Example: Students"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>اللون</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {colorOptions.map(color => (
                            <button
                              key={color.value}
                              onClick={() => updateStatistic(statistic.id, 'color', color.value)}
                              className={`px-3 py-1 rounded-md text-xs transition-all ${
                                statistic.color === color.value 
                                  ? `${color.class} ring-2 ring-offset-2 ring-primary` 
                                  : `${color.class} opacity-70 hover:opacity-100`
                              }`}
                            >
                              {color.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {statistics.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">لا توجد إحصائيات محددة</p>
            <Button onClick={addStatistic} variant="outline">
              <Plus className="w-4 h-4 ml-2" />
              إضافة أول إحصائية
            </Button>
          </div>
        )}

        {/* Preview */}
        {statistics.length > 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-3 text-center">معاينة الإحصائيات</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statistics.map(statistic => {
                const IconComponent = getIconComponent(statistic.icon);
                return (
                  <div key={statistic.id} className="text-center">
                    <div className={`p-3 rounded-xl ${getColorClass(statistic.color)} mx-auto w-fit mb-2`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {statistic.valueAr || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {statistic.labelAr || 'تسمية غير محددة'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};