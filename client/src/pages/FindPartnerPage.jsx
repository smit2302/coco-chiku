import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { triggerLoveConfetti } from '../utils/confetti';

export const FindPartnerPage = () => {
  const { 
    theme, 
    username, 
    partnerName, 
    updateProfile, 
    isPartnerConnected, 
    pairKey,
    sendLoveAction
  } = useCouple();

  const [myName, setMyName] = useState(username || '');
  const [targetPartner, setTargetPartner] = useState(partnerName || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleConnect = (e) => {
    e.preventDefault();
    if (!myName.trim() || !targetPartner.trim()) return;

    updateProfile(myName.trim(), targetPartner.trim());
    triggerLoveConfetti();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}?partner=${encodeURIComponent(myName)}&me=${encodeURIComponent(targetPartner)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const quickSwitchRoles = () => {
    const temp = myName;
    setMyName(targetPartner);
    setTargetPartner(temp);
    updateProfile(targetPartner, temp);
    triggerLoveConfetti();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 sm:pb-8">
      {/* Header Banner */}
      <div 
        className={`p-6 sm:p-8 rounded-3xl text-center relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'glass-dark-card border border-purple-500/30'
            : 'glass-light-card border border-purple-200'
        }`}
      >
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 shadow-xl shadow-pink-500/20">
          <Users className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black">
          Find & Connect With Partner
        </h1>
        <p className="text-xs sm:text-sm text-purple-300/80 mt-1 max-w-md mx-auto">
          No passwords, no sign-ups required! Just enter your name and your partner's name to link up. All data is saved directly in your browser's LocalStorage!
        </p>

        {/* Real-time Status Indicator */}
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md">
          {isPartnerConnected ? (
            <span className="text-emerald-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <Wifi className="w-4 h-4" /> Live Partner Connected with {partnerName}!
            </span>
          ) : (
            <span className="text-purple-300/80 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-pink-400" /> Paired with {partnerName} (Synced in LocalStorage)
            </span>
          )}
        </div>
      </div>

      {/* Connection Form */}
      <div 
        className={`p-6 sm:p-8 rounded-3xl transition-all ${
          theme === 'dark'
            ? 'glass-dark border border-purple-800/20'
            : 'glass-light border border-purple-200'
        }`}
      >
        <form onSubmit={handleConnect} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* My Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-purple-300">
                Your Name
              </label>
              <input
                type="text"
                value={myName}
                onChange={(e) => setMyName(e.target.value)}
                placeholder="e.g. Coco"
                required
                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-purple-950/40 border border-purple-700/50 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
                    : 'bg-white/80 border border-purple-300 text-purple-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20'
                }`}
              />
            </div>

            {/* Partner's Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-purple-300">
                Partner's Name to Find
              </label>
              <input
                type="text"
                value={targetPartner}
                onChange={(e) => setTargetPartner(e.target.value)}
                placeholder="e.g. Chiku"
                required
                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-purple-950/40 border border-purple-700/50 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
                    : 'bg-white/80 border border-purple-300 text-purple-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20'
                }`}
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-purple-400/80 font-medium">Quick Nicknames:</span>
            {['Coco', 'Chiku', 'Babu', 'Shona', 'Jaanu', 'Cutie'].map((nick) => (
              <button
                key={nick}
                type="button"
                onClick={() => {
                  if (!myName) setMyName(nick);
                  else setTargetPartner(nick);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs transition-all ${
                  theme === 'dark'
                    ? 'bg-purple-900/30 hover:bg-purple-800/40 text-purple-300 border border-purple-700/30'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200'
                }`}
              >
                + {nick}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              type="submit"
              className={`w-full sm:flex-1 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'btn-matte-dark text-white shadow-lg shadow-purple-950/50'
                  : 'btn-matte-light text-white shadow-md'
              }`}
            >
              <Heart className="w-4 h-4 fill-white text-white animate-heartbeat" />
              <span>Connect With {targetPartner || 'Partner'}</span>
            </button>

            <button
              type="button"
              onClick={quickSwitchRoles}
              title="Switch roles (I am Chiku / Coco)"
              className={`w-full sm:w-auto py-3 px-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                theme === 'dark'
                  ? 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/40'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Swap Roles</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center animate-in fade-in">
              ✨ Connected successfully! You and {partnerName} are now paired!
            </div>
          )}
        </form>
      </div>

      {/* Share / Pairing Room Info */}
      <div 
        className={`p-6 rounded-3xl transition-all ${
          theme === 'dark'
            ? 'glass-dark border border-purple-800/20'
            : 'glass-light border border-purple-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Invite / Share with Partner</h3>
              <p className="text-xs text-purple-400/80">Send this link to your partner so they connect in 1 click!</p>
            </div>
          </div>
          <button
            onClick={copyShareLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : theme === 'dark'
                ? 'bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 border border-purple-700/40'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Pair Room Key */}
        <div 
          className={`p-3.5 rounded-2xl text-xs font-mono flex items-center justify-between border ${
            theme === 'dark'
              ? 'bg-purple-950/60 border-purple-800/40 text-purple-300'
              : 'bg-white border-purple-200 text-purple-800'
          }`}
        >
          <span className="truncate">Pair Key: <strong>{pairKey}</strong></span>
          <span className="text-[11px] text-pink-400 font-sans">Automatic matching</span>
        </div>

        {/* Local Storage Privacy Note */}
        <div className="mt-4 flex items-start gap-2 text-xs text-purple-400/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>100% Private & No DB:</strong> All your tasks, dates, and room schedules are stored locally in each of your browsers via LocalStorage. Zero database or password accounts needed!
          </span>
        </div>
      </div>
    </div>
  );
};
