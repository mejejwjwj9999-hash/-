import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogIn } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverDropdown, setHoverDropdown] = useState<string | null>(null);
  const {
    user
  } = useAuth();
  const menuItems = [{
    title: 'الرئيسية',
    href: '/'
  }, {
    title: 'عن الكلية',
    children: [{
      title: 'من نحن',
      href: '/about-us'
    }, {
      title: 'كلمة عميد الكلية',
      href: '/dean-message'
    }, {
      title: 'الرؤية والرسالة والأهداف',
      href: '/vision-mission'
    }, {
      title: 'مجلس الإدارة',
      href: '/board-of-directors'
    }, {
      title: 'وحدة التطوير وضمان الجودة',
      href: '/quality-assurance'
    }, {
      title: 'البحث العلمي',
      href: '/research'
    }]
  }, {
    title: 'الأقسام الأكاديمية',
    children: [{
      title: 'قسم العلوم التقنية والحاسوب',
      href: '/departments/tech-science'
    }, {
      title: 'قسم العلوم الإدارية والإنسانية',
      href: '/departments/admin-humanities'
    }, {
      title: 'قسم العلوم الطبية',
      href: '/departments/medical'
    }, {
      title: 'جميع الأقسام',
      href: '/departments'
    }]
  }, {
    title: 'شؤون الطلاب',
    children: [{
      title: 'القبول والتسجيل بالكلية',
      href: '/admissions'
    }, {
      title: 'دليل الطالب الجامعي',
      href: '/student-guide'
    }, {
      title: 'شروط وضوابط المقاصة والتحويل',
      href: '/transfer-policies'
    }, {
      title: 'التقويم الجامعي',
      href: '/academic-calendar'
    }, {
      title: 'سلوكيات وأخلاقيات الطالب الجامعي',
      href: '/student-ethics'
    }, {
      title: 'شؤون الطلاب',
      href: '/student-affairs'
    }, {
      title: 'الخدمات الطلابية',
      href: '/services'
    }, {
      title: 'المكتبة الرقمية',
      href: '/digital-library'
    }]
  }, {
    title: 'المركز الإعلامي',
    children: [{
      title: 'اخر الأخبار',
      href: '/news'
    }, {
      title: 'المركز الإعلامي',
      href: '/media-center'
    }]
  }, {
    title: 'تواصل معنا',
    href: '/contact'
  }];
  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };
  
  const handleMouseEnter = (title: string) => {
    setHoverDropdown(title);
  };
  
  const handleMouseLeave = () => {
    setHoverDropdown(null);
  };
  
  const closeDropdown = () => {
    setOpenDropdown(null);
    setHoverDropdown(null);
  };
  
  const isDropdownVisible = (title: string) => {
    return openDropdown === title || hoverDropdown === title;
  };
  return <nav className="bg-card backdrop-blur-sm shadow-lg fixed top-0 left-0 right-0 w-full z-50 border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 space-x-reverse hover:opacity-90 transition-opacity">
            <img src="/lovable-uploads/692c0f32-2048-4fa2-a225-ab06ea746199.png" alt="شعار كلية أيلول الجامعية" className="h-12 w-12 rounded-lg shadow-soft object-cover ring-2 ring-primary/20" />
            <div className="text-right">
              <h1 className="text-xl font-bold text-primary font-tajawal">كلية ايلول الجامعية</h1>
              <p className="text-sm text-muted-foreground font-tajawal">Aylol University College</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 space-x-reverse font-tajawal">
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                {item.children ? (
                  <div 
                    className="relative group"
                    onMouseEnter={() => handleMouseEnter(item.title)}
                    onMouseLeave={handleMouseLeave}
                  >
                     <button 
                      className="nav-link group flex items-center px-4 py-2 rounded-lg hover:bg-university-blue/10 transition-all duration-200 text-foreground hover:text-university-blue" 
                      onClick={() => toggleDropdown(item.title)}
                    >
                      {item.title}
                      <ChevronDown className={`mr-1 h-4 w-4 transition-transform duration-200 ${isDropdownVisible(item.title) ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownVisible(item.title) && (
                      <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-card rounded-lg shadow-lg border border-border py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top">
                        {item.children.map((child, childIndex) => (
                          <Link 
                            key={childIndex} 
                            to={child.href} 
                            className="block px-4 py-2 text-right hover:bg-university-blue/10 hover:text-university-blue transition-colors duration-200 text-muted-foreground" 
                            onClick={closeDropdown}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    to={item.href} 
                    className="nav-link px-4 py-2 rounded-lg hover:bg-university-blue/10 transition-all duration-200 inline-block text-foreground hover:text-university-blue"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Student Portal/Auth Button */}
            <div className="mr-6 border-r border-border pr-6">
              {user ? (
                <Link 
                  to="/student-portal" 
                  className="bg-university-blue text-white px-6 py-2.5 rounded-lg hover:bg-university-blue-dark transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <User className="w-4 h-4 ml-2" />
                  بوابة الطالب
                </Link>
              ) : (
                <Link 
                  to="/auth" 
                  className="bg-university-blue text-white px-6 py-2.5 rounded-lg hover:bg-university-blue-dark transition-all duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-university-blue hover:bg-university-blue/10">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && <div className="lg:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Student Portal/Auth Button for Mobile */}
              <div className="mb-4 pt-2 border-b border-border pb-4">
                {user ? <Link to="/student-portal" className="bg-university-blue text-white px-4 py-2 rounded-lg hover:bg-university-blue-dark transition-colors flex items-center justify-center w-full" onClick={() => setIsMenuOpen(false)}>
                    <User className="w-4 h-4 ml-2" />
                    بوابة الطالب
                  </Link> : <Link to="/auth" className="bg-university-blue text-white px-4 py-2 rounded-lg hover:bg-university-blue-dark transition-colors flex items-center justify-center w-full" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Link>}
              </div>

              {menuItems.map((item, index) => <div key={index}>
                  {item.children ? <div>
                      <button className="mobile-menu-item w-full text-right flex items-center justify-between" onClick={() => toggleDropdown(item.title)}>
                        {item.title}
                        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.title ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === item.title && <div className="pr-4 mt-2 space-y-2">
                          {item.children.map((child, childIndex) => <Link key={childIndex} to={child.href} className="mobile-submenu-item" onClick={() => {
                  setIsMenuOpen(false);
                  closeDropdown();
                }}>
                              {child.title}
                            </Link>)}
                        </div>}
                    </div> : <Link to={item.href} className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
                      {item.title}
                    </Link>}
                </div>)}
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;