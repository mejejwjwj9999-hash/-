import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, Settings, Clock, AlertCircle, CheckCircle2, 
  Zap, Bell, BellOff, RefreshCw 
} from 'lucide-react';
import { AutoSaveConfig, AutoSaveState } from '@/hooks/useAutoSaveManager';

interface AutoSaveControlsProps {
  state: AutoSaveState;
  config: AutoSaveConfig;
  onConfigUpdate: (config: Partial<AutoSaveConfig>) => void;
  onManualSave: () => Promise<boolean>;
}

export const AutoSaveControls: React.FC<AutoSaveControlsProps> = ({
  state,
  config,
  onConfigUpdate,
  onManualSave
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<AutoSaveConfig>(config);

  const handleSaveSettings = () => {
    onConfigUpdate(tempConfig);
    setIsSettingsOpen(false);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} ثانية`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} دقيقة`;
  };

  const getStatusIcon = () => {
    if (state.isAutoSaving) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (state.failureCount > 0) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (!state.isDirty) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (state.isAutoSaving) return 'جاري الحفظ...';
    if (state.failureCount > 0) return `فشل ${state.failureCount} مرات`;
    if (!state.isDirty) return 'محفوظ';
    return 'غير محفوظ';
  };

  const getStatusBadgeVariant = () => {
    if (state.isAutoSaving) return 'default';
    if (state.failureCount > 0) return 'destructive';
    if (!state.isDirty) return 'secondary';
    return 'outline';
  };

  return (
    <div className="flex items-center gap-2">
      {/* حالة الحفظ */}
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <Badge variant={getStatusBadgeVariant()}>
          {getStatusText()}
        </Badge>
      </div>

      {/* معلومات الوقت */}
      {state.lastSaved && (
        <span className="text-xs text-muted-foreground">
          آخر حفظ: {state.lastSaved.toLocaleTimeString('ar-SA')}
        </span>
      )}

      {/* مفتاح الحفظ التلقائي السريع */}
      <div className="flex items-center gap-2">
        <Switch
          id="auto-save-toggle"
          checked={config.enabled}
          onCheckedChange={(enabled) => onConfigUpdate({ enabled })}
        />
        <Label htmlFor="auto-save-toggle" className="text-xs">
          تلقائي
        </Label>
      </div>

      {/* زر الحفظ اليدوي */}
      <Button
        size="sm"
        variant="outline"
        onClick={onManualSave}
        disabled={!state.isDirty || state.isAutoSaving}
        className="gap-2"
      >
        <Save className="h-3 w-3" />
        حفظ
      </Button>

      {/* إعدادات الحفظ التلقائي */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إعدادات الحفظ التلقائي</DialogTitle>
            <DialogDescription>
              تخصيص سلوك الحفظ التلقائي حسب احتياجاتك
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* التشغيل/الإيقاف */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>تفعيل الحفظ التلقائي</Label>
                <p className="text-xs text-muted-foreground">
                  حفظ المحتوى تلقائياً دون تدخل
                </p>
              </div>
              <Switch
                checked={tempConfig.enabled}
                onCheckedChange={(enabled) => 
                  setTempConfig(prev => ({ ...prev, enabled }))
                }
              />
            </div>

            <Separator />

            {/* فترة الحفظ */}
            <div className="space-y-3">
              <Label>فترة الحفظ التلقائي</Label>
              <div className="space-y-2">
                <Slider
                  value={[tempConfig.interval]}
                  onValueChange={([interval]) => 
                    setTempConfig(prev => ({ ...prev, interval }))
                  }
                  min={10000}
                  max={300000}
                  step={5000}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {formatTime(tempConfig.interval)}
                </p>
              </div>
            </div>

            {/* زمن التأخير */}
            <div className="space-y-3">
              <Label>زمن التأخير بعد الكتابة</Label>
              <div className="space-y-2">
                <Slider
                  value={[tempConfig.debounceTime]}
                  onValueChange={([debounceTime]) => 
                    setTempConfig(prev => ({ ...prev, debounceTime }))
                  }
                  min={1000}
                  max={10000}
                  step={500}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {formatTime(tempConfig.debounceTime)}
                </p>
              </div>
            </div>

            <Separator />

            {/* إعدادات متقدمة */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">إعدادات متقدمة</Label>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">إشعارات الحفظ</Label>
                  <p className="text-xs text-muted-foreground">
                    إظهار تنبيهات عند الحفظ
                  </p>
                </div>
                <Switch
                  checked={tempConfig.showNotifications}
                  onCheckedChange={(showNotifications) => 
                    setTempConfig(prev => ({ ...prev, showNotifications }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">الحفظ عند الكتابة فقط</Label>
                  <p className="text-xs text-muted-foreground">
                    حفظ فقط عند تفاعل المستخدم
                  </p>
                </div>
                <Switch
                  checked={tempConfig.onlyOnUserAction}
                  onCheckedChange={(onlyOnUserAction) => 
                    setTempConfig(prev => ({ ...prev, onlyOnUserAction }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">عدد المحاولات عند الفشل</Label>
                <Slider
                  value={[tempConfig.maxRetries]}
                  onValueChange={([maxRetries]) => 
                    setTempConfig(prev => ({ ...prev, maxRetries }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {tempConfig.maxRetries} محاولات
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveSettings}>
              حفظ الإعدادات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};