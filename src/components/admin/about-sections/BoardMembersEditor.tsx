import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Eye, User, Upload, Users, Mail, Phone, MapPin, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAboutSection, useUpdateAboutSectionElement } from '@/hooks/useAboutSections';
import { BoardMember } from '@/types/aboutSections';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface BoardMembersEditorProps {
  pageKey: string;
}

export const BoardMembersEditor: React.FC<BoardMembersEditorProps> = ({ pageKey }) => {
  const { data: section, isLoading } = useAboutSection(pageKey);
  const updateElement = useUpdateAboutSectionElement();
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('intro');
  
  const [introAr, setIntroAr] = useState('');
  const [introEn, setIntroEn] = useState('');
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [organizationChartAr, setOrganizationChartAr] = useState('');
  const [organizationChartEn, setOrganizationChartEn] = useState('');

  React.useEffect(() => {
    if (section?.elements) {
      const introElement = section.elements.find(el => el.element_key === 'board-intro');
      if (introElement) {
        setIntroAr(introElement.content_ar || '');
        setIntroEn(introElement.content_en || '');
      }

      const membersElement = section.elements.find(el => el.element_key === 'board-members-list');
      if (membersElement?.metadata?.members) {
        setMembers(membersElement.metadata.members);
      }

      const chartElement = section.elements.find(el => el.element_key === 'organization-chart');
      if (chartElement) {
        setOrganizationChartAr(chartElement.content_ar || '');
        setOrganizationChartEn(chartElement.content_en || '');
      }
    }
  }, [section]);

  const addMember = () => {
    const newMember: BoardMember = {
      name_ar: '',
      name_en: '',
      position_ar: '',
      position_en: '',
      image: '',
      bio_ar: '',
      bio_en: '',
      order: members.length + 1
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (index: number, field: keyof BoardMember, value: string | number) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newMembers = [...members];
    [newMembers[index], newMembers[index - 1]] = [newMembers[index - 1], newMembers[index]];
    setMembers(newMembers);
  };

  const moveDown = (index: number) => {
    if (index === members.length - 1) return;
    const newMembers = [...members];
    [newMembers[index], newMembers[index + 1]] = [newMembers[index + 1], newMembers[index]];
    setMembers(newMembers);
  };

  const saveDraft = async () => {
    try {
      await Promise.all([
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'board-intro',
          elementType: 'rich_text',
          contentAr: introAr,
          contentEn: introEn,
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'board-members-list',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { members },
          status: 'draft'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'organization-chart',
          elementType: 'rich_text',
          contentAr: organizationChartAr,
          contentEn: organizationChartEn,
          status: 'draft'
        })
      ]);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const publish = async () => {
    try {
      await Promise.all([
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'board-intro',
          elementType: 'rich_text',
          contentAr: introAr,
          contentEn: introEn,
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'board-members-list',
          elementType: 'rich_text',
          contentAr: '',
          contentEn: '',
          metadata: { members },
          status: 'published'
        }),
        updateElement.mutateAsync({
          pageKey,
          elementKey: 'organization-chart',
          elementType: 'rich_text',
          contentAr: organizationChartAr,
          contentEn: organizationChartEn,
          status: 'published'
        })
      ]);
    } catch (error) {
      console.error('Error publishing:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">محرر أعضاء مجلس الإدارة</h2>
          <p className="text-muted-foreground">إدارة جميع بيانات أعضاء مجلس إدارة الكلية والهيكل التنظيمي</p>
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
            onClick={saveDraft}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            حفظ مسودة
          </Button>
          <Button
            onClick={publish}
            disabled={updateElement.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            نشر
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="intro">مقدمة</TabsTrigger>
              <TabsTrigger value="members">الأعضاء</TabsTrigger>
              <TabsTrigger value="chart">الهيكل التنظيمي</TabsTrigger>
            </TabsList>

            {/* Introduction Tab */}
            <TabsContent value="intro">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    مقدمة عن مجلس الإدارة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="ar" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ar" className="space-y-4">
                      <RichTextEditor
                        value={introAr}
                        onChange={setIntroAr}
                        label="المقدمة بالعربية"
                        placeholder="يتكون مجلس إدارة الكلية من نخبة من الأكاديميين والمختصين..."
                        height="300px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <RichTextEditor
                        value={introEn}
                        onChange={setIntroEn}
                        label="Introduction in English"
                        placeholder="The college board of directors consists of a group of academics and specialists..."
                        height="300px"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    أعضاء مجلس الإدارة
                  </CardTitle>
                  <Button onClick={addMember} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة عضو
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {members.map((member, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">عضو {index + 1}</Badge>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveDown(index)}
                              disabled={index === members.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeMember(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Tabs defaultValue="ar" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="ar">العربية</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="ar" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>الاسم الكامل</Label>
                                <Input
                                  value={member.name_ar}
                                  onChange={(e) => updateMember(index, 'name_ar', e.target.value)}
                                  placeholder="د. أحمد محمد العلي"
                                />
                              </div>
                              <div>
                                <Label>المنصب</Label>
                                <Input
                                  value={member.position_ar}
                                  onChange={(e) => updateMember(index, 'position_ar', e.target.value)}
                                  placeholder="رئيس مجلس الإدارة"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>السيرة الذاتية والخبرات</Label>
                              <RichTextEditor
                                value={member.bio_ar || ''}
                                onChange={(value) => updateMember(index, 'bio_ar', value)}
                                placeholder="نبذة مفصلة عن العضو وخبراته الأكاديمية والمهنية..."
                                height="200px"
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="en" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Full Name</Label>
                                <Input
                                  value={member.name_en || ''}
                                  onChange={(e) => updateMember(index, 'name_en', e.target.value)}
                                  placeholder="Dr. Ahmed Mohammed Al-Ali"
                                />
                              </div>
                              <div>
                                <Label>Position</Label>
                                <Input
                                  value={member.position_en || ''}
                                  onChange={(e) => updateMember(index, 'position_en', e.target.value)}
                                  placeholder="Chairman of the Board"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Biography and Experience</Label>
                              <RichTextEditor
                                value={member.bio_en || ''}
                                onChange={(value) => updateMember(index, 'bio_en', value)}
                                placeholder="Detailed biography about the member and their academic and professional experience..."
                                height="200px"
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>صورة العضو</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={member.image || ''}
                                onChange={(e) => updateMember(index, 'image', e.target.value)}
                                placeholder="رابط الصورة أو اسم الملف"
                              />
                              <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>ترتيب العرض</Label>
                            <Input
                              type="number"
                              value={member.order || index + 1}
                              onChange={(e) => updateMember(index, 'order', parseInt(e.target.value) || index + 1)}
                              placeholder="1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {members.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد أعضاء مضافة</p>
                      <p className="text-sm">انقر على "إضافة عضو" لبدء الإضافة</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization Chart Tab */}
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    الهيكل التنظيمي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="ar" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ar" className="space-y-4">
                      <RichTextEditor
                        value={organizationChartAr}
                        onChange={setOrganizationChartAr}
                        label="الهيكل التنظيمي بالعربية"
                        placeholder="وصف الهيكل التنظيمي للكلية والإدارات المختلفة..."
                        height="400px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <RichTextEditor
                        value={organizationChartEn}
                        onChange={setOrganizationChartEn}
                        label="Organization Chart in English"
                        placeholder="Description of the college organizational structure and different departments..."
                        height="400px"
                      />
                    </TabsContent>
                  </Tabs>
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
                <CardTitle>معاينة أعضاء مجلس الإدارة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Introduction Preview */}
                {introAr && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">مجلس الإدارة</h3>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: introAr }} />
                  </div>
                )}

                {/* Members Preview */}
                {members.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-4">أعضاء المجلس</h4>
                    <div className="grid gap-6">
                      {members
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((member, index) => (
                        <div key={index} className="flex gap-4 p-4 border rounded-lg">
                          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                            {member.image ? (
                              <img 
                                src={member.image} 
                                alt={member.name_ar}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-lg">{member.name_ar}</h5>
                            <p className="text-primary text-sm mb-2">{member.position_ar}</p>
                            {member.bio_ar && (
                              <div 
                                className="text-sm text-muted-foreground prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: member.bio_ar }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Organization Chart Preview */}
                {organizationChartAr && (
                  <div>
                    <h4 className="font-semibold mb-4">الهيكل التنظيمي</h4>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: organizationChartAr }} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};