import React from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import { useCouple } from '../context/CoupleContext';

export const LoveActionToast = () => {
  const { loveToast, setLoveToast, theme } = useCouple();

  if (!loveToast) return null;

  const iconMap = {
    kiss: '💋',
    hug: '🫂',
    heart: '💓',
    missYou: '🥺'
  };

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 duration-300">
      <div 
        className={`flex items-center gap-3 p-4 pr-5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-purple-950/85 border-pink-500/40 text-white shadow-pink-950/40'
            : 'bg-white/95 border-pink-400 text-purple-950 shadow-pink-200'
        }`}
      >
        <div className="text-3xl animate-bounce">
          {iconMap[loveToast.actionType] || '💖'}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Love Alert from {loveToast.sender}</span>
          </div>
          <p className="text-sm font-semibold mt-0.5">
            {loveToast.message}
          </p>
        </div>

        <button
          onClick={() => setLoveToast(null)}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-purple-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
