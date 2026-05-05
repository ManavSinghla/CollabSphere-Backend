const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

connectDB();

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

// Routes
app.use('/api/auth', authRoutes);
const workspaceRoutes = require('./routes/workspaceRoutes');
const channelRoutes = require('./routes/channelRoutes');
const messageRoutes = require('./routes/messageRoutes');
const documentRoutes = require('./routes/documentRoutes');

app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);

const Message = require('./models/Message');

// Socket.io for Real-Time Chat
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
    console.log(`User joined channel: ${channelId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const newMessage = await Message.create({
        channelId: data.channelId,
        senderId: data.senderId,
        text: data.text
      });
      const populatedMessage = await newMessage.populate('senderId', 'name avatar');
      io.to(data.channelId).emit('receive_message', populatedMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Document Collaboration
  socket.on('join_document', (documentId) => {
    socket.join(documentId);
    console.log(`User joined document: ${documentId}`);
  });

  socket.on('send_document_changes', (data) => {
    socket.to(data.documentId).emit('receive_document_changes', data.content);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
