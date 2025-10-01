import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AboutCMSDashboard } from '@/components/admin/cms/AboutCMSDashboard';
import { UnifiedContentEditor } from '@/components/admin/cms/UnifiedContentEditor';
import { MediaLibrary } from '@/components/admin/cms/MediaLibrary';
import { ContentAnalytics } from '@/components/admin/cms/ContentAnalytics';
import { EnhancedAboutCollegeEditor } from '@/components/admin/about-sections/EnhancedAboutCollegeEditor';
import { DeanWordEditor } from '@/components/admin/about-sections/DeanWordEditor';

export const AboutCMSPage: React.FC = () => {
  const location = useLocation();
  
  // Get current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/content-editor')) return 'content-editor';
    if (path.includes('/media-library')) return 'media-library';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/about-college')) return 'about-college';
    if (path.includes('/dean-word')) return 'dean-word';
    if (path.includes('/vision-mission')) return 'vision-mission';
    if (path.includes('/board-members')) return 'board-members';
    if (path.includes('/quality-assurance')) return 'quality-assurance';
    if (path.includes('/scientific-research')) return 'scientific-research';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Main CMS Dashboard */}
        <Route path="/" element={<Navigate to="/admin/cms/dashboard" replace />} />
        <Route path="/dashboard" element={<AboutCMSDashboard />} />
        
        {/* Content Editors for each section */}
        <Route path="/about-college/edit" element={<EnhancedAboutCollegeEditor pageKey="about-college" />} />
        <Route path="/dean-word/edit" element={<DeanWordEditor pageKey="about-dean-word" />} />
        <Route path="/vision-mission/edit" element={
          <UnifiedContentEditor 
            pageKey="about-vision-mission"
            onSave={(elements, status) => {
              console.log('Saving vision-mission:', elements, status);
            }}
          />
        } />
        <Route path="/board-members/edit" element={
          <UnifiedContentEditor 
            pageKey="about-board-members"
            onSave={(elements, status) => {
              console.log('Saving board-members:', elements, status);
            }}
          />
        } />
        <Route path="/quality-assurance/edit" element={
          <UnifiedContentEditor 
            pageKey="about-quality-assurance"
            onSave={(elements, status) => {
              console.log('Saving quality-assurance:', elements, status);
            }}
          />
        } />
        <Route path="/scientific-research/edit" element={
          <UnifiedContentEditor 
            pageKey="about-scientific-research"
            onSave={(elements, status) => {
              console.log('Saving scientific-research:', elements, status);
            }}
          />
        } />
        
        {/* CMS Tools */}
        <Route path="/media-library" element={<MediaLibrary />} />
        <Route path="/analytics" element={<ContentAnalytics />} />
        
        {/* Bulk Editor */}
        <Route path="/bulk-editor" element={
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">محرر مجمع</h1>
            <p className="text-muted-foreground">تحرير عدة أقسام في نفس الوقت</p>
            {/* TODO: Implement bulk editor */}
          </div>
        } />
        
        {/* Export/Import */}
        <Route path="/export-import" element={
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">استيراد/تصدير</h1>
            <p className="text-muted-foreground">استيراد وتصدير المحتوى</p>
            {/* TODO: Implement export/import functionality */}
          </div>
        } />
        
        {/* Settings */}
        <Route path="/settings" element={
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">إعدادات النظام</h1>
            <p className="text-muted-foreground">إعدادات نظام إدارة المحتوى</p>
            {/* TODO: Implement CMS settings */}
          </div>
        } />
      </Routes>
    </div>
  );
};