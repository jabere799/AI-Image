
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-primary transition-colors">حول الموقع</a>
          <a href="#" className="hover:text-primary transition-colors">اتصل بنا</a>
        </div>
        <p>&copy; {new Date().getFullYear()} محسن الصور. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
