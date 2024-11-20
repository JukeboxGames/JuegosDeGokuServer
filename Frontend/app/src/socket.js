import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://3818-131-178-102-140.ngrok-free.app';


// Uno de los problemas era el header que esta aqui
// ngorok por seguridad te bloquea la pagina, el header es para que no pase eso
export const socket = io(URL, {
  extraHeaders: {
    'ngrok-skip-browser-warning': 'connected'
  },
  autoConnect: false
});