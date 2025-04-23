import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', padding: '2rem' }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
