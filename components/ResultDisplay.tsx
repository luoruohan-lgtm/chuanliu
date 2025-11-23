import React from 'react';
import { GeneratedContent } from '../types';

interface ResultDisplayProps {
  content: GeneratedContent | null;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onReset }) => {
  if (!content) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-rose-100 animate-in fade-in zoom-in duration-500">
      <div className="p-1 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300">
          <div className="bg-white rounded-t-xl overflow-hidden relative">
             <img 
                src={content.imageUrl} 
                alt="Blind Box Result" 
                className="w-full aspect-square object-cover"
             />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                 <h2 className="text-white text-2xl font-bold">{content.cityName} 限定</h2>
             </div>
          </div>
      </div>
      
      <div className="p-6">
          <div className="flex items-center justify-between mb-4">
              <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded">
                  {content.brandName} · {content.brandEnglish}
              </span>
              <span className="text-gray-400 text-xs">Series 1.0</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2">恭喜获得隐藏款！</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {content.story}
          </p>

          <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xl">🍷</div>
                  <div className="text-[10px] text-gray-500 mt-1">{content.productName}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xl">✨</div>
                  <div className="text-[10px] text-gray-500 mt-1">{content.brandName}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xl">🃏</div>
                  <div className="text-[10px] text-gray-500 mt-1">IP 身份卡</div>
              </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-rose-200"
          >
            再抽一次 / Try Again
          </button>
      </div>
    </div>
  );
};

export default ResultDisplay;