
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

export type Page = 'home' | 'login' | 'signup' | 'dashboard';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(isLoggedIn ? 'dashboard' : 'home');

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (!isLoggedIn) {
      switch (currentPage) {
        case 'login':
          return <LoginPage navigate={navigate} />;
        case 'signup':
          return <SignUpPage navigate={navigate} />;
        default:
          return <HomePage navigate={navigate} />;
      }
    } else {
       return <DashboardPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header navigate={navigate} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
