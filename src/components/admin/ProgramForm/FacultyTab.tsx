import React, { useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
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
import { Plus, Edit, Trash2, User, GraduationCap, Mail, Phone } from 'lucide-react';
import { ProgramFormData, FacultyMember } from './types';
import { useAdminTeachers } from '@/hooks/useAdminTeachers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EnhancedImageUpload from '@/components/editors/EnhancedImageUpload';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface FacultyTabProps {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData | ((prev: ProgramFormData) => ProgramFormData)) => void;
}

const createEmptyFacultyMember = (): FacultyMember => ({
  id: Date.now().toString(),
  teacher_profile_id: undefined,
  name_ar: '',
  name_en: '',
  position_ar: '',
  position_en: '',
  qualification_ar: '',
  qualification_en: '',
  specialization_ar: '',
  specialization_en: '',
  university_ar: '',
  university_en: '',
  email: '',
  phone: '',
  profile_image: '',
  bio_ar: '',
  bio_en: '',
  research_interests: [],
  publications: [],
  order: 0
});

export const FacultyTab: React.FC<FacultyTabProps> = ({ formData, setFormData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FacultyMember | null>(null);
  const [memberData, setMemberData] = useState<FacultyMember>(createEmptyFacultyMember());

  // جلب المعلمين النشطين لاستخدامهم في الاختيار
  const { data: teachers } = useAdminTeachers();

  const teacherOptions = useMemo(() => (
    (teachers || []).map(t => ({
      id: t.id,
      label: `${t.first_name} ${t.last_name}`.trim(),
      email: t.email,
      position: t.position,
      specialization: t.specialization,
      profile_image_url: t.profile_image_url,
    }))
  ), [teachers]);

  const handleAddMember = () => {
    setEditingMember(null);
    setMemberData(createEmptyFacultyMember());
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: FacultyMember) => {
    setEditingMember(member);
    setMemberData({ ...member });
    setIsDialogOpen(true);
  };

  const handleSaveMember = () => {
    // إذا تم اختيار معلم، قم بملء الحقول من ملفه تلقائياً مع السماح بالتعديل
    if (memberData.teacher_profile_id) {
      const selected = teacherOptions.find(t => t.id === memberData.teacher_profile_id);
      if (selected) {
        memberData.name_ar = memberData.name_ar || selected.label;
        memberData.email = memberData.email || selected.email || '';
        memberData.profile_image = memberData.profile_image || selected.profile_image_url || '';
        memberData.position_ar = memberData.position_ar || selected.position || '';
        memberData.specialization_ar = memberData.specialization_ar || selected.specialization || '';
      }
    }
    if (!memberData.name_ar || !memberData.position_ar) return;

    setFormData(prev => {
      const newMembers = [...prev.faculty_members];
      
      if (editingMember) {
        const index = newMembers.findIndex(m => m.id === editingMember.id);
        if (index !== -1) {
          newMembers[index] = memberData;
        }
      } else {
        memberData.order = newMembers.length;
        newMembers.push(memberData);
      }

      return { ...prev, faculty_members: newMembers };
    });

    setIsDialogOpen(false);
  };

  const handleDeleteMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      faculty_members: prev.faculty_members.filter(m => m.id !== memberId)
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(formData.faculty_members);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // تحديث ترتيب العناصر
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setFormData(prev => ({ ...prev, faculty_members: updatedItems }));
  };

  const addResearchInterest = () => {
    setMemberData(prev => ({
      ...prev,
      research_interests: [...(prev.research_interests || []), '']
    }));
  };

  const updateResearchInterest = (index: number, value: string) => {
    setMemberData(prev => ({
      ...prev,
      research_interests: prev.research_interests?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const removeResearchInterest = (index: number) => {
    setMemberData(prev => ({
      ...prev,
      research_interests: prev.research_interests?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">أعضاء هيئة التدريس</h3>
          <p className="text-sm text-muted-foreground">إدارة أعضاء هيئة التدريس المسؤولين عن البرنامج</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddMember} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              إضافة عضو هيئة تدريس
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'تحرير عضو هيئة التدريس' : 'إضافة عضو هيئة تدريس جديد'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* الصورة الشخصية */}
              <div className="space-y-2">
                <Label>الصورة الشخصية</Label>
                <EnhancedImageUpload
                  onImageSelect={(url) => setMemberData(prev => ({ ...prev, profile_image: url }))}
                />
              </div>

              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اختيار معلم موجود</Label>
              <Select
                onValueChange={(value) => setMemberData(prev => ({ ...prev, teacher_profile_id: value }))}
                value={memberData.teacher_profile_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر معلمًا (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  {(teacherOptions || []).map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">سيتم ربط العضو بسجل المعلم دون تكرار البيانات.</p>
            </div>

            <div className="space-y-2">
                  <Label>الاسم بالعربية <span className="text-destructive">*</span></Label>
                  <Input
                    value={memberData.name_ar}
                    onChange={(e) => setMemberData(prev => ({ ...prev, name_ar: e.target.value }))}
                    placeholder="د. أحمد محمد الشامي"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزية</Label>
                  <Input
                    value={memberData.name_en}
                    onChange={(e) => setMemberData(prev => ({ ...prev, name_en: e.target.value }))}
                    placeholder="Dr. Ahmed Mohammed Al-Shami"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المنصب بالعربية <span className="text-destructive">*</span></Label>
                  <Input
                    value={memberData.position_ar}
                    onChange={(e) => setMemberData(prev => ({ ...prev, position_ar: e.target.value }))}
                    placeholder="رئيس القسم - أستاذ الصيدلة السريرية"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>المنصب بالإنجليزية</Label>
                  <Input
                    value={memberData.position_en}
                    onChange={(e) => setMemberData(prev => ({ ...prev, position_en: e.target.value }))}
                    placeholder="Head of Department - Professor of Clinical Pharmacy"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المؤهل العلمي بالعربية</Label>
                  <Input
                    value={memberData.qualification_ar}
                    onChange={(e) => setMemberData(prev => ({ ...prev, qualification_ar: e.target.value }))}
                    placeholder="دكتوراه في الصيدلة السريرية"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>المؤهل العلمي بالإنجليزية</Label>
                  <Input
                    value={memberData.qualification_en}
                    onChange={(e) => setMemberData(prev => ({ ...prev, qualification_en: e.target.value }))}
                    placeholder="PhD in Clinical Pharmacy"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التخصص بالعربية</Label>
                  <Input
                    value={memberData.specialization_ar}
                    onChange={(e) => setMemberData(prev => ({ ...prev, specialization_ar: e.target.value }))}
                    placeholder="الصيدلة السريرية"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>التخصص بالإنجليزية</Label>
                  <Input
                    value={memberData.specialization_en}
                    onChange={(e) => setMemberData(prev => ({ ...prev, specialization_en: e.target.value }))}
                    placeholder="Clinical Pharmacy"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الجامعة بالعربية</Label>
                  <Input
                    value={memberData.university_ar}
                    onChange={(e) => setMemberData(prev => ({ ...prev, university_ar: e.target.value }))}
                    placeholder="جامعة القاهرة"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>الجامعة بالإنجليزية</Label>
                  <Input
                    value={memberData.university_en}
                    onChange={(e) => setMemberData(prev => ({ ...prev, university_en: e.target.value }))}
                    placeholder="Cairo University"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* معلومات الاتصال */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={memberData.email}
                    onChange={(e) => setMemberData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ahmed.alshami@university.edu"
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={memberData.phone}
                    onChange={(e) => setMemberData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+967 1 234567"
                  />
                </div>
              </div>

              {/* السيرة الذاتية */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>السيرة الذاتية بالعربية</Label>
                  <Textarea
                    value={memberData.bio_ar}
                    onChange={(e) => setMemberData(prev => ({ ...prev, bio_ar: e.target.value }))}
                    placeholder="نبذة عن السيرة الذاتية والخبرات..."
                    dir="rtl"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>السيرة الذاتية بالإنجليزية</Label>
                  <Textarea
                    value={memberData.bio_en}
                    onChange={(e) => setMemberData(prev => ({ ...prev, bio_en: e.target.value }))}
                    placeholder="Brief biography and experience..."
                    dir="ltr"
                    rows={4}
                  />
                </div>
              </div>

              {/* اهتمامات البحث */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>اهتمامات البحث</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addResearchInterest}>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة اهتمام بحثي
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {(memberData.research_interests || []).map((interest, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={interest}
                        onChange={(e) => updateResearchInterest(index, e.target.value)}
                        placeholder="مجال البحث"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeResearchInterest(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* أزرار الحفظ */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveMember}>
                  {editingMember ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* قائمة أعضاء هيئة التدريس */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="faculty-members">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {formData.faculty_members.map((member, index) => (
                <Draggable key={member.id} draggableId={member.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* الصورة الشخصية */}
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                            {member.profile_image ? (
                              <img 
                                src={member.profile_image} 
                                alt={member.name_ar}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>

                          {/* المعلومات */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-lg">{member.name_ar}</h4>
                                {member.name_en && (
                                  <p className="text-sm text-muted-foreground">{member.name_en}</p>
                                )}
                                <p className="text-sm font-medium text-primary mt-1">{member.position_ar}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {member.qualification_ar && (
                                    <Badge variant="secondary" className="text-xs">
                                      <GraduationCap className="w-3 h-3 mr-1" />
                                      {member.qualification_ar}
                                    </Badge>
                                  )}
                                  {member.university_ar && (
                                    <Badge variant="outline" className="text-xs">
                                      {member.university_ar}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                  {member.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {member.email}
                                    </div>
                                  )}
                                  {member.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {member.phone}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* أزرار الإجراءات */}
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditMember(member)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>حذف عضو هيئة التدريس</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        هل أنت متأكد من حذف {member.name_ar}؟ لا يمكن التراجع عن هذا الإجراء.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        حذف
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {formData.faculty_members.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              لم يتم إضافة أي أعضاء هيئة تدريس بعد.<br />
              انقر على "إضافة عضو هيئة تدريس" لبدء إضافة الأعضاء.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};