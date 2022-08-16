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

// Run when client connect
io.on('connection', (socket) => {
  const user = userJoin;
});
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
