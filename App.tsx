import React, { useState, useEffect, useCallback } from 'react';
import Scene3D from './components/Scene3D';
import ResultDisplay from './components/ResultDisplay';
import { AppState, CityTheme, GeneratedContent } from './types';
import { generateBlindBoxResult, checkApiKey, promptApiKey } from './services/genai';

// Complete list of 21 Sichuan Cities with unique "Pie" brands
const CITIES: CityTheme[] = [
  { 
    id: 'luzhou', 
    name: '泸州', 
    trait: '豪爽酒仙', 
    productName: '荔枝酒 (Lychee Wine)',
    fruit: 'Lychee',
    brandName: '荔想派',
    brandEnglish: 'DreamPie',
    description: 'Sweet & Romantic', 
    color: '#fb7185' // Rose
  },
  { 
    id: 'yibin', 
    name: '宜宾', 
    trait: '自由洒脱', 
    productName: '真龙柚酒 (Pomelo Wine)',
    fruit: 'Pomelo',
    brandName: '自柚派',
    brandEnglish: 'FreePie',
    description: 'Citrus & Vibrant', 
    color: '#fbbf24' // Amber
  },
  { 
    id: 'chengdu', 
    name: '成都', 
    trait: '浪漫巴适', 
    productName: '水蜜桃酒 (Peach Wine)',
    fruit: 'Peach',
    brandName: '桃醉派',
    brandEnglish: 'ThrillPie',
    description: 'Fresh & Floral', 
    color: '#f9a8d4' // Pink
  },
  { 
    id: 'panzhihua', 
    name: '攀枝花', 
    trait: '热情阳光', 
    productName: '芒果酒 (Mango Wine)',
    fruit: 'Mango',
    brandName: '芒乐派',
    brandEnglish: 'JoyPie',
    description: 'Tropical & Rich', 
    color: '#f59e0b' // Orange
  },
  {
    id: 'zigong',
    name: '自贡',
    trait: '盐都美食家',
    productName: '无花果酒 (Fig Wine)',
    fruit: 'Fig',
    brandName: '无忧派',
    brandEnglish: 'CalmPie',
    description: 'Mellow & Sweet',
    color: '#a78bfa' // Purple
  },
  {
    id: 'deyang',
    name: '德阳',
    trait: '古蜀文明',
    productName: '冬枣酒 (Jujube Wine)',
    fruit: 'Jujube',
    brandName: '早安派',
    brandEnglish: 'MorningPie',
    description: 'Crisp & Sweet',
    color: '#ef4444' // Red
  },
  {
    id: 'mianyang',
    name: '绵阳',
    trait: '科技新贵',
    productName: '青梅酒 (Green Plum Wine)',
    fruit: 'Green Plum',
    brandName: '梅好派',
    brandEnglish: 'FinePie',
    description: 'Tart & Refreshing',
    color: '#84cc16' // Lime
  },
  {
    id: 'guangyuan',
    name: '广元',
    trait: '女皇故里',
    productName: '猕猴桃酒 (Kiwi Wine)',
    fruit: 'Kiwi',
    brandName: '猕恋派',
    brandEnglish: 'KiwiPie',
    description: 'Exotic & Green',
    color: '#65a30d' // Green
  },
  {
    id: 'suining',
    name: '遂宁',
    trait: '观音故里',
    productName: '莲子酒 (Lotus Wine)',
    fruit: 'Lotus',
    brandName: '莲心派',
    brandEnglish: 'ZenPie',
    description: 'Herbal & Clear',
    color: '#2dd4bf' // Teal
  },
  {
    id: 'neijiang',
    name: '内江',
    trait: '甜城不仅甜',
    productName: '甘蔗酒 (Rum style)',
    fruit: 'Sugarcane',
    brandName: '蔗里派',
    brandEnglish: 'SugarPie',
    description: 'Sweet & Strong',
    color: '#d97706' // Brown/Orange
  },
  {
    id: 'leshan',
    name: '乐山',
    trait: '大佛守护',
    productName: '枇杷酒 (Loquat Wine)',
    fruit: 'Loquat',
    brandName: '乐枇派',
    brandEnglish: 'LutePie',
    description: 'Golden & Smooth',
    color: '#fb923c' // Orange
  },
  {
    id: 'nanchong',
    name: '南充',
    trait: '绸都风情',
    productName: '晚熟柑橘酒 (Orange Wine)',
    fruit: 'Mandarin Orange',
    brandName: '柑愿派',
    brandEnglish: 'WishPie',
    description: 'Citrus & Sweet',
    color: '#f97316' // Orange
  },
  {
    id: 'meishan',
    name: '眉山',
    trait: '东坡诗意',
    productName: '不知火桔酒 (Dekopon)',
    fruit: 'Dekopon Orange',
    brandName: '不知派',
    brandEnglish: 'PoetPie',
    description: 'Zesty & Aromatic',
    color: '#ea580c' // Dark Orange
  },
  {
    id: 'guangan',
    name: '广安',
    trait: '伟人故里',
    productName: '蜜梨酒 (Pear Wine)',
    fruit: 'Pear',
    brandName: '梨想派',
    brandEnglish: 'PearPie',
    description: 'Crisp & Pure',
    color: '#fcd34d' // Yellow
  },
  {
    id: 'dazhou',
    name: '达州',
    trait: '巴人豪气',
    productName: '脆李酒 (Plum Wine)',
    fruit: 'Crisp Plum',
    brandName: '达意派',
    brandEnglish: 'PlumPie',
    description: 'Sour & Sweet',
    color: '#10b981' // Emerald
  },
  {
    id: 'yaan',
    name: '雅安',
    trait: '雨城熊猫',
    productName: '大樱桃酒 (Cherry Wine)',
    fruit: 'Cherry',
    brandName: '樱韵派',
    brandEnglish: 'CherryPie',
    description: 'Ruby & Rich',
    color: '#be123c' // Red
  },
  {
    id: 'bazhong',
    name: '巴中',
    trait: '红色记忆',
    productName: '核桃酒 (Walnut Liqueur)',
    fruit: 'Walnut',
    brandName: '核气派',
    brandEnglish: 'NutPie',
    description: 'Nutty & Smooth',
    color: '#78350f' // Brown
  },
  {
    id: 'ziyang',
    name: '资阳',
    trait: '柠檬之都',
    productName: '柠檬酒 (Limoncello)',
    fruit: 'Lemon',
    brandName: '柠静派',
    brandEnglish: 'LemonPie',
    description: 'Zesty & Fresh',
    color: '#fef08a' // Yellow
  },
  {
    id: 'aba',
    name: '阿坝',
    trait: '高原净土',
    productName: '苹果酒 (Cider)',
    fruit: 'Apple',
    brandName: '苹安派',
    brandEnglish: 'ApplePie',
    description: 'Crisp & Bubbly',
    color: '#dc2626' // Red
  },
  {
    id: 'ganzi',
    name: '甘孜',
    trait: '康定情歌',
    productName: '沙棘酒 (Sea Buckthorn)',
    fruit: 'Sea Buckthorn',
    brandName: '棘刻派',
    brandEnglish: 'ThornPie',
    description: 'Tangy & Wild',
    color: '#d97706' // Orange
  },
  {
    id: 'liangshan',
    name: '凉山',
    trait: '火把节',
    productName: '石榴酒 (Pomegranate)',
    fruit: 'Pomegranate',
    brandName: '石榴派',
    brandEnglish: 'GarnetPie',
    description: 'Jewel & Sweet',
    color: '#9f1239' // Burgundy
  }
];

