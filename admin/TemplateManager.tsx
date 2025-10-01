import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import {
  FileText,
  Image,
  Layout,
  Newspaper,
  Mail,
  Globe,
  Save,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
  Star,
  Tag,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Code
} from 'lucide-react';

interface TemplateContent {
  ar: string;
  en: string;
}

interface TemplateMetadata {
  variables: string[];
  placeholders: Record<string, string>;
  styling: Record<string, any>;
  seo: {
    title: TemplateContent;
    description: TemplateContent;
    keywords: string[];
  };
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'page' | 'section' | 'component' | 'email' | 'post' | 'form';
  type: 'text' | 'rich_text' | 'html' | 'mixed';
  content: TemplateContent;
  metadata: TemplateMetadata;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ContentTemplate) => void;
  currentContent?: string;
  language?: 'ar' | 'en';
}

const TEMPLATE_CATEGORIES = [
  { id: 'page', label: 'صفحات كاملة', icon: Layout },
  { id: 'section', label: 'أقسام', icon: Grid },
  { id: 'component', label: 'مكونات', icon: FileText },
  { id: 'email', label: 'رسائل إلكترونية', icon: Mail },
  { id: 'post', label: 'مقالات ومنشورات', icon: Newspaper },
  { id: 'form', label: 'نماذج', icon: Edit }
];

