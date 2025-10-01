
import React, { useState } from 'react';
import { FileText, User, Calendar, Mail, Phone, Upload, Check, X } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface ServiceRequestFormProps {
  serviceType: string;
  onClose: () => void;
}

const ServiceRequestForm = ({ serviceType, onClose }: ServiceRequestFormProps) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phone: '',
    reason: '',
    additionalNotes: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // محاكاة عملية الإرسال
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "تم إرسال الطلب بنجاح",
      description: `تم إرسال طلب ${serviceType}. سيتم التواصل معك خلال 24-48 ساعة.`,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-university-blue flex items-center gap-2">
            <FileText className="w-6 h-6" />
            طلب {serviceType}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">رقم الطالب *</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                placeholder="أدخل رقم الطالب"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                placeholder="الاسم الكامل"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                placeholder="البريد الإلكتروني"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
                placeholder="رقم الهاتف"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">سبب الطلب *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              placeholder="اذكر سبب طلب هذه الخدمة"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ملاحظات إضافية</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-university-blue"
              placeholder="أي معلومات إضافية تريد إضافتها"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">المرفقات</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">اسحب وأفلت الملفات هنا أو</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                اختر ملفات
              </label>
              <p className="text-xs text-gray-500 mt-2">PDF, DOC, JPG, PNG (الحد الأقصى 5MB)</p>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">الملفات المرفقة:</p>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  إرسال الطلب
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
