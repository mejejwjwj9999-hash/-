import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface AdminBottomNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onMoreClick?: () => void;
  hasMoreItems?: boolean;
}

const AdminBottomNav: React.FC<AdminBottomNavProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onMoreClick,
  hasMoreItems = false
}) => {
  // Limit to 4 main tabs + more button if needed
  const mainTabs = tabs.slice(0, hasMoreItems ? 4 : 5);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-university-blue/20 shadow-large z-50">
      <div className="flex items-center justify-around py-2 px-1">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 min-h-[60px] flex-1 max-w-[80px] transition-all duration-200 rounded-xl ${
                isActive 
                  ? 'text-university-blue bg-university-blue/10' 
                  : 'text-academic-gray hover:text-university-blue hover:bg-university-blue/5'
              }`}
              aria-label={tab.label}
            >
              <div className="relative mb-1">
                <Icon className={`h-5 w-5 ${isActive ? 'text-university-blue' : ''}`} />
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center rounded-full bg-university-red border-0"
                  >
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${
                isActive ? 'text-university-blue' : 'text-academic-gray'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-university-blue rounded-full" />
              )}
            </Button>
          );
        })}
        
        {hasMoreItems && (
          <Button
            variant="ghost"
            onClick={onMoreClick}
            className="flex flex-col items-center justify-center p-2 min-h-[60px] flex-1 max-w-[80px] text-academic-gray hover:text-university-blue hover:bg-university-blue/5 transition-all duration-200 rounded-xl"
            aria-label="المزيد"
          >
            <div className="mb-1">
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              المزيد
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminBottomNav;