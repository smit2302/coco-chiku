import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const CoupleContext = createContext(null);

const STORAGE_KEYS = {
  THEME: 'coco_theme',
  USER: 'coco_username',
  PARTNER: 'coco_partner_name',
  RELATION_DATE: 'coco_relation_date',
  TASKS: 'coco_tasks',
  ROOM_SCHEDULE: 'coco_room_schedule',
};

// Initial default tasks for Coco & Chiku
const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Morning sweet good morning message 💖',
    time: '08:30',
    assignedTo: 'Coco',
    createdBy: 'Chiku',
    completed: true,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'task-2',
    title: 'Drink 2 glasses of water & take breakfast 🍳',
    time: '09:30',
    assignedTo: 'Chiku',
    createdBy: 'Coco',
    completed: false,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'task-3',
    title: 'Study / Work focus session (2 hrs) 📚',
    time: '14:00',
    assignedTo: 'Coco',
    createdBy: 'Chiku',
    completed: false,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'task-4',
    title: 'Evening walk & fresh air 🌿',
    time: '18:00',
    assignedTo: 'Chiku',
    createdBy: 'Coco',
    completed: false,
    date: new Date().toISOString().split('T')[0]
  }
];

const DEFAULT_ROOM_SCHEDULE = {
  freeSlots: [
    {
      id: 'free-1',
      person: 'Coco',
      fromTime: '13:30',
      toTime: '15:00',
      note: 'Lunch break & free to chat 💬'
    },
    {
      id: 'free-2',
      person: 'Chiku',
      fromTime: '19:00',
      toTime: '21:00',
      note: 'Finished college, chilling in room 🛋️'
    }
  ],
  callSlots: [
    {
      id: 'call-1',
      title: 'Our Night Sweet Call 🌙📞',
      time: '22:30',
      callType: 'Video Call',
      notes: 'Must talk about our day!'
    }
  ],
  loveNotes: [
    {
      id: 'note-1',
      author: 'Coco',
      text: 'Always remember I am super proud of you! Keep smiling ❤️',
      timestamp: 'Today'
    }
  ]
};

