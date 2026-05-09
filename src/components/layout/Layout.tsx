import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white selection:bg-purple-accent selection:text-white">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};
