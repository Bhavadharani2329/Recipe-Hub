import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function MainLayout({ bookmarkCount, shoppingListCount, theme, toggleTheme }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navbar
        bookmarkCount={bookmarkCount}
        shoppingListCount={shoppingListCount}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
