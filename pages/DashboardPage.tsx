
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { enhanceImage } from '../services/geminiService';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ImageComparator from '../components/ImageComparator';
import type { EnhancedImage } from '../types';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<EnhancedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storageKey = user ? `imageHistory_${user.id}` : 'imageHistory_guest';

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(storageKey);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      setHistory([]);
    }
  }, [storageKey]);

  const saveToHistory = useCallback((newImage: EnhancedImage) => {
    const newHistory = [newImage, ...history];
    setHistory(newHistory);
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
  }, [history, storageKey]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setEnhancedImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setImageFile(file);
        handleEnhance(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async (file: File) => {
    if (!file) {
      setError("الرجاء تحديد صورة أولاً.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (e) => {
          const base64String = (e.target?.result as string).split(',')[1];
          if(base64String) {
            const enhancedBase64 = await enhanceImage(base64String, file.type);
            const enhancedDataUrl = `data:${file.type};base64,${enhancedBase64}`;
            setEnhancedImage(enhancedDataUrl);

            const newEnhancedImage: EnhancedImage = {
                id: Date.now().toString(),
                original: originalImage!,
                enhanced: enhancedDataUrl,
                timestamp: Date.now(),
              };
            saveToHistory(newEnhancedImage);
          } else {
            throw new Error("Failed to read image file.");
          }
      };
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const deleteFromHistory = (id: string) => {
    const updatedHistory = history.filter(img => img.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
  };
  
  const viewFromHistory = (image: EnhancedImage) => {
    setOriginalImage(image.original);
    setEnhancedImage(image.enhanced);
    setImageFile(null); // Reset file as we are viewing from history
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-secondary mb-4">تحسين جودة الصور</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          ارفع صورة، وسيقوم الذكاء الاصطناعي بمعالجتها لزيادة الدقة والوضوح. سترى الفرق بنفسك!
        </p>
        <Button onClick={handleUploadClick} disabled={isLoading}>
          <i className="fas fa-upload mr-2"></i>
          {isLoading ? 'جاري التحسين...' : 'رفع الصورة'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
      </div>

      {isLoading && <Spinner text="يقوم الذكاء الاصطناعي بسحره... قد يستغرق هذا بعض الوقت."/>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}
      
      {originalImage && enhancedImage && !isLoading && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
           <h3 className="text-2xl font-bold text-center text-secondary mb-4">النتيجة: قبل وبعد</h3>
           <ImageComparator original={originalImage} enhanced={enhancedImage} />
           <div className="text-center mt-6">
              <a href={enhancedImage} download={`enhanced_${imageFile?.name || 'image.png'}`}>
                <Button>
                  <i className="fas fa-download mr-2"></i>
                  تحميل الصورة المحسّنة
                </Button>
              </a>
            </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-center text-secondary mb-6">صوري السابقة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {history.map(img => (
                    <div key={img.id} className="group relative rounded-lg overflow-hidden shadow-md border">
                        <img src={img.enhanced} alt="Enhanced thumbnail" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 gap-2">
                           <Button onClick={() => viewFromHistory(img)} variant="secondary" className="w-full text-sm">عرض المقارنة</Button>
                           <Button onClick={() => deleteFromHistory(img.id)} className="w-full text-sm !bg-red-500 hover:!bg-red-600">حذف</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
