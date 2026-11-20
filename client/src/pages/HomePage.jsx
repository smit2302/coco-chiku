import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  MessageCircleHeart, 
  Award, 
  ArrowRight,
  Flame,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { calculateRelationshipScore, getMilestones, formatTime12h } from '../utils/dateUtils';
import { triggerLoveConfetti } from '../utils/confetti';

export const HomePage = ({ setActiveTab, onOpenDateModal }) => {
  const { 
    theme, 
    username, 
    partnerName, 
    relationStartDate, 
    tasks, 
    roomSchedule, 
    sendLoveAction,
    isPartnerConnected 
  } = useCouple();

  const [score, setScore] = useState(() => calculateRelationshipScore(relationStartDate));

  // Live timer tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(calculateRelationshipScore(relationStartDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [relationStartDate]);

  // Tasks statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;
  const pendingTasks = totalTasks - completedTasks;

  // Next call slot
  const nextCall = roomSchedule.callSlots?.[0];

  // Milestones
  const milestones = getMilestones(score.totalDays);
  const nextMilestone = milestones.find(m => !m.achieved) || milestones[milestones.length - 1];

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-8">
      {/* Hero: Relationship Day Score */}
      <div 
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 transition-all duration-300 ${
          theme === 'dark' 
            ? 'glass-dark-card border border-purple-500/30' 
            : 'glass-light-card border border-purple-200'
        }`}
      >
        {/* Ambient Glowing Circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Couple Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-purple-500/10 border border-purple-400/30 text-xs font-semibold uppercase tracking-wider text-pink-400 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{username} & {partnerName}'s Love Story</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              {score.totalDays} Days
            </span>
            <span className="text-pink-500 ml-2 animate-heartbeat inline-block">❤️</span>
          </h1>

          <p className="text-sm sm:text-base font-medium text-purple-300/90 mt-2 max-w-md">
            Together in love, laughter, and every little moment of life
          </p>

          {/* Live Hours, Minutes, Seconds Counters */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6 w-full max-w-lg">
            {[
              { label: 'Days', value: score.days },
              { label: 'Hours', value: score.hours },
              { label: 'Minutes', value: score.minutes },
              { label: 'Seconds', value: score.seconds },
            ].map((unit, i) => (
              <div
                key={i}
                className={`p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  theme === 'dark'
                    ? 'bg-purple-950/40 border border-purple-800/30'
                    : 'bg-white/80 border border-purple-100 shadow-sm'
                }`}
              >
                <span className="text-xl sm:text-3xl font-black tracking-tight bg-gradient-to-b from-purple-200 to-purple-400 bg-clip-text text-transparent">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-purple-400/80 uppercase tracking-wider mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {/* "When Start Your Relation" Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={onOpenDateModal}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                theme === 'dark'
                  ? 'btn-matte-dark text-purple-100 shadow-lg shadow-purple-950/50'
                  : 'btn-matte-light text-white shadow-md'
              }`}
            >
              <Calendar className="w-4 h-4 text-pink-300" />
              <span>When Did Our Relation Start?</span>
            </button>

            <button
              onClick={() => {
                triggerLoveConfetti();
                sendLoveAction('heart', `${username} celebrated our love day score with confetti! 💖`);
              }}
              className={`p-2.5 rounded-2xl transition-all ${
                theme === 'dark'
                  ? 'bg-purple-900/30 hover:bg-purple-800/40 text-pink-400 border border-purple-700/30'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200'
              }`}
              title="Celebrate with confetti!"
            >
              <Flame className="w-4 h-4" />
            </button>
          </div>

          {/* Milestone Target Tracker */}
          {nextMilestone && (
            <div className="w-full max-w-md mt-6 pt-5 border-t border-purple-500/15">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-purple-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-pink-400" /> Next Milestone: {nextMilestone.label}
                </span>
                <span className="text-pink-400 font-bold">{nextMilestone.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-950/40 dark:bg-black/40 overflow-hidden border border-purple-700/20">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                  style={{ width: `${nextMilestone.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Interactive Love Actions Bar */}
      <div 
        className={`p-4 sm:p-5 rounded-3xl transition-all ${
          theme === 'dark'
            ? 'glass-dark border border-purple-800/20'
            : 'glass-light border border-purple-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2 text-purple-300">
            <HeartHandshake className="w-4 h-4 text-pink-400" />
            <span>Send Instant Love to {partnerName}</span>
          </h3>
          <span className="text-[11px] text-purple-400/80">Tap to send!</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => sendLoveAction('kiss')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-purple-950/40 hover:bg-pink-950/40 text-pink-300 border border-purple-800/30 hover:border-pink-500/50'
                : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200'
            }`}
          >
            <span className="text-lg">💋</span>
            <span>Send Kiss</span>
          </button>

          <button
            onClick={() => sendLoveAction('hug')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 border border-purple-800/30 hover:border-purple-500/50'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
            }`}
          >
            <span className="text-lg">🫂</span>
            <span>Warm Hug</span>
          </button>

          <button
            onClick={() => sendLoveAction('heart')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-purple-950/40 hover:bg-purple-900/40 text-pink-300 border border-purple-800/30 hover:border-pink-500/50'
                : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200'
            }`}
          >
            <span className="text-lg">💓</span>
            <span>Heartbeat</span>
          </button>

          <button
            onClick={() => sendLoveAction('missYou')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-purple-950/40 hover:bg-indigo-950/40 text-indigo-300 border border-purple-800/30 hover:border-indigo-500/50'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
          >
            <span className="text-lg">🥺</span>
            <span>Miss You</span>
          </button>
        </div>
      </div>

      {/* Two Column Summary Grid: Tasks Preview & Our Room Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Everyday Tasks Preview Card */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className={`cursor-pointer group p-6 rounded-3xl transition-all duration-300 ${
            theme === 'dark'
              ? 'glass-dark-card border border-purple-800/30 hover:border-purple-500/50'
              : 'glass-light-card border border-purple-200 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-purple-500/20 text-purple-400">
                <CheckCircle2 className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Everyday Tasks</h3>
                <p className="text-xs text-purple-400/80">Daily goals for both of you</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Status feedback as requested */}
          <div 
            className={`p-4 rounded-2xl mb-4 transition-all ${
              allTasksCompleted
                ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/20 border border-rose-500/30 text-rose-300'
            }`}
          >
            {allTasksCompleted ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Congratulations! You Done It!
                  </h4>
                  <p className="text-xs mt-0.5">
                    All tasks completed! Super proud of you two! 💖
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse">💔</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    {pendingTasks} Task{pendingTasks > 1 ? 's' : ''} Still Pending 💔
                  </h4>
                  <p className="text-xs mt-0.5">
                    Don't break my heart! Let's finish today's tasks together!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-purple-300/80 font-medium pt-1">
            <span>Completed: <strong className="text-pink-400">{completedTasks}</strong> / {totalTasks}</span>
            <span className="text-pink-400 font-semibold group-hover:underline">Open Tasks &rarr;</span>
          </div>
        </div>

        {/* Our Room Preview Card */}
        <div 
          onClick={() => setActiveTab('room')}
          className={`cursor-pointer group p-6 rounded-3xl transition-all duration-300 ${
            theme === 'dark'
              ? 'glass-dark-card border border-purple-800/30 hover:border-purple-500/50'
              : 'glass-light-card border border-purple-200 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                <PhoneCall className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Our Room Schedule</h3>
                <p className="text-xs text-purple-400/80">Free time slots & call timings</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Next Call Scheduled */}
          <div 
            className={`p-4 rounded-2xl mb-4 transition-all ${
              theme === 'dark'
                ? 'bg-purple-950/40 border border-purple-800/40 text-purple-200'
                : 'bg-purple-50 border border-purple-200 text-purple-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold">Today's Call Time</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-medium">
                {nextCall?.callType || 'Video Call'}
              </span>
            </div>
            <div className="text-lg font-bold text-pink-400 mt-1">
              {nextCall?.time ? formatTime12h(nextCall.time) : 'No call scheduled yet'}
            </div>
            <p className="text-xs text-purple-300/80 mt-0.5 line-clamp-1">
              {nextCall?.title || 'Tap to plan when you two will talk today!'}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-purple-300/80 font-medium pt-1">
            <span>Free Slots Today: <strong className="text-pink-400">{roomSchedule.freeSlots?.length || 0}</strong></span>
            <span className="text-pink-400 font-semibold group-hover:underline">Enter Room &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};
