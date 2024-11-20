/**
 * Codigo del server, lo deje lo mas minimo que pude
 * NO TIENE UI, ENTONCES EL UNICO DEBUGGING ES POR CONSOLE MESSAGES
 * basicamente cumple la funcion de un api y los endpoints son los io.on(<endpoint>)'
 * Esto se tiene que deployear con ngorok, puede que se pueda deployear a algun lado, pero no se como
 */

const { Server } = require('socket.io');

const io = new Server({
  connectionStateRecovery: {},
  cors: {
    origin: "*"
  }
});
const PORT = process.env.PORT || 3000; 

let users = new Map(); 
let assasins = new Map();
var assignedAssasin = false; 

function createNewUser (socketId, username) {
  users.set(socketId, username);
  return socketId;
}

function deleteUser (socketId) {
  users.delete(socketId);
}


io.on('connection', (socket) => { // creo que todo tiene que ir adentro de esta funcion
  //console.log(socket.request.headers['user-agent']);
  socket.on('chat message', (msg) => {
    //console.log(msg);
    socket.emit('mensaje', msg);
  });

  socket.on('join_game', (username) => {
    //console.log("User: " + username + " joined");
    io.to(socket.id).emit('join_game', createNewUser(socket.id, username));
    //console.log(users);
  });

  socket.on('direccion', (direccion) => {
    //console.log('direccion: ', direccion);
    if(assasins.get(socket.id) != undefined) {
      io.emit('assassin_direccion', direccion);
    }
    else
      io.emit('direccion', direccion);
  });

  socket.on('disconnect', () => {
    deleteUser(socket.id);
    //console.log(users);
  });

  socket.on('update', (data) => {
    //console.log(data);
    io.emit('update', data); 
  });

  socket.on('startgame', (data) => {
    //console.log(data);
    // TODO: ASSIGN KILLERS
    if(assignedAssasin) {
      // TODO: EMIT CAMBIO DE GAMESTATE AL UI
    }
    else {
      assignedAssasin=true;
      let num = Math.floor(Math.random() * users.size);
      //console.log(num);
      users.forEach((val, key) => {
        if(num == 0) {
          assasins.set(key, val);
          users.delete(key);
          io.to(key).emit('assassin');
        }
        num--; 
      });
      io.emit('startgame', data);
    }
    console.log(users);
    console.log(assasins);
  });

  socket.on('endgame', (survivor_win) => {
    //console.log(assasins);
    assignedAssasin=false;
    assasins.forEach((val, key) => {
      users.set(key, val);
    })
    assasins.clear(); 
    io.emit('endgame', survivor_win);
  })
});

io.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});