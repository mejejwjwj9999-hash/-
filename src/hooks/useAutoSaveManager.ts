import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  debounceTime: number; // in milliseconds
  maxRetries: number;
  showNotifications: boolean;
  onlyOnUserAction: boolean;
}

export interface AutoSaveState {
  isAutoSaving: boolean;
  lastSaved: Date | null;
  isDirty: boolean;
  failureCount: number;
}

interface UseAutoSaveManagerProps {
  config?: Partial<AutoSaveConfig>;
  onSave: (content: string, metadata?: any) => Promise<void>;
  onError?: (error: Error) => void;
}

const DEFAULT_CONFIG: AutoSaveConfig = {
  enabled: true,
  interval: 30000, // 30 seconds
  debounceTime: 2000, // 2 seconds
  maxRetries: 3,
  showNotifications: true,
  onlyOnUserAction: true
};

export const useAutoSaveManager = ({
  config = {},
  onSave,
  onError
}: UseAutoSaveManagerProps) => {
  const [autoSaveConfig, setAutoSaveConfig] = useState<AutoSaveConfig>({
    ...DEFAULT_CONFIG,
    ...config
  });

  const [state, setState] = useState<AutoSaveState>({
    isAutoSaving: false,
    lastSaved: null,
    isDirty: false,
    failureCount: 0
  });

  const [currentContent, setCurrentContent] = useState<string>('');
  const [currentMetadata, setCurrentMetadata] = useState<any>({});
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserActionRef = useRef<Date>(new Date());
  const isUserActionRef = useRef<boolean>(false);

  // تحديث المحتوى مع معالجة ذكية للحفظ التلقائي
  const updateContent = useCallback((content: string, metadata: any = {}, isUserAction: boolean = true) => {
    setCurrentContent(content);
    setCurrentMetadata(metadata);
    setState(prev => ({ ...prev, isDirty: true }));

    if (isUserAction) {
      lastUserActionRef.current = new Date();
      isUserActionRef.current = true;
    }

    if (!autoSaveConfig.enabled) return;

    // إلغاء المؤقتات السابقة
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (intervalTimeoutRef.current) {
      clearTimeout(intervalTimeoutRef.current);
    }

    // تشغيل debounce للحفظ السريع
    debounceTimeoutRef.current = setTimeout(() => {
      if (autoSaveConfig.onlyOnUserAction && !isUserActionRef.current) return;
      
      handleAutoSave();
      isUserActionRef.current = false;
    }, autoSaveConfig.debounceTime);

    // تشغيل الحفظ الدوري
    intervalTimeoutRef.current = setTimeout(() => {
      if (state.isDirty) {
        handleAutoSave();
      }
    }, autoSaveConfig.interval);
  }, [autoSaveConfig, state.isDirty]);

  // تنفيذ الحفظ التلقائي
  const handleAutoSave = useCallback(async () => {
    if (!state.isDirty || state.isAutoSaving || !autoSaveConfig.enabled) return;

    setState(prev => ({ ...prev, isAutoSaving: true }));

    try {
      await onSave(currentContent, currentMetadata);
      
      setState(prev => ({
        ...prev,
        isAutoSaving: false,
        isDirty: false,
        lastSaved: new Date(),
        failureCount: 0
      }));

      if (autoSaveConfig.showNotifications) {
        toast({
          title: 'تم الحفظ التلقائي',
          description: 'تم حفظ التغييرات تلقائياً',
          duration: 2000
        });
      }
    } catch (error) {
      const newFailureCount = state.failureCount + 1;
      
      setState(prev => ({
        ...prev,
        isAutoSaving: false,
        failureCount: newFailureCount
      }));

      if (newFailureCount >= autoSaveConfig.maxRetries) {
        setAutoSaveConfig(prev => ({ ...prev, enabled: false }));
        
        if (autoSaveConfig.showNotifications) {
          toast({
            title: 'تم تعطيل الحفظ التلقائي',
            description: 'فشل الحفظ التلقائي عدة مرات. يرجى الحفظ يدوياً.',
            variant: 'destructive',
            duration: 5000
          });
        }
      } else if (autoSaveConfig.showNotifications) {
        toast({
          title: 'فشل الحفظ التلقائي',
          description: `محاولة ${newFailureCount} من ${autoSaveConfig.maxRetries}`,
          variant: 'destructive'
        });
      }

      onError?.(error as Error);
    }
  }, [
    state.isDirty,
    state.isAutoSaving,
    state.failureCount,
    autoSaveConfig,
    currentContent,
    currentMetadata,
    onSave,
    onError
  ]);

  // الحفظ اليدوي
  const manualSave = useCallback(async () => {
    if (state.isAutoSaving) return false;

    setState(prev => ({ ...prev, isAutoSaving: true }));

    try {
      await onSave(currentContent, currentMetadata);
      
      setState(prev => ({
        ...prev,
        isAutoSaving: false,
        isDirty: false,
        lastSaved: new Date(),
        failureCount: 0
      }));

      // إعادة تشغيل الحفظ التلقائي إذا تم تعطيله بسبب الأخطاء
      if (!autoSaveConfig.enabled && config.enabled !== false) {
        setAutoSaveConfig(prev => ({ ...prev, enabled: true }));
      }

      if (autoSaveConfig.showNotifications) {
        toast({
          title: 'تم الحفظ',
          description: 'تم حفظ المحتوى بنجاح'
        });
      }
      
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isAutoSaving: false }));
      
      if (autoSaveConfig.showNotifications) {
        toast({
          title: 'فشل الحفظ',
          description: 'حدث خطأ أثناء حفظ المحتوى',
          variant: 'destructive'
        });
      }
      
      onError?.(error as Error);
      return false;
    }
  }, [
    state.isAutoSaving,
    currentContent,
    currentMetadata,
    autoSaveConfig,
    config.enabled,
    onSave,
    onError
  ]);

  // تحديث إعدادات الحفظ التلقائي
  const updateConfig = useCallback((newConfig: Partial<AutoSaveConfig>) => {
    setAutoSaveConfig(prev => ({ ...prev, ...newConfig }));
    
    // إعادة تعيين حالة الفشل عند إعادة التشغيل
    if (newConfig.enabled && !autoSaveConfig.enabled) {
      setState(prev => ({ ...prev, failureCount: 0 }));
    }
  }, [autoSaveConfig.enabled]);

  // تنظيف المؤقتات عند إلغاء التحميل
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (intervalTimeoutRef.current) {
        clearTimeout(intervalTimeoutRef.current);
      }
    };
  }, []);

  return {
    // الحالة
    state,
    config: autoSaveConfig,
    
    // الوظائف
    updateContent,
    manualSave,
    updateConfig,
    
    // حالات مفيدة
    canSave: state.isDirty && !state.isAutoSaving,
    hasUnsavedChanges: state.isDirty,
    timeSinceLastSave: state.lastSaved ? Date.now() - state.lastSaved.getTime() : null
  };
};