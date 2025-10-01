
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_path?: string;
  status: string;
  is_official: boolean;
  issued_date?: string;
  expiry_date?: string;
  verification_code?: string;
  created_at: string;
}

const DocumentsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب الوثائق من قاعدة البيانات
  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['student-documents'],
    queryFn: async (): Promise<Document[]> => {
      console.log('جاري تحميل الوثائق...');
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('خطأ في المصادقة:', userError);
          throw new Error('غير مسجل الدخول');
        }

        console.log('المستخدم المصادق عليه:', user.id);

        const { data: profile, error: profileError } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('خطأ في جلب ملف الطالب:', profileError);
          throw new Error('ملف الطالب غير موجود');
        }

        console.log('ملف الطالب:', profile.id);

        const { data, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('student_id', profile.id)
          .order('created_at', { ascending: false });

        if (documentsError) {
          console.error('خطأ في جلب الوثائق:', documentsError);
          throw new Error(`فشل في جلب الوثائق: ${documentsError.message}`);
        }

        console.log('تم جلب الوثائق بنجاح:', data?.length || 0);
        return (data as Document[]) || [];
      } catch (err) {
        console.error('خطأ غير متوقع في جلب الوثائق:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  // طلب وثيقة جديدة
  const requestDocument = useMutation({
    mutationFn: async (documentData: { document_name: string; document_type: string; description?: string }) => {
      console.log('طلب وثيقة جديدة:', documentData);
      
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('خطأ في المصادقة:', userError);
          throw new Error('غير مسجل الدخول');
        }

        const { data: profile, error: profileError } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('خطأ في جلب ملف الطالب:', profileError);
          throw new Error('ملف الطالب غير موجود');
        }

        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            student_id: profile.id,
            document_name: documentData.document_name,
            document_type: documentData.document_type,
            status: 'pending',
            file_path: '',
            is_official: false
          });

        if (insertError) {
          console.error('خطأ في إدراج الوثيقة:', insertError);
          throw new Error(`فشل في حفظ طلب الوثيقة: ${insertError.message}`);
        }

        console.log('تم حفظ طلب الوثيقة بنجاح');
      } catch (err) {
        console.error('خطأ غير متوقع في طلب الوثيقة:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-documents'] });
      toast({
        title: "تم تقديم الطلب",
        description: "سيتم معالجة طلب الوثيقة خلال 3-5 أيام عمل"
      });
      setShowRequestModal(false);
    },
    onError: (error: any) => {
      console.error('فشل في طلب الوثيقة:', error);
      toast({
        title: "خطأ في تقديم الطلب",
        description: error.message || "فشل في حفظ طلب الوثيقة",
        variant: "destructive"
      });
    }
  });

  const documentTypes = [
    { value: 'transcript', label: 'كشف الدرجات الرسمي' },
    { value: 'enrollment_certificate', label: 'شهادة قيد' },
    { value: 'graduation_certificate', label: 'شهادة تخرج' },
    { value: 'conduct_certificate', label: 'شهادة حسن سير وسلوك' },
    { value: 'recommendation_letter', label: 'خطاب توصية' },
    { value: 'study_plan', label: 'خطة دراسية' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleDocumentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const documentName = formData.get('document_name') as string;
    const documentType = formData.get('document_type') as string;
    const description = formData.get('description') as string;

    if (!documentName || !documentType) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    requestDocument.mutate({
      document_name: documentName,
      document_type: documentType,
      description: description
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.document_type === filterType;
    return matchesSearch && matchesFilter;
  });

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-section-title">الوثائق والمستندات</h2>
          <Button onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        </div>
        <div className="card-elevated p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">خطأ في تحميل الوثائق</h3>
          <p className="text-academic-gray mb-4">
            {error instanceof Error ? error.message : 'حدث خطأ غير متوقع'}
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-section-title">الوثائق والمستندات</h2>
        <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              طلب وثيقة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>طلب وثيقة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleDocumentRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">نوع الوثيقة *</label>
                <Select name="document_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الوثيقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">اسم الوثيقة *</label>
                <input
                  type="text"
                  name="document_name"
                  required
                  placeholder="مثال: كشف درجات للفصل الأول"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات (اختياري)</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="أي تفاصيل إضافية..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue resize-none"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={requestDocument.isPending} 
                  className="flex-1"
                >
                  {requestDocument.isPending ? 'جاري التقديم...' : 'تقديم الطلب'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowRequestModal(false)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث في الوثائق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="جميع الأنواع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {documentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* قائمة الوثائق */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-academic-gray">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            جاري تحميل الوثائق...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد وثائق</h3>
            <p className="text-academic-gray mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'لم يتم العثور على وثائق تطابق البحث' 
                : 'لم تقم بطلب أي وثائق بعد'
              }
            </p>
            <Button onClick={() => setShowRequestModal(true)}>
              طلب وثيقة جديدة
            </Button>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div key={document.id} className="card-elevated p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-university-blue" />
                    <h3 className="font-semibold">{document.document_name}</h3>
                    {document.is_official && (
                      <Shield className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <div className="text-sm text-academic-gray mb-3">
                    <p>النوع: {documentTypes.find(t => t.value === document.document_type)?.label || document.document_type}</p>
                    <p>تاريخ الطلب: {new Date(document.created_at).toLocaleDateString('ar-SA')}</p>
                    {document.issued_date && (
                      <p>تاريخ الإصدار: {new Date(document.issued_date).toLocaleDateString('ar-SA')}</p>
                    )}
                    {document.expiry_date && (
                      <p>تاريخ الانتهاء: {new Date(document.expiry_date).toLocaleDateString('ar-SA')}</p>
                    )}
                    {document.verification_code && (
                      <p>رمز التحقق: <span className="font-mono">{document.verification_code}</span></p>
                    )}
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(document.status)}`}>
                    {getStatusIcon(document.status)}
                    <span>
                      {document.status === 'active' && 'مكتملة'}
                      {document.status === 'pending' && 'قيد المراجعة'}
                      {document.status === 'processing' && 'قيد المعالجة'}
                      {document.status === 'expired' && 'منتهية الصلاحية'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                    عرض
                  </Button>
                  {document.status === 'active' && document.file_path && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                      تحميل
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* معلومات إضافية */}
      <div className="card-elevated p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-university-blue" />
          معلومات مهمة
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-university-blue rounded-full mt-2"></div>
            <p>
              <strong>مدة المعالجة:</strong> تتم معالجة طلبات الوثائق خلال 3-5 أيام عمل
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <p>
              <strong>الوثائق الرسمية:</strong> تحمل ختم الجامعة ورمز تحقق للمصادقة
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
            <p>
              <strong>صلاحية الوثائق:</strong> كشوف الدرجات صالحة لمدة سنة، شهادات القيد لمدة 6 أشهر
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
            <p>
              <strong>للاستفسارات:</strong> تواصل مع مكتب شؤون الطلاب على 01-123456 أو students@aylol.edu.ye
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;
