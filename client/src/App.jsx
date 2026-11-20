import React, { useState, useEffect } from 'react';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import { Navbar } from './components/Navbar';
import { DayScoreModal } from './components/DayScoreModal';
import { LoveActionToast } from './components/LoveActionToast';
import { HomePage } from './pages/HomePage';
import { FindPartnerPage } from './pages/FindPartnerPage';
import { EverydayTaskPage } from './pages/EverydayTaskPage';
import { OurRoomPage } from './pages/OurRoomPage';
import { Heart } from 'lucide-react';

function AppContent() {
  const { theme, username, partnerName, updateProfile } = useCouple();
  const [activeTab, setActiveTab] = useState('home');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Check URL query parameters for instant pairing link (e.g. ?me=Coco&partner=Chiku)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const meParam = params.get('me');
    const partnerParam = params.get('partner');
    if (meParam && partnerParam) {
      updateProfile(meParam, partnerParam);
    }
  }, []);

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 relative flex flex-col ${
        theme === 'dark'
          ? 'bg-[#0B0716] text-[#E9D5FF] selection:bg-purple-600 selection:text-white'
          : 'bg-[#FAF8FF] text-[#2E1065] selection:bg-purple-400 selection:text-white'
      }`}
    >
      {/* Background Ambience Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-700 ${
            theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-300/25'
          }`}
        />
        <div 
          className={`absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-700 ${
            theme === 'dark' ? 'bg-pink-900/15' : 'bg-pink-300/20'
          }`}
        />
        <div 
          className={`absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-700 ${
            theme === 'dark' ? 'bg-indigo-950/20' : 'bg-purple-200/30'
          }`}
        />
      </div>

      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenDateModal={() => setIsDateModalOpen(true)}
      />

      {/* Main Page View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 relative z-10">
        {activeTab === 'home' && (
          <HomePage 
            setActiveTab={setActiveTab} 
            onOpenDateModal={() => setIsDateModalOpen(true)} 
          />
        )}
        {activeTab === 'partner' && <FindPartnerPage />}
        {activeTab === 'tasks' && <EverydayTaskPage />}
        {activeTab === 'room' && <OurRoomPage />}
      </main>

      {/* Relationship Start Date Modal */}
      <DayScoreModal 
        isOpen={isDateModalOpen} 
        onClose={() => setIsDateModalOpen(false)} 
      />

      {/* Love Action Toast Notifications */}
      <LoveActionToast />

      {/* Sweet Footer */}
      <footer 
        className={`mt-auto py-6 border-t text-center text-xs relative z-10 transition-colors ${
          theme === 'dark' 
            ? 'border-purple-900/30 text-purple-400/60' 
            : 'border-purple-200 text-purple-700/60'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-heartbeat" />
          <span>for {username} & {partnerName} &bull; LocalStorage Synced</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CoupleProvider>
      <AppContent />
    </CoupleProvider>
  );
}
