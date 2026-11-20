import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  PhoneCall, 
  Video, 
  Plus, 
  Trash2, 
  Heart, 
  Sparkles, 
  MessageSquare, 
  Smile, 
  Send,
  Coffee,
  Moon,
  CalendarCheck
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { formatTime12h } from '../utils/dateUtils';
import { triggerLoveConfetti } from '../utils/confetti';

export const OurRoomPage = () => {
  const { 
    theme, 
    username, 
    partnerName, 
    roomSchedule, 
    addFreeSlot, 
    deleteFreeSlot, 
    addCallSlot, 
    deleteCallSlot, 
    addLoveNote, 
    deleteLoveNote,
    sendLoveAction 
  } = useCouple();

  // Form toggles
  const [showFreeForm, setShowFreeForm] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Free slot form
  const [freePerson, setFreePerson] = useState(username);
  const [fromTime, setFromTime] = useState('14:00');
  const [toTime, setToTime] = useState('16:00');
  const [freeNote, setFreeNote] = useState('');

  // Call slot form
  const [callTitle, setCallTitle] = useState('Sweet Night Call 💕');
  const [callTime, setCallTime] = useState('22:30');
  const [callType, setCallType] = useState('Video Call');
  const [callNotes, setCallNotes] = useState('Talk about our day & sleep together');

  // Love Note form
  const [newNoteText, setNewNoteText] = useState('');

  const handleAddFreeSlot = (e) => {
    e.preventDefault();
    addFreeSlot({
      person: freePerson,
      fromTime,
      toTime,
      note: freeNote.trim() || 'Free to talk & chill'
    });
    setFreeNote('');
    setShowFreeForm(false);
    triggerLoveConfetti();
  };

  const handleAddCall = (e) => {
    e.preventDefault();
    if (!callTime) return;
    addCallSlot({
      title: callTitle.trim() || 'Scheduled Call',
      time: callTime,
      callType,
      notes: callNotes.trim()
    });
    setShowCallForm(false);
    triggerLoveConfetti();
    sendLoveAction('heart', `${username} scheduled a ${callType} at ${formatTime12h(callTime)}! 📞💖`);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addLoveNote(newNoteText.trim());
    setNewNoteText('');
    setShowNoteForm(false);
    triggerLoveConfetti();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 sm:pb-8">
      {/* Room Header Banner */}
      <div 
        className={`p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'glass-dark-card border border-purple-500/30'
            : 'glass-light-card border border-purple-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Private Space</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Our Room 🛋️✨
            </h1>
            <p className="text-xs sm:text-sm text-purple-300/80 mt-1 max-w-md">
              Plan your day together: check when each of you is free, schedule your next romantic call, and leave sweet love notes!
            </p>
          </div>

          {/* Quick Hug & Kiss shortcuts */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => sendLoveAction('kiss')}
              className={`p-3 rounded-2xl text-base transition-all flex items-center gap-1.5 font-bold ${
                theme === 'dark'
                  ? 'bg-purple-950/40 hover:bg-pink-950/40 text-pink-300 border border-purple-800/40 hover:border-pink-500/40'
                  : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200'
              }`}
              title="Send Kiss"
            >
              <span>💋</span>
              <span className="text-xs">Kiss</span>
            </button>
            <button
              onClick={() => sendLoveAction('hug')}
              className={`p-3 rounded-2xl text-base transition-all flex items-center gap-1.5 font-bold ${
                theme === 'dark'
                  ? 'bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 border border-purple-800/40 hover:border-purple-500/40'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
              }`}
              title="Send Hug"
            >
              <span>🫂</span>
              <span className="text-xs">Hug</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 1. Free Time Planner & 2. Call Scheduling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: Daily Free Time Tracker */}
        <div 
          className={`p-6 rounded-3xl transition-all space-y-4 ${
            theme === 'dark'
              ? 'glass-dark border border-purple-800/20'
              : 'glass-light border border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/20 text-pink-400">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">When We're Free Today</h2>
                <p className="text-[11px] text-purple-400/80">Available timings for chat or chill</p>
              </div>
            </div>

            <button
              onClick={() => setShowFreeForm(!showFreeForm)}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                theme === 'dark'
                  ? 'btn-matte-dark text-white'
                  : 'btn-matte-light text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slot</span>
            </button>
          </div>

          {/* Add Free Slot Form */}
          {showFreeForm && (
            <form 
              onSubmit={handleAddFreeSlot}
              className={`p-4 rounded-2xl border space-y-3 animate-in fade-in ${
                theme === 'dark'
                  ? 'bg-purple-950/30 border-purple-700/40'
                  : 'bg-purple-50/70 border-purple-200'
              }`}
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    Who is free?
                  </label>
                  <select
                    value={freePerson}
                    onChange={(e) => setFreePerson(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                      theme === 'dark'
                        ? 'bg-purple-900/60 text-white border border-purple-700/50'
                        : 'bg-white text-purple-900 border border-purple-300'
                    }`}
                  >
                    <option value={username}>{username} (Me)</option>
                    <option value={partnerName}>{partnerName} (Partner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    What are you doing?
                  </label>
                  <input
                    type="text"
                    value={freeNote}
                    onChange={(e) => setFreeNote(e.target.value)}
                    placeholder="e.g. Lunch break, Done with class"
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                      theme === 'dark'
                        ? 'bg-purple-900/60 text-white border border-purple-700/50'
                        : 'bg-white text-purple-900 border border-purple-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    From Time
                  </label>
                  <input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                      theme === 'dark'
                        ? 'bg-purple-900/60 text-white border border-purple-700/50'
                        : 'bg-white text-purple-900 border border-purple-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    To Time
                  </label>
                  <input
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                      theme === 'dark'
                        ? 'bg-purple-900/60 text-white border border-purple-700/50'
                        : 'bg-white text-purple-900 border border-purple-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowFreeForm(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-purple-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                    theme === 'dark' ? 'btn-matte-dark text-white' : 'btn-matte-light text-white'
                  }`}
                >
                  Save Free Slot
                </button>
              </div>
            </form>
          )}

          {/* Free Slots List */}
          <div className="space-y-2.5">
            {(!roomSchedule.freeSlots || roomSchedule.freeSlots.length === 0) ? (
              <p className="text-center py-8 text-xs text-purple-400">
                No free slots added yet for today. Tap "+ Add Slot"!
              </p>
            ) : (
              roomSchedule.freeSlots.map((slot) => {
                const isMe = slot.person?.toLowerCase() === username.toLowerCase();
                return (
                  <div
                    key={slot.id}
                    className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                      theme === 'dark'
                        ? 'bg-purple-950/30 border-purple-800/30 hover:border-purple-600/40'
                        : 'bg-white/80 border-purple-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isMe 
                          ? 'bg-purple-600/30 text-purple-300' 
                          : 'bg-pink-600/30 text-pink-300'
                      }`}>
                        {slot.person?.[0]?.toUpperCase() || '❤️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span className={isMe ? 'text-purple-300' : 'text-pink-400'}>
                            {slot.person} is free:
                          </span>
                          <span className="text-white font-mono text-[11px] px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-700/30">
                            {formatTime12h(slot.fromTime)} - {formatTime12h(slot.toTime)}
                          </span>
                        </div>
                        {slot.note && (
                          <p className="text-[11px] text-purple-300/80 mt-0.5">
                            {slot.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteFreeSlot(slot.id)}
                      className="p-1.5 text-purple-400/60 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SECTION 2: Call Schedule Tracker */}
        <div 
          className={`p-6 rounded-3xl transition-all space-y-4 ${
            theme === 'dark'
              ? 'glass-dark border border-purple-800/20'
              : 'glass-light border border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">When We'll Call</h2>
                <p className="text-[11px] text-purple-400/80">Scheduled call time & promises</p>
              </div>
            </div>

            <button
              onClick={() => setShowCallForm(!showCallForm)}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                theme === 'dark'
                  ? 'btn-matte-dark text-white'
                  : 'btn-matte-light text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plan Call</span>
            </button>
          </div>

          {/* Add Call Slot Form */}
          {showCallForm && (
            <form 
              onSubmit={handleAddCall}
              className={`p-4 rounded-2xl border space-y-3 animate-in fade-in ${
                theme === 'dark'
                  ? 'bg-purple-950/30 border-purple-700/40'
                  : 'bg-purple-50/70 border-purple-200'
              }`}
            >
              <div>
                <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                  Call Purpose / Title
                </label>
                <input
                  type="text"
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  placeholder="e.g. Night sweet talk, Lunch video call"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                    theme === 'dark'
                      ? 'bg-purple-900/60 text-white border border-purple-700/50'
                      : 'bg-white text-purple-900 border border-purple-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    Call Time
                  </label>
                  <input
                    type="time"
                    value={callTime}
                    onChange={(e) => setCallTime(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                      theme === 'dark'
                        ? 'bg-purple-900/60 text-white border border-purple-700/50'
                        : 'bg-white text-purple-900 border border-purple-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                    Call Mode
                  </label>
                  <select
                    value={callType}
                    onChange={(e) => setCallType(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                      theme === 'dark'
                        ? 'bg-purple-900/60 text-white border border-purple-700/50'
                        : 'bg-white text-purple-900 border border-purple-300'
                    }`}
                  >
                    <option value="Video Call">Video Call 📹</option>
                    <option value="Voice Call">Voice Call 📞</option>
                    <option value="Study Call">Study Together 📖</option>
                    <option value="Movie / Song Call">Movie / Songs 🎵</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                  Cute note / reminder
                </label>
                <input
                  type="text"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="e.g. Don't be late! Wear that cute smile 😊"
                  className={`w-full px-3 py-2 rounded-xl text-xs outline-none ${
                    theme === 'dark'
                      ? 'bg-purple-900/60 text-white border border-purple-700/50'
                      : 'bg-white text-purple-900 border border-purple-300'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCallForm(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-purple-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                    theme === 'dark' ? 'btn-matte-dark text-white' : 'btn-matte-light text-white'
                  }`}
                >
                  Set Call Time
                </button>
              </div>
            </form>
          )}

          {/* Calls List */}
          <div className="space-y-2.5">
            {(!roomSchedule.callSlots || roomSchedule.callSlots.length === 0) ? (
              <p className="text-center py-8 text-xs text-purple-400">
                No calls scheduled today. Plan one right now! 📞
              </p>
            ) : (
              roomSchedule.callSlots.map((call) => (
                <div
                  key={call.id}
                  className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                    theme === 'dark'
                      ? 'bg-purple-950/30 border-purple-800/30 hover:border-pink-500/40'
                      : 'bg-white/80 border-purple-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-md">
                      {call.callType?.includes('Video') ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <PhoneCall className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-pink-400">
                          {formatTime12h(call.time)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                          {call.callType}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-purple-100 mt-0.5">
                        {call.title}
                      </h4>
                      {call.notes && (
                        <p className="text-[11px] text-purple-300/80 mt-0.5">
                          "{call.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCallSlot(call.id)}
                    className="p-1.5 text-purple-400/60 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Sweet Love Note Wall / Board */}
      <div 
        className={`p-6 sm:p-7 rounded-3xl transition-all space-y-4 ${
          theme === 'dark'
            ? 'glass-dark border border-purple-800/20'
            : 'glass-light border border-purple-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pink-500/20 text-pink-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Room Love Wall</h2>
              <p className="text-[11px] text-purple-400/80">Leave sweet sticky notes for each other</p>
            </div>
          </div>

          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              theme === 'dark'
                ? 'btn-matte-dark text-white'
                : 'btn-matte-light text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin a Note</span>
          </button>
        </div>

        {/* Note input form */}
        {showNoteForm && (
          <form 
            onSubmit={handleAddNote}
            className={`p-4 rounded-2xl border space-y-3 animate-in fade-in ${
              theme === 'dark'
                ? 'bg-purple-950/30 border-purple-700/40'
                : 'bg-purple-50/70 border-purple-200'
            }`}
          >
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder={`Write something lovely for ${partnerName}... ❤️`}
              rows={3}
              required
              className={`w-full p-3 rounded-xl text-xs outline-none resize-none ${
                theme === 'dark'
                  ? 'bg-purple-900/60 text-white border border-purple-700/50'
                  : 'bg-white text-purple-900 border border-purple-300'
              }`}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-purple-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  theme === 'dark' ? 'btn-matte-dark text-white' : 'btn-matte-light text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
                <span>Pin on Wall</span>
              </button>
            </div>
          </form>
        )}

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {(!roomSchedule.loveNotes || roomSchedule.loveNotes.length === 0) ? (
            <div className="col-span-full text-center py-8 text-xs text-purple-400">
              The love wall is empty! Write your first sweet message together! 💌
            </div>
          ) : (
            roomSchedule.loveNotes.map((note) => {
              const isMine = note.author?.toLowerCase() === username.toLowerCase();
              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-2xl relative border flex flex-col justify-between transition-all group ${
                    isMine
                      ? theme === 'dark'
                        ? 'bg-gradient-to-br from-purple-950/60 to-purple-900/30 border-purple-700/40'
                        : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
                      : theme === 'dark'
                      ? 'bg-gradient-to-br from-pink-950/60 to-purple-950/30 border-pink-700/40'
                      : 'bg-gradient-to-br from-pink-50 to-white border-pink-200'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium leading-relaxed mb-3">
                    "{note.text}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-purple-500/10">
                    <span className="font-semibold text-pink-400">
                      — {note.author} {note.timestamp && `(${note.timestamp})`}
                    </span>
                    <button
                      onClick={() => deleteLoveNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-purple-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
