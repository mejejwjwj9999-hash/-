import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Users,
  Crown,
  Target,
  BookOpen,
  Award,
  Search,
  User,
  ExternalLink,
  Filter,
  Loader2,
  Calendar,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAboutSections, useAboutSectionStats, useUpdateAboutSection } from '@/hooks/useAboutSections';
import { AboutSection, SectionType } from '@/types/aboutSections';

const getSectionIcon = (pageKey: string) => {
  const iconMap: Record<string, any> = {
    'about-college': Users,
    'about-dean-word': User,
    'about-vision-mission': Target,
    'about-board-members': Crown,
    'about-quality-assurance': Award,
    'about-scientific-research': Search,
  };
  return iconMap[pageKey] || BookOpen;
};

export const AboutSectionsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: sections = [], isLoading, error } = useAboutSections();
  const stats = useAboutSectionStats();
  const updateSection = useUpdateAboutSection();

  // تصفية الأقسام حسب البحث والحالة
  const filteredSections = sections.filter(section => {
    const matchesSearch = !searchQuery || 
      section.page_name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description_ar?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && section.is_active) ||
      (statusFilter === 'inactive' && !section.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = (pageKey: string, currentStatus: boolean) => {
    updateSection.mutate({
      pageKey,
      updates: { is_active: !currentStatus }
    });
  };

  const handleEditSection = (section: AboutSection) => {
    navigate(`/admin/about-sections/${section.page_key}/edit`);
  };

  const handleViewSection = (section: AboutSection) => {
    // فتح صفحة العرض العام في تبويب جديد
    const viewUrl = `/${section.page_key.replace('about-', '')}`;
    window.open(viewUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل الأقسام...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8" dir="rtl">
        <p>حدث خطأ في تحميل الأقسام</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-foreground">إدارة أقسام عن الكلية</h2>
          <p className="text-muted-foreground">إدارة وتحرير أقسام "عن الكلية" في الموقع الإلكتروني</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="البحث في الأقسام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 ml-2" />
            <SelectValue placeholder="تصفية بالحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            <SelectItem value="active">الأقسام النشطة</SelectItem>
            <SelectItem value="inactive">الأقسام غير النشطة</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>عرض {filteredSections.length} من {sections.length} قسم</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{stats.totalSections}</p>
                <p className="text-sm text-muted-foreground">إجمالي الأقسام</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{stats.activeSections}</p>
                <p className="text-sm text-muted-foreground">أقسام نشطة</p>
              </div>
              <Eye className="h-8 w-8 text-green-600/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{stats.inactiveSections}</p>
                <p className="text-sm text-muted-foreground">أقسام غير نشطة</p>
              </div>
              <EyeOff className="h-8 w-8 text-orange-600/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{stats.sectionsWithContent}</p>
                <p className="text-sm text-muted-foreground">أقسام بمحتوى</p>
              </div>
              <Save className="h-8 w-8 text-blue-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-6">
        {filteredSections.map((section, index) => {
          const IconComponent = getSectionIcon(section.page_key);
          const hasContent = section.elements && section.elements.length > 0;
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className={`h-2 ${section.is_active ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-gray-400 to-gray-300'}`}></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6 flex-1">
                    <div className="flex-1 text-right">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-2">
                            {section.is_active ? (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                نشط
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">
                                غير نشط
                              </Badge>
                            )}
                            {hasContent && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                يحتوي على محتوى ({section.elements?.length})
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${section.is_active ? 'bg-primary/10' : 'bg-gray-100'}`}>
                              <IconComponent className={`w-6 h-6 ${section.is_active ? 'text-primary' : 'text-gray-500'}`} />
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-2">{section.page_name_ar}</h3>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {section.description_ar}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              المفتاح: {section.page_key}
                            </span>
                          </div>
                          <span>آخر تحديث: {new Date(section.updated_at || section.created_at || '').toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSection(section)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <ExternalLink className="w-4 h-4 ml-2" />
                      عرض
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSection(section)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تحرير
                    </Button>
                    
                    <Switch
                      checked={section.is_active}
                      onCheckedChange={() => handleToggleActive(section.page_key, section.is_active)}
                      className="data-[state=checked]:bg-green-600"
                      disabled={updateSection.isPending}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-500 border-gray-200 hover:bg-gray-50"
                      disabled
                      title="الحذف غير متاح للأقسام الأساسية"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSections.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || statusFilter !== 'all' ? 'لا توجد نتائج' : 'لا توجد أقسام'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'لم يتم العثور على أقسام تطابق المعايير المحددة'
                : 'لم يتم إنشاء أي أقسام لصفحة "عن الكلية" بعد'
              }
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                إعادة تعيين التصفية
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};