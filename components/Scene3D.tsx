import React from 'react';
import { AppState } from '../types';

interface Scene3DProps {
  appState: AppState;
  onClick: () => void;
}

const Scene3D: React.FC<Scene3DProps> = ({ appState, onClick }) => {
  const isOpening = appState === AppState.OPENING || appState === AppState.GENERATING;

  return (
    <div className="w-full h-[400px] flex justify-center items-center relative perspective-1000">
        {/* Glow effect behind the box */}
        <div className={`absolute w-64 h-64 bg-rose-400 rounded-full blur-3xl opacity-20 transition-opacity duration-500 ${isOpening ? 'opacity-50 scale-150' : ''}`}></div>

        <div className="scene cursor-pointer" onClick={onClick}>
          <div className={`cube ${isOpening ? 'animate-spin-fast' : 'animate-float'}`}>
            <div className="cube-face cube-front flex-col">
                <span className="text-3xl mb-2">川流不息</span>
                <span className="text-xs opacity-90">Sichuan Flow</span>
                <span className="mt-4 border-2 border-white px-2 py-1 text-xs rounded-full">城市限定</span>
            </div>
            <div className="cube-face cube-back">
                <span className="text-4xl">?</span>
            </div>
            <div className="cube-face cube-right text-lg flex-col">
                 <span>Blind</span>
                 <span>Box</span>
            </div>
            <div className="cube-face cube-left text-lg flex-col">
                <span>Mystery</span>
                <span>Wine</span>
            </div>
            <div className="cube-face cube-top flex items-center justify-center">
                <div className="w-16 h-2 bg-rose-700 rounded-full"></div>
            </div>
            <div className="cube-face cube-bottom"></div>
          </div>
        </div>
        
        {!isOpening && appState === AppState.IDLE && (
            <div className="absolute bottom-10 animate-bounce pointer-events-none">
                <span className="bg-white text-rose-600 px-4 py-2 rounded-full shadow-lg font-bold text-sm">
                    点击开箱 / Click to Open
                </span>
            </div>
        )}
    </div>
  );
};

export default Scene3D;