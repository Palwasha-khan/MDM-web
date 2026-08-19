import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { io } from "socket.io-client";
import axiosClient from "../api/axiosClient";

export const usePendingCount = () => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: ["pendingCount"],
    queryFn: async () => {
      const res = await axiosClient.get("/device/pending-count");
      return res.data.count;
    },
    refetchInterval: 30000,  
  });
 
 useEffect(() => {
    if (!socket) return;

    const handleNewRequest = () => {
      queryClient.invalidateQueries({ queryKey: ["pendingCount"] });
    };
 
    socket.on("new-device-request", handleNewRequest);
 
    return () => {
      socket.off("new-device-request", handleNewRequest);
    };
  }, [socket, queryClient]);

  return query;
};