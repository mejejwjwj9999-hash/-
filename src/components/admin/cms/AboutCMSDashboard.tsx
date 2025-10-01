import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  BarChart3, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Target, 
  UserCheck, 
  Award, 
  Microscope,
  Filter,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAboutSections, useAboutSectionStats } from '@/hooks/useAboutSections';
import { useNavigate } from 'react-router-dom';

export const AboutCMSDashboard: React.FC = () => {
  const { data: sections = [], isLoading } = useAboutSections();
  const stats = useAboutSectionStats();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const sectionConfig = {
    'about-college': {
      title: 'من نحن',
      titleEn: 'About Us',
      icon: FileText,
      color: 'bg-blue-500',
      description: 'معلومات عامة عن الكلية وتاريخها',
      route: '/admin/about-sections/about-college'
    },
    'about-dean-word': {
      title: 'كلمة عميد الكلية',
      titleEn: "Dean's Message", 
      icon: UserCheck,
      color: 'bg-green-500',
      description: 'رسالة العميد والسيرة الذاتية',
      route: '/admin/about-sections/about-dean-word'
    },
    'about-vision-mission': {
      title: 'الرؤية والرسالة والأهداف',
      titleEn: 'Vision, Mission & Goals',
      icon: Target,
      color: 'bg-purple-500',
      description: 'رؤية ورسالة وأهداف الكلية',
      route: '/admin/about-sections/about-vision-mission'
    },
    'about-board-members': {
      title: 'مجلس الإدارة',
      titleEn: 'Board of Directors',
      icon: Users,
      color: 'bg-orange-500',
      description: 'أعضاء مجلس إدارة الكلية',
      route: '/admin/about-sections/about-board-members'
    },
    'about-quality-assurance': {
      title: 'وحدة التطوير وضمان الجودة',
      titleEn: 'Quality Assurance Unit',
      icon: Award,
      color: 'bg-teal-500',
      description: 'معلومات وحدة ضمان الجودة',
      route: '/admin/about-sections/about-quality-assurance'
    },
    'about-scientific-research': {
      title: 'البحث العلمي',
      titleEn: 'Scientific Research',
      icon: Microscope,
      color: 'bg-red-500',
      description: 'مركز البحث العلمي والدراسات',
      route: '/admin/about-sections/about-scientific-research'
    }
  };

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.page_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.page_key.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && section.is_active) ||
                         (filterStatus === 'inactive' && !section.is_active);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (isActive: boolean, elementsCount: number) => {
    if (!isActive) return <Badge variant="destructive">غير نشط</Badge>;
    if (elementsCount === 0) return <Badge variant="outline">فارغ</Badge>;
    return <Badge variant="default">منشور</Badge>;
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">نظام إدارة محتوى أقسام "عن الكلية"</h1>
          <p className="text-muted-foreground">إدارة شاملة لجميع صفحات معلومات الكلية</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/cms/media-library')}>
            <ImageIcon className="w-4 h-4 ml-2" />
            مكتبة الوسائط
          </Button>
          <Button onClick={() => navigate('/admin/cms/analytics')}>
            <BarChart3 className="w-4 h-4 ml-2" />
            التحليلات
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأقسام</p>
                <p className="text-2xl font-bold">{stats.totalSections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الأقسام النشطة</p>
                <p className="text-2xl font-bold">{stats.activeSections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الأقسام بمحتوى</p>
                <p className="text-2xl font-bold">{stats.sectionsWithContent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">آخر تحديث</p>
                <p className="text-sm font-medium">
                  {stats.lastUpdated ? new Date(parseInt(stats.lastUpdated)).toLocaleDateString('ar-SA') : 'لم يتم التحديث'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
          <Input
            placeholder="البحث في الأقسام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-right"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            الكل
          </Button>
          <Button 
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
            size="sm"
          >
            نشط
          </Button>
          <Button 
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('inactive')}
            size="sm"
          >
            غير نشط
          </Button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(sectionConfig).map(([key, config]) => {
          const section = sections.find(s => s.page_key === key);
          const Icon = config.icon;
          const elementsCount = section?.elements?.length || 0;
          
          return (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${config.color} rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{config.titleEn}</p>
                    </div>
                  </div>
                  {section && getStatusBadge(section.is_active, elementsCount)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {config.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>العناصر: {elementsCount}</span>
                  <span>
                    آخر تحديث: {section?.updated_at ? 
                      new Date(section.updated_at).toLocaleDateString('ar-SA') : 
                      'لم يتم التحديث'
                    }
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => navigate(`${config.route}/edit`)}
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تحرير
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(config.route.replace('/admin', ''))}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/admin/cms/bulk-editor')}
            >
              <FileText className="w-6 h-6" />
              تحرير مجمع
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/admin/cms/export-import')}
            >
              <Plus className="w-6 h-6" />
              استيراد/تصدير
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => navigate('/admin/cms/settings')}
            >
              <Filter className="w-6 h-6" />
              إعدادات النظام
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};