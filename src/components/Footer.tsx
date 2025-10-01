import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    scrollToTop();
  };

  const footerLinks = {
    about: [
      { name: 'عن الكلية', href: '/about' },
      { name: 'الرؤية والرسالة', href: '/vision-mission' },
      { name: 'الاعتماد الأكاديمي', href: '/accreditation' },
      { name: 'التاريخ', href: '/history' }
    ],
    academics: [
      { name: 'برنامج الصيدلة', href: '/programs/pharmacy' },
      { name: 'برنامج التمريض', href: '/programs/nursing' },
      { name: 'برنامج القبالة', href: '/programs/midwifery' },
      { name: 'برنامج تكنولوجيا المعلومات', href: '/programs/information-technology' },
      { name: 'برنامج إدارة الأعمال', href: '/programs/business-administration' }
    ],
    news: [
      { name: 'جميع الأخبار', href: '/news' },
      { name: 'المركز الإعلامي', href: '/media-center' },
      { name: 'الفعاليات', href: '/academic-calendar' },
      { name: 'الإعلانات', href: '/news' }
    ],
    services: [
      { name: 'بوابة الطالب', href: '/student-portal' },
      { name: 'المكتبة الرقمية', href: '/digital-library' },
      { name: 'التقويم الأكاديمي', href: '/academic-calendar' },
      { name: 'خدمة الطلاب', href: '/services' }
    ],
    contact: [
      { name: 'اتصل بنا', href: '/contact' },
      { name: 'القبول والتسجيل', href: '/admissions' },
      { name: 'شؤون الطلاب', href: '/student-life' },
      { name: 'العلاقات العامة', href: '/media-center' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/aylolcollege', color: 'hover:text-blue-500' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/aylolcollege', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/aylolcollege', color: 'hover:text-pink-500' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@aylolcollege', color: 'hover:text-red-500' }
  ];

  return (
    <footer className="bg-university-blue text-white relative">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 right-8 bg-university-gold text-university-blue w-12 h-12 rounded-full flex items-center justify-center hover:bg-university-gold-light transition-colors shadow-medium"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* University Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg p-1">
                  <img 
                    src="/lovable-uploads/f7715949-fb74-41cb-a177-da5714191d8b.png" 
                    alt="كلية أيلول الجامعية" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">كلية أيلول الجامعية</h3>
                  <p className="text-sm text-gray-300">Aylol University College</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed text-right">
                مؤسسة تعليمية رائدة في اليمن تهدف إلى إعداد كوادر مؤهلة في مختلف التخصصات 
                الأكاديمية لخدمة المجتمع والتنمية المستدامة
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-university-gold" />
                  <span className="text-gray-300">الفرع الرئيسي : يريم، الدائري الغربي، أمام مستشفى يريم العام</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-university-gold" />
                  <span className="text-gray-300">967779553944+</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-university-gold" />
                  <span className="text-gray-300">aylolcollege@gmail.com</span>
                </div>
              </div>
            </div>

            {/* About Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-right">عن الكلية</h4>
              <ul className="space-y-3 text-right">
                {footerLinks.about.map(link => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className="text-gray-300 hover:text-university-gold transition-colors cursor-pointer text-right"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Programs */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-right">البرامج الأكاديمية</h4>
              <ul className="space-y-3 text-right">
                {footerLinks.academics.map(link => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className="text-gray-300 hover:text-university-gold transition-colors cursor-pointer text-right"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* News & Media */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-right">الأخبار والإعلام</h4>
              <ul className="space-y-3 text-right">
                {footerLinks.news.map(link => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className="text-gray-300 hover:text-university-gold transition-colors cursor-pointer text-right"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services & Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-right">الخدمات والتواصل</h4>
              <ul className="space-y-3 text-right mb-6">
                {footerLinks.services.map(link => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className="text-gray-300 hover:text-university-gold transition-colors cursor-pointer text-right"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Social Media */}
              <div>
                <h5 className="text-sm font-medium mb-3 text-right">تابعنا على</h5>
                <div className="flex justify-start gap-3 flex-row-reverse">
                  {socialLinks.map(social => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-300 ${social.color} transition-colors`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 text-sm text-center md:text-right">
              جميع الحقوق محفوظة © 2024 كلية أيلول الجامعية
            </div>
            <div className="flex gap-6 text-sm flex-row-reverse">
              <button 
                onClick={() => handleNavigation('/privacy-policy')}
                className="text-gray-300 hover:text-university-gold transition-colors"
              >
                سياسة الخصوصية
              </button>
              <button 
                onClick={() => handleNavigation('/terms-of-use')}
                className="text-gray-300 hover:text-university-gold transition-colors"
              >
                شروط الاستخدام
              </button>
              <button 
                onClick={() => console.log('Sitemap')}
                className="text-gray-300 hover:text-university-gold transition-colors"
              >
                خريطة الموقع
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
