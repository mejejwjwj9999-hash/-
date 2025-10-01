import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Trash2, 
  Download, 
  Copy, 
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  File,
  FolderPlus,
  Folder,
  MoreHorizontal,
  Eye,
  Edit,
  Star
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  uploadDate: string;
  folder?: string;
  tags: string[];
  description?: string;
  isFavorite: boolean;
}

interface MediaFolder {
  id: string;
  name: string;
  fileCount: number;
  createdDate: string;
}

export const MediaLibrary: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-image.jpg',
      type: 'image',
      url: '/placeholder.svg',
      size: 1024000,
      uploadDate: '2024-01-15',
      folder: 'images',
      tags: ['hero', 'homepage'],
      description: 'صورة رئيسية للموقع',
      isFavorite: true
    },
    {
      id: '2', 
      name: 'dean-photo.jpg',
      type: 'image',
      url: '/placeholder.svg',
      size: 512000,
      uploadDate: '2024-01-20',
      folder: 'portraits',
      tags: ['dean', 'staff'],
      description: 'صورة عميد الكلية',
      isFavorite: false
    }
  ]);

  const [folders, setFolders] = useState<MediaFolder[]>([
    { id: '1', name: 'images', fileCount: 15, createdDate: '2024-01-01' },
    { id: '2', name: 'portraits', fileCount: 8, createdDate: '2024-01-05' },
    { id: '3', name: 'documents', fileCount: 12, createdDate: '2024-01-10' }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileType, setFileType] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload logic here
    console.log('Uploaded files:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    const matchesType = fileType === 'all' || file.type === fileType;
    
    return matchesSearch && matchesFolder && matchesType;
  });

  const getFileIcon = (type: string) => {
    const iconProps = { className: "w-8 h-8 text-muted-foreground" };
    switch (type) {
      case 'image': return <ImageIcon {...iconProps} />;
      case 'video': return <Video {...iconProps} />;
      case 'audio': return <Music {...iconProps} />;
      case 'document': return <FileText {...iconProps} />;
      default: return <File {...iconProps} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleFavorite = (fileId: string) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, isFavorite: !file.isFavorite } : file
    ));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // Show toast notification
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredFiles.map(file => (
        <Card key={file.id} className="relative group hover:shadow-lg transition-shadow">
          <CardContent className="p-3">
            <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
              {file.type === 'image' ? (
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              ) : (
                getFileIcon(file.type)
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button size="sm" variant="secondary" onClick={() => {
                  setSelectedFile(file);
                  setIsDialogOpen(true);
                }}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => copyUrl(file.url)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toggleFavorite(file.id)}>
                  <Star className={`w-4 h-4 ${file.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{formatFileSize(file.size)}</span>
                <Badge variant="outline" className="text-xs">
                  {file.type}
                </Badge>
              </div>
              {file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {file.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {file.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{file.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredFiles.map(file => (
        <Card key={file.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  getFileIcon(file.type)
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{file.name}</p>
                  {file.isFavorite && (
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{new Date(file.uploadDate).toLocaleDateString('ar-SA')}</span>
                  <Badge variant="outline">{file.type}</Badge>
                </div>
                {file.description && (
                  <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => {
                  setSelectedFile(file);
                  setIsDialogOpen(true);
                }}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => copyUrl(file.url)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleFavorite(file.id)}>
                  <Star className={`w-4 h-4 ${file.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">مكتبة الوسائط</h1>
          <p className="text-muted-foreground">إدارة جميع الملفات والوسائط</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} variant="outline">
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'اسحب الملفات هنا' : 'رفع ملفات جديدة'}
            </h3>
            <p className="text-muted-foreground">
              اسحب وأفلت الملفات هنا أو اضغط للاختيار
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              يدعم: JPG, PNG, GIF, MP4, PDF, DOC, DOCX (حد أقصى 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
          <Input
            placeholder="البحث في الملفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">جميع المجلدات</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.name}>
                {folder.name} ({folder.fileCount})
              </option>
            ))}
          </select>
          
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">جميع الأنواع</option>
            <option value="image">صور</option>
            <option value="video">فيديو</option>
            <option value="audio">صوت</option>
            <option value="document">مستندات</option>
          </select>
        </div>
      </div>

      {/* Folders */}
      <div>
        <h3 className="text-lg font-semibold mb-3">المجلدات</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {folders.map(folder => (
            <Card key={folder.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Folder className="w-12 h-12 mx-auto mb-2 text-primary" />
                <p className="font-medium">{folder.name}</p>
                <p className="text-sm text-muted-foreground">
                  {folder.fileCount} ملف
                </p>
              </CardContent>
            </Card>
          ))}
          
          {/* Add New Folder */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
            <CardContent className="p-4 text-center">
              <FolderPlus className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium text-muted-foreground">مجلد جديد</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Files */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            الملفات ({filteredFiles.length})
          </h3>
        </div>
        
        {viewMode === 'grid' ? renderGridView() : renderListView()}
      </div>

      {/* File Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              {selectedFile.type === 'image' ? (
                <div className="text-center">
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    className="max-w-full max-h-96 mx-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              ) : (
                <div className="text-center p-12 bg-muted rounded-lg">
                  {getFileIcon(selectedFile.type)}
                  <p className="mt-4 text-muted-foreground">معاينة غير متاحة لهذا النوع من الملفات</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">النوع:</p>
                  <p>{selectedFile.type}</p>
                </div>
                <div>
                  <p className="font-semibold">الحجم:</p>
                  <p>{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="font-semibold">تاريخ الرفع:</p>
                  <p>{new Date(selectedFile.uploadDate).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <p className="font-semibold">المجلد:</p>
                  <p>{selectedFile.folder || 'غير محدد'}</p>
                </div>
              </div>
              
              {selectedFile.description && (
                <div>
                  <p className="font-semibold">الوصف:</p>
                  <p className="text-muted-foreground">{selectedFile.description}</p>
                </div>
              )}
              
              {selectedFile.tags.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">العلامات:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => copyUrl(selectedFile.url)}>
                  <Copy className="w-4 h-4 ml-2" />
                  نسخ الرابط
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 ml-2" />
                  تحرير
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};