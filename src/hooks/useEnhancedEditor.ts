import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface EditorHistory {
  id: string;
  content: string;
  timestamp: Date;
  action: string;
}

export interface UseEnhancedEditorProps {
  initialValue?: string;
  autoSave?: boolean;
  onAutoSave?: (content: string) => void;
  language?: 'ar' | 'en';
}

export const useEnhancedEditor = ({
  initialValue = '',
  autoSave = true,
  onAutoSave,
  language = 'ar'
}: UseEnhancedEditorProps) => {
  const [value, setValue] = useState(initialValue);
  const [history, setHistory] = useState<EditorHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isModified, setIsModified] = useState(false);

  // Add to history
  const addToHistory = useCallback((content: string, action: string) => {
    const newHistoryItem: EditorHistory = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      action
    };
    
    setHistory(prev => {
      const newHistory = [...prev.slice(0, currentHistoryIndex + 1), newHistoryItem];
      return newHistory.slice(-50); // Keep last 50 changes
    });
    setCurrentHistoryIndex(prev => prev + 1);
  }, [currentHistoryIndex]);

  // Handle content change
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    setIsModified(true);
    
    if (newValue !== value) {
      addToHistory(newValue, 'edit');
    }
  }, [value, addToHistory]);

  // Undo functionality
  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevContent = history[prevIndex].content;
      setValue(prevContent);
      setCurrentHistoryIndex(prevIndex);
      return true;
    }
    return false;
  }, [currentHistoryIndex, history]);

  // Redo functionality  
  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextContent = history[nextIndex].content;
      setValue(nextContent);
      setCurrentHistoryIndex(nextIndex);
      return true;
    }
    return false;
  }, [currentHistoryIndex, history]);

  // Manual save
  const save = useCallback(() => {
    if (onAutoSave && isModified) {
      onAutoSave(value);
      setLastSaved(new Date());
      setIsModified(false);
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ المستند بنجاح'
      });
    }
  }, [value, isModified, onAutoSave]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !isModified || !onAutoSave) return;
    
    const autoSaveTimer = setTimeout(() => {
      onAutoSave(value);
      setLastSaved(new Date());
      setIsModified(false);
      toast({
        title: 'تم الحفظ التلقائي',
        description: 'تم حفظ التغييرات تلقائياً',
      });
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [value, autoSave, isModified, onAutoSave]);

  return {
    value,
    setValue,
    handleChange,
    history,
    undo,
    redo,
    save,
    lastSaved,
    isModified,
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < history.length - 1
  };
};