// Mystery Loading Messages
const LOADING_MESSAGES = [
    "正在穿越四川的山川河流...",
    "寻找最地道的乡土风味...",
    "正在调配神秘城市配方...",
    "捕捉一丝微醺的灵感...",
    "正在唤醒沉睡的味蕾...",
    "开启一段未知的旅程..."
];

// New Loading Component
const LoadingView: React.FC = () => {
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    setMessage(randomMsg);
  }, []);

  return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
          <div className="relative">
             {/* Mystery Pulsing Core - Generic Colors */}
             <div 
               className="w-32 h-32 rounded-full animate-pulse blur-md opacity-80 bg-gradient-to-tr from-purple-400 to-pink-500"
             ></div>
             <div 
               className="w-32 h-32 rounded-full absolute top-0 left-0 animate-ping opacity-30 bg-white"
             ></div>
             
             {/* Icon */}
             <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
                🎁
             </div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
              <h3 className="text-xl font-bold text-gray-800">
                 {message}
              </h3>
              <p className="text-gray-500 text-sm">
                 Loading Mystery Box...
              </p>
          </div>
      </div>
  );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [targetCity, setTargetCity] = useState<CityTheme | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const initKey = async () => {
      try {
        const keyExists = await checkApiKey();
        setHasKey(keyExists);
      } catch (e) {
        console.warn("API Key check failed", e);
      }
    };
    initKey();
  }, []);

  const handleSetKey = async () => {
      try {
          await promptApiKey();
          setHasKey(true); 
      } catch (e) {
          console.error(e);
          setErrorMsg("Failed to set API Key.");
      }
  };

  const handleOpenBox = useCallback(async () => {
    if (!hasKey) {
        await handleSetKey();
        return;
    }

    if (appState !== AppState.IDLE) return;

    setErrorMsg('');
    // 1. Decide destination immediately
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    setTargetCity(randomCity);
    
    // 2. Start animation state
    setAppState(AppState.OPENING);

    // 3. API Call
    const minAnimationTime = new Promise(resolve => setTimeout(resolve, 2500)); // Ensure user sees the nice loading screen
    const contentGeneration = generateBlindBoxResult(randomCity);

    try {
        const [_, content] = await Promise.all([minAnimationTime, contentGeneration]);
        setResult(content);
        setAppState(AppState.REVEALED);
    } catch (err) {
        console.error(err);
        setErrorMsg("生成失败，请重试");
        setAppState(AppState.IDLE);
        setTargetCity(null);
    }
  }, [appState, hasKey]);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setTargetCity(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 relative max-w-2xl mx-auto overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-300 rounded-full blur-3xl translate-x-[-50%] translate-y-[-50%]"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl translate-x-[50%] translate-y-[50%]"></div>
      </div>

      {/* Header */}
      <header className="w-full flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-rose-200">
             川
           </div>
           <h1 className="text-xl font-bold text-gray-800 tracking-tight">川流不息 Blind Box</h1>
        </div>
        {!hasKey && (
             <button onClick={handleSetKey} className="text-xs bg-gray-900 text-white px-3 py-1 rounded">
                 Set API Key
             </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center min-h-[500px] z-10 relative">
        
        {/* Idle Title */}
        {appState === AppState.IDLE && (
            <div className="text-center mb-8 animate-in slide-in-from-bottom-5 duration-700">
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500 mb-4 drop-shadow-sm">
                    川流不息
                </h2>
                <p className="text-gray-500 font-medium tracking-wide">Endless Flow · Sichuan Fruit Wine</p>
                <div className="mt-6 flex gap-2 justify-center text-xs text-gray-400">
                    <span className="bg-white/50 border border-gray-100 px-3 py-1 rounded-full backdrop-blur-sm">21 Cities</span>
                    <span className="bg-white/50 border border-gray-100 px-3 py-1 rounded-full backdrop-blur-sm">AI Generated</span>
                    <span className="bg-white/50 border border-gray-100 px-3 py-1 rounded-full backdrop-blur-sm">Collect Them All</span>
                </div>
            </div>
        )}

        {/* 3D Box Scene */}
        <div className="relative w-full h-[400px] flex items-center justify-center">
             {/* The box itself */}
             {appState !== AppState.REVEALED && (
                 <div className={`transition-opacity duration-500 ${appState === AppState.OPENING ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                    <Scene3D appState={appState} onClick={handleOpenBox} />
                 </div>
             )}
             
             {/* The Loading State (replaces box when opening) */}
             {appState === AppState.OPENING && (
                 <LoadingView />
             )}

             {/* The Result */}
             {appState === AppState.REVEALED && (
                 <ResultDisplay content={result} onReset={handleReset} />
             )}
        </div>

        {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm animate-pulse">
                {errorMsg}
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 text-xs max-w-sm z-10">
        <p className="mb-2">Powered by Google Gemini 3 Pro & Imagen</p>
        <p className="opacity-60">
            Experience the 21 flavors of Sichuan.
        </p>
      </footer>
    </div>
  );
};

export default App;