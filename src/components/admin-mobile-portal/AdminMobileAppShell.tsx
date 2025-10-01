import React, { useState, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useUnreadNotifications } from '@/hooks/useUnreadNotifications';
import AdminMobileTopBar from './AdminMobileTopBar';
import AdminBottomNav from './AdminBottomNav';
import AdminMoreSheet from './AdminMoreSheet';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  badge?: number;
}

interface AdminMobileAppShellProps {
  tabs: Tab[];
  defaultTab?: string;
  moreItems?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    component: React.ComponentType<any>;
  }>;
  children?: React.ReactNode;
}

const AdminMobileAppShell: React.FC<AdminMobileAppShellProps> = ({
  tabs,
  defaultTab = tabs[0]?.id,
  moreItems = [],
  children
}) => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin(user?.id);
  const { data: unreadCount = 0 } = useUnreadNotifications();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [selectedMoreItem, setSelectedMoreItem] = useState<string | null>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  // Save scroll position when tab changes
  const saveScrollPosition = (tabId: string) => {
    if (contentRef.current) {
      scrollPositions.current[tabId] = contentRef.current.scrollTop;
    }
  };

  // Restore scroll position for new tab
  const restoreScrollPosition = (tabId: string) => {
    if (contentRef.current && scrollPositions.current[tabId]) {
      contentRef.current.scrollTop = scrollPositions.current[tabId];
    }
  };

  // Handle tab navigation with scroll preservation
  const handleTabChange = (tabId: string) => {
    saveScrollPosition(activeTab);
    
    // Check if it's a main tab
    if (tabs.some(tab => tab.id === tabId)) {
      setActiveTab(tabId);
      setSelectedMoreItem(null);
    } 
    // Check if it's a more item
    else if (moreItems.some(item => item.id === tabId)) {
      setSelectedMoreItem(tabId);
      setActiveTab('');
    }
    // Fallback to main tab
    else {
      setActiveTab(tabId);
      setSelectedMoreItem(null);
    }
    
    // Restore scroll position after content updates
    setTimeout(() => restoreScrollPosition(tabId), 100);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url.toString());
  };

  // Handle more sheet item selection
  const handleMoreItemSelect = (itemId: string) => {
    setSelectedMoreItem(itemId);
    setShowMoreSheet(false);
    setActiveTab(''); // Clear active tab when showing more item
  };

  // Handle notifications click
  const handleNotificationsClick = () => {
    handleTabChange('notifications');
  };

  // Initialize from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    } else if (tab && moreItems.some(item => item.id === tab)) {
      setSelectedMoreItem(tab);
      setActiveTab('');
    }
  }, [tabs, moreItems]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-university-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">جاري تحميل لوحة التحكم الإدارية...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Get current tab configuration including badge
  const currentTabsWithBadge = tabs.map(tab => ({
    ...tab,
    badge: tab.id === 'notifications' ? unreadCount : undefined
  }));

  // Render content based on active selection
  const renderContent = () => {
    if (selectedMoreItem) {
      const moreItem = moreItems.find(item => item.id === selectedMoreItem);
      if (moreItem) {
        const Component = moreItem.component;
        return <Component onTabChange={handleTabChange} />;
      }
    }

    const activeTabConfig = currentTabsWithBadge.find(tab => tab.id === activeTab);
    if (activeTabConfig) {
      const Component = activeTabConfig.component;
      return <Component onTabChange={handleTabChange} />;
    }

    return children || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Fixed Top Bar */}
      <AdminMobileTopBar 
        user={user}
        onNotificationsClick={handleNotificationsClick}
        currentTab={activeTab}
        selectedMoreItem={selectedMoreItem}
        onMoreClick={() => setShowMoreSheet(true)}
        hasMoreItems={moreItems.length > 0}
      />

      {/* Scrollable Content Area */}
      <main 
        ref={contentRef}
        className="mobile-content-wrapper overflow-y-auto"
        style={{ 
          paddingTop: '140px', // Adjusted for admin top bar height
          paddingBottom: '80px',
          minHeight: '100vh'
        }}
      >
        <div className="px-4 pb-4">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <AdminBottomNav
        tabs={currentTabsWithBadge}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onMoreClick={() => setShowMoreSheet(true)}
        hasMoreItems={moreItems.length > 0}
      />

      {/* More Sheet */}
      <AdminMoreSheet
        isOpen={showMoreSheet}
        onClose={() => setShowMoreSheet(false)}
        items={moreItems}
        onItemSelect={handleMoreItemSelect}
        selectedItem={selectedMoreItem}
      />
    </div>
  );
};

export default AdminMobileAppShell;