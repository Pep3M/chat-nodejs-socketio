import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    // origin: 'http://localhost:5173',
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('User connected');

  let lastMessage = '';

  socket.on('join-room', (room) => {
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('send-message', (msg, room, callback) => {
    console.log('Message received:', msg);
    lastMessage = msg; 
    io.to(room).emit('receive-message', {
      ...lastMessage,
      id: Math.random(),
    });
    callback({ success: true });
  });

  socket.on('get-last-message', (room, callback) => {
    callback(lastMessage);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});