import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone, Eye, Users, Calendar } from 'lucide-react';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherAnnouncements } from '@/hooks/useTeacherAnnouncements';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import { Badge } from '@/components/ui/badge';

interface TeacherAnnouncementsProps {
  onTabChange: (tab: string) => void;
}

const TeacherAnnouncements: React.FC<TeacherAnnouncementsProps> = ({ onTabChange }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: teacherProfile } = useTeacherProfile();
  const { data: announcements, isLoading } = useTeacherAnnouncements(teacherProfile?.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📝';
      case 'exam': return '📊';
      case 'schedule': return '📅';
      case 'material': return '📚';
      default: return '📢';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">الإعلانات</h1>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
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
          <Megaphone className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">الإعلانات</h1>
            <p className="text-muted-foreground">إدارة إعلانات المقررات والطلاب</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          إعلان جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الإعلانات</p>
                <p className="text-xl font-bold">{announcements?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المنشورة</p>
                <p className="text-xl font-bold">
                  {announcements?.filter(a => a.is_published).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عامة</p>
                <p className="text-xl font-bold">
                  {announcements?.filter(a => a.target_audience === 'all').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الإعلانات */}
      <div className="space-y-4">
        {announcements && announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTypeIcon(announcement.announcement_type)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {announcement.courses?.course_name_ar || 'إعلان عام'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority === 'urgent' ? 'عاجل' :
                       announcement.priority === 'high' ? 'مهم' :
                       announcement.priority === 'normal' ? 'عادي' : 'منخفض'}
                    </Badge>
                    {announcement.is_published ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        منشور
                      </Badge>
                    ) : (
                      <Badge variant="outline">مسودة</Badge>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {announcement.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(announcement.publish_date).toLocaleDateString('ar-SA')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {announcement.target_audience === 'all' ? 'الجميع' :
                       announcement.target_audience === 'students' ? 'الطلاب' : 'مقرر محدد'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
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
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ بإنشاء إعلانك الأول للطلاب
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 ml-1" />
                إنشاء إعلان جديد
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* مودال إنشاء إعلان */}
      <CreateAnnouncementModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};

export default TeacherAnnouncements;