const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = 3001 || process.env.PORT;
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Listen for events
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`UserID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`UserID: ${socket.id} left room: ${data}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
