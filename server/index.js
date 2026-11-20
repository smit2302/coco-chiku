import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory sync store (No database needed, fallback sync while server is running)
const memorySyncStore = {};
const activeUsers = {}; // socket.id -> { username, partnerName, pairKey }

function getPairKey(user1, user2) {
  if (!user1 || !user2) return null;
  return [user1.trim().toLowerCase(), user2.trim().toLowerCase()].sort().join('___');
}

// REST API
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', app: 'Coco & Chiku Couple App', time: new Date() });
});

app.get('/api/sync/:pairKey', (req, res) => {
  const { pairKey } = req.params;
  const data = memorySyncStore[pairKey] || null;
  res.json({ success: true, data });
});

app.post('/api/sync/:pairKey', (req, res) => {
  const { pairKey } = req.params;
  const { data } = req.body;
  if (data) {
    memorySyncStore[pairKey] = {
      ...memorySyncStore[pairKey],
      ...data,
      lastUpdated: new Date().toISOString()
    };
  }
  res.json({ success: true, stored: memorySyncStore[pairKey] });
});

// Socket.io Real-time Event Handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-partner', ({ username, partnerName }) => {
    if (!username || !partnerName) return;
    const pairKey = getPairKey(username, partnerName);
    activeUsers[socket.id] = { username, partnerName, pairKey };

    socket.join(pairKey);
    console.log(`[Socket] ${username} joined pair room: ${pairKey}`);

    // Check if partner is already in room
    const clientsInRoom = io.sockets.adapter.rooms.get(pairKey);
    const partnerOnline = clientsInRoom && clientsInRoom.size > 1;

    // Send current stored state if exists
    if (memorySyncStore[pairKey]) {
      socket.emit('initial-sync', memorySyncStore[pairKey]);
    }

    // Broadcast partner online status
    io.to(pairKey).emit('partner-status-change', {
      pairKey,
      onlineUsers: Array.from(clientsInRoom || []).map(id => activeUsers[id]?.username).filter(Boolean),
      isPartnerConnected: partnerOnline
    });
  });

  // When either partner updates tasks, room timings, or relationship date
  socket.on('sync-update', ({ pairKey, data, sender }) => {
    if (!pairKey) return;
    memorySyncStore[pairKey] = {
      ...(memorySyncStore[pairKey] || {}),
      ...data,
      lastUpdated: new Date().toISOString(),
      lastSender: sender
    };

    // Broadcast to the other partner in room
    socket.to(pairKey).emit('remote-update', {
      data,
      sender,
      timestamp: new Date().toISOString()
    });
  });

  // Cute interactive actions (hugs, kisses, love alerts)
  socket.on('send-love-action', ({ pairKey, sender, actionType, message }) => {
    if (!pairKey) return;
    socket.to(pairKey).emit('love-action-received', {
      sender,
      actionType,
      message,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    const user = activeUsers[socket.id];
    if (user && user.pairKey) {
      const pairKey = user.pairKey;
      delete activeUsers[socket.id];
      const clientsInRoom = io.sockets.adapter.rooms.get(pairKey);
      const partnerOnline = clientsInRoom && clientsInRoom.size > 0;

      io.to(pairKey).emit('partner-status-change', {
        pairKey,
        onlineUsers: Array.from(clientsInRoom || []).map(id => activeUsers[id]?.username).filter(Boolean),
        isPartnerConnected: partnerOnline
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

// Serve frontend in production if built
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Coco-Chiku Couple Server running on http://localhost:${PORT}`);
});
