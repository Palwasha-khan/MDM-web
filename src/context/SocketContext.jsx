import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { admin } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!admin) {
      // Logged out - make sure any existing connection is closed
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Only create ONE socket connection for the entire admin session,
    // regardless of how many pages get mounted/unmounted while navigating
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
        withCredentials: true,
      });
    }

    return () => {
      // Deliberately NOT disconnecting here - this cleanup runs on every
      // navigation/re-render, and we want the connection to persist across
      // pages. Real disconnect only happens above, when admin becomes null.
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