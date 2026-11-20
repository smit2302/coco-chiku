import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  Trash2, 
  Check, 
  Heart, 
  Sparkles, 
  UserCheck, 
  Send,
  AlertCircle,
  PartyPopper
} from 'lucide-react';
import { useCouple } from '../context/CoupleContext';
import { formatTime12h } from '../utils/dateUtils';
import { triggerLoveConfetti } from '../utils/confetti';

export const EverydayTaskPage = () => {
  const { 
    theme, 
    tasks, 
    addTask, 
    toggleTask, 
    deleteTask, 
    username, 
    partnerName,
    sendLoveAction 
  } = useCouple();

  // Active view: 'my_tasks' | 'given_tasks' | 'all'
  const [activeTab, setActiveTab] = useState('my_tasks');
  const [showAddForm, setShowAddForm] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [assignedTo, setAssignedTo] = useState(username); // by default assigned to me or partner

  // Categorize tasks
  // "My Tasks": tasks where assignedTo === username (or assignedTo === 'me')
  const myTasks = tasks.filter(t => t.assignedTo?.toLowerCase() === username.toLowerCase());
  // "Given Tasks": tasks created by me for partner, or where assignedTo === partnerName
  const givenTasks = tasks.filter(t => t.assignedTo?.toLowerCase() === partnerName.toLowerCase());

  const displayedTasks = activeTab === 'my_tasks' ? myTasks : activeTab === 'given_tasks' ? givenTasks : tasks;

  // Completion calculation for currently viewed section
  const currentTotal = displayedTasks.length;
  const currentCompleted = displayedTasks.filter(t => t.completed).length;
  const allCompleted = currentTotal > 0 && currentCompleted === currentTotal;
  const hasIncomplete = currentTotal > 0 && currentCompleted < currentTotal;
  const pendingCount = currentTotal - currentCompleted;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      time,
      assignedTo,
      createdBy: username,
    });

    if (assignedTo === partnerName) {
      sendLoveAction('heart', `${username} gave a new task to ${partnerName}: "${title.trim()}" 📝💖`);
    }

    setTitle('');
    setShowAddForm(false);
  };

  const handleToggle = (taskId, wasCompleted) => {
    toggleTask(taskId);
    if (!wasCompleted) {
      // If completing the task, check if this was the last one
      const remaining = displayedTasks.filter(t => !t.completed && t.id !== taskId).length;
      if (remaining === 0) {
        triggerLoveConfetti();
        sendLoveAction('heart', `${username} completed all everyday tasks! 🎉💖`);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 sm:pb-8">
      {/* Page Header */}
      <div 
        className={`p-6 sm:p-8 rounded-3xl transition-all ${
          theme === 'dark'
            ? 'glass-dark-card border border-purple-500/30'
            : 'glass-light-card border border-purple-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-pink-400 mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Daily Routine & Promises</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Everyday Tasks
            </h1>
            <p className="text-xs sm:text-sm text-purple-300/80 mt-1">
              Add custom tasks with timings, assign them to each other, and keep daily love goals alive!
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${
              theme === 'dark'
                ? 'btn-matte-dark text-white'
                : 'btn-matte-light text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Add New Task'}</span>
          </button>
        </div>
      </div>

      {/* Completion Status Alert (User's specific requirement: Congratulations vs Heartbreak 💔) */}
      <div 
        className={`p-5 sm:p-6 rounded-3xl transition-all border ${
          allCompleted
            ? 'bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : hasIncomplete
            ? 'bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-rose-950/40 border-rose-500/50 text-rose-200'
            : 'bg-purple-950/20 border-purple-800/30 text-purple-300'
        }`}
      >
        {allCompleted ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500/20 border border-emerald-400/40 text-3xl animate-bounce">
              🎉
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <PartyPopper className="w-4 h-4" />
                <span>Task Master Milestone</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-emerald-300 mt-0.5">
                Congratulations! You Done It! 🎉💖
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
                All {currentTotal} tasks are complete! You are doing amazing, your partner is super proud of you!
              </p>
            </div>
            <button
              onClick={() => {
                triggerLoveConfetti();
                sendLoveAction('kiss');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shrink-0"
            >
              Celebrate More! 🎊
            </button>
          </div>
        ) : hasIncomplete ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-rose-500/20 border border-rose-400/40 text-3xl animate-pulse">
              💔
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <AlertCircle className="w-4 h-4" />
                <span>Pending Tasks Alert</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-rose-300 mt-0.5">
                {pendingCount} Tasks Pending 💔
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/80 mt-1">
                Don't break my heart! Let's finish your daily tasks together and make it a 100% day!
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-full sm:w-32 text-center shrink-0">
              <span className="text-xs font-bold text-rose-400">
                {Math.round((currentCompleted / currentTotal) * 100)}% Completed
              </span>
              <div className="w-full h-2 rounded-full bg-rose-950/60 overflow-hidden mt-1 border border-rose-800/40">
                <div 
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${(currentCompleted / currentTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-sm text-purple-300">
            No tasks listed yet. Click <strong>"Add New Task"</strong> to set your first goal together! ✨
          </div>
        )}
      </div>

      {/* Task Creation Form (Collapsible) */}
      {showAddForm && (
        <div 
          className={`p-6 rounded-3xl transition-all border animate-in slide-in-from-top-4 duration-300 ${
            theme === 'dark'
              ? 'glass-dark border-purple-500/40'
              : 'glass-light border-purple-300'
          }`}
        >
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-pink-400" />
            <span>Create a New Everyday Task</span>
          </h2>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-purple-300">
                Task Description / Goal
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Drink 2L water, Study 1hr, Call at lunch, Take vitamins"
                required
                className={`w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-purple-950/40 border border-purple-700/50 text-white focus:border-pink-500'
                    : 'bg-white border border-purple-300 text-purple-900 focus:border-purple-600'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Task Timing */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-purple-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  <span>Task Timing</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-purple-950/40 border border-purple-700/50 text-white'
                      : 'bg-white border border-purple-300 text-purple-900'
                  }`}
                />
              </div>

              {/* Who is this task for? (Give task to partner vs for me) */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-purple-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-pink-400" />
                  <span>Assign To</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignedTo(username)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border ${
                      assignedTo.toLowerCase() === username.toLowerCase()
                        ? theme === 'dark'
                          ? 'btn-matte-dark text-white border-purple-400'
                          : 'btn-matte-light text-white'
                        : theme === 'dark'
                        ? 'bg-purple-950/30 text-purple-300 border-purple-800/40'
                        : 'bg-purple-50 text-purple-800 border-purple-200'
                    }`}
                  >
                    My Task ({username})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignedTo(partnerName)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border ${
                      assignedTo.toLowerCase() === partnerName.toLowerCase()
                        ? theme === 'dark'
                          ? 'btn-matte-dark text-white border-pink-400'
                          : 'btn-matte-light text-white'
                        : theme === 'dark'
                        ? 'bg-purple-950/30 text-purple-300 border-purple-800/40'
                        : 'bg-purple-50 text-purple-800 border-purple-200'
                    }`}
                  >
                    Give to {partnerName} 💖
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-2xl text-xs font-medium text-purple-300 hover:bg-purple-900/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'btn-matte-dark text-white'
                    : 'btn-matte-light text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Task</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Navigation Tabs (My Tasks vs Given Tasks vs All) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-purple-950/30 dark:bg-black/30 border border-purple-500/20 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('my_tasks')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'my_tasks'
              ? theme === 'dark'
                ? 'btn-matte-dark text-white shadow-md'
                : 'btn-matte-light text-white'
              : 'text-purple-300/80 hover:text-white'
          }`}
        >
          <span>My Tasks</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20">
            {myTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('given_tasks')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'given_tasks'
              ? theme === 'dark'
                ? 'btn-matte-dark text-white shadow-md'
                : 'btn-matte-light text-white'
              : 'text-purple-300/80 hover:text-white'
          }`}
        >
          <span>Given to {partnerName}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-500/20">
            {givenTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? theme === 'dark'
                ? 'btn-matte-dark text-white shadow-md'
                : 'btn-matte-light text-white'
              : 'text-purple-300/80 hover:text-white'
          }`}
        >
          All ({tasks.length})
        </button>
      </div>

      {/* Task Items List */}
      <div className="space-y-3">
        {displayedTasks.length === 0 ? (
          <div 
            className={`text-center py-12 px-6 rounded-3xl border border-dashed ${
              theme === 'dark'
                ? 'border-purple-800/40 text-purple-400/80'
                : 'border-purple-200 text-purple-600'
            }`}
          >
            <div className="text-4xl mb-3">📝✨</div>
            <h3 className="font-bold text-base">No tasks in this list yet!</h3>
            <p className="text-xs text-purple-400 mt-1 max-w-sm mx-auto">
              Add your daily promises, habits, or sweet challenges to make each day special!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-pink-400 border border-purple-500/30 transition-all"
            >
              + Create First Task
            </button>
          </div>
        ) : (
          displayedTasks.map((task) => {
            const isCompleted = task.completed;
            const isForMe = task.assignedTo?.toLowerCase() === username.toLowerCase();

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 flex items-center justify-between gap-4 border ${
                  isCompleted
                    ? theme === 'dark'
                      ? 'bg-purple-950/20 border-purple-900/30 opacity-70'
                      : 'bg-purple-50/60 border-purple-200 opacity-70'
                    : theme === 'dark'
                    ? 'glass-dark-card border-purple-800/30 hover:border-purple-500/50'
                    : 'glass-light-card border-purple-200 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => handleToggle(task.id, isCompleted)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : theme === 'dark'
                        ? 'border-2 border-purple-600 hover:border-pink-500 bg-purple-950/50'
                        : 'border-2 border-purple-300 hover:border-purple-600 bg-white'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <p 
                      className={`text-sm sm:text-base font-semibold leading-snug truncate ${
                        isCompleted
                          ? 'line-through text-purple-400/60'
                          : theme === 'dark'
                          ? 'text-purple-100'
                          : 'text-purple-950'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                      {/* Timing Badge */}
                      {task.time && (
                        <span className="inline-flex items-center gap-1 text-purple-400 font-medium">
                          <Clock className="w-3 h-3 text-pink-400" />
                          {formatTime12h(task.time)}
                        </span>
                      )}

                      {/* Assigned badge */}
                      <span 
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          isForMe
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                            : 'bg-pink-500/15 text-pink-300 border border-pink-500/20'
                        }`}
                      >
                        {isForMe ? `For ${username}` : `Given to ${task.assignedTo}`}
                      </span>

                      {task.createdBy && task.createdBy !== task.assignedTo && (
                        <span className="text-purple-400/70">
                          (from {task.createdBy})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                  className="p-2 rounded-xl text-purple-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
