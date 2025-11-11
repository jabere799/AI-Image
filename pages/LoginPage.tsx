
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Page } from '../App';
import Button from '../components/Button';

interface LoginPageProps {
  navigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials against a backend.
    // Here we just simulate login.
    login(email, 'مستخدم');
    navigate('dashboard');
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-secondary mb-6">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full !py-3">دخول</Button>
        </form>
        <p className="text-center mt-6 text-sm">
          ليس لديك حساب؟{' '}
          <button onClick={() => navigate('signup')} className="font-medium text-primary hover:underline">
            أنشئ حساباً جديداً
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