export const CoupleProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  });

  // User Profile
  const [username, setUsername] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.USER) || 'Coco';
  });

  const [partnerName, setPartnerName] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PARTNER) || 'Chiku';
  });

  // Relationship Start Date (defaults to 100 days ago for lovely demo, or user can set!)
  const [relationStartDate, setRelationStartDate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RELATION_DATE);
    if (saved) return saved;
    const d = new Date();
    d.setDate(d.getDate() - 120);
    return d.toISOString().split('T')[0];
  });

  // Tasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved tasks', e);
      }
    }
    return DEFAULT_TASKS;
  });

  // Room Schedule & Notes
  const [roomSchedule, setRoomSchedule] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOM_SCHEDULE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved room schedule', e);
      }
    }
    return DEFAULT_ROOM_SCHEDULE;
  });

  // Real-time Socket state
  const [isPartnerConnected, setIsPartnerConnected] = useState(false);
  const [loveToast, setLoveToast] = useState(null);
  const socketRef = useRef(null);

  // Sync Pair Key
  const pairKey = [username.trim().toLowerCase(), partnerName.trim().toLowerCase()].sort().join('___');

  // Theme effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist local state whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARTNER, partnerName);
  }, [partnerName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RELATION_DATE, relationStartDate);
  }, [relationStartDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOM_SCHEDULE, JSON.stringify(roomSchedule));
  }, [roomSchedule]);

  // Setup Socket.io for Real-time pairing & sync
  useEffect(() => {
    const socketUrl = window.location.port === '3000' ? 'http://localhost:5000' : window.location.origin;
    const socket = io(socketUrl, {
      reconnectionAttempts: 5,
      timeout: 3000,
      autoConnect: true
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to sync server');
      socket.emit('join-partner', { username, partnerName });
    });

    socket.on('partner-status-change', (data) => {
      setIsPartnerConnected(Boolean(data.isPartnerConnected));
    });

    socket.on('initial-sync', (remoteData) => {
      if (remoteData?.tasks) setTasks(remoteData.tasks);
      if (remoteData?.roomSchedule) setRoomSchedule(remoteData.roomSchedule);
      if (remoteData?.relationStartDate) setRelationStartDate(remoteData.relationStartDate);
    });

    socket.on('remote-update', ({ data, sender }) => {
      if (data.tasks) setTasks(data.tasks);
      if (data.roomSchedule) setRoomSchedule(data.roomSchedule);
      if (data.relationStartDate) setRelationStartDate(data.relationStartDate);
    });

    socket.on('love-action-received', ({ sender, actionType, message }) => {
      setLoveToast({
        id: Date.now(),
        sender,
        actionType,
        message
      });
      setTimeout(() => {
        setLoveToast(null);
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [username, partnerName]);

  // Sync to partner function
  const broadcastSync = (partialData) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sync-update', {
        pairKey,
        sender: username,
        data: partialData
      });
    }
  };

  // Actions
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateProfile = (newUserName, newPartnerName) => {
    setUsername(newUserName);
    setPartnerName(newPartnerName);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('join-partner', {
        username: newUserName,
        partnerName: newPartnerName
      });
    }
  };

  const updateRelationDate = (dateStr) => {
    setRelationStartDate(dateStr);
    broadcastSync({ relationStartDate: dateStr });
  };

  // Tasks actions
  const addTask = (task) => {
    const newTask = {
      id: `task-${Date.now()}`,
      completed: false,
      date: new Date().toISOString().split('T')[0],
      ...task
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    broadcastSync({ tasks: updated });
  };

  const toggleTask = (taskId) => {
    const updated = tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    broadcastSync({ tasks: updated });
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    broadcastSync({ tasks: updated });
  };

  // Room Schedule actions
  const addFreeSlot = (slot) => {
    const newSlot = {
      id: `free-${Date.now()}`,
      ...slot
    };
    const updated = {
      ...roomSchedule,
      freeSlots: [...(roomSchedule.freeSlots || []), newSlot]
    };
    setRoomSchedule(updated);
    broadcastSync({ roomSchedule: updated });
  };

  const deleteFreeSlot = (id) => {
    const updated = {
      ...roomSchedule,
      freeSlots: (roomSchedule.freeSlots || []).filter(s => s.id !== id)
    };
    setRoomSchedule(updated);
    broadcastSync({ roomSchedule: updated });
  };

  const addCallSlot = (call) => {
    const newCall = {
      id: `call-${Date.now()}`,
      ...call
    };
    const updated = {
      ...roomSchedule,
      callSlots: [...(roomSchedule.callSlots || []), newCall]
    };
    setRoomSchedule(updated);
    broadcastSync({ roomSchedule: updated });
  };

  const deleteCallSlot = (id) => {
    const updated = {
      ...roomSchedule,
      callSlots: (roomSchedule.callSlots || []).filter(c => c.id !== id)
    };
    setRoomSchedule(updated);
    broadcastSync({ roomSchedule: updated });
  };

  const addLoveNote = (text) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: username,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = {
      ...roomSchedule,
      loveNotes: [newNote, ...(roomSchedule.loveNotes || [])]
    };
    setRoomSchedule(updated);
    broadcastSync({ roomSchedule: updated });
  };

  const deleteLoveNote = (id) => {
    const updated = {
      ...roomSchedule,
      loveNotes: (roomSchedule.loveNotes || []).filter(n => n.id !== id)
    };
    setRoomSchedule(updated);
    broadcastSync({ roomSchedule: updated });
  };

  // Cute interactive actions (hugs, kisses, etc.)
  const sendLoveAction = (actionType, customMsg) => {
    const messages = {
      kiss: `${username} sent you a warm, sweet kiss! 💋✨`,
      hug: `${username} gave you a tight cozy hug! 🫂💖`,
      heart: `${username}'s heart skipped a beat for you! 💓`,
      missYou: `${username} is missing you so much right now! 🥺💕`
    };
    const message = customMsg || messages[actionType] || `${username} sent you lots of love! 💖`;

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send-love-action', {
        pairKey,
        sender: username,
        actionType,
        message
      });
    }

    // Show self-feedback toast as well
    setLoveToast({
      id: Date.now(),
      sender: 'You',
      actionType,
      message: `You sent ${actionType === 'kiss' ? 'a Kiss 💋' : actionType === 'hug' ? 'a Hug 🫂' : 'Love 💖'} to ${partnerName}!`
    });
    setTimeout(() => {
      setLoveToast(null);
    }, 3500);
  };

  return (
    <CoupleContext.Provider
      value={{
        theme,
        toggleTheme,
        username,
        partnerName,
        updateProfile,
        relationStartDate,
        updateRelationDate,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        roomSchedule,
        addFreeSlot,
        deleteFreeSlot,
        addCallSlot,
        deleteCallSlot,
        addLoveNote,
        deleteLoveNote,
        isPartnerConnected,
        sendLoveAction,
        loveToast,
        setLoveToast,
        pairKey
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};
