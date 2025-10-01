import { useEffect, useRef, useCallback } from 'react';
import { HeroSectionConfig } from '@/types/heroSection';
import { toast } from '@/hooks/use-toast';

interface UseAutoSaveOptions {
  data: HeroSectionConfig | null;
  onSave: (data: HeroSectionConfig) => Promise<void>;
  delay?: number; // milliseconds
  enabled?: boolean;
}

export const useAutoSave = ({ 
  data, 
  onSave, 
  delay = 30000, // 30 seconds default
  enabled = true 
}: UseAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');
  const isFirstRenderRef = useRef(true);

  const saveData = useCallback(async () => {
    if (!data || !enabled) return;

    try {
      await onSave(data);
      lastSavedRef.current = JSON.stringify(data);
      
      toast({
        title: 'تم الحفظ التلقائي',
        description: 'تم حفظ التغييرات تلقائياً',
        variant: 'default'
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      
      toast({
        title: 'فشل الحفظ التلقائي',
        description: 'حدث خطأ أثناء الحفظ التلقائي، يرجى الحفظ يدوياً',
        variant: 'destructive'
      });
    }
  }, [data, onSave, enabled]);

  const scheduleAutoSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!enabled || !data) return;

    timeoutRef.current = setTimeout(() => {
      saveData();
    }, delay);
  }, [delay, enabled, data, saveData]);

  useEffect(() => {
    if (!data || !enabled) return;

    // Skip auto-save on first render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      lastSavedRef.current = JSON.stringify(data);
      return;
    }

    const currentDataString = JSON.stringify(data);
    const hasChanges = currentDataString !== lastSavedRef.current;

    if (hasChanges) {
      scheduleAutoSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, scheduleAutoSave]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveData();
  }, [saveData]);

  // Cancel pending auto-save
  const cancelAutoSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    if (!data) return false;
    return JSON.stringify(data) !== lastSavedRef.current;
  }, [data]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    saveNow,
    cancelAutoSave,
    hasUnsavedChanges: hasUnsavedChanges(),
    isAutoSaveEnabled: enabled
  };
};