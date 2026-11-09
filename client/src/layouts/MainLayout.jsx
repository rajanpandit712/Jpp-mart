import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * MainLayout – wraps all public-facing pages.
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-bg">
      <AnnouncementBar />
      <Header />
      <Navbar />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.12)',
          },
          success: { iconTheme: { primary: '#16A34A', secondary: '#F0FDF4' } },
          error:   { iconTheme: { primary: '#DC2626', secondary: '#FEF2F2' } },
        }}
      />
    </div>
  );
}
