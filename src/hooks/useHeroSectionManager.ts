import React, { useState, useCallback, useEffect } from 'react';
import { HeroElement, HeroSectionConfig, HeroTemplate } from '@/types/heroSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useHeroSectionManager = (initialConfig?: HeroSectionConfig) => {
  const [config, setConfig] = useState<HeroSectionConfig | null>(initialConfig || null);
  const [elements, setElements] = useState<HeroElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (config) {
      setElements(config.elements);
    }
  }, [config]);

  const createElement = useCallback(<T extends HeroElement>(
    type: T['type'],
    baseData: Partial<T>
  ): T => {
    const baseElement = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pageKey: 'homepage',
      elementKey: `${type}_${Date.now()}`,
      order: elements.length,
      visible: true,
      ...baseData
    };

    return baseElement as T;
  }, [elements.length]);

  const addElement = useCallback((element: HeroElement) => {
    setElements(prev => [...prev, element]);
    setHasUnsavedChanges(true);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<HeroElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } as HeroElement : el
    ));
    setHasUnsavedChanges(true);
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    setHasUnsavedChanges(true);
  }, [selectedElement]);

  const reorderElements = useCallback((startIndex: number, endIndex: number) => {
    setElements(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update order property
      return result.map((el, index) => ({ ...el, order: index }));
    });
    setHasUnsavedChanges(true);
  }, []);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const duplicate = {
        ...element,
        id: `${element.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        elementKey: `${element.type}_${Date.now()}`,
        order: element.order + 1
      };
      
      setElements(prev => [
        ...prev.slice(0, element.order + 1),
        duplicate,
        ...prev.slice(element.order + 1).map(el => ({ ...el, order: el.order + 1 }))
      ]);
      setHasUnsavedChanges(true);
    }
  }, [elements]);

  const saveConfig = useCallback(async () => {
    if (!config) return;

    setIsLoading(true);
    try {
      const updatedConfig = {
        ...config,
        elements,
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage for now
      localStorage.setItem(`hero_section_${config.id}`, JSON.stringify(updatedConfig));

      setConfig(updatedConfig);
      setHasUnsavedChanges(false);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ تغييرات قسم البطل",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, elements, toast]);

  const loadTemplate = useCallback((template: HeroTemplate) => {
    setConfig(template.config);
    setElements(template.config.elements);
    setHasUnsavedChanges(true);
    toast({
      title: "تم تحميل القالب",
      description: `تم تحميل قالب ${template.name.ar}`,
    });
  }, [toast]);

  const exportConfig = useCallback(() => {
    if (!config) return;

    const exportData = {
      ...config,
      elements,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hero-section-${config.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "تم التصدير",
      description: "تم تصدير إعدادات القسم بنجاح",
    });
  }, [config, elements, toast]);

  const importConfig = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(importedConfig);
        setElements(importedConfig.elements);
        setHasUnsavedChanges(true);
        toast({
          title: "تم الاستيراد",
          description: "تم استيراد إعدادات القسم بنجاح",
        });
      } catch (error) {
        toast({
          title: "خطأ في الاستيراد",
          description: "ملف غير صالح",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const resetToDefault = useCallback(() => {
    const defaultConfig: HeroSectionConfig = {
      id: 'default',
      name: 'افتراضي',
      elements: [],
      settings: {
        theme: 'auto',
        language: 'ar',
        responsive: true,
        animations: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConfig(defaultConfig);
    setElements([]);
    setHasUnsavedChanges(true);
  }, []);

  return {
    config,
    elements,
    selectedElement,
    isLoading,
    hasUnsavedChanges,
    setSelectedElement,
    createElement,
    addElement,
    updateElement,
    deleteElement,
    reorderElements,
    duplicateElement,
    saveConfig,
    loadTemplate,
    exportConfig,
    importConfig,
    resetToDefault
  };
};