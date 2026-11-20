import React, { useState } from 'react';
import { X, Calendar, Heart, Sparkles, Clock, Check } from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { calculateRelationshipScore } from '../utils/dateUtils';
import { triggerLoveConfetti } from '../utils/confetti';

export const DayScoreModal = ({ isOpen, onClose }) => {
  const { theme, relationStartDate, updateRelationDate, username, partnerName } = useCouple();
  const [selectedDate, setSelectedDate] = useState(relationStartDate || '');
  const [justSaved, setJustSaved] = useState(false);

  if (!isOpen) return null;

  const currentScore = calculateRelationshipScore(selectedDate);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    updateRelationDate(selectedDate);
    triggerLoveConfetti();
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div 
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all duration-300 ${
          theme === 'dark'
            ? 'glass-dark border border-purple-500/30 text-white'
            : 'glass-light border border-purple-300 text-purple-950'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-purple-900/40 text-purple-300' 
              : 'hover:bg-purple-100 text-purple-700'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25">
            <Heart className="w-7 h-7 text-white fill-white animate-heartbeat" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-pink-400">
            Love Journey Counter
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            When Did Your Relation Start?
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            Set the special day {username} and {partnerName} fell in love
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-purple-300">
              Relationship Anniversary / Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-purple-950/40 border border-purple-700/50 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20'
                    : 'bg-white/80 border border-purple-300 text-purple-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20'
                }`}
              />
              <Calendar className="w-4 h-4 text-purple-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Live Preview Score */}
          {selectedDate && (
            <div 
              className={`p-4 rounded-2xl border text-center transition-all ${
                theme === 'dark'
                  ? 'bg-purple-900/20 border-purple-700/30'
                  : 'bg-purple-50 border-purple-200'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-pink-400 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Calculated Score</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                {currentScore.days} Days
              </div>
              <p className="text-[11px] text-purple-300/80 mt-0.5">
                {currentScore.hours}h {currentScore.minutes}m {currentScore.seconds}s of eternal love 💕
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 border border-purple-800/40'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={justSaved || !selectedDate}
              className={`flex-1 py-3 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                justSaved
                  ? 'bg-emerald-600 text-white'
                  : theme === 'dark'
                  ? 'btn-matte-dark text-white'
                  : 'btn-matte-light text-white'
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white text-white" />
                  Set Relationship Time
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
