const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = 3001;
const { Server } = require('socket.io');
const {
  addUser,
  addUserToRoom,
  removeUserFromRoom,
} = require('./utils/userlist');
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// const userList = [];

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

    // Add new user to user list
    // userList.push({ username: data.username, room: data.room });
    // console.log('userList:', userList);
    addUser(socket.id, data.username, data.room);

    let onlineUsers = addUserToRoom(data.room);
    // Send user list to frontend
    io.to(data.room).emit('user_list', onlineUsers);

    socket.on('disconnect', () => {
      const removedUser = removeUserFromRoom(socket.id);
      io.to(data.room).emit('receive_message', {
        username: 'Bot',
        msg: `${data.username} has left the chat!`,
      });

      onlineUsers = addUserToRoom(data.room);
      io.to(data.room).emit('user_list', onlineUsers);
      console.log('Online users', onlineUsers);
    });
  });

  // Receive message from client, and send it back
  socket.on('send_message', (data) => {
    console.log(data);
    io.to(data.room).emit('receive_message', data); // send to all in room
  });

  socket.on('typing', (data) => {
    // Send username typing to client

    console.log(data.username, 'is typing...');
    socket.broadcast.to(data.room).emit('typing', data);
  });
});

server.listen(PORT, (err) => {
  console.log(`Server running on ${PORT}`);
});
