const { createServer } = require('node:http');
const { Server } = require('socket.io');

const server = createServer();
const io = new Server({
  connectionStateRecovery: {},
  cors: {
    origin: "*"
  }
});
const PORT = process.env.PORT || 3000; 

io.on('connection', (socket) => {
  console.log(socket.request.headers['user-agent']);
  socket.on('chat message', (msg, client_) => {
    console.log("chat  message: ", msg);
    io.emit('chat message', msg);
  });
});

io.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});