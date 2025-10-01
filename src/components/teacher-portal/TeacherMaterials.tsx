import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Upload, Download, Eye, FileText, Image, Video } from 'lucide-react';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherMaterials } from '@/hooks/useTeacherMaterials';
import { Badge } from '@/components/ui/badge';

interface TeacherMaterialsProps {
  onTabChange: (tab: string) => void;
}

const TeacherMaterials: React.FC<TeacherMaterialsProps> = ({ onTabChange }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const { data: teacherProfile } = useTeacherProfile();
  const { data: materials, isLoading } = useTeacherMaterials(teacherProfile?.id);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('video')) return <Video className="h-5 w-5 text-red-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture': return 'محاضرة';
      case 'assignment': return 'واجب';
      case 'reference': return 'مرجع';
      case 'exam': return 'امتحان';
      default: return 'عام';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">المواد التعليمية</h1>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* العنوان وأزرار الإجراءات */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">المواد التعليمية</h1>
            <p className="text-muted-foreground">إدارة ملفات ومواد المقررات</p>
          </div>
        </div>
        
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          رفع مادة جديدة
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الملفات</p>
                <p className="text-xl font-bold">{materials?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">محاضرات</p>
                <p className="text-xl font-bold">
                  {materials?.filter(m => m.material_type === 'lecture').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي التحميلات</p>
                <p className="text-xl font-bold">
                  {materials?.reduce((acc, m) => acc + (m.download_count || 0), 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عامة</p>
                <p className="text-xl font-bold">
                  {materials?.filter(m => m.is_public).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة المواد */}
      <div className="space-y-4">
        {materials && materials.length > 0 ? (
          materials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(material.file_type)}
                    <div>
                      <h3 className="font-semibold text-lg">{material.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {material.file_name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {getMaterialTypeLabel(material.material_type)}
                    </Badge>
                    {material.is_required && (
                      <Badge variant="destructive">مطلوب</Badge>
                    )}
                    {material.is_public ? (
                      <Badge className="bg-green-100 text-green-800">عام</Badge>
                    ) : (
                      <Badge variant="outline">خاص</Badge>
                    )}
                  </div>
                </div>

                {material.description && (
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {material.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatFileSize(material.file_size || 0)}</span>
                    {material.week_number && (
                      <span>الأسبوع {material.week_number}</span>
                    )}
                    <span>{material.download_count || 0} تحميل</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 ml-1" />
                      تحميل
                    </Button>
                    <Button variant="outline" size="sm">
                      تعديل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد مواد تعليمية</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ برفع المواد التعليمية لمقرراتك
              </p>
              <Button>
                <Upload className="h-4 w-4 ml-1" />
                رفع مادة جديدة
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherMaterials;