import React from 'react';
import { 
  Heart, 
  Users, 
  CheckSquare, 
  Moon, 
  Sun, 
  Calendar, 
  Home, 
  Compass,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenDateModal }) => {
  const { theme, toggleTheme, username, partnerName, isPartnerConnected } = useCouple();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'partner', label: 'Find Partner', icon: Users },
    { id: 'tasks', label: 'Everyday Tasks', icon: CheckSquare },
    { id: 'room', label: 'Our Room', icon: Compass },
  ];

  return (
    <>
      {/* Top Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-md ${
          theme === 'dark'
            ? 'glass-dark border-b border-purple-900/30 text-purple-100'
            : 'glass-light border-b border-purple-200 text-purple-950'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Couple Names */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-purple-600 to-pink-500 shadow-md group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-white fill-white animate-heartbeat" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPartnerConnected ? 'bg-emerald-400' : 'bg-purple-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPartnerConnected ? 'bg-emerald-500' : 'bg-purple-500'}`}></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg sm:text-xl tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  {username || 'Coco'}
                </span>
                <span className="text-pink-500 text-sm">❤️</span>
                <span className={theme === 'dark' ? 'text-purple-200' : 'text-purple-900'}>
                  {partnerName || 'Chiku'}
                </span>
              </div>
              <p className="text-[10px] text-purple-400/80 font-medium tracking-wide flex items-center gap-1">
                {isPartnerConnected ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5" /> Live Sync Connected
                  </span>
                ) : (
                  <span className="text-purple-400/70 flex items-center gap-1">
                    <WifiOff className="w-2.5 h-2.5" /> Saved in LocalStorage
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl backdrop-blur-md bg-purple-950/20 dark:bg-black/30 border border-purple-500/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? theme === 'dark'
                        ? 'btn-matte-dark text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-900/30'
                        : 'btn-matte-light text-white shadow-md'
                      : theme === 'dark'
                      ? 'text-purple-300/80 hover:text-white hover:bg-purple-900/20'
                      : 'text-purple-700/80 hover:text-purple-950 hover:bg-purple-100/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Set Relation Date Button */}
            <button
              onClick={onOpenDateModal}
              title="Set relationship start date"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-purple-950/50 hover:bg-purple-900/50 text-purple-200 border border-purple-700/40 shadow-sm'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 shadow-sm'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Set Date</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`p-2 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'bg-purple-950/60 hover:bg-purple-900 text-amber-300 border border-purple-700/40 shadow-sm'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 shadow-sm'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 py-2 border-t backdrop-blur-lg ${
          theme === 'dark'
            ? 'glass-dark border-purple-900/40 text-purple-200'
            : 'glass-light border-purple-200 text-purple-900'
        }`}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? theme === 'dark'
                      ? 'text-pink-400 font-semibold'
                      : 'text-purple-700 font-semibold'
                    : 'text-purple-400/60 hover:text-purple-300'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? (theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-200/70') : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
