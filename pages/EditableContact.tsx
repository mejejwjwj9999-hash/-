import React from 'react';
import { EditableContent } from '@/components/inline-editor/EditableContent';

const EditableContact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-accent/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              <EditableContent 
                pageKey="contact" 
                elementKey="page_title" 
                elementType="text"
                fallback="تواصل معنا"
                as="span"
              />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              نحن هنا لمساعدتك والإجابة على جميع استفساراتك في رحلتك التعليمية معنا
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20">
                <span className="text-primary font-medium">دعم 24/7</span>
              </div>  
              <div className="bg-secondary/10 backdrop-blur-sm px-6 py-3 rounded-full border border-secondary/20">
                <span className="text-secondary font-medium">استجابة سريعة</span>
              </div>
              <div className="bg-accent/10 backdrop-blur-sm px-6 py-3 rounded-full border border-accent/20">
                <span className="text-accent font-medium">فريق متخصص</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Address */}
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                <EditableContent 
                  pageKey="contact" 
                  elementKey="address_title" 
                  elementType="text"
                  fallback="العنوان"
                  as="span"
                />
              </h3>
              <p className="text-muted-foreground">
                <EditableContent 
                  pageKey="contact" 
                  elementKey="address_content" 
                  elementType="text"
                  fallback="صنعاء - اليمن"
                  as="span"
                />
              </p>
            </div>

            {/* Phone */}
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                <EditableContent 
                  pageKey="contact" 
                  elementKey="phone_title" 
                  elementType="text"
                  fallback="الهاتف"
                  as="span"
                />
              </h3>
              <p className="text-muted-foreground">
                <EditableContent 
                  pageKey="contact" 
                  elementKey="phone_content" 
                  elementType="text"
                  fallback="+967 1 234567"
                  as="span"
                />
              </p>
            </div>

            {/* Email */}
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                <EditableContent 
                  pageKey="contact" 
                  elementKey="email_title" 
                  elementType="text"
                  fallback="البريد الإلكتروني"
                  as="span"
                />
              </h3>
              <p className="text-muted-foreground">
                <EditableContent 
                  pageKey="contact" 
                  elementKey="email_content" 
                  elementType="text"
                  fallback="info@eylul.edu.ye"
                  as="span"
                />
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">أرسل لنا رسالة</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الاسم الأول</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="أدخل اسمك الأول"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">الاسم الأخير</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="أدخل اسمك الأخير"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">الموضوع</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>اختر الموضوع</option>
                    <option>استفسار عن القبول</option>
                    <option>استفسار عن البرامج الأكاديمية</option>
                    <option>استفسار عن الرسوم</option>
                    <option>شكوى أو اقتراح</option>
                    <option>أخرى</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">الرسالة</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  إرسال الرسالة
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Working Hours & Additional Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border border-border">
                <h3 className="text-2xl font-bold mb-6 text-foreground">ساعات العمل</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="font-medium text-foreground">الأحد - الخميس</span>
                    <span className="text-muted-foreground">8:00 ص - 3:00 م</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="font-medium text-foreground">السبت</span>
                    <span className="text-muted-foreground">مغلق</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium text-foreground">الجمعة</span>
                    <span className="text-muted-foreground">مغلق</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-bold mb-4 text-foreground">معلومات إضافية</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    استجابة سريعة خلال 24 ساعة
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    فريق دعم متخصص ومدرب
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    خدمة عملاء متاحة باللغتين العربية والإنجليزية
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableContact;