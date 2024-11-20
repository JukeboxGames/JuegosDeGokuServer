import React, { useEffect, useState } from 'react';
import { socket } from './socket';

/**
 * socket.emit() -> manda mensaje al server
 * socket.on() -> recibe mensaje del server
 * siempre refresca la pantalla antes de testing, 
 * si solo compilas se suscribe varias veces al evento y se multiplica
 */


export default function ap2() {
  const [SocketId, setSocketId] = useState();
  const [Username, setUsername] = useState("");
  const [isAssassin, setAssassin] = useState(false);
  const [isConnected, setConnected] = useState(socket.connected);

  const divs = [
    { value: '', isButton: false, },
    { value: 1, isButton: true, picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Eo_circle_green_arrow-up.svg/1024px-Eo_circle_green_arrow-up.svg.png' },
    { value: '', isButton: false },
    { value: 2, isButton: true },
    { value: '', isButton: false },
    { value: 3, isButton: true },
    { value: '', isButton: false },
    { value: 4, isButton: true },
    { value: '', isButton: false },
  ];

  const SendDirection = (dir) => {
    socket.emit('direccion', dir);
  }

  useEffect(() => {
    //TODO: encontrar una buena forma de recibir mensajes
    // De esta forma por alguna razon lo recibe doble
    socket.on('join_game', (sId) => {
      console.log("ola", sId);
      setSocketId(sId);
    });

    socket.on('assassin', () => {
      setAssassin(true);
    })

  }, [])

  return (
    <div className="App">
      <h1>
        {!SocketId && (
          <div>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            >
            </input>
            <button onClick={() => {
              socket.connect();
              socket.emit('join_game', Username); // No checa por usernames repetidos lol(no importa porque de todos modos tiene id)
              setConnected(true);
            }}>
              Connect
            </button>
          </div>

        )}
        {SocketId &&
          <div>
            <div style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>
                <h1>
                  Bienvenido {Username} {SocketId}
                </h1>
              </div>
              {
                isAssassin && (
                  <div style={{ width: '100%' }}>
                    <h1>
                      Tu eres el asesino
                    </h1>
                  </div>
                )}
            </div>
            <div style={{ width: '100%' }}>
              <button style={{ width: '100px', height: '40px', margin: '5px' }} onClick={() => { SendDirection(1) }}>
                Arriba
              </button>
              <button style={{ width: '100px', height: '40px', margin: '5px' }} onClick={() => { SendDirection(3) }}>
                Abajo
              </button>
              <button style={{ width: '100px', height: '40px', margin: '5px' }} onClick={() => { SendDirection(4) }}>
                Izquierda
              </button>
              <button style={{ width: '100px', height: '40px', margin: '5px' }} onClick={() => { SendDirection(2) }}>
                Derecha
              </button>
            </div>
            <div>
              <button style={{ width: '100px', height: '40px', margin: '5px' }} onClick={() => {
                console.log(socket);
                if (isConnected)
                  socket.disconnect();
                else {
                  socket.connect();
                  socket.emit('join_game', Username);
                }
                setConnected(!isConnected);
              }}>
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        }
      </h1>
    </div>
  );
}