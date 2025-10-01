
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { InlineEditorProvider } from '@/contexts/InlineEditorContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <InlineEditorProvider>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Navigation />
        <main className="flex-1 w-full max-w-full overflow-x-hidden pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </InlineEditorProvider>
  );
};

export default Layout;
