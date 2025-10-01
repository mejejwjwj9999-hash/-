import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  History, 
  Eye, 
  RotateCcw, 
  User, 
  Clock, 
  FileText, 
  GitBranch, 
  Download,
  Trash2,
  Star,
  Calendar,
  Tag,
  Search,
  Filter,
  GitCompare
} from 'lucide-react';

interface ContentRevision {
  id: string;
  version: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  status: 'published' | 'draft' | 'archived';
  changes: {
    type: 'added' | 'modified' | 'deleted';
    field: string;
    oldValue?: string;
    newValue?: string;
  }[];
  description?: string;
  isMajor: boolean;
  tags: string[];
  pageKey: string;
}

export const ContentRevisions: React.FC<{ pageKey: string }> = ({ pageKey }) => {
  const [revisions, setRevisions] = useState<ContentRevision[]>([
    {
      id: '1',
      version: '2.1.0',
      title: 'تحديث محتوى صفحة عن الكلية',
      author: { name: 'أحمد محمد', avatar: '/placeholder.svg' },
      timestamp: '2024-01-20T14:30:00Z',
      status: 'published',
      changes: [
        { type: 'modified', field: 'hero-title', oldValue: 'العنوان القديم', newValue: 'العنوان الجديد' },
        { type: 'added', field: 'statistics', newValue: 'إضافة قسم الإحصائيات' }
      ],
      description: 'تحديث العنوان الرئيسي وإضافة قسم الإحصائيات',
      isMajor: true,
      tags: ['content-update', 'statistics'],
      pageKey: 'about-college'
    },
    {
      id: '2',
      version: '2.0.5',
      title: 'إصلاح الأخطاء الإملائية',
      author: { name: 'فاطمة أحمد' },
      timestamp: '2024-01-18T09:15:00Z',
      status: 'published',
      changes: [
        { type: 'modified', field: 'description', oldValue: 'النص مع خطأ', newValue: 'النص المصحح' }
      ],
      description: 'تصحيح الأخطاء الإملائية في الوصف',
      isMajor: false,
      tags: ['typo-fix'],
      pageKey: 'about-college'
    },
    {
      id: '3',
      version: '2.0.4',
      title: 'تحديث الصور',
      author: { name: 'محمد علي' },
      timestamp: '2024-01-15T16:45:00Z',
      status: 'published',
      changes: [
        { type: 'modified', field: 'hero-image', oldValue: 'old-image.jpg', newValue: 'new-image.jpg' }
      ],
      description: 'تحديث الصورة الرئيسية للصفحة',
      isMajor: false,
      tags: ['image-update'],
      pageKey: 'about-college'
    }
  ]);

  const [selectedRevision, setSelectedRevision] = useState<ContentRevision | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareRevisions, setCompareRevisions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const filteredRevisions = revisions.filter(revision => {
    const matchesSearch = revision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         revision.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         revision.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || revision.status === filterStatus;
    const matchesPage = revision.pageKey === pageKey;
    
    return matchesSearch && matchesFilter && matchesPage;
  });

  const handleRestore = (revisionId: string) => {
    // Implement restoration logic
    console.log('Restoring revision:', revisionId);
  };

  const handleCompareToggle = (revisionId: string) => {
    if (compareRevisions.includes(revisionId)) {
      setCompareRevisions(compareRevisions.filter(id => id !== revisionId));
    } else if (compareRevisions.length < 2) {
      setCompareRevisions([...compareRevisions, revisionId]);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline'
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const getChangeIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'added': return <span className="text-green-600">+</span>;
      case 'modified': return <span className="text-blue-600">~</span>;
      case 'deleted': return <span className="text-red-600">-</span>;
      default: return <FileText {...iconProps} />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-600 bg-green-50 border-green-200';
      case 'modified': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'deleted': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">تاريخ المراجعات</h1>
          <p className="text-muted-foreground">تتبع جميع التغييرات والإصدارات</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={isCompareMode ? 'default' : 'outline'}
            onClick={() => {
              setIsCompareMode(!isCompareMode);
              setCompareRevisions([]);
            }}
          >
            <GitCompare className="w-4 h-4 ml-2" />
            {isCompareMode ? 'إنهاء المقارنة' : 'مقارنة الإصدارات'}
          </Button>
          
          <Button>
            <Download className="w-4 h-4 ml-2" />
            تصدير التاريخ
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث في المراجعات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border rounded-md text-right"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">جميع الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="archived">مؤرشف</option>
        </select>
      </div>

      {isCompareMode && compareRevisions.length === 2 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5" />
              مقارنة الإصدارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>سيتم مقارنة الإصدارات المحددة هنا</p>
            <div className="flex gap-2 mt-2">
              {compareRevisions.map(id => {
                const revision = revisions.find(r => r.id === id);
                return revision ? (
                  <Badge key={id} variant="outline">
                    {revision.version} - {revision.title}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revisions Timeline */}
      <div className="space-y-4">
        {filteredRevisions.map((revision, index) => (
          <Card key={revision.id} className={`transition-all hover:shadow-md ${
            compareRevisions.includes(revision.id) ? 'ring-2 ring-primary' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${
                    revision.isMajor ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                  {index < filteredRevisions.length - 1 && (
                    <div className="w-px h-16 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{revision.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        v{revision.version}
                      </Badge>
                      {getStatusBadge(revision.status)}
                      {revision.isMajor && (
                        <Badge className="bg-orange-100 text-orange-800">
                          إصدار رئيسي
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {isCompareMode && (
                        <Button
                          variant={compareRevisions.includes(revision.id) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCompareToggle(revision.id)}
                          disabled={compareRevisions.length >= 2 && !compareRevisions.includes(revision.id)}
                        >
                          {compareRevisions.includes(revision.id) ? 'إلغاء' : 'اختيار'}
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" onClick={() => setSelectedRevision(revision)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={() => handleRestore(revision.id)}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Author and Timestamp */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{revision.author.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimestamp(revision.timestamp)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {revision.description && (
                    <p className="text-muted-foreground mb-3">{revision.description}</p>
                  )}

                  {/* Changes Summary */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">التغييرات ({revision.changes.length}):</h4>
                    <div className="grid gap-2">
                      {revision.changes.slice(0, 3).map((change, changeIndex) => (
                        <div 
                          key={changeIndex} 
                          className={`flex items-center gap-2 text-sm p-2 rounded border ${getChangeColor(change.type)}`}
                        >
                          {getChangeIcon(change.type)}
                          <span className="font-medium">{change.field}:</span>
                          {change.type === 'added' && <span>{change.newValue}</span>}
                          {change.type === 'modified' && (
                            <span>
                              <span className="line-through opacity-60">{change.oldValue}</span>
                              {' → '}
                              <span>{change.newValue}</span>
                            </span>
                          )}
                          {change.type === 'deleted' && (
                            <span className="line-through opacity-60">{change.oldValue}</span>
                          )}
                        </div>
                      ))}
                      
                      {revision.changes.length > 3 && (
                        <button 
                          className="text-sm text-primary hover:underline text-right"
                          onClick={() => setSelectedRevision(revision)}
                        >
                          عرض {revision.changes.length - 3} تغييرات أخرى...
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {revision.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {revision.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 ml-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRevisions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد مراجعات</h3>
              <p className="text-muted-foreground">لم يتم العثور على مراجعات تطابق البحث</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Revision Details Dialog */}
      <Dialog open={!!selectedRevision} onOpenChange={() => setSelectedRevision(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              تفاصيل الإصدار {selectedRevision?.version}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRevision && (
            <div className="space-y-6" dir="rtl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">معلومات الإصدار</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>الإصدار:</span>
                      <span>v{selectedRevision.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المؤلف:</span>
                      <span>{selectedRevision.author.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التاريخ:</span>
                      <span>{formatTimestamp(selectedRevision.timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحالة:</span>
                      {getStatusBadge(selectedRevision.status)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">الوصف</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRevision.description || 'لا يوجد وصف'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4">جميع التغييرات ({selectedRevision.changes.length})</h4>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {selectedRevision.changes.map((change, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border ${getChangeColor(change.type)}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getChangeIcon(change.type)}
                          <span className="font-medium">{change.field}</span>
                        </div>
                        
                        {change.type === 'added' && (
                          <div className="bg-white/50 p-2 rounded text-sm">
                            <strong>القيمة الجديدة:</strong> {change.newValue}
                          </div>
                        )}
                        
                        {change.type === 'modified' && (
                          <div className="space-y-2">
                            <div className="bg-red-50 p-2 rounded text-sm">
                              <strong>القيمة القديمة:</strong> {change.oldValue}
                            </div>
                            <div className="bg-green-50 p-2 rounded text-sm">
                              <strong>القيمة الجديدة:</strong> {change.newValue}
                            </div>
                          </div>
                        )}
                        
                        {change.type === 'deleted' && (
                          <div className="bg-white/50 p-2 rounded text-sm">
                            <strong>القيمة المحذوفة:</strong> {change.oldValue}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleRestore(selectedRevision.id)}>
                  <RotateCcw className="w-4 h-4 ml-2" />
                  استعادة هذا الإصدار
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل نسخة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};