const SAMPLE_TEMPLATES: ContentTemplate[] = [
  {
    id: 'hero-section',
    name: 'قسم البطل الرئيسي',
    description: 'قسم رئيسي جذاب مع عنوان وزر دعوة للعمل',
    category: 'section',
    type: 'rich_text',
    content: {
      ar: '<div class="hero-section"><h1>{{title}}</h1><p>{{description}}</p><button>{{cta_text}}</button></div>',
      en: '<div class="hero-section"><h1>{{title}}</h1><p>{{description}}</p><button>{{cta_text}}</button></div>'
    },
    metadata: {
      variables: ['title', 'description', 'cta_text'],
      placeholders: {
        title: 'عنوان رئيسي',
        description: 'وصف مختصر',
        cta_text: 'ابدأ الآن'
      },
      styling: {
        textAlign: 'center',
        backgroundColor: 'primary',
        padding: '4rem 2rem'
      },
      seo: {
        title: { ar: 'القسم الرئيسي', en: 'Hero Section' },
        description: { ar: 'قسم رئيسي جذاب', en: 'Attractive hero section' },
        keywords: ['hero', 'main', 'landing']
      }
    },
    thumbnail: '/templates/hero-section.png',
    tags: ['landing', 'hero', 'cta'],
    isPublic: true,
    isFavorite: false,
    usageCount: 42,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'system'
  },
  {
    id: 'news-article',
    name: 'مقال إخباري',
    description: 'قالب مقال إخباري مع عنوان وتاريخ ومحتوى',
    category: 'post',
    type: 'rich_text',
    content: {
      ar: '<article><header><h1>{{title}}</h1><time>{{date}}</time><p class="lead">{{excerpt}}</p></header><div class="content">{{content}}</div></article>',
      en: '<article><header><h1>{{title}}</h1><time>{{date}}</time><p class="lead">{{excerpt}}</p></header><div class="content">{{content}}</div></article>'
    },
    metadata: {
      variables: ['title', 'date', 'excerpt', 'content'],
      placeholders: {
        title: 'عنوان الخبر',
        date: new Date().toLocaleDateString('ar'),
        excerpt: 'ملخص الخبر',
        content: 'محتوى الخبر الكامل'
      },
      styling: {
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: '1.6'
      },
      seo: {
        title: { ar: 'مقال إخباري', en: 'News Article' },
        description: { ar: 'قالب للمقالات الإخبارية', en: 'Template for news articles' },
        keywords: ['news', 'article', 'post']
      }
    },
    thumbnail: '/templates/news-article.png',
    tags: ['news', 'article', 'content'],
    isPublic: true,
    isFavorite: true,
    usageCount: 28,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    createdBy: 'system'
  }
];

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  isOpen,
  onClose,
  onTemplateSelect,
  currentContent = '',
  language = 'ar'
}) => {
  const [templates, setTemplates] = useState<ContentTemplate[]>(SAMPLE_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<ContentTemplate>>({
    name: '',
    description: '',
    category: 'section',
    type: 'rich_text',
    content: { ar: '', en: '' },
    tags: [],
    isPublic: false,
    isFavorite: false
  });

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || template.isFavorite;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const handleTemplateSelect = useCallback((template: ContentTemplate) => {
    onTemplateSelect(template);
    toast({
      title: 'تم تطبيق القالب',
      description: `تم تطبيق قالب "${template.name}" بنجاح`
    });
    onClose();
  }, [onTemplateSelect, onClose]);

  const handleToggleFavorite = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ));
  }, []);

  const handleSaveAsTemplate = useCallback(() => {
    if (!newTemplate.name || !currentContent) return;

    const template: ContentTemplate = {
      id: 'custom-' + Date.now(),
      name: newTemplate.name,
      description: newTemplate.description || '',
      category: newTemplate.category as any,
      type: newTemplate.type as any,
      content: {
        ar: language === 'ar' ? currentContent : newTemplate.content?.ar || '',
        en: language === 'en' ? currentContent : newTemplate.content?.en || ''
      },
      metadata: {
        variables: [],
        placeholders: {},
        styling: {},
        seo: {
          title: { ar: newTemplate.name, en: newTemplate.name },
          description: { ar: newTemplate.description || '', en: newTemplate.description || '' },
          keywords: newTemplate.tags || []
        }
      },
      thumbnail: undefined,
      tags: newTemplate.tags || [],
      isPublic: newTemplate.isPublic || false,
      isFavorite: newTemplate.isFavorite || false,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user'
    };

    setTemplates(prev => [template, ...prev]);
    setIsCreateTemplateOpen(false);
    setNewTemplate({
      name: '',
      description: '',
      category: 'section',
      type: 'rich_text',
      content: { ar: '', en: '' },
      tags: [],
      isPublic: false,
      isFavorite: false
    });

    toast({
      title: 'تم حفظ القالب',
      description: `تم حفظ القالب "${template.name}" بنجاح`
    });
  }, [newTemplate, currentContent, language]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              مدير القوالب
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col h-full">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 p-4 border-b">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في القوالب..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  المفضلة
                </Button>
                
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* Categories Sidebar */}
              <div className="w-64 border-r p-4">
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    جميع القوالب ({templates.length})
                  </Button>
                  
                  {TEMPLATE_CATEGORIES.map(category => {
                    const count = templates.filter(t => t.category === category.id).length;
                    const Icon = category.icon;
                    
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label} ({count})
                      </Button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsCreateTemplateOpen(true)}
                    disabled={!currentContent}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    حفظ كقالب
                  </Button>
                </div>
              </div>

              {/* Templates Grid/List */}
              <div className="flex-1 p-4">
                <ScrollArea className="h-full">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTemplates.map(template => (
                        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(template.id);
                                }}
                              >
                                <Star className={`h-4 w-4 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              </Button>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-1 mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {TEMPLATE_CATEGORIES.find(c => c.id === template.category)?.label}
                              </Badge>
                              {template.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                              <span>استخدم {template.usageCount} مرة</span>
                              <span>{template.updatedAt.toLocaleDateString('ar')}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleTemplateSelect(template)}
                              >
                                استخدام
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTemplate(template);
                                  setIsPreviewOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTemplates.map(template => (
                        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-medium">{template.name}</h3>
                                  <Badge variant="secondary" className="text-xs">
                                    {TEMPLATE_CATEGORIES.find(c => c.id === template.category)?.label}
                                  </Badge>
                                  {template.isFavorite && (
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>استخدم {template.usageCount} مرة</span>
                                  <span>{template.updatedAt.toLocaleDateString('ar')}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleTemplateSelect(template)}
                                >
                                  استخدام
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTemplate(template);
                                    setIsPreviewOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>معاينة القالب: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>المحتوى العربي</Label>
                  <div className="border rounded p-4 bg-muted/50 max-h-64 overflow-auto">
                    <pre className="text-sm">{selectedTemplate.content.ar}</pre>
                  </div>
                </div>
                <div>
                  <Label>المحتوى الإنجليزي</Label>
                  <div className="border rounded p-4 bg-muted/50 max-h-64 overflow-auto">
                    <pre className="text-sm">{selectedTemplate.content.en}</pre>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  إغلاق
                </Button>
                <Button onClick={() => {
                  handleTemplateSelect(selectedTemplate);
                  setIsPreviewOpen(false);
                }}>
                  استخدام القالب
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>حفظ المحتوى كقالب جديد</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">اسم القالب</Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="ادخل اسم القالب"
              />
            </div>
            
            <div>
              <Label htmlFor="template-description">الوصف</Label>
              <Textarea
                id="template-description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر للقالب"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الفئة</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value as any }))}
                >
                  {TEMPLATE_CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>النوع</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="text">نص عادي</option>
                  <option value="rich_text">نص منسق</option>
                  <option value="html">HTML</option>
                  <option value="mixed">مختلط</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAsTemplate} disabled={!newTemplate.name}>
                <Save className="h-4 w-4 mr-2" />
                حفظ القالب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};