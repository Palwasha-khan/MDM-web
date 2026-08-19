import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useState } from "react";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { admin } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!admin) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

   if (!socketRef.current) {
      // 1. Safe extraction of base domain without trailing /api
      const rawUrl = import.meta.env.VITE_API_URL || "https://mdm-backend-production-4db1.up.railway.app/api";
      const socketUrl = rawUrl.replace(/\/api\/?$/, "");

      // 2. Initialize Socket instance
      const socketInstance = io(socketUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketRef.current = socketInstance;
      setSocket(socketInstance);
    }

    return () => {
      // Persists across page navigation while logged in
    };
    }, [admin]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}