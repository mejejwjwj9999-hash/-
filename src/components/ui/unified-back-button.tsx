import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronLeft, LucideIcon } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface UnifiedBackButtonProps {
  breadcrumbs: BreadcrumbItem[];
}

const UnifiedBackButton: React.FC<UnifiedBackButtonProps> = ({ breadcrumbs }) => {
  const navigate = useNavigate();

  const handleNavigation = (href?: string) => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <nav className="flex items-center gap-2 text-sm opacity-90">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronLeft size={16} className="rtl-flip" />}
          
          {item.href ? (
            <button 
              onClick={() => handleNavigation(item.href)}
              className="flex items-center gap-2 hover:text-university-gold transition-colors"
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </button>
          ) : (
            <span className="flex items-center gap-2">
              {item.icon && <item.icon size={16} />}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default UnifiedBackButton;