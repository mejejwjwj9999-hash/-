import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Globe, Loader2, Home, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContactForm } from '@/hooks/useContactForm';
import { useNavigate } from 'react-router-dom';
import UnifiedHeroSection from '@/components/ui/unified-hero-section';
import UnifiedBackButton from '@/components/ui/unified-back-button';
const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const {
    toast
  } = useToast();
  const contactMutation = useContactForm();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactMutation.mutateAsync(formData);
      toast({
        title: "تم إرسال الرسالة بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن"
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <UnifiedHeroSection
        icon={MessageSquare}
        title="تواصل معنا"
        subtitle="نحن هنا للإجابة على جميع استفساراتكم وتقديم المساعدة اللازمة في رحلتكم التعليمية"
        breadcrumb={
          <UnifiedBackButton 
            breadcrumbs={[
              { label: 'الرئيسية', href: '/', icon: Home },
              { label: 'اتصل بنا', icon: MessageSquare }
            ]}
          />
        }
      />

      {/* Contact Information */}
      <section className="section-padding bg-academic-gray-light">
        <div className="container-custom">
          {/* Quick Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="card-elevated text-center hover:shadow-university transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-university-blue rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-card-title mb-2">اتصل بنا</h3>
              <p className="text-body mb-3">+967 4 416 789</p>
              <p className="text-body">+967 777 123 456</p>
            </div>
            
            <div className="card-elevated text-center hover:shadow-university transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-university-gold rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-card-title mb-2">راسلنا</h3>
              <p className="text-body mb-3">info@aylol.edu.ye</p>
              <p className="text-body">admissions@aylol.edu.ye</p>
            </div>
            
            <div className="card-elevated text-center hover:shadow-university transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-university-blue rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-card-title mb-2">زرنا</h3>
              <p className="text-body">مدينة إب، شارع الستين</p>
              <p className="text-body">بجانب مديرية التربية</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card-elevated">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-university-blue rounded-xl flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-card-title mb-0">أرسل لنا رسالة</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="اكتب اسمك الكامل" className="h-12 border-university-blue/20 focus:border-university-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} required placeholder="00967xxxxxxxxx" className="h-12 border-university-blue/20 focus:border-university-blue" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" className="h-12 border-university-blue/20 focus:border-university-blue" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">الموضوع</label>
                  <Input name="subject" value={formData.subject} onChange={handleChange} required placeholder="موضوع الرسالة" className="h-12 border-university-blue/20 focus:border-university-blue" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">الرسالة</label>
                  <Textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="اكتب رسالتك هنا..." className="border-university-blue/20 focus:border-university-blue" />
                </div>
                
                <Button type="submit" className="btn-primary w-full" disabled={contactMutation.isPending}>
                  {contactMutation.isPending ? <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      جاري الإرسال...
                    </> : <>
                      <Send className="w-5 h-5 ml-2" />
                      إرسال الرسالة
                    </>}
                </Button>
              </form>
            </div>

            {/* Contact Details & Info */}
            <div className="space-y-8">
              <div className="bg-university-blue/5 rounded-3xl p-8 border border-university-blue/20">
                <h3 className="text-card-title mb-6 flex items-center">
                  <Clock className="w-8 h-8 ml-3 text-university-blue" />
                  أوقات العمل
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-university-blue/20">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="font-semibold text-university-blue">السبت - الخميس</span>
                    </div>
                    <span className="text-academic-gray bg-white px-3 py-1 rounded-full">8:00 ص - 3:00 م</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="font-semibold text-university-blue">الجمعة</span>
                    </div>
                    <span className="text-academic-gray bg-academic-gray-light px-3 py-1 rounded-full">مغلق</span>
                  </div>
                </div>
              </div>

              <div className="card-elevated">
                <h3 className="text-card-title mb-6 flex items-center">
                  <MessageSquare className="w-8 h-8 ml-3 text-university-gold" />
                  تواصل سريع
                </h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-14 text-lg hover:bg-green-50 hover:border-green-300 transition-all duration-300">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
                      </svg>
                    </div>
                    واتساب: +967 777 123 456
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-14 text-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                    تليجرام: @AylolCollege
                  </Button>
                </div>
              </div>

              <div className="bg-university-gold/5 rounded-3xl p-8 border border-university-gold/20">
                <h3 className="text-card-title mb-4">لماذا تختار كلية أيلول؟</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-university-blue rounded-full mr-3"></div>
                    <span className="text-body">استجابة سريعة خلال 24 ساعة</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-university-gold rounded-full mr-3"></div>
                    <span className="text-body">فريق دعم متخصص ومدرب</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-university-blue rounded-full mr-3"></div>
                    <span className="text-body">خدمة باللغتين العربية والإنجليزية</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-university-gold rounded-full mr-3"></div>
                    <span className="text-body">برامج أكاديمية معتمدة</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-section-title mb-4">موقعنا على الخريطة</h2>
            <div className="w-24 h-1 bg-university-blue mx-auto"></div>
          </div>
          
          <div className="card-elevated">
            <div className="w-full h-96 bg-academic-gray-light rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-university-blue mx-auto mb-4" />
                <h3 className="text-card-title mb-2">كلية أيلول الجامعية</h3>
                <p className="text-body">مديرية يريم - الدائري الغربي</p>
                <p className="text-small mt-2">
                  سيتم إضافة الخريطة التفاعلية قريباً
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;