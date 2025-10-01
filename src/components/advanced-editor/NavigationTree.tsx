import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useContentPages, useContentElements } from '@/hooks/useContentEditor';
import { useContentStatistics } from '@/hooks/useAdvancedContentSearch';
import { 
  ChevronDown,
  ChevronRight,
  FileText,
  Edit3,
  Image,
  Link,
  MousePointer,
  Eye,
  EyeOff,
  Folder,
  FolderOpen,
  Plus,
  MoreVertical
} from 'lucide-react';

interface NavigationTreeProps {
  onPageSelect: (pageId: string) => void;
  onElementSelect: (element: any) => void;
  selectedPageId?: string;
  selectedElementId?: string;
}

export const NavigationTree: React.FC<NavigationTreeProps> = ({
  onPageSelect,
  onElementSelect,
  selectedPageId,
  selectedElementId
}) => {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  
  const { data: pages, isLoading: pagesLoading } = useContentPages();
  const { data: statistics } = useContentStatistics();

  const togglePageExpansion = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />;
      case 'rich_text': return <Edit3 className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      case 'button': return <MousePointer className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  const PageNode: React.FC<{ page: any }> = ({ page }) => {
    const { data: elements, isLoading: elementsLoading } = useContentElements(page.id);
    const isExpanded = expandedPages.has(page.id);
    const isSelected = selectedPageId === page.id;
    
    const pageStats = statistics?.pageElementCounts.find(p => p.page_id === page.id);
    const elementCounts = {
      published: elements?.filter(e => e.status === 'published').length || 0,
      draft: elements?.filter(e => e.status === 'draft').length || 0,
      archived: elements?.filter(e => e.status === 'archived').length || 0,
    };

    return (
      <Collapsible open={isExpanded} onOpenChange={() => togglePageExpansion(page.id)}>
        <div className={`
          group relative rounded-lg transition-colors
          ${isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}
        `}>
          <div className="flex items-center justify-between p-2">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 flex-1 justify-start h-auto p-1"
                onClick={() => onPageSelect(page.id)}
              >
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-primary" />
                ) : (
                  <Folder className="w-4 h-4" />
                )}
                <span className="font-medium text-sm">{page.page_name_ar}</span>
                <Badge variant="outline" className="text-xs ml-auto">
                  {pageStats?.element_count || 0}
                </Badge>
              </Button>
            </CollapsibleTrigger>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="px-2 pb-2">
              <div className="flex gap-1 mb-2">
                {elementCounts.published > 0 && (
                  <Badge variant="default" className="text-xs">
                    منشور {elementCounts.published}
                  </Badge>
                )}
                {elementCounts.draft > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    مسودة {elementCounts.draft}
                  </Badge>
                )}
                {elementCounts.archived > 0 && (
                  <Badge variant="outline" className="text-xs">
                    مؤرشف {elementCounts.archived}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <CollapsibleContent className="pl-4">
          {elementsLoading ? (
            <div className="py-2 text-xs text-muted-foreground">جاري التحميل...</div>
          ) : elements?.length === 0 ? (
            <div className="py-2 text-xs text-muted-foreground">لا توجد عناصر</div>
          ) : (
            <div className="space-y-1">
              {elements?.map(element => (
                <div
                  key={element.id}
                  className={`
                    group flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                    ${selectedElementId === element.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/30'
                    }
                  `}
                  onClick={() => onElementSelect(element)}
                >
                  <div className="flex-shrink-0">
                    {getElementIcon(element.element_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate">{element.element_key}</span>
                      <Badge 
                        variant={getStatusColor(element.status)} 
                        className="text-xs flex-shrink-0"
                      >
                        {element.status === 'published' ? 'م' : 
                         element.status === 'draft' ? 'د' : 'أ'}
                      </Badge>
                    </div>
                    {element.content_ar && (
                      <p className="text-xs text-muted-foreground truncate">
                        {element.content_ar.substring(0, 30)}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {element.status === 'published' ? (
                      <Eye className="w-3 h-3 text-green-600" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  if (pagesLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">شجرة التنقل</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{statistics?.totalPages || 0} صفحة</span>
            <span>•</span>
            <span>{statistics?.totalElements || 0} عنصر</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {pages?.map(page => (
            <PageNode key={page.id} page={page} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};