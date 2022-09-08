const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = 3001;
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
  console.log(`User connected`);
  socket.emit('connection', null); // Send message to frontend

  socket.on('join_room', (data) => {
    socket.join(data.room);

    socket.emit('receive_message', {
      username: 'Bot',
      msg: `Welcome ${data.username}, to the ${data.room} chat room!`,
    });

    socket.broadcast.to(data.room).emit('receive_message', {
      username: 'Bot',
      msg: `${data.username} has joined the chat!`,
    });
  });

  socket.on('typing', (data) => {
    // Send username typing to client
    console.log(data);
    socket.broadcast.to(data.room).emit('typing', data);
  });

  // Receive message from client, and send it back
  socket.on('send_message', (data) => {
    console.log(data);
    io.to(data.room).emit('receive_message', data); // send to all in room
  });

  socket.on('disconnect', (data) => {
    console.log(`UserID: ${socket.id} left room: ${data}`);
  });
});

server.listen(PORT, (err) => {
  console.log(`Server running on ${PORT}`);
});
