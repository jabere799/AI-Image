
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Page } from '../App';
import Button from './Button';

interface HeaderProps {
  navigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ navigate }) => {
  const { isLoggedIn, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate(isLoggedIn ? 'dashboard' : 'home')}
        >
          <i className="fas fa-magic text-2xl text-primary"></i>
          <span className="text-xl font-bold text-secondary">محسن الصور</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="hidden md:block text-gray-600">أهلاً، {user?.name}</span>
              <Button onClick={handleLogout} variant="secondary">تسجيل الخروج</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('login')} variant="secondary">تسجيل الدخول</Button>
              <Button onClick={() => navigate('signup')}>تسجيل جديد</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
