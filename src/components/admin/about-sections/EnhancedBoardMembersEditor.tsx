import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Eye, Users, Crown, Plus, Trash2, Upload, User, Calendar } from 'lucide-react';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface BoardMembersEditorProps {
  pageKey: string;
}

interface BoardMember {
  id?: number;
  name: string;
  position: string;
  qualification: string;
  experience: string;
  icon: string;
  category: 'leadership' | 'member';
}

interface Responsibility {
  title: string;
  description: string;
}

interface Meeting {
  type: string;
  frequency: string;
  color: string;
}

export const EnhancedBoardMembersEditor: React.FC<BoardMembersEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  
  const [formData, setFormData] = useState({
    pageTitle: 'مجلس الإدارة',
    pageSubtitle: 'تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية ومسؤولياتهم',
    introduction: '',
    leadershipTitle: 'القيادة التنفيذية',
    membersTitle: 'أعضاء المجلس',
    responsibilitiesTitle: 'مسؤوليات مجلس الإدارة',
    meetingsTitle: 'جدولة الاجتماعات'
  });

  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([
    {
      id: 1,
      name: 'الأستاذ الدكتور أحمد محمد الشامي',
      position: 'رئيس مجلس الإدارة',
      qualification: 'دكتوراه في إدارة الأعمال',
      experience: '25 عاماً في الإدارة التعليمية',
      icon: 'Crown',
      category: 'leadership'
    },
    {
      id: 2,
      name: 'الدكتور محمد عبدالله الحوثي',
      position: 'عميد الكلية',
      qualification: 'دكتوراه في الطب',
      experience: '20 عاماً في التعليم الطبي',
      icon: 'Users',
      category: 'leadership'
    },
    {
      id: 3,
      name: 'الأستاذ علي أحمد المؤيد',
      position: 'نائب رئيس المجلس',
      qualification: 'ماجستير في الإدارة العامة',
      experience: '18 عاماً في الإدارة الأكاديمية',
      icon: 'Building',
      category: 'member'
    },
    {
      id: 4,
      name: 'الدكتورة فاطمة محمد الزبيري',
      position: 'عضو مجلس إدارة',
      qualification: 'دكتوراه في التمريض',
      experience: '15 عاماً في التعليم التمريضي',
      icon: 'Award',
      category: 'member'
    },
    {
      id: 5,
      name: 'الأستاذ يحيى عبدالرحمن الحداد',
      position: 'عضو مجلس إدارة',
      qualification: 'ماجستير في المالية',
      experience: '20 عاماً في الإدارة المالية',
      icon: 'Building',
      category: 'member'
    },
    {
      id: 6,
      name: 'الدكتور صالح أحمد العماد',
      position: 'عضو مجلس إدارة',
      qualification: 'دكتوراه في الصيدلة',
      experience: '12 عاماً في التعليم الصيدلاني',
      icon: 'Award',
      category: 'member'
    }
  ]);

  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([
    {
      title: 'وضع السياسات العامة',
      description: 'وضع السياسات العامة والاستراتيجيات طويلة المدى للكلية'
    },
    {
      title: 'الإشراف الأكاديمي',
      description: 'متابعة جودة البرامج الأكاديمية ومعايير التعليم'
    },
    {
      title: 'الإدارة المالية',
      description: 'الإشراف على الميزانية والموارد المالية للكلية'
    },
    {
      title: 'التطوير المؤسسي',
      description: 'قيادة عمليات التطوير والتحديث المؤسسي'
    }
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      type: 'الاجتماع الاعتيادي',
      frequency: 'كل شهر',
      color: 'bg-university-blue-light'
    },
    {
      type: 'الاجتماع الطارئ',
      frequency: 'عند الحاجة',
      color: 'bg-university-red-light'
    },
    {
      type: 'الاجتماع السنوي',
      frequency: 'مرة في السنة',
      color: 'bg-university-gold-light'
    }
  ]);

  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('main-content');

  React.useEffect(() => {
    if (section?.elements) {
      // Load form data
      const pageTitle = section.elements.find(el => el.element_key === 'page_title');
      const pageSubtitle = section.elements.find(el => el.element_key === 'page_subtitle');
      const introduction = section.elements.find(el => el.element_key === 'introduction');
      
      setFormData({
        pageTitle: pageTitle?.content_ar || 'مجلس الإدارة',
        pageSubtitle: pageSubtitle?.content_ar || 'تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية',
        introduction: introduction?.content_ar || '',
        leadershipTitle: 'القيادة التنفيذية',
        membersTitle: 'أعضاء المجلس',
        responsibilitiesTitle: 'مسؤوليات مجلس الإدارة',
        meetingsTitle: 'جدولة الاجتماعات'
      });

      // Load board members
      const membersElement = section.elements.find(el => el.element_key === 'board_members');
      if (membersElement?.metadata?.members) {
        setBoardMembers(membersElement.metadata.members);
      }

      // Load responsibilities
      const responsibilitiesElement = section.elements.find(el => el.element_key === 'responsibilities');
      if (responsibilitiesElement?.metadata?.responsibilities) {
        setResponsibilities(responsibilitiesElement.metadata.responsibilities);
      }

      // Load meetings
      const meetingsElement = section.elements.find(el => el.element_key === 'meetings');
      if (meetingsElement?.metadata?.meetings) {
        setMeetings(meetingsElement.metadata.meetings);
      }
    }
  }, [section]);

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      const updates = [
        { key: 'page_title', type: 'text' as const, content: formData.pageTitle },
        { key: 'page_subtitle', type: 'text' as const, content: formData.pageSubtitle },
        { key: 'introduction', type: 'rich_text' as const, content: formData.introduction }
      ];

      // Save main content elements
      await Promise.all(updates.map(update => 
        updateElement.mutateAsync({
          pageKey,
          elementKey: update.key,
          elementType: update.type,
          contentAr: update.content,
          status
        })
      ));

      // Save board members
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'board_members',
        elementType: 'rich_text',
        contentAr: '',
        metadata: { members: boardMembers },
        status
      });

      // Save responsibilities
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'responsibilities',
        elementType: 'rich_text',
        contentAr: '',
        metadata: { responsibilities },
        status
      });

      // Save meetings
      await updateElement.mutateAsync({
        pageKey,
        elementKey: 'meetings',
        elementType: 'rich_text',
        contentAr: '',
        metadata: { meetings },
        status
      });

    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const addBoardMember = () => {
    setBoardMembers([...boardMembers, {
      name: '',
      position: '',
      qualification: '',
      experience: '',
      icon: 'User',
      category: 'member'
    }]);
  };

  const updateBoardMember = (index: number, field: keyof BoardMember, value: string | 'leadership' | 'member') => {
    const updated = [...boardMembers];
    updated[index] = { ...updated[index], [field]: value };
    setBoardMembers(updated);
  };

  const removeBoardMember = (index: number) => {
    setBoardMembers(boardMembers.filter((_, i) => i !== index));
  };

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, {
      title: '',
      description: ''
    }]);
  };

  const updateResponsibility = (index: number, field: keyof Responsibility, value: string) => {
    const updated = [...responsibilities];
    updated[index] = { ...updated[index], [field]: value };
    setResponsibilities(updated);
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const addMeeting = () => {
    setMeetings([...meetings, {
      type: '',
      frequency: '',
      color: 'bg-university-blue-light'
    }]);
  };

  const updateMeeting = (index: number, field: keyof Meeting, value: string) => {
    const updated = [...meetings];
    updated[index] = { ...updated[index], [field]: value };
    setMeetings(updated);
  };

  const removeMeeting = (index: number) => {
    setMeetings(meetings.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل محرر مجلس الإدارة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">محرر مجلس الإدارة المتطور</h2>
          <p className="text-muted-foreground">إدارة شاملة لجميع معلومات أعضاء مجلس الإدارة</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {preview ? 'إخفاء المعاينة' : 'معاينة'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ مسودة
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            {updateElement.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            نشر التغييرات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="main-content">المعلومات الأساسية</TabsTrigger>
              <TabsTrigger value="members">أعضاء المجلس</TabsTrigger>
              <TabsTrigger value="responsibilities">المسؤوليات</TabsTrigger>
              <TabsTrigger value="meetings">الاجتماعات</TabsTrigger>
            </TabsList>

            {/* Main Content Tab */}
            <TabsContent value="main-content">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الصفحة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>عنوان الصفحة</Label>
                      <Input
                        value={formData.pageTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, pageTitle: e.target.value }))}
                        placeholder="مجلس الإدارة"
                      />
                    </div>
                    <div>
                      <Label>وصف الصفحة</Label>
                      <Textarea
                        value={formData.pageSubtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, pageSubtitle: e.target.value }))}
                        placeholder="تعرف على أعضاء مجلس إدارة كلية إيلول الجامعية..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>مقدمة عن المجلس</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RichTextEditor
                      value={formData.introduction}
                      onChange={(value) => setFormData(prev => ({ ...prev, introduction: value }))}
                      placeholder="يتكون مجلس إدارة كلية إيلول الجامعية من نخبة من الأكاديميين..."
                      height="200px"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    أعضاء مجلس الإدارة ({boardMembers.length})
                  </CardTitle>
                  <Button onClick={addBoardMember} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة عضو
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {boardMembers.map((member, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge variant={member.category === 'leadership' ? 'default' : 'secondary'}>
                            {member.category === 'leadership' ? 'قيادي' : 'عضو'} {index + 1}
                          </Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeBoardMember(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>اسم العضو</Label>
                            <Input
                              value={member.name}
                              onChange={(e) => updateBoardMember(index, 'name', e.target.value)}
                              placeholder="الأستاذ الدكتور أحمد محمد الشامي"
                            />
                          </div>
                          <div>
                            <Label>المنصب</Label>
                            <Input
                              value={member.position}
                              onChange={(e) => updateBoardMember(index, 'position', e.target.value)}
                              placeholder="رئيس مجلس الإدارة"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>المؤهل العلمي</Label>
                            <Input
                              value={member.qualification}
                              onChange={(e) => updateBoardMember(index, 'qualification', e.target.value)}
                              placeholder="دكتوراه في إدارة الأعمال"
                            />
                          </div>
                          <div>
                            <Label>سنوات الخبرة</Label>
                            <Input
                              value={member.experience}
                              onChange={(e) => updateBoardMember(index, 'experience', e.target.value)}
                              placeholder="25 عاماً في الإدارة التعليمية"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>الأيقونة</Label>
                            <select
                              value={member.icon}
                              onChange={(e) => updateBoardMember(index, 'icon', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="Crown">Crown (تاج)</option>
                              <option value="Users">Users (مجموعة)</option>
                              <option value="Building">Building (مبنى)</option>
                              <option value="Award">Award (جائزة)</option>
                              <option value="User">User (مستخدم)</option>
                            </select>
                          </div>
                          <div>
                            <Label>نوع العضوية</Label>
                            <select
                              value={member.category}
                              onChange={(e) => updateBoardMember(index, 'category', e.target.value as 'leadership' | 'member')}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="leadership">قيادة تنفيذية</option>
                              <option value="member">عضو عادي</option>
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Responsibilities Tab */}
            <TabsContent value="responsibilities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    مسؤوليات المجلس ({responsibilities.length})
                  </CardTitle>
                  <Button onClick={addResponsibility} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة مسؤولية
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {responsibilities.map((responsibility, index) => (
                    <Card key={index} className="border-l-4 border-l-secondary">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">مسؤولية {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeResponsibility(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>عنوان المسؤولية</Label>
                          <Input
                            value={responsibility.title}
                            onChange={(e) => updateResponsibility(index, 'title', e.target.value)}
                            placeholder="وضع السياسات العامة"
                          />
                        </div>
                        <div>
                          <Label>وصف المسؤولية</Label>
                          <Textarea
                            value={responsibility.description}
                            onChange={(e) => updateResponsibility(index, 'description', e.target.value)}
                            placeholder="وضع السياسات العامة والاستراتيجيات طويلة المدى..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meetings Tab */}
            <TabsContent value="meetings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    جدولة الاجتماعات ({meetings.length})
                  </CardTitle>
                  <Button onClick={addMeeting} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة اجتماع
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {meetings.map((meeting, index) => (
                    <Card key={index} className="border-l-4 border-l-accent">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">اجتماع {index + 1}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMeeting(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>نوع الاجتماع</Label>
                            <Input
                              value={meeting.type}
                              onChange={(e) => updateMeeting(index, 'type', e.target.value)}
                              placeholder="الاجتماع الاعتيادي"
                            />
                          </div>
                          <div>
                            <Label>التكرار</Label>
                            <Input
                              value={meeting.frequency}
                              onChange={(e) => updateMeeting(index, 'frequency', e.target.value)}
                              placeholder="كل شهر"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>لون البطاقة</Label>
                          <select
                            value={meeting.color}
                            onChange={(e) => updateMeeting(index, 'color', e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="bg-university-blue-light">الأزرق الفاتح</option>
                            <option value="bg-university-red-light">الأحمر الفاتح</option>
                            <option value="bg-university-gold-light">الذهبي الفاتح</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        {preview && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  معاينة مباشرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {/* Page Header Preview */}
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                    <h1 className="text-2xl font-bold mb-2">{formData.pageTitle}</h1>
                    <p className="text-muted-foreground">{formData.pageSubtitle}</p>
                  </div>

                  {/* Introduction Preview */}
                  <div className="p-4 border rounded-lg">
                    <div 
                      className="text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: formData.introduction }}
                    />
                  </div>

                  {/* Members Preview */}
                  <div>
                    <h3 className="font-bold mb-3">أعضاء المجلس</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {boardMembers.map((member, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          member.category === 'leadership' ? 'bg-primary/5 border-primary/20' : 'bg-secondary/5 border-secondary/20'
                        }`}>
                          <h4 className="font-semibold text-xs mb-1">{member.name}</h4>
                          <p className="text-xs text-primary mb-1">{member.position}</p>
                          <p className="text-xs text-muted-foreground">{member.qualification}</p>
                          <p className="text-xs text-muted-foreground">{member.experience}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities Preview */}
                  <div>
                    <h3 className="font-bold mb-3">المسؤوليات</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {responsibilities.map((resp, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-semibold text-xs mb-1">{resp.title}</h4>
                          <p className="text-xs text-muted-foreground">{resp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meetings Preview */}
                  <div>
                    <h3 className="font-bold mb-3">الاجتماعات</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {meetings.map((meeting, index) => (
                        <div key={index} className={`p-3 ${meeting.color} rounded-lg text-center`}>
                          <h4 className="font-semibold text-xs mb-1">{meeting.type}</h4>
                          <p className="text-xs">{meeting.frequency}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};