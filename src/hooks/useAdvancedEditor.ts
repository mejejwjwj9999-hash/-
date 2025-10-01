import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useContentRevisions, useRestoreRevision } from './useContentHistory';
import DOMPurify from 'dompurify';

export interface EditorState {
  content: string;
  metadata: any;
  isDirty: boolean;
  isTyping: boolean;
  wordCount: number;
  characterCount: number;
  readingTime: number;
}

export interface EditorHistory {
  id: string;
  content: string;
  timestamp: Date;
  action: string;
  userId?: string;
  changeType: 'major' | 'minor' | 'auto-save';
}

export interface AIAssistantState {
  isActive: boolean;
  currentSuggestion: string | null;
  isProcessing: boolean;
}

export interface UseAdvancedEditorProps {
  elementId?: string;
  pageKey?: string;
  elementKey?: string;
  initialContent?: string;
  initialMetadata?: any;
  language?: 'ar' | 'en';
  autoSave?: boolean;
  autoSaveInterval?: number;
  onSave?: (content: string, metadata: any) => Promise<void>;
  enableAI?: boolean;
  enableCollaboration?: boolean;
}

export const useAdvancedEditor = ({
  elementId,
  pageKey,
  elementKey,
  initialContent = '',
  initialMetadata = {},
  language = 'ar',
  autoSave = true,
  autoSaveInterval = 30000,
  onSave,
  enableAI = true,
  enableCollaboration = false
}: UseAdvancedEditorProps) => {
  const [state, setState] = useState<EditorState>({
    content: initialContent,
    metadata: initialMetadata,
    isDirty: false,
    isTyping: false,
    wordCount: 0,
    characterCount: 0,
    readingTime: 0
  });

  const [history, setHistory] = useState<EditorHistory[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [aiState, setAIState] = useState<AIAssistantState>({
    isActive: false,
    currentSuggestion: null,
    isProcessing: false
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [lockInfo, setLockInfo] = useState<any>(null);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Map<string, any>>(new Map());

  // استخدام hooks المراجعات
  const { data: revisions } = useContentRevisions(elementId);
  const restoreRevisionMutation = useRestoreRevision();

  // حساب إحصائيات المحتوى
  const calculateStats = useCallback((content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = plainText.length;
    const readingTime = Math.ceil(words.length / 200); // متوسط سرعة القراءة 200 كلمة/دقيقة

    return {
      wordCount: words.length,
      characterCount: characters,
      readingTime: readingTime
    };
  }, []);

  // إضافة للتاريخ
  const addToHistory = useCallback((content: string, action: string, changeType: 'major' | 'minor' | 'auto-save' = 'minor') => {
    const historyItem: EditorHistory = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      action,
      changeType,
      userId: 'current-user' // TODO: get from auth
    };

    setHistory(prev => {
      const newHistory = [...prev.slice(0, currentHistoryIndex + 1), historyItem];
      return newHistory.slice(-100); // احتفظ بآخر 100 تغيير
    });
    setCurrentHistoryIndex(prev => prev + 1);
  }, [currentHistoryIndex]);

  // تحديث المحتوى
  const updateContent = useCallback((newContent: string, newMetadata?: any) => {
    const cleanContent = DOMPurify.sanitize(newContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'span', 'div', 'table', 'thead',
        'tbody', 'tr', 'th', 'td', 'pre', 'code', 'sub', 'sup', 'iframe', 'video',
        'audio', 'source'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel',
        'colspan', 'rowspan', 'width', 'height', 'controls', 'autoplay', 'muted',
        'data-*', 'id'
      ]
    });

    const stats = calculateStats(cleanContent);
    const updatedMetadata = { ...state.metadata, ...newMetadata };

    setState(prev => ({
      ...prev,
      content: cleanContent,
      metadata: updatedMetadata,
      isDirty: true,
      isTyping: true,
      ...stats
    }));

    // إضافة للتاريخ إذا كان التغيير كبيراً
    if (Math.abs(cleanContent.length - state.content.length) > 50) {
      addToHistory(cleanContent, 'major_edit', 'major');
    } else {
      addToHistory(cleanContent, 'edit', 'minor');
    }

    // إعادة تعيين مؤقت الكتابة
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isTyping: false }));
    }, 2000);

    // تشغيل الحفظ التلقائي
    if (autoSave && onSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, autoSaveInterval);
    }
  }, [state.content, state.metadata, calculateStats, addToHistory, autoSave, onSave, autoSaveInterval]);

  // الحفظ التلقائي
  const handleAutoSave = useCallback(async () => {
    if (!state.isDirty || !onSave) return;

    setIsAutoSaving(true);
    try {
      await onSave(state.content, state.metadata);
      setState(prev => ({ ...prev, isDirty: false }));
      setLastSaved(new Date());
      addToHistory(state.content, 'auto_save', 'auto-save');
      
      toast({
        title: 'تم الحفظ التلقائي',
        description: 'تم حفظ التغييرات تلقائياً',
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: 'فشل الحفظ التلقائي',
        description: 'حدث خطأ أثناء الحفظ التلقائي',
        variant: 'destructive'
      });
    } finally {
      setIsAutoSaving(false);
    }
  }, [state.content, state.metadata, state.isDirty, onSave, addToHistory]);

  // الحفظ اليدوي
  const save = useCallback(async () => {
    if (!onSave) return false;

    try {
      await onSave(state.content, state.metadata);
      setState(prev => ({ ...prev, isDirty: false }));
      setLastSaved(new Date());
      addToHistory(state.content, 'manual_save', 'major');
      
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ المحتوى بنجاح'
      });
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: 'فشل الحفظ',
        description: 'حدث خطأ أثناء حفظ المحتوى',
        variant: 'destructive'
      });
      return false;
    }
  }, [state.content, state.metadata, onSave, addToHistory]);

  // التراجع
  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevItem = history[prevIndex];
      setState(prev => ({
        ...prev,
        content: prevItem.content,
        isDirty: true,
        ...calculateStats(prevItem.content)
      }));
      setCurrentHistoryIndex(prevIndex);
      return true;
    }
    return false;
  }, [currentHistoryIndex, history, calculateStats]);

  // الإعادة
  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextItem = history[nextIndex];
      setState(prev => ({
        ...prev,
        content: nextItem.content,
        isDirty: true,
        ...calculateStats(nextItem.content)
      }));
      setCurrentHistoryIndex(nextIndex);
      return true;
    }
    return false;
  }, [currentHistoryIndex, history, calculateStats]);

  // استعادة من المراجعة
  const restoreFromRevision = useCallback(async (revisionId: string) => {
    if (!elementId) return false;

    try {
      await restoreRevisionMutation.mutateAsync({
        elementId,
        revisionId
      });
      return true;
    } catch (error) {
      console.error('Restore from revision failed:', error);
      return false;
    }
  }, [elementId, restoreRevisionMutation]);

  // وظائف الذكاء الاصطناعي
  const generateAISuggestion = useCallback(async (prompt: string) => {
    if (!enableAI) return null;

    setAIState(prev => ({ ...prev, isProcessing: true }));
    try {
      // TODO: تنفيذ استدعاء API للذكاء الاصطناعي
      const suggestion = `اقتراح ذكي للمحتوى: ${prompt}`;
      setAIState(prev => ({
        ...prev,
        currentSuggestion: suggestion,
        isProcessing: false
      }));
      return suggestion;
    } catch (error) {
      console.error('AI suggestion failed:', error);
      setAIState(prev => ({ ...prev, isProcessing: false }));
      return null;
    }
  }, [enableAI]);

  const applyAISuggestion = useCallback(() => {
    if (aiState.currentSuggestion) {
      updateContent(aiState.currentSuggestion);
      setAIState(prev => ({ ...prev, currentSuggestion: null }));
      toast({
        title: 'تم تطبيق الاقتراح',
        description: 'تم تطبيق اقتراح الذكاء الاصطناعي'
      });
    }
  }, [aiState.currentSuggestion, updateContent]);

  // إدارة الكاش المحلي
  const saveToCache = useCallback(() => {
    if (pageKey && elementKey) {
      const cacheKey = `${pageKey}-${elementKey}`;
      cacheRef.current.set(cacheKey, {
        content: state.content,
        metadata: state.metadata,
        timestamp: new Date()
      });
      localStorage.setItem(`editor-cache-${cacheKey}`, JSON.stringify({
        content: state.content,
        metadata: state.metadata,
        timestamp: new Date().toISOString()
      }));
    }
  }, [pageKey, elementKey, state.content, state.metadata]);

  const loadFromCache = useCallback(() => {
    if (pageKey && elementKey) {
      const cacheKey = `${pageKey}-${elementKey}`;
      const cached = localStorage.getItem(`editor-cache-${cacheKey}`);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          const cacheTime = new Date(data.timestamp);
          const now = new Date();
          // استخدم الكاش إذا كان عمره أقل من ساعة
          if (now.getTime() - cacheTime.getTime() < 3600000) {
            return data;
          }
        } catch (error) {
          console.error('Cache load failed:', error);
        }
      }
    }
    return null;
  }, [pageKey, elementKey]);

  // تنظيف عند إلغاء التحميل
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // حفظ في الكاش عند الخروج
      saveToCache();
    };
  }, [saveToCache]);

  // تحميل من الكاش عند بدء التشغيل
  useEffect(() => {
    const cached = loadFromCache();
    if (cached && !initialContent) {
      setState(prev => ({
        ...prev,
        content: cached.content,
        metadata: cached.metadata,
        isDirty: true,
        ...calculateStats(cached.content)
      }));
    }
  }, [loadFromCache, initialContent, calculateStats]);

  return {
    // الحالة
    ...state,
    history,
    currentHistoryIndex,
    aiState,
    lastSaved,
    isAutoSaving,
    collaborators,
    lockInfo,
    revisions,

    // الوظائف
    updateContent,
    save,
    undo,
    redo,
    restoreFromRevision,
    generateAISuggestion,
    applyAISuggestion,
    saveToCache,
    loadFromCache,

    // معلومات الحالة
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < history.length - 1,
    hasRevisions: revisions && revisions.length > 0,
    isProcessing: aiState.isProcessing || isAutoSaving || restoreRevisionMutation.isPending
  };
};