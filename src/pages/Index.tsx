import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Gallery } from '@/components/Gallery';
import { Footer } from '@/components/Footer';
import { ProfilePage } from '@/components/ProfilePage';
import { AdminPanel } from '@/components/AdminPanel';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'admin'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <main className="flex-1">
            <Hero />
            <Gallery />
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default Index;
