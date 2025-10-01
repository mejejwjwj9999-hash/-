import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileDocumentRequestModal from './MobileDocumentRequestModal';

const MobileDocuments = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const documentTypes = [
    { id: 'academic_transcript', name: 'كشف درجات', icon: FileText },
    { id: 'enrollment_certificate', name: 'شهادة قيد', icon: FileText },
    { id: 'graduation_certificate', name: 'شهادة تخرج', icon: FileText },
    { id: 'conduct_certificate', name: 'شهادة حسن سير وسلوك', icon: FileText },
    { id: 'other', name: 'أخرى', icon: FileText }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'نشط',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'pending':
        return {
          label: 'قيد المعالجة',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'expired':
        return {
          label: 'منتهي الصلاحية',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      default:
        return {
          label: 'غير محدد',
          color: 'bg-gray-100 text-gray-800',
          icon: FileText
        };
    }
  };

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc.document_type === selectedType;
    
    return matchesSearch && matchesType;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-sm">جاري تحميل الوثائق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 space-y-3 bg-gray-50 min-h-screen" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-gray-800">وثائقي</h1>
        </div>
        <Button 
          size="sm" 
          className="flex items-center gap-2 bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white rounded-xl"
          onClick={() => setShowRequestModal(true)}
        >
          <Plus className="h-4 w-4" />
          طلب وثيقة
        </Button>
      </div>

      {/* البحث والفلاتر */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ابحث في الوثائق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="نوع الوثيقة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {documentTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-2 text-center">
            <div className="text-lg font-bold text-green-600">{documents?.filter(d => d.status === 'active').length || 0}</div>
            <div className="text-xs text-gray-600">نشطة</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-2 text-center">
            <div className="text-lg font-bold text-yellow-600">{documents?.filter(d => d.status === 'pending').length || 0}</div>
            <div className="text-xs text-gray-600">قيد المعالجة</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-2 text-center">
            <div className="text-lg font-bold text-gray-600">{documents?.length || 0}</div>
            <div className="text-xs text-gray-600">الإجمالي</div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الوثائق */}
      <div className="space-y-2">
        {filteredDocuments.length === 0 ? (
          <Card className="text-center py-12 border-dashed border-2">
            <CardContent>
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد وثائق</h3>
              <p className="text-gray-500 mb-4">لم يتم رفع أي وثائق بعد</p>
              <Button
                onClick={() => setShowRequestModal(true)}
                className="bg-mobile-auth-button hover:bg-mobile-auth-button-hover text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                طلب وثيقة جديدة
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((doc) => {
            const statusInfo = getStatusInfo(doc.status);
            const StatusIcon = statusInfo.icon;
            const docType = documentTypes.find(t => t.id === doc.document_type);
            
            return (
              <Card key={doc.id} className="border-0 shadow-md">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800 truncate">
                          {doc.document_name}
                        </h4>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {docType?.name || 'وثيقة'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(doc.created_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* نموذج طلب الوثيقة */}
      <MobileDocumentRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
};

export default MobileDocuments;