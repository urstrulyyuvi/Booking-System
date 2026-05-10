import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const SocketContext = createContext(null);
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const s = io('https://expert-booking-system-28hk.onrender.com', { transports: ['websocket', 'polling'] });
    setSocket(s);
    return () => s.disconnect();
  }, []);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
export const useSocket = () => useContext(SocketContext);
