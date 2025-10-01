import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  History, Clock, User, Edit, Undo, Eye, Download,
  GitBranch, Save, Tag, Search, Filter, Calendar,
  ArrowRight, ArrowLeft, RotateCcw, FileText
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onRestore: (content: string) => void;
  elementId?: string;
}

interface ContentVersion {
  id: string;
  revisionNumber: number;
  content: string;
  contentPreview: string;
  changeSummary: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  wordCount: number;
  changeType: 'major' | 'minor' | 'auto-save';
  tags: string[];
  isBookmarked: boolean;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  currentContent,
  onRestore,
  elementId
}) => {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareWith, setCompareWith] = useState<ContentVersion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'major' | 'minor' | 'bookmarked'>('all');

  // محاكاة بيانات النسخ
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // محاكاة تحميل النسخ من قاعدة البيانات
      setTimeout(() => {
        const mockVersions: ContentVersion[] = [
          {
            id: '1',
            revisionNumber: 10,
            content: currentContent,
            contentPreview: currentContent.substring(0, 200) + '...',
            changeSummary: 'النسخة الحالية',
            createdAt: new Date().toISOString(),
            createdBy: 'current-user',
            createdByName: 'المستخدم الحالي',
            wordCount: currentContent.split(' ').length,
            changeType: 'major',
            tags: ['حالي'],
            isBookmarked: true
          },
          {
            id: '2',
            revisionNumber: 9,
            content: currentContent + '\n\nمحتوى إضافي سابق...',
            contentPreview: (currentContent + '\n\nمحتوى إضافي سابق...').substring(0, 200) + '...',
            changeSummary: 'إضافة قسم جديد حول الموضوع الرئيسي',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            createdBy: 'user-1',
            createdByName: 'أحمد محمد',
            wordCount: (currentContent + '\n\nمحتوى إضافي سابق...').split(' ').length,
            changeType: 'major',
            tags: ['تحسين', 'إضافة'],
            isBookmarked: false
          },
          {
            id: '3',
            revisionNumber: 8,
            content: currentContent.replace(/\./g, '،'),
            contentPreview: currentContent.replace(/\./g, '،').substring(0, 200) + '...',
            changeSummary: 'تصحيح علامات الترقيم',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            createdBy: 'user-2',
            createdByName: 'فاطمة علي',
            wordCount: currentContent.replace(/\./g, '،').split(' ').length,
            changeType: 'minor',
            tags: ['تصحيح'],
            isBookmarked: false
          },
          {
            id: '4',
            revisionNumber: 7,
            content: currentContent.substring(0, Math.floor(currentContent.length * 0.7)),
            contentPreview: currentContent.substring(0, Math.floor(currentContent.length * 0.7)).substring(0, 200) + '...',
            changeSummary: 'حفظ تلقائي',
            createdAt: new Date(Date.now() - 10800000).toISOString(),
            createdBy: 'system',
            createdByName: 'النظام',
            wordCount: currentContent.substring(0, Math.floor(currentContent.length * 0.7)).split(' ').length,
            changeType: 'auto-save',
            tags: ['تلقائي'],
            isBookmarked: false
          },
          {
            id: '5',
            revisionNumber: 6,
            content: 'النسخة الأولية من المحتوى مع الأفكار الأساسية فقط.',
            contentPreview: 'النسخة الأولية من المحتوى مع الأفكار الأساسية فقط.',
            changeSummary: 'النسخة الأولية',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            createdBy: 'user-1',
            createdByName: 'أحمد محمد',
            wordCount: 10,
            changeType: 'major',
            tags: ['أولي', 'مسودة'],
            isBookmarked: true
          }
        ];
        
        setVersions(mockVersions);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, currentContent]);

  const filteredVersions = versions.filter(version => {
    if (filterType !== 'all' && filterType !== 'bookmarked' && version.changeType !== filterType) return false;
    if (filterType === 'bookmarked' && !version.isBookmarked) return false;
    if (searchTerm && !version.changeSummary.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !version.contentPreview.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleRestore = (version: ContentVersion) => {
    if (confirm(`هل أنت متأكد من استعادة النسخة رقم ${version.revisionNumber}؟`)) {
      onRestore(version.content);
      toast({ 
        title: "تم الاستعادة", 
        description: `تم استعادة النسخة رقم ${version.revisionNumber} بنجاح` 
      });
      onClose();
    }
  };

  const toggleBookmark = (versionId: string) => {
    setVersions(prev => prev.map(v => 
      v.id === versionId ? { ...v, isBookmarked: !v.isBookmarked } : v
    ));
    toast({ title: "تم التحديث", description: "تم تحديث العلامة المرجعية" });
  };

  const downloadVersion = (version: ContentVersion) => {
    const blob = new Blob([version.content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `version-${version.revisionNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-blue-500';
      case 'minor': return 'bg-green-500';
      case 'auto-save': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case 'major': return 'تغيير كبير';
      case 'minor': return 'تغيير صغير';
      case 'auto-save': return 'حفظ تلقائي';
      default: return 'غير محدد';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            سجل النسخ والتغييرات
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* الشريط الجانبي للفلترة والبحث */}
          <div className="w-80 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">البحث والفلترة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في النسخ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">نوع التغيير</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">جميع النسخ</option>
                    <option value="major">تغييرات كبيرة</option>
                    <option value="minor">تغييرات صغيرة</option>
                    <option value="bookmarked">المحفوظة</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={compareMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCompareMode(!compareMode)}
                    className="flex-1"
                  >
                    <GitBranch className="h-4 w-4 ml-1" />
                    مقارنة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">إحصائيات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>إجمالي النسخ:</span>
                    <span className="font-semibold">{versions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>النسخ المحفوظة:</span>
                    <span className="font-semibold">
                      {versions.filter(v => v.isBookmarked).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>آخر تحديث:</span>
                    <span className="font-semibold">
                      {versions[0] && formatDistanceToNow(new Date(versions[0].createdAt), { 
                        addSuffix: true, 
                        locale: ar 
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* قائمة النسخ */}
          <div className={compareMode ? "w-96" : "flex-1"}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  النسخ المتاحة ({filteredVersions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      <span className="mr-2">جاري التحميل...</span>
                    </div>
                  ) : filteredVersions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <p>لا توجد نسخ مطابقة للبحث</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredVersions.map((version, index) => (
                        <Card 
                          key={version.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedVersion?.id === version.id ? 'ring-2 ring-primary' : ''
                          } ${compareMode && compareWith?.id === version.id ? 'ring-2 ring-secondary' : ''}`}
                          onClick={() => {
                            if (compareMode) {
                              setCompareWith(version);
                            } else {
                              setSelectedVersion(version);
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  النسخة {version.revisionNumber}
                                </Badge>
                                <div className={`w-2 h-2 rounded-full ${getChangeTypeColor(version.changeType)}`} />
                                {version.isBookmarked && (
                                  <Tag className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBookmark(version.id);
                                  }}
                                >
                                  <Tag className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadVersion(version);
                                  }}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <h4 className="font-medium text-sm mb-1">
                              {version.changeSummary}
                            </h4>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {version.createdByName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(version.createdAt), { 
                                  addSuffix: true, 
                                  locale: ar 
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {version.wordCount} كلمة
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {version.contentPreview}
                            </p>

                            <div className="flex gap-1 mb-2">
                              {version.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedVersion(version);
                                }}
                              >
                                <Eye className="h-3 w-3 ml-1" />
                                معاينة
                              </Button>
                              {index !== 0 && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestore(version);
                                  }}
                                >
                                  <RotateCcw className="h-3 w-3 ml-1" />
                                  استعادة
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* منطقة المعاينة */}
          {(selectedVersion || compareMode) && (
            <div className="flex-1">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {compareMode ? 'مقارنة النسخ' : 'معاينة النسخة'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {compareMode ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">
                            النسخة {selectedVersion?.revisionNumber || 'الحالية'}
                          </h4>
                          <div 
                            className="prose prose-sm max-w-none text-sm"
                            dangerouslySetInnerHTML={{ 
                              __html: selectedVersion?.content || currentContent 
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">
                            النسخة {compareWith?.revisionNumber || '...'}
                          </h4>
                          {compareWith ? (
                            <div 
                              className="prose prose-sm max-w-none text-sm"
                              dangerouslySetInnerHTML={{ 
                                __html: compareWith.content 
                              }}
                            />
                          ) : (
                            <p className="text-muted-foreground">
                              اختر نسخة للمقارنة
                            </p>
                          )}
                        </div>
                      </div>
                    ) : selectedVersion ? (
                      <div>
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              النسخة {selectedVersion.revisionNumber}
                            </h4>
                            <Badge>{getChangeTypeLabel(selectedVersion.changeType)}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {selectedVersion.changeSummary}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>بواسطة: {selectedVersion.createdByName}</span>
                            <span>
                              {new Date(selectedVersion.createdAt).toLocaleDateString('ar-SA')}
                            </span>
                            <span>{selectedVersion.wordCount} كلمة</span>
                          </div>
                        </div>
                        
                        <div 
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedVersion.content 
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-4" />
                        <p>اختر نسخة من القائمة لمعاينتها</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistory;