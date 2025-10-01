
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../Navigation';
import Footer from '../Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navigation />
      <main className="flex-1 w-full max-w-full overflow-x-hidden pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
