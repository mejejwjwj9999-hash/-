import { useState, useEffect } from 'react';
import { HeroSectionConfig } from '@/types/heroSection';

export interface Template {
  id: string;
  name: string;
  description: string;
  config: HeroSectionConfig;
  preview?: string;
  createdAt: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'modern-minimal',
    name: 'تصميم حديث مبسط',
    description: 'تصميم نظيف ومبسط مع تركيز على المحتوى',
    config: {
      id: 'template-1',
      name: 'Modern Minimal',
      settings: {
        theme: 'light',
        language: 'both',
        responsive: true,
        animations: true
      },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: {
            ar: 'عنوان رئيسي حديث',
            en: 'Modern Main Title'
          },
          styling: {
            fontSize: '3xl',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 'md',
            animation: 'fade-in',
            animationDelay: '0s'
          },
          pageKey: 'homepage',
          elementKey: 'title-1',
          order: 1,
          visible: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'corporate-professional',
    name: 'تصميم مؤسسي مهني',
    description: 'تصميم مهني مناسب للشركات والمؤسسات',
    config: {
      id: 'template-2',
      name: 'Corporate Professional',
      settings: {
        theme: 'dark',
        language: 'both',
        responsive: true,
        animations: true
      },
      elements: [
        {
          id: 'title-2',
          type: 'text',
          content: {
            ar: 'شركتك الرائدة',
            en: 'Your Leading Company'
          },
          styling: {
            fontSize: '4xl',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'right',
            marginBottom: 'lg',
            animation: 'slide-in-left',
            animationDelay: '0s'
          },
          pageKey: 'homepage',
          elementKey: 'title-2',
          order: 1,
          visible: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'creative-artistic',
    name: 'تصميم إبداعي فني',
    description: 'تصميم إبداعي مع تأثيرات بصرية متقدمة',
    config: {
      id: 'template-3',
      name: 'Creative Artistic',
      settings: {
        theme: 'auto',
        language: 'both',
        responsive: true,
        animations: true
      },
      elements: [
        {
          id: 'title-3',
          type: 'text',
          content: {
            ar: 'إبداع بلا حدود',
            en: 'Creativity Without Limits'
          },
          styling: {
            fontSize: '5xl',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 'xl',
            animation: 'scale-in',
            animationDelay: '0s'
          },
          pageKey: 'homepage',
          elementKey: 'title-3',
          order: 1,
          visible: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  }
];

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const savedTemplates = localStorage.getItem('hero-section-templates');
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates);
        setTemplates([...DEFAULT_TEMPLATES, ...parsed]);
      } else {
        setTemplates(DEFAULT_TEMPLATES);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(DEFAULT_TEMPLATES);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (template: Omit<Template, 'id' | 'createdAt'>) => {
    try {
      const newTemplate: Template = {
        ...template,
        id: `custom-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      const customTemplates = templates.filter(t => t.id.startsWith('custom-'));
      const updatedCustomTemplates = [...customTemplates, newTemplate];
      
      localStorage.setItem('hero-section-templates', JSON.stringify(updatedCustomTemplates));
      setTemplates([...DEFAULT_TEMPLATES, ...updatedCustomTemplates]);
      
      return newTemplate;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      if (!templateId.startsWith('custom-')) {
        throw new Error('Cannot delete default templates');
      }

      const customTemplates = templates.filter(t => t.id.startsWith('custom-') && t.id !== templateId);
      localStorage.setItem('hero-section-templates', JSON.stringify(customTemplates));
      setTemplates([...DEFAULT_TEMPLATES, ...customTemplates]);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  const applyTemplate = (templateId: string): HeroSectionConfig | null => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    return {
      ...template.config,
      id: `applied-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
  };

  return {
    templates,
    isLoading,
    saveTemplate,
    deleteTemplate,
    applyTemplate,
    defaultTemplates: DEFAULT_TEMPLATES
  };
};