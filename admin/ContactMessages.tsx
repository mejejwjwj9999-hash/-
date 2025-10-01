import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Reply,
  Calendar
} from 'lucide-react';
import { useContactMessages } from '@/hooks/useContactMessages';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  is_read: boolean;
  created_at: string;
  replied_at?: string;
  replied_by?: string;
  admin_notes?: string;
}

const ContactMessages = () => {
  const { data: messages, isLoading, error } = useContactMessages();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [replyText, setReplyText] = useState('');
  const [showReplyDialog, setShowReplyDialog] = useState(false);

  const filteredMessages = messages?.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string, isRead: boolean) => {
    if (status === 'replied') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />تم الرد</Badge>;
    } else if (isRead) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Eye className="w-3 h-3 mr-1" />مقروء</Badge>;
    } else {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />جديد</Badge>;
    }
  };

  const getUnreadCount = () => messages?.filter(m => !m.is_read).length || 0;

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    // TODO: Implement reply functionality
    console.log('Reply to:', selectedMessage.email, 'Message:', replyText);
    
    setShowReplyDialog(false);
    setReplyText('');
    setSelectedMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-university-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          حدث خطأ في تحميل الرسائل. يرجى المحاولة مرة أخرى.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-university-blue">رسائل التواصل</h1>
          <p className="text-muted-foreground">إدارة رسائل "اتصل بنا" والاستفسارات</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-university-blue">{getUnreadCount()}</div>
          <div className="text-sm text-muted-foreground">رسالة جديدة</div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الرسائل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="unread">جديد</TabsTrigger>
                <TabsTrigger value="read">مقروء</TabsTrigger>
                <TabsTrigger value="replied">تم الرد</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid gap-4">
        {filteredMessages?.map((message) => (
          <Card key={message.id} className={`hover:shadow-md transition-shadow ${!message.is_read ? 'border-r-4 border-r-university-blue bg-university-blue/5' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-university-blue/10 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-university-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{message.name}</h3>
                        {getStatusBadge(message.status, message.is_read)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {message.subject || 'بدون موضوع'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mr-13">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {message.email}
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {message.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(message.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                    </div>
                    {message.replied_at && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Reply className="w-4 h-4" />
                        تم الرد {format(new Date(message.replied_at), 'dd/MM/yyyy', { locale: ar })}
                      </div>
                    )}
                  </div>

                  <div className="mr-13">
                    <p className="text-sm text-academic-gray line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                        <Eye className="w-4 h-4 mr-2" />
                        عرض
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
                      <DialogHeader>
                        <DialogTitle>تفاصيل الرسالة</DialogTitle>
                        <DialogDescription>
                          رسالة من {selectedMessage?.name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedMessage && (
                        <div className="space-y-6">
                          {/* Sender Info */}
                          <div>
                            <h4 className="font-semibold mb-3 text-university-blue">معلومات المرسل</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <label className="font-medium">الاسم:</label>
                                <p className="text-muted-foreground">{selectedMessage.name}</p>
                              </div>
                              <div>
                                <label className="font-medium">البريد الإلكتروني:</label>
                                <p className="text-muted-foreground">{selectedMessage.email}</p>
                              </div>
                              {selectedMessage.phone && (
                                <div>
                                  <label className="font-medium">رقم الهاتف:</label>
                                  <p className="text-muted-foreground">{selectedMessage.phone}</p>
                                </div>
                              )}
                              <div>
                                <label className="font-medium">تاريخ الإرسال:</label>
                                <p className="text-muted-foreground">
                                  {format(new Date(selectedMessage.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Message Content */}
                          <div>
                            <h4 className="font-semibold mb-3 text-university-blue">المحتوى</h4>
                            {selectedMessage.subject && (
                              <div className="mb-4">
                                <label className="font-medium">الموضوع:</label>
                                <p className="text-muted-foreground">{selectedMessage.subject}</p>
                              </div>
                            )}
                            <div>
                              <label className="font-medium">الرسالة:</label>
                              <div className="mt-2 p-4 bg-academic-gray-light rounded-lg">
                                <p className="text-academic-gray whitespace-pre-wrap">{selectedMessage.message}</p>
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div>
                            <h4 className="font-semibold mb-3 text-university-blue">الحالة</h4>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(selectedMessage.status, selectedMessage.is_read)}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {selectedMessage.status !== 'replied' && (
                            <div className="flex gap-3 pt-4 border-t">
                              <Button 
                                onClick={() => setShowReplyDialog(true)}
                                className="flex-1 bg-university-blue hover:bg-university-blue-light"
                              >
                                <Reply className="w-4 h-4 mr-2" />
                                رد على الرسالة
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {message.status !== 'replied' && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowReplyDialog(true);
                      }}
                      className="bg-university-blue hover:bg-university-blue-light"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      رد
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMessages?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">لا توجد رسائل</h3>
              <p className="text-muted-foreground">لم يتم العثور على أي رسائل تطابق معايير البحث.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>الرد على الرسالة</DialogTitle>
            <DialogDescription>
              الرد على رسالة من {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">نص الرد</label>
              <Textarea
                placeholder="اكتب ردك هنا..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="bg-university-blue hover:bg-university-blue-light"
            >
              إرسال الرد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessages;