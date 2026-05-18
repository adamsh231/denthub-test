import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Moon, Sun, Plus } from 'lucide-react';

export default function CalmBreathingCanvas({ onSimulate }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  // Live clock in GMT+7 matching USER.md context
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false };
      const timeStr = now.toLocaleTimeString('en-US', options);
      setCurrentTime(`${timeStr} GMT+7`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 h-screen w-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden transition-colors duration-1000 select-none ${
      isDarkMode ? 'bg-[#090B10] text-neutral-100' : 'bg-[#FAF9F6] text-neutral-800'
    }`}>
      
      {/* Dynamic Animated Breathing Canvas Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute inset-0 z-10 backdrop-blur-[1px] transition-colors duration-1000 ${
          isDarkMode ? 'bg-[#090B10]/20' : 'bg-[#FAF9F6]/20'
        }`} />
        
        {/* Primary Breathing Sage-Teal Blob */}
        <div className={`absolute top-[10%] left-[15%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full blur-[80px] sm:blur-[120px] transition-colors duration-1000 animate-breathe-primary ${
          isDarkMode ? 'bg-gradient-to-tr from-emerald-950/20 to-teal-900/15 mix-blend-screen' : 'bg-gradient-to-tr from-emerald-100/35 to-teal-100/25 mix-blend-multiply'
        }`} />
                    
        {/* Secondary Breathing Warm Rose-Gold Blob */}
        <div className={`absolute bottom-[10%] right-[10%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full blur-[90px] sm:blur-[140px] transition-colors duration-1000 animate-breathe-secondary ${
          isDarkMode ? 'bg-gradient-to-bl from-purple-950/15 to-rose-950/15 mix-blend-screen' : 'bg-gradient-to-bl from-rose-100/30 to-amber-100/20 mix-blend-multiply'
        }`} />
      </div>

      {/* Header Info */}
      <header className="relative z-10 flex items-center justify-between w-full opacity-80 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">DentHub</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-pulse"></span>
        </div>
        
        <div className="flex items-center gap-6 text-xs text-neutral-400 dark:text-neutral-500 font-light tracking-wide">
          <span>{currentTime}</span>
          <div class="flex items-center gap-1.5">
            <span class="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
            <span>Calm Mode</span>
          </div>
        </div>
      </header>

      {/* Centerpiece Fallback Typography */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-[42px] font-light tracking-tight leading-tight mb-4 animate-fade-in-title">
            No appointments yet.
          </h1>
          <p className="text-base sm:text-lg font-light tracking-wide opacity-60 animate-fade-in-subtitle">
            Enjoy the quiet.
          </p>
        </div>
      </main>

      {/* Foot Controls (Invisible UI style) */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-xs text-neutral-400 dark:text-neutral-500 font-light tracking-wide animate-fade-in-ui">
        
        {/* Breathing Rate Indicator */}
        <div className="flex items-center gap-3 bg-neutral-200/20 dark:bg-neutral-900/20 border border-neutral-200/5 backdrop-blur-md px-3.5 py-2 rounded-full">
          <Heart className="w-3.5 h-3.5 text-emerald-500/80 animate-pulse" />
          <span>Breathing Cycle: <span className="font-medium text-neutral-600 dark:text-neutral-300">10s (6 bpm)</span></span>
        </div>

        {/* Theme and Interaction Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-neutral-200/30 dark:hover:bg-neutral-800/30 transition-all duration-300 active:scale-95 border border-transparent hover:border-neutral-200/20 text-neutral-500 dark:text-neutral-400 cursor-pointer"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span>Switch to Light Quiet</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Switch to Dark Quiet</span>
              </>
            )}
          </button>
          
          <button 
            onClick={onSimulate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-800 text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#090B10] font-semibold transition-all duration-300 active:scale-95 hover:opacity-90 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Request</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
