
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { X, User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useNavigate } from 'react-router-dom';

interface ServiceRequestModalProps {
  service: any;
  onClose: () => void;
}

const ServiceRequestModal = ({ service, onClose }: ServiceRequestModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    message: '',
    priority: 'normal'
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { createServiceRequest } = useServiceRequests();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول أولاً لتتمكن من إرسال طلب الخدمة",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      await createServiceRequest.mutateAsync({
        title: `طلب خدمة: ${service.title}`,
        description: formData.message,
        service_type: service.title,
        priority: formData.priority,
        additional_data: {
          name: formData.name,
          studentId: formData.studentId,
          email: formData.email,
          phone: formData.phone
        }
      });

      // Reset form and close modal
      setFormData({
        name: '',
        studentId: '',
        email: '',
        phone: '',
        message: '',
        priority: 'normal'
      });
      onClose();
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center justify-between">
            <span className="flex items-center gap-3">
              <service.icon className="w-6 h-6 text-university-blue" />
              طلب خدمة: {service.title}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {/* Service Info */}
          <div className="bg-university-blue-light text-white p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">{service.title}</h3>
            <p className="text-sm opacity-90 mb-3">{service.description}</p>
            <div className="text-xs opacity-75">
              منسق الخدمة: {service.contact}
            </div>
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الاسم الكامل *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg text-right pr-10"
                    placeholder="اكتب اسمك الكامل"
                  />
                  <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-right">رقم الطالب *</label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-right"
                  placeholder="202400XX"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">البريد الإلكتروني *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg text-right pr-10"
                    placeholder="example@email.com"
                  />
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg text-right pr-10"
                    placeholder="77XXXXXXX"
                  />
                  <Phone className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-right">أولوية الطلب</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg text-right"
              >
                <option value="low">عادي</option>
                <option value="normal">متوسط</option>
                <option value="high">عالي</option>
                <option value="urgent">عاجل</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-right">تفاصيل الطلب *</label>
              <div className="relative">
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg text-right pr-10 resize-none"
                  placeholder="اشرح تفاصيل طلبك بوضوح..."
                />
                <MessageSquare className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Service Features Reminder */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-right">ما ستحصل عليه:</h4>
              <ul className="space-y-1 text-sm text-right" dir="rtl">
                {service.services?.slice(0, 4).map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-university-gold rounded-full flex-shrink-0"></div>
                    <span className="text-right">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-400">
              <h4 className="font-semibold mb-2 text-right text-yellow-800">ملاحظات مهمة:</h4>
              <ul className="space-y-1 text-sm text-yellow-700 text-right">
                <li>• سيتم الرد على طلبك خلال 24-48 ساعة</li>
                <li>• تأكد من صحة معلومات الاتصال</li>
                <li>• يمكنك متابعة حالة الطلب عبر بوابة الطالب</li>
                <li>• للاستفسارات العاجلة اتصل على: +967779553944</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <button 
                type="submit" 
                disabled={createServiceRequest.isPending}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {createServiceRequest.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
              <button type="button" onClick={onClose} className="btn-ghost">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestModal;
