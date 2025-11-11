
import React from 'react';
import type { Page } from '../App';
import Button from '../components/Button';

interface HomePageProps {
  navigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-800 mb-6 leading-tight">
          ارفع صورتك ودع الذكاء الاصطناعي يحسنها لك
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          حوّل صورك العادية إلى روائع فنية عالية الدقة بنقرة واحدة. خدمتنا تستخدم أحدث تقنيات الذكاء الاصطناعي لزيادة وضوح الصور وتفاصيلها بشكل مذهل.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('signup')} >
            <i className="fas fa-user-plus mr-2"></i>
            تسجيل جديد
          </Button>
          <Button onClick={() => navigate('login')} variant="secondary">
            <i className="fas fa-sign-in-alt mr-2"></i>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
