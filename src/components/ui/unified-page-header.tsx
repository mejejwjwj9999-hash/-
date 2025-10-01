import React from 'react';
import { LucideIcon } from 'lucide-react';
import UnifiedBackButton from './unified-back-button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface UnifiedPageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
}

const UnifiedPageHeader: React.FC<UnifiedPageHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  breadcrumbs
}) => {
  return (
    <section className="hero-section text-white py-16">
      <div className="hero-content">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-8">
            <UnifiedBackButton breadcrumbs={breadcrumbs} />
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Icon size={48} className="text-university-gold" />
              </div>
            </div>
            <h1 className="text-page-title text-white mb-4">{title}</h1>
            <p className="text-subtitle text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedPageHeader;