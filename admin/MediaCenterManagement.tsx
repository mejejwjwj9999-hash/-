import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar, Image, Video, BarChart3 } from 'lucide-react';
import { NewsEventsManagement } from './NewsEventsManagement';
import { MediaLibraryManagement } from './MediaLibraryManagement';
import { useAdminNewsEvents } from '@/hooks/useAdminNewsEvents';
import { useAdminMediaLibrary } from '@/hooks/useAdminMediaLibrary';

export const MediaCenterManagement = () => {
  const { data: newsEvents = [] } = useAdminNewsEvents();
  const { data: mediaItems = [] } = useAdminMediaLibrary();

  // Statistics
  const stats = {
    totalNews: newsEvents.filter(item => item.type === 'news').length,
    totalEvents: newsEvents.filter(item => item.type === 'event').length,
    publishedItems: newsEvents.filter(item => item.status === 'published').length,
    draftItems: newsEvents.filter(item => item.status === 'draft').length,
    totalImages: mediaItems.filter(item => item.media_type === 'image').length,
    totalVideos: mediaItems.filter(item => item.media_type === 'video').length,
    totalDocuments: mediaItems.filter(item => item.media_type === 'document').length,
    totalViews: newsEvents.reduce((sum, item) => sum + (item.views_count || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-university-blue">إدارة المركز الإعلامي</h1>
        <p className="text-academic-gray mt-2">إدارة الأخبار والفعاليات والمحتوى الإعلامي</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-academic-gray">إجمالي الأخبار</p>
                <p className="text-2xl font-bold text-university-blue">{stats.totalNews}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-academic-gray">إجمالي الفعاليات</p>
                <p className="text-2xl font-bold text-university-blue">{stats.totalEvents}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-academic-gray">الصور والفيديوهات</p>
                <p className="text-2xl font-bold text-university-blue">
                  {stats.totalImages + stats.totalVideos}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Image className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-academic-gray">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-university-blue">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center">
              <Newspaper className="w-5 h-5 ml-2" />
              حالة المحتوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">منشور</Badge>
                  <span className="text-sm text-academic-gray">المحتوى المنشور</span>
                </div>
                <span className="font-semibold">{stats.publishedItems}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">مسودة</Badge>
                  <span className="text-sm text-academic-gray">في الانتظار</span>
                </div>
                <span className="font-semibold">{stats.draftItems}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center">
              <Video className="w-5 h-5 ml-2" />
              المكتبة الإعلامية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">صور</Badge>
                  <span className="text-sm text-academic-gray">الصور المرفوعة</span>
                </div>
                <span className="font-semibold">{stats.totalImages}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-800">فيديوهات</Badge>
                  <span className="text-sm text-academic-gray">مقاطع الفيديو</span>
                </div>
                <span className="font-semibold">{stats.totalVideos}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-800">مستندات</Badge>
                  <span className="text-sm text-academic-gray">الملفات الأخرى</span>
                </div>
                <span className="font-semibold">{stats.totalDocuments}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="news-events" className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger 
                  value="news-events" 
                  className="flex items-center gap-2 data-[state=active]:bg-university-blue data-[state=active]:text-white"
                >
                  <Newspaper className="w-4 h-4" />
                  الأخبار والفعاليات
                </TabsTrigger>
                <TabsTrigger 
                  value="media-library" 
                  className="flex items-center gap-2 data-[state=active]:bg-university-blue data-[state=active]:text-white"
                >
                  <Image className="w-4 h-4" />
                  المكتبة الإعلامية
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="news-events" className="mt-0">
                <NewsEventsManagement />
              </TabsContent>
              
              <TabsContent value="media-library" className="mt-0">
                <MediaLibraryManagement />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};