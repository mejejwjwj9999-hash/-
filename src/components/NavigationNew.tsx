
import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavigationNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navigationItems = [
    { name: 'الرئيسية', href: '/' },
    {
      name: 'عن الكلية',
      href: '/about',
      dropdown: [
        { name: 'الرئيسية عن الكلية', href: '/about' },
        { name: 'الرؤية والرسالة', href: '/vision-mission' },
        { name: 'الاعتماد الأكاديمي', href: '/accreditation' },
        { name: 'التاريخ', href: '/history' }
      ]
    },
    {
      name: 'البرامج الأكاديمية',
      href: '/academics',
      dropdown: [
        { name: 'نظرة عامة', href: '/academics' },
        { name: 'كلية الصيدلة', href: '/programs/pharmacy' },
        { name: 'كلية التمريض', href: '/programs/nursing' },
        { name: 'كلية القبالة', href: '/programs/midwifery' },
        { name: 'كلية تكنولوجيا المعلومات', href: '/programs/information-technology' },
        { name: 'كلية إدارة الأعمال', href: '/programs/business-administration' }
      ]
    },
    { 
      name: 'القبول والتسجيل', 
      href: '/admissions',
      dropdown: [
        { name: 'معلومات القبول', href: '/admissions' },
        { name: 'شروط القبول', href: '/admission-requirements' },
        { name: 'الرسوم الدراسية', href: '/tuition-fees' },
        { name: 'المنح الدراسية', href: '/scholarships' }
      ]
    },
    { 
      name: 'شؤون الطلاب', 
      href: '/student-affairs',
      dropdown: [
        { name: 'الخدمات الطلابية', href: '/student-affairs' },
        { name: 'الأنشطة الطلابية', href: '/student-activities' },
        { name: 'الإرشاد الأكاديمي', href: '/academic-counseling' },
        { name: 'الدعم النفسي', href: '/psychological-support' }
      ]
    },
    {
      name: 'الخدمات',
      href: '/services',
      dropdown: [
        { name: 'نظرة عامة', href: '/services' },
        { name: 'بوابة الطالب', href: '/student-portal' },
        { name: 'المكتبة الرقمية', href: '/digital-library' },
        { name: 'التقويم الأكاديمي', href: '/academic-calendar' }
      ]
    },
    { 
      name: 'الأخبار', 
      href: '/news',
      dropdown: [
        { name: 'جميع الأخبار', href: '/news' },
        { name: 'الأخبار الأكاديمية', href: '/academic-news' },
        { name: 'أخبار الطلاب', href: '/student-news' },
        { name: 'الفعاليات', href: '/events' }
      ]
    },
    { 
      name: 'المركز الإعلامي', 
      href: '/media-center',
      dropdown: [
        { name: 'البيانات الصحفية', href: '/press-releases' },
        { name: 'معرض الصور', href: '/photo-gallery' },
        { name: 'مكتبة الفيديو', href: '/video-library' },
        { name: 'التغطية الإعلامية', href: '/media-coverage' }
      ]
    },
    { name: 'اتصل بنا', href: '/contact' }
  ];

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const hasActiveChild = (dropdown: any[]) => {
    return dropdown?.some(item => location.pathname === item.href);
  };

  return (
    <nav className="bg-white shadow-medium sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <img 
              src="/lovable-uploads/0be23354-4056-4d37-ac63-d50333169d9f.png" 
              alt="كلية أيلول الجامعية" 
              className="w-14 h-14 object-contain"
            />
            <div className="text-right">
              <h1 className="text-xl font-bold text-university-blue font-cairo">كلية أيلول الجامعية</h1>
              <p className="text-sm text-academic-gray font-tajawal">Aylol University College</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navigationItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${isActiveRoute(item.href) || (item.dropdown && hasActiveChild(item.dropdown))
                      ? 'bg-university-blue text-white shadow-soft' 
                      : 'text-university-blue hover:bg-university-blue hover:text-white hover:shadow-soft'
                    }
                  `}
                >
                  <span className="font-cairo">{item.name}</span>
                  {item.dropdown && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-large border border-gray-100 py-3 z-50">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.href}
                        className={`
                          block px-6 py-3 text-right transition-all duration-200 font-tajawal
                          ${isActiveRoute(dropdownItem.href)
                            ? 'bg-university-blue text-white' 
                            : 'text-academic-gray hover:bg-academic-gray-light hover:text-university-blue'
                          }
                        `}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-university-blue hover:bg-academic-gray-light rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-gray-100 mt-2">
            <div className="flex flex-col gap-2 pt-6">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.href}
                      className={`
                        flex-1 block px-4 py-3 text-right rounded-lg font-cairo transition-all duration-200
                        ${isActiveRoute(item.href) || (item.dropdown && hasActiveChild(item.dropdown))
                          ? 'bg-university-blue text-white' 
                          : 'text-university-blue hover:bg-academic-gray-light'
                        }
                      `}
                      onClick={() => !item.dropdown && setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="p-3 text-university-blue hover:bg-academic-gray-light rounded-lg ml-2"
                      >
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile Dropdown */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div className="mt-2 mr-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className={`
                            block px-6 py-3 text-right rounded-lg font-tajawal transition-all duration-200
                            ${isActiveRoute(dropdownItem.href)
                              ? 'bg-university-blue-light text-white' 
                              : 'text-academic-gray hover:bg-academic-gray-light hover:text-university-blue'
                            }
                          `}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationNew;
