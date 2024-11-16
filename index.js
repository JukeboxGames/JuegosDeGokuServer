const express = require('express');
const http = require('http');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.write(`<h1>Socket started on port : ${PORT}<h1>`);
  res.end(); 
});

io.on('connection', (socket) => {
  console.log(socket.request.headers['user-agent']);
  socket.on('chat message', (msg, client_) => {
    console.log("chat  message: ", msg);
    io.emit('chat message